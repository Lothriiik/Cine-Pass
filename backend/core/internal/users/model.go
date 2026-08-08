package users

import (
	"time"

	"github.com/StartLivin/screek/backend/internal/shared/httputil"
	"github.com/google/uuid"
)

type User struct {
	ID             uuid.UUID
	Username       string
	Name           string
	Email          string
	Password       string
	Bio            string
	AvatarURL      string
	Pronouns       string
	Role           httputil.Role
	DefaultCity    string
	FavoriteMovies []int
	IsActive       bool
	CreatedAt      time.Time
}

type UserStats struct {
	UserID       uuid.UUID
	TotalMovies  int
	TotalMinutes int
	TopGenreID   *int
	LastRecalcAt time.Time
	UpdatedAt    time.Time
}
