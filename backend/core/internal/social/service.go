package social

import (
	"context"

	"github.com/StartLivin/screek/backend/internal/shared/events"
	"github.com/StartLivin/screek/backend/internal/shared/httputil"
	"github.com/google/uuid"
)

type SocialService struct {
	store           SocialRepository
	events          *events.EventBus
	userProvider    UserProvider
	sessionProvider SessionProvider
}

func NewService(store SocialRepository, eventBus *events.EventBus, userProvider UserProvider, sessionProvider SessionProvider) *SocialService {
	return &SocialService{
		store:           store,
		events:          eventBus,
		userProvider:    userProvider,
		sessionProvider: sessionProvider,
	}
}

func (s *SocialService) CreatePost(ctx context.Context, userID uuid.UUID, req CreatePostRequest) (*Post, error) {
	if err := req.Validate(); err != nil {
		return nil, err
	}

	post := &Post{
		UserID:      userID,
		PostType:    PostType(req.PostType),
		Content:     req.Content,
		IsSpoiler:   req.IsSpoiler,
		ReferenceID: req.ReferenceID,
	}

	if err := s.store.CreatePost(ctx, post); err != nil {
		return nil, err
	}

	return post, nil
}

func (s *SocialService) UpdatePost(ctx context.Context, userID uuid.UUID, postID uint, req UpdatePostRequest) error {
	post, err := s.store.GetPostByID(ctx, postID)
	if err != nil {
		return ErrPostNotFound
	}

	if post.UserID != userID {
		return ErrNotPostAuthor
	}

	post.Content = req.Content
	post.IsSpoiler = req.IsSpoiler

	return s.store.UpdatePost(ctx, post)
}

func (s *SocialService) DeletePost(ctx context.Context, userID uuid.UUID, postID uint, role httputil.Role) error {
	post, err := s.store.GetPostByID(ctx, postID)
	if err != nil {
		return ErrPostNotFound
	}

	isAdmin := role == httputil.RoleAdmin
	if post.UserID != userID && !isAdmin {
		return ErrNoPermission
	}

	return s.store.DeletePost(ctx, postID)
}

func (s *SocialService) GetFeed(ctx context.Context, userID uuid.UUID, cursorID uint, limit int) ([]Post, uint, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}

	posts, err := s.store.GetFollowingFeed(ctx, userID, cursorID, limit)
	if err != nil {
		return nil, 0, err
	}

	var nextCursor uint
	if len(posts) == limit {
		nextCursor = posts[len(posts)-1].ID
	}

	return posts, nextCursor, nil
}

func (s *SocialService) GetGlobalFeed(ctx context.Context, cursorID uint, limit int) ([]Post, uint, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}

	posts, err := s.store.GetGlobalFeed(ctx, cursorID, limit)
	if err != nil {
		return nil, 0, err
	}

	var nextCursor uint
	if len(posts) == limit {
		nextCursor = posts[len(posts)-1].ID
	}

	return posts, nextCursor, nil
}

func (s *SocialService) ReplyToPost(ctx context.Context, userID uuid.UUID, parentID uint, req ReplyRequest) error {
	if err := req.Validate(); err != nil {
		return err
	}
	err := s.store.ReplyPost(ctx, userID, parentID, req.Content)
	if err == nil {
		parent, _ := s.store.GetPostByID(ctx, parentID)
		if parent != nil && parent.UserID != userID {
			s.events.Publish(events.EventCommentAdded, events.CommentAddedEvent{
				PostID:        parentID,
				UserID:        userID,
				ParentID:      parentID,
				ParentOwnerID: parent.UserID,
			})
		}
	}
	return err
}

func (s *SocialService) ToggleLike(ctx context.Context, userID uuid.UUID, postID uint) (bool, error) {
	liked, err := s.store.ToggleLike(ctx, userID, postID)
	if err == nil && liked {
		post, err := s.store.GetPostByID(ctx, postID)
		if err == nil && post.UserID != userID {
			s.events.Publish(events.EventPostLiked, events.PostLikedEvent{
				PostID:  postID,
				OwnerID: post.UserID,
				LikerID: userID,
			})
		}
	}
	return liked, err
}

func (s *SocialService) ToggleFollow(ctx context.Context, followerID, followeeID uuid.UUID) (bool, error) {
	followed, err := s.store.ToggleFollow(ctx, followerID, followeeID)
	if err == nil && followed {
		s.events.Publish(events.EventUserFollowed, events.UserFollowedEvent{
			FollowerID: followerID,
			FolloweeID: followeeID,
		})
	}
	return followed, err
}

func (s *SocialService) GetPostDetail(ctx context.Context, postID uint) (*Post, []Post, error) {
	post, replies, err := s.store.GetPostWithReplies(ctx, postID)
	if err != nil {
		return nil, nil, ErrPostNotFound
	}

	return post, replies, nil
}

func (s *SocialService) GetFollowers(ctx context.Context, userID uuid.UUID) ([]uuid.UUID, error) {
	return s.store.GetFollowers(ctx, userID)
}

func (s *SocialService) GetFollowing(ctx context.Context, userID uuid.UUID) ([]uuid.UUID, error) {
	return s.store.GetFollowing(ctx, userID)
}

// UserProvider returns the configured UserProvider for adapters/handlers that need user data.
func (s *SocialService) UserProvider() UserProvider {
	return s.userProvider
}

// SessionProvider returns the configured SessionProvider for adapters/handlers that need session post data.
func (s *SocialService) SessionProvider() SessionProvider {
	return s.sessionProvider
}
