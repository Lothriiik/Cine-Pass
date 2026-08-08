package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	bookingstore "github.com/StartLivin/screek/backend/internal/bookings/store"
	"github.com/StartLivin/screek/backend/internal/cinema"
	cinemastore "github.com/StartLivin/screek/backend/internal/cinema/store"
	moviestore "github.com/StartLivin/screek/backend/internal/movies/store"
	"github.com/StartLivin/screek/backend/internal/shared/httputil"
	"github.com/StartLivin/screek/backend/internal/shared/testutil"
	userstore "github.com/StartLivin/screek/backend/internal/users/store"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestHandler_ManagementIntegration(t *testing.T) {
	if testing.Short() {
		t.Skip("Pulando teste de integração de banco de dados")
	}

	db := testutil.SetupTestDB(t)

	db.Migrator().DropTable(&cinemastore.CinemaManagerRecord{}, &cinemastore.SessionRecord{}, &bookingstore.TicketRecord{}, &bookingstore.TransactionRecord{})
	testutil.CleanupDB(t, db)
	cinemastore.AutoMigrate(db)

	store := cinemastore.NewStore(db)
	svc := cinema.NewService(store, nil, nil)
	h := NewHandler(svc)

	adminID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	r := chi.NewRouter()
	authMW := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), httputil.UserIDKey, adminID)
			ctx = context.WithValue(ctx, httputil.UserRoleKey, httputil.RoleAdmin)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
	h.RegisterRoutes(r, authMW)

	t.Run("Fluxo de Exclusão de Sessão", func(t *testing.T) {
		cin := cinemastore.CinemaRecord{Name: "Handler Cinema", City: "City"}
		db.Create(&cin)
		db.Create(&cinemastore.CinemaManagerRecord{UserID: adminID, CinemaID: cin.ID})

		room := cinemastore.RoomRecord{CinemaID: cin.ID, Name: "Room 1", Capacity: 10}
		db.Create(&room)

		movie := moviestore.MovieRecord{ID: 1, Title: "Movie T", TMDBID: 777}
		db.Create(&movie)

		sess1 := cinemastore.SessionRecord{RoomID: room.ID, MovieID: movie.ID, Price: 1000}
		db.Create(&sess1)

		user := userstore.UserRecord{ID: uuid.New(), Email: "handler@test.com", Username: "handler_test"}
		db.Create(&user)

		tx := bookingstore.TransactionRecord{ID: uuid.New(), UserID: user.ID, Status: bookingstore.TicketStatusPaid}
		db.Create(&tx)
		ticket := bookingstore.TicketRecord{
			ID:            uuid.New(),
			TransactionID: tx.ID,
			SessionID:     sess1.ID,
			Status:        bookingstore.TicketStatusPaid,
			QRCode:        uuid.New().String(),
		}
		db.Create(&ticket)

		sess2 := cinemastore.SessionRecord{RoomID: room.ID, MovieID: movie.ID, Price: 2000}
		db.Create(&sess2)

		req1 := httptest.NewRequest("DELETE", "/admin/management/sessions/"+strconv.Itoa(sess1.ID), nil)
		w1 := httptest.NewRecorder()
		r.ServeHTTP(w1, req1)
		assert.Equal(t, http.StatusBadRequest, w1.Code)

		req2 := httptest.NewRequest("DELETE", "/admin/management/sessions/"+strconv.Itoa(sess2.ID), nil)
		w2 := httptest.NewRecorder()
		r.ServeHTTP(w2, req2)
		assert.Equal(t, http.StatusOK, w2.Code)
		assert.Contains(t, w2.Body.String(), "Sessão excluída")
	})

	t.Run("Criação de Cinema via HTTP", func(t *testing.T) {
		payload := CreateCinemaRequestDTO{
			Name:    "Novo Cinema HTTP",
			City:    "Cidade",
			Address: "Rua X",
			Phone:   "123",
			Email:   "cinema@test.com",
		}
		body, _ := json.Marshal(payload)

		req := httptest.NewRequest("POST", "/admin/management/cinemas", bytes.NewBuffer(body))
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
	})
}
