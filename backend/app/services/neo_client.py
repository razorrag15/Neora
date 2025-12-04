"""
Kotak Neo API Client Wrapper
Handles all interactions with Kotak Neo API
"""
import httpx
from typing import Dict, Any, Optional, List
from app.core.config import settings
from app.core.exceptions import KotakAPIError, AuthenticationError


class NeoAPIClient:
    """Kotak Neo API Client"""
    
    def __init__(self):
        self.base_url = settings.NEO_BASE_URL
        self.consumer_key = settings.NEO_CONSUMER_KEY
        self.neo_fin_key = settings.NEO_FIN_KEY
        
        # Session tokens
        self.view_token: Optional[str] = None
        self.edit_token: Optional[str] = None
        self.sid: Optional[str] = None
        self.rid: Optional[str] = None
        self.server_id: Optional[str] = None
        
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()
    
    def _get_headers(self, auth_required: bool = True) -> Dict[str, str]:
        """Get request headers"""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        
        if auth_required and self.edit_token:
            headers["Authorization"] = f"Bearer {self.edit_token}"
            if self.sid:
                headers["Sid"] = self.sid
        
        if self.consumer_key:
            headers["consumerKey"] = self.consumer_key
        
        if self.neo_fin_key:
            headers["neoFinKey"] = self.neo_fin_key
        
        return headers
    
    async def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        auth_required: bool = True
    ) -> Dict[str, Any]:
        """Make HTTP request to Kotak Neo API"""
        url = f"{self.base_url}{endpoint}"
        headers = self._get_headers(auth_required)
        
        try:
            if method.upper() == "GET":
                response = await self.client.get(url, headers=headers, params=data)
            elif method.upper() == "POST":
                response = await self.client.post(url, headers=headers, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
            
        except httpx.HTTPStatusError as e:
            raise KotakAPIError(
                message=f"Kotak API HTTP error: {e.response.status_code}",
                details={"url": url, "status": e.response.status_code, "response": e.response.text}
            )
        except httpx.RequestError as e:
            raise KotakAPIError(
                message=f"Kotak API request error: {str(e)}",
                details={"url": url, "error": str(e)}
            )
        except Exception as e:
            raise KotakAPIError(
                message=f"Unexpected error: {str(e)}",
                details={"error": str(e)}
            )
    
    # Authentication Methods
    
    async def totp_login(self, mobile_number: str, ucc: str, totp: str) -> Dict[str, Any]:
        """TOTP Login - Step 1"""
        data = {
            "mobileNumber": mobile_number,
            "ucc": ucc,
            "totp": totp
        }
        
        result = await self._make_request("POST", "login/1.0/login/v2/validate", data, auth_required=False)
        
        # Store view token and sid
        if result.get("data"):
            self.view_token = result["data"].get("token")
            self.sid = result["data"].get("sid")
            self.rid = result["data"].get("rid")
            self.server_id = result["data"].get("hsServerId")
        
        return result
    
    async def totp_validate(self, mpin: str) -> Dict[str, Any]:
        """TOTP Validation - Step 2"""
        if not self.view_token:
            raise AuthenticationError("Must complete TOTP login first")
        
        data = {"mpin": mpin}
        
        # Temporarily use view token for validation
        temp_token = self.edit_token
        self.edit_token = self.view_token
        
        result = await self._make_request("POST", "login/1.0/login/v2/validate/mpin", data)
        
        # Store edit token
        if result.get("data"):
            self.edit_token = result["data"].get("token")
            self.sid = result["data"].get("sid")
        else:
            self.edit_token = temp_token
        
        return result
    
    # Market Data Methods
    
    async def get_quotes(
        self,
        instrument_tokens: List[Dict[str, str]],
        quote_type: str = "all"
    ) -> Dict[str, Any]:
        """Get real-time quotes"""
        data = {
            "instrumentTokens": instrument_tokens,
            "quoteType": quote_type
        }
        
        return await self._make_request("POST", "quotes/1.0/quotes", data, auth_required=False)
    
    async def search_scrip(
        self,
        exchange_segment: str,
        symbol: str,
        expiry: Optional[str] = None,
        option_type: Optional[str] = None,
        strike_price: Optional[str] = None
    ) -> Dict[str, Any]:
        """Search for scrip"""
        # Map exchange segment
        exchange_map = {
            "nse_cm": "nse_cm",
            "bse_cm": "bse_cm",
            "nse_fo": "nse_fo",
            "bse_fo": "bse_fo",
            "mcx_fo": "mcx_fo",
            "cde_fo": "cde_fo"
        }
        
        params = {
            "sSegment": exchange_map.get(exchange_segment, exchange_segment),
            "sSymbol": symbol
        }
        
        if expiry:
            params["sExpiryDate"] = expiry
        if option_type:
            params["sOptionType"] = option_type
        if strike_price:
            params["sStrikePrice"] = strike_price
        
        return await self._make_request("GET", "search/1.0/search", params)
    
    async def get_scrip_master(self, exchange_segment: Optional[str] = None) -> Dict[str, Any]:
        """Get scrip master data"""
        endpoint = "master/1.0/masterscrip"
        
        if exchange_segment:
            endpoint += f"?exchangeSegment={exchange_segment}"
        
        return await self._make_request("GET", endpoint)
    
    async def get_limits(
        self,
        segment: str = "ALL",
        exchange: str = "ALL",
        product: str = "ALL"
    ) -> Dict[str, Any]:
        """Get account limits"""
        params = {
            "segment": segment,
            "exchange": exchange,
            "product": product
        }
        
        return await self._make_request("GET", "limits/1.0/limits", params)
    
    async def get_holdings(self) -> Dict[str, Any]:
        """Get portfolio holdings"""
        return await self._make_request("GET", "portfolio/1.0/holdings")
    
    async def get_positions(self) -> Dict[str, Any]:
        """Get current positions"""
        return await self._make_request("GET", "positions/1.0/positions")


# Global client instance
neo_client = NeoAPIClient()