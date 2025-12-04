"""
Application Configuration
Manages environment variables and settings
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    ENVIRONMENT: str = Field(default="uat", description="Environment: uat or prod")
    DEBUG: bool = Field(default=True, description="Debug mode")
    
    # Kotak Neo API
    NEO_CONSUMER_KEY: str = Field(default="", description="Kotak Neo Consumer Key")
    NEO_FIN_KEY: str = Field(default="neotradeapi", description="Kotak Neo Fin Key")
    
    # API Configuration
    PROJECT_NAME: str = Field(default="NEORA Trading Platform", description="Project name")
    VERSION: str = Field(default="1.0.0", description="API version")
    API_V1_PREFIX: str = Field(default="/api/v1", description="API v1 prefix")
    
    # CORS
    CORS_ORIGINS: str = Field(
        default="http://localhost:5173,http://localhost:3000",
        description="Allowed CORS origins (comma-separated)"
    )
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    # JWT
    JWT_SECRET_KEY: str = Field(default="your-secret-key-change-in-production", description="JWT secret key")
    JWT_ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=1440, description="Token expiry in minutes")
    
    # Server
    HOST: str = Field(default="0.0.0.0", description="Server host")
    PORT: int = Field(default=8000, description="Server port")
    
    # Kotak Neo URLs
    @property
    def NEO_BASE_URL(self) -> str:
        """Get Kotak Neo base URL based on environment"""
        if self.ENVIRONMENT.lower() == "prod":
            return "https://mnapi.kotaksecurities.com/"
        return "https://nsbxapi-gw.kotaksecurities.com/"
    
    @property
    def NEO_WEBSOCKET_URL(self) -> str:
        """Get Kotak Neo WebSocket URL"""
        return "wss://mlhsm.kotaksecurities.com"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()