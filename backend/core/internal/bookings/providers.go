package bookings

import (
	"context"

	"github.com/google/uuid"
)

type MovieSummary struct {
	ID        int
	TMDBID    int
	Title     string
	PosterURL string
}

type UserSummary struct {
	ID    uuid.UUID
	Name  string
	Email string
}

type MovieProvider interface {
	GetMovieDetails(ctx context.Context, tmdbID int) (*MovieSummary, error)
}

type UserProvider interface {
	GetUserByID(ctx context.Context, id uuid.UUID) (*UserSummary, error)
}
