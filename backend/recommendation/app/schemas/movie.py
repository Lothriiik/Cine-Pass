from pydantic import BaseModel, Field, computed_field


class MovieMetadata(BaseModel):
    """Schema dos metadados de um filme recebido do backend Go."""

    id: int
    title: str = Field(default="", description="Título do filme")
    genres: list[str] = Field(default=[], description="Lista de gêneros do filme")         
    directors: list[str] = Field(default=[], description="Lista de diretores do filme")
    synopsis: str = Field(default="", description="Sinopse do filme")
    cast: list[str] = Field(default=[], description="Lista de atores do filme")
    country: list[str] = Field(default=[], description="Lista de países do filme")
    keywords: list[str] = Field(default=[], description="Lista de palavras-chave do filme")
    budget: int = Field(default=0, ge=0, description="Orçamento do filme em dólares")   
    vote_count: int = Field(default=0, ge=0, description="Número de votos recebidos pelo filme")
    runtime: int = Field(default=0, ge=0, description="Duração do filme em minutos")
    year: int = Field(default=0, ge=0, description="Ano de lançamento do filme")                   
    studios: list[str] = Field(default=[], description="Lista de estúdios/produtoras")
    writers: list[str] = Field(default=[], description="Lista de roteiristas")
    certification: str = Field(default="", description="Classificação indicativa (R, PG-13...)")    

    @computed_field(description="Década do filme (ex: 1980s, 2010s)")
    @property
    def decade(self) -> str:
        if self.year == 0:
            return "unknown"
        base = (self.year // 10) * 10
        return f"{base}s"   
    
    @computed_field(description="Escala de produção do filme (short, standard, long, epic)")
    @property
    def runtime_category(self) -> str:
        if self.runtime <= 0:
            return "unknown"
        if self.runtime < 90:
            return "short"       
        if self.runtime <= 120:
            return "standard"   
        if self.runtime <= 150:
            return "long"        
        return "epic"            


class MovieCatalog(BaseModel):
    """Lista de filmes para carregar no motor."""

    movies: list[MovieMetadata]
