package handler

import (
	"time"

	"github.com/google/uuid"
)

type NotificationResponseDTO struct {
	ID        uint      `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Type      string    `json:"type"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Link      string    `json:"link,omitempty"`
	IsRead    bool      `json:"is_read"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateNotificationDTO struct {
	UserID  uuid.UUID `json:"user_id"`
	Type    string    `json:"type"`
	Title   string    `json:"title"`
	Message string    `json:"message"`
	Link    string    `json:"link,omitempty"`
}
