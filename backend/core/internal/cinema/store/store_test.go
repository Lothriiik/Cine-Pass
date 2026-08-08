package store_test

import (
	"context"
	"fmt"
	"testing"

	"github.com/StartLivin/screek/backend/internal/bookings"
	"github.com/StartLivin/screek/backend/internal/cinema"
	cinemastore "github.com/StartLivin/screek/backend/internal/cinema/store"
	"github.com/StartLivin/screek/backend/internal/movies"
	"github.com/StartLivin/screek/backend/internal/shared/testutil"
	"github.com/StartLivin/screek/backend/internal/users"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestStore_Integracao(t *testing.T) {
	if testing.Short() {
		t.Skip("Pulando teste de integração de banco de dados")
	}
	db := testutil.SetupTestDB(t)

	cinemastore.AutoMigrate(db)

	testutil.CleanupDB(t, db)
	store := cinemastore.NewStore(db)
	ctx := context.Background()

	t.Run("Gestão de Cinema e Sala", func(t *testing.T) {
		cin := &cinema.Cinema{Name: "Store Cinema", City: "Store City"}
		require.NoError(t, store.CreateCinema(ctx, cin))
		require.NotZero(t, cin.ID)

		userID := uuid.New()
		db.Create(&cinemastore.CinemaManagerRecord{UserID: userID, CinemaID: cin.ID})

		isManager, err := store.IsManagerOfCinema(ctx, userID, cin.ID)
		require.NoError(t, err)
		assert.True(t, isManager, "Deveria ser gerente")
	})

	t.Run("Ciclo de Vida da Sessão", func(t *testing.T) {
		cin2 := &cinema.Cinema{Name: "Sessao Cinema"}
		db.Create(cin2)
		room := &cinema.Room{CinemaID: cin2.ID, Name: "Sala Sessao"}
		db.Create(room)

		movie := movies.Movie{Title: "Movie A", TMDBID: 999}
		db.Create(&movie)

		session := &cinema.Session{
			MovieID: movie.ID,
			RoomID:  room.ID,
			Price:   1500,
		}

		require.NoError(t, store.CreateSession(ctx, session))
		require.NotZero(t, session.ID)

		count, err := store.GetSessionBookingsCount(ctx, session.ID)
		require.NoError(t, err)
		assert.Equal(t, 0, count)

		user := users.User{ID: uuid.New(), Email: "test@test.com", Username: "tester"}
		require.NoError(t, db.Create(&user).Error)

		tx := bookings.Transaction{ID: uuid.New(), UserID: user.ID, Status: bookings.TicketStatusPaid}
		require.NoError(t, db.Create(&tx).Error)
		ticket := bookings.Ticket{
			ID:            uuid.New(),
			TransactionID: tx.ID,
			SessionID:     session.ID,
			Status:        bookings.TicketStatusPaid,
			QRCode:        uuid.New().String(),
		}
		require.NoError(t, db.Create(&ticket).Error)

		count2, _ := store.GetSessionBookingsCount(ctx, session.ID)
		assert.Equal(t, 1, count2)

		db.Exec("DELETE FROM tickets WHERE session_id = ?", session.ID)
		db.Exec("DELETE FROM transactions WHERE id = ?", tx.ID)

		err = store.DeleteSession(ctx, session.ID)
		require.NoError(t, err)
	})

	t.Run("Limites de Capacidade da Sala (1 - 1000)", func(t *testing.T) {
		cin3 := &cinema.Cinema{Name: "Mega Cine", City: "SP"}
		db.Create(cin3)

		numSeats := 1000
		room := &cinema.Room{CinemaID: cin3.ID, Name: "Sala IMAX 1000", Capacity: numSeats}

		var seats []cinema.Seat
		for i := 1; i <= numSeats; i++ {
			seats = append(seats, cinema.Seat{
				Row:    fmt.Sprintf("%c", 'A'+(i/20)),
				Number: i % 20,
			})
		}

		err := store.CreateRoom(ctx, room, seats)
		require.NoError(t, err)
		assert.NotZero(t, room.ID)

		var count int64
		db.Model(&cinema.Seat{}).Where("room_id = ?", room.ID).Count(&count)
		assert.Equal(t, int64(numSeats), count)
	})
}
