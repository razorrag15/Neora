# Kotak Neo API Exploration & Type Definition Guide

## Overview
This guide outlines the systematic exploration of Kotak Neo API to understand all response structures, similar to our NSE API exploration. Kotak Neo provides trading capabilities with **zero brokerage**.

## Kotak Neo API Capabilities

### 1. Authentication & Session Management
- Login with credentials
- OTP verification
- Session token generation
- Token refresh mechanism
- Logout

### 2. Market Data APIs
- Live quotes (equity, derivatives)
- Market depth (order book)
- Historical data (OHLC)
- Index data
- Option chain data

### 3. Trading APIs
- Place orders (Market, Limit, SL, SL-M)
- Modify orders
- Cancel orders
- Order status
- Order book
- Trade book
- Position book

### 4. Portfolio APIs
- Holdings (long-term investments)
- Positions (intraday + delivery)
- P&L statements
- Margin information
- Fund limits

### 5. User Profile APIs
- Profile details
- Bank accounts
- DP details
- Segment activation status

## Exploration Strategy

### Phase 1: Setup & Authentication (Week 2, Day 1)

#### 1.1 Install Kotak Neo Python SDK
```bash
pip install neo_api_client
```

#### 1.2 Create Exploration Script
```python
# scripts/explore_kotak_neo.py
from neo_api_client import NeoAPI
import json
import os
from datetime import datetime
from typing import Dict, Any, List

class KotakNeoExplorer:
    def __init__(self):
        self.client = NeoAPI(
            consumer_key=os.getenv('KOTAK_CONSUMER_KEY'),
            consumer_secret=os.getenv('KOTAK_CONSUMER_SECRET'),
            environment='prod'  # or 'uat' for testing
        )
        self.session_token = None
        self.results_dir = 'kotak-exploration-results'
        os.makedirs(self.results_dir, exist_ok=True)
    
    def login(self, mobile_number: str, password: str, mpin: str):
        """Step 1: Login and get OTP"""
        pass
    
    def verify_otp(self, otp: str):
        """Step 2: Verify OTP and get session token"""
        pass
    
    def explore_all_endpoints(self):
        """Systematically test all API endpoints"""
        pass
```

#### 1.3 Required Credentials
You'll need:
- Consumer Key (from Kotak Neo API registration)
- Consumer Secret
- Mobile Number (registered with Kotak)
- Password
- MPIN (6-digit)
- Access to OTP (SMS/Email)

### Phase 2: API Endpoint Mapping

#### 2.1 Authentication Endpoints
```python
endpoints_auth = [
    {
        'name': 'login',
        'method': 'login',
        'params': {'mobilenumber': 'XXXXX', 'password': 'XXXXX'}
    },
    {
        'name': 'session_token',
        'method': 'session_2fa',
        'params': {'OTP': 'XXXXX'}
    },
]
```

#### 2.2 Market Data Endpoints
```python
endpoints_market = [
    {
        'name': 'quotes',
        'method': 'quotes',
        'params': {
            'instrument_tokens': ['11536'],  # Reliance
            'quote_type': 'ltp',  # ltp, depth, ohlc
            'isIndex': False
        }
    },
    {
        'name': 'index_quote',
        'method': 'quotes',
        'params': {
            'instrument_tokens': ['Nifty 50'],
            'isIndex': True
        }
    },
    {
        'name': 'market_depth',
        'method': 'quotes',
        'params': {
            'instrument_tokens': ['11536'],
            'quote_type': 'depth'
        }
    },
    {
        'name': 'scrip_master',
        'method': 'scrip_master',
        'params': {'exchange_segment': 'nse_cm'}  # NSE Cash Market
    },
]
```

#### 2.3 Trading Endpoints
```python
endpoints_trading = [
    {
        'name': 'place_order',
        'method': 'place_order',
        'params': {
            'exchange_segment': 'nse_cm',
            'product': 'CNC',  # CNC, MIS, NRML
            'price': '0',
            'order_type': 'MKT',  # MKT, L, SL, SL-M
            'quantity': '1',
            'validity': 'DAY',
            'trading_symbol': 'RELIANCE-EQ',
            'transaction_type': 'B',  # B for Buy, S for Sell
            'amo': 'NO'
        },
        'note': 'TEST ORDER - DO NOT RUN WITHOUT CONFIRMATION'
    },
    {
        'name': 'order_book',
        'method': 'order_report',
        'params': {}
    },
    {
        'name': 'trade_book',
        'method': 'trade_report',
        'params': {}
    },
    {
        'name': 'positions',
        'method': 'positions',
        'params': {}
    },
]
```

#### 2.4 Portfolio Endpoints
```python
endpoints_portfolio = [
    {
        'name': 'holdings',
        'method': 'holdings',
        'params': {}
    },
    {
        'name': 'limits',
        'method': 'limits',
        'params': {'segment': 'ALL'}  # ALL, EQ, FO, COM, CD
    },
    {
        'name': 'margin_required',
        'method': 'margin_required',
        'params': {
            'exchange_segment': 'nse_cm',
            'price': '1500',
            'order_type': 'L',
            'product': 'CNC',
            'quantity': '1',
            'instrument_token': '11536',
            'transaction_type': 'B'
        }
    },
]
```

### Phase 3: Response Structure Analysis

#### 3.1 Expected Response Structures

**Quote Response:**
```json
{
  "stat": "Ok",
  "data": {
    "ltp": 1566.50,
    "oi": 12345678,
    "close": 1567.00,
    "low": 1563.60,
    "high": 1577.50,
    "ltt": "01/12/2025 15:30:00",
    "ltq": 100,
    "tbq": 1234567,
    "tsq": 2345678,
    "low_52": 1114.85,
    "high_52": 1581.30,
    "lc": 1410.80,
    "uc": 1724.20,
    "yh": 1581.30,
    "yl": 1114.85
  }
}
```

**Order Response:**
```json
{
  "stat": "Ok",
  "nOrdNo": "240101000012345",
  "stCode": 200,
  "data": {
    "orderId": "240101000012345",
    "trading_symbol": "RELIANCE-EQ",
    "exchange": "NSE",
    "product": "CNC",
    "order_type": "L",
    "price": "1500.00",
    "quantity": "1",
    "disclosed_quantity": "0",
    "validity": "DAY",
    "status": "open",
    "order_timestamp": "01-Dec-2025 09:15:00"
  }
}
```

**Holdings Response:**
```json
{
  "stat": "Ok",
  "data": [
    {
      "trdSym": "RELIANCE-EQ",
      "exc": "NSE",
      "ISIN": "INE002A01018",
      "hldQty": "10",
      "brkColQty": "0",
      "dpQty": "10",
      "avgPrice": "1450.50",
      "ltp": "1566.50",
      "cstPrc": "14505.00",
      "val": "15665.00",
      "unrealizedPL": "1160.00",
      "realizedPL": "0.00",
      "dayChange": "-1.00",
      "dayChangePerc": "-0.06"
    }
  ]
}
```

### Phase 4: TypeScript Type Definitions

#### 4.1 Create Kotak Neo Types File
```typescript
// src/types/kotakNeo.ts

// ==================== Authentication Types ====================
export interface LoginResponse {
  stat: 'Ok' | 'Not_Ok';
  stCode: number;
  errMsg?: string;
}

export interface SessionResponse {
  stat: 'Ok' | 'Not_Ok';
  sid: string;
  rid: string;
  hsServerId: string;
  isUserPwdExpired: boolean;
  cacheTime: string;
  ucc: string;
  greetingName: string;
  exchange: string[];
  product: string[];
  lastLoginTime: string;
}

// ==================== Market Data Types ====================
export interface QuoteData {
  ltp: number;           // Last Traded Price
  oi: number;            // Open Interest
  close: number;         // Previous Close
  low: number;           // Day Low
  high: number;          // Day High
  ltt: string;           // Last Trade Time
  ltq: number;           // Last Trade Quantity
  tbq: number;           // Total Buy Quantity
  tsq: number;           // Total Sell Quantity
  low_52: number;        // 52-week Low
  high_52: number;       // 52-week High
  lc: number;            // Lower Circuit
  uc: number;            // Upper Circuit
  yh: number;            // Year High
  yl: number;            // Year Low
  bid: number;           // Bid Price
  ask: number;           // Ask Price
  bidQty: number;        // Bid Quantity
  askQty: number;        // Ask Quantity
}

export interface QuoteResponse {
  stat: 'Ok' | 'Not_Ok';
  data: QuoteData;
  errMsg?: string;
}

export interface MarketDepthLevel {
  price: number;
  quantity: number;
  orders: number;
}

export interface MarketDepthData {
  ltp: number;
  bid: MarketDepthLevel[];  // 5 levels
  ask: MarketDepthLevel[];  // 5 levels
  totalBuyQty: number;
  totalSellQty: number;
}

// ==================== Trading Types ====================
export interface PlaceOrderParams {
  exchange_segment: 'nse_cm' | 'bse_cm' | 'nse_fo' | 'bse_fo' | 'cde_fo' | 'mcx_fo';
  product: 'CNC' | 'MIS' | 'NRML';
  price: string;
  order_type: 'L' | 'MKT' | 'SL' | 'SL-M';
  quantity: string;
  validity: 'DAY' | 'IOC' | 'EOS' | 'GTD';
  trading_symbol: string;
  transaction_type: 'B' | 'S';
  amo: 'YES' | 'NO';
  disclosed_quantity?: string;
  market_protection?: string;
  pf?: 'N' | 'M';
  trigger_price?: string;
  dd?: string;  // GTD date
}

export interface OrderResponse {
  stat: 'Ok' | 'Not_Ok';
  nOrdNo: string;
  stCode: number;
  errMsg?: string;
  data?: {
    orderId: string;
    trading_symbol: string;
    exchange: string;
    product: string;
    order_type: string;
    price: string;
    quantity: string;
    disclosed_quantity: string;
    validity: string;
    status: string;
    order_timestamp: string;
  };
}

export interface Order {
  nOrdNo: string;
  exchOrdID: string;
  trnsTp: 'B' | 'S';
  ordSt: 'open' | 'pending' | 'rejected' | 'complete' | 'cancelled' | 'trigger pending';
  prcTp: 'L' | 'MKT' | 'SL' | 'SL-M';
  prod: 'CNC' | 'MIS' | 'NRML';
  exSeg: string;
  trdSym: string;
  qty: string;
  unFldSz: string;
  dsQty: string;
  prc: string;
  trgPrc: string;
  avgPrc: string;
  ordDtTm: string;
  exchTm: string;
  sts: string;
  rjRsn?: string;
}

export interface OrderBookResponse {
  stat: 'Ok' | 'Not_Ok';
  data: Order[];
}

// ==================== Portfolio Types ====================
export interface Holding {
  trdSym: string;         // Trading Symbol
  exc: string;            // Exchange
  ISIN: string;           // ISIN Number
  hldQty: string;         // Holding Quantity
  brkColQty: string;      // Broker Collateral Quantity
  dpQty: string;          // Demat Quantity
  avgPrice: string;       // Average Price
  ltp: string;            // Last Traded Price
  cstPrc: string;         // Cost Price
  val: string;            // Current Value
  unrealizedPL: string;   // Unrealized P&L
  realizedPL: string;     // Realized P&L
  dayChange: string;      // Day Change
  dayChangePerc: string;  // Day Change Percentage
}

export interface HoldingsResponse {
  stat: 'Ok' | 'Not_Ok';
  data: Holding[];
}

export interface Position {
  flBuyQty: string;       // Buy Quantity
  flSellQty: string;      // Sell Quantity
  netQty: string;         // Net Quantity
  avgSlPrc: string;       // Average Sell Price
  avgByPrc: string;       // Average Buy Price
  rlzPL: string;          // Realized P&L
  urlzPL: string;         // Unrealized P&L
  ltp: string;            // Last Traded Price
  trdSym: string;         // Trading Symbol
  exc: string;            // Exchange
  ntPL: string;           // Net P&L
  tok: string;            // Token
  prod: string;           // Product
  exSeg: string;          // Exchange Segment
  mult: string;           // Multiplier
}

export interface PositionsResponse {
  stat: 'Ok' | 'Not_Ok';
  data: Position[];
}

export interface Limits {
  cashmrg: string;        // Cash Margin
  collatrl: string;       // Collateral
  credlmt: string;        // Credit Limit
  grospnl: string;        // Gross P&L
  csh: string;            // Cash
  nfoSpnMrg: string;      // NFO Span Margin
  ctegry: string;         // Category
  lmtUtlzd: string;       // Limit Utilized
  ntCsh: string;          // Net Cash
  stat: string;           // Status
  mtm: string;            // Mark to Market
  ntPnl: string;          // Net P&L
  totAvlbl: string;       // Total Available
  rlsblMrg: string;       // Releasable Margin
  payoutAmt: string;      // Payout Amount
  nfoExpMrg: string;      // NFO Exposure Margin
  premim: string;         // Premium
  expMrg: string;         // Exposure Margin
  varelmn: string;        // Value at Risk Element
  seg: string;            // Segment
}

export interface LimitsResponse {
  stat: 'Ok' | 'Not_Ok';
  data: Limits[];
}

// ==================== Helper Types ====================
export interface NeoError {
  stat: 'Not_Ok';
  errMsg: string;
  stCode: number;
}

export interface ScripMasterItem {
  pSymbol: string;
  pTrdSymbol: string;
  pGroup: string;
  pExchSeg: string;
  pInstType: string;
  pEToken: string;
  pSymbolName: string;
  pCompanyName: string;
  pExpiryDate?: string;
  pStrikePrice?: string;
  pOptionType?: string;
  pPriceTick: string;
  pLotSize: string;
  pFreezeQty: string;
}

export interface ScripMasterResponse {
  stat: 'Ok' | 'Not_Ok';
  data: ScripMasterItem[];
}
```

### Phase 5: Integration Plan

#### 5.1 Backend Service Architecture
```
backend/
├── services/
│   ├── kotak_neo_service.py     # Core API wrapper
│   ├── market_data_service.py   # Market data endpoints
│   ├── trading_service.py       # Order management
│   └── portfolio_service.py     # Holdings & positions
├── models/
│   ├── order.py                 # Order models
│   ├── position.py              # Position models
│   └── holding.py               # Holding models
└── routes/
    ├── market.py                # Market data routes
    ├── trading.py               # Trading routes
    └── portfolio.py             # Portfolio routes
```

#### 5.2 Security Considerations
1. **Never store credentials in code**
2. **Use environment variables**
3. **Encrypt sensitive data**
4. **Implement session timeout**
5. **Log all trading activities**
6. **Add rate limiting**
7. **Validate all inputs**

### Phase 6: Testing Strategy

#### 6.1 Sandbox Testing
1. Use UAT environment first
2. Test with minimal quantities
3. Validate all response structures
4. Document edge cases
5. Test error scenarios

#### 6.2 Order Testing Checklist
- [ ] Place market order (1 qty)
- [ ] Place limit order
- [ ] Modify order
- [ ] Cancel order
- [ ] Test order rejection
- [ ] Test insufficient funds
- [ ] Test after-market orders

### Phase 7: Documentation Requirements

Create comprehensive documentation for:
1. API response structures (JSON examples)
2. TypeScript type definitions
3. Error handling patterns
4. Rate limiting behavior
5. Session management
6. Order status flow
7. Margin calculation
8. P&L computation

## Implementation Checklist

### Week 2, Day 1-2: Setup & Authentication
- [ ] Install Kotak Neo SDK
- [ ] Set up API credentials (secure storage)
- [ ] Implement login flow
- [ ] Test OTP verification
- [ ] Document session management

### Week 2, Day 3-4: Market Data Exploration
- [ ] Test quote APIs
- [ ] Explore market depth
- [ ] Download scrip master
- [ ] Test index data
- [ ] Create type definitions

### Week 2, Day 5-7: Trading & Portfolio
- [ ] Test order placement (sandbox)
- [ ] Explore order book
- [ ] Test positions API
- [ ] Test holdings API
- [ ] Document all responses

### Week 3: Integration
- [ ] Create Python backend services
- [ ] Build FastAPI routes
- [ ] Implement caching
- [ ] Add error handling
- [ ] Write unit tests

## Next Steps

1. **Register for Kotak Neo API**
   - Visit: https://neotradeapi.kotaksecurities.com/
   - Create developer account
   - Get Consumer Key & Secret

2. **Set Up Development Environment**
   ```bash
   # Create Python virtual environment
   python -m venv kotak-neo-env
   source kotak-neo-env/bin/activate  # On Windows: kotak-neo-env\Scripts\activate
   
   # Install dependencies
   pip install neo_api_client python-dotenv fastapi
   ```

3. **Create Exploration Script**
   - Similar to NSE exploration
   - Systematic endpoint testing
   - JSON response capture
   - Type definition generation

4. **Run Controlled Tests**
   - Start with read-only APIs (quotes, holdings)
   - Progress to order APIs (sandbox only)
   - Document all findings

## Safety Guidelines

⚠️ **IMPORTANT SAFETY RULES**:
1. NEVER place real orders during testing
2. Always use sandbox/UAT environment first
3. Start with 1 quantity orders
4. Double-check transaction_type ('B' vs 'S')
5. Validate all parameters before submission
6. Implement confirmation dialogs in UI
7. Log all trading activities
8. Set up alerts for unusual activity

## Resources

- **Kotak Neo API Docs**: https://neotradeapi.kotaksecurities.com/
- **Python SDK**: https://github.com/KotakSecuritiesLtd/neo-api-client-python
- **Support**: Contact Kotak Neo API support team
- **Community**: Developer forums (if available)

---

**Status**: 📋 Planning Phase  
**Next Action**: Register for Kotak Neo API access  
**Timeline**: Week 2 (Backend Development Phase)