package testutil

import (
	"os"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func SetupTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=password dbname=screek_test port=5432 sslmode=disable TimeZone=America/Sao_Paulo"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	require.NoError(t, err, "falha ao conectar no banco de teste")

	return db
}

func CleanupDB(t *testing.T, db *gorm.DB) {
	t.Helper()

	var tables []string
	db.Raw("SELECT tablename FROM pg_tables WHERE schemaname = 'public'").Scan(&tables)

	var validTables []string
	for _, table := range tables {
		if table != "spatial_ref_sys" {
			validTables = append(validTables, table)
		}
	}

	if len(validTables) > 0 {
		query := "TRUNCATE TABLE " + strings.Join(validTables, ", ") + " RESTART IDENTITY CASCADE"
		db.Exec(query)
	}
}
