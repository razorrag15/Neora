# NEORA - Quick Setup Guide

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd neora_backend
pip install -r requirements.txt
```

Edit `docker_config.env`:
```bash
KITE_API_KEY=your_kite_api_key
KITE_API_SECRET=your_kite_api_secret
```

Start backend:
```bash
python dev.py
```

### 2. Frontend Setup

Edit `.env`:
```bash
VITE_BACKEND_URL=http://localhost:4000
VITE_ADMIN_KEY=your-secret-admin-key
```

**Important**: Match `VITE_ADMIN_KEY` with backend's `ADMIN_SECRET` in `neora_backend/app/api/v1/admin.py`

Start frontend:
```bash
npm run dev
```

### 3. Daily Authentication

1. Go to `/admin` (admin users only)
2. Click "Get Code" → Get TOTP
3. Click "Login to Kite" → Complete OAuth
4. Dashboard now shows real-time NIFTY 50 + SENSEX data

## 📝 Key Files

**Backend**:
- [`neora_backend/README.md`](neora_backend/README.md) - Detailed backend guide
- [`neora_backend/docker_config.env`](neora_backend/docker_config.env) - Configuration

**Frontend**:
- [`.env`](.env) - Environment variables
- [`src/services/neoraBackendService.ts`](src/services/neoraBackendService.ts) - API integration
- [`src/pages/admin/AdminPanel.tsx`](src/pages/admin/AdminPanel.tsx) - Admin interface

## 📊 Features

- ✅ Real-time NIFTY 50 (50 stocks)
- ✅ Real-time SENSEX (30 stocks)
- ✅ Auto-refresh every 30 seconds
- ✅ Color-coded price changes
- ✅ TOTP authentication
- ✅ Admin control panel

## 🔧 Troubleshooting

**Backend not starting?**
- Check port 4000 is free
- Verify Kite API credentials

**No market data?**
- Complete admin authentication
- Market hours: 9:15 AM - 3:30 PM IST

**CORS errors?**
- Check `CORS_ORIGINS` in `neora_backend/app/core/config.py`

---

For complete documentation, see [`INTEGRATION_COMPLETE.md`](INTEGRATION_COMPLETE.md)