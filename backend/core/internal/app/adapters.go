package app

import (
	"context"
	"errors"

	"github.com/StartLivin/screek/backend/internal/bookings"
	"github.com/StartLivin/screek/backend/internal/catalog"
	"github.com/StartLivin/screek/backend/internal/cinema"
	"github.com/StartLivin/screek/backend/internal/movies"
	"github.com/StartLivin/screek/backend/internal/social"
	"github.com/StartLivin/screek/backend/internal/users"
	"github.com/google/uuid"
)

type catalogMovieAdapter struct {
	svc *movies.MovieService
}

func (a *catalogMovieAdapter) GetMovieDetails(ctx context.Context, tmdbID int) (*catalog.MovieDetailSummary, error) {
	movie, err := a.svc.GetMovieDetails(ctx, tmdbID)
	if err != nil {
		return nil, err
	}

	return &catalog.MovieDetailSummary{
		ID:          movie.ID,
		TMDBID:      movie.TMDBID,
		Title:       movie.Title,
		Overview:    movie.Overview,
		PosterURL:   movie.PosterURL,
		BackdropURL: movie.BackdropURL,
		ReleaseDate: movie.ReleaseDate,
		Runtime:     movie.Runtime,
	}, nil
}

type catalogUserAdapter struct {
	svc *users.UserService
}

func (a *catalogUserAdapter) IncrementStats(ctx context.Context, userID uuid.UUID, movies int, minutes int) error {
	return a.svc.IncrementStats(ctx, userID, movies, minutes)
}

type cinemaMovieAdapter struct {
	svc *movies.MovieService
}

func (a *cinemaMovieAdapter) GetMovieDetails(ctx context.Context, tmdbID int) (*cinema.MovieDetailSummary, error) {
	movie, err := a.svc.GetMovieDetails(ctx, tmdbID)
	if err != nil {
		return nil, err
	}
	return &cinema.MovieDetailSummary{
		ID:          movie.ID,
		TMDBID:      movie.TMDBID,
		Title:       movie.Title,
		Overview:    movie.Overview,
		PosterURL:   movie.PosterURL,
		BackdropURL: movie.BackdropURL,
		ReleaseDate: movie.ReleaseDate,
		Runtime:     movie.Runtime,
	}, nil
}

type userSearchAdapter struct {
	svc *users.UserService
}

func (a *userSearchAdapter) SearchUsers(ctx context.Context, query string) ([]movies.UserSearchResult, error) {
	usersList, err := a.svc.SearchUsers(ctx, query)
	if err != nil {
		return nil, err
	}
	var results []movies.UserSearchResult
	for _, u := range usersList {
		results = append(results, movies.UserSearchResult{
			ID:        u.ID.String(),
			Username:  u.Username,
			Name:      u.Name,
			AvatarURL: u.AvatarURL,
		})
	}
	return results, nil
}

func (a *userSearchAdapter) GetUserByID(ctx context.Context, id uuid.UUID) (*social.UserSummary, error) {
	u, err := a.svc.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return &social.UserSummary{
		ID:        u.ID,
		Username:  u.Username,
		AvatarURL: u.AvatarURL,
	}, nil
}

func (a *userSearchAdapter) GetUserByUsername(ctx context.Context, username string) (*social.UserSummary, error) {
	u, err := a.svc.GetUserByUsername(ctx, username)
	if err != nil {
		return nil, err
	}
	return &social.UserSummary{
		ID:        u.ID,
		Username:  u.Username,
		AvatarURL: u.AvatarURL,
	}, nil
}

type listSearchAdapter struct {
	catalogSvc *catalog.CatalogService
	userSvc    *users.UserService
}

func (a *listSearchAdapter) SearchLists(ctx context.Context, query string) ([]movies.ListSearchResult, error) {
	lists, err := a.catalogSvc.SearchLists(ctx, query)
	if err != nil {
		return nil, err
	}
	var results []movies.ListSearchResult
	for _, l := range lists {
		username := "Usuário Desconhecido"
		if user, err := a.userSvc.GetUserByID(ctx, l.UserID); err == nil && user != nil {
			username = user.Username
		}

		results = append(results, movies.ListSearchResult{
			ID:          l.ID,
			Title:       l.Title,
			Description: l.Description,
			Username:    username,
		})
	}
	return results, nil
}

type sessionSearchAdapter struct {
	svc      bookings.Service
	movieSvc *movies.MovieService
	mgmtSvc  *cinema.CinemaService
}

func (a *sessionSearchAdapter) GetSessionPostData(ctx context.Context, sessionID uint) (*social.PostSessionData, error) {
	if a.svc == nil {
		return nil, errors.New("bookings service not initialized in adapter")
	}
	session, err := a.svc.GetSessionByID(ctx, int(sessionID))
	if err != nil {
		return nil, err
	}

	movieTitle := "Desconhecido"
	posterURL := ""
	if m, err := a.movieSvc.GetMovieDetails(ctx, session.MovieID); err == nil && m != nil {
		movieTitle = m.Title
		posterURL = m.PosterURL
	}

	cinemaName := "Desconhecido"
	if c, err := a.mgmtSvc.GetCinemaByID(ctx, session.Room.CinemaID); err == nil && c != nil {
		cinemaName = c.Name
	}

	return &social.PostSessionData{
		SessionID:  session.ID,
		MovieTitle: movieTitle,
		PosterURL:  posterURL,
		StartTime:  session.StartTime.Format("02/01 15:04"),
		RoomName:   session.Room.Name,
		CinemaName: cinemaName,
	}, nil
}
