from fastapi import APIRouter

router = APIRouter(prefix="/similar", tags=["Similarity"])


@router.get("/{movie_id}")
def get_similar_movies(movie_id: int, top_n: int = 10):
    """Retorna os filmes mais similares a um filme específico."""
    
    return {"movie_id": movie_id, "similar": [], "status": "pending_implementation"}
