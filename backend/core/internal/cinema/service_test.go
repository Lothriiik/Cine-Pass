package cinema

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/StartLivin/screek/backend/internal/shared/httputil"
	"github.com/StartLivin/screek/backend/internal/shared/types"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockManagementRepo struct {
	mock.Mock
}

func (m *MockManagementRepo) CreateCinema(ctx context.Context, cinema *Cinema) error {
	args := m.Called(ctx, cinema)
	return args.Error(0)
}

func (m *MockManagementRepo) GetCinemaByID(ctx context.Context, id int) (*Cinema, error) {
	args := m.Called(ctx, id)
	return args.Get(0).(*Cinema), args.Error(1)
}

func (m *MockManagementRepo) UpdateCinema(ctx context.Context, cinema *Cinema) error {
	args := m.Called(ctx, cinema)
	return args.Error(0)
}

func (m *MockManagementRepo) DeleteCinema(ctx context.Context, id int) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

func (m *MockManagementRepo) ListCinemas(ctx context.Context) ([]Cinema, error) {
	args := m.Called(ctx)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]Cinema), args.Error(1)
}

func (m *MockManagementRepo) CreateRoom(ctx context.Context, room *Room, seats []Seat) error {
	args := m.Called(ctx, room, seats)
	return args.Error(0)
}

func (m *MockManagementRepo) GetRoomByID(ctx context.Context, id int) (*Room, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*Room), args.Error(1)
}

func (m *MockManagementRepo) UpdateRoom(ctx context.Context, room *Room) error {
	args := m.Called(ctx, room)
	return args.Error(0)
}

func (m *MockManagementRepo) DeleteRoom(ctx context.Context, id int) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

func (m *MockManagementRepo) CreateSession(ctx context.Context, session *Session) error {
	args := m.Called(ctx, session)
	return args.Error(0)
}

func (m *MockManagementRepo) CreateSessionWithOverlapCheck(ctx context.Context, session *Session, movieRuntime int) error {
	args := m.Called(ctx, session, movieRuntime)
	return args.Error(0)
}

func (m *MockManagementRepo) UpdateSession(ctx context.Context, session *Session) error {
	args := m.Called(ctx, session)
	return args.Error(0)
}

func (m *MockManagementRepo) UpdateSessionWithOverlapCheck(ctx context.Context, session *Session, movieRuntime int) error {
	args := m.Called(ctx, session, movieRuntime)
	return args.Error(0)
}

func (m *MockManagementRepo) ListSessions(ctx context.Context, cinemaID int, date string) ([]Session, error) {
	args := m.Called(ctx, cinemaID, date)
	return args.Get(0).([]Session), args.Error(1)
}

func (m *MockManagementRepo) GetSessionsByRoom(ctx context.Context, roomID int, date time.Time) ([]Session, error) {
	args := m.Called(ctx, roomID, date)
	return args.Get(0).([]Session), args.Error(1)
}

func (m *MockManagementRepo) IsManagerOfCinema(ctx context.Context, userID uuid.UUID, cinemaID int) (bool, error) {
	args := m.Called(ctx, userID, cinemaID)
	return args.Bool(0), args.Error(1)
}

func (m *MockManagementRepo) GetSession(ctx context.Context, sessionID int) (*Session, error) {
	args := m.Called(ctx, sessionID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*Session), args.Error(1)
}

func (m *MockManagementRepo) GetWatchlistMatches(ctx context.Context) ([]types.WatchlistMatch, error) {
	args := m.Called(ctx)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]types.WatchlistMatch), args.Error(1)
}

func (m *MockManagementRepo) GetWatchlistMatchesForSession(ctx context.Context, sessionID int) ([]types.WatchlistMatch, error) {
	args := m.Called(ctx, sessionID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]types.WatchlistMatch), args.Error(1)
}

func (m *MockManagementRepo) DeleteSession(ctx context.Context, sessionID int) error {
	args := m.Called(ctx, sessionID)
	return args.Error(0)
}

func (m *MockManagementRepo) GetSessionBookingsCount(ctx context.Context, sessionID int) (int, error) {
	args := m.Called(ctx, sessionID)
	return args.Int(0), args.Error(1)
}

type MockMovieProvider struct {
	mock.Mock
}

func (m *MockMovieProvider) GetMovieDetails(ctx context.Context, tmdbID int) (*MovieDetailSummary, error) {
	args := m.Called(ctx, tmdbID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*MovieDetailSummary), args.Error(1)
}

func TestCreateRoom_SeatMapGeneration(t *testing.T) {
	repo := new(MockManagementRepo)
	svc := NewService(repo, nil, nil)

	req := CreateRoomRequest{
		CinemaID: 1,
		Name:     "Sala VIP",
		Capacity: 25,
		Type:     "VIP",
	}

	repo.On("GetRoomByID", mock.Anything, mock.Anything).Return(&Room{ID: 1, CinemaID: 1}, nil)
	repo.On("IsManagerOfCinema", mock.Anything, mock.Anything, 1).Return(true, nil)

	repo.On("CreateRoom", mock.Anything, mock.MatchedBy(func(r *Room) bool {
		return r.Name == "Sala VIP" && r.Capacity == 25
	}), mock.MatchedBy(func(seats []Seat) bool {
		return len(seats) == 25 && seats[0].Row == "A" && seats[10].Row == "B"
	})).Return(nil)

	err := svc.CreateRoom(context.Background(), uuid.New(), httputil.RoleManager, req)
	assert.NoError(t, err)
}

func TestCreateSession_OverlapDetection(t *testing.T) {
	repo := new(MockManagementRepo)
	mp := new(MockMovieProvider)
	svc := NewService(repo, mp, nil)

	userID := uuid.New()
	roomID := 1
	movieID := 550
	startTime := time.Now().Add(2 * time.Hour)

	repo.On("GetRoomByID", mock.Anything, roomID).Return(&Room{ID: roomID, CinemaID: 1}, nil)
	repo.On("IsManagerOfCinema", mock.Anything, userID, 1).Return(true, nil)

	mp.On("GetMovieDetails", mock.Anything, movieID).Return(&MovieDetailSummary{ID: movieID, Runtime: 120}, nil)

	repo.On("CreateSessionWithOverlapCheck", mock.Anything, mock.Anything, 120).Return(ErrSessionOverlap)

	req := CreateSessionRequest{
		MovieID:     movieID,
		RoomID:      roomID,
		StartTime:   startTime,
		Price:       1500,
		SessionType: "REGULAR",
	}

	err := svc.CreateSession(context.Background(), userID, httputil.RoleManager, req)

	assert.ErrorIs(t, err, ErrSessionOverlap)
	repo.AssertExpectations(t)
}

func TestCreateSession_ManagerCheck(t *testing.T) {
	repo := new(MockManagementRepo)
	svc := NewService(repo, nil, nil)

	userID := uuid.New()
	repo.On("GetRoomByID", mock.Anything, 1).Return(&Room{ID: 1, CinemaID: 1}, nil)
	repo.On("IsManagerOfCinema", mock.Anything, userID, 1).Return(false, nil)

	req := CreateSessionRequest{
		MovieID:     123,
		RoomID:      1,
		StartTime:   time.Now().Add(1 * time.Hour),
		Price:       1000,
		SessionType: "REGULAR",
	}
	err := svc.CreateSession(context.Background(), userID, httputil.RoleManager, req)

	assert.Error(t, err)
	assert.Equal(t, ErrNotCinemaManager, err)
}

func TestDeleteSession_Integrity(t *testing.T) {
	repo := new(MockManagementRepo)
	svc := NewService(repo, nil, nil)
	userID := uuid.New()
	sessionID := 10

	repo.On("GetSession", mock.Anything, sessionID).Return(&Session{ID: sessionID, RoomID: 1}, nil)
	repo.On("GetRoomByID", mock.Anything, 1).Return(&Room{ID: 1, CinemaID: 1}, nil)
	repo.On("IsManagerOfCinema", mock.Anything, userID, 1).Return(true, nil)

	t.Run("Erro se houver reservas", func(t *testing.T) {
		repo.On("GetSessionBookingsCount", mock.Anything, sessionID).Return(5, nil).Once()

		err := svc.DeleteSession(context.Background(), userID, httputil.RoleManager, sessionID)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "ingressos vendidos")
	})

	t.Run("Sucesso se estiver vazia", func(t *testing.T) {
		repo.On("GetSessionBookingsCount", mock.Anything, sessionID).Return(0, nil).Once()
		repo.On("DeleteSession", mock.Anything, sessionID).Return(nil)

		err := svc.DeleteSession(context.Background(), userID, httputil.RoleManager, sessionID)
		assert.NoError(t, err)
	})
}
func TestManagementService_UpdateSession_OverlapAndSold(t *testing.T) {
	repo := new(MockManagementRepo)
	movieProvider := new(MockMovieProvider)
	svc := NewService(repo, movieProvider, nil)

	ctx := context.Background()
	adminID := uuid.New()
	sessionID := 1
	movieID := 10
	roomID := 5
	startTime := time.Now().Add(24 * time.Hour)

	existingSession := &Session{
		ID:        sessionID,
		MovieID:   movieID,
		RoomID:    roomID,
		StartTime: startTime,
	}

	t.Run("Erro se houver ingressos vendidos", func(t *testing.T) {
		repo.On("GetSession", ctx, sessionID).Return(existingSession, nil).Once()
		repo.On("GetRoomByID", ctx, existingSession.RoomID).Return(&Room{ID: roomID, CinemaID: 1}, nil).Once()
		repo.On("GetSessionBookingsCount", ctx, sessionID).Return(5, nil).Once()

		err := svc.UpdateSession(ctx, adminID, httputil.RoleAdmin, sessionID, CreateSessionRequest{
			MovieID:     movieID,
			RoomID:      roomID,
			StartTime:   startTime.Add(time.Hour),
			Price:       1000,
			SessionType: "REGULAR",
		})

		assert.ErrorIs(t, err, ErrSessionHasBookings)
		repo.AssertExpectations(t)
	})

	t.Run("Erro se houver sobreposição", func(t *testing.T) {
		repo.On("GetSession", ctx, sessionID).Return(existingSession, nil).Once()
		repo.On("GetRoomByID", ctx, existingSession.RoomID).Return(&Room{ID: roomID, CinemaID: 1}, nil).Once()
		repo.On("GetSessionBookingsCount", ctx, sessionID).Return(0, nil).Once()
		movieProvider.On("GetMovieDetails", ctx, movieID).Return(&MovieDetailSummary{ID: movieID, Runtime: 120}, nil).Once()
		repo.On("UpdateSessionWithOverlapCheck", ctx, mock.Anything, 120).Return(errors.New("conflito de horário")).Once()

		err := svc.UpdateSession(ctx, adminID, httputil.RoleAdmin, sessionID, CreateSessionRequest{
			MovieID:     movieID,
			RoomID:      roomID,
			StartTime:   startTime.Add(time.Hour),
			Price:       1000,
			SessionType: "REGULAR",
		})

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "conflito")
		repo.AssertExpectations(t)
	})
}

func TestManagementService_DeleteRoom_FutureSessions(t *testing.T) {
	repo := new(MockManagementRepo)
	svc := NewService(repo, nil, nil)
	ctx := context.Background()
	roomID := 1

	t.Run("Erro se houver sessões futuras", func(t *testing.T) {
		repo.On("GetRoomByID", ctx, roomID).Return(&Room{ID: roomID, CinemaID: 1}, nil).Once()
		repo.On("GetSessionsByRoom", ctx, roomID, mock.Anything).Return([]Session{{ID: 101}}, nil).Once()

		err := svc.DeleteRoom(ctx, uuid.New(), httputil.RoleAdmin, roomID)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "sessões futuras agendadas")
		repo.AssertExpectations(t)
	})
}
