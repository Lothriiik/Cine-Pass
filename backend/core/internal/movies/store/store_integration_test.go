package store

import (
	"context"
	"testing"

	"github.com/StartLivin/screek/backend/internal/movies"
	"github.com/StartLivin/screek/backend/internal/shared/testutil"
	"github.com/stretchr/testify/assert"
)

func Test_Store_SearchMovies(t *testing.T) {
	if testing.Short() {
		t.Skip("Pulando teste de integração de banco de dados")
	}
	db := testutil.SetupTestDB(t)
	AutoMigrate(db)
	testutil.CleanupDB(t, db)
	store := NewStore(db)

	movie1 := MovieRecord{Title: "The Matrix", Runtime: 136, TMDBID: 1}
	movie2 := MovieRecord{Title: "Inception", Runtime: 148, TMDBID: 2}
	db.Create(&movie1)
	db.Create(&movie2)

	t.Run("Busca por TMDBID", func(t *testing.T) {
		results, err := store.GetMovieByTMDBID(context.Background(), 1)
		assert.NoError(t, err)
		assert.Equal(t, "The Matrix", results.Title)
	})

	t.Run("Busca por ID Inexistente", func(t *testing.T) {
		_, err := store.GetMovieByTMDBID(context.Background(), 999)
		assert.ErrorIs(t, err, movies.ErrMovieNotFound)
	})
}

func Test_Store_SaveMovie(t *testing.T) {
	if testing.Short() {
		t.Skip("Pulando teste de integração de banco de dados")
	}
	db := testutil.SetupTestDB(t)
	AutoMigrate(db)
	testutil.CleanupDB(t, db)
	store := NewStore(db)

	movie := movies.Movie{Title: "Alien", TMDBID: 10}
	err := store.SaveMovie(context.Background(), &movie)
	assert.NoError(t, err)
}
