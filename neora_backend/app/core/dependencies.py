"""
Dependency injection - simplified for market dashboard.
"""

from functools import lru_cache
from app.repositories.kite_client import KiteClient


@lru_cache()
def get_kite_client() -> KiteClient:
    """Get Kite client instance."""
    return KiteClient()
