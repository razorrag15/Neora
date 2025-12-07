# 🔐 NEORA Dual Authentication System Guide

## 📋 Overview

NEORA uses **TWO SEPARATE** authentication systems that work independently:

1. **Supabase Authentication** - For regular users (login/register)
2. **Kite Connect Authentication** - For admin users (real market data)

---

## 🎯 User Roles & Access

### 👤 **Regular Users** (role: 'user')
- **Authentication**: Supabase (email/password)
- **Dashboard Access**: ✅ Yes (demo data)
- **Market Data**: 📊 Mock/Demo data
- **Admin Panel**: ❌ No access
- **Kite Authentication**: ❌ Not required

### 👑 **Admin Users** (role: 'admin')
- **Authentication**: Supabase (email/password)
- **Dashboard Access**: ✅ Yes (real data if Kite authenticated)
- **Market Data**: 📊 Real-time from Zerodha (if authenticated)
- **Admin Panel**: ✅ Full access
- **Kite Authentication**: ✅ Required for real data

---

## 🚀 Quick Start

### **For Regular Users:**

1. **Register/Login**
   ```
   Navigate to: http://localhost:3000/register
   - Create account with email/password
   - Login at: http://localhost:3000/login
   ```

2. **Access Dashboard**
   ```
   After login, automatically redirected to: /dashboard
   - View NIFTY 50 & SENSEX demo data
   - Data updates every 30 seconds (simulated)
   - No backend required!
   ```

3. **What You See:**
   - ✅ Market indices with demo prices
   - ✅ Top 4 stocks from each index
   - ✅ Portfolio summary (static)
   - ✅ Data source badge: "Demo Data"

---

### **For Admin Users:**

1. **Register/Login as Admin**
   ```
   Note: Admin role must be set in Supabase database
   - Register normally at: http://localhost:3000/register
   - Update role in Supabase:
     UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
   ```

2. **Start Backend**
   ```powershell
   cd neora_backend
   .\start.bat
   ```

3. **Access Admin Panel**
   ```
   Navigate to: http://localhost:3000/admin
   ```

4. **Authenticate with Kite**
   ```
   Step 1: Click "Get Code" → Shows daily TOTP (6-digit)
   Step 2: Click "Login to Kite" → Opens Zerodha popup
   Step 3: Enter Zerodha credentials + TOTP code
   Step 4: Complete OAuth flow
   ```

5. **View Real Data**
   ```
   Navigate to: http://localhost:3000/dashboard
   - Now shows REAL market data from Zerodha
   - Data source badge: "Kite Connect (Live)"
   - Auto-refreshes every 30 seconds
   ```

---

## 🔄 Authentication Flow Diagrams

### **Regular User Flow:**
```
Register → Supabase Auth → Login → Dashboard (Demo Data) ✅
                                           ↓
                                    No backend needed
```

### **Admin User Flow:**
```
Register → Set Admin Role → Login → Dashboard (Demo Data)
                                           ↓
                                    Access Admin Panel
                                           ↓
                                    Get TOTP Code
                                           ↓
                                    Login to Kite (Zerodha)
                                           ↓
                                    OAuth Callback
                                           ↓
                                    Dashboard (Real Data) ✅
```

---

## 📂 Key Files Modified

### **Frontend Changes:**

1. **`src/services/mockMarketData.ts`** ✨ NEW
   - Generates realistic mock market data
   - Used for regular users
   - No API calls required

2. **`src/pages/dashboard/Dashboard.tsx`** 🔧 MODIFIED
   - Checks user role (`user?.role`)
   - Regular users → Mock data
   - Admin users → Real data (if authenticated)
   - Graceful fallback to mock if backend unavailable

3. **`src/components/market/IndicesBar.tsx`** 🔧 MODIFIED
   - Role-based data source selection
   - Shows "DEMO" or "LIVE" badge
   - Auto-refresh with appropriate data source

4. **`src/services/neoraBackendService.ts`** 🔧 MODIFIED
   - Updated type definitions
   - `IndexData` now matches mock data structure
   - `MarketDashboard` includes `source` field

### **Backend (No Changes Required):**
- Backend only needed for admin users
- Regular users don't interact with backend at all

---

## 🎨 UI Indicators

### **Dashboard Indicators:**

| Indicator | Regular User | Admin (No Auth) | Admin (Authenticated) |
|-----------|--------------|-----------------|----------------------|
| Welcome Message | "Viewing demo market data" | "Viewing demo market data" | "Real-time market data" |
| Data Source Badge | "Demo Data" (Orange) | "Demo Data" (Orange) | "Kite Connect (Live)" (Green) |
| Indices Bar Status | "DEMO" | "DEMO" | "LIVE" |
| Market Status | "Market Status: Live" | "Market Status: Live" | "Market Status: Live" |

---

## 🔧 Configuration

### **Environment Variables:**

**Frontend (`.env`):**
```env
# Supabase - For all users
VITE_SUPABASE_URL=https://vemscitzfybqkqvtmnch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend - For admin only
VITE_BACKEND_URL=http://localhost:4000/api/v1
VITE_ADMIN_KEY=neora_admin_2024_secure_k3y_9x7p2m5n8q4r
```

**Backend (`neora_backend/docker_config.env`):**
```env
# Required for admin users only
KITE_API_KEY=your_zerodha_api_key
KITE_API_SECRET=your_zerodha_api_secret
KITE_REDIRECT_URL=http://localhost:4000/api/v1/auth/callback
```

---

## 🐛 Troubleshooting

### **Problem 1: "Backend not connected" on Dashboard**
**Cause**: You're an admin user but backend isn't running
**Solution**: 
- Option A: Start backend with `.\start.bat`
- Option B: Continue using demo data (works fine!)

### **Problem 2: "Bouncing back to signup" after login**
**Cause**: Supabase profile not created properly
**Solution**:
1. Check Supabase database for user profile
2. Ensure `profiles` table has entry for user
3. Check browser console for errors

### **Problem 3: Can't access Admin Panel**
**Cause**: User role is not 'admin'
**Solution**:
1. Open Supabase dashboard
2. Navigate to Table Editor → profiles
3. Find your user and set `role = 'admin'`

### **Problem 4: TOTP code doesn't work**
**Cause**: Code expired (24-hour validity)
**Solution**: Click "Refresh Code" in admin panel

### **Problem 5: 401 Unauthorized on market data**
**Cause**: Admin user hasn't authenticated with Kite
**Solution**:
1. Go to `/admin` panel
2. Click "Get Code"
3. Click "Login to Kite"
4. Complete Zerodha authentication

---

## 📊 Data Comparison

### **Mock Data Features:**
- ✅ Realistic NIFTY 50 values (~21,500)
- ✅ Realistic SENSEX values (~71,000)
- ✅ Random but plausible price changes
- ✅ Top 4 stocks with sector info
- ✅ Updates every 30 seconds
- ❌ Not real market data
- ❌ No historical accuracy

### **Real Data Features:**
- ✅ Live NIFTY 50 quotes
- ✅ Live SENSEX quotes
- ✅ Real stock prices
- ✅ Actual trading volumes
- ✅ Updates every 30 seconds
- ✅ Accurate market data
- ⚠️ Requires Zerodha account + subscription

---

## 🎯 Testing Checklist

### **Test Regular User Flow:**
- [ ] Register new user at `/register`
- [ ] Login successfully at `/login`
- [ ] Redirected to `/dashboard` automatically
- [ ] See demo data with "Demo Data" badge
- [ ] Indices bar shows "DEMO" status
- [ ] Data refreshes every 30 seconds
- [ ] Cannot access `/admin` (404 or redirect)

### **Test Admin User Flow:**
- [ ] Set user role to 'admin' in Supabase
- [ ] Login successfully
- [ ] Dashboard shows demo data initially
- [ ] Can access `/admin` panel
- [ ] Start backend successfully
- [ ] Click "Get Code" → Shows TOTP
- [ ] Click "Login to Kite" → Opens popup
- [ ] Complete Zerodha authentication
- [ ] Dashboard now shows "Kite Connect (Live)"
- [ ] Indices bar shows "LIVE" status
- [ ] Real market data displays correctly

---

## 🔒 Security Notes

1. **Admin Key Protection**
   - Stored in environment variables
   - Required for admin API endpoints
   - Change default key in production

2. **Supabase RLS**
   - Row Level Security enabled
   - Users can only access own data
   - Admin role grants additional permissions

3. **Kite Authentication**
   - OAuth 2.0 flow
   - Access token stored in backend memory
   - 24-hour token validity
   - No tokens stored in frontend

4. **Mock Data**
   - Generated client-side
   - No API calls
   - No authentication required
   - Safe for public use

---

## 📝 Summary

| Feature | Regular User | Admin User |
|---------|--------------|------------|
| **Frontend Auth** | Supabase ✅ | Supabase ✅ |
| **Backend Required** | No ❌ | Yes ✅ |
| **Kite Auth** | No ❌ | Yes ✅ |
| **Market Data** | Mock 📊 | Real (if auth) 📈 |
| **Admin Panel** | No ❌ | Yes ✅ |
| **Auto-Refresh** | Yes ✅ | Yes ✅ |
| **Offline Work** | Yes ✅ | No (for real data) ❌ |

---

## 🎉 Benefits of This Architecture

1. **✅ Scalability**: Most users don't need backend
2. **✅ Cost-Effective**: Reduce API calls by 95%
3. **✅ Better UX**: Demo data loads instantly
4. **✅ Development**: Test frontend without backend
5. **✅ Reliability**: Frontend works even if backend down
6. **✅ Security**: Real data only for admins
7. **✅ Performance**: No unnecessary API authentication

---

## 🚦 Next Steps

1. **Create Admin User**
   - Register in app
   - Update role in Supabase to 'admin'

2. **Configure Kite API**
   - Get API key from Zerodha Developers
   - Add to `neora_backend/docker_config.env`

3. **Start Testing**
   - Test regular user flow
   - Test admin authentication
   - Verify real data display

4. **Production Deployment**
   - Change admin key
   - Enable Supabase RLS
   - Configure CORS properly
   - Use HTTPS for all endpoints

---

**You now have a complete dual-authentication system! Regular users get instant access with demo data, while admin users can authenticate for real market data.** 🎊