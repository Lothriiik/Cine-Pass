package analytics

import (
	"time"
)

type DailyCinemaStats struct {
	ID            uint
	Date          time.Time
	CinemaID      int
	TotalRevenue  int64
	TicketsSold   int
	OccupancyRate float64
	CreatedAt     time.Time
}

type DailyMovieStats struct {
	ID           uint
	Date         time.Time
	MovieID      int
	TotalRevenue int64
	TicketsSold  int
	CreatedAt    time.Time
}

type DailyCinemaStatsResponseDTO struct {
	Date          time.Time
	CinemaName    string
	TotalRevenue  float64
	TicketsSold   int
	OccupancyRate float64
}

type AnalyticsSummaryResponseDTO struct {
	StartDate     time.Time
	EndDate       time.Time
	GlobalRevenue float64
	GlobalTickets int
	StatsByCinema []DailyCinemaStatsResponseDTO
}

type MovieStatsDTO struct {
	MovieID      int
	MovieTitle   string
	TotalRevenue float64
	TicketsSold  int
}

type GenreStatsResponseDTO struct {
	GenreName    string
	TotalRevenue float64
}
