package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/StartLivin/screek/backend/internal/shared/httputil"
	"github.com/StartLivin/screek/backend/internal/social"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type Handler struct {
	svc *social.SocialService
}

func NewHandler(svc *social.SocialService) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) RegisterRoutes(r chi.Router, authMiddleware func(http.Handler) http.Handler) {
	r.Group(func(r chi.Router) {
		r.Use(authMiddleware)

		r.Route("/social", func(r chi.Router) {
			r.Post("/posts", h.CreatePost)
			r.Put("/posts/{id}", h.UpdatePost)
			r.Delete("/posts/{id}", h.DeletePost)
			r.Post("/posts/{id}/reply", h.ReplyToPost)
			r.Post("/posts/{id}/like", h.ToggleLike)

			r.Get("/feed", h.GetFeed)
			r.Get("/feed/global", h.GetGlobalFeed)
			r.Get("/posts/{id}", h.GetPostDetail)

			r.Post("/users/{username}/follow", h.ToggleFollow)
			r.Get("/users/{id}/followers", h.GetFollowers)
			r.Get("/users/{id}/following", h.GetFollowing)
		})
	})
}

// @Summary Criar postagem
// @Description Cria um novo post (texto, review ou compartilhamento de sessão)
// @Tags Social
// @Accept json
// @Produce json
// @Param request body social.CreatePostRequest true "Dados do post"
// @Success 201 {object} social.PostResponseDTO
// @Security BearerAuth
// @Router /social/posts [post]
func (h *Handler) CreatePost(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(httputil.UserIDKey).(uuid.UUID)
	if !ok {
		httputil.WriteJSON(w, http.StatusUnauthorized, httputil.ErrorResponse{Error: "Não autorizado"})
		return
	}

	var req social.CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: "Payload JSON inválido"})
		return
	}

	post, err := h.svc.CreatePost(r.Context(), userID, social.CreatePostRequest{
		PostType:    req.PostType,
		Content:     req.Content,
		IsSpoiler:   req.IsSpoiler,
		ReferenceID: req.ReferenceID,
	})
	if err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: err.Error()})
		return
	}

	author := "Usuário Desconhecido"
	if user, err := h.svc.UserProvider().GetUserByID(r.Context(), post.UserID); err == nil && user != nil {
		author = user.Username
	}

	response := PostResponseDTO{
		ID:           post.ID,
		Author:       author,
		PostType:     string(post.PostType),
		Content:      post.Content,
		IsSpoiler:    post.IsSpoiler,
		LikesCount:   post.LikesCount,
		RepliesCount: post.RepliesCount,
		CreatedAt:    post.CreatedAt.Format("02/01 15:04"),
	}

	httputil.WriteJSON(w, http.StatusCreated, response)
}

// @Summary Editar postagem
// @Description Atualiza o conteúdo de um post existente (apenas o autor)
// @Tags Social
// @Accept json
// @Param id path int true "ID do Post"
// @Param request body social.UpdatePostRequest true "Novo conteúdo"
// @Success 200 {object} httputil.MessageResponse
// @Security BearerAuth
// @Router /social/posts/{id} [put]
func (h *Handler) UpdatePost(w http.ResponseWriter, r *http.Request) {
	postID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	userID, _ := r.Context().Value(httputil.UserIDKey).(uuid.UUID)

	var req social.UpdatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: "Payload inválido"})
		return
	}

	if err := h.svc.UpdatePost(r.Context(), userID, uint(postID), req); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: err.Error()})
		return
	}
	httputil.WriteJSON(w, http.StatusOK, httputil.MessageResponse{Message: "Post atualizado!"})
}

// @Summary Apagar postagem
// @Description Remove um post (autor ou admin)
// @Tags Social
// @Param id path int true "ID do Post"
// @Success 200 {object} httputil.MessageResponse
// @Security BearerAuth
// @Router /social/posts/{id} [delete]
func (h *Handler) DeletePost(w http.ResponseWriter, r *http.Request) {
	postID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	userID, _ := r.Context().Value(httputil.UserIDKey).(uuid.UUID)
	role, _ := r.Context().Value(httputil.UserRoleKey).(httputil.Role)

	if err := h.svc.DeletePost(r.Context(), userID, uint(postID), role); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: err.Error()})
		return
	}
	httputil.WriteJSON(w, http.StatusOK, httputil.MessageResponse{Message: "Post apagado!"})
}

// @Summary Meu feed
// @Description Retorna posts das pessoas que o usuário segue
// @Tags Social
// @Param cursor query int false "ID do último post visto (para paginação)"
// @Param limit query int false "Quantidade de itens"
// @Produce json
// @Success 200 {object} social.FeedResponse
// @Security BearerAuth
// @Router /social/feed [get]
func (h *Handler) GetFeed(w http.ResponseWriter, r *http.Request) {
	userID, _ := r.Context().Value(httputil.UserIDKey).(uuid.UUID)
	cursorID, _ := strconv.Atoi(r.URL.Query().Get("cursor"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	posts, nextCursor, err := h.svc.GetFeed(r.Context(), userID, uint(cursorID), limit)
	if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, httputil.ErrorResponse{Error: err.Error()})
		return
	}

	dtos := make([]PostResponseDTO, 0, len(posts))
	for _, p := range posts {
		author := "Usuário Desconhecido"
		if user, err := h.svc.UserProvider().GetUserByID(r.Context(), p.UserID); err == nil && user != nil {
			author = user.Username
		}

		dto := PostResponseDTO{
			ID:           p.ID,
			Author:       author,
			PostType:     string(p.PostType),
			Content:      p.Content,
			IsSpoiler:    p.IsSpoiler,
			LikesCount:   p.LikesCount,
			RepliesCount: p.RepliesCount,
			CreatedAt:    p.CreatedAt.Format("02/01 15:04"),
		}

		if p.PostType == social.PostTypeSessionShare && p.ReferenceID != nil {
			if sd, err := h.svc.SessionProvider().GetSessionPostData(r.Context(), *p.ReferenceID); err == nil {
				dto.SessionData = &PostSessionData{
					SessionID:  sd.SessionID,
					MovieTitle: sd.MovieTitle,
					PosterURL:  sd.PosterURL,
					StartTime:  sd.StartTime,
					RoomName:   sd.RoomName,
					CinemaName: sd.CinemaName,
				}
			}
		}
		dtos = append(dtos, dto)
	}

	httputil.WriteJSON(w, http.StatusOK, FeedResponse{
		Posts:      dtos,
		NextCursor: nextCursor,
	})
}

// @Summary Feed global (Explorar)
// @Description Retorna os posts mais recentes de todos os usuários
// @Tags Social
// @Param cursor query int false "Pagination cursor"
// @Produce json
// @Success 200 {object} social.FeedResponse
// @Security BearerAuth
// @Router /social/feed/global [get]
func (h *Handler) GetGlobalFeed(w http.ResponseWriter, r *http.Request) {
	cursorID, _ := strconv.Atoi(r.URL.Query().Get("cursor"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	posts, nextCursor, err := h.svc.GetGlobalFeed(r.Context(), uint(cursorID), limit)
	if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, httputil.ErrorResponse{Error: err.Error()})
		return
	}

	dtos := make([]PostResponseDTO, 0, len(posts))
	for _, p := range posts {
		author := "Usuário Desconhecido"
		if user, err := h.svc.UserProvider().GetUserByID(r.Context(), p.UserID); err == nil && user != nil {
			author = user.Username
		}

		dto := PostResponseDTO{
			ID:           p.ID,
			Author:       author,
			PostType:     string(p.PostType),
			Content:      p.Content,
			IsSpoiler:    p.IsSpoiler,
			LikesCount:   p.LikesCount,
			RepliesCount: p.RepliesCount,
			CreatedAt:    p.CreatedAt.Format("02/01 15:04"),
		}

		if p.PostType == social.PostTypeSessionShare && p.ReferenceID != nil {
			if sd, err := h.svc.SessionProvider().GetSessionPostData(r.Context(), *p.ReferenceID); err == nil {
				dto.SessionData = &PostSessionData{
					SessionID:  sd.SessionID,
					MovieTitle: sd.MovieTitle,
					PosterURL:  sd.PosterURL,
					StartTime:  sd.StartTime,
					RoomName:   sd.RoomName,
					CinemaName: sd.CinemaName,
				}
			}
		}
		dtos = append(dtos, dto)
	}

	httputil.WriteJSON(w, http.StatusOK, FeedResponse{
		Posts:      dtos,
		NextCursor: nextCursor,
	})
}

// @Summary Responder postagem
// @Description Cria um comentário/resposta em um post existente
// @Tags Social
// @Accept json
// @Param id path int true "ID do Post Pai"
// @Param request body social.ReplyRequest true "Conteúdo da resposta"
// @Success 201 {object} httputil.MessageResponse
// @Security BearerAuth
// @Router /social/posts/{id}/reply [post]
func (h *Handler) ReplyToPost(w http.ResponseWriter, r *http.Request) {
	parentID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	userID, _ := r.Context().Value(httputil.UserIDKey).(uuid.UUID)

	var req social.ReplyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: "JSON inválido"})
		return
	}

	if err := h.svc.ReplyToPost(r.Context(), userID, uint(parentID), req); err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: err.Error()})
		return
	}
	httputil.WriteJSON(w, http.StatusCreated, httputil.MessageResponse{Message: "Enviado!"})
}

// @Summary Curtir/Descurtir post
// @Description Alterna o estado de curtida de um post
// @Tags Social
// @Param id path int true "ID do Post"
// @Success 200 {object} social.ToggleLikeResponse
// @Security BearerAuth
// @Router /social/posts/{id}/like [post]
func (h *Handler) ToggleLike(w http.ResponseWriter, r *http.Request) {
	postID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	userID, _ := r.Context().Value(httputil.UserIDKey).(uuid.UUID)

	liked, err := h.svc.ToggleLike(r.Context(), userID, uint(postID))
	if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, httputil.ErrorResponse{Error: err.Error()})
		return
	}
	httputil.WriteJSON(w, http.StatusOK, ToggleLikeResponse{Message: "Ok", Liked: liked})
}

// @Summary Seguir/Deixar de seguir
// @Description Alterna o estado de acompanhamento de um usuário pelo username
// @Tags Social
// @Param username path string true "Username do alvo"
// @Success 200 {object} social.ToggleFollowResponse
// @Security BearerAuth
// @Router /social/users/{username}/follow [post]
func (h *Handler) ToggleFollow(w http.ResponseWriter, r *http.Request) {
	target := chi.URLParam(r, "username")
	userID, _ := r.Context().Value(httputil.UserIDKey).(uuid.UUID)

	targetUser, err := h.svc.UserProvider().GetUserByUsername(r.Context(), target)
	if err != nil {
		httputil.WriteJSON(w, http.StatusNotFound, httputil.ErrorResponse{Error: "usuário não encontrado"})
		return
	}

	followed, err := h.svc.ToggleFollow(r.Context(), userID, targetUser.ID)
	if err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: err.Error()})
		return
	}
	httputil.WriteJSON(w, http.StatusOK, ToggleFollowResponse{Message: "Ok", IsFollowing: followed})
}

// @Summary Detalhes da postagem
// @Description Retorna o post e suas respostas
// @Tags Social
// @Produce json
// @Param id path int true "ID do Post"
// @Success 200 {object} social.PostDetailResponseDTO
// @Security BearerAuth
// @Router /social/posts/{id} [get]
func (h *Handler) GetPostDetail(w http.ResponseWriter, r *http.Request) {
	postID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	post, replies, err := h.svc.GetPostDetail(r.Context(), uint(postID))
	if err != nil {
		httputil.WriteJSON(w, http.StatusNotFound, httputil.ErrorResponse{Error: err.Error()})
		return
	}

	author := "Usuário Desconhecido"
	if user, err := h.svc.UserProvider().GetUserByID(r.Context(), post.UserID); err == nil && user != nil {
		author = user.Username
	}

	postDTO := PostResponseDTO{
		ID:           post.ID,
		Author:       author,
		PostType:     string(post.PostType),
		Content:      post.Content,
		IsSpoiler:    post.IsSpoiler,
		LikesCount:   post.LikesCount,
		RepliesCount: post.RepliesCount,
		CreatedAt:    post.CreatedAt.Format("02/01 15:04"),
	}

	if post.PostType == social.PostTypeSessionShare && post.ReferenceID != nil {
		if sd, err := h.svc.SessionProvider().GetSessionPostData(r.Context(), *post.ReferenceID); err == nil {
			postDTO.SessionData = &PostSessionData{
				SessionID:  sd.SessionID,
				MovieTitle: sd.MovieTitle,
				PosterURL:  sd.PosterURL,
				StartTime:  sd.StartTime,
				RoomName:   sd.RoomName,
				CinemaName: sd.CinemaName,
			}
		}
	}

	repliesDTO := make([]PostResponseDTO, 0, len(replies))
	for _, reply := range replies {
		rAuthor := "Usuário Desconhecido"
		if rUser, err := h.svc.UserProvider().GetUserByID(r.Context(), reply.UserID); err == nil && rUser != nil {
			rAuthor = rUser.Username
		}

		dt := PostResponseDTO{
			ID:           reply.ID,
			Author:       rAuthor,
			PostType:     string(reply.PostType),
			Content:      reply.Content,
			IsSpoiler:    reply.IsSpoiler,
			LikesCount:   reply.LikesCount,
			RepliesCount: reply.RepliesCount,
			CreatedAt:    reply.CreatedAt.Format("02/01 15:04"),
		}
		repliesDTO = append(repliesDTO, dt)
	}

	httputil.WriteJSON(w, http.StatusOK, PostDetailResponseDTO{
		Post:    postDTO,
		Replies: repliesDTO,
	})
}

// @Summary Listar seguidores
// @Description Retorna a lista de usuários que seguem o alvo
// @Tags Social
// @Produce json
// @Param id path string true "UUID do usuário"
// @Success 200 {array} social.UserFollowResponseDTO
// @Security BearerAuth
// @Router /social/users/{id}/followers [get]
func (h *Handler) GetFollowers(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: "ID de usuário inválido"})
		return
	}
	ids, err := h.svc.GetFollowers(r.Context(), userID)
	if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, httputil.ErrorResponse{Error: err.Error()})
		return
	}

	dtos := make([]UserFollowResponseDTO, 0, len(ids))
	for _, id := range ids {
		username := "Usuário"
		avatarURL := ""
		if user, err := h.svc.UserProvider().GetUserByID(r.Context(), id); err == nil && user != nil {
			username = user.Username
			avatarURL = user.AvatarURL
		}

		dtos = append(dtos, UserFollowResponseDTO{
			UserID:    id.String(),
			Username:  username,
			AvatarURL: avatarURL,
		})
	}

	httputil.WriteJSON(w, http.StatusOK, dtos)
}

// @Summary Listar seguindo
// @Description Retorna a lista de usuários que o alvo segue
// @Tags Social
// @Produce json
// @Param id path string true "UUID do usuário"
// @Success 200 {array} social.UserFollowResponseDTO
// @Security BearerAuth
// @Router /social/users/{id}/following [get]
func (h *Handler) GetFollowing(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httputil.WriteJSON(w, http.StatusBadRequest, httputil.ErrorResponse{Error: "ID de usuário inválido"})
		return
	}
	ids, err := h.svc.GetFollowing(r.Context(), userID)
	if err != nil {
		httputil.WriteJSON(w, http.StatusInternalServerError, httputil.ErrorResponse{Error: err.Error()})
		return
	}

	dtos := make([]UserFollowResponseDTO, 0, len(ids))
	for _, id := range ids {
		username := "Usuário"
		avatarURL := ""
		if user, err := h.svc.UserProvider().GetUserByID(r.Context(), id); err == nil && user != nil {
			username = user.Username
			avatarURL = user.AvatarURL
		}

		dtos = append(dtos, UserFollowResponseDTO{
			UserID:    id.String(),
			Username:  username,
			AvatarURL: avatarURL,
		})
	}

	httputil.WriteJSON(w, http.StatusOK, dtos)
}
