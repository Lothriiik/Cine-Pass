package social

import (
	"time"

	"github.com/google/uuid"
)

type PostType string

const (
	PostTypeText         PostType = "TEXT"
	PostTypeReview       PostType = "REVIEW"
	PostTypeSessionShare PostType = "SESSION_SHARE"
	PostTypeRepost       PostType = "REPOST"
)

type Post struct {
	ID           uint      `json:"id"`
	UserID       uuid.UUID `json:"user_id"`
	PostType     PostType  `json:"post_type"`
	Content      string    `json:"content"`
	IsSpoiler    bool      `json:"is_spoiler"`
	ReferenceID  *uint     `json:"reference_id"`
	ParentID     *uint     `json:"parent_id"`
	LikesCount   int       `json:"likes_count"`
	RepliesCount int       `json:"replies_count"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type PostLike struct {
	PostID    uint      `json:"post_id"`
	UserID    uuid.UUID `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

type Follow struct {
	ID         uint      `json:"id"`
	FollowerID uuid.UUID `json:"follower_id"`
	FolloweeID uuid.UUID `json:"followee_id"`
	CreatedAt  time.Time `json:"created_at"`
}

type PostSessionData struct {
	SessionID  int
	MovieTitle string
	PosterURL  string
	StartTime  string
	RoomName   string
	CinemaName string
}

type CreatePostRequest struct {
	PostType    string
	Content     string
	IsSpoiler   bool
	ReferenceID *uint
}

type UpdatePostRequest struct {
	Content   string
	IsSpoiler bool
}

type ReplyRequest struct {
	Content string
}

func (r *CreatePostRequest) Validate() error {
	validTypes := map[string]bool{
		"TEXT": true, "REVIEW": true, "SESSION_SHARE": true, "REPOST": true,
	}
	if !validTypes[r.PostType] {
		return ErrInvalidPostType
	}
	if len(r.Content) == 0 || len(r.Content) > 280 {
		return ErrContentInvalid
	}

	isReviewOrSession := r.PostType == "REVIEW" || r.PostType == "SESSION_SHARE"
	if isReviewOrSession && r.ReferenceID == nil {
		return ErrReferenceRequired
	}
	if r.PostType == "TEXT" && r.ReferenceID != nil {
		return ErrReferenceNotAllowed
	}

	return nil
}

func (r *UpdatePostRequest) Validate() error {
	if len(r.Content) == 0 || len(r.Content) > 280 {
		return ErrContentInvalid
	}
	return nil
}

func (r *ReplyRequest) Validate() error {
	if len(r.Content) == 0 || len(r.Content) > 280 {
		return ErrContentInvalid
	}
	return nil
}
