package analytics

import "errors"

var (
	ErrAnalyticsNotFound = errors.New("dados analíticos não encontrados")
	ErrInvalidDateRange  = errors.New("intervalo de datas inválido")
)
