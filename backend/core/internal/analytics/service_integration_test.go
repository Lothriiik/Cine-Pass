package analytics_test

import (
	"context"
	"testing"
	"time"

	"github.com/StartLivin/screek/backend/internal/analytics"
	analyticsstore "github.com/StartLivin/screek/backend/internal/analytics/store"
	bookingstore "github.com/StartLivin/screek/backend/internal/bookings/store"
	cinemastore "github.com/StartLivin/screek/backend/internal/cinema/store"
	moviestore "github.com/StartLivin/screek/backend/internal/movies/store"
	"github.com/StartLivin/screek/backend/internal/shared/testutil"
	userstore "github.com/StartLivin/screek/backend/internal/users/store"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_integ_analytics_consolidation(t *testing.T) {
	if testing.Short() {
		t.Skip("Pulando teste de integração de banco de dados")
	}
	db := testutil.SetupTestDB(t)
	require.NoError(t, cinemastore.AutoMigrate(db))
	require.NoError(t, moviestore.AutoMigrate(db))
	require.NoError(t, userstore.AutoMigrate(db))
	require.NoError(t, bookingstore.AutoMigrate(db))
	require.NoError(t, analyticsstore.AutoMigrate(db))
	testutil.CleanupDB(t, db)

	repo := analyticsstore.NewStore(db)
	svc := analytics.NewService(repo, nil, nil)
	ctx := context.Background()

	loc, _ := time.LoadLocation("America/Sao_Paulo")
	yesterday := time.Now().In(loc).AddDate(0, 0, -1)
	yesterdayStr := yesterday.Format("2006-01-02")

	cin := &cinemastore.CinemaRecord{Name: "Cine Analytics", City: "Recife"}
	db.Create(cin)
	room := &cinemastore.RoomRecord{CinemaID: cin.ID, Name: "Sala 1", Capacity: 100}
	db.Create(room)
	movie := &moviestore.MovieRecord{TMDBID: 101, Title: "Analytics Movie"}
	db.Create(movie)

	session := &cinemastore.SessionRecord{
		MovieID:   movie.ID,
		RoomID:    room.ID,
		StartTime: yesterday,
		Price:     2000,
	}
	db.Create(session)
	db.Exec("UPDATE sessions SET start_time = ?::timestamp", yesterdayStr+" 20:00:00")

	user := &userstore.UserRecord{ID: uuid.New(), Email: "analytics@test.com", Username: "aluno", Password: "123"}
	db.Create(user)

	tx := &bookingstore.TransactionRecord{
		ID:            uuid.New(),
		UserID:        user.ID,
		TotalAmount:   20000,
		Status:        bookingstore.TicketStatusPaid,
		PaymentMethod: "STRIPE",
	}
	require.NoError(t, db.Create(tx).Error)

	for i := 0; i < 10; i++ {
		ticket := &bookingstore.TicketRecord{
			ID:            uuid.New(),
			TransactionID: tx.ID,
			SessionID:     session.ID,
			Status:        bookingstore.TicketStatusPaid,
			PricePaid:     2000,
			QRCode:        uuid.New().String(),
		}
		require.NoError(t, db.Create(ticket).Error)
	}

	err := svc.RunAnalyticsAggregation(ctx, yesterday)
	require.NoError(t, err)

	var cinemaStats []analytics.DailyCinemaStats
	db.Where("cinema_id = ?", cin.ID).Find(&cinemaStats)
	require.Len(t, cinemaStats, 1, "Deveria ter 1 registro de stats para o cinema")
	assert.Equal(t, int64(20000), cinemaStats[0].TotalRevenue)
	assert.Equal(t, 10, cinemaStats[0].TicketsSold)
	assert.Equal(t, 0.1, cinemaStats[0].OccupancyRate)

	var movieStats []analytics.DailyMovieStats
	db.Where("movie_id = ?", movie.ID).Find(&movieStats)
	require.Len(t, movieStats, 1, "Deveria ter 1 registro de stats para o filme")
	assert.Equal(t, int64(20000), movieStats[0].TotalRevenue)
	assert.Equal(t, 10, movieStats[0].TicketsSold)
}
