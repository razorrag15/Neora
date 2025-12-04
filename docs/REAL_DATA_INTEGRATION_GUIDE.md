# Real Data Integration - Complete Setup Guide

**Get live NSE market data in your NEORA app in 10 minutes!** 🚀

---

## 📦 What We've Created

### New Services Added:
1. **`src/services/nseService.ts`** (301 lines)
   - Direct NSE API integration
   - Get stock quotes, indices, gainers/losers
   - Search functionality
   - No backend needed!

2. **`src/services/marketDataService.ts`** (252 lines)
   - Unified market data interface
   - Intelligent caching (5-30 seconds)
   - Format helpers
   - Auto-refresh support

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies

```bash
npm install axios
```

That's it! Just axios is needed.

### Step 2: Initialize Market Data Service

Update your `src/main.tsx` or `src/App.tsx`:

```typescript
// Add at the top
import marketDataService from './services/marketDataService';

// In your main app component or App.tsx, add useEffect:
useEffect(() => {
  // Initialize NSE session
  marketDataService.initialize().then(() => {
    console.log('✅ Market data service ready');
  });
}, []);
```

### Step 3: Use Real Data in Components

**Example: Update Dashboard to use real data**

```typescript
import { useEffect, useState } from 'react';
import marketDataService from '@/services/marketDataService';
import type { StockQuote, IndexQuote, MarketMover } from '@/services/nseService';

function Dashboard() {
  const [indices, setIndices] = useState<IndexQuote[]>([]);
  const [topGainers, setTopGainers] = useState<MarketMover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketData();
    
    // Auto-refresh every 30 seconds
    const cleanup = marketDataService.startAutoRefresh(loadMarketData, 30000);
    return cleanup;
  }, []);

  async function loadMarketData() {
    try {
      setLoading(true);
      
      // Fetch real data
      const [indicesData, gainersData] = await Promise.all([
        marketDataService.getIndices(),
        marketDataService.getTopGainers(10),
      ]);
      
      setIndices(indicesData);
      setTopGainers(gainersData);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {loading ? (
        <div>Loading real market data...</div>
      ) : (
        <>
          {/* Display indices */}
          {indices.map(index => (
            <div key={index.index}>
              {index.index}: ₹{index.ltp} 
              ({marketDataService.formatPChange(index.pChange)})
            </div>
          ))}
          
          {/* Display top gainers */}
          {topGainers.map(stock => (
            <StockCard
              key={stock.symbol}
              stock={marketDataService.convertToStockCardData(stock)}
            />
          ))}
        </>
      )}
    </div>
  );
}
```

---

## 🎯 Available Functions

### Get Stock Quotes

```typescript
// Single stock
const quote = await marketDataService.getQuote('RELIANCE');
console.log(quote.ltp, quote.pChange);

// Multiple stocks
const quotes = await marketDataService.getQuotes(['TCS', 'INFY', 'WIPRO']);
quotes.forEach(q => console.log(q.symbol, q.ltp));
```

### Get Market Indices

```typescript
const indices = await marketDataService.getIndices();
// Returns: NIFTY 50, BANKNIFTY, INDIA VIX, etc.
indices.forEach(idx => {
  console.log(`${idx.index}: ${idx.ltp} (${idx.pChange}%)`);
});
```

### Get Market Movers

```typescript
// Top gainers
const gainers = await marketDataService.getTopGainers(10);

// Top losers
const losers = await marketDataService.getTopLosers(10);

// Most active (by volume)
const active = await marketDataService.getMostActive(10);
```

### Search Stocks

```typescript
const results = await marketDataService.searchStocks('reliance');
// Returns array of matching stocks
```

### Format Data for Display

```typescript
// Format price
marketDataService.formatPrice(2456.75);  // "₹2,456.75"

// Format percentage
marketDataService.formatPChange(2.34);   // "+2.34%"
marketDataService.formatPChange(-1.23);  // "-1.23%"

// Format volume
marketDataService.formatVolume(1234567);  // "12.35L"
marketDataService.formatVolume(12345678); // "1.23 Cr"

// Get color class
marketDataService.getChangeColorClass(2.5);   // "text-market-gain"
marketDataService.getChangeColorClass(-1.2);  // "text-market-loss"
```

### Check Market Status

```typescript
const status = marketDataService.getMarketStatus();
if (status.isOpen) {
  console.log('Market is open!');
} else {
  console.log(`Market closed: ${status.message}`);
  console.log(`Next open: ${status.nextOpenTime}`);
}
```

### Auto-Refresh

```typescript
// Start auto-refresh (returns cleanup function)
const stopRefresh = marketDataService.startAutoRefresh(() => {
  // Your refresh logic
  loadData();
}, 5000); // Every 5 seconds

// Later, stop refreshing
stopRefresh();
```

### Cache Management

```typescript
// Clear cache (force fresh data)
marketDataService.clearCache();

// Get cache stats (debugging)
const stats = marketDataService.getCacheStats();
console.log(`Cache size: ${stats.size} entries`);
```

---

## 🔄 Caching Strategy

The service automatically caches data:
- **Stock quotes**: 5 seconds
- **Market indices**: 10 seconds
- **Top gainers/losers**: 30 seconds

This reduces API calls and improves performance!

---

## 📊 Update Your Components

### 1. Update IndicesBar Component

```typescript
// src/components/market/IndicesBar.tsx
import { useEffect, useState } from 'react';
import marketDataService from '@/services/marketDataService';
import type { IndexQuote } from '@/services/nseService';

export function IndicesBar() {
  const [indices, setIndices] = useState<IndexQuote[]>([]);

  useEffect(() => {
    loadIndices();
    const cleanup = marketDataService.startAutoRefresh(loadIndices, 10000);
    return cleanup;
  }, []);

  async function loadIndices() {
    const data = await marketDataService.getIndices();
    setIndices(data);
  }

  return (
    <div className="overflow-hidden bg-surface-glass">
      <div className="animate-marquee flex gap-8">
        {indices.map(index => (
          <div key={index.index} className="flex items-center gap-2">
            <span className="font-semibold">{index.index}</span>
            <span>{marketDataService.formatPrice(index.ltp)}</span>
            <span className={marketDataService.getChangeColorClass(index.change)}>
              {marketDataService.formatPChange(index.pChange)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 2. Update Dashboard Market Movers

```typescript
// src/pages/dashboard/Dashboard.tsx
import { useEffect, useState } from 'react';
import marketDataService from '@/services/marketDataService';
import type { MarketMover } from '@/services/nseService';
import { StockCard } from '@/components/stock/StockCard';

export function Dashboard() {
  const [topGainers, setTopGainers] = useState<MarketMover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketMovers();
    const cleanup = marketDataService.startAutoRefresh(loadMarketMovers, 30000);
    return cleanup;
  }, []);

  async function loadMarketMovers() {
    try {
      const gainers = await marketDataService.getTopGainers(4);
      setTopGainers(gainers);
    } catch (error) {
      console.error('Error loading market movers:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Market Movers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topGainers.map(stock => (
          <StockCard
            key={stock.symbol}
            stock={{
              symbol: stock.symbol,
              name: stock.companyName,
              price: stock.ltp,
              change: stock.change,
              changePercent: stock.pChange,
              volume: stock.volume,
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3. Create a Real-Time Quote Component

```typescript
// src/components/stock/LiveQuote.tsx
import { useEffect, useState } from 'react';
import marketDataService from '@/services/marketDataService';
import type { StockQuote } from '@/services/nseService';

interface LiveQuoteProps {
  symbol: string;
  refreshInterval?: number;
}

export function LiveQuote({ symbol, refreshInterval = 5000 }: LiveQuoteProps) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuote();
    const cleanup = marketDataService.startAutoRefresh(loadQuote, refreshInterval);
    return cleanup;
  }, [symbol, refreshInterval]);

  async function loadQuote() {
    try {
      const data = await marketDataService.getQuote(symbol);
      setQuote(data);
    } catch (error) {
      console.error(`Error loading quote for ${symbol}:`, error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !quote) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-royal p-6">
      <h3 className="text-xl font-bold">{quote.companyName}</h3>
      <p className="text-text-secondary">{quote.symbol}</p>
      
      <div className="mt-4">
        <div className="text-3xl font-bold">
          {marketDataService.formatPrice(quote.ltp)}
        </div>
        <div className={`text-lg ${marketDataService.getChangeColorClass(quote.change)}`}>
          {marketDataService.formatPChange(quote.pChange)} 
          ({marketDataService.formatPrice(quote.change)})
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-text-secondary text-sm">Open</p>
          <p className="font-semibold">{marketDataService.formatPrice(quote.open)}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm">High</p>
          <p className="font-semibold">{marketDataService.formatPrice(quote.high)}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm">Low</p>
          <p className="font-semibold">{marketDataService.formatPrice(quote.low)}</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm">Volume</p>
          <p className="font-semibold">{marketDataService.formatVolume(quote.volume)}</p>
        </div>
      </div>

      <p className="text-xs text-text-tertiary mt-4">
        Last updated: {new Date(quote.lastUpdateTime).toLocaleTimeString()}
      </p>
    </div>
  );
}
```

---

## ⚠️ Important Notes

### CORS Issues

NSE API might have CORS restrictions. Solutions:

**Option 1: Use Proxy (Development)**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/nse-api': {
        target: 'https://www.nseindia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nse-api/, '/api'),
      },
    },
  },
});

// Update nseService.ts baseURL:
const NSE_BASE_URL = '/nse-api';
```

**Option 2: Use CORS Proxy (Quick Fix)**
```typescript
// Use a CORS proxy service
const CORS_PROXY = 'https://corsproxy.io/?';
const NSE_BASE_URL = `${CORS_PROXY}https://www.nseindia.com/api`;
```

**Option 3: Backend Proxy (Production)**
Set up FastAPI backend to proxy NSE requests (recommended for production).

### Rate Limiting

NSE may rate-limit requests. The service includes caching to minimize API calls:
- Quotes cached for 5 seconds
- Indices cached for 10 seconds
- Movers cached for 30 seconds

### Market Hours

The API works best during market hours (9:15 AM - 3:30 PM IST, Monday-Friday).
Use `marketDataService.getMarketStatus()` to check if market is open.

---

## 🎉 Benefits

✅ **Real Market Data** - Live NSE quotes, not mock data
✅ **No Backend Required** - Works directly from frontend
✅ **Free Forever** - NSE public API is free
✅ **Intelligent Caching** - Reduces API calls, improves performance
✅ **Easy to Use** - Simple, clean API
✅ **Type-Safe** - Full TypeScript support
✅ **Auto-Refresh** - Built-in refresh functionality

---

## 🔮 Next Steps

### Week 2: Add Full Backend
Once you set up the FastAPI backend:
1. Replace NSE direct calls with backend API
2. Add Kotak Neo for premium features
3. Implement portfolio sync
4. Add WebSocket for real-time updates

### Week 3: Enhanced Features
1. Store historical data in Supabase
2. Add charting with stored data
3. Implement advanced analytics
4. Add price alerts

---

## 🐛 Troubleshooting

### "Network Error" or CORS Issues
**Solution**: Use CORS proxy or setup backend proxy (see CORS Issues section above)

### "Quote returns null"
**Possible causes**:
- Invalid symbol name (use NSE symbols like 'RELIANCE', not 'RIL')
- Market is closed
- API rate limiting

**Solution**: 
```typescript
const quote = await marketDataService.getQuote('RELIANCE');
if (!quote) {
  console.error('Quote not available');
  // Show fallback UI or retry
}
```

### Cache not clearing
```typescript
// Manually clear cache
marketDataService.clearCache();
```

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify symbol names are correct (NSE format)
3. Check if market is open
4. Try clearing cache
5. Review CORS setup

---

**You now have real market data in your app!** 🎉

Next: Set up the full FastAPI backend for advanced features!