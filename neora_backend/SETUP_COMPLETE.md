# Complete Backend Setup Guide

## Admin Credentials Clarification

### There are TWO types of authentication:

#### 1. **Admin Panel Access (Backend API Protection)**
- **Purpose**: Protects backend admin endpoints from unauthorized access
- **Location**: 
  - Backend: `neora_backend/app/api/v1/admin.py` line 24
  - Frontend: `.env` → `VITE_ADMIN_KEY`
- **Default Value**: `"your-secret-admin-key-change-this"`
- **How it works**: 
  - Frontend sends this key in `X-Admin-Key` header
  - Backend validates before allowing admin operations
  - This is NOT a login screen - it's API security

#### 2. **Kite Connect Authentication (Market Data Access)**
- **Purpose**: Login to Zerodha to fetch real market data
- **Method**: TOTP (Time-based One-Time Password)
- **How it works**:
  1. Admin panel generates daily TOTP code
  2. Use TOTP code to login to Kite Connect
  3. Complete OAuth flow with Zerodha credentials
  4. Backend gets access token for market data

### Key Point: NO Traditional Admin Login
- There's **NO username/password admin login**
- Admin panel is accessed directly at `/admin` route
- Frontend uses `VITE_ADMIN_KEY` to call backend admin APIs
- The "login" refers to authenticating with Zerodha Kite, not the admin panel itself

---

## Complete Setup Instructions

### Step 1: Create Virtual Environment

```bash
# Navigate to backend directory
cd neora_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Windows CMD:
.\venv\Scripts\activate.bat

# Linux/Mac:
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt
```

### Step 3: Configure Environment

Edit `docker_config.env`:

```env
# Kite Connect Credentials (GET FROM ZERODHA DEVELOPERS)
KITE_API_KEY=your_actual_api_key_here
KITE_API_SECRET=your_actual_api_secret_here
KITE_REDIRECT_URL=http://localhost:4000/api/v1/auth/callback

# Admin Configuration
ADMIN_SECRET=your-secret-admin-key-change-this

# Server Settings
PORT=4000
HOST=0.0.0.0
```

### Step 4: Configure Frontend

Edit `.env` in frontend root:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000

# Admin Key (MUST MATCH backend ADMIN_SECRET)
VITE_ADMIN_KEY=your-secret-admin-key-change-this
```

### Step 5: Start Backend

```bash
# Make sure virtual environment is activated
python dev.py
```

Expected output:
```
🔧 FastAPI Development Server
========================================
✅ All required packages are installed
✅ Environment file found: docker_config.env
🚀 Starting development server on port 4000
📖 API Documentation: http://localhost:4000/docs
🔍 Health Check: http://localhost:4000/health
🔄 Auto-reload enabled
------------------------------------------------------------
INFO:     Uvicorn running on http://0.0.0.0:4000 (Press CTRL+C to quit)
```

### Step 6: Start Frontend

```bash
# In frontend root directory
npm run dev
```

### Step 7: Access Admin Panel

1. Navigate to `http://localhost:5173/admin`
2. Click "Get Code" to fetch today's TOTP
3. Click "Login to Kite" to authenticate with Zerodha
4. Complete Zerodha login in popup window
5. Dashboard will now show real market data

---

## Troubleshooting

### Issue: "uvicorn not found"
**Solution**: Virtual environment not activated or dependencies not installed
```bash
# Activate venv first
.\venv\Scripts\Activate.ps1

# Then install
pip install -r requirements.txt
```

### Issue: "Cannot find path neora_backend\neora_backend"
**Solution**: You're already in neora_backend directory
```bash
# If in neora_frontend, do:
cd neora_backend

# If already in neora_backend, just run:
python dev.py
```

### Issue: Admin panel shows "Invalid admin credentials"
**Solution**: Admin keys don't match
1. Check `.env` → `VITE_ADMIN_KEY`
2. Check `neora_backend/app/api/v1/admin.py` line 24
3. Make sure they're identical
4. Restart both frontend and backend

### Issue: "Kite authentication failed"
**Solution**: 
1. Verify Kite API credentials in `docker_config.env`
2. Check TOTP code is fresh (fetched today)
3. Complete full Zerodha login flow in popup

---

## Project Structure

```
neora_frontend/
├── .env                          # Frontend config
├── src/
│   ├── pages/admin/
│   │   └── AdminPanel.tsx        # Admin UI (no login required)
│   └── services/
│       └── neoraBackendService.ts # Backend API calls
│
└── neora_backend/
    ├── docker_config.env         # Backend config
    ├── requirements.txt          # Python dependencies
    ├── dev.py                    # Development server
    ├── venv/                     # Virtual environment (create this)
    └── app/
        └── api/v1/
            ├── admin.py          # Admin endpoints
            ├── auth.py           # Kite authentication
            └── market_data.py    # Market data endpoints
```

---

## Quick Start Commands

```bash
# Backend
cd neora_backend
.\venv\Scripts\Activate.ps1  # Activate venv
python dev.py                # Start server

# Frontend (new terminal)
npm run dev                  # Start Vite server

# Access
# Frontend: http://localhost:5173
# Admin: http://localhost:5173/admin
# API Docs: http://localhost:4000/docs
```

---

## Security Notes

1. **Change default admin key** in production
2. **Never commit** `.env` or `docker_config.env` files
3. **Kite credentials** are sensitive - keep them secure
4. **TOTP codes** expire daily - regenerate each trading day
5. **Admin panel** has no separate login - protect the route in production
