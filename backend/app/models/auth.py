"""
Authentication Models
"""
from pydantic import BaseModel, Field
from typing import Optional


class TOTPLoginRequest(BaseModel):
    """TOTP Login Request"""
    mobile_number: str = Field(..., description="Registered mobile number with country code")
    ucc: str = Field(..., description="Unique Client Code")
    totp: str = Field(..., description="6-digit TOTP from authenticator app")
    
    class Config:
        json_schema_extra = {
            "example": {
                "mobile_number": "+919876543210",
                "ucc": "ABC12345",
                "totp": "123456"
            }
        }


class TOTPValidateRequest(BaseModel):
    """TOTP Validation Request"""
    mpin: str = Field(..., description="6-digit MPIN")
    
    class Config:
        json_schema_extra = {
            "example": {
                "mpin": "123456"
            }
        }


class AuthResponse(BaseModel):
    """Authentication Response"""
    success: bool = Field(..., description="Success status")
    message: str = Field(..., description="Response message")
    data: Optional[dict] = Field(None, description="Response data")
    token: Optional[str] = Field(None, description="Access token")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Login successful",
                "data": {
                    "ucc": "ABC12345",
                    "greetingName": "John Doe"
                },
                "token": "eyJhbGc..."
            }
        }


class TokenData(BaseModel):
    """Token Data"""
    view_token: Optional[str] = None
    edit_token: Optional[str] = None
    sid: Optional[str] = None
    rid: Optional[str] = None
    server_id: Optional[str] = None