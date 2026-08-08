package letterboxd

import (
	"context"
	"encoding/csv"
	"io"
	"strconv"

	"github.com/google/uuid"
)

type Service struct {
	matcher MovieMatcher
	catalog CatalogProvider
}

func NewService(matcher MovieMatcher, catalog CatalogProvider) *Service {
	return &Service{
		matcher: matcher,
		catalog: catalog,
	}
}

type ImportSummary struct {
	Total   int `json:"total"`
	Success int `json:"success"`
	Failed  int `json:"failed"`
}

func (s *Service) ImportWatchedCSV(ctx context.Context, userID uuid.UUID, reader io.Reader) (*ImportSummary, error) {
	records, err := csv.NewReader(reader).ReadAll()
	if err != nil {
		return nil, err
	}

	summary := &ImportSummary{}
	if len(records) <= 1 {
		return summary, nil
	}

	for _, record := range records[1:] {
		summary.Total++
		name := record[1]
		year, _ := strconv.Atoi(record[2])

		movie, err := s.matcher.MatchMovieByTitleAndYear(ctx, name, year)
		if err != nil {
			summary.Failed++
			continue
		}

		err = s.catalog.LogMovie(ctx, userID, uint(movie.ID), 0, true, false)
		if err != nil {
			summary.Failed++
			continue
		}
		summary.Success++
	}

	return summary, nil
}

func (s *Service) ImportRatingsCSV(ctx context.Context, userID uuid.UUID, reader io.Reader) (*ImportSummary, error) {
	records, err := csv.NewReader(reader).ReadAll()
	if err != nil {
		return nil, err
	}

	summary := &ImportSummary{}
	if len(records) <= 1 {
		return summary, nil
	}

	for _, record := range records[1:] {
		summary.Total++
		name := record[1]
		year, _ := strconv.Atoi(record[2])
		rating, _ := strconv.ParseFloat(record[3], 64)

		movie, err := s.matcher.MatchMovieByTitleAndYear(ctx, name, year)
		if err != nil {
			summary.Failed++
			continue
		}

		err = s.catalog.LogMovie(ctx, userID, uint(movie.ID), rating, true, false)
		if err != nil {
			summary.Failed++
			continue
		}
		summary.Success++
	}

	return summary, nil
}

func (s *Service) ImportWatchlistCSV(ctx context.Context, userID uuid.UUID, reader io.Reader) (*ImportSummary, error) {
	records, err := csv.NewReader(reader).ReadAll()
	if err != nil {
		return nil, err
	}

	summary := &ImportSummary{}
	if len(records) <= 1 {
		return summary, nil
	}

	for _, record := range records[1:] {
		summary.Total++
		name := record[1]
		year, _ := strconv.Atoi(record[2])

		movie, err := s.matcher.MatchMovieByTitleAndYear(ctx, name, year)
		if err != nil {
			summary.Failed++
			continue
		}

		err = s.catalog.AddToWatchlist(ctx, userID, uint(movie.ID))
		if err != nil {
			summary.Failed++
			continue
		}
		summary.Success++
	}

	return summary, nil
}
