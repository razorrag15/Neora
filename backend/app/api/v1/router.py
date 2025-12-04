"""
Main API Router
Combines all API routes
"""
from fastapi import APIRouter
from app.api.v1 import auth, market, websocket, test

api_router = APIRouter()

# Include sub-routers
api_router.include_router(test.router)  # Test endpoints first (no auth needed)
api_router.include_router(auth.router)
api_router.include_router(market.router)
api_router.include_router(websocket.router)