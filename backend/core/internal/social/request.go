package social

import "github.com/google/uuid"

type CreatePostRequest struct {
	PostType    string
	Content     string
	IsSpoiler   bool
	ReferenceID *uint
}

type UserSummary struct {
	ID        uuid.UUID
	Username  string
	AvatarURL string
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
