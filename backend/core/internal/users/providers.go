package users

import "context"

type MovieSummary struct {
	ID     int
	TMDBID int
}

type MovieProvider interface {
	GetMovieByTMDBID(ctx context.Context, tmdbID int) (*MovieSummary, error)
}
