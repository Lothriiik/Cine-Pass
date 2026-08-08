package auth

import (
	"context"

	"github.com/StartLivin/screek/backend/internal/shared/httputil"
	"github.com/google/uuid"
)

type UserSummary struct {
	ID       uuid.UUID
	Username string
	Email    string
	Password string
	Role     httputil.Role
}

type UserProvider interface {
	GetUserByUsername(ctx context.Context, username string) (*UserSummary, error)
	GetUserByID(ctx context.Context, id uuid.UUID) (*UserSummary, error)
	GetUserByEmail(ctx context.Context, email string) (*UserSummary, error)
	UpdateUserPassword(ctx context.Context, user *UserSummary) error
	UpdateUserRole(ctx context.Context, user *UserSummary, role httputil.Role) error
}
