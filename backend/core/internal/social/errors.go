package social

import "errors"

var (
	ErrPostNotFound        = errors.New("postagem não encontrada")
	ErrNotPostAuthor       = errors.New("você só pode editar seus próprios posts")
	ErrNoPermission        = errors.New("sem permissão para realizar esta ação")
	ErrInvalidPostType     = errors.New("post_type inválido")
	ErrContentInvalid      = errors.New("conteúdo deve ter entre 1 e 280 caracteres")
	ErrReferenceRequired   = errors.New("posts do tipo REVIEW ou SESSION_SHARE exigem reference_id")
	ErrReferenceNotAllowed = errors.New("posts do tipo TEXT não podem ter reference_id")
	ErrNotImplemented      = errors.New("não implementado")
)
