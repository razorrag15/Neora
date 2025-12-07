# NEORA Market Dashboard Backend

Simple, secure backend API for real-time NIFTY 50 and SENSEX market data with TOTP authentication.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd neora_backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example environment file and add your Kite API credentials:

```bash
cp .env.example docker_config.env
```

Edit `docker_config.env`:
```bash
KITE_API_KEY=your_actual_kite_api_key
KITE_API_SECRET=your_actual_kite_api_secret
```

Get your Kite API credentials from: https://kite.zerodha.com/developers

### 3. Start the Server

```bash
python dev.py
```

Server will start on: `http://localhost:4000`

## 📋 Daily Workflow

### Step 1: Get Today's TOTP Code

```bash
curl -H "X-Admin-Key: your-secret-admin-key-change-this" \
  http://localhost:4000/api/v1/admin/totp/current
```

Response:
```json
{
  "date": "2024-12-04",
  "current_code": "123456",
  "expires_in_seconds": 43200,
  "message": "Use this code for Kite login today"
}
```

**Important:** Save the `current_code` (e.g., "123456")

### Step 2: Login to Kite (with TOTP)

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"totp_code": "123456"}'
```

Response:
```json
{
  "login_url": "https://kite.zerodha.com/connect/login?api_key=xxx",
  "message": "TOTP verified. Complete login in browser."
}
```

### Step 3: Complete Kite Login

1. Open the `login_url` in your browser
2. Login with your Zerodha credentials
3. You'll be automatically redirected to the callback
4. Backend is now authenticated for the day!

### Step 4: Access Market Data

```bash
curl http://localhost:4000/api/v1/market/dashboard
```

## 📡 API Endpoints

### Admin Endpoints (Require `X-Admin-Key` header)

- `GET /api/v1/admin/totp/current` - Get today's TOTP code
- `GET /api/v1/admin/totp/refresh` - Force new TOTP code
- `GET /api/v1/admin/status` - System status dashboard
- `GET /api/v1/admin/health` - Health check (public)

### Authentication Endpoints

- `POST /api/v1/auth/login` - Login with TOTP (Body: `{"totp_code": "123456"}`)
- `GET /api/v1/auth/callback` - Kite callback (automatic)
- `GET /api/v1/auth/status` - Check auth status

### Market Data Endpoints

- `GET /api/v1/market/dashboard` - Complete dashboard (NIFTY + SENSEX)
- `GET /api/v1/market/nifty50` - NIFTY 50 detail
- `GET /api/v1/market/sensex` - SENSEX detail

## 🔐 Security

### TOTP Authentication

- Daily 6-digit codes that change at midnight
- Required for Kite login
- Admin-only access to view codes
- Stored securely in `.totp_secret.json`

### Admin Key

**Important:** Change the default admin key!

Edit `app/api/v1/admin.py`:
```python
ADMIN_SECRET = "your-secure-admin-key-here"  # Change this!
```

Or use environment variable:
```python
import os
ADMIN_SECRET = os.getenv("ADMIN_SECRET_KEY", "fallback-key")
```

## 📊 Response Format

### Market Dashboard

```json
{
  "nifty_50": {
    "index_name": "NIFTY 50",
    "index_value": 19850.25,
    "index_change": 235.40,
    "index_change_percent": 1.2,
    "index_color": "green",
    "stocks": [
      {
        "symbol": "RELIANCE",
        "name": "RELIANCE",
        "price": 2460.75,
        "change": 36.50,
        "change_percent": 1.5,
        "color": "green"
      }
      // ... 49 more stocks
    ]
  },
  "sensex": {
    "index_name": "SENSEX",
    "index_value": 65450.80,
    "index_change": 520.30,
    "index_change_percent": 0.8,
    "index_color": "green",
    "stocks": [
      // ... 30 stocks
    ]
  },
  "timestamp": "2024-12-04T19:10:00"
}
```

## 🛠️ Troubleshooting

### "Invalid TOTP code"

Get today's fresh code:
```bash
curl -H "X-Admin-Key: your-admin-key" \
  http://localhost:4000/api/v1/admin/totp/current
```

### "Not authenticated" when accessing market data

Complete Kite login first:
1. Get TOTP code from admin endpoint
2. Call `/auth/login` with TOTP
3. Open login URL in browser
4. Complete Zerodha login

### TOTP not updating daily

Force refresh:
```bash
curl -H "X-Admin-Key: your-admin-key" \
  http://localhost:4000/api/v1/admin/totp/refresh
```

## 📁 Project Structure

```
neora_backend/
├── app/
│   ├── api/v1/
│   │   ├── admin.py          # Admin & TOTP endpoints
│   │   ├── auth.py           # Kite authentication
│   │   └── market_data.py    # Market dashboard
│   ├── core/
│   │   ├── config.py         # Configuration
│   │   ├── dependencies.py   # Dependency injection
│   │   └── totp_manager.py   # TOTP system
│   └── repositories/
│       └── kite_client.py    # Kite Connect client
├── docker_config.env         # Environment configuration
├── requirements.txt          # Python dependencies
├── dev.py                    # Development server
└── README.md                 # This file
```

## 🔄 Auto-Start Script (Optional)

Create `start.sh`:
```bash
#!/bin/bash
cd neora_backend
source venv/bin/activate  # If using virtualenv
python dev.py
```

Make it executable:
```bash
chmod +x start.sh
```

## 📝 Notes

- TOTP codes are valid for 24 hours (midnight to midnight)
- Kite authentication lasts for the entire trading day
- Backend does NOT store any personal trading data
- Only provides public market data (NIFTY 50 + SENSEX)

## 🆘 Support

For issues, check:
1. `/api/v1/admin/status` - System status
2. `/health` - Health check
3. Backend logs in terminal

## 📄 License

MIT License - See LICENSE file for details