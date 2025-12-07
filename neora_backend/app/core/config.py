"""
Application configuration - Simplified for market dashboard.
"""

from functools import lru_cache
from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable mapping."""

    # Application Configuration
    app_name: str = Field(default="NEORA Market Dashboard", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="VERSION")
    debug: bool = Field(default=False, alias="DEBUG")
    environment: str = Field(default="development", alias="ENVIRONMENT")

    # Server Configuration
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=4000, alias="PORT")

    # CORS Configuration
    allowed_origins_str: str = Field(default="*", alias="ALLOWED_ORIGINS_STR")

    @property
    def allowed_origins(self) -> List[str]:
        """Parse CORS origins from string."""
        if isinstance(self.allowed_origins_str, str):
            return [origin.strip() for origin in self.allowed_origins_str.split(",")]
        return ["*"]

    # Kite Connect API Configuration
    kite_api_key: str = Field(default="", alias="KITE_API_KEY")
    kite_api_secret: str = Field(default="", alias="KITE_API_SECRET")
    kite_access_token: Optional[str] = Field(default=None, alias="KITE_ACCESS_TOKEN")

    # Logging Configuration
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        alias="LOG_FORMAT",
    )

    model_config = {
        "env_file": "docker_config.env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",  # Ignore extra fields from env file
    }


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
