"""
NEORA FastAPI Backend - Main Application
Based on Kotak Neo API v2 Architecture
Real-time Stock Market Data Platform
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.router import api_router
from app.core.exceptions import NeoraAPIException
from app.services.neo_client import neo_client

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("=" * 60)
    print("🚀 NEORA Backend Starting...")
    print("=" * 60)
    print(f"📝 Environment: {settings.ENVIRONMENT}")
    print(f"🔧 Debug Mode: {settings.DEBUG}")
    print(f"🌐 Base URL: {settings.NEO_BASE_URL}")
    print(f"📚 API Documentation: http://localhost:{settings.PORT}/api/docs")
    print(f"🔌 WebSocket: ws://localhost:{settings.PORT}/api/v1/ws/market-feed")
    print("=" * 60)
    yield
    # Shutdown
    print("=" * 60)
    print("👋 NEORA Backend Shutting Down...")
    await neo_client.close()
    print("✅ Cleanup complete")
    print("=" * 60)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    # NEORA Trading Platform API
    
    Real-time stock market data platform powered by Kotak Neo API v2.
    
    ## Features
    
    - 📊 **Real-time Stock Quotes**: Get live market data
    - 🔍 **Stock Search**: Search stocks across NSE, BSE, and other exchanges
    - 📈 **Market Indices**: Track NIFTY, SENSEX, and other indices
    - 🌐 **WebSocket Support**: Real-time price updates via WebSocket
    - 📉 **OHLC Data**: Access Open, High, Low, Close data
    - 💹 **Market Depth**: View bid/ask prices and quantities
    
    ## Getting Started
    
    1. **Authentication** (Optional for quotes): Use `/api/v1/auth/totp-login` and `/api/v1/auth/totp-validate`
    2. **Get Quotes**: Use `/api/v1/market/quotes` to get real-time stock prices
    3. **Search Stocks**: Use `/api/v1/market/search` to find instrument tokens
    4. **WebSocket**: Connect to `ws://localhost:8000/api/v1/ws/market-feed` for live updates
    
    ## Exchange Segments
    
    - `nse_cm`: NSE Cash Market
    - `bse_cm`: BSE Cash Market
    - `nse_fo`: NSE Futures & Options
    - `bse_fo`: BSE Futures & Options
    - `mcx_fo`: MCX Futures & Options
    
    """,
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(NeoraAPIException)
async def neora_exception_handler(request: Request, exc: NeoraAPIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details
            }
        }
    )

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "NEORA Trading Platform API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/api/docs",
        "websocket": f"ws://localhost:{settings.PORT}/api/v1/ws/market-feed",
        "status": "running",
        "features": [
            "Real-time stock quotes",
            "Market data search",
            "Market indices",
            "WebSocket live feeds",
            "OHLC data",
            "Market depth"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION,
        "neo_api": settings.NEO_BASE_URL
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )