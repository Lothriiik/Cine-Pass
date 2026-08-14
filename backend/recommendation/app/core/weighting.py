"""
Módulo de vetorização ponderada — screeK Intelligence.

Transforma os metadados brutos dos filmes (gêneros, diretores, sinopse, etc.)
em vetores numéricos com pesos configuráveis.

Pesos definidos em config.py:
- Gênero:      0.20
- Direção:     0.15
- Sinopse:     0.15
- País:        0.10
- Keywords:    0.10
- Escala:      0.08
- Década:      0.07
- Estúdio:     0.05
- Elenco:      0.04
- Duração:     0.03
- Roteirista:  0.02
- Classif.:    0.01
"""


class FeatureWeighter:
    """Constrói vetores ponderados a partir dos metadados dos filmes."""

    def __init__(self):
        
        pass

    def build_feature_matrix(self, movies: list[dict]):
        """Constrói a matriz de features combinada com pesos."""
        
        pass
