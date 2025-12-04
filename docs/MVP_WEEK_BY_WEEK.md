# NEORA Intelligence - MVP Week-by-Week Implementation

**Branch:** `mvp-development`  
**Goal:** Fully working MVP deployed on Render in 4 weeks

---

## 🎯 MVP Scope

### What We're Building
- ✅ Complete authentication system (Login, Signup, Password Reset)
- ✅ Public landing page + market overview
- ✅ Protected dashboard with real Kotak Neo data
- ✅ Portfolio management (CRUD operations)
- ✅ Watchlist functionality
- ✅ Admin dashboard (hidden `/admin` route)
- ✅ User activity logging
- ✅ Deployed on Render (production-ready)

### What We're NOT Building (Yet)
- ❌ Web scraping (Phase 2)
- ❌ WebSocket real-time (Phase 3)
- ❌ Advanced charts (Phase 3)
- ❌ ML predictions (Phase 4)
- ❌ Premium features (Phase 5)

---

## Week 1: Frontend Foundation & Authentication (Days 1-7)

### Day 1-2: Project Setup & Dependencies

#### Install Dependencies
```bash
# Core dependencies
npm install react-router-dom@6
npm install zustand
npm install @supabase/supabase-js
npm install axios
npm install react-hook-form
npm install zod  # validation

# Development dependencies
npm install -D @types/react-router-dom
```

#### Create Project Structure
```
src/
├── pages/
│   ├── public/
│   │   ├── Landing.tsx
│   │   ├── MarketOverview.tsx
│   │   └── Pricing.tsx
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── portfolio/
│   │   └── Portfolio.tsx
│   ├── watchlist/
│   │   └── Watchlist.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── UserManagement.tsx
│       └── ActivityLogs.tsx
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── BackgroundEffects.tsx
│   ├── charts/
│   │   └── StockChart.tsx
│   └── stock/
│       ├── StockCard.tsx (existing)
│       └── StockDetails.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useMarketData.ts
│   └── usePortfolio.ts
├── services/
│   ├── api.ts
│   ├── supabase.ts
│   ├── auth.ts
│   └── market.ts
├── store/
│   ├── authStore.ts
│   ├── marketStore.ts
│   └── portfolioStore.ts
├── types/
│   ├── auth.ts
│   ├── stock.ts
│   └── portfolio.ts
├── utils/
│   ├── formatters.ts
│   └── validators.ts
├── App.tsx
└── main.tsx
```

### Day 3-4: React Router Setup

**File:** `src/App.tsx` (Refactored)
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Public pages
import Landing from './pages/public/Landing'
import MarketOverview from './pages/public/MarketOverview'
import Pricing from './pages/public/Pricing'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Protected pages
import Dashboard from './pages/dashboard/Dashboard'
import Portfolio from './pages/portfolio/Portfolio'
import Watchlist from './pages/watchlist/Watchlist'
import StockDetail from './pages/stocks/StockDetail'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'

// Layout components
import PublicLayout from './components/layout/PublicLayout'
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/layout/AdminLayout'

// Route guards
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/market" element={<MarketOverview />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/stocks/:symbol" element={<StockDetail />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Routes (Hidden) */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/activities" element={<ActivityLogs />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

### Day 5-6: Zustand State Management

**File:** `src/store/authStore.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types/auth'
import { authService } from '../services/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await authService.login(email, password)
          localStorage.setItem('token', token)
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          await authService.register(data)
          set({ isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      logout: async () => {
        await authService.logout()
        localStorage.removeItem('token')
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: async (data) => {
        const user = get().user
        if (!user) return
        
        const updatedUser = await authService.updateProfile(user.id, data)
        set({ user: updatedUser })
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
)
```

### Day 7: Supabase Integration

**File:** `src/services/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const authHelpers = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
  },

  getUser() {
    return supabase.auth.getUser()
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}
```

---

## Week 2: Backend Setup & Kotak Neo Integration (Days 8-14)

### Day 8-9: Backend Project Structure

Create backend directory structure:
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── dependencies.py
│   │   └── utils.py
│   ├── market/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── kotak_neo.py
│   │   └── schemas.py
│   ├── portfolio/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── admin/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   └── middleware.py
│   └── utils/
│       ├── cache.py
│       └── logger.py
├── alembic/
│   ├── versions/
│   └── env.py
├── requirements.txt
├── .env.example
└── README.md
```

### Day 10-11: FastAPI Implementation

**File:** `backend/app/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router
from app.market.router import router as market_router
from app.portfolio.router import router as portfolio_router
from app.admin.router import router as admin_router

app = FastAPI(
    title="NEORA Intelligence API",
    description="Stock Market Intelligence Platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://neora.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(market_router, prefix="/api/market", tags=["Market Data"])
app.include_router(portfolio_router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "NEORA Intelligence API v1.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### Day 12-13: Kotak Neo Integration

**File:** `backend/app/market/kotak_neo.py`
```python
from neo_api_client import NeoAPI
import os
from typing import List, Dict

class KotakNeoService:
    def __init__(self):
        self.client = NeoAPI(
            consumer_key=os.getenv("KOTAK_CONSUMER_KEY"),
            consumer_secret=os.getenv("KOTAK_CONSUMER_SECRET"),
            environment="prod"
        )
        self.access_token = None
    
    async def connect(self, mobile: str, password: str, otp: str = None):
        if not otp:
            self.client.login(mobilenumber=mobile, password=password)
            return {"status": "otp_required"}
        else:
            self.client.session_2fa(OTP=otp)
            self.access_token = self.client.access_token
            return {"status": "connected", "token": self.access_token}
    
    async def get_quote(self, symbol: str, exchange: str = "NSE"):
        quote = self.client.quotes(
            instrument_tokens=[{
                "instrument_token": symbol,
                "exchange_segment": exchange
            }]
        )
        return quote
    
    async def get_historical(self, symbol: str, interval: str = "1d"):
        data = self.client.history(
            instrument_token=symbol,
            exchange_segment="NSE",
            interval=interval
        )
        return data

kotak_neo = KotakNeoService()
```

### Day 14: API Endpoints Implementation

Complete all core API endpoints for authentication, market data, and portfolio.

---

## Week 3: Core Features (Days 15-21)

### Day 15-17: Portfolio Management
- Database models and migrations
- CRUD API endpoints
- Frontend components and pages
- Real-time P&L calculations

### Day 18-19: Watchlist Functionality
- Database schema
- API endpoints
- Frontend implementation
- Drag & drop reordering

### Day 20-21: Integration & Testing
- Connect all pieces
- Test user flows
- Fix bugs
- Performance optimization

---

## Week 4: Admin & Deployment (Days 22-28)

### Day 22-23: Admin Dashboard
- User management interface
- Activity logging
- System stats
- API usage monitoring

### Day 24-25: Render Deployment
- Configure render.yaml
- Set environment variables
- Deploy backend
- Deploy frontend

### Day 26-27: Testing & Polish
- End-to-end testing
- Security audit
- Performance testing
- UI/UX refinements

### Day 28: Launch!
- Final deployment
- Documentation update
- Monitoring setup
- Celebrate! 🎉

---

## Deployment Checklist

### Backend Deployment (Render)
- [ ] Create Render account
- [ ] Create PostgreSQL database
- [ ] Create Redis instance
- [ ] Create Web Service
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Test API endpoints

### Frontend Deployment (Render)
- [ ] Create Static Site
- [ ] Configure build command
- [ ] Set environment variables
- [ ] Deploy frontend
- [ ] Test all pages

### Post-Deployment
- [ ] Connect custom domain
- [ ] Setup SSL certificate
- [ ] Configure monitoring
- [ ] Setup error tracking
- [ ] Test complete user flows

---

## Environment Variables Needed

### Frontend (.env.local)
```env
VITE_API_URL=https://neora-backend.onrender.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SECRET_KEY=your_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
KOTAK_CONSUMER_KEY=your_kotak_key
KOTAK_CONSUMER_SECRET=your_kotak_secret
ENVIRONMENT=production
```

---

## Success Criteria

### Week 1 Complete ✅
- [ ] React Router setup with all routes
- [ ] Zustand state management working
- [ ] Supabase authentication integrated
- [ ] All auth pages functional
- [ ] Protected routes working

### Week 2 Complete ✅
- [ ] FastAPI backend running
- [ ] Database connected
- [ ] Kotak Neo API integrated
- [ ] All API endpoints working
- [ ] CORS configured

### Week 3 Complete ✅
- [ ] Portfolio CRUD working
- [ ] Watchlist functional
- [ ] Real-time quotes displaying
- [ ] User profile management
- [ ] All features tested

### Week 4 Complete ✅
- [ ] Admin dashboard functional
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Render
- [ ] All environment variables set
- [ ] Production testing complete

---

## Next Steps After MVP

1. Monitor production performance
2. Gather user feedback
3. Fix bugs and issues
4. Plan Phase 2 features
5. Start web scraping implementation

---

**Let's build this! 🚀**