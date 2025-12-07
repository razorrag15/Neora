"""
Admin API endpoints for TOTP management and system monitoring.

This module provides admin-only endpoints for:
- Viewing daily TOTP codes
- Monitoring authentication status
- System health checks
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional

from app.core.totp_manager import get_totp_manager, TOTPManager
from app.core.dependencies import get_kite_client
from app.repositories.kite_client import KiteClient

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["Admin"])


# Simple admin secret key (in production, use proper auth)
ADMIN_SECRET = "neora_admin_2024_secure_k3y_9x7p2m5n8q4r"  # TODO: Move to environment variable


def verify_admin_key(x_admin_key: Optional[str] = Header(None)) -> bool:
    """
    Verify admin authentication key.
    
    Args:
        x_admin_key: Admin secret key from header
        
    Returns:
        True if authenticated
        
    Raises:
        HTTPException: If authentication fails
    """
    if not x_admin_key or x_admin_key != ADMIN_SECRET:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin credentials. Provide X-Admin-Key header."
        )
    return True


@router.get("/totp/current")
async def get_current_totp(
    totp_manager: TOTPManager = Depends(get_totp_manager),
    _: bool = Depends(verify_admin_key)
):
    """
    Get the current daily TOTP code.
    
    **Admin Only**: Requires X-Admin-Key header.
    
    This endpoint displays the TOTP code that must be used for Kite authentication.
    The code changes daily at midnight and is valid for 24 hours.
    
    Returns:
        Current TOTP code and expiration info
        
    Example Response:
        {
            "date": "2024-12-04",
            "current_code": "123456",
            "expires_in_seconds": 43200,
            "expires_at": "2024-12-05T00:00:00",
            "message": "Use this code for Kite login today"
        }
    """
    try:
        totp_info = totp_manager.get_totp_info()
        totp_info["message"] = "Use this code for Kite login today"
        logger.info("Admin accessed current TOTP code")
        return totp_info
    except Exception as e:
        logger.error(f"Failed to get TOTP: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve TOTP code"
        )


@router.get("/totp/refresh")
async def refresh_totp(
    totp_manager: TOTPManager = Depends(get_totp_manager),
    _: bool = Depends(verify_admin_key)
):
    """
    Force refresh the TOTP secret (generates new code).
    
    **Admin Only**: Requires X-Admin-Key header.
    
    WARNING: This will invalidate the current code immediately.
    Use only if you need to reset the TOTP system.
    
    Returns:
        New TOTP code and info
    """
    try:
        # Force regenerate
        totp_manager._generate_new_secret()
        totp_info = totp_manager.get_totp_info()
        totp_info["message"] = "TOTP refreshed successfully"
        logger.warning("Admin forced TOTP refresh")
        return totp_info
    except Exception as e:
        logger.error(f"Failed to refresh TOTP: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to refresh TOTP"
        )


@router.get("/status")
async def get_admin_status(
    kite_client: KiteClient = Depends(get_kite_client),
    totp_manager: TOTPManager = Depends(get_totp_manager),
    _: bool = Depends(verify_admin_key)
):
    """
    Get system status dashboard for admins.
    
    **Admin Only**: Requires X-Admin-Key header.
    
    Returns:
        Complete system status including:
        - Kite authentication status
        - TOTP status
        - API readiness
    """
    try:
        totp_info = totp_manager.get_totp_info()
        
        return {
            "system": {
                "status": "operational",
                "api_ready": True
            },
            "kite_auth": {
                "authenticated": kite_client.is_authenticated(),
                "message": "Active" if kite_client.is_authenticated() else "Requires login"
            },
            "totp": {
                "date": totp_info["date"],
                "code": totp_info["current_code"],
                "expires_in_seconds": totp_info["expires_in_seconds"],
                "status": "active"
            },
            "endpoints": {
                "market_data": "/api/v1/market/dashboard",
                "kite_login": "/api/v1/auth/login",
                "totp_current": "/api/v1/admin/totp/current"
            }
        }
    except Exception as e:
        logger.error(f"Failed to get admin status: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve system status"
        )


@router.get("/health")
async def health_check():
    """
    Public health check endpoint (no auth required).
    
    Returns:
        Basic health status
    """
    return {
        "status": "healthy",
        "service": "NEORA Market Dashboard API",
        "version": "1.0.0"
    }