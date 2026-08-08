package auth

import (
	"context"
	"time"

	"github.com/StartLivin/screek/backend/internal/shared/httputil"
	"github.com/google/uuid"
	goredis "github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/mock"
)

type MockUserRepo struct {
	mock.Mock
}

func (m *MockUserRepo) GetUserByUsername(ctx context.Context, username string) (*UserSummary, error) {
	args := m.Called(ctx, username)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*UserSummary), args.Error(1)
}

func (m *MockUserRepo) GetUserByID(ctx context.Context, id uuid.UUID) (*UserSummary, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*UserSummary), args.Error(1)
}

func (m *MockUserRepo) GetUserByEmail(ctx context.Context, email string) (*UserSummary, error) {
	args := m.Called(ctx, email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*UserSummary), args.Error(1)
}

func (m *MockUserRepo) UpdateUserPassword(ctx context.Context, user *UserSummary) error {
	args := m.Called(ctx, user)
	return args.Error(0)
}

func (m *MockUserRepo) UpdateUserRole(ctx context.Context, user *UserSummary, role httputil.Role) error {
	args := m.Called(ctx, user, role)
	return args.Error(0)
}

type MockRedisClient struct {
	mock.Mock
}

func (m *MockRedisClient) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) *goredis.StatusCmd {
	args := m.Called(ctx, key, value, expiration)
	return goredis.NewStatusResult(args.String(0), args.Error(1))
}

func (m *MockRedisClient) Get(ctx context.Context, key string) *goredis.StringCmd {
	args := m.Called(ctx, key)
	return goredis.NewStringResult(args.String(0), args.Error(1))
}

func (m *MockRedisClient) Del(ctx context.Context, keys ...string) *goredis.IntCmd {
	args := m.Called(ctx, keys)
	return goredis.NewIntResult(int64(args.Int(0)), args.Error(1))
}

func (m *MockRedisClient) Exists(ctx context.Context, keys ...string) *goredis.IntCmd {
	args := m.Called(ctx, keys)
	return goredis.NewIntResult(int64(args.Int(0)), args.Error(1))
}

func (m *MockRedisClient) Scan(ctx context.Context, cursor uint64, match string, count int64) *goredis.ScanCmd {
	args := m.Called(ctx, cursor, match, count)
	cmd := goredis.NewScanCmd(ctx, nil, "scan", cursor, "match", match, "count", count)
	cmd.SetVal(args.Get(0).([]string), uint64(args.Int(1)))
	cmd.SetErr(args.Error(2))
	return cmd
}

func (m *MockRedisClient) Incr(ctx context.Context, key string) *goredis.IntCmd {
	args := m.Called(ctx, key)
	return goredis.NewIntResult(int64(args.Int(0)), args.Error(1))
}

func (m *MockRedisClient) Expire(ctx context.Context, key string, expiration time.Duration) *goredis.BoolCmd {
	args := m.Called(ctx, key, expiration)
	return goredis.NewBoolResult(args.Bool(0), args.Error(1))
}

type MockMailer struct {
	mock.Mock
}

func (m *MockMailer) SendPasswordReset(ctx context.Context, to, token string) error {
	args := m.Called(ctx, to, token)
	return args.Error(0)
}

func (m *MockMailer) SendTicketEmail(ctx context.Context, to, userName, qrCode string) error {
	args := m.Called(ctx, to, userName, qrCode)
	return args.Error(0)
}
