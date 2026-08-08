package cinema

import (
	"context"
	"time"
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

type MovieProvider interface {
	GetMovieDetails(ctx context.Context, tmdbID int) (*MovieDetailSummary, error)
}
