# NEORA Intelligence - Future Development Phases

**Detailed Implementation Plan Beyond MVP**

---

## Overview

This document outlines the complete development roadmap from MVP (Month 1) through advanced features (Month 12+). Each phase builds upon the previous one with specific deliverables, timelines, and technical requirements.

---

## Phase 2: Data Enhancement & Web Scraping (Month 2)

### Duration: 4 weeks
### Team Size: 2-3 developers

### Objectives
- Implement multi-source data scraping
- Add news aggregation with AI sentiment
- Build IPO tracking system
- Create corporate actions calendar
- Implement price alerts

---

### 2.1 Web Scraping Infrastructure

#### NSE India Scraper
```python
# backend/app/scrapers/nse_scraper.py

Features:
- Stock announcements
- Bulk deals (daily)
- Block deals (daily)
- Insider trading data
- Corporate actions (dividends, bonuses, splits)
- Board meeting schedules
- Result announcements
- AGM/EGM dates

Technology:
- BeautifulSoup4 for HTML parsing
- Selenium for dynamic content
- Scrapy for large-scale scraping
- APScheduler for cron jobs

Challenges:
- NSE website structure changes
- Rate limiting (be respectful)
- Data validation
- Error handling

Frequency:
- Real-time data: Every 5 minutes
- Daily data: Once at market close
- Weekly data: Sunday morning
```

#### BSE Scraper
```python
Features:
- Stock announcements
- Corporate actions
- Market statistics
- IPO data

Implementation:
- Similar to NSE scraper
- Different URL patterns
- Different HTML structure
```

#### Moneycontrol Scraper
```python
Features:
- Latest news articles
- Expert opinions
- Stock recommendations
- Sector analysis
- Market reports

Implementation:
- RSS feed parsing
- Article content extraction
- Author information
- Related stocks identification
```

#### Economic Times Integration
```python
Features:
- Breaking news
- Market analysis
- Expert columns
- Company profiles

Implementation:
- API integration (if available)
- RSS feeds
- Web scraping as fallback
```

### 2.2 News Aggregation System

#### Database Schema
```sql
CREATE TABLE news_articles (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  source TEXT NOT NULL,
  author TEXT,
  url TEXT UNIQUE,
  image_url TEXT,
  
  -- Categorization
  category TEXT,
  related_symbols TEXT[],
  sector TEXT,
  
  -- Sentiment Analysis
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  sentiment_score DECIMAL(5, 4),
  sentiment_confidence DECIMAL(5, 4),
  
  -- AI Analysis
  ai_summary TEXT,
  key_points TEXT[],
  impact_analysis TEXT,
  
  -- Metadata
  published_at TIMESTAMP NOT NULL,
  scraped_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  
  -- Search
  tsv_content tsvector
);

CREATE INDEX idx_news_published ON news_articles(published_at DESC);
CREATE INDEX idx_news_symbols ON news_articles USING GIN(related_symbols);
CREATE INDEX idx_news_search ON news_articles USING GIN(tsv_content);
```

#### AI Sentiment Analysis
```python
# Using Gemini AI
async def analyze_news_sentiment(article_text: str):
    prompt = f"""
    Analyze this stock market news article:
    
    {article_text}
    
    Provide:
    1. Sentiment: positive/negative/neutral
    2. Confidence score: 0-1
    3. Key points (3-5 bullet points)
    4. Potential market impact
    5. Related stock symbols
    """
    
    response = await gemini.generate_content(prompt)
    return parse_ai_response(response)
```

### 2.3 IPO Tracker

#### Features
- Upcoming IPOs calendar
- Live subscription status
- GMP (Grey Market Premium) tracking
- Allotment date reminders
- Application status checker
- Historical performance

#### Data Sources
- NSE/BSE IPO pages
- Chittorgarh website
- IPO Central
- MoneyControl IPO section

#### Database Schema
```sql
CREATE TABLE ipos (
  id UUID PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_description TEXT,
  logo_url TEXT,
  
  -- IPO Details
  price_band_min DECIMAL(10, 2),
  price_band_max DECIMAL(10, 2),
  lot_size INTEGER,
  issue_size DECIMAL(15, 2),
  
  -- Dates
  open_date DATE NOT NULL,
  close_date DATE NOT NULL,
  listing_date DATE,
  allotment_date DATE,
  
  -- Status
  status TEXT CHECK (status IN ('upcoming', 'open', 'closed', 'listed', 'cancelled')),
  
  -- Subscription
  retail_subscription DECIMAL(10, 2),
  hni_subscription DECIMAL(10, 2),
  qib_subscription DECIMAL(10, 2),
  total_subscription DECIMAL(10, 2),
  
  -- GMP
  gmp_value DECIMAL(10, 2),
  gmp_updated_at TIMESTAMP,
  
  -- Listing
  listing_price DECIMAL(10, 2),
  listing_gain_percent DECIMAL(10, 4),
  
  -- Additional
  lead_managers TEXT[],
  registrar TEXT,
  exchange TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### User Features
- Set IPO alerts
- Track applications
- Get allotment updates
- Compare IPO performance
- Expert recommendations

### 2.4 Corporate Actions Calendar

#### Types of Corporate Actions
```
1. Dividends
   - Dividend amount
   - Ex-dividend date
   - Record date
   - Payment date

2. Bonus Issues
   - Ratio (e.g., 1:1, 2:1)
   - Record date
   - Credit date

3. Stock Splits
   - Split ratio (e.g., 1:2, 1:5)
   - Effective date
   - Reason

4. Rights Issues
   - Rights ratio
   - Price
   - Record date
   - Entitlement date

5. Buybacks
   - Buyback price
   - Start date
   - End date
   - Total amount

6. Mergers & Acquisitions
   - Merger ratio
   - Effective date
   - Details
```

#### Implementation
```python
# Scraper for corporate actions
async def scrape_corporate_actions():
    sources = [
        NSECorporateActions(),
        BSECorporateActions(),
        MoneyControlActions()
    ]
    
    for source in sources:
        actions = await source.fetch()
        for action in actions:
            await save_corporate_action(action)
            await notify_affected_users(action)
```

### 2.5 Price Alerts System

#### Alert Types
```
1. Price Target
   - Above X
   - Below X
   
2. Percentage Change
   - Up by X%
   - Down by X%
   
3. Volume Spike
   - Volume > X times average
   
4. Technical Indicators
   - RSI > 70 (overbought)
   - RSI < 30 (oversold)
   - MACD crossover
   - Moving average crossover
```

#### Implementation
```python
# Background worker checking alerts
@celery.task
async def check_price_alerts():
    active_alerts = await get_active_alerts()
    
    for alert in active_alerts:
        current_price = await get_stock_price(alert.symbol)
        
        if alert_triggered(alert, current_price):
            await send_notification(alert.user_id, alert)
            await log_alert_trigger(alert)
            
            if not alert.repeat:
                await deactivate_alert(alert.id)
```

#### Notification Channels
- Email notifications
- Push notifications (PWA)
- In-app notifications
- SMS (premium feature)
- Telegram bot (future)

---

## Phase 3: Real-Time Updates & Advanced Analytics (Month 3)

### Duration: 4 weeks
### Team Size: 3-4 developers

### 3.1 WebSocket Real-Time System

#### Architecture
```
Client (React)
    ↓ WebSocket Connection
WebSocket Server (FastAPI)
    ↓ Subscribe to Kotak Neo
Kotak Neo WebSocket
    ↓ Market Data Stream
Process & Broadcast
    ↓ Multiple Clients
All Connected Users
```

#### Implementation
```python
# backend/app/websocket/server.py
from fastapi import WebSocket
from typing import Dict, Set

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, symbol: str):
        await websocket.accept()
        if symbol not in self.active_connections:
            self.active_connections[symbol] = set()
        self.active_connections[symbol].add(websocket)
    
    async def disconnect(self, websocket: WebSocket, symbol: str):
        self.active_connections[symbol].remove(websocket)
    
    async def broadcast(self, symbol: str, data: dict):
        if symbol in self.active_connections:
            for connection in self.active_connections[symbol]:
                await connection.send_json(data)

manager = ConnectionManager()

@app.websocket("/ws/stock/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    await manager.connect(websocket, symbol)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket, symbol)
```

#### Frontend Integration
```typescript
// frontend/src/hooks/useRealtimeStock.ts
export function useRealtimeStock(symbol: string) {
  const [price, setPrice] = useState<number | null>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)
  
  useEffect(() => {
    const websocket = new WebSocket(`ws://api.neora.app/ws/stock/${symbol}`)
    
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setPrice(data.ltp)
    }
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
      // Implement reconnection logic
    }
    
    setWs(websocket)
    
    return () => websocket.close()
  }, [symbol])
  
  return { price, isConnected: ws?.readyState === WebSocket.OPEN }
}
```

### 3.2 Advanced Charting with TradingView

#### Integration Options

**Option A: TradingView Advanced Charts (Paid)**
```javascript
// Most professional option
// $500-2000/month licensing
// Full features, best performance

const widget = new TradingView.widget({
  symbol: "NSE:RELIANCE",
  interval: "1",
  container: "tv_chart_container",
  library_path: "/charting_library/",
  locale: "en",
  theme: "dark",
  fullscreen: false,
  autosize: true,
  timezone: "Asia/Kolkata",
  
  // Custom datafeed for Indian stocks
  datafeed: new CustomDatafeed(),
  
  // Enable all features
  enabled_features: [
    "study_templates",
    "create_volume_indicator_by_default",
    "support_manage_drawings",
    "header_indicators",
    "header_compare"
  ],
  
  // 50+ technical indicators
  studies_overrides: {
    "volume.volume.color.0": "#ef4444",
    "volume.volume.color.1": "#22c55e"
  }
})
```

**Option B: Lightweight Charts (Free)**
```typescript
// TradingView Lightweight Charts
// Free, open-source
// Good for basic charting

import { createChart } from 'lightweight-charts'

const chart = createChart(container, {
  layout: {
    background: { color: '#1f2937' },
    textColor: '#d1d5db'
  },
  grid: {
    vertLines: { color: '#374151' },
    horzLines: { color: '#374151' }
  }
})

const candlestickSeries = chart.addCandlestickSeries({
  upColor: '#22c55e',
  downColor: '#ef4444',
  borderVisible: false
})

candlestickSeries.setData(ohlcvData)
```

#### Custom Indicators Implementation
```javascript
// RSI (Relative Strength Index)
function calculateRSI(data, period = 14) {
  const gains = []
  const losses = []
  
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i-1].close
    gains.push(Math.max(change, 0))
    losses.push(Math.abs(Math.min(change, 0)))
  }
  
  const avgGain = average(gains.slice(-period))
  const avgLoss = average(losses.slice(-period))
  
  const rs = avgGain / avgLoss
  const rsi = 100 - (100 / (1 + rs))
  
  return rsi
}

// MACD (Moving Average Convergence Divergence)
function calculateMACD(data, fast=12, slow=26, signal=9) {
  const emaFast = calculateEMA(data, fast)
  const emaSlow = calculateEMA(data, slow)
  const macdLine = emaFast - emaSlow
  const signalLine = calculateEMA([macdLine], signal)
  const histogram = macdLine - signalLine
  
  return { macdLine, signalLine, histogram }
}
```

### 3.3 Stock Screener

#### Filter Categories (50+ filters)

**Fundamental Filters**
```typescript
interface FundamentalFilters {
  // Valuation
  peRatio?: { min?: number, max?: number }
  pbRatio?: { min?: number, max?: number }
  priceToSales?: { min?: number, max?: number }
  evToEbitda?: { min?: number, max?: number }
  
  // Profitability
  roe?: { min?: number, max?: number }
  roce?: { min?: number, max?: number }
  netProfitMargin?: { min?: number, max?: number }
  operatingMargin?: { min?: number, max?: number }
  
  // Dividend
  dividendYield?: { min?: number, max?: number }
  payoutRatio?: { min?: number, max?: number }
  
  // Financial Health
  debtToEquity?: { min?: number, max?: number }
  currentRatio?: { min?: number, max?: number }
  quickRatio?: { min?: number, max?: number }
  
  // Growth
  revenueGrowth?: { min?: number, max?: number }
  earningsGrowth?: { min?: number, max?: number }
  
  // Size
  marketCap?: { min?: number, max?: number }
  
  // Others
  sector?: string[]
  industry?: string[]
}
```

**Technical Filters**
```typescript
interface TechnicalFilters {
  // Price
  priceRange?: { min?: number, max?: number }
  priceChange1D?: { min?: number, max?: number }
  priceChange1W?: { min?: number, max?: number }
  priceChange1M?: { min?: number, max?: number }
  priceChange1Y?: { min?: number, max?: number }
  
  // Volume
  volume?: { min?: number, max?: number }
  volumeChange?: { min?: number, max?: number }
  avgVolume20D?: { min?: number, max?: number }
  
  // Moving Averages
  priceVs20DMA?: 'above' | 'below'
  priceVs50DMA?: 'above' | 'below'
  priceVs200DMA?: 'above' | 'below'
  
  // Indicators
  rsi?: { min?: number, max?: number }
  macd?: 'bullish_crossover' | 'bearish_crossover'
  
  // Price Patterns
  near52WeekHigh?: { within?: number } // within X%
  near52WeekLow?: { within?: number }
  
  // Volatility
  beta?: { min?: number, max?: number }
  averageTrueRange?: { min?: number, max?: number }
}
```

#### Screener Implementation
```python
# backend/app/screener/engine.py
async def screen_stocks(filters: ScreenerFilters):
    query = db.query(Stock)
    
    # Apply fundamental filters
    if filters.pe_ratio:
        query = query.filter(
            Stock.pe_ratio >= filters.pe_ratio.min,
            Stock.pe_ratio <= filters.pe_ratio.max
        )
    
    # Apply technical filters
    if filters.rsi:
        query = query.filter(
            Stock.rsi >= filters.rsi.min,
            Stock.rsi <= filters.rsi.max
        )
    
    # Execute query
    results = await query.all()
    
    # Calculate additional metrics
    for stock in results:
        stock.score = calculate_score(stock, filters)
    
    # Sort by score
    results.sort(key=lambda x: x.score, reverse=True)
    
    return results
```

#### Pre-built Screens
```python
PRESET_SCREENS = {
    "value_stocks": {
        "pe_ratio": {"max": 15},
        "pb_ratio": {"max": 1.5},
        "dividend_yield": {"min": 3},
        "debt_to_equity": {"max": 0.5}
    },
    "growth_stocks": {
        "revenue_growth": {"min": 15},
        "earnings_growth": {"min": 20},
        "roe": {"min": 15}
    },
    "momentum_stocks": {
        "price_change_1m": {"min": 10},
        "rsi": {"min": 50, "max": 70},
        "volume_change": {"min": 50}
    },
    "dividend_aristocrats": {
        "dividend_yield": {"min": 4},
        "payout_ratio": {"max": 60},
        "consecutive_dividend_years": {"min": 10}
    }
}
```

---

## Phase 4: Machine Learning & AI (Month 4)

### Duration: 4-6 weeks
### Team Size: 2-3 data scientists + 2 developers

### 4.1 Stock Price Prediction

#### LSTM Neural Network
```python
# backend/app/ml/stock_predictor.py
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

class StockPredictor:
    def __init__(self):
        self.model = self.build_model()
    
    def build_model(self):
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(60, 1)),
            Dropout(0.2),
            LSTM(50, return_sequences=True),
            Dropout(0.2),
            LSTM(50),
            Dropout(0.2),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model
    
    def train(self, X_train, y_train, epochs=50):
        self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=32,
            validation_split=0.1
        )
    
    def predict(self, data):
        prediction = self.model.predict(data)
        return prediction
    
    def predict_next_day(self, symbol: str):
        # Get historical data
        data = get_historical_data(symbol, days=60)
        
        # Preprocess
        scaled_data = preprocess(data)
        
        # Predict
        prediction = self.model.predict(scaled_data)
        
        # Post-process
        actual_price = inverse_transform(prediction)
        
        return {
            "symbol": symbol,
            "predicted_price": actual_price,
            "confidence": calculate_confidence(data),
            "prediction_date": tomorrow()
        }
```

#### Random Forest Model
```python
from sklearn.ensemble import RandomForestRegressor

class RandomForestPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
    
    def train(self, features, target):
        self.model.fit(features, target)
    
    def predict(self, features):
        return self.model.predict(features)
```

#### Feature Engineering
```python
def create_features(df):
    """Create features for ML models"""
    features = pd.DataFrame()
    
    # Price features
    features['price_change'] = df['close'].pct_change()
    features['high_low_ratio'] = df['high'] / df['low']
    
    # Moving averages
    features['ma_5'] = df['close'].rolling(5).mean()
    features['ma_20'] = df['close'].rolling(20).mean()
    features['ma_50'] = df['close'].rolling(50).mean()
    
    # Technical indicators
    features['rsi'] = calculate_rsi(df['close'])
    features['macd'] = calculate_macd(df['close'])
    
    # Volume features
    features['volume_change'] = df['volume'].pct_change()
    features['volume_ma'] = df['volume'].rolling(20).mean()
    
    # Volatility
    features['volatility'] = df['close'].rolling(20).std()
    
    return features
```

### 4.2 Sentiment Analysis

#### News Sentiment
```python
from transformers import pipeline

sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="ProsusAI/finbert"  # Financial sentiment model
)

async def analyze_news_sentiment(article_text: str):
    # Clean text
    cleaned = clean_text(article_text)
    
    # Analyze sentiment
    result = sentiment_analyzer(cleaned)[0]
    
    return {
        "sentiment": result['label'],  # positive/negative/neutral
        "score": result['score'],
        "confidence": result['score']
    }
```

#### Social Media Sentiment
```python
# Twitter/X sentiment analysis
async def analyze_social_sentiment(symbol: str):
    # Fetch tweets mentioning symbol
    tweets = await fetch_tweets(f"${symbol} OR #{symbol}")
    
    sentiments = []
    for tweet in tweets:
        sentiment = sentiment_analyzer(tweet.text)
        sentiments.append(sentiment)
    
    # Aggregate
    positive = sum(1 for s in sentiments if s['label'] == 'positive')
    negative = sum(1 for s in sentiments if s['label'] == 'negative')
    neutral = len(sentiments) - positive - negative
    
    return {
        "symbol": symbol,
        "positive_percent": positive / len(sentiments) * 100,
        "negative_percent": negative / len(sentiments) * 100,
        "neutral_percent": neutral / len(sentiments) * 100,
        "total_mentions": len(sentiments),
        "overall_sentiment": determine_overall(positive, negative, neutral)
    }
```

### 4.3 Portfolio Optimization

#### Modern Portfolio Theory (MPT)
```python
import numpy as np
from scipy.optimize import minimize

def optimize_portfolio(returns, target_return=None):
    """
    Optimize portfolio using Modern Portfolio Theory
    """
    n_assets = len(returns.columns)
    
    # Calculate expected returns and covariance
    mean_returns = returns.mean()
    cov_matrix = returns.cov()
    
    # Objective: Minimize volatility
    def portfolio_volatility(weights):
        return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    
    # Constraints
    constraints = [
        {'type': 'eq', 'fun': lambda x: np.sum(x) - 1}  # weights sum to 1
    ]
    
    if target_return:
        constraints.append({
            'type': 'eq',
            'fun': lambda x: np.dot(x, mean_returns) - target_return
        })
    
    # Bounds: 0 <= weight <= 1
    bounds = tuple((0, 1) for _ in range(n_assets))
    
    # Initial guess: equal weights
    initial_weights = np.array([1/n_assets] * n_assets)
    
    # Optimize
    result = minimize(
        portfolio_volatility,
        initial_weights,
        method='SLSQP',
        bounds=bounds,
        constraints=constraints
    )
    
    return result.x  # Optimal weights
```

---

## Implementation Timeline

```
Month 1: MVP ✅
Month 2: Data Enhancement
Month 3: Real-Time & Analytics
Month 4: AI & ML
Month 5: Premium Features
Month 6: Mobile & Scale
Month 7-12: Advanced Features
```

---

**Document Version:** 1.0.0  
**Last Updated:** December 2024  
**Next Review:** Monthly

---

*For more details, see [Complete Documentation](./NEORA_COMPLETE_DOCUMENTATION.md)*