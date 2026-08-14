package store

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
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

type CinemaRecord struct {
	ID        int          `gorm:"primaryKey;autoIncrement"`
	Name      string       `gorm:"not null"`
	Address   string       `gorm:"not null"`
	City      string       `gorm:"not null;index"`
	Phone     string
	Email     string
	CreatedAt time.Time    `gorm:"not null;default:now()"`
	UpdatedAt time.Time    `gorm:"not null;default:now()"`
	Rooms     []RoomRecord `gorm:"foreignKey:CinemaID"`
}

type RoomRecord struct {
	ID       int          `gorm:"primaryKey;autoIncrement"`
	CinemaID int          `gorm:"not null;index"`
	Name     string       `gorm:"not null"`
	Capacity int          `gorm:"not null"`
	Type     RoomType     `gorm:"type:varchar(20);default:'STANDARD'"`
	Cinema   CinemaRecord `gorm:"foreignKey:CinemaID"`
	Seats    []SeatRecord `gorm:"foreignKey:RoomID"`
}

type SeatRecord struct {
	ID         int        `gorm:"primaryKey;autoIncrement"`
	RoomID     int        `gorm:"not null;index:idx_seats_room_row_number,composite:room"`
	Row        string     `gorm:"not null;index:idx_seats_room_row_number,composite:row"`
	Number     int        `gorm:"not null;index:idx_seats_room_row_number,composite:number"`
	PosX       int        `gorm:"not null"`
	PosY       int        `gorm:"not null"`
	Type       string     `gorm:"not null"`
	Room       RoomRecord `gorm:"foreignKey:RoomID"`
	IsOccupied bool       `gorm:"-"`
}

type SessionRecord struct {
	ID          int         `gorm:"primaryKey;autoIncrement"`
	MovieID     int         `gorm:"not null;index"`
	RoomID      int         `gorm:"not null;index"`
	StartTime   time.Time   `gorm:"not null;index"`
	Price       int         `gorm:"not null"`
	SessionType SessionType `gorm:"type:varchar(20);not null;default:'REGULAR'"`
	IsFree      bool        `gorm:"default:false"`
	Room        RoomRecord  `gorm:"foreignKey:RoomID"`
}

type CinemaManagerRecord struct {
	UserID    uuid.UUID `gorm:"type:uuid;primaryKey"`
	CinemaID  int       `gorm:"primaryKey"`
	CreatedAt time.Time `gorm:"not null;default:now()"`
}

func (CinemaRecord) TableName() string        { return "cinemas" }
func (RoomRecord) TableName() string          { return "rooms" }
func (SeatRecord) TableName() string          { return "seats" }
func (SessionRecord) TableName() string       { return "sessions" }
func (CinemaManagerRecord) TableName() string { return "cinema_managers" }

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(&CinemaRecord{}, &RoomRecord{}, &CinemaManagerRecord{}, &SeatRecord{}, &SessionRecord{})
}
