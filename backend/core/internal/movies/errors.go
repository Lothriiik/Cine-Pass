package movies

import "errors"

var (
	ErrMovieMatchNotFound  = errors.New("filme não encontrado por título/ano")
	ErrMovieNotFound       = errors.New("filme não encontrado")
	ErrMovieCacheExpired   = errors.New("revalidar cache do filme")
	ErrMovieIncompleteData = errors.New("filme incompleto, forçando busca de detalhes")
)
