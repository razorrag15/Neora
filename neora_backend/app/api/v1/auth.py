"""
Authentication API endpoints with TOTP security.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel

from app.core.dependencies import get_kite_client
from app.core.totp_manager import get_totp_manager, TOTPManager
from app.repositories.kite_client import KiteClient

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    """Login request with TOTP."""
    totp_code: str


@router.post("/login")
async def generate_login_url(
    request: LoginRequest,
    kite_client: KiteClient = Depends(get_kite_client),
    totp_manager: TOTPManager = Depends(get_totp_manager)
):
    """
    Generate Kite Connect login URL (requires TOTP).
    
    **Security**: Requires valid daily TOTP code.
    
    Args:
        totp_code: 6-digit TOTP code from admin
        
    Returns:
        Kite login URL
        
    Example:
        POST /api/v1/auth/login
        Body: {"totp_code": "123456"}
    """
    try:
        # Verify TOTP first
        if not totp_manager.verify_totp(request.totp_code):
            logger.warning("Login attempt with invalid TOTP")
            raise HTTPException(
                status_code=401,
                detail="Invalid TOTP code. Get today's code from /admin/totp/current"
            )
        
        login_url = kite_client.generate_login_url()
        logger.info("Login URL generated successfully with valid TOTP")
        return {
            "login_url": login_url,
            "message": "TOTP verified. Complete login in browser."
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate login URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate login URL")


@router.get("/callback", response_class=HTMLResponse)
async def kite_callback(
    request_token: str = Query(..., description="Request token from Kite"),
    kite_client: KiteClient = Depends(get_kite_client)
):
    """Handle Kite Connect authentication callback."""
    try:
        # Authenticate with Kite
        auth_data = await kite_client.authenticate(request_token)
        user_id = auth_data.get("user_id")
        access_token = auth_data.get("access_token")
        
        # Save access token to file (for backward compatibility)
        try:
            with open(".session_token", "w") as f:
                f.write(access_token)
            logger.info(f"Access token saved for user {user_id}")
        except Exception as e:
            logger.warning(f"Failed to save token to file: {e}")
        
        # Return success HTML
        html_content = f"""
        <html>
            <head><title>Authentication Successful</title></head>
            <body>
                <h1>Authentication Successful!</h1>
                <p>Access Token: {access_token}</p>
                <p>User ID: {user_id}</p>
                <p>Access token has been saved and the API is now ready to use.</p>
                <p>You can now close this window and use the API endpoints.</p>
            </body>
        </html>
        """
        return HTMLResponse(content=html_content, status_code=200)
        
    except Exception as e:
        logger.error(f"Authentication failed: {e}")
        error_html = f"""
        <html>
            <head><title>Authentication Failed</title></head>
            <body>
                <h1>Authentication Failed</h1>
                <p>Error: {str(e)}</p>
                <p>Please try again or check your credentials.</p>
            </body>
        </html>
        """
        return HTMLResponse(content=error_html, status_code=400)


@router.get("/status")
async def get_auth_status(
    kite_client: KiteClient = Depends(get_kite_client)
):
    """Get authentication status."""
    return {
        "authenticated": kite_client.is_authenticated(),
        "message": "Authenticated" if kite_client.is_authenticated() else "Not authenticated"
    }
