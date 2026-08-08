package notifications

import "errors"

var (
	ErrNotificationNotFound = errors.New("notificação não encontrada")
	ErrUnauthorizedAccess   = errors.New("acesso não autorizado à notificação")
)
