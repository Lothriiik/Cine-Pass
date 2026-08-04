package social

import (
	"context"

	"github.com/google/uuid"
)

type UserProvider interface {
	GetUserByID(ctx context.Context, id uuid.UUID) (*UserSummary, error)
	GetUserByUsername(ctx context.Context, username string) (*UserSummary, error)
}

type SessionProvider interface {
	GetSessionPostData(ctx context.Context, sessionID uint) (*PostSessionData, error)
}
