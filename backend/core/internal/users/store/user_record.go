package store

import (
	"time"

	moviestore "github.com/StartLivin/screek/backend/internal/movies/store"
	"github.com/StartLivin/screek/backend/internal/shared/httputil"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRecord struct {
	ID             uuid.UUID                `json:"id" gorm:"type:uuid;primaryKey"`
	Username       string                   `json:"username" gorm:"not null;uniqueIndex"`
	Name           string                   `json:"name" gorm:"not null"`
	Email          string                   `json:"email" gorm:"not null;uniqueIndex"`
	Password       string                   `json:"-" gorm:"not null"`
	Bio            string                   `json:"bio"`
	AvatarURL      string                   `json:"avatar_url"`
	Pronouns       string                   `json:"pronouns"`
	Role           httputil.Role            `json:"role" gorm:"type:varchar(20);default:'USER'"`
	DefaultCity    string                   `json:"default_city"`
	FavoriteMovies []moviestore.MovieRecord `json:"favorite_movies" gorm:"many2many:user_favorite_movies;foreignKey:ID;joinForeignKey:user_id;references:ID;joinReferences:movie_id;"`
	IsActive       bool                     `json:"is_active" gorm:"not null;default:true"`
	CreatedAt      time.Time                `json:"created_at" gorm:"not null;default:now()"`
}

type UserStatsRecord struct {
	UserID       uuid.UUID `json:"user_id" gorm:"type:uuid;primaryKey"`
	TotalMovies  int       `json:"total_movies" gorm:"not null;default:0"`
	TotalMinutes int       `json:"total_minutes" gorm:"not null;default:0"`
	TopGenreID   *int      `json:"top_genre_id" gorm:"index"`
	LastRecalcAt time.Time `json:"last_recalc_at" gorm:"not null;default:now()"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"not null;default:now()"`

	User  UserRecord             `json:"-" gorm:"foreignKey:UserID"`
	Genre *moviestore.GenreRecord `json:"genre,omitempty" gorm:"foreignKey:TopGenreID"`
}

type UserFavoriteMovie struct {
	UserID  uuid.UUID `gorm:"type:uuid;primaryKey"`
	MovieID int       `gorm:"primaryKey"`
}

func (UserRecord) TableName() string         { return "users" }
func (UserStatsRecord) TableName() string    { return "user_stats" }
func (UserFavoriteMovie) TableName() string { return "user_favorite_movies" }

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(&UserFavoriteMovie{}, &UserRecord{}, &UserStatsRecord{})
}
