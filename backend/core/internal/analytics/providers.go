package analytics

import "context"

type MovieSummary struct {
	ID    int
	Title string
}

type CinemaSummary struct {
	ID   int
	Name string
}

type MovieProvider interface {
	GetMovieDetails(ctx context.Context, tmdbID int) (*MovieSummary, error)
}

type CinemaProvider interface {
	GetCinemaByID(ctx context.Context, id int) (*CinemaSummary, error)
}
