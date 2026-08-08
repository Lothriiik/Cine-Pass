package users

import "errors"

var (
	ErrUserNotFound       = errors.New("user not found")
	ErrUserAlreadyExists  = errors.New("usuário com este e-mail ou username já existe")
	ErrInvalidPassword    = errors.New("senha incorreta")
	ErrOldPasswordInvalid = errors.New("senha antiga incorreta")
	ErrMovieNotFound      = errors.New("filme não encontrado na base local")
)
