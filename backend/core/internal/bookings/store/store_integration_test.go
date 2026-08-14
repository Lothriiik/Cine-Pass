package store

import (
	"context"
	"testing"
	"time"

	"github.com/StartLivin/screek/backend/internal/bookings"
	cinemastore "github.com/StartLivin/screek/backend/internal/cinema/store"
	moviestore "github.com/StartLivin/screek/backend/internal/movies/store"
	"github.com/StartLivin/screek/backend/internal/shared/testutil"
	userstore "github.com/StartLivin/screek/backend/internal/users/store"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func Test_Store_CreateReservation_Transaction(t *testing.T) {
	if testing.Short() {
		t.Skip("Pulando teste de integração de banco de dados")
	}
	db := testutil.SetupTestDB(t)
	require.NoError(t, cinemastore.AutoMigrate(db))
	require.NoError(t, moviestore.AutoMigrate(db))
	require.NoError(t, userstore.AutoMigrate(db))
	require.NoError(t, AutoMigrate(db))
	testutil.CleanupDB(t, db)

	store := NewStore(db)
	ctx := context.Background()

	movie := moviestore.MovieRecord{TMDBID: 101, Title: "Store Test", Runtime: 120}
	db.Create(&movie)
	cin := cinemastore.CinemaRecord{Name: "Cine Store", City: "Maceió"}
	db.Create(&cin)
	room := cinemastore.RoomRecord{CinemaID: cin.ID, Name: "Sala 1", Capacity: 50}
	db.Create(&room)
	session := cinemastore.SessionRecord{MovieID: movie.ID, RoomID: room.ID, StartTime: time.Now().Add(1 * time.Hour), Price: 3000}
	db.Create(&session)
	user := userstore.UserRecord{ID: uuid.New(), Username: "tester", Email: "t@t.com"}
	db.Create(&user)

	seat := cinemastore.SeatRecord{RoomID: room.ID, Row: "A", Number: 1, Type: "STANDARD"}
	require.NoError(t, db.Create(&seat).Error)

	tickets := []bookings.Ticket{
		{ID: uuid.New(), SessionID: session.ID, SeatID: &seat.ID, Type: "STANDARD", PricePaid: 3000, Status: "PENDING", QRCode: "qr123"},
	}

	t.Run("Erro no Checkout Limpa Transaction", func(t *testing.T) {
		tx, err := store.CreateReservation(ctx, user.ID, session.ID, tickets, 3000)
		assert.NoError(t, err)
		assert.NotNil(t, tx)

		var count int64
		db.Model(&TicketRecord{}).Where("transaction_id = ?", tx.ID).Count(&count)
		assert.Equal(t, int64(1), count)
	})
}

func Test_Store_CleanupExpired(t *testing.T) {
	if testing.Short() {
		t.Skip("Pulando teste de integração de banco de dados")
	}
	db := testutil.SetupTestDB(t)
	_ = db.Migrator().DropTable("tickets", "transactions")
	userstore.AutoMigrate(db)
	cinemastore.AutoMigrate(db)
	AutoMigrate(db)
	testutil.CleanupDB(t, db)
	store := NewStore(db)

	user := userstore.UserRecord{ID: uuid.New(), Username: "cleanup_user", Email: "c@c.com"}
	require.NoError(t, db.Create(&user).Error)

	oldTx := TransactionRecord{
		ID:     uuid.New(),
		UserID: user.ID,
		Status: "PENDING",
	}
	require.NoError(t, db.Create(&oldTx).Error)
	require.NoError(t, db.Model(&oldTx).UpdateColumn("created_at", time.Now().Add(-15*time.Minute)).Error)

	newTx := TransactionRecord{
		ID:        uuid.New(),
		UserID:    user.ID,
		Status:    "PENDING",
		CreatedAt: time.Now(),
	}
	require.NoError(t, db.Create(&newTx).Error)

	_, expired, err := store.CleanupExpiredReservations(context.Background())
	assert.NoError(t, err)
	assert.Equal(t, int64(1), expired)

	var check TransactionRecord
	err = db.First(&check, oldTx.ID).Error
	assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
}
