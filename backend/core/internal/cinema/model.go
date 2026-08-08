package cinema

import (
	"time"

	"github.com/google/uuid"
)

type RoomType string

const (
	RoomTypeStandard RoomType = "STANDARD"
	RoomTypeIMAX     RoomType = "IMAX"
	RoomTypeVIP      RoomType = "VIP"
)

type SessionType string

const (
	SessionTypeRegular    SessionType = "REGULAR"
	SessionTypePremiere   SessionType = "PREMIERE"
	SessionTypeRescreen   SessionType = "RESCREENING"
	SessionTypeFestival   SessionType = "FESTIVAL"
	SessionTypeUniversity SessionType = "UNIVERSITY"
	SessionTypeShowcase   SessionType = "SHOWCASE"
)

type Cinema struct {
	ID        int
	Name      string
	Address   string
	City      string
	Phone     string
	Email     string
	CreatedAt time.Time
	UpdatedAt time.Time
	Rooms     []Room
}

type Room struct {
	ID       int
	CinemaID int
	Name     string
	Capacity int
	Type     RoomType
	Seats    []Seat
}

type Seat struct {
	ID         int
	RoomID     int
	Row        string
	Number     int
	PosX       int
	PosY       int
	Type       string
	IsOccupied bool
}

type Session struct {
	ID          int
	MovieID     int
	RoomID      int
	StartTime   time.Time
	Price       int
	SessionType SessionType
	IsFree      bool
	Room        Room
}

type CinemaManager struct {
	UserID    uuid.UUID
	CinemaID  int
	CreatedAt time.Time
}

type CreateCinemaRequest struct {
	Name    string
	Address string
	City    string
	Phone   string
	Email   string
}

type CreateRoomRequest struct {
	CinemaID int
	Name     string
	Capacity int
	Type     string
}

type CreateSessionRequest struct {
	MovieID     int
	RoomID      int
	StartTime   time.Time
	Price       int
	SessionType string
}

type CinemaSummary struct {
	ID      int
	Name    string
	City    string
	Address string
}

type SessionSummary struct {
	ID          int
	MovieTitle  string
	RoomName    string
	StartTime   time.Time
	Price       int
	SessionType string
}
