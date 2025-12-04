"""
Market Data Service
Business logic for market data operations
"""
from typing import List, Dict, Any, Optional
from app.services.neo_client import neo_client
from app.core.exceptions import MarketDataError


class MarketService:
    """Market Data Service"""
    
    def __init__(self):
        self.client = neo_client
    
    async def get_real_time_quotes(
        self,
        instruments: List[Dict[str, str]],
        quote_type: str = "all"
    ) -> Dict[str, Any]:
        """Get real-time quotes for instruments"""
        try:
            # Format instruments for API
            instrument_tokens = [
                {
                    "instrument_token": inst["instrument_token"],
                    "exchange_segment": inst["exchange_segment"]
                }
                for inst in instruments
            ]
            
            result = await self.client.get_quotes(instrument_tokens, quote_type)
            
            return {
                "success": True,
                "message": "Quotes fetched successfully",
                "data": result
            }
        except Exception as e:
            raise MarketDataError(f"Failed to fetch quotes: {str(e)}")
    
    async def search_stocks(
        self,
        exchange_segment: str,
        symbol: str,
        expiry: Optional[str] = None,
        option_type: Optional[str] = None,
        strike_price: Optional[str] = None
    ) -> Dict[str, Any]:
        """Search for stocks/scrips"""
        try:
            result = await self.client.search_scrip(
                exchange_segment=exchange_segment,
                symbol=symbol,
                expiry=expiry,
                option_type=option_type,
                strike_price=strike_price
            )
            
            return {
                "success": True,
                "message": "Search completed successfully",
                "data": result
            }
        except Exception as e:
            raise MarketDataError(f"Failed to search scrip: {str(e)}")
    
    async def get_scrip_master(self, exchange_segment: Optional[str] = None) -> Dict[str, Any]:
        """Get scrip master data"""
        try:
            result = await self.client.get_scrip_master(exchange_segment)
            
            return {
                "success": True,
                "message": "Scrip master fetched successfully",
                "data": result
            }
        except Exception as e:
            raise MarketDataError(f"Failed to fetch scrip master: {str(e)}")
    
    async def get_market_indices(self) -> Dict[str, Any]:
        """Get major market indices (NIFTY, SENSEX, etc.)"""
        try:
            # Define major indices
            indices = [
                {"instrument_token": "26000", "exchange_segment": "nse_cm"},  # NIFTY 50
                {"instrument_token": "26009", "exchange_segment": "nse_cm"},  # NIFTY BANK
                {"instrument_token": "1", "exchange_segment": "bse_cm"},      # SENSEX
            ]
            
            result = await self.client.get_quotes(indices, quote_type="all")
            
            return {
                "success": True,
                "message": "Market indices fetched successfully",
                "data": result
            }
        except Exception as e:
            raise MarketDataError(f"Failed to fetch indices: {str(e)}")
    
    async def get_stock_details(
        self,
        instrument_token: str,
        exchange_segment: str
    ) -> Dict[str, Any]:
        """Get detailed stock information"""
        try:
            instruments = [
                {
                    "instrument_token": instrument_token,
                    "exchange_segment": exchange_segment
                }
            ]
            
            result = await self.client.get_quotes(instruments, quote_type="all")
            
            return {
                "success": True,
                "message": "Stock details fetched successfully",
                "data": result
            }
        except Exception as e:
            raise MarketDataError(f"Failed to fetch stock details: {str(e)}")
    
    async def get_market_depth(
        self,
        instrument_token: str,
        exchange_segment: str
    ) -> Dict[str, Any]:
        """Get market depth (bid/ask)"""
        try:
            instruments = [
                {
                    "instrument_token": instrument_token,
                    "exchange_segment": exchange_segment
                }
            ]
            
            result = await self.client.get_quotes(instruments, quote_type="depth")
            
            return {
                "success": True,
                "message": "Market depth fetched successfully",
                "data": result
            }
        except Exception as e:
            raise MarketDataError(f"Failed to fetch market depth: {str(e)}")
    
    async def get_ohlc_data(
        self,
        instrument_token: str,
        exchange_segment: str
    ) -> Dict[str, Any]:
        """Get OHLC (Open, High, Low, Close) data"""
        try:
            instruments = [
                {
                    "instrument_token": instrument_token,
                    "exchange_segment": exchange_segment
                }
            ]
            
            result = await self.client.get_quotes(instruments, quote_type="ohlc")
            
            return {
                "success": True,
                "message": "OHLC data fetched successfully",
                "data": result
            }
        except Exception as e:
            raise MarketDataError(f"Failed to fetch OHLC data: {str(e)}")


# Global service instance
market_service = MarketService()