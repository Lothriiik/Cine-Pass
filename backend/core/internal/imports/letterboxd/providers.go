package letterboxd

import (
	"context"

	"github.com/google/uuid"
)

type MatchedMovieSummary struct {
	ID int
}

type MovieMatcher interface {
	MatchMovieByTitleAndYear(ctx context.Context, title string, year int) (*MatchedMovieSummary, error)
}

type CatalogProvider interface {
	LogMovie(ctx context.Context, userID uuid.UUID, movieID uint, rating float64, watched bool, liked bool) error
	AddToWatchlist(ctx context.Context, userID uuid.UUID, movieID uint) error
}
