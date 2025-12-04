# 🔧 NEORA Scripts

## API Exploration Script

### Purpose
The `explore-nse-api.ts` script systematically tests all NSE (National Stock Exchange of India) API endpoints to understand their response structures, available data fields, and behavior.

### Why This Matters
Before implementing features, we need to:
1. **Know exact response structures** - Avoid assumptions about API responses
2. **Discover all available fields** - Don't miss valuable data
3. **Test error scenarios** - Handle edge cases properly
4. **Measure response times** - Optimize caching strategy
5. **Document everything** - Create reference for the team

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install axios tsx
npm install -D @types/node
```

### 2. Run the Explorer
```bash
npm run explore-api
```

### 3. View Results
Check the `api-exploration-results/` folder:
- `EXPLORATION_REPORT.md` - Human-readable report
- `SUMMARY.json` - Quick overview
- Individual JSON files for each endpoint

---

## 📊 What Gets Tested

The script tests 20+ NSE API endpoints:

### Market Data (5 endpoints)
- Market status (open/closed)
- All indices overview
- NIFTY 50 detailed data
- BANK NIFTY detailed data
- Market turnover statistics

### Stock Data (3 endpoints)
- Individual stock quotes (Reliance, TCS)
- Top gainers/losers
- FNO segment stocks

### Trading Data (3 endpoints)
- Pre-open market data
- Block deals
- Bulk deals

### Corporate & Events (4 endpoints)
- Holiday calendar
- NSE circulars
- Corporate actions (dividends, splits)
- IPO details

### Discovery (2 endpoints)
- Stock search/autocomplete
- Index constituents

### Technical Data (1 endpoint)
- Advance/decline ratios

---

## 📁 Output Structure

```
api-exploration-results/
├── SUMMARY.json                    # Overall summary
├── EXPLORATION_REPORT.md           # Detailed report
├── market-status.json              # Individual responses
├── all-indices.json
├── nifty-50-quote.json
├── stock-quote-reliance.json
├── top-gainers.json
└── ... (15+ more files)
```

### SUMMARY.json Format
```json
{
  "totalEndpoints": 20,
  "successful": 18,
  "failed": 2,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "endpoints": {
    "Market Status": {
      "endpoint": "/api/marketStatus",
      "status": "success",
      "responseSize": 1234,
      "dataStructure": { ... }
    }
  }
}
```

---

## 🔍 How It Works

### 1. Session Initialization
```typescript
// First, visit homepage to get session cookies
await this.client.get('/')
```

### 2. Sequential Testing
```typescript
// Test each endpoint with delays to avoid rate limiting
await this.exploreEndpoint('Market Status', '/api/marketStatus', 'Description')
await this.delay(1000) // Wait 1 second
```

### 3. Response Analysis
```typescript
// Analyze structure recursively
analyzeStructure(data) {
  if (Array.isArray(data)) return [analyzeStructure(data[0])]
  if (typeof data === 'object') {
    return Object.keys(data).map(key => ({
      key, type: typeof data[key]
    }))
  }
  return typeof data
}
```

### 4. Save Results
```typescript
// Save individual responses + generate report
fs.writeFileSync('endpoint.json', JSON.stringify(data, null, 2))
generateMarkdownReport()
```

---

## 🛠️ Customization

### Add New Endpoints

Edit `scripts/explore-nse-api.ts`:

```typescript
async exploreAllEndpoints() {
  // ... existing endpoints
  
  // Add your endpoint
  await this.exploreEndpoint(
    'Your Endpoint Name',
    '/api/your-endpoint?param=value',
    'What this endpoint does'
  )
  await this.delay(1000)
}
```

### Change Analysis Depth

```typescript
// Increase depth to analyze nested objects deeper
analyzeStructure(data, depth = 0, maxDepth = 5) // Changed from 3 to 5
```

### Modify Output Format

```typescript
// Change output directory
private outputDir = './custom-results'

// Add custom analysis
customAnalysis(data: any) {
  // Your custom logic
  return analysis
}
```

---

## 🚨 Troubleshooting

### Issue: CORS Errors

**Symptom:** 
```
Access to fetch at 'https://www.nseindia.com' blocked by CORS policy
```

**Solution 1:** Use CORS proxy
```typescript
baseURL: 'https://corsproxy.io/?https://www.nseindia.com'
```

**Solution 2:** Setup Vite proxy (in `vite.config.ts`)
```typescript
server: {
  proxy: {
    '/api/nse': {
      target: 'https://www.nseindia.com',
      changeOrigin: true
    }
  }
}
```

### Issue: 401 Unauthorized

**Symptom:**
```
Error: Request failed with status code 401
```

**Solution:** Session not initialized
```typescript
// Ensure session is initialized
await this.initSession()
await this.delay(2000) // Wait longer for cookies
```

### Issue: Rate Limited

**Symptom:**
```
Error: Request failed with status code 429
```

**Solution:** Increase delays
```typescript
await this.delay(3000) // Increase from 1s to 3s
```

### Issue: Empty Responses

**Symptom:**
```json
{ "data": [] }
```

**Possible Causes:**
1. Market is closed (NSE operates 9:15 AM - 3:30 PM IST)
2. Weekend or holiday
3. Session expired
4. Invalid parameters

**Solution:** Check market hours and session

---

## 📚 Using the Results

### 1. Create TypeScript Interfaces

Based on actual responses:

```typescript
// src/types/nse-responses.ts

// From stock-quote-reliance.json
export interface StockQuoteResponse {
  info: {
    symbol: string
    companyName: string
    industry: string
  }
  priceInfo: {
    lastPrice: number
    change: number
    pChange: number
    // ... all fields from actual response
  }
}
```

### 2. Update Service Layer

```typescript
// src/services/nseService.ts

async getStockQuote(symbol: string): Promise<StockQuoteResponse> {
  const response = await this.client.get(`/api/quote-equity?symbol=${symbol}`)
  return response.data // Now properly typed!
}
```

### 3. Extract What You Need

```typescript
// Transform full response to app-specific format
function toStockCard(response: StockQuoteResponse): StockCard {
  return {
    symbol: response.info.symbol,
    name: response.info.companyName,
    price: response.priceInfo.lastPrice,
    change: response.priceInfo.change,
    changePercent: response.priceInfo.pChange,
  }
}
```

---

## 🎯 Best Practices

### 1. Run Regularly
- Run explorer when NSE API changes
- Re-run after NSE updates
- Keep results updated in docs

### 2. Version Control
```bash
# Add to .gitignore
api-exploration-results/*.json

# But keep the report
!api-exploration-results/EXPLORATION_REPORT.md
```

### 3. Share with Team
- Commit `EXPLORATION_REPORT.md` to git
- Share interesting findings in team meetings
- Update documentation when structures change

### 4. Continuous Validation
```typescript
// Add to CI/CD pipeline
"test:api": "npm run explore-api && node scripts/validate-api.js"
```

---

## 🔄 Update Workflow

When NSE API changes:

1. **Re-run Explorer**
   ```bash
   npm run explore-api
   ```

2. **Compare Results**
   ```bash
   git diff api-exploration-results/EXPLORATION_REPORT.md
   ```

3. **Update Types**
   - Modify TypeScript interfaces
   - Update service layer
   - Fix breaking changes

4. **Update Tests**
   - Adjust mock data
   - Update test expectations
   - Re-run integration tests

5. **Document Changes**
   - Update CHANGELOG
   - Notify team
   - Update feature documentation

---

## 📖 Related Documentation

- **API Exploration Guide**: `../docs/API_EXPLORATION_GUIDE.md`
- **Real Data Integration**: `../docs/REAL_DATA_INTEGRATION_GUIDE.md`
- **NSE Service Documentation**: `../src/services/nseService.ts`
- **Type Definitions**: `../src/types/nse.ts`

---

## 🤝 Contributing

To add support for new NSE endpoints:

1. Add endpoint to `exploreAllEndpoints()`
2. Run explorer: `npm run explore-api`
3. Document findings in `EXPLORATION_REPORT.md`
4. Create TypeScript interfaces
5. Update service layer
6. Add to this README

---

## 📝 Notes

- **Rate Limiting**: Script includes 1-2 second delays between requests
- **Session Management**: Automatic session initialization before first request
- **Error Handling**: Failed requests are logged but don't stop exploration
- **Output Size**: Individual JSON files can be 100KB+ for large responses
- **Execution Time**: Full exploration takes 30-60 seconds

---

## ✅ Success Criteria

After running the explorer, you should have:

- [ ] `SUMMARY.json` with 18+ successful endpoints
- [ ] `EXPLORATION_REPORT.md` with detailed analysis
- [ ] 20+ individual JSON response files
- [ ] No CORS or authentication errors
- [ ] Complete response structure documentation
- [ ] TypeScript interfaces ready to implement

---

**Happy Exploring! 🚀**

For questions or issues, check the full guide at `docs/API_EXPLORATION_GUIDE.md`