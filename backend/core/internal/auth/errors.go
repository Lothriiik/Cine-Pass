package auth

import "errors"

var (
	ErrInvalidCredentials = errors.New("usuário ou senha inválidos")
	ErrTokenGeneration    = errors.New("erro ao gerar token")
	ErrInvalidToken       = errors.New("token inválido")
	ErrLogoutProcess      = errors.New("erro ao processar logout no servidor")
	ErrUserNotFound       = errors.New("usuário não encontrado")
	ErrSamePassword       = errors.New("a nova senha não pode ser igual à senha antiga")
	ErrPasswordProcess    = errors.New("erro ao processar nova senha")
	ErrPasswordUpdate     = errors.New("erro ao atualizar senha")
	ErrOldPasswordInvalid = errors.New("senha antiga incorreta")
	ErrRefreshRevoked     = errors.New("token de atualização revogado ou expirado")
	ErrTooManyAttempts    = errors.New("muitas tentativas de login. tente novamente mais tarde")
)
