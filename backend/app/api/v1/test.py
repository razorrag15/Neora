"""
Test/Demo API Endpoints
Mock data for testing without Kotak Neo API credentials
"""
from fastapi import APIRouter
from app.models.market import MarketResponse
from datetime import datetime

router = APIRouter(prefix="/test", tags=["Testing"])


@router.get("/health", response_model=dict)
async def test_health():
    """
    Backend health check
    
    Returns server status and configuration info.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "message": "Backend is running successfully!",
        "endpoints": {
            "swagger_ui": "/api/docs",
            "health": "/health",
            "test_market_data": "/api/v1/test/mock-market-data"
        }
    }


@router.get("/mock-market-data", response_model=MarketResponse)
async def get_mock_market_data():
    """
    Get mock market data for testing
    
    Returns sample stock market data without needing Kotak Neo API credentials.
    Use this to test the backend functionality.
    """
    mock_data = {
        "indices": [
            {
                "name": "NIFTY 50",
                "value": 19800.50,
                "change": 150.25,
                "change_percent": 0.76,
                "timestamp": datetime.now().isoformat()
            },
            {
                "name": "SENSEX",
                "value": 66500.30,
                "change": -85.40,
                "change_percent": -0.13,
                "timestamp": datetime.now().isoformat()
            },
            {
                "name": "NIFTY BANK",
                "value": 45200.75,
                "change": 320.50,
                "change_percent": 0.71,
                "timestamp": datetime.now().isoformat()
            }
        ],
        "stocks": [
            {
                "symbol": "RELIANCE",
                "last_price": 2456.50,
                "change": 25.30,
                "change_percent": 1.04,
                "volume": 5234567,
                "open": 2435.20,
                "high": 2465.80,
                "low": 2430.10,
                "close": 2431.20
            },
            {
                "symbol": "TCS",
                "last_price": 3580.75,
                "change": -12.50,
                "change_percent": -0.35,
                "volume": 2145890,
                "open": 3595.25,
                "high": 3600.00,
                "low": 3575.50,
                "close": 3593.25
            },
            {
                "symbol": "INFY",
                "last_price": 1567.30,
                "change": 18.75,
                "change_percent": 1.21,
                "volume": 3876543,
                "open": 1550.55,
                "high": 1570.00,
                "low": 1548.00,
                "close": 1548.55
            }
        ]
    }
    
    return {
        "success": True,
        "message": "Mock market data fetched successfully",
        "data": mock_data
    }


@router.get("/mock-stock/{symbol}", response_model=MarketResponse)
async def get_mock_stock_data(symbol: str):
    """
    Get mock data for a specific stock
    
    Try with: RELIANCE, TCS, INFY, HDFC, ICICIBANK
    """
    stock_data = {
        "RELIANCE": {
            "symbol": "RELIANCE",
            "company_name": "Reliance Industries Ltd",
            "last_price": 2456.50,
            "change": 25.30,
            "change_percent": 1.04,
            "volume": 5234567,
            "market_cap": "16,50,000 Cr",
            "pe_ratio": 25.6,
            "week_52_high": 2856.50,
            "week_52_low": 2150.30
        },
        "TCS": {
            "symbol": "TCS",
            "company_name": "Tata Consultancy Services",
            "last_price": 3580.75,
            "change": -12.50,
            "change_percent": -0.35,
            "volume": 2145890,
            "market_cap": "13,20,000 Cr",
            "pe_ratio": 28.4,
            "week_52_high": 4150.00,
            "week_52_low": 3150.25
        },
        "INFY": {
            "symbol": "INFY",
            "company_name": "Infosys Ltd",
            "last_price": 1567.30,
            "change": 18.75,
            "change_percent": 1.21,
            "volume": 3876543,
            "market_cap": "6,50,000 Cr",
            "pe_ratio": 27.8,
            "week_52_high": 1850.50,
            "week_52_low": 1350.75
        }
    }
    
    symbol_upper = symbol.upper()
    
    if symbol_upper in stock_data:
        return {
            "success": True,
            "message": f"Mock data for {symbol_upper} fetched successfully",
            "data": stock_data[symbol_upper]
        }
    else:
        return {
            "success": False,
            "message": f"Mock data not available for {symbol_upper}. Try: RELIANCE, TCS, INFY",
            "data": None
        }


@router.get("/api-status")
async def api_status():
    """
    Check if Kotak Neo API integration is ready
    
    Shows whether the backend has valid API credentials configured.
    """
    from app.core.config import settings
    
    has_consumer_key = bool(settings.NEO_CONSUMER_KEY and settings.NEO_CONSUMER_KEY.strip())
    
    return {
        "kotak_api_configured": has_consumer_key,
        "environment": settings.ENVIRONMENT,
        "base_url": settings.NEO_BASE_URL,
        "message": "Add NEO_CONSUMER_KEY to .env file to enable real Kotak Neo API" if not has_consumer_key else "Kotak Neo API is configured",
        "note": "Use /api/v1/test endpoints for testing without API credentials"
    }