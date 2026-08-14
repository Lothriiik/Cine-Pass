"""
Parser do CSV de avaliações exportado do Letterboxd.

O Letterboxd permite exportar seus dados em CSV com colunas:
- Date, Name, Year, Letterboxd URI, Rating
"""


class LetterboxdParser:
    """Processa arquivos CSV exportados do Letterboxd."""

    def __init__(self):
        # TODO
        pass

    def parse_ratings_csv(self, file_content: bytes) -> list[dict]:
        """Faz parse do ratings.csv e retorna lista de avaliações."""
        # TODO
        return []
