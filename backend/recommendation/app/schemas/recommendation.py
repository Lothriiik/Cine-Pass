from pydantic import BaseModel, Field

class SimilarMovie(BaseModel):
    """Um filme similar com seu score de similaridade."""

    movie_id: int
    similarity_score: float = Field(ge=0.0, le=1.0, description="Score de similaridade entre 0.0 e 1.0")


class SimilarMoviesResponse(BaseModel):
    """Resposta do endpoint de filmes similares."""

    movie_id: int
    similar_movies: list[SimilarMovie] = Field(default=[], description="Lista de filmes similares com seus scores de similaridade")


class Recommendation(BaseModel):
    """Uma recomendação individual para o usuário."""

    movie_id: int
    score: float = Field(ge=0.0, le=1.0, description="Score da recomendação entre 0.0 e 1.0")
    reason: str = Field(default="", description="Motivo da recomendação (ex: 'similaridade com filmes assistidos')")
    is_niche_breaker: bool = Field(default=False, description="Indica se a recomendação é um 'niche breaker' (filme fora do perfil usual do usuário)")


class RecommendationResponse(BaseModel):
    """Resposta do endpoint de recomendações."""

    user_id: str
    total: int
    recommendations: list[Recommendation] = Field(default=[], description="Lista de recomendações para o usuário")

class UserRating(BaseModel):
    """Uma avaliação individual do usuário."""
    movie_id: int
    rating: float = Field(ge=0.5, le=5.0, description="Avaliação do usuário entre 0.5 e 5.0")    
    watched_at: str = Field(default="", description="Data em que o usuário assistiu ao filme (YYYY-MM-DD)")               


class UserProfile(BaseModel):
    """Perfil de avaliações do usuário para gerar recomendações."""
    user_id: str
    ratings: list[UserRating] = Field(default=[], description="Lista de avaliações do usuário")