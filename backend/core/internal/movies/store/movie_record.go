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
	Genres           []GenreRecord       `gorm:"many2many:movie_genres;"`
	Credits          []MovieCreditRecord `gorm:"foreignKey:MovieID;references:ID"`
}

type GenreRecord struct {
	ID     int           `gorm:"primaryKey;autoIncrement"`
	TMDBID int           `gorm:"not null;uniqueIndex"`
	Name   string        `gorm:"not null"`
	Movies []MovieRecord `gorm:"many2many:movie_genres;"`
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

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(&MovieRecord{}, &GenreRecord{}, &PersonRecord{}, &MovieCreditRecord{})
}
