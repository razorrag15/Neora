# NEORA Intelligence - MVP Implementation Guide

**Quick Start Guide for Developers**

---

## MVP Scope Summary

### What We're Building (4 Weeks)

✅ **Week 1:** Authentication + Project Setup  
✅ **Week 2:** Kotak Neo Integration + Market Data  
✅ **Week 3:** Portfolio + Watchlist Features  
✅ **Week 4:** Admin Dashboard + Production Deployment  

**Goal:** Functional stock market app with real data, user management, and admin controls.

---

## Quick Links

- [Complete Documentation](./NEORA_COMPLETE_DOCUMENTATION.md)
- [Database Schema](#database-setup)
- [API Endpoints](#api-structure)
- [Deployment Guide](#deployment-steps)

---

## Tech Stack - MVP

```
Frontend:  React 19 + TypeScript + Vite + Tailwind
Backend:   Python 3.11 + FastAPI
Database:  Supabase PostgreSQL
Auth:      Supabase Auth + JWT
Cache:     Redis
Data:      Kotak Neo API
Deploy:    Render (both services)
```

---

## Project Structure

```
neora/
├── frontend/                    # React App
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── public/         # Landing, Market Overview
│   │   │   ├── auth/           # Login, Signup, Reset
│   │   │   ├── dashboard/      # Main Dashboard
│   │   │   ├── portfolio/      # Portfolio Management
│   │   │   ├── watchlist/      # Watchlist Manager
│   │   │   └── admin/          # Admin Panel (HIDDEN)
│   │   ├── components/
│   │   │   ├── common/         # Button, Card, Modal
│   │   │   ├── layout/         # Header, Sidebar, Footer
│   │   │   ├── charts/         # Stock Charts
│   │   │   └── stock/          # Stock Cards, Details
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useMarketData.ts
│   │   │   └── usePortfolio.ts
│   │   ├── services/
│   │   │   ├── api.ts          # Axios setup
│   │   │   ├── auth.ts         # Auth service
│   │   │   ├── market.ts       # Market data service
│   │   │   └── supabase.ts     # Supabase client
│   │   ├── store/
│   │   │   ├── authStore.ts    # Zustand auth
│   │   │   ├── marketStore.ts  # Market data state
│   │   │   └── portfolioStore.ts
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   ├── stock.ts
│   │   │   └── portfolio.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Python FastAPI
│   ├── app/
│   │   ├── main.py             # FastAPI app
│   │   ├── config.py           # Settings
│   │   ├── database.py         # Database connection
│   │   ├── auth/
│   │   │   ├── router.py       # Auth endpoints
│   │   │   ├── models.py       # User models
│   │   │   ├── schemas.py      # Pydantic schemas
│   │   │   └── utils.py        # JWT, password hash
│   │   ├── market/
│   │   │   ├── router.py       # Market endpoints
│   │   │   ├── kotak_neo.py    # Kotak Neo client
│   │   │   └── schemas.py
│   │   ├── portfolio/
│   │   │   ├── router.py
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   ├── admin/
│   │   │   ├── router.py       # Admin endpoints
│   │   │   └── middleware.py   # Admin auth check
│   │   └── utils/
│   │       ├── cache.py        # Redis cache
│   │       └── logger.py       # Activity logging
│   ├── requirements.txt
│   ├── alembic/                # Database migrations
│   └── tests/
│
├── docs/
│   ├── NEORA_COMPLETE_DOCUMENTATION.md
│   ├── MVP_IMPLEMENTATION_GUIDE.md (this file)
│   └── API_REFERENCE.md
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
│
└── render.yaml                 # Render deployment config
```

---

## Setup Instructions

### 1. Prerequisites

```bash
# Install Node.js 19+
node --version  # v19.x.x

# Install Python 3.11+
python --version  # 3.11.x

# Install Git
git --version
```

### 2. Clone & Install

```bash
# Clone repository
git clone https://github.com/your-org/neora.git
cd neora

# Frontend setup
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your keys

# Backend setup
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your keys
```

### 3. Supabase Setup

1. Create account at https://supabase.com
2. Create new project
3. Copy Project URL and anon key
4. Run database schema:

```sql
-- Copy schema from docs/NEORA_COMPLETE_DOCUMENTATION.md
-- Section 5: Database Design
-- Paste into Supabase SQL Editor
-- Execute
```

5. Enable Supabase Auth:
   - Email provider
   - Password settings
   - Email templates

### 4. Kotak Neo Setup

1. Get API credentials from Kotak Neo
2. Add to backend `.env`:
```
KOTAK_CONSUMER_KEY=your_key
KOTAK_CONSUMER_SECRET=your_secret
```

### 5. Redis Setup (Optional for local dev)

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install locally
# Windows: https://github.com/microsoftarchive/redis/releases
# Mac: brew install redis
# Linux: sudo apt-get install redis-server
```

### 6. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Database Setup

### Run Migrations

```bash
cd backend

# Create migration
alembic revision -m "Initial schema"

# Run migrations
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

### Seed Data (Optional)

```bash
python scripts/seed_data.py
```

This creates:
- 1 admin user (admin@neora.app / Admin123!)
- 10 sample stocks
- Market indices data

---

## Environment Variables

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/neora
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...

# Security
SECRET_KEY=generate_random_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Kotak Neo
KOTAK_CONSUMER_KEY=your_key
KOTAK_CONSUMER_SECRET=your_secret

# Redis
REDIS_URL=redis://localhost:6379

# Environment
ENVIRONMENT=development
LOG_LEVEL=DEBUG
```

---

## API Structure

### Authentication Endpoints

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/verify-email/:token
GET  /api/auth/me
PUT  /api/auth/me
```

### Market Data Endpoints

```http
GET /api/market/indices
GET /api/market/top-gainers?limit=10
GET /api/market/top-losers?limit=10
GET /api/market/search?q=RELIANCE
GET /api/market/status
```

### Stock Endpoints

```http
GET /api/stocks/:symbol/quote
GET /api/stocks/:symbol/historical?interval=1d&from=2024-01-01
GET /api/stocks/:symbol/info
```

### Portfolio Endpoints

```http
GET    /api/portfolio
POST   /api/portfolio/holdings
GET    /api/portfolio/holdings
PUT    /api/portfolio/holdings/:id
DELETE /api/portfolio/holdings/:id
GET    /api/portfolio/analytics
```

### Admin Endpoints (Hidden - /admin route)

```http
GET /api/admin/users
GET /api/admin/users/:id
PUT /api/admin/users/:id/role
GET /api/admin/activities
GET /api/admin/stats
```

---

## Admin Access Setup

### Creating First Admin User

**Method 1: Database Direct**
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

**Method 2: Backend Script**
```bash
python scripts/create_admin.py --email admin@neora.app
```

### Admin Route Access

**URL:** `https://neora.app/admin` (NOT linked in UI)

**Requirements:**
1. Valid JWT token with `role='admin'`
2. Active account
3. Direct URL access only

**Security:**
- No public links to admin panel
- Role checked on every request
- All actions logged in audit_logs table
- IP-based rate limiting (stricter)

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_auth.py

# Run integration tests
pytest tests/integration/
```

### Frontend Tests

```bash
cd frontend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## Deployment Steps

### 1. Prepare for Production

```bash
# Frontend build
cd frontend
npm run build
# Test build: npm run preview

# Backend check
cd backend
python -m pytest
python -m mypy app/
```

### 2. Setup Render Account

1. Create account at https://render.com
2. Connect GitHub repository
3. Create services:
   - PostgreSQL database
   - Redis instance
   - Web service (backend)
   - Static site (frontend)

### 3. Configure Environment Variables

**Backend Web Service:**
- DATABASE_URL (from Render PostgreSQL)
- REDIS_URL (from Render Redis)
- SECRET_KEY (generate new)
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- KOTAK_CONSUMER_KEY
- KOTAK_CONSUMER_SECRET
- ENVIRONMENT=production

**Frontend Static Site:**
- VITE_API_URL=https://neora-backend-api.onrender.com
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

### 4. Deploy

```bash
# Auto-deploy on push to main branch
git push origin main

# Or manual deploy via Render dashboard
```

### 5. Verify Deployment

```bash
# Check backend health
curl https://neora-backend-api.onrender.com/health

# Check frontend
curl https://neora.onrender.com

# Test API
curl https://neora-backend-api.onrender.com/api/market/indices
```

### 6. Setup Custom Domain (Optional)

1. Purchase domain (neora.app)
2. Add to Render:
   - Frontend: neora.app, www.neora.app
   - Backend: api.neora.app
3. Update DNS records
4. Enable SSL (automatic)

---

## Common Issues & Solutions

### Issue: CORS Error

**Solution:**
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://neora.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Database Connection Failed

**Solution:**
```bash
# Check DATABASE_URL format
postgresql://user:password@host:port/database

# Verify Supabase connection
psql $DATABASE_URL
```

### Issue: Kotak Neo API Not Working

**Solution:**
1. Verify credentials
2. Check API rate limits
3. Ensure proper OTP flow
4. Check error logs

### Issue: Redis Connection Error

**Solution:**
```python
# Make Redis optional for development
try:
    redis_client = Redis.from_url(REDIS_URL)
except:
    redis_client = None
    logger.warning("Redis not available, caching disabled")
```

---

## Performance Optimization

### Frontend

```javascript
// Code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Memoization
const stockData = useMemo(() => 
  processStockData(rawData), 
  [rawData]
)

// Debounce search
const debouncedSearch = useDebounce(searchQuery, 500)
```

### Backend

```python
# Cache frequently accessed data
@router.get("/market/indices")
@cache(expire=60)  # 1 minute cache
async def get_indices():
    return await fetch_indices()

# Batch database queries
stocks = await db.query(Stock).options(
    selectinload(Stock.holdings)
).all()

# Index database columns
CREATE INDEX idx_holdings_portfolio ON holdings(portfolio_id);
```

---

## Security Checklist

- [ ] All passwords hashed with bcrypt
- [ ] JWT tokens expire in 30 minutes
- [ ] HTTPS enforced in production
- [ ] SQL injection prevention (ORM)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Rate limiting active
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Admin routes properly protected
- [ ] Audit logging enabled
- [ ] Environment variables not in code
- [ ] API keys encrypted in database

---

## Monitoring Setup

### Application Monitoring

```bash
# Install Sentry
pip install sentry-sdk[fastapi]
npm install @sentry/react

# Configure
# backend/app/main.py
import sentry_sdk
sentry_sdk.init(dsn="your-sentry-dsn")

# frontend/src/main.tsx
import * as Sentry from "@sentry/react"
Sentry.init({ dsn: "your-sentry-dsn" })
```

### Health Checks

```python
# backend/app/main.py
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": await check_db(),
        "redis": await check_redis(),
        "kotak_neo": await check_kotak_neo()
    }
```

---

## Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/portfolio-analytics

# Commit changes
git add .
git commit -m "feat: add portfolio analytics dashboard"

# Push to remote
git push origin feature/portfolio-analytics

# Create Pull Request on GitHub

# After review, merge to main
# Auto-deploy to production (CI/CD)
```

### Commit Message Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation update
style: Code formatting
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

---

## Next Steps After MVP

1. **Week 5-6:** Web scraping implementation
2. **Week 7-8:** Real-time WebSocket updates
3. **Week 9-10:** Advanced charting (TradingView)
4. **Week 11-12:** ML models for predictions
5. **Month 4+:** Premium features & monetization

See [Complete Documentation](./NEORA_COMPLETE_DOCUMENTATION.md) for full roadmap.

---

## Support Resources

- **Documentation:** `docs/NEORA_COMPLETE_DOCUMENTATION.md`
- **API Reference:** http://localhost:8000/docs (Swagger)
- **Database Schema:** See Section 5 in main docs
- **Architecture:** See Section 3 in main docs

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Frontend dev server
uvicorn app.main:app --reload  # Backend dev server

# Testing
npm run test            # Frontend tests
pytest                  # Backend tests

# Build
npm run build           # Frontend production build
python -m build         # Backend package

# Deploy
git push origin main    # Auto-deploy via CI/CD

# Database
alembic upgrade head    # Run migrations
alembic downgrade -1    # Rollback migration

# Logs
render logs backend-api # View backend logs (Render)
render logs frontend    # View frontend logs (Render)
```

---

**Document Version:** 1.0.0  
**Last Updated:** December 2024  
**For Questions:** Contact dev team or see main documentation

---

*Happy Coding! 🚀*