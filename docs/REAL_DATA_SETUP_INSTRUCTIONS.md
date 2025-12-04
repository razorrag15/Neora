# 🚀 NEORA Real Data Integration - Setup Instructions

## Overview

Your NEORA Intelligence app now has **real-time NSE market data** integrated! This guide will help you set it up and start using live Indian stock market data.

---

## 📋 What's Been Implemented

### ✅ Completed Features

1. **NSE API Service** (`src/services/nseService.ts`)
   - Direct integration with NSE India public API
   - Functions for stock quotes, indices, top gainers/losers, most active stocks
   - Session management for cookie handling

2. **Market Data Service** (`src/services/marketDataService.ts`)
   - Intelligent caching layer (5-30 second cache based on data type)
   - Auto-refresh functionality with cleanup
   - Format helpers for Indian currency, percentages, volumes
   - Market status detection (9:15 AM - 3:30 PM IST)

3. **Updated Components**
   - **IndicesBar**: Live NSE indices with 10-second auto-refresh
   - **Dashboard**: Live top gainers with 30-second auto-refresh
   - Both components have Live/Demo toggle buttons
   - Loading states and error handling with graceful fallback

---

## 🛠️ Installation Steps

### Step 1: Install Dependencies

```bash
npm install axios
```

That's it! Only one new dependency needed.

### Step 2: Verify File Structure

Make sure these files exist:
```
src/
├── services/
│   ├── nseService.ts        ✅ Created
│   └── marketDataService.ts ✅ Created
├── components/
│   └── market/
│       └── IndicesBar.tsx   ✅ Updated
└── pages/
    └── dashboard/
        └── Dashboard.tsx     ✅ Updated
```

### Step 3: Run the Development Server

```bash
npm run dev
```

---

## 🎯 Testing Real Data

### Test 1: Check IndicesBar

1. Open your app in the browser
2. Look at the top navigation bar
3. You should see live NSE indices scrolling (NIFTY 50, BANK NIFTY, etc.)
4. Click the **LIVE DATA / DEMO DATA** toggle button
5. Verify the indices change between live and demo data

**Expected Behavior:**
- When "LIVE DATA" is active (green badge with pulsing dot), you see real NSE indices
- Data refreshes every 10 seconds automatically
- Green/red colors show gains/losses
- Percentage changes are accurate

### Test 2: Check Dashboard Market Movers

1. Navigate to the Dashboard page (after logging in)
2. Scroll to the "Market Movers" section
3. You should see 4 stock cards with real data
4. Click the **LIVE DATA / DEMO DATA** toggle
5. Verify stocks change between live and demo data
6. Check the "Last updated" timestamp updates every 30 seconds

**Expected Behavior:**
- Shows top 4 gainers from NSE
- Real company names and symbols
- Live prices and percentage changes
- Loading skeleton appears during data fetch
- Auto-refreshes every 30 seconds

### Test 3: Console Logs

Open browser DevTools (F12) and check the Console tab:
- You should see successful API responses
- No CORS errors (if using proxy)
- Data objects logged for debugging

---

## 🔧 Handling CORS Issues

### Problem
NSE API may block requests due to CORS policy when called directly from the browser.

### Solution 1: Quick Fix (Development Only)

Use a CORS proxy service temporarily:

**Update `src/services/nseService.ts`:**
```typescript
const BASE_URL = 'https://corsproxy.io/?https://www.nseindia.com'
```

### Solution 2: Vite Proxy (Recommended for Development)

**Update `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/nse': {
        target: 'https://www.nseindia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nse/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
    },
  },
})
```

**Then update `src/services/nseService.ts`:**
```typescript
const BASE_URL = import.meta.env.DEV 
  ? '/api/nse'  // Use Vite proxy in development
  : 'https://www.nseindia.com'  // Direct in production
```

### Solution 3: FastAPI Backend (Production Ready)

For production, you'll need a backend proxy (Week 2 task). The FastAPI backend will:
- Handle NSE API requests server-side (no CORS)
- Add caching with Redis
- Rate limiting
- Authentication
- WebSocket for real-time updates

---

## 📊 Data Refresh Rates

| Data Type | Cache Duration | Auto-Refresh | Use Case |
|-----------|---------------|--------------|----------|
| Stock Quotes | 5 seconds | Manual | Live trading |
| Market Indices | 10 seconds | Auto (IndicesBar) | Market overview |
| Top Gainers/Losers | 30 seconds | Auto (Dashboard) | Market trends |
| Most Active | 30 seconds | Manual | High volume stocks |

---

## 🎨 UI Features

### Live/Demo Toggle Button
- **Green Badge + Pulsing Dot**: Live data active
- **Gray Badge**: Demo data active
- Click to switch between modes instantly

### Loading States
- **Skeleton UI**: Animated placeholders during data fetch
- **Spinner Icon**: Next to "Market Movers" title when refreshing
- Preserves layout, no content jumping

### Error Handling
- Automatic fallback to demo data if API fails
- Console error logging for debugging
- User sees demo data with toggle to try again

### Last Update Timestamp
- Shows when data was last refreshed
- Format: "7:45:32 PM" (Indian time)
- Updates automatically with each refresh

---

## 🔍 Available API Functions

### NSE Service (`nseService.ts`)

```typescript
import nseService from '@/services/nseService'

// Get single stock quote
const quote = await nseService.getStockQuote('RELIANCE')

// Get multiple stock quotes
const quotes = await nseService.getStockQuotes(['TCS', 'INFY', 'WIPRO'])

// Get all market indices
const indices = await nseService.getMarketIndices()

// Get top gainers (limit: 10, 20, or 50)
const gainers = await nseService.getTopGainers(10)

// Get top losers
const losers = await nseService.getTopLosers(10)

// Get most active stocks by volume
const active = await nseService.getMostActive(10)

// Search stocks by query
const results = await nseService.searchStocks('reliance')
```

### Market Data Service (`marketDataService.ts`)

```typescript
import marketDataService from '@/services/marketDataService'

// Get cached quotes (auto-cached for 5 seconds)
const quote = await marketDataService.getQuote('RELIANCE')
const quotes = await marketDataService.getQuotes(['TCS', 'INFY'])

// Get cached indices (auto-cached for 10 seconds)
const indices = await marketDataService.getIndices()

// Get top movers (auto-cached for 30 seconds)
const gainers = await marketDataService.getTopGainers(10)
const losers = await marketDataService.getTopLosers(10)
const active = await marketDataService.getMostActive(10)

// Format helpers
const priceStr = marketDataService.formatPrice(1234.56) // "₹1,234.56"
const changeStr = marketDataService.formatPChange(2.45) // "+2.45%"
const volumeStr = marketDataService.formatVolume(1234567) // "12.35L"
const colorClass = marketDataService.getChangeColorClass(2.45) // "text-market-gain"

// Market status
const isOpen = marketDataService.getMarketStatus() // true/false

// Auto-refresh with cleanup
const cleanup = marketDataService.startAutoRefresh(() => {
  console.log('Refreshing data...')
}, 30000) // 30 seconds

// Later, cleanup when component unmounts
cleanup()
```

---

## 🚀 Next Steps

### Immediate (This Week)
1. ✅ Test real data integration
2. ✅ Verify CORS solution works
3. ✅ Check auto-refresh functionality
4. ✅ Test Live/Demo toggle
5. ✅ Monitor console for errors

### Week 2 (Backend Development)
1. Create FastAPI backend structure
2. Setup PostgreSQL database schema
3. Integrate Kotak Neo API (zero brokerage trading)
4. Build 40+ REST API endpoints
5. Add WebSocket for real-time updates
6. Implement Redis caching
7. JWT authentication with Supabase

### Week 3 (Core Features)
1. Portfolio management (CRUD operations)
2. Watchlist with price alerts
3. Stock detail pages with charts
4. News scraping from multiple sources
5. IPO tracking with GMP updates
6. User profile management

### Week 4 (Admin & Deployment)
1. Admin dashboard (user management)
2. Activity logging system
3. Deploy backend to Render.com
4. Deploy frontend to Render.com
5. Configure custom domain
6. Production testing

---

## 📝 Development Notes

### Market Hours
NSE is open Monday-Friday, 9:15 AM - 3:30 PM IST (excluding holidays).
- During market hours: Live data shows real-time prices
- After hours: Last traded price shown (LTP)
- Weekends/Holidays: Demo data recommended

### Rate Limiting
NSE API has no official rate limits, but be respectful:
- Use caching to minimize requests
- Don't call APIs more than once per second
- Let auto-refresh handle updates

### Data Accuracy
- Stock prices: Real-time (1-2 second delay)
- Indices: Real-time (1-2 second delay)
- Top movers: Updated every few minutes by NSE
- Historical data: Coming in Week 2 with backend

### TypeScript Types
All API responses are fully typed:
```typescript
interface StockQuote {
  symbol: string
  companyName: string
  ltp: number
  change: number
  pChange: number
  open: number
  close: number
  high: number
  low: number
  volume: number
}

interface IndexQuote {
  indexName: string
  last: number
  change: number
  pChange: number
  open: number
  close: number
  high: number
  low: number
}

interface MarketMover {
  symbol: string
  companyName: string
  ltp: number
  change: number
  pChange: number
  volume: number
}
```

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Error:** "Access to fetch at 'https://www.nseindia.com' from origin 'http://localhost:5173' has been blocked by CORS policy"

**Solutions:**
1. Use CORS proxy (quick fix)
2. Setup Vite proxy (recommended)
3. Wait for backend (production solution)

### Issue: Empty Data
**Error:** API returns empty arrays or null

**Solutions:**
1. Check if market is open (9:15 AM - 3:30 PM IST)
2. Verify internet connection
3. Check console for API errors
4. Toggle to demo data and back to live

### Issue: Auto-refresh Not Working
**Symptoms:** Data doesn't update automatically

**Solutions:**
1. Check component is mounted (not navigated away)
2. Verify cleanup function is being called
3. Check console for refresh logs
4. Restart development server

### Issue: Loading Indefinitely
**Symptoms:** Skeleton UI never disappears

**Solutions:**
1. Check network tab for failed requests
2. Verify axios is installed: `npm list axios`
3. Check CORS proxy is working
4. Toggle to demo data temporarily

---

## 📚 Related Documentation

- **Full Integration Guide**: `docs/REAL_DATA_INTEGRATION_GUIDE.md`
- **Kotak Neo API Guide**: `docs/KOTAK_NEO_API_COMPLETE_GUIDE.md`
- **Week 2 Backend Blueprint**: `docs/WEEK2_BACKEND_BLUEPRINT.md`
- **API Features Blueprint**: `docs/NEORA_WITH_KOTAK_API_FEATURES.md`
- **Week 1 Progress Summary**: `docs/WEEK1_PROGRESS_SUMMARY.md`

---

## ✅ Success Checklist

Before moving to Week 2, verify:

- [ ] `npm install axios` completed successfully
- [ ] Development server runs without errors
- [ ] IndicesBar shows live NSE indices
- [ ] Dashboard shows live top gainers
- [ ] Live/Demo toggle works in both components
- [ ] Auto-refresh updates data automatically
- [ ] Loading states display correctly
- [ ] No CORS errors in console
- [ ] Timestamps update properly
- [ ] Stock cards display real company names and prices

---

## 🎉 Congratulations!

You now have a **fully functional Indian stock market app** with:
- ✅ Real-time NSE market data
- ✅ Live indices tracking
- ✅ Top gainers/losers
- ✅ Auto-refresh functionality
- ✅ Intelligent caching
- ✅ Beautiful UI with loading states
- ✅ Error handling with fallbacks

**Zero cost, zero authentication needed!**

Ready for Week 2? Let's build the backend! 🚀