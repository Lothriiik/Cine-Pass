from fastapi import APIRouter

router = APIRouter(prefix="/imports", tags=["Imports"])


@router.post("/letterboxd")
def import_letterboxd():
    """Importa histórico de avaliações do Letterboxd via CSV."""
    # TODO: Implementar na Etapa posterior (Fase 4)
    return {"status": "pending_implementation"}
