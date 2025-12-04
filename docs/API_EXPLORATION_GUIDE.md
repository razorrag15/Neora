# 🔍 NSE API Exploration Guide

## Overview

Before implementing all features, we need to thoroughly understand NSE's API structure, response formats, and available data. This guide helps you explore and document all NSE API endpoints systematically.

---

## 🎯 Why Explore First?

1. **Understand Data Structure**: Know exactly what fields are available
2. **Avoid Assumptions**: Real API responses may differ from documentation
3. **Plan Better**: Design TypeScript interfaces based on actual responses
4. **Error Handling**: Discover edge cases and error responses
5. **Rate Limits**: Test response times and identify throttling
6. **Data Quality**: Verify data accuracy and completeness

---

## 🛠️ Setup

### Step 1: Install Required Dependencies

```bash
# Install TypeScript execution tool
npm install -D tsx

# Install axios (if not already installed)
npm install axios

# Install types
npm install -D @types/node
```

### Step 2: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "explore-api": "tsx scripts/explore-nse-api.ts",
    "explore-api:cors": "node -r dotenv/config scripts/explore-with-proxy.js"
  }
}
```

---

## 🚀 Running the Explorer

### Method 1: Direct Execution (Recommended)

```bash
npm run explore-api
```

This will:
- Test 20+ NSE API endpoints
- Save all responses to `api-exploration-results/` folder
- Generate a detailed markdown report
- Display colored terminal output with progress

### Method 2: With CORS Proxy (If Direct Fails)

If you encounter CORS errors, use a proxy:

```bash
# Update the script to use CORS proxy
# Then run:
npm run explore-api
```

---

## 📊 What Gets Explored

### Market Data Endpoints

1. **Market Status**
   - Endpoint: `/api/marketStatus`
   - Data: Pre-open, open, closed status
   - Use Case: Determine trading hours

2. **All Indices**
   - Endpoint: `/api/allIndices`
   - Data: NIFTY 50, BANK NIFTY, NIFTY IT, etc.
   - Use Case: Display all indices in IndicesBar

3. **Index Details - NIFTY 50**
   - Endpoint: `/api/equity-stockIndices?index=NIFTY%2050`
   - Data: Detailed index data with constituents
   - Use Case: Show individual index pages

4. **Index Details - BANK NIFTY**
   - Endpoint: `/api/equity-stockIndices?index=NIFTY%20BANK`
   - Data: Bank NIFTY constituents and stats
   - Use Case: Sector-specific analysis

### Stock Data Endpoints

5. **Stock Quote - Reliance**
   - Endpoint: `/api/quote-equity?symbol=RELIANCE`
   - Data: Full stock quote with detailed metrics
   - Use Case: Stock detail pages

6. **Stock Quote - TCS**
   - Endpoint: `/api/quote-equity?symbol=TCS`
   - Data: Another example for validation
   - Use Case: Verify consistency across stocks

7. **Top Gainers**
   - Endpoint: `/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O`
   - Data: Stocks with highest percentage gains
   - Use Case: Market Movers section

### Pre-Market & Trading Data

8. **Pre-Open Market**
   - Endpoint: `/api/market-data-pre-open?key=ALL`
   - Data: Pre-market orders and prices
   - Use Case: Pre-market analysis feature

9. **FNO Stocks**
   - Endpoint: `/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O`
   - Data: All F&O segment stocks
   - Use Case: Filter stocks available for derivatives

10. **Market Turnover**
    - Endpoint: `/api/market-turnover`
    - Data: Daily trading volume and value
    - Use Case: Market activity dashboard

### Corporate & Calendar Data

11. **Holiday Calendar**
    - Endpoint: `/api/holiday-master?type=trading`
    - Data: Trading holidays for current year
    - Use Case: Display market closed days

12. **Circulars**
    - Endpoint: `/api/circulars`
    - Data: NSE announcements and circulars
    - Use Case: News feed integration

13. **Corporate Actions**
    - Endpoint: `/api/corporates-corporateActions?index=equities`
    - Data: Dividends, splits, bonuses
    - Use Case: Corporate actions tracker

14. **IPO List**
    - Endpoint: `/api/ipo-detail`
    - Data: Current and upcoming IPOs
    - Use Case: IPO Radar widget

### Trading Activity

15. **Block Deals**
    - Endpoint: `/api/block-deal`
    - Data: Large block transactions
    - Use Case: Institutional activity tracker

16. **Bulk Deals**
    - Endpoint: `/api/equity-bulk`
    - Data: Bulk deal transactions
    - Use Case: Trading activity analysis

### Search & Discovery

17. **Stock Search**
    - Endpoint: `/api/search/autocomplete?q=reli`
    - Data: Search results with symbol, name
    - Use Case: Search bar autocomplete

18. **NIFTY 50 Constituents**
    - Endpoint: `/api/equity-stockIndices?index=NIFTY%2050`
    - Data: All 50 stocks in index
    - Use Case: Index constituent pages

### Charts & Technical Data

19. **Advance Decline Ratio**
    - Endpoint: `/api/chart-databyindex?index=NIFTY%2050&indices=true`
    - Data: Market breadth indicators
    - Use Case: Technical analysis features

---

## 📁 Output Files

After running the explorer, you'll find:

```
api-exploration-results/
├── SUMMARY.json                    # Quick summary of all tests
├── EXPLORATION_REPORT.md           # Detailed markdown report
├── market-status.json              # Individual endpoint responses
├── all-indices.json
├── nifty-50-quote.json
├── bank-nifty-quote.json
├── stock-quote-reliance.json
├── stock-quote-tcs.json
├── top-gainers.json
├── live-market.json
├── pre-open-market.json
├── fno-stocks.json
├── holidays.json
├── circulars.json
├── corporate-actions.json
├── ipo-list.json
├── block-deals.json
├── bulk-deals.json
├── market-turnover.json
├── search.json
├── nifty-50-stocks.json
└── advance-decline.json
```

---

## 🔍 Analyzing Results

### Step 1: Check Summary

Open `SUMMARY.json`:
```json
{
  "totalEndpoints": 20,
  "successful": 18,
  "failed": 2,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "endpoints": { ... }
}
```

### Step 2: Read Exploration Report

Open `EXPLORATION_REPORT.md` for:
- Endpoint success/failure status
- Response size and structure
- Sample data for each endpoint
- Error messages if any

### Step 3: Examine Individual Responses

Open individual JSON files to see:
- Exact field names and data types
- Nested object structures
- Array lengths and formats
- Available metadata

---

## 🎨 Understanding Response Structures

### Example: Stock Quote Response

```json
{
  "info": {
    "symbol": "RELIANCE",
    "companyName": "Reliance Industries Limited",
    "industry": "REFINERIES",
    "activeSeries": ["EQ"],
    "isin": "INE002A01018"
  },
  "priceInfo": {
    "lastPrice": 2450.50,
    "change": 23.75,
    "pChange": 0.98,
    "previousClose": 2426.75,
    "open": 2430.00,
    "close": 2450.50,
    "vwap": 2442.30,
    "lowerCP": 2184.10,
    "upperCP": 2669.40,
    "pPriceBand": "No Band",
    "basePrice": 2426.75
  },
  "industryInfo": {
    "macro": "Energy",
    "sector": "Oil Gas & Consumable Fuels",
    "industry": "Refineries & Marketing",
    "basicIndustry": "Refineries"
  },
  "preOpenMarket": { ... },
  "metadata": { ... }
}
```

### Example: Index Quote Response

```json
{
  "name": "NIFTY 50",
  "advance": { "declines": 15, "advances": 35, "unchanged": 0 },
  "timestamp": "15-Jan-2024 15:30:00",
  "data": [
    {
      "priority": 1,
      "symbol": "RELIANCE",
      "identifier": "RELIANCEEQN",
      "series": "EQ",
      "open": 2430.00,
      "dayHigh": 2465.00,
      "dayLow": 2425.00,
      "lastPrice": 2450.50,
      "previousClose": 2426.75,
      "change": 23.75,
      "pChange": 0.98,
      "totalTradedVolume": 5234567,
      "totalTradedValue": 1278945632.50,
      "lastUpdateTime": "15-Jan-2024 15:30:00",
      "yearHigh": 2750.00,
      "ffmc": 678945.32,
      "yearLow": 2100.00,
      "nearWKH": 2750.00,
      "nearWKL": 2385.00,
      "perChange365d": 12.45,
      "date365dAgo": 2180.25,
      "chart365dPath": "/content/indices/ind_nifty50graph.csv",
      "date30dAgo": 2350.75,
      "perChange30d": 4.24
    }
  ],
  "metadata": {
    "indexName": "NIFTY 50",
    "open": 21450.30,
    "high": 21580.25,
    "low": 21420.50,
    "previousClose": 21385.80,
    "last": 21525.40,
    "percChange": 0.65,
    "change": 139.60,
    "timeVal": "15-Jan-2024 15:30:00",
    "yearHigh": 22150.00,
    "yearLow": 19200.00,
    "totalTradedVolume": 234567890,
    "totalTradedValue": 45678901234.50,
    "ffmc_sum": 123456789.32
  }
}
```

---

## 🛠️ Using Exploration Results

### Step 1: Create TypeScript Interfaces

Based on actual responses, create precise types:

```typescript
// src/types/nse.ts

export interface StockQuoteResponse {
  info: {
    symbol: string
    companyName: string
    industry: string
    activeSeries: string[]
    isin: string
  }
  priceInfo: {
    lastPrice: number
    change: number
    pChange: number
    previousClose: number
    open: number
    close: number
    vwap: number
    lowerCP: number
    upperCP: number
    pPriceBand: string
    basePrice: number
  }
  industryInfo: {
    macro: string
    sector: string
    industry: string
    basicIndustry: string
  }
  preOpenMarket: any
  metadata: any
}

export interface IndexQuoteResponse {
  name: string
  advance: {
    declines: number
    advances: number
    unchanged: number
  }
  timestamp: string
  data: IndexConstituent[]
  metadata: IndexMetadata
}

export interface IndexConstituent {
  priority: number
  symbol: string
  identifier: string
  series: string
  open: number
  dayHigh: number
  dayLow: number
  lastPrice: number
  previousClose: number
  change: number
  pChange: number
  totalTradedVolume: number
  totalTradedValue: number
  lastUpdateTime: string
  yearHigh: number
  yearLow: number
  nearWKH: number
  nearWKL: number
  perChange365d: number
  date365dAgo: number
  date30dAgo: number
  perChange30d: number
}

export interface IndexMetadata {
  indexName: string
  open: number
  high: number
  low: number
  previousClose: number
  last: number
  percChange: number
  change: number
  timeVal: string
  yearHigh: number
  yearLow: number
  totalTradedVolume: number
  totalTradedValue: number
}
```

### Step 2: Update Service Functions

Modify `nseService.ts` to match actual response structures:

```typescript
async getStockQuote(symbol: string): Promise<StockQuoteResponse> {
  const response = await this.client.get(`/api/quote-equity?symbol=${symbol}`)
  return response.data
}

async getIndexData(indexName: string): Promise<IndexQuoteResponse> {
  const encodedName = encodeURIComponent(indexName)
  const response = await this.client.get(`/api/equity-stockIndices?index=${encodedName}`)
  return response.data
}
```

### Step 3: Extract Relevant Fields

Create mapper functions to extract only what you need:

```typescript
function mapStockQuote(response: StockQuoteResponse): StockQuote {
  return {
    symbol: response.info.symbol,
    companyName: response.info.companyName,
    ltp: response.priceInfo.lastPrice,
    change: response.priceInfo.change,
    pChange: response.priceInfo.pChange,
    open: response.priceInfo.open,
    close: response.priceInfo.close,
    high: response.priceInfo.dayHigh,
    low: response.priceInfo.dayLow,
    volume: 0, // Need to find this field
    industry: response.info.industry,
    sector: response.industryInfo.sector,
  }
}
```

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solutions:**
1. Use the proxy method in explorer script
2. Add CORS proxy URL: `https://corsproxy.io/?https://www.nseindia.com`
3. Setup Vite development proxy
4. Wait for backend implementation

### Issue 2: Session Required

**Error:** `401 Unauthorized` or empty responses

**Solution:**
The explorer initializes session by calling homepage first. If issues persist:
```typescript
// Add this before API calls
await this.client.get('/')
await this.delay(2000) // Wait for cookies
```

### Issue 3: Rate Limiting

**Error:** `429 Too Many Requests`

**Solution:**
- Add delays between requests (already implemented with 1-2 second gaps)
- Cache responses aggressively
- Don't call same endpoint repeatedly

### Issue 4: Unexpected Response Format

**Error:** Response structure different from examples

**Solution:**
- Check `api-exploration-results/` folder for actual responses
- Update TypeScript interfaces accordingly
- Add null checks and optional fields

---

## 📚 Next Steps After Exploration

1. **Update Type Definitions**
   - Create/update interfaces in `src/types/nse.ts`
   - Add all available fields
   - Mark optional fields correctly

2. **Refine Service Layer**
   - Update `nseService.ts` functions
   - Add proper error handling
   - Implement field extraction

3. **Optimize Caching**
   - Cache based on actual data freshness
   - Quotes: 5 seconds (very fresh)
   - Indices: 10 seconds (moderately fresh)
   - Corporate actions: 1 hour (rarely changes)

4. **Plan Features**
   - Map available data to UI components
   - Identify missing data that needs backend
   - Plan data scraping if needed

5. **Document Findings**
   - Create data dictionary
   - List all available fields per endpoint
   - Note any quirks or edge cases

---

## ✅ Verification Checklist

After running the explorer, verify:

- [ ] All 20 endpoints tested
- [ ] At least 15+ successful responses
- [ ] JSON files saved for each endpoint
- [ ] EXPLORATION_REPORT.md generated
- [ ] Response structures documented
- [ ] Field names noted correctly
- [ ] Data types identified
- [ ] Nested structures mapped
- [ ] Array formats understood
- [ ] Error responses captured

---

## 🎯 Expected Outcomes

After thorough exploration, you'll have:

1. **Complete API Documentation**
   - All endpoints cataloged
   - Response structures mapped
   - Available fields listed

2. **Accurate Type Definitions**
   - TypeScript interfaces matching reality
   - No assumptions about data structure
   - Proper null/undefined handling

3. **Optimized Implementation**
   - Only request needed fields
   - Cache appropriately per data type
   - Handle errors gracefully

4. **Feature Planning**
   - Know what's possible with NSE API
   - Identify gaps needing other data sources
   - Plan UI based on available data

---

## 🚀 Ready to Implement!

Once exploration is complete and you have:
- ✅ All response structures documented
- ✅ TypeScript interfaces created
- ✅ Service layer updated
- ✅ Caching strategy defined
- ✅ Error handling planned

You're ready to build all the features with confidence! 🎉

---

**Pro Tip:** Keep the exploration results folder in version control (add to `.gitignore` the responses but keep the report) so the team can reference actual API structures during development.