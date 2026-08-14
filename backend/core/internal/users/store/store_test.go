package store_test

import (
	"context"
	"testing"
	"time"

	moviestore "github.com/StartLivin/screek/backend/internal/movies/store"
	"github.com/StartLivin/screek/backend/internal/shared/testutil"
	"github.com/StartLivin/screek/backend/internal/users"
	userstore "github.com/StartLivin/screek/backend/internal/users/store"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestStore_Integracao(t *testing.T) {
	if testing.Short() {
		t.Skip("Pulando teste de integração de banco de dados")
	}
	db := testutil.SetupTestDB(t)

	_ = db.Migrator().DropTable("user_favorite_movies", "movie_genres")
	moviestore.AutoMigrate(db)
	userstore.AutoMigrate(db)

	db.Exec(`CREATE TABLE IF NOT EXISTS movie_logs (
		user_id uuid NOT NULL,
		movie_id integer NOT NULL,
		watched boolean NOT NULL DEFAULT true,
		rating numeric NOT NULL DEFAULT 0,
		liked boolean NOT NULL DEFAULT false,
		created_at timestamp with time zone NOT NULL DEFAULT now(),
		updated_at timestamp with time zone NOT NULL DEFAULT now(),
		PRIMARY KEY (user_id, movie_id)
	)`)

	testutil.CleanupDB(t, db)
	store := userstore.NewStore(db)
	ctx := context.Background()

	t.Run("CRUD_Basico", func(t *testing.T) {
		userID := uuid.New()
		user := &users.User{
			ID:       userID,
			Username: "testuser",
			Name:     "Test User",
			Email:    "test@example.com",
			Password: "hashed_password",
		}

		err := store.CreateUser(ctx, user)
		require.NoError(t, err)

		found, err := store.GetUserByID(ctx, userID)
		require.NoError(t, err)
		assert.Equal(t, "testuser", found.Username)

		found2, err := store.GetUserByUsername(ctx, "testuser")
		require.NoError(t, err)
		assert.Equal(t, userID, found2.ID)

		results, err := store.SearchUsers(ctx, "Test")
		require.NoError(t, err)
		assert.NotEmpty(t, results)
	})

	t.Run("Favoritos_ManyToMany", func(t *testing.T) {
		userID := uuid.New()
		_ = store.CreateUser(ctx, &users.User{ID: userID, Username: "favuser", Email: "fav@test.com", Password: "p", Name: "N"})

		movie := moviestore.MovieRecord{TMDBID: 123, Title: "Movie A", ReleaseDate: time.Now()}
		db.Create(&movie)

		err := store.AddFavorite(ctx, userID, movie.ID)
		require.NoError(t, err)

		user, _ := store.GetUserByID(ctx, userID)
		assert.Len(t, user.FavoriteMovies, 1)
		assert.Equal(t, 123, user.FavoriteMovies[0])

		err = store.RemoveFavorite(ctx, userID, movie.ID)
		require.NoError(t, err)

		user, _ = store.GetUserByID(ctx, userID)
		assert.Len(t, user.FavoriteMovies, 0)
	})

	t.Run("Estatisticas_E_TopGenre", func(t *testing.T) {
		userID := uuid.New()
		_ = store.CreateUser(ctx, &users.User{ID: userID, Username: "statsuser", Email: "stats@test.com", Password: "p", Name: "N"})

		err := store.IncrementUserStats(ctx, userID, 2, 240)
		require.NoError(t, err)

		stats, err := store.GetUserStats(ctx, userID)
		require.NoError(t, err)
		assert.Equal(t, 2, stats.TotalMovies)
		assert.Equal(t, 240, stats.TotalMinutes)

		genreAction := moviestore.GenreRecord{Name: "Action", TMDBID: 28}
		genreDrama := moviestore.GenreRecord{Name: "Drama", TMDBID: 18}
		db.Create(&genreAction)
		db.Create(&genreDrama)

		movie1 := moviestore.MovieRecord{TMDBID: 101, Title: "Action 1", ReleaseDate: time.Now()}
		movie2 := moviestore.MovieRecord{TMDBID: 102, Title: "Drama 1", ReleaseDate: time.Now()}
		movie3 := moviestore.MovieRecord{TMDBID: 103, Title: "Action 2", ReleaseDate: time.Now()}
		db.Create(&movie1)
		db.Create(&movie2)
		db.Create(&movie3)

		db.Exec("INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)", movie1.ID, genreAction.ID)
		db.Exec("INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)", movie2.ID, genreDrama.ID)
		db.Exec("INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)", movie3.ID, genreAction.ID)

		log1 := map[string]interface{}{"user_id": userID, "movie_id": movie1.ID, "watched": true, "rating": 0.0, "liked": false}
		log2 := map[string]interface{}{"user_id": userID, "movie_id": movie2.ID, "watched": true, "rating": 0.0, "liked": false}
		log3 := map[string]interface{}{"user_id": userID, "movie_id": movie3.ID, "watched": true, "rating": 0.0, "liked": false}

		require.NoError(t, db.Table("movie_logs").Create(log1).Error)
		require.NoError(t, db.Table("movie_logs").Create(log2).Error)
		require.NoError(t, db.Table("movie_logs").Create(log3).Error)

		var mCount int64
		db.Table("movie_genres").Count(&mCount)
		t.Logf("Rows in movie_genres: %d", mCount)
		db.Table("movie_logs").Count(&mCount)
		t.Logf("Rows in movie_logs: %d", mCount)

		topGenreID, err := store.GetTopGenreByUsage(ctx, userID)
		require.NoError(t, err)
		require.NotNil(t, topGenreID, "TopGenreID não deve ser nil - nenhuma correspondência encontrada no JOIN")
		assert.Equal(t, genreAction.ID, *topGenreID)
	})
}
