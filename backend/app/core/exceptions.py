"""
Custom Exception Classes
"""
from typing import Any, Optional, Dict


class NeoraAPIException(Exception):
    """Base exception for NEORA API"""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class AuthenticationError(NeoraAPIException):
    """Authentication related errors"""
    
    def __init__(self, message: str = "Authentication failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=401,
            error_code="AUTH_ERROR",
            details=details
        )


class ValidationError(NeoraAPIException):
    """Validation errors"""
    
    def __init__(self, message: str = "Validation failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=422,
            error_code="VALIDATION_ERROR",
            details=details
        )


class MarketDataError(NeoraAPIException):
    """Market data related errors"""
    
    def __init__(self, message: str = "Market data error", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=500,
            error_code="MARKET_DATA_ERROR",
            details=details
        )


class KotakAPIError(NeoraAPIException):
    """Kotak Neo API errors"""
    
    def __init__(self, message: str = "Kotak API error", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=502,
            error_code="KOTAK_API_ERROR",
            details=details
        )