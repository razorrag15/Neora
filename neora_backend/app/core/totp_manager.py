"""
TOTP (Time-based One-Time Password) Manager for Admin Authentication.

This module handles daily TOTP generation and validation for secure admin access.
The TOTP code changes every 24 hours and is required for Kite login.
"""

import pyotp
import logging
from datetime import datetime, timedelta
from typing import Optional, Tuple
import json
import os

logger = logging.getLogger(__name__)


class TOTPManager:
    """
    Manages TOTP generation and validation for admin authentication.
    
    Features:
    - Generates a new TOTP secret daily
    - Provides current valid TOTP code
    - Validates user-provided TOTP codes
    - Persists TOTP state to file for restarts
    """
    
    def __init__(self, secret_file: str = ".totp_secret.json"):
        """
        Initialize TOTP Manager.
        
        Args:
            secret_file: Path to file storing TOTP secret and metadata
        """
        self.secret_file = secret_file
        self.secret: Optional[str] = None
        self.secret_date: Optional[str] = None
        self.totp: Optional[pyotp.TOTP] = None
        
        # Load or generate secret
        self._initialize_secret()
    
    def _initialize_secret(self) -> None:
        """Initialize or load TOTP secret."""
        if os.path.exists(self.secret_file):
            self._load_secret()
        
        # Generate new secret if needed (first run or new day)
        today = datetime.now().strftime("%Y-%m-%d")
        if not self.secret or self.secret_date != today:
            self._generate_new_secret()
    
    def _load_secret(self) -> None:
        """Load TOTP secret from file."""
        try:
            with open(self.secret_file, 'r') as f:
                data = json.load(f)
                self.secret = data.get('secret')
                self.secret_date = data.get('date')
                
                if self.secret:
                    self.totp = pyotp.TOTP(self.secret, interval=86400)  # 24 hour interval
                    logger.info(f"Loaded TOTP secret for date: {self.secret_date}")
        except Exception as e:
            logger.error(f"Failed to load TOTP secret: {e}")
            self._generate_new_secret()
    
    def _save_secret(self) -> None:
        """Save TOTP secret to file."""
        try:
            data = {
                'secret': self.secret,
                'date': self.secret_date,
                'generated_at': datetime.now().isoformat()
            }
            with open(self.secret_file, 'w') as f:
                json.dump(data, f, indent=2)
            logger.info(f"Saved TOTP secret for date: {self.secret_date}")
        except Exception as e:
            logger.error(f"Failed to save TOTP secret: {e}")
    
    def _generate_new_secret(self) -> None:
        """Generate a new TOTP secret for today."""
        self.secret = pyotp.random_base32()
        self.secret_date = datetime.now().strftime("%Y-%m-%d")
        self.totp = pyotp.TOTP(self.secret, interval=86400)  # 24 hour interval
        self._save_secret()
        logger.info(f"Generated new TOTP secret for date: {self.secret_date}")
    
    def get_current_totp(self) -> str:
        """
        Get the current valid TOTP code.
        
        This is the code that admins need to enter for authentication.
        The code is valid for 24 hours (changes daily).
        
        Returns:
            6-digit TOTP code as string
        """
        # Check if we need a new secret for today
        today = datetime.now().strftime("%Y-%m-%d")
        if self.secret_date != today:
            self._generate_new_secret()
        
        if not self.totp:
            raise RuntimeError("TOTP not initialized")
        
        return self.totp.now()
    
    def verify_totp(self, code: str) -> bool:
        """
        Verify a TOTP code provided by the user.
        
        Args:
            code: 6-digit TOTP code to verify
            
        Returns:
            True if code is valid, False otherwise
        """
        # Check if we need a new secret for today
        today = datetime.now().strftime("%Y-%m-%d")
        if self.secret_date != today:
            self._generate_new_secret()
        
        if not self.totp:
            raise RuntimeError("TOTP not initialized")
        
        try:
            # Verify with a window of 1 (allows for small time drift)
            is_valid = self.totp.verify(code, valid_window=1)
            if is_valid:
                logger.info("TOTP verification successful")
            else:
                logger.warning("TOTP verification failed")
            return is_valid
        except Exception as e:
            logger.error(f"TOTP verification error: {e}")
            return False
    
    def get_totp_info(self) -> dict:
        """
        Get TOTP information for admin display.
        
        Returns:
            Dictionary with TOTP status and current code
        """
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Ensure we have today's secret
        if self.secret_date != today:
            self._generate_new_secret()
        
        current_code = self.get_current_totp()
        
        # Calculate when the code will expire (end of day)
        now = datetime.now()
        tomorrow = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        seconds_until_expiry = (tomorrow - now).total_seconds()
        
        return {
            "date": today,
            "current_code": current_code,
            "expires_in_seconds": int(seconds_until_expiry),
            "expires_at": tomorrow.isoformat(),
            "secret_initialized": self.secret is not None
        }
    
    def get_provisioning_uri(self, name: str = "NEORA Admin", issuer: str = "NEORA") -> str:
        """
        Get provisioning URI for QR code generation (optional).
        
        This can be used to set up TOTP in authenticator apps like Google Authenticator.
        
        Args:
            name: Account name
            issuer: Issuer name
            
        Returns:
            Provisioning URI string
        """
        if not self.totp:
            raise RuntimeError("TOTP not initialized")
        
        return self.totp.provisioning_uri(name=name, issuer_name=issuer)


# Global TOTP manager instance
_totp_manager: Optional[TOTPManager] = None


def get_totp_manager() -> TOTPManager:
    """
    Get or create the global TOTP manager instance.
    
    Returns:
        TOTPManager instance
    """
    global _totp_manager
    if _totp_manager is None:
        _totp_manager = TOTPManager()
    return _totp_manager