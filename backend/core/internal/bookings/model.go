package bookings

import (
	"time"

	"github.com/google/uuid"
)

type TicketType string

const (
	TicketTypeStandard TicketType = "STANDARD"
	TicketTypeHalf     TicketType = "HALF"
	TicketTypeFree     TicketType = "FREE"
)

type TicketStatus string

const (
	TicketStatusPending   TicketStatus = "PENDING"
	TicketStatusPaid      TicketStatus = "PAID"
	TicketStatusCancelled TicketStatus = "CANCELLED"
)

type Transaction struct {
	ID            uuid.UUID
	UserID        uuid.UUID
	TotalAmount   int
	Status        TicketStatus
	PaymentMethod string
	PaymentID     string
	Tickets       []uuid.UUID
	CreatedAt     time.Time
}

type Ticket struct {
	ID            uuid.UUID
	TransactionID uuid.UUID
	SessionID     int
	SeatID        *int
	Status        TicketStatus
	Type          TicketType
	PricePaid     int
	QRCode        string
	Transaction   Transaction
}

type MovieDTO struct {
	ID            int
	TMDBID        int
	Title         string
	PosterURL     string
	IsPremiere    bool
	IsRescreening bool
}

type SessionResponseDTO struct {
	ID          int
	StartTime   time.Time
	Price       int
	RoomType    string
	SessionType string
}

type CinemaSessionsResponseDTO struct {
	CinemaID   int
	CinemaName string
	CinemaCity string
	Sessions   []SessionResponseDTO
}

type TicketRequest struct {
	SeatID int
	Type   TicketType
}

type UserBookingDTO struct {
	ID    string
	Email string
	Name  string
}

type TicketResponseDTO struct {
	ID        uuid.UUID
	MovieName string
	Cinema    string
	Date      string
	Room      string
	Seat      string
	Status    string
	QRCode    string
	User      *UserBookingDTO
}
