package bookings

import "errors"

var (
	ErrSeatLockFailed        = errors.New("uma ou mais cadeiras foram compradas por outro usuário")
	ErrInvalidTicketStatus   = errors.New("query param 'status' inválido")
	ErrInvalidSeatID         = errors.New("SeatID deve ser um número positivo")
	ErrSessionNotFound       = errors.New("sessão não encontrada")
	ErrTransactionNotFound   = errors.New("transação não encontrada, não pertence a você ou já paga")
	ErrTransactionNotPending = errors.New("esta transação não está mais pendente")
)
