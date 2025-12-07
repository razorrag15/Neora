"""
API v1 routes - Simplified for market dashboard.
"""

from fastapi import APIRouter

from app.api.v1 import (
    auth,
    admin,
    market_data
)

api_router = APIRouter(prefix="/api/v1")

# Core routes for market dashboard
api_router.include_router(auth.router)
api_router.include_router(admin.router)
api_router.include_router(market_data.router)
