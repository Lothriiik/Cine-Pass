from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configurações do serviço de recomendação."""

    APP_NAME: str = "screeK Intelligence Service"
    APP_VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8081
    DEBUG: bool = True

    WEIGHT_GENRE: float = 0.20
    WEIGHT_DIRECTOR: float = 0.15
    WEIGHT_SYNOPSIS: float = 0.15
    WEIGHT_COUNTRY: float = 0.10
    WEIGHT_KEYWORDS: float = 0.10
    WEIGHT_PRODUCTION_SCALE: float = 0.08
    WEIGHT_DECADE: float = 0.07
    WEIGHT_STUDIO: float = 0.05
    WEIGHT_CAST: float = 0.04
    WEIGHT_RUNTIME: float = 0.03
    WEIGHT_WRITER: float = 0.02
    WEIGHT_RATING_CERT: float = 0.01

    class Config:
        env_file = ".env"


settings = Settings()
