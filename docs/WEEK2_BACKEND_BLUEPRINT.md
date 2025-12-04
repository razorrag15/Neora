# Week 2: Backend Development - Complete Blueprint

**Objective**: Build Python FastAPI backend with Kotak Neo API integration, database setup, and core API endpoints.

---

## 📋 Week 2 Overview

### Goals
1. Create FastAPI backend structure
2. Setup Supabase PostgreSQL database
3. Integrate Kotak Neo API for market data
4. Build core API endpoints
5. Connect frontend to backend
6. Implement real-time WebSocket updates

### Timeline: 7 Days
- Days 1-2: Backend structure & database
- Days 3-4: Kotak Neo integration
- Days 5-6: API endpoints & frontend connection
- Day 7: Testing & bug fixes

---

## 🏗️ Backend Architecture

```
neora_backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # Configuration & env vars
│   ├── database.py                # Database connection
│   ├── dependencies.py            # Common dependencies
│   │
│   ├── auth/                      # Authentication module
│   │   ├── __init__.py
│   │   ├── router.py             # Auth endpoints
│   │   ├── models.py             # Auth models
│   │   ├── schemas.py            # Pydantic schemas
│   │   ├── service.py            # Business logic
│   │   └── utils.py              # JWT, password hashing
│   │
│   ├── market/                    # Market data module
│   │   ├── __init__.py
│   │   ├── router.py             # Market endpoints
│   │   ├── models.py             # Market models
│   │   ├── schemas.py            # Pydantic schemas
│   │   ├── service.py            # Business logic
│   │   └── kotak_client.py       # Kotak Neo API wrapper
│   │
│   ├── portfolio/                 # Portfolio module
│   │   ├── __init__.py
│   │   ├── router.py             # Portfolio endpoints
│   │   ├── models.py             # Portfolio models
│   │   ├── schemas.py            # Pydantic schemas
│   │   └── service.py            # Business logic
│   │
│   ├── watchlist/                 # Watchlist module
│   │   ├── __init__.py
│   │   ├── router.py             # Watchlist endpoints
│   │   ├── models.py             # Watchlist models
│   │   ├── schemas.py            # Pydantic schemas
│   │   └── service.py            # Business logic
│   │
│   ├── news/                      # News aggregation module
│   │   ├── __init__.py
│   │   ├── router.py             # News endpoints
│   │   ├── models.py             # News models
│   │   ├── schemas.py            # Pydantic schemas
│   │   ├── service.py            # Business logic
│   │   └── scrapers.py           # Web scraping
│   │
│   ├── admin/                     # Admin module
│   │   ├── __init__.py
│   │   ├── router.py             # Admin endpoints
│   │   ├── models.py             # Admin models
│   │   ├── schemas.py            # Pydantic schemas
│   │   └── service.py            # Business logic
│   │
│   ├── websocket/                 # WebSocket module
│   │   ├── __init__.py
│   │   ├── manager.py            # Connection manager
│   │   └── handlers.py           # WebSocket handlers
│   │
│   ├── core/                      # Core utilities
│   │   ├── __init__.py
│   │   ├── security.py           # Security utilities
│   │   ├── cache.py              # Redis caching
│   │   └── exceptions.py         # Custom exceptions
│   │
│   └── utils/                     # Helper functions
│       ├── __init__.py
│       ├── logger.py             # Logging setup
│       └── helpers.py            # Common helpers
│
├── alembic/                       # Database migrations
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
│
├── tests/                         # Test suite
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_market.py
│   └── test_portfolio.py
│
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore
└── README.md                      # Backend docs
```

---

## 📦 Dependencies

### requirements.txt
```txt
# FastAPI Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.23
alembic==1.12.1
asyncpg==0.29.0
psycopg2-binary==2.9.9

# Supabase
supabase==2.0.3

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0

# API Clients
httpx==0.25.1
requests==2.31.0
aiohttp==3.9.0

# WebSocket
websockets==12.0

# Data Processing
pandas==2.1.3
numpy==1.26.2

# Caching (Optional)
redis==5.0.1
hiredis==2.2.3

# Web Scraping
beautifulsoup4==4.12.2
selenium==4.15.2
lxml==4.9.3

# Utilities
pydantic==2.5.0
pydantic-settings==2.1.0
python-dateutil==2.8.2

# Development
pytest==7.4.3
pytest-asyncio==0.21.1
black==23.11.0
flake8==6.1.0
mypy==1.7.1
```

---

## 🗄️ Database Schema

### Tables to Create in Supabase

#### 1. users (extends Supabase auth.users)
```sql
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'admin'
    
    -- Trading preferences
    kotak_access_token TEXT,
    kotak_user_id VARCHAR(100),
    default_exchange VARCHAR(10) DEFAULT 'NSE',
    
    -- Settings
    theme VARCHAR(20) DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT true,
    email_alerts BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Index for faster queries
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
```

#### 2. portfolios
```sql
CREATE TABLE public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT 'My Portfolio',
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    total_invested DECIMAL(15, 2) DEFAULT 0.00,
    current_value DECIMAL(15, 2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_portfolios_user ON public.portfolios(user_id);
```

#### 3. holdings
```sql
CREATE TABLE public.holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Stock details
    symbol VARCHAR(50) NOT NULL,
    exchange VARCHAR(10) NOT NULL, -- NSE, BSE
    company_name VARCHAR(255),
    isin VARCHAR(20),
    
    -- Position
    quantity INTEGER NOT NULL,
    avg_price DECIMAL(15, 4) NOT NULL,
    current_price DECIMAL(15, 4),
    
    -- Calculated fields
    invested_value DECIMAL(15, 2),
    current_value DECIMAL(15, 2),
    pnl DECIMAL(15, 2),
    pnl_percentage DECIMAL(8, 4),
    
    -- Dates
    purchase_date DATE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_holdings_portfolio ON public.holdings(portfolio_id);
CREATE INDEX idx_holdings_user ON public.holdings(user_id);
CREATE INDEX idx_holdings_symbol ON public.holdings(symbol);
```

#### 4. transactions
```sql
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    
    -- Transaction details
    symbol VARCHAR(50) NOT NULL,
    exchange VARCHAR(10) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL, -- 'BUY', 'SELL'
    quantity INTEGER NOT NULL,
    price DECIMAL(15, 4) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    
    -- Charges
    brokerage DECIMAL(10, 2) DEFAULT 0.00,
    stt DECIMAL(10, 2) DEFAULT 0.00,
    transaction_charges DECIMAL(10, 2) DEFAULT 0.00,
    gst DECIMAL(10, 2) DEFAULT 0.00,
    total_charges DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Metadata
    order_id VARCHAR(100),
    notes TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_portfolio ON public.transactions(portfolio_id);
CREATE INDEX idx_transactions_symbol ON public.transactions(symbol);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
```

#### 5. watchlists
```sql
CREATE TABLE public.watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT '#059669',
    is_default BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_watchlists_user ON public.watchlists(user_id);
```

#### 6. watchlist_items
```sql
CREATE TABLE public.watchlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    watchlist_id UUID NOT NULL REFERENCES public.watchlists(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Stock details
    symbol VARCHAR(50) NOT NULL,
    exchange VARCHAR(10) NOT NULL,
    company_name VARCHAR(255),
    
    -- Alert settings
    price_alert_enabled BOOLEAN DEFAULT false,
    alert_price DECIMAL(15, 4),
    alert_type VARCHAR(20), -- 'ABOVE', 'BELOW'
    
    -- Position
    sort_order INTEGER DEFAULT 0,
    notes TEXT,
    
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_watchlist_items_watchlist ON public.watchlist_items(watchlist_id);
CREATE INDEX idx_watchlist_items_user ON public.watchlist_items(user_id);
CREATE INDEX idx_watchlist_items_symbol ON public.watchlist_items(symbol);
```

#### 7. market_data_cache
```sql
CREATE TABLE public.market_data_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) NOT NULL,
    exchange VARCHAR(10) NOT NULL,
    
    -- Price data
    ltp DECIMAL(15, 4),
    open DECIMAL(15, 4),
    high DECIMAL(15, 4),
    low DECIMAL(15, 4),
    close DECIMAL(15, 4),
    prev_close DECIMAL(15, 4),
    
    -- Volume & value
    volume BIGINT,
    value DECIMAL(20, 2),
    
    -- Change
    change DECIMAL(15, 4),
    change_percent DECIMAL(8, 4),
    
    -- Timestamps
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(symbol, exchange)
);

CREATE INDEX idx_market_cache_symbol ON public.market_data_cache(symbol);
CREATE INDEX idx_market_cache_updated ON public.market_data_cache(last_updated);
```

#### 8. news_articles
```sql
CREATE TABLE public.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Article details
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    url TEXT UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
    author VARCHAR(255),
    
    -- Metadata
    published_at TIMESTAMP WITH TIME ZONE,
    image_url TEXT,
    category VARCHAR(50),
    
    -- Related stocks
    related_symbols TEXT[], -- Array of stock symbols
    
    -- Sentiment
    sentiment VARCHAR(20), -- 'positive', 'negative', 'neutral'
    sentiment_score DECIMAL(5, 4),
    
    -- Timestamps
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_news_published ON public.news_articles(published_at DESC);
CREATE INDEX idx_news_source ON public.news_articles(source);
CREATE INDEX idx_news_category ON public.news_articles(category);
```

#### 9. ipos
```sql
CREATE TABLE public.ipos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Company details
    company_name VARCHAR(255) NOT NULL,
    issue_size DECIMAL(15, 2),
    price_range_min DECIMAL(10, 2),
    price_range_max DECIMAL(10, 2),
    lot_size INTEGER,
    
    -- Dates
    issue_open_date DATE,
    issue_close_date DATE,
    listing_date DATE,
    
    -- Status
    status VARCHAR(20), -- 'upcoming', 'open', 'closed', 'listed'
    subscription_times DECIMAL(8, 4),
    
    -- Grey market
    gmp DECIMAL(10, 2),
    gmp_updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    category VARCHAR(50),
    exchange VARCHAR(10),
    description TEXT,
    url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ipos_status ON public.ipos(status);
CREATE INDEX idx_ipos_open_date ON public.ipos(issue_open_date);
```

#### 10. activity_logs
```sql
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Activity details
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    description TEXT,
    
    -- Request details
    ip_address VARCHAR(45),
    user_agent TEXT,
    method VARCHAR(10),
    endpoint VARCHAR(255),
    
    -- Status
    status_code INTEGER,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON public.activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
```python
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login user
POST   /api/auth/logout           # Logout user
POST   /api/auth/refresh          # Refresh access token
POST   /api/auth/forgot-password  # Request password reset
POST   /api/auth/reset-password   # Reset password
GET    /api/auth/me               # Get current user
PUT    /api/auth/me               # Update user profile
```

### Market Data (`/api/market`)
```python
GET    /api/market/indices        # Get market indices
GET    /api/market/quote/:symbol  # Get stock quote
GET    /api/market/quotes         # Get multiple quotes (bulk)
GET    /api/market/search         # Search stocks
GET    /api/market/top-gainers    # Get top gainers
GET    /api/market/top-losers     # Get top losers
GET    /api/market/most-active    # Get most active stocks
GET    /api/market/historical/:symbol  # Historical data
```

### Portfolio (`/api/portfolio`)
```python
GET    /api/portfolio             # Get user portfolios
POST   /api/portfolio             # Create portfolio
GET    /api/portfolio/:id         # Get portfolio details
PUT    /api/portfolio/:id         # Update portfolio
DELETE /api/portfolio/:id         # Delete portfolio
GET    /api/portfolio/:id/holdings  # Get holdings
POST   /api/portfolio/:id/holdings  # Add holding
PUT    /api/portfolio/:id/holdings/:holdingId  # Update holding
DELETE /api/portfolio/:id/holdings/:holdingId  # Delete holding
GET    /api/portfolio/:id/transactions  # Get transactions
POST   /api/portfolio/:id/transactions  # Add transaction
GET    /api/portfolio/:id/performance   # Get performance metrics
```

### Watchlist (`/api/watchlist`)
```python
GET    /api/watchlist             # Get user watchlists
POST   /api/watchlist             # Create watchlist
GET    /api/watchlist/:id         # Get watchlist details
PUT    /api/watchlist/:id         # Update watchlist
DELETE /api/watchlist/:id         # Delete watchlist
POST   /api/watchlist/:id/items   # Add stock to watchlist
DELETE /api/watchlist/:id/items/:itemId  # Remove stock
PUT    /api/watchlist/:id/items/reorder  # Reorder items
```

### News (`/api/news`)
```python
GET    /api/news                  # Get latest news
GET    /api/news/:id              # Get news article
GET    /api/news/stock/:symbol    # Get news for specific stock
GET    /api/news/trending         # Get trending news
```

### IPOs (`/api/ipos`)
```python
GET    /api/ipos                  # Get all IPOs
GET    /api/ipos/upcoming         # Get upcoming IPOs
GET    /api/ipos/live             # Get live IPOs
GET    /api/ipos/:id              # Get IPO details
```

### Admin (`/api/admin`)
```python
GET    /api/admin/users           # Get all users
GET    /api/admin/users/:id       # Get user details
PUT    /api/admin/users/:id       # Update user
DELETE /api/admin/users/:id       # Delete user
GET    /api/admin/activity        # Get activity logs
GET    /api/admin/stats           # Get system statistics
```

### WebSocket (`/ws`)
```python
WS     /ws/market                 # Market data stream
WS     /ws/portfolio              # Portfolio updates stream
```

---

## 🔑 Kotak Neo API Integration

### Setup
1. Register at https://neoapi.kotaksecurities.com/
2. Get API credentials (Consumer Key, Consumer Secret)
3. Implement OAuth 2.0 authentication flow

### Key Endpoints to Use
```python
# Authentication
POST /token  # Get access token

# Market Data
GET /quote  # Get stock quote
GET /quotes  # Get multiple quotes
GET /search  # Search stocks
GET /marketdepth  # Get market depth
GET /historical  # Get historical data

# Orders (Future)
POST /order/place  # Place order
GET /order/list  # Get orders
DELETE /order/cancel  # Cancel order
```

### Implementation Example
```python
# app/market/kotak_client.py
import httpx
from typing import Optional, List, Dict
from datetime import datetime

class KotakNeoClient:
    def __init__(self, consumer_key: str, consumer_secret: str):
        self.base_url = "https://gw-napi.kotaksecurities.com"
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.access_token: Optional[str] = None
        self.client = httpx.AsyncClient()
    
    async def authenticate(self) -> bool:
        """Get access token"""
        # Implement OAuth flow
        pass
    
    async def get_quote(self, symbol: str, exchange: str = "NSE") -> Dict:
        """Get stock quote"""
        # Implementation
        pass
    
    async def get_quotes(self, symbols: List[str]) -> List[Dict]:
        """Get multiple quotes"""
        # Implementation
        pass
    
    async def search_stocks(self, query: str) -> List[Dict]:
        """Search stocks"""
        # Implementation
        pass
```

---

## 🧪 Testing Strategy

### Unit Tests
```python
# tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "SecurePass123!",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 201
    assert "id" in response.json()
```

### Integration Tests
- Test database operations
- Test Kotak API integration
- Test WebSocket connections
- Test caching layer

---

## 🚀 Deployment Checklist

### Environment Variables
```bash
# .env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
KOTAK_CONSUMER_KEY=your_kotak_key
KOTAK_CONSUMER_SECRET=your_kotak_secret
REDIS_URL=redis://localhost:6379
```

### Render Configuration
```yaml
# render.yaml
services:
  - type: web
    name: neora-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: SUPABASE_URL
        sync: false
```

---

## 📊 Success Metrics

Week 2 will be successful when:
- [ ] Backend runs locally without errors
- [ ] All database tables created
- [ ] Kotak Neo API authentication working
- [ ] At least 80% of API endpoints implemented
- [ ] Frontend can fetch data from backend
- [ ] WebSocket connection established
- [ ] Basic admin panel functional

---

**Next Steps After Week 2**: Frontend-backend integration, real-time features, and advanced portfolio tracking (Week 3)