"""
Market Data Models
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class QuoteRequest(BaseModel):
    """Quote Request Model"""
    instrument_token: str = Field(..., description="Instrument token")
    exchange_segment: str = Field(..., description="Exchange segment (nse_cm, bse_cm, nse_fo, etc.)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "instrument_token": "11536",
                "exchange_segment": "nse_cm"
            }
        }


class QuotesRequest(BaseModel):
    """Multiple Quotes Request"""
    instruments: List[QuoteRequest] = Field(..., description="List of instruments")
    quote_type: Optional[str] = Field("all", description="Quote type: all, depth, ohlc, ltp, oi, 52w, circuit_limits, scrip_details")
    
    class Config:
        json_schema_extra = {
            "example": {
                "instruments": [
                    {"instrument_token": "11536", "exchange_segment": "nse_cm"},
                    {"instrument_token": "2885", "exchange_segment": "nse_cm"}
                ],
                "quote_type": "all"
            }
        }


class QuoteData(BaseModel):
    """Quote Data Response"""
    instrument_token: str
    exchange_segment: str
    trading_symbol: str
    last_traded_price: Optional[float] = None
    last_traded_quantity: Optional[int] = None
    total_buy_quantity: Optional[int] = None
    total_sell_quantity: Optional[int] = None
    volume: Optional[int] = None
    average_price: Optional[float] = None
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: Optional[float] = None
    change: Optional[float] = None
    change_percentage: Optional[float] = None


class ScripSearchRequest(BaseModel):
    """Scrip Search Request"""
    exchange_segment: str = Field(..., description="Exchange segment (nse_cm, bse_cm, nse_fo, etc.)")
    symbol: str = Field(..., description="Symbol to search")
    expiry: Optional[str] = Field(None, description="Expiry date (DDMMMYYYY format)")
    option_type: Optional[str] = Field(None, description="Option type (CE/PE)")
    strike_price: Optional[str] = Field(None, description="Strike price")
    
    class Config:
        json_schema_extra = {
            "example": {
                "exchange_segment": "nse_cm",
                "symbol": "RELIANCE"
            }
        }


class ScripData(BaseModel):
    """Scrip Data"""
    instrument_token: str
    exchange_segment: str
    trading_symbol: str
    company_name: Optional[str] = None
    lot_size: Optional[int] = None
    tick_size: Optional[float] = None
    expiry_date: Optional[str] = None
    strike_price: Optional[float] = None
    option_type: Optional[str] = None


class MarketDepth(BaseModel):
    """Market Depth Data"""
    buy_orders: List[Dict[str, Any]] = Field(default_factory=list)
    sell_orders: List[Dict[str, Any]] = Field(default_factory=list)


class IndexData(BaseModel):
    """Index Data"""
    index_name: str
    last_traded_price: float
    change: float
    change_percentage: float
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: Optional[float] = None


class HistoricalDataRequest(BaseModel):
    """Historical Data Request"""
    instrument_token: str = Field(..., description="Instrument token")
    exchange_segment: str = Field(..., description="Exchange segment")
    from_date: str = Field(..., description="Start date (YYYY-MM-DD)")
    to_date: str = Field(..., description="End date (YYYY-MM-DD)")
    interval: str = Field(default="day", description="Interval: minute, day, week, month")
    
    class Config:
        json_schema_extra = {
            "example": {
                "instrument_token": "11536",
                "exchange_segment": "nse_cm",
                "from_date": "2024-01-01",
                "to_date": "2024-12-31",
                "interval": "day"
            }
        }


class OHLCData(BaseModel):
    """OHLC Data"""
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class MarketResponse(BaseModel):
    """Generic Market Data Response"""
    success: bool = Field(..., description="Success status")
    message: str = Field(..., description="Response message")
    data: Optional[Any] = Field(None, description="Response data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Data fetched successfully",
                "data": {}
            }
        }


class WebSocketSubscribeRequest(BaseModel):
    """WebSocket Subscribe Request"""
    instruments: List[QuoteRequest] = Field(..., description="List of instruments to subscribe")
    is_index: bool = Field(default=False, description="Subscribe to index data")
    is_depth: bool = Field(default=False, description="Subscribe to depth data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "instruments": [
                    {"instrument_token": "11536", "exchange_segment": "nse_cm"}
                ],
                "is_index": False,
                "is_depth": True
            }
        }