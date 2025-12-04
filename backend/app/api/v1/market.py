"""
Market Data API Endpoints
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.models.market import (
    QuotesRequest,
    ScripSearchRequest,
    MarketResponse,
    QuoteRequest
)
from app.services.market_service import market_service
from app.core.exceptions import MarketDataError

router = APIRouter(prefix="/market", tags=["Market Data"])


@router.post("/quotes", response_model=MarketResponse)
async def get_quotes(request: QuotesRequest):
    """
    Get real-time quotes for multiple instruments
    
    **Note:** This endpoint can work without authentication for basic quotes.
    
    **Quote Types:**
    - `all`: Complete quote data (default)
    - `ltp`: Last traded price only
    - `ohlc`: Open, High, Low, Close
    - `depth`: Market depth (bid/ask)
    - `52w`: 52-week high/low
    - `circuit_limits`: Circuit limit information
    """
    try:
        result = await market_service.get_real_time_quotes(
            instruments=request.instruments,
            quote_type=request.quote_type
        )
        return result
    except MarketDataError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quotes: {str(e)}")


@router.get("/quote/{exchange_segment}/{instrument_token}", response_model=MarketResponse)
async def get_single_quote(
    exchange_segment: str,
    instrument_token: str,
    quote_type: str = Query(default="all", description="Quote type")
):
    """
    Get real-time quote for a single instrument
    
    **Exchange Segments:**
    - `nse_cm`: NSE Cash Market
    - `bse_cm`: BSE Cash Market
    - `nse_fo`: NSE Futures & Options
    - `bse_fo`: BSE Futures & Options
    - `mcx_fo`: MCX Futures & Options
    """
    try:
        instruments = [{"instrument_token": instrument_token, "exchange_segment": exchange_segment}]
        result = await market_service.get_real_time_quotes(instruments, quote_type)
        return result
    except MarketDataError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quote: {str(e)}")


@router.post("/search", response_model=MarketResponse)
async def search_scrip(request: ScripSearchRequest):
    """
    Search for stocks/scrips
    
    Search by symbol name to find instrument tokens and details.
    
    **Examples:**
    - Search equity: `{"exchange_segment": "nse_cm", "symbol": "RELIANCE"}`
    - Search options: `{"exchange_segment": "nse_fo", "symbol": "NIFTY", "expiry": "30DEC2024", "option_type": "CE", "strike_price": "19000"}`
    """
    try:
        result = await market_service.search_stocks(
            exchange_segment=request.exchange_segment,
            symbol=request.symbol,
            expiry=request.expiry,
            option_type=request.option_type,
            strike_price=request.strike_price
        )
        return result
    except MarketDataError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.get("/scrip-master", response_model=MarketResponse)
async def get_scrip_master(
    exchange_segment: Optional[str] = Query(None, description="Exchange segment filter")
):
    """
    Get scrip master data (complete list of tradable instruments)
    
    Returns CSV data with all instruments for the specified exchange segment.
    If no segment specified, returns data for all segments.
    
    **Exchange Segments:**
    - `nse_cm`: NSE Cash Market
    - `bse_cm`: BSE Cash Market
    - `nse_fo`: NSE Futures & Options
    - `bse_fo`: BSE Futures & Options
    - `mcx_fo`: MCX Futures & Options
    - `cde_fo`: Currency Derivatives
    """
    try:
        result = await market_service.get_scrip_master(exchange_segment)
        return result
    except MarketDataError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch scrip master: {str(e)}")


@router.get("/indices", response_model=MarketResponse)
async def get_market_indices():
    """
    Get major market indices
    
    Returns real-time data for:
    - NIFTY 50
    - NIFTY BANK
    - SENSEX
    """
    try:
        result = await market_service.get_market_indices()
        return result
    except MarketDataError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch indices: {str(e)}")


@router.get("/depth/{exchange_segment}/{instrument_token}", response_model=MarketResponse)
async def get_market_depth(exchange_segment: str, instrument_token: str):
    """
    Get market depth (bid/ask prices and quantities)
    
    Shows 5 levels of buy and sell orders with prices and quantities.
    """
    try:
        result = await market_service.get_market_depth(instrument_token, exchange_segment)
        return result
    except MarketDataError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch market depth: {str(e)}")


@router.get("/ohlc/{exchange_segment}/{instrument_token}", response_model=MarketResponse)
async def get_ohlc(exchange_segment: str, instrument_token: str):
    """
    Get OHLC (Open, High, Low, Close) data
    
    Returns current day's OHLC data for the instrument.
    """
    try:
        result = await market_service.get_ohlc_data(instrument_token, exchange_segment)
        return result
    except MarketDataError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch OHLC: {str(e)}")


@router.get("/stock-details/{exchange_segment}/{instrument_token}", response_model=MarketResponse)
async def get_stock_details(exchange_segment: str, instrument_token: str):
    """
    Get complete stock details
    
    Returns comprehensive stock information including:
    - Current price and change
    - OHLC data
    - Volume and turnover
    - 52-week high/low
    - Circuit limits
    - Market depth
    """
    try:
        result = await market_service.get_stock_details(instrument_token, exchange_segment)
        return result
    except MarketDataError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stock details: {str(e)}")