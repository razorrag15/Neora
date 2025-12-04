"""
Authentication API Endpoints
"""
from fastapi import APIRouter, HTTPException
from app.models.auth import TOTPLoginRequest, TOTPValidateRequest, AuthResponse
from app.services.neo_client import neo_client
from app.core.exceptions import AuthenticationError

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/totp-login", response_model=AuthResponse)
async def totp_login(request: TOTPLoginRequest):
    """
    TOTP Login - Step 1
    
    Complete TOTP registration first from Kotak Securities website.
    This endpoint initiates the login process using TOTP from authenticator app.
    """
    try:
        result = await neo_client.totp_login(
            mobile_number=request.mobile_number,
            ucc=request.ucc,
            totp=request.totp
        )
        
        if result.get("data"):
            return AuthResponse(
                success=True,
                message="TOTP login successful. Please complete validation with MPIN.",
                data=result["data"],
                token=result["data"].get("token")
            )
        else:
            raise HTTPException(status_code=400, detail="TOTP login failed")
            
    except AuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.post("/totp-validate", response_model=AuthResponse)
async def totp_validate(request: TOTPValidateRequest):
    """
    TOTP Validation - Step 2
    
    Complete the authentication by validating with MPIN.
    Must call totp-login first.
    """
    try:
        result = await neo_client.totp_validate(mpin=request.mpin)
        
        if result.get("data"):
            return AuthResponse(
                success=True,
                message="Authentication successful",
                data=result["data"],
                token=result["data"].get("token")
            )
        else:
            raise HTTPException(status_code=400, detail="MPIN validation failed")
            
    except AuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")


@router.get("/status")
async def auth_status():
    """
    Check authentication status
    """
    return {
        "authenticated": neo_client.edit_token is not None,
        "has_view_token": neo_client.view_token is not None,
        "has_edit_token": neo_client.edit_token is not None
    }


@router.post("/logout")
async def logout():
    """
    Logout and clear session tokens
    """
    neo_client.view_token = None
    neo_client.edit_token = None
    neo_client.sid = None
    neo_client.rid = None
    neo_client.server_id = None
    
    return {
        "success": True,
        "message": "Logged out successfully"
    }