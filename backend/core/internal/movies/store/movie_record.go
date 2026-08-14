package store

import (
	"time"

	"gorm.io/gorm"
)

type MovieRecord struct {
	ID               int                 `gorm:"primaryKey;autoIncrement"`
	TMDBID           int                 `gorm:"not null;uniqueIndex"`
	Title            string              `gorm:"not null"`
	Overview         string              `gorm:"not null"`
	PosterURL        string              `gorm:"not null"`
	BackdropURL      string              
	UpdatedAt        time.Time           
	ReleaseDate      time.Time           `gorm:"not null"`
	Status           string              `gorm:"not null;default:'Released'"`
	Runtime          int                 `gorm:"not null"`
	OriginalLanguage string              
	SpokenLanguages  string              
	Genres           []GenreRecord       `gorm:"many2many:movie_genres;joinForeignKey:movie_id;joinReferences:genre_id;"`
	Credits          []MovieCreditRecord `gorm:"foreignKey:MovieID;references:ID"`
}

type GenreRecord struct {
	ID     int           `gorm:"primaryKey;autoIncrement"`
	TMDBID int           `gorm:"not null;uniqueIndex"`
	Name   string        `gorm:"not null"`
	Movies []MovieRecord `gorm:"many2many:movie_genres;joinForeignKey:genre_id;joinReferences:movie_id;"`
}

type PersonRecord struct {
	ID           int                 `gorm:"primaryKey;autoIncrement"`
	TMDBID       int                 `gorm:"not null;uniqueIndex"`
	Name         string              `gorm:"not null"`
	ProfileURL   string              `gorm:"not null"`
	MovieCredits []MovieCreditRecord `gorm:"foreignKey:PersonID"`
}

type MovieCreditRecord struct {
	ID        int          `gorm:"primaryKey;autoIncrement"`
	MovieID   int          `gorm:"not null"`
	PersonID  int          `gorm:"not null"`
	Role      string       `gorm:"not null"`
	Character string       
	Person    PersonRecord `gorm:"foreignKey:PersonID"`
	Movie     *MovieRecord `gorm:"foreignKey:MovieID"`
}

type MovieGenre struct {
	MovieID int `gorm:"primaryKey"`
	GenreID int `gorm:"primaryKey"`
}

func (MovieRecord) TableName() string       { return "movies" }
func (GenreRecord) TableName() string       { return "genres" }
func (PersonRecord) TableName() string      { return "people" }
func (MovieCreditRecord) TableName() string { return "movie_credits" }
func (MovieGenre) TableName() string         { return "movie_genres" }

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(&MovieGenre{}, &MovieRecord{}, &GenreRecord{}, &PersonRecord{}, &MovieCreditRecord{})
}
