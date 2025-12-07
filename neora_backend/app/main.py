"""
FastAPI application main module - Simplified for market dashboard.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()), 
    format=settings.log_format
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting NEORA Market Dashboard API")
    logger.info(f"Environment: {settings.environment}")
    logger.info("TOTP authentication enabled")
    logger.info("Ready to serve market data")

    yield

    # Shutdown
    logger.info("Shutting down NEORA Market Dashboard API")


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""

    app = FastAPI(
        title="NEORA Market Dashboard API",
        description="Simple market dashboard with NIFTY 50 and SENSEX data",
        version="1.0.0",
        debug=settings.debug,
        lifespan=lifespan,
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routes
    app.include_router(api_router)

    # Health check endpoint
    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {
            "status": "healthy",
            "service": "NEORA Market Dashboard API",
            "version": "1.0.0",
            "environment": settings.environment,
        }

    # Root endpoint
    @app.get("/")
    async def root():
        """Root endpoint."""
        return {
            "message": "Welcome to NEORA Market Dashboard API",
            "version": "1.0.0",
            "docs": "/docs",
            "health": "/health",
            "endpoints": {
                "admin_totp": "/api/v1/admin/totp/current",
                "auth_login": "/api/v1/auth/login",
                "market_dashboard": "/api/v1/market/dashboard"
            }
        }

    return app


# Create the application instance
app = create_application()
