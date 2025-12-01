# NEORA Intelligence - Complete Project Documentation

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** MVP Development Phase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Current State Analysis](#current-state-analysis)
3. [MVP Architecture](#mvp-architecture)
4. [Technology Stack](#technology-stack)
5. [Database Design](#database-design)
6. [API Documentation](#api-documentation)
7. [Security & Authentication](#security--authentication)
8. [Admin System](#admin-system)
9. [Deployment Strategy](#deployment-strategy)
10. [Future Roadmap](#future-roadmap)

---

## 1. Project Overview

### Vision
NEORA Intelligence is a next-generation Indian stock market companion application providing real-time market intelligence, portfolio management, and AI-powered insights.

### Mission
To democratize access to professional-grade stock market tools and data for Indian retail investors.

### Target Users
- **Retail Investors**: Individual traders and investors
- **Day Traders**: Active intraday traders
- **Long-term Investors**: Portfolio holders
- **Market Enthusiasts**: Learning and analysis

### Core Value Propositions
1. **Real-Time Data**: Zero-delay market data from Kotak Neo API
2. **Comprehensive Analytics**: Portfolio tracking, P&L analysis
3. **AI Intelligence**: Gemini-powered market insights
4. **User-Friendly**: Beautiful, intuitive interface
5. **Mobile-First**: Responsive design for all devices

---

## 2. Current State Analysis

### What Exists Now

**Frontend (React + TypeScript)**
```
neora_frontend/
├── App.tsx (784 lines - MONOLITHIC)
├── components/
│   ├── StockCard.tsx (✅ Good component)
│   └── GeminiAssistant.tsx (✅ AI chat interface)
├── types.ts (✅ TypeScript interfaces)
├── constants.ts (❌ Mock data only)
└── package.json (Basic dependencies)
```

**Features Implemented**
- ✅ Royal-themed UI design (light/dark mode)
- ✅ Dashboard with mock data
- ✅ Stock list view with mini charts
- ✅ Stock detail view with full charts
- ✅ Gemini AI assistant sidebar
- ✅ Responsive mobile menu
- ✅ Animated background effects
- ✅ Market indices ticker bar

**What's Missing**
- ❌ Real authentication system
- ❌ Backend API
- ❌ Database integration
- ❌ Real market data
- ❌ User management
- ❌ Portfolio tracking
- ❌ Proper routing
- ❌ State management

### Technical Debt to Address
1. **Monolithic App.tsx** - 784 lines need modularization
2. **No routing** - Using state-based view switching
3. **Mock data everywhere** - All data is static
4. **No API layer** - Direct component logic
5. **No error handling** - Production-grade error management needed
6. **No testing** - Unit/integration tests required

---

## 3. MVP Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TS)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Public Pages │  │ Auth Pages   │  │ Dashboard    │      │
│  │ - Landing    │  │ - Login      │  │ - Portfolio  │      │
│  │ - Market     │  │ - Signup     │  │ - Watchlist  │      │
│  │ - Pricing    │  │ - Reset      │  │ - Stocks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         React Router v6 + Zustand State             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Python FastAPI)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Service │  │ Market Data  │  │ Portfolio    │      │
│  │              │  │ Service      │  │ Service      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Admin Panel  │  │ User Mgmt    │  │ Activity     │      │
│  │              │  │              │  │ Logger       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Supabase    │    │  Kotak Neo   │    │    Redis     │
│  PostgreSQL  │    │     API      │    │    Cache     │
│              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Access Control Architecture

```
PUBLIC ACCESS (No Login)
├── Landing Page
├── Market Overview (limited data)
├── Stock Details (15-min delayed, 1 month history)
├── Pricing Page
└── Authentication Pages

AUTHENTICATED ACCESS (After Login)
├── Full Dashboard
├── Portfolio Management
├── Watchlist (multiple lists)
├── Real-time Stock Quotes
├── Full Historical Data (based on tier)
├── Profile & Settings
└── Kotak Neo Integration

ADMIN ACCESS (Hidden Route - /admin)
├── User Management
├── Activity Monitoring
├── API Usage Stats
├── System Health
├── Feature Flags
└── Database Management

Note: Admin route is NOT publicly accessible
- No link in UI for regular users
- Requires admin role in database
- Direct URL access only
- Role-based middleware protection
```

### Data Flow Architecture

```
User Action
    ↓
React Component
    ↓
Zustand Store (if needed)
    ↓
API Service Layer
    ↓
FastAPI Backend
    ↓
┌─────────────────┬─────────────────┐
│                 │                 │
Database Query    Kotak Neo API     Redis Cache
    ↓                 ↓                 ↓
Response          Live Data         Cached Data
    ↓                 ↓                 ↓
└─────────────────┴─────────────────┘
    ↓
Transform & Format
    ↓
Return to Frontend
    ↓
Update UI
```

---

## 4. Technology Stack

### Frontend Stack

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **React** | 19.2.0 | UI Framework | Best-in-class, huge ecosystem |
| **TypeScript** | 5.8.2 | Type Safety | Catch errors at compile time |
| **Vite** | 6.2.0 | Build Tool | Lightning fast dev server |
| **React Router** | 6.x | Routing | Standard for React apps |
| **Zustand** | Latest | State Management | Lightweight, simple API |
| **Tailwind CSS** | Latest | Styling | Rapid UI development |
| **Recharts** | 3.5.0 | Charts (MVP) | Easy to use, responsive |
| **TradingView** | Future | Advanced Charts | Industry standard |
| **Lucide React** | 0.554.0 | Icons | Beautiful, consistent |
| **@google/genai** | 1.30.0 | AI Integration | Gemini AI |

### Backend Stack

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Python** | 3.11+ | Language | ML/AI ready, data processing |
| **FastAPI** | 0.104+ | Web Framework | Modern, fast, async support |
| **Uvicorn** | 0.24+ | ASGI Server | Production-grade performance |
| **SQLAlchemy** | 2.0+ | ORM | Database abstraction |
| **Alembic** | Latest | Migrations | Schema version control |
| **Pydantic** | 2.5+ | Validation | Type-safe data validation |
| **python-jose** | Latest | JWT | Token authentication |
| **passlib** | Latest | Password Hash | Secure password storage |
| **neo-api-client** | Latest | Market Data | Kotak Neo integration |
| **Redis** | Latest | Caching | Performance optimization |
| **Pandas** | 2.1+ | Data Processing | Financial calculations |
| **NumPy** | 1.26+ | Numerical | Array operations |

### Database & Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Database** | Supabase PostgreSQL | Primary data storage |
| **Authentication** | Supabase Auth | User management |
| **File Storage** | Supabase Storage | User avatars, files |
| **Realtime** | Supabase Realtime | Live data sync |
| **Cache** | Redis (Render) | Performance |
| **Deployment** | Render | Hosting both services |
| **CI/CD** | GitHub Actions | Automated deployment |
| **Monitoring** | Sentry (Future) | Error tracking |
| **Analytics** | Mixpanel (Future) | User analytics |

### Development Tools

```bash
# Frontend
- ESLint + Prettier (Code formatting)
- Vitest (Unit testing)
- Playwright (E2E testing)

# Backend
- Black (Code formatting)
- Pytest (Testing)
- MyPy (Type checking)
- Ruff (Linting)

# Collaboration
- Git + GitHub
- Conventional Commits
- PR Templates
- Issue Templates
```

---

## 5. Database Design

### Complete Schema

```sql
-- =====================================================
-- AUTHENTICATION & USER MANAGEMENT
-- =====================================================

-- Extended User Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  
  -- Role-based access control
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  
  -- Subscription management
  subscription_tier TEXT DEFAULT 'free' 
    CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  
  -- Kotak Neo integration
  kotak_neo_connected BOOLEAN DEFAULT false,
  kotak_neo_mobile TEXT,
  
  -- Account status
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  
  -- Preferences
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  notifications_enabled BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  
  -- Indexes
  CONSTRAINT profiles_phone_unique UNIQUE (phone)
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_subscription ON profiles(subscription_tier);
CREATE INDEX idx_profiles_created ON profiles(created_at DESC);

-- =====================================================
-- KOTAK NEO INTEGRATION
-- =====================================================

CREATE TABLE kotak_neo_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Credentials (encrypted)
  mobile_number TEXT NOT NULL,
  encrypted_access_token TEXT,
  encrypted_refresh_token TEXT,
  
  -- Token management
  token_expires_at TIMESTAMP,
  last_token_refresh TIMESTAMP,
  
  -- Sync status
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP,
  sync_status TEXT DEFAULT 'pending',
  
  -- Error tracking
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kotak_creds_user ON kotak_neo_credentials(user_id);
CREATE INDEX idx_kotak_creds_active ON kotak_neo_credentials(is_active);

-- =====================================================
-- PORTFOLIO MANAGEMENT
-- =====================================================

CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL DEFAULT 'My Portfolio',
  description TEXT,
  
  -- Portfolio settings
  is_primary BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  color TEXT DEFAULT '#22c55e',
  
  -- Performance tracking
  total_invested DECIMAL(20, 2) DEFAULT 0,
  current_value DECIMAL(20, 2) DEFAULT 0,
  realized_pl DECIMAL(20, 2) DEFAULT 0,
  unrealized_pl DECIMAL(20, 2) DEFAULT 0,
  
  -- Sync
  auto_sync BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT one_primary_per_user UNIQUE (user_id, is_primary) 
    WHERE is_primary = true
);

CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_portfolios_primary ON portfolios(user_id, is_primary);

CREATE TABLE holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  
  -- Stock details
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL DEFAULT 'NSE',
  isin TEXT,
  
  -- Position
  quantity DECIMAL(15, 4) NOT NULL CHECK (quantity > 0),
  average_price DECIMAL(15, 2) NOT NULL CHECK (average_price > 0),
  
  -- Current values (cached)
  current_price DECIMAL(15, 2),
  current_value DECIMAL(20, 2),
  
  -- P&L calculations
  invested_amount DECIMAL(20, 2) GENERATED ALWAYS AS 
    (quantity * average_price) STORED,
  unrealized_pl DECIMAL(20, 2),
  unrealized_pl_percent DECIMAL(10, 4),
  
  -- Day P&L
  day_open_price DECIMAL(15, 2),
  day_pl DECIMAL(20, 2),
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  
  -- Sync
  synced_from_broker BOOLEAN DEFAULT false,
  last_price_update TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_holding UNIQUE (portfolio_id, symbol, exchange)
);

CREATE INDEX idx_holdings_portfolio ON holdings(portfolio_id);
CREATE INDEX idx_holdings_symbol ON holdings(symbol);
CREATE INDEX idx_holdings_exchange ON holdings(exchange);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  
  -- Transaction details
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL DEFAULT 'NSE',
  
  type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL', 'DIVIDEND', 'BONUS', 'SPLIT')),
  
  quantity DECIMAL(15, 4) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  
  -- Charges
  brokerage DECIMAL(10, 2) DEFAULT 0,
  stt DECIMAL(10, 2) DEFAULT 0,
  exchange_charges DECIMAL(10, 2) DEFAULT 0,
  gst DECIMAL(10, 2) DEFAULT 0,
  sebi_charges DECIMAL(10, 2) DEFAULT 0,
  stamp_duty DECIMAL(10, 2) DEFAULT 0,
  total_charges DECIMAL(10, 2) DEFAULT 0,
  
  -- Total
  total_amount DECIMAL(20, 2) NOT NULL,
  
  -- Metadata
  notes TEXT,
  order_id TEXT,
  trade_id TEXT,
  
  transaction_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_portfolio ON transactions(portfolio_id);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);

-- =====================================================
-- WATCHLIST MANAGEMENT
-- =====================================================

CREATE TABLE watchlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Customization
  color TEXT DEFAULT '#22c55e',
  icon TEXT,
  is_default BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  
  -- Sorting
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_default_watchlist UNIQUE (user_id, is_default) 
    WHERE is_default = true
);

CREATE INDEX idx_watchlists_user ON watchlists(user_id);
CREATE INDEX idx_watchlists_default ON watchlists(user_id, is_default);

CREATE TABLE watchlist_stocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL DEFAULT 'NSE',
  
  -- Custom notes
  notes TEXT,
  target_price DECIMAL(15, 2),
  stop_loss DECIMAL(15, 2),
  
  -- Metadata
  added_at TIMESTAMP DEFAULT NOW(),
  sort_order INTEGER DEFAULT 0,
  
  CONSTRAINT unique_watchlist_stock UNIQUE (watchlist_id, symbol, exchange)
);

CREATE INDEX idx_watchlist_stocks_list ON watchlist_stocks(watchlist_id);
CREATE INDEX idx_watchlist_stocks_symbol ON watchlist_stocks(symbol);

-- =====================================================
-- MARKET DATA CACHE
-- =====================================================

CREATE TABLE stock_quotes (
  id BIGSERIAL PRIMARY KEY,
  
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL,
  
  -- Price data
  ltp DECIMAL(15, 2),
  open DECIMAL(15, 2),
  high DECIMAL(15, 2),
  low DECIMAL(15, 2),
  close DECIMAL(15, 2),
  prev_close DECIMAL(15, 2),
  
  -- Change
  change DECIMAL(10, 2),
  change_percent DECIMAL(10, 4),
  
  -- Volume
  volume BIGINT,
  value DECIMAL(20, 2),
  
  -- Market depth
  bid DECIMAL(15, 2),
  ask DECIMAL(15, 2),
  bid_quantity BIGINT,
  ask_quantity BIGINT,
  
  -- Additional
  upper_circuit DECIMAL(15, 2),
  lower_circuit DECIMAL(15, 2),
  
  -- Timestamp
  quote_timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_quote UNIQUE (symbol, exchange, quote_timestamp)
);

CREATE INDEX idx_quotes_symbol_time ON stock_quotes(symbol, exchange, quote_timestamp DESC);
CREATE INDEX idx_quotes_timestamp ON stock_quotes(quote_timestamp DESC);

-- Partition by date for better performance
SELECT create_hypertable('stock_quotes', 'quote_timestamp');

CREATE TABLE stock_ohlcv (
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL,
  
  timestamp TIMESTAMP NOT NULL,
  interval TEXT NOT NULL, -- '1m', '5m', '15m', '30m', '1h', '1d'
  
  open DECIMAL(15, 2) NOT NULL,
  high DECIMAL(15, 2) NOT NULL,
  low DECIMAL(15, 2) NOT NULL,
  close DECIMAL(15, 2) NOT NULL,
  volume BIGINT NOT NULL,
  
  PRIMARY KEY (symbol, exchange, timestamp, interval)
);

CREATE INDEX idx_ohlcv_symbol_interval ON stock_ohlcv(symbol, exchange, interval, timestamp DESC);

-- =====================================================
-- PRICE ALERTS
-- =====================================================

CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL DEFAULT 'NSE',
  
  -- Alert conditions
  condition_type TEXT NOT NULL CHECK (condition_type IN 
    ('above', 'below', 'change_percent', 'volume_spike')),
  target_value DECIMAL(15, 2) NOT NULL,
  
  -- Alert settings
  is_active BOOLEAN DEFAULT true,
  repeat_alert BOOLEAN DEFAULT false,
  
  -- Notification channels
  notify_email BOOLEAN DEFAULT true,
  notify_push BOOLEAN DEFAULT true,
  
  -- Status
  triggered_at TIMESTAMP,
  trigger_count INTEGER DEFAULT 0,
  
  -- Metadata
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_alerts_user ON price_alerts(user_id, is_active);
CREATE INDEX idx_alerts_symbol ON price_alerts(symbol, is_active);

-- =====================================================
-- USER ACTIVITY LOGGING
-- =====================================================

CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Activity details
  activity_type TEXT NOT NULL,
  activity_category TEXT,
  activity_data JSONB,
  
  -- Session info
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  
  -- Location (optional)
  country TEXT,
  city TEXT,
  
  -- Performance
  response_time_ms INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_user_time ON user_activities(user_id, created_at DESC);
CREATE INDEX idx_activities_type ON user_activities(activity_type, created_at DESC);
CREATE INDEX idx_activities_ip ON user_activities(ip_address, created_at DESC);

-- =====================================================
-- API USAGE TRACKING
-- =====================================================

CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  
  -- Request details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  
  -- Response
  status_code INTEGER,
  response_time_ms INTEGER,
  
  -- Rate limiting
  rate_limit_hit BOOLEAN DEFAULT false,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_usage_user ON api_usage(user_id, created_at DESC);
CREATE INDEX idx_api_usage_endpoint ON api_usage(endpoint, created_at DESC);
CREATE INDEX idx_api_usage_status ON api_usage(status_code, created_at DESC);

-- =====================================================
-- ADMIN & SYSTEM
-- =====================================================

CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id),
  
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  
  old_values JSONB,
  new_values JSONB,
  
  ip_address INET,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_admin ON audit_logs(admin_id, created_at DESC);
CREATE INDEX idx_audit_action ON audit_logs(action, created_at DESC);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at BEFORE UPDATE ON holdings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate portfolio totals
CREATE OR REPLACE FUNCTION update_portfolio_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE portfolios SET
    total_invested = (
      SELECT COALESCE(SUM(quantity * average_price), 0)
      FROM holdings WHERE portfolio_id = NEW.portfolio_id
    ),
    current_value = (
      SELECT COALESCE(SUM(quantity * COALESCE(current_price, average_price)), 0)
      FROM holdings WHERE portfolio_id = NEW.portfolio_id
    )
  WHERE id = NEW.portfolio_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_totals_trigger
AFTER INSERT OR UPDATE OR DELETE ON holdings
FOR EACH ROW EXECUTE FUNCTION update_portfolio_totals();
```

---

## 6. API Documentation

### Base URL
```
Production: https://api.neora.app
Staging: https://neora-backend-api.onrender.com
Development: http://localhost:8000
```

### Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### API Endpoints

#### **Authentication** (`/api/auth`)

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "+919876543210"
}

Response 201:
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": false,
  "message": "Verification email sent"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "subscription_tier": "free"
  }
}
```

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response 200:
{
  "message": "Password reset link sent to email"
}
```

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "new_password": "NewSecurePass123!"
}

Response 200:
{
  "message": "Password successfully reset"
}
```

```http
GET /api/auth/verify-email/:token

Response 200:
{
  "message": "Email verified successfully"
}
```

```http
GET /api/auth/me
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "subscription_tier": "premium",
  "kotak_neo_connected": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### **Market Data** (`/api/market`)

```http
GET /api/market/indices

Response 200:
[
  {
    "symbol": "NIFTY 50",
    "value": 19674.25,
    "change": 123.50,
    "change_percent": 0.63,
    "timestamp": "2024-12-01T15:30:00Z"
  },
  ...
]
```

```http
GET /api/market/top-gainers?limit=10

Response 200:
[
  {
    "symbol": "RELIANCE",
    "name": "Reliance Industries Ltd.",
    "price": 2450.50,
    "change": 145.30,
    "change_percent": 6.31,
    "volume": 12000000
  },
  ...
]
```

```http
GET /api/market/search?q=RELIANCE&limit=5

Response 200:
[
  {
    "symbol": "RELIANCE",
    "name": "Reliance Industries Ltd.",
    "exchange": "NSE",
    "sector": "Energy",
    "isin": "INE002A01018"
  },
  ...
]
```

#### **Stocks** (`/api/stocks`)

```http
GET /api/stocks/RELIANCE/quote?exchange=NSE
Authorization: Bearer <token>

Response 200:
{
  "symbol": "RELIANCE",
  "exchange": "NSE",
  "ltp": 2450.50,
  "open": 2430.00,
  "high": 2465.80,
  "low": 2425.40,
  "close": 2450.50,
  "prev_close": 2305.20,
  "change": 145.30,
  "change_percent": 6.31,
  "volume": 12000000,
  "timestamp": "2024-12-01T15:30:00Z"
}
```

```http
GET /api/stocks/RELIANCE/historical?interval=1d&from=2024-01-01&to=2024-12-01
Authorization: Bearer <token>

Response 200:
[
  {
    "timestamp": "2024-01-01T00:00:00Z",
    "open": 2400.00,
    "high": 2420.50,
    "low": 2390.00,
    "close": 2410.30,
    "volume": 8500000
  },
  ...
]
```

#### **Portfolio** (`/api/portfolio`)

```http
GET /api/portfolio
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "name": "My Portfolio",
  "total_invested": 500000.00,
  "current_value": 565000.00,
  "unrealized_pl": 65000.00,
  "unrealized_pl_percent": 13.00,
  "holdings_count": 15,
  "holdings": [...]
}
```

```http
POST /api/portfolio/holdings
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "TCS",
  "exchange": "NSE",
  "quantity": 10,
  "average_price": 3450.00
}

Response 201:
{
  "id": "uuid",
  "symbol": "TCS",
  "quantity": 10,
  "average_price": 3450.00,
  "invested_amount": 34500.00
}
```

#### **Admin** (`/api/admin`)

```http
GET /api/admin/users?page=1&limit=50
Authorization: Bearer <admin_token>

Response 200:
{
  "total": 1250,
  "page": 1,
  "limit": 50,
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user",
      "subscription_tier": "free",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "last_login_at": "2024-12-01T10:30:00Z"
    },
    ...
  ]
}
```

```http
GET /api/admin/stats
Authorization: Bearer <admin_token>

Response 200:
{
  "total_users": 1250,
  "active_users_today": 342,
  "new_signups_today": 15,
  "total_portfolios": 1580,
  "total_transactions": 45230,
  "api_calls_today": 125000,
  "kotak_neo_connections": 450
}
```

### Rate Limiting

| Tier | Requests per Minute |
|------|---------------------|
| Public | 60 |
| Free User | 120 |
| Premium | 300 |
| Pro | 600 |
| Admin | Unlimited |

### Error Responses

```json
{
  "detail": "Error message here",
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2024-12-01T12:00:00Z"
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid input data
- `AUTHENTICATION_ERROR` - Invalid or missing token
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `RATE_LIMIT_ERROR` - Too many requests
- `NOT_FOUND` - Resource not found
- `SERVER_ERROR` - Internal server error

---

## 7. Security & Authentication

### Authentication Flow

```
1. User Registration
   ├── Validate email/password
   ├── Hash password (bcrypt)
   ├── Create user in database
   ├── Send verification email
   └── Return user data (inactive)

2. Email Verification
   ├── Click link in email
   ├── Verify token
   ├── Activate account
   └── Redirect to login

3. Login
   ├── Validate credentials
   ├── Check if email verified
   ├── Generate JWT token (30 min expiry)
   ├── Log activity
   └── Return token + user data

4. Token Refresh
   ├── Validate refresh token
   ├── Generate new access token
   └── Return new token

5. Logout
   ├── Invalidate token (blacklist)
   ├── Log activity
   └── Clear client-side storage
```

### Password Policy

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Cannot contain email address
- Cannot be common passwords

### JWT Token Structure

```json
{
  "sub": "user@example.com",
  "user_id": "uuid",
  "role": "user",
  "subscription_tier": "premium",
  "exp": 1701432000,
  "iat": 1701430200
}
```

### Role-Based Access Control (RBAC)

```python
# Middleware checks
def require_role(required_role: str):
    if current_user.role != required_role:
        raise HTTPException(403, "Insufficient permissions")

# Usage
@router.get("/admin/users")
@require_role("admin")
async def get_users():
    ...
```

### Security Headers

```python
# FastAPI middleware
app.add_middleware(
    SecurityHeadersMiddleware,
    headers={
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000",
        "Content-Security-Policy": "default-src 'self'"
    }
)
```

### Data Encryption

- **Passwords**: bcrypt (cost factor 12)
- **API Keys**: AES-256 encryption
- **Tokens**: JWT with RS256 signing
- **Database**: At-rest encryption (Supabase)
- **Transit**: TLS 1.3

### API Security

1. **Rate Limiting**
   - Redis-based distributed limiting
   - Per-user and per-IP limits
   - Exponential backoff on abuse

2. **Request Validation**
   - Pydantic models for all inputs
   - SQL injection prevention (ORM)
   - XSS sanitization

3. **CORS Policy**
   ```python
   CORS(
       allow_origins=["https://neora.app"],
       allow_credentials=True,
       allow_methods=["GET", "POST", "PUT", "DELETE"],
       allow_headers=["*"]
   )
   ```

---

## 8. Admin System

### Admin Access

**Hidden Route:** `https://neora.app/admin` (not linked anywhere)

**Access Requirements:**
1. Valid JWT token
2. `role = 'admin'` in database
3. Active account status
4. IP whitelist (optional security layer)

### Admin Dashboard Features

#### User Management
```
- View all users (paginated, searchable)
- Filter by:
  * Role (user/admin)
  * Subscription tier
  * Active status
  * Registration date
  * Last activity
  
- Actions:
  * View user details
  * Change user role
  * Suspend/activate account
  * Reset password
  * View user activity log
  * Impersonate user (audit logged)
```

#### Activity Monitoring
```
- Real-time activity feed
- Filter by:
  * User
  * Activity type
  * Date range
  * IP address
  
- Export logs (CSV/JSON)
- View detailed activity data
- Anomaly detection alerts
```

#### API Usage Stats
```
- Total API calls (daily/weekly/monthly)
- Calls per endpoint
- Response time analytics
- Error rate tracking
- Top users by API usage
- Rate limit violations
- Kotak Neo API status
```

#### System Health
```
- Server uptime
- Database connection pool
- Redis cache hit rate
- Memory usage
- CPU usage
- Disk space
- Background job queue status
```

#### Feature Flags
```
- Enable/disable features remotely
- A/B testing configuration
- Maintenance mode toggle
- API endpoint toggles
```

### Admin API Endpoints

All admin endpoints require `role='admin'`:

```
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id/role
PUT    /api/admin/users/:id/status
GET    /api/admin/activities
GET    /api/admin/stats
GET    /api/admin/api-usage
GET    /api/admin/system-health
PUT    /api/admin/feature-flags
GET    /api/admin/audit-logs
```

### Audit Logging

All admin actions are logged:

```sql
INSERT INTO audit_logs (
  admin_id,
  action,
  target_type,
  target_id,
  old_values,
  new_values,
  ip_address
) VALUES (...);
```

Example log entry:
```json
{
  "admin_id": "admin-uuid",
  "action": "user_role_changed",
  "target_type": "user",
  "target_id": "user-uuid",
  "old_values": {"role": "user"},
  "new_values": {"role": "admin"},
  "ip_address": "103.x.x.x",
  "timestamp": "2024-12-01T12:00:00Z"
}
```

---

## 9. Deployment Strategy

### Infrastructure Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Cloudflare CDN                       │
│              (DNS + DDoS Protection)                  │
└────────────────────┬─────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼────────┐
│   Frontend     │      │    Backend      │
│   (Render)     │      │   (Render)      │
│   Static Site  │      │   Web Service   │
└───────┬────────┘      └────────┬────────┘
        │                        │
        │                ┌───────┴────────┐
        │                │                │
        │        ┌───────▼───────┐  ┌────▼─────┐
        │        │   Supabase    │  │  Redis   │
        │        │  PostgreSQL   │  │ (Render) │
        │        └───────────────┘  └──────────┘
        │
        └────────────────┐
                         │
                  ┌──────▼──────┐
                  │ Kotak Neo   │
                  │     API     │
                  └─────────────┘
```

### Render Configuration

#### Frontend Deployment

**render.yaml (Static Site)**
```yaml
services:
  - type: web
    name: neora-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    
    # Environment variables
    envVars:
      - key: VITE_API_URL
        value: https://neora-backend-api.onrender.com
      - key: VITE_SUPABASE_URL
        sync: false
      - key: VITE_SUPABASE_ANON_KEY
        sync: false
    
    # Routes
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    
    # Custom domain
    domains:
      - neora.app
      - www.neora.app
```

#### Backend Deployment

**render.yaml (Web Service)**
```yaml
services:
  - type: web
    name: neora-backend-api
    env: python
    region: singapore
    plan: starter
    
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2
    
    healthCheckPath: /health
    
    # Auto-scaling
    autoDeploy: true
    
    # Environment variables
    envVars:
      - key: PYTHON_VERSION
        value: "3.11"
      
      - key: DATABASE_URL
        fromDatabase:
          name: neora-db
          property: connectionString
      
      - key: REDIS_URL
        fromDatabase:
          name: neora-redis
          property: connectionString
      
      - key: SECRET_KEY
        generateValue: true
      
      - key: SUPABASE_URL
        sync: false
      
      - key: SUPABASE_SERVICE_KEY
        sync: false
      
      - key: KOTAK_CONSUMER_KEY
        sync: false
      
      - key: KOTAK_CONSUMER_SECRET
        sync: false
      
      - key: ENVIRONMENT
        value: production
      
      - key: LOG_LEVEL
        value: INFO
      
      - key: CORS_ORIGINS
        value: https://neora.app,https://www.neora.app

databases:
  - name: neora-db
    databaseName: neora_production
    plan: starter
    region: singapore
  
  - name: neora-redis
    plan: starter
    region: singapore
    maxmemoryPolicy: allkeys-lru
```

### CI/CD Pipeline

**GitHub Actions Workflow**

```.github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/tests
  
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '19'
      - run: npm install
      - run: npm run test
      - run: npm run build
  
  deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### Environment Management

```
Development  → localhost:5173 (frontend) + localhost:8000 (backend)
Staging      → neora-staging.onrender.com
Production   → neora.app
```

### Monitoring & Logging

1. **Application Monitoring**
   - Sentry for error tracking
   - New Relic for performance
   - Custom metrics dashboard

2. **Logs**
   - Structured JSON logging
   - Log aggregation in Render
   - Alert on error spikes

3. **Uptime Monitoring**
   - UptimeRobot for 24/7 monitoring
   - Status page (status.neora.app)

### Backup Strategy

1. **Database Backups**
   - Supabase automatic daily backups
   - Point-in-time recovery (7 days)
   - Manual backup before major deployments

2. **Code Backups**
   - Git repository (GitHub)
   - Tagged releases
   - Docker images (future)

### Disaster Recovery

**RTO (Recovery Time Objective):** 4 hours  
**RPO (Recovery Point Objective):** 24 hours

**Recovery Steps:**
1. Restore Supabase database from backup
2. Redeploy backend from Git
3. Redeploy frontend from Git
4. Verify all services
5. Update DNS if needed

---

## 10. Future Roadmap

### Phase 2: Enhanced Data & Features (Month 2)

#### Web Scraping Implementation
```
NSE India Scraper
├── Bulk deals
├── Block deals
├── Insider trading
├── Corporate announcements
└── Market reports

BSE Scraper
├── Stock announcements
├── Results calendar
└── AGM dates

Moneycontrol Scraper
├── News articles
├── Stock recommendations
├── Expert opinions
└── Market analysis

Economic Times RSS
├── Breaking news
├── Market news
└── Company news
```

#### News & Sentiment
- Multi-source news aggregation
- Gemini AI sentiment analysis
- Stock-specific news linking
- News alerts via email/push
- Trending topics detection

#### IPO Tracker
- Upcoming IPOs calendar
- Live subscription status
- GMP (Grey Market Premium) tracking
- Allotment status checker
- Historical IPO performance

#### Corporate Actions
- Dividend calendar
- Bonus issue tracker
- Stock split announcements
- Rights issue details
- Board meeting schedules
- Result announcements

---

### Phase 3: Real-Time & Advanced Analytics (Month 3)

#### WebSocket Integration
```python
# Real-time data streaming
WebSocket Server
├── Kotak Neo live feed
├── Multi-client broadcasting
├── Auto-reconnection
├── Data compression
└── Latency < 100ms

Frontend Updates
├── Live price tickers
├── Real-time chart updates
├── Portfolio live P&L
└── Multi-tab synchronization
```

#### Advanced Charting
- TradingView Advanced Charts integration
- 50+ technical indicators
- Drawing tools (trend lines, patterns)
- Multi-timeframe analysis
- Compare multiple stocks
- Chart pattern recognition
- Custom indicators

#### Stock Screener
```
Filters (50+):
├── Fundamental
│   ├── Market Cap
│   ├── P/E Ratio
│   ├── P/B Ratio
│   ├── Dividend Yield
│   ├── ROE, ROCE
│   └── Debt-to-Equity
│
├── Technical
│   ├── RSI
│   ├── MACD
│   ├── Moving Averages
│   ├── Volume
│   └── Price patterns
│
└── Custom
    ├── Save filters
    ├── Preset screens
    └── Backtesting
```

#### Options Analysis
- Options chain viewer
- Greeks calculator
- Strategy builder
- Payoff diagrams
- Open interest analysis
- IV (Implied Volatility) charts

---

### Phase 4: AI & Machine Learning (Month 4)

#### Predictive Models
```python
Stock Price Prediction
├── LSTM Neural Networks
├── ARIMA models
├── Random Forest
├── XGBoost
└── Ensemble methods

Features:
- Next day prediction
- 1-week forecast
- 1-month outlook
- Confidence intervals
- Accuracy tracking
```

#### Sentiment Analysis
- News sentiment scoring
- Social media sentiment
- Sector sentiment trends
- Company-specific sentiment
- Sentiment-based trading signals

#### Portfolio Optimization
- Modern Portfolio Theory (MPT)
- Risk-adjusted returns
- Sharpe ratio optimization
- Sector allocation suggestions
- Rebalancing recommendations

#### Pattern Recognition
- Chart pattern detection
- Candlestick patterns
- Support/resistance identification
- Breakout detection
- Volume analysis patterns

#### AI Insights
- Daily market summary
- Stock recommendations
- Risk warnings
- Opportunity alerts
- Portfolio health score

---

### Phase 5: Premium Features & Monetization (Month 5)

#### Subscription Plans

**Free Tier**
- 15-minute delayed quotes
- 1 portfolio
- 1 watchlist
- Basic charts (1 year data)
- 5 price alerts
- Community features

**Premium Tier ($9.99/month)**
- Real-time quotes
- 3 portfolios
- 5 watchlists
- Advanced charts (5 years data)
- 25 price alerts
- Email alerts
- Basic screener
- News sentiment
- Priority support

**Pro Tier ($24.99/month)**
- Everything in Premium
- Unlimited portfolios/watchlists
- Historical data (10+ years)
- Unlimited alerts
- Advanced screener (50+ filters)
- Options analytics
- AI predictions
- Backtesting
- API access (1000 calls/day)
- Research reports
- No ads

#### Payment Integration
- Razorpay integration
- Subscription management
- Auto-renewal
- Invoice generation
- Promo codes
- Referral program

#### API Marketplace
- Developer API access
- Webhooks
- Rate limits by tier
- API documentation
- SDK libraries (Python, JS)

---

### Phase 6: Mobile & Scale (Month 6)

#### Progressive Web App (PWA)
- Installable on mobile
- Offline functionality
- Push notifications
- Background sync
- Add to home screen
- App-like experience

#### Mobile Optimization
- Touch-friendly UI
- Bottom navigation
- Swipe gestures
- Mobile charts
- Optimized performance
- Reduced data usage

#### Scaling Infrastructure
```
Horizontal Scaling
├── Load balancer
├── Multiple backend instances
├── Database read replicas
├── Redis cluster
└── CDN for static assets

Caching Strategy
├── API response caching (Redis)
├── Database query caching
├── Static asset caching
├── Browser caching
└── Service worker caching

Performance Targets
├── API response < 100ms
├── Page load < 1 second
├── Real-time latency < 50ms
└── 10,000+ concurrent users
```

#### Docker & Kubernetes
```yaml
# Containerization
Backend: Docker image
Frontend: Docker image
Database: Managed service
Redis: Managed service

# Orchestration
Kubernetes deployment
- Auto-scaling
- Rolling updates
- Health checks
- Load balancing
- Secret management
```

---

### Phase 7: Community & Social (Month 7)

#### Social Features
- User profiles (public/private)
- Follow other investors
- Share watchlists
- Share portfolios (performance only)
- Investment ideas discussion
- Comment on stocks
- Like/bookmark posts

#### Community Forums
- Discussion boards
- Stock-specific threads
- Strategy sharing
- Q&A section
- Expert AMA sessions

#### Leaderboards
- Top performers
- Most profitable trades
- Best predictions
- Community rankings
- Contests & competitions

#### Educational Content
- Stock market academy
- Video tutorials
- Trading strategies
- Risk management
- Technical analysis courses
- Fundamental analysis guides

---

### Phase 8: Advanced Features (Month 8+)

#### Algorithmic Trading
- Strategy builder (visual)
- Backtesting engine
- Paper trading
- Auto-trade execution
- Strategy marketplace

#### Multi-Asset Support
- Mutual funds
- ETFs
- Bonds
- Commodities (Gold, Silver)
- Cryptocurrencies
- US stocks

#### International Markets
- US market (NASDAQ, NYSE)
- European markets
- Asian markets
- Currency converter
- Multi-currency portfolios

#### Broker Integration
- Multiple broker support
- Order placement
- Auto-sync holdings
- Transaction import
- Tax calculation (STCG/LTCG)

#### Advanced Analytics
- Risk metrics (Beta, Alpha, Sharpe)
- Correlation analysis
- Sector rotation strategies
- Market breadth indicators
- Volatility analysis
- Options strategies P&L

---

## Technology Evolution Timeline

```
Now (Month 1)
├── React + TypeScript
├── Python FastAPI
├── Supabase
├── Kotak Neo API
└── Render hosting

Month 3
├── + WebSocket server
├── + Redis cluster
├── + TradingView charts
└── + Background workers

Month 6
├── + Docker containers
├── + Kubernetes
├── + Microservices
├── + Message queue
└── + CI/CD pipeline

Month 12
├── + Machine learning models
├── + Big data processing
├── + Real-time analytics
├── + Global CDN
└── + Multi-region deployment
```

---

## Success Metrics & KPIs

### User Metrics
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- User retention rate (7-day, 30-day)
- New user signups per day
- User churn rate

### Engagement Metrics
- Session duration
- Pages per session
- Portfolio updates per week
- Watchlist modifications
- API calls per user

### Business Metrics
- Free to paid conversion rate
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (LTV)
- Churn rate
- Net Promoter Score (NPS)

### Technical Metrics
- API response time (p95, p99)
- Error rate
- Uptime (target: 99.9%)
- WebSocket latency
- Database query performance

---

## Support & Maintenance

### Support Channels
- Email: support@neora.app
- Live chat (premium users)
- Community forum
- Knowledge base
- Video tutorials

### Maintenance Windows
- Scheduled: Sundays 2-4 AM IST
- Emergency: As needed (notifications sent)
- Zero-downtime deployments (future)

### SLA (Service Level Agreement)
**Free Tier:** Best effort  
**Premium:** 99.5% uptime  
**Pro:** 99.9% uptime

---

## Legal & Compliance

### Disclaimers
- Not SEBI registered advisory
- For informational purposes only
- Past performance ≠ future results
- Investment risks disclosure

### Privacy Policy
- GDPR compliant
- Data encryption
- No selling user data
- Transparent data usage

### Terms of Service
- User responsibilities
- Service limitations
- Content ownership
- Dispute resolution

---

## Contact & Resources

**Website:** https://neora.app  
**API Docs:** https://api.neora.app/docs  
**Status Page:** https://status.neora.app  
**GitHub:** https://github.com/neora-app  
**Email:** hello@neora.app  
**Support:** support@neora.app

---

**Document Version:** 1.0.0  
**Last Updated:** December 2024  
**Next Review:** Monthly

---

*This document is a living specification and will be updated as the project evolves.*