package notifications

import (
	"time"

	"github.com/google/uuid"
)

type Notification struct {
	ID        uint
	UserID    uuid.UUID
	Type      string
	Title     string
	Message   string
	IsRead    bool
	Link      string
	CreatedAt time.Time
}
