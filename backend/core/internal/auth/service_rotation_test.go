package auth

import (
	"context"
	"testing"
	"time"

	"github.com/StartLivin/screek/backend/internal/auth/jwt"
	"github.com/StartLivin/screek/backend/internal/shared/config"
	"github.com/StartLivin/screek/backend/internal/shared/crypto"
	"github.com/StartLivin/screek/backend/internal/shared/httputil"
	"github.com/StartLivin/screek/backend/internal/shared/testutil"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_Auth_TokenRotation_FamilyRevocation(t *testing.T) {
	rdb := testutil.SetupTestRedis(t)
	defer testutil.CleanupRedis(t, rdb)

	cfg := &config.Config{JWTSecret: "test_secret"}
	jwtSvc := jwt.NewJWTService(cfg)
	repo := new(MockUserRepo)
	authSvc := NewAuthService(repo, jwtSvc, rdb, nil)

	userID := uuid.New()
	hashedPassword, _ := crypto.HashPassword("rotation_password")
	userSummary := &UserSummary{
		ID:       userID,
		Username: "rotation_user",
		Email:    "rotation@test.com",
		Password: hashedPassword,
		Role:     httputil.RoleUser,
	}

	repo.On("GetUserByUsername", mock.Anything, "rotation_user").Return(userSummary, nil)
	repo.On("GetUserByID", mock.Anything, userID).Return(userSummary, nil)

	ctx := context.Background()

	testutil.CleanupRedis(t, rdb)

	resp1, err := authSvc.Login(ctx, "rotation_user", "rotation_password")
	require.NoError(t, err)
	rt1 := resp1.RefreshToken

	time.Sleep(1100 * time.Millisecond)

	resp2, err := authSvc.RefreshToken(ctx, rt1)
	require.NoError(t, err)
	rt2 := resp2.RefreshToken
	assert.NotEqual(t, rt1, rt2)

	exists, _ := rdb.Exists(ctx, "refresh:"+userID.String()+":"+rt1).Result()
	assert.Equal(t, int64(0), exists, "RT1 deveria ter sido removido")
	exists, _ = rdb.Exists(ctx, "refresh:"+userID.String()+":"+rt2).Result()
	assert.Equal(t, int64(1), exists, "RT2 deveria existir")

	_, err = authSvc.RefreshToken(ctx, rt1)
	assert.ErrorIs(t, err, ErrRefreshRevoked)

	exists, _ = rdb.Exists(ctx, "refresh:"+userID.String()+":"+rt2).Result()
	assert.Equal(t, int64(0), exists, "RT2 deveria ter sido revogado após reuso de RT1")

	_, err = authSvc.RefreshToken(ctx, rt2)
	assert.ErrorIs(t, err, ErrRefreshRevoked)
}
