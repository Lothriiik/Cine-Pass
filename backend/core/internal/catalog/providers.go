package catalog

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type MovieDetailSummary struct {
	ID            int
	TMDBID        int
	Title         string
	Overview      string
	PosterURL     string
	BackdropURL   string
	ReleaseDate   time.Time
	Runtime       int
	AverageRating float64
	TotalReviews  int
	TotalLikes    int
}

type UserProvider interface {
	IncrementStats(ctx context.Context, userID uuid.UUID, movies int, minutes int) error
}

type MovieProvider interface {
	GetMovieDetails(ctx context.Context, tmdbID int) (*MovieDetailSummary, error)
}
