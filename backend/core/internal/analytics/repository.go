package analytics

import (
	"context"
	"time"
)

type AnalyticsRepository interface {
	GetStatsByDateRange(ctx context.Context, start, end time.Time) ([]DailyCinemaStats, error)
	GetTopMoviesByDateRange(ctx context.Context, start, end time.Time, limit int) ([]DailyMovieStats, error)
	GetGenreStats(ctx context.Context, start, end time.Time) (map[string]float64, error)
	GetRevenueTrends(ctx context.Context, start, end time.Time, period string) ([]DailyCinemaStats, error)

	CalculateDailyStats(ctx context.Context, date time.Time) ([]DailyCinemaStats, error)
	UpsertDailyStats(ctx context.Context, stats []DailyCinemaStats) error
	CalculateDailyMovieStats(ctx context.Context, date time.Time) ([]DailyMovieStats, error)
	UpsertDailyMovieStats(ctx context.Context, stats []DailyMovieStats) error
}
