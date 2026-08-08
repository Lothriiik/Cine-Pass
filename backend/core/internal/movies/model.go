package movies

import (
	"time"

	"github.com/StartLivin/screek/backend/internal/movies/tmdb"
)

type TMDBMovie = tmdb.TMDBMovie
type TMDBPersonMovieCast = tmdb.TMDBPersonMovieCast

type Movie struct {
	ID               int           `json:"id"`
	TMDBID           int           `json:"tmdb_id"`
	Title            string        `json:"title"`
	Overview         string        `json:"overview"`
	PosterURL        string        `json:"poster_url"`
	BackdropURL      string        `json:"backdrop_url"`
	UpdatedAt        time.Time     `json:"-"`
	ReleaseDate      time.Time     `json:"release_date"`
	Status           string        `json:"status"`
	Runtime          int           `json:"runtime"`
	OriginalLanguage string        `json:"original_language"`
	SpokenLanguages  string        `json:"spoken_languages"`
	Genres           []Genre       `json:"genres"`
	Credits          []MovieCredit `json:"credits"`
}

type Genre struct {
	ID     int     `json:"id"`
	TMDBID int     `json:"tmdb_id"`
	Name   string  `json:"name"`
	Movies []Movie `json:"-"`
}

type Person struct {
	ID           int           `json:"id"`
	TMDBID       int           `json:"tmdb_id"`
	Name         string        `json:"name"`
	ProfileURL   string        `json:"profile_url"`
	MovieCredits []MovieCredit `json:"-"`
}

type MovieCredit struct {
	ID        int    `json:"id"`
	MovieID   int    `json:"movie_id"`
	PersonID  int    `json:"person_id"`
	Role      string `json:"role"`
	Character string `json:"character"`
	Person    Person `json:"person"`
	Movie     *Movie `json:"-"`
}
