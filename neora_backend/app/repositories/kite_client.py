"""
Kite Connect client implementation - Simplified for market dashboard.
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional

from kiteconnect import KiteConnect
from kiteconnect.exceptions import TokenException

from app.core.config import settings

logger = logging.getLogger(__name__)


class KiteClient:
    """Kite Connect API client implementation."""

    timezone = "Asia/Kolkata"  # Kite API uses IST

    def __init__(self):
        self.api_key = settings.kite_api_key
        self.api_secret = settings.kite_api_secret
        self.kite: Optional[KiteConnect] = None
        self._access_token: Optional[str] = settings.kite_access_token

        if self._access_token:
            self._initialize_client()

    def _initialize_client(self):
        """Initialize the Kite Connect client."""
        try:
            self.kite = KiteConnect(api_key=self.api_key)
            if self._access_token:
                self.kite.set_access_token(self._access_token)
            logger.info("Kite Connect client initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Kite client: {e}")
            raise

    async def authenticate(self, request_token: str) -> Dict[str, Any]:
        """Authenticate with Kite Connect API."""
        try:
            temp_kite = KiteConnect(api_key=self.api_key)
            data = temp_kite.generate_session(request_token, api_secret=self.api_secret)

            self._access_token = data["access_token"]
            self.kite = temp_kite
            self.kite.set_access_token(self._access_token)

            logger.info(f"Authentication successful for user: {data.get('user_id')}")
            return data
        except TokenException as e:
            logger.error(f"Authentication failed: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected authentication error: {e}")
            raise

    async def get_quotes(self, instruments: List[str]) -> Dict[str, Any]:
        """Get market quotes for instruments."""
        if not self.is_authenticated():
            raise TokenException("Client not authenticated")

        try:
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            quotes = await loop.run_in_executor(None, self.kite.quote, instruments)
            logger.debug(f"Retrieved quotes for {len(instruments)} instruments")
            return quotes
        except Exception as e:
            logger.error(f"Failed to get quotes: {e}")
            raise

    async def get_instruments(self, exchange: str = "NSE") -> List[Dict[str, Any]]:
        """
        Get ALL instruments from exchange.
        This fetches 100% REAL data from Kite Connect API.
        
        Args:
            exchange: Exchange name (NSE, BSE, NFO, etc.)
        
        Returns:
            List of instruments with full metadata
            - NSE: ~15,000 instruments (stocks, F&O, indices)
            - BSE: ~5,000 instruments
        """
        if not self.is_authenticated():
            raise TokenException("Client not authenticated")
        
        try:
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            instruments = await loop.run_in_executor(
                None,
                self.kite.instruments,
                exchange
            )
            
            logger.info(f"Retrieved {len(instruments)} real instruments from {exchange}")
            return instruments
            
        except Exception as e:
            logger.error(f"Failed to get instruments: {e}")
            raise

    def generate_login_url(self) -> str:
        """Generate login URL for authentication."""
        try:
            temp_kite = KiteConnect(api_key=self.api_key)
            url = temp_kite.login_url()
            logger.info(f"Generated login URL: {url}")
            return url
        except Exception as e:
            logger.error(f"Failed to generate login URL: {e}")
            raise

    def is_authenticated(self) -> bool:
        """Check if client is authenticated."""
        return self.kite is not None and self._access_token is not None

    async def set_access_token(self, access_token: str) -> None:
        """Set access token for API calls."""
        self._access_token = access_token
        if not self.kite:
            self._initialize_client()
        else:
            self.kite.set_access_token(access_token)
        logger.info("Access token updated")
