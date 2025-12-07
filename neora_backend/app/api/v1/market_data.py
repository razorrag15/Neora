"""
Market Data API - Simple live market dashboard.
Shows NIFTY 50 + SENSEX indices with their constituent stocks.
"""
import logging
import os
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from supabase import create_client, Client

from app.core.dependencies import get_kite_client
from app.repositories.kite_client import KiteClient

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/market", tags=["Market Data"])

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None


# ============== Models ==============

class StockQuote(BaseModel):
    """Single stock quote with live data."""
    symbol: str
    name: str
    last_price: float
    change: float
    change_percent: float
    color: str  # "green" or "red"


class IndexData(BaseModel):
    """Index with its constituent stocks."""
    symbol: str
    last_value: float
    change: float
    change_percent: float
    stocks: List[StockQuote]


class MarketDashboard(BaseModel):
    """Complete dashboard data."""
    nifty_50: IndexData
    sensex: IndexData
    timestamp: str


class InstrumentResponse(BaseModel):
    """Real instrument data from Kite Connect."""
    instrument_token: int
    exchange_token: int
    tradingsymbol: str
    name: str
    exchange: str
    segment: str
    instrument_type: str
    last_price: float = 0.0
    tick_size: float = 0.05
    lot_size: int = 1


class WatchlistCreate(BaseModel):
    """Create watchlist request."""
    name: str
    description: Optional[str] = None
    is_default: bool = False


class WatchlistItemCreate(BaseModel):
    """Add stock to watchlist request."""
    symbol: str
    exchange: str = "NSE"
    notes: Optional[str] = None
    target_price: Optional[float] = None
    stop_loss: Optional[float] = None


class WatchlistItemResponse(BaseModel):
    """Watchlist item with live quote."""
    id: str
    symbol: str
    exchange: str
    last_price: float
    change: float
    change_percent: float
    color: str
    notes: Optional[str]
    target_price: Optional[float]
    stop_loss: Optional[float]
    added_at: str


class WatchlistResponse(BaseModel):
    """Watchlist with items."""
    id: str
    name: str
    description: Optional[str]
    is_default: bool
    created_at: str
    items: List[WatchlistItemResponse]


# ============== NIFTY 50 Stocks ==============
NIFTY_50_STOCKS = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
    "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL", "BAJFINANCE",
    "KOTAKBANK", "LT", "HCLTECH", "ASIANPAINT", "AXISBANK",
    "MARUTI", "SUNPHARMA", "TITAN", "ULTRACEMCO", "NESTLEIND",
    "WIPRO", "TECHM", "ADANIPORTS", "POWERGRID", "NTPC",
    "TATASTEEL", "BAJAJFINSV", "M&M", "ONGC", "INDUSINDBK",
    "COALINDIA", "TATAMOTORS", "DRREDDY", "GRASIM", "JSWSTEEL",
    "DIVISLAB", "EICHERMOT", "BRITANNIA", "HINDALCO", "APOLLOHOSP",
    "TATACONSUM", "SHREECEM", "CIPLA", "UPL", "HEROMOTOCO",
    "BAJAJ-AUTO", "ADANIENT", "SBILIFE", "BPCL", "LTIM"
]

# ============== SENSEX 30 Stocks ==============
SENSEX_30_STOCKS = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
    "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL", "BAJFINANCE",
    "KOTAKBANK", "LT", "ASIANPAINT", "AXISBANK", "MARUTI",
    "SUNPHARMA", "TITAN", "ULTRACEMCO", "NESTLEIND", "WIPRO",
    "TECHM", "POWERGRID", "NTPC", "TATASTEEL", "M&M",
    "INDUSINDBK", "TATAMOTORS", "HINDALCO", "BAJAJ-AUTO", "ADANIENT"
]


# ============== Helper Function ==============

async def get_stock_quotes(symbols: List[str], exchange: str, kite_client: KiteClient) -> List[StockQuote]:
    """Get live quotes for multiple stocks."""
    try:
        instruments = [f"{exchange}:{symbol}" for symbol in symbols]
        quotes_data = await kite_client.get_quotes(instruments)
        
        results = []
        for symbol in symbols:
            inst_key = f"{exchange}:{symbol}"
            if inst_key in quotes_data:
                quote = quotes_data[inst_key]
                change_percent = quote.get('change_percent', 0.0)
                
                results.append(StockQuote(
                    symbol=symbol,
                    name=symbol,  # Can be improved with company names
                    last_price=quote.get('last_price', 0.0),  # Changed field name
                    change=quote.get('change', 0.0),
                    change_percent=change_percent,
                    color="green" if change_percent >= 0 else "red"
                ))
        
        return results
    except Exception as e:
        logger.error(f"Error fetching quotes: {e}")
        return []


# ============== Main Endpoint ==============

@router.get("/dashboard", response_model=MarketDashboard)
async def get_market_dashboard(
    kite_client: KiteClient = Depends(get_kite_client)
):
    """
    Get complete market dashboard with NIFTY 50 and SENSEX.
    
    Returns:
    - NIFTY 50 index + 50 stocks with live prices
    - SENSEX + 30 stocks with live prices
    - Real-time color coding (green/red)
    
    Usage: GET /api/v1/market/dashboard
    """
    if not kite_client.is_authenticated():
        raise HTTPException(
            status_code=401,
            detail="Backend not authenticated. Please complete Kite login with TOTP."
        )
    
    try:
        # Get NIFTY 50 index
        nifty_quote_data = await kite_client.get_quotes(["NSE:NIFTY 50"])
        nifty_quote = nifty_quote_data.get("NSE:NIFTY 50", {})
        nifty_change_percent = nifty_quote.get('change_percent', 0.0)
        
        # Get SENSEX index
        sensex_quote_data = await kite_client.get_quotes(["BSE:SENSEX"])
        sensex_quote = sensex_quote_data.get("BSE:SENSEX", {})
        sensex_change_percent = sensex_quote.get('change_percent', 0.0)
        
        # Get NIFTY 50 stocks (from NSE)
        nifty_stocks = await get_stock_quotes(NIFTY_50_STOCKS, "NSE", kite_client)
        
        # Get SENSEX stocks (from BSE)
        sensex_stocks = await get_stock_quotes(SENSEX_30_STOCKS, "BSE", kite_client)
        
        # Build response
        return MarketDashboard(
            nifty_50=IndexData(
                symbol="NIFTY 50",  # Changed field name
                last_value=nifty_quote.get('last_price', 0.0),  # Changed field name
                change=nifty_quote.get('change', 0.0),  # Changed field name
                change_percent=nifty_change_percent,  # Changed field name
                stocks=nifty_stocks
            ),
            sensex=IndexData(
                symbol="SENSEX",  # Changed field name
                last_value=sensex_quote.get('last_price', 0.0),  # Changed field name
                change=sensex_quote.get('change', 0.0),  # Changed field name
                change_percent=sensex_change_percent,  # Changed field name
                stocks=sensex_stocks
            ),
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error fetching market dashboard: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch market data"
        )


@router.get("/nifty50")
async def get_nifty_50_detail(
    kite_client: KiteClient = Depends(get_kite_client)
):
    """Get detailed NIFTY 50 data (when user clicks on NIFTY card)."""
    if not kite_client.is_authenticated():
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    nifty_quote_data = await kite_client.get_quotes(["NSE:NIFTY 50"])
    nifty_quote = nifty_quote_data.get("NSE:NIFTY 50", {})
    
    stocks = await get_stock_quotes(NIFTY_50_STOCKS, "NSE", kite_client)
    
    return {
        "index": nifty_quote,
        "stocks": stocks,
        "count": len(stocks)
    }


@router.get("/sensex")
async def get_sensex_detail(
    kite_client: KiteClient = Depends(get_kite_client)
):
    """Get detailed SENSEX data (when user clicks on SENSEX card)."""
    if not kite_client.is_authenticated():
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    sensex_quote_data = await kite_client.get_quotes(["BSE:SENSEX"])
    sensex_quote = sensex_quote_data.get("BSE:SENSEX", {})
    
    stocks = await get_stock_quotes(SENSEX_30_STOCKS, "BSE", kite_client)
    
    return {
        "index": sensex_quote,
        "stocks": stocks,
        "count": len(stocks)
    }


# ============== Instruments Endpoint ==============

@router.get("/instruments", response_model=List[InstrumentResponse])
async def get_all_instruments(
    exchange: str = Query("NSE", description="Exchange: NSE or BSE"),
    instrument_type: Optional[str] = Query(None, description="Filter: EQ, FUT, OPT, etc."),
    kite_client: KiteClient = Depends(get_kite_client)
):
    """
    Get ALL real instruments from NSE/BSE via Kite Connect.
    
    This returns 100% REAL data from exchanges, no mock data.
    
    Examples:
    - GET /api/v1/market/instruments?exchange=NSE&instrument_type=EQ
      Returns: ~2000 NSE equity stocks
    
    - GET /api/v1/market/instruments?exchange=BSE&instrument_type=EQ
      Returns: ~5000 BSE equity stocks
    """
    if not kite_client.is_authenticated():
        raise HTTPException(
            status_code=401,
            detail="Backend not authenticated with Kite. Please login via admin panel."
        )
    
    try:
        # Get REAL instruments from Kite Connect
        instruments_data = await kite_client.get_instruments(exchange)
        
        # Filter by instrument_type if provided
        if instrument_type:
            instruments_data = [
                inst for inst in instruments_data
                if inst.get('instrument_type') == instrument_type
            ]
        
        # Format response
        results = [
            InstrumentResponse(
                instrument_token=inst['instrument_token'],
                exchange_token=inst['exchange_token'],
                tradingsymbol=inst['tradingsymbol'],
                name=inst['name'],
                exchange=inst['exchange'],
                segment=inst['segment'],
                instrument_type=inst['instrument_type'],
                last_price=inst.get('last_price', 0.0),
                tick_size=inst.get('tick_size', 0.05),
                lot_size=inst.get('lot_size', 1)
            )
            for inst in instruments_data
        ]
        
        logger.info(f"Returning {len(results)} REAL instruments from {exchange}")
        return results
        
    except Exception as e:
        logger.error(f"Failed to fetch real instruments: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch instruments: {str(e)}"
        )


# ============== Watchlist CRUD Endpoints ==============

@router.get("/watchlists/{user_id}", response_model=List[WatchlistResponse])
async def get_user_watchlists(
    user_id: str,
    kite_client: KiteClient = Depends(get_kite_client)
):
    """Get all watchlists for a user with live quotes."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        # Get user's watchlists with items
        response = supabase.table('watchlists')\
            .select('*, watchlist_items(*)')\
            .eq('user_id', user_id)\
            .order('is_default', desc=True)\
            .order('created_at', desc=False)\
            .execute()
        
        watchlists = response.data
        
        # For each watchlist, get live quotes for items
        for watchlist in watchlists:
            items = watchlist.get('watchlist_items', [])
            formatted_items = []
            
            if items and kite_client.is_authenticated():
                try:
                    # Get live quotes
                    instruments = [f"{item['exchange']}:{item['symbol']}" for item in items]
                    quotes = await kite_client.get_quotes(instruments)
                    
                    # Merge live data with watchlist items
                    for item in items:
                        inst_key = f"{item['exchange']}:{item['symbol']}"
                        quote = quotes.get(inst_key, {})
                        change_percent = quote.get('change_percent', 0.0)
                        
                        formatted_items.append(WatchlistItemResponse(
                            id=item['id'],
                            symbol=item['symbol'],
                            exchange=item['exchange'],
                            last_price=quote.get('last_price', 0.0),
                            change=quote.get('change', 0.0),
                            change_percent=change_percent,
                            color="green" if change_percent >= 0 else "red",
                            notes=item.get('notes'),
                            target_price=item.get('target_price'),
                            stop_loss=item.get('stop_loss'),
                            added_at=item['added_at']
                        ))
                except Exception as e:
                    logger.error(f"Failed to fetch quotes for watchlist: {e}")
                    # Return items without live quotes
                    formatted_items = [
                        WatchlistItemResponse(
                            id=item['id'],
                            symbol=item['symbol'],
                            exchange=item['exchange'],
                            last_price=0.0,
                            change=0.0,
                            change_percent=0.0,
                            color="gray",
                            notes=item.get('notes'),
                            target_price=item.get('target_price'),
                            stop_loss=item.get('stop_loss'),
                            added_at=item['added_at']
                        )
                        for item in items
                    ]
            
            watchlist['items'] = formatted_items
        
        return watchlists
        
    except Exception as e:
        logger.error(f"Failed to fetch watchlists: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/watchlists/{user_id}")
async def create_watchlist(user_id: str, data: WatchlistCreate):
    """Create a new watchlist."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        response = supabase.table('watchlists').insert({
            'user_id': user_id,
            'name': data.name,
            'description': data.description,
            'is_default': data.is_default
        }).execute()
        
        return {"success": True, "watchlist": response.data[0]}
        
    except Exception as e:
        logger.error(f"Failed to create watchlist: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/watchlists/{watchlist_id}/items")
async def add_stock_to_watchlist(watchlist_id: str, data: WatchlistItemCreate):
    """Add a stock to watchlist."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        # Check if already exists
        existing = supabase.table('watchlist_items')\
            .select('id')\
            .eq('watchlist_id', watchlist_id)\
            .eq('symbol', data.symbol)\
            .execute()
        
        if existing.data:
            raise HTTPException(status_code=400, detail="Stock already in watchlist")
        
        # Add stock
        response = supabase.table('watchlist_items').insert({
            'watchlist_id': watchlist_id,
            'symbol': data.symbol,
            'exchange': data.exchange,
            'notes': data.notes,
            'target_price': data.target_price,
            'stop_loss': data.stop_loss
        }).execute()
        
        return {"success": True, "item": response.data[0]}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to add stock: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/watchlists/{watchlist_id}/items/{item_id}")
async def remove_stock_from_watchlist(watchlist_id: str, item_id: str):
    """Remove a stock from watchlist."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        supabase.table('watchlist_items')\
            .delete()\
            .eq('id', item_id)\
            .eq('watchlist_id', watchlist_id)\
            .execute()
        
        return {"success": True, "message": "Stock removed"}
        
    except Exception as e:
        logger.error(f"Failed to remove stock: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/watchlists/{watchlist_id}")
async def delete_watchlist(watchlist_id: str):
    """Delete entire watchlist and all its items."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        # Items will be deleted automatically if foreign key has CASCADE
        # Otherwise, delete items first
        supabase.table('watchlist_items').delete().eq('watchlist_id', watchlist_id).execute()
        
        # Delete watchlist
        supabase.table('watchlists').delete().eq('id', watchlist_id).execute()
        
        return {"success": True, "message": "Watchlist deleted"}
        
    except Exception as e:
        logger.error(f"Failed to delete watchlist: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/watchlists/{watchlist_id}")
async def update_watchlist(watchlist_id: str, data: WatchlistCreate):
    """Update watchlist name/description."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        response = supabase.table('watchlists')\
            .update({
                'name': data.name,
                'description': data.description,
                'is_default': data.is_default
            })\
            .eq('id', watchlist_id)\
            .execute()
        
        return {"success": True, "watchlist": response.data[0]}
        
    except Exception as e:
        logger.error(f"Failed to update watchlist: {e}")
        raise HTTPException(status_code=500, detail=str(e))