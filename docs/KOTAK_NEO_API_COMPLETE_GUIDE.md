# Kotak Neo Trade API - Complete Implementation Guide

**Based on Official Documentation**: https://www.kotaksecurities.com/investing-guide/trading-account/kotak-neo-trade-api-guide/

---

## 🎯 Overview

Kotak Neo Trade API is a **zero-brokerage, zero-fee** API that provides:
- Real-time market data and quotes
- Order placement and management
- Portfolio and holdings tracking
- Support for equity and F&O segments
- Multiple order types (CNC, MIS, Cover Orders, Bracket Orders)

**Key Advantage**: FREE - No brokerage, no API fees! Perfect for our MVP.

---

## ✅ What the API Provides

### 1. **Live Market Data & Quotes**
- Real-time price feeds
- Live bid/ask data
- Market depth (order book)
- LTP (Last Traded Price)
- OHLC (Open, High, Low, Close)
- Volume and turnover data

### 2. **Tradable Instruments Master List**
- Downloadable CSV/JSON file
- All NSE/BSE stocks
- ETFs and indices
- F&O contracts
- Updated daily

### 3. **Order Management**
- **Place Orders**:
  - Market orders
  - Limit orders
  - Stop-loss orders
  - Stop-loss market orders
  - Cover orders
  - Bracket orders
- **Modify Orders**: Change price, quantity, order type
- **Cancel Orders**: Cancel pending orders
- **Order Status**: Check execution status

### 4. **Portfolio & Holdings**
- Current holdings
- Open positions (intraday + delivery)
- Realized P&L
- Unrealized P&L
- Average buy price
- Current market value

### 5. **Margin & Funds**
- Available margin
- Used margin
- Collateral value
- Cash available
- Product-wise margin (CNC/MIS/NRML)

### 6. **Trade Book & Order Book**
- Executed trades history
- Pending orders
- Rejected orders
- Order modifications log

---

## 🔐 Authentication & Setup

### Prerequisites
1. **Kotak Neo Trading Account** (Demat + Trading)
2. **2-Factor Authentication (TOTP)** enabled
3. **API Access Token** from Neo dashboard
4. **Client Code (UCC)** and **MPIN**

### Getting API Credentials

#### Step 1: Create Application
1. Login to Kotak Neo Web/App
2. Go to **Settings** → **API** → **Create Application**
3. Fill application details:
   - Application Name: "NEORA Intelligence"
   - Description: "Stock market intelligence platform"
   - Redirect URI: Your callback URL
4. Submit for approval (usually instant)

#### Step 2: Get Credentials
After approval, you'll receive:
```
Consumer Key: XXXXXXXXXXXXXXXXXXXX
Consumer Secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### Step 3: Enable API Access
1. Go to **Profile** → **API Settings**
2. Enable "Trade API Access"
3. Set TOTP (Google Authenticator/Authy)
4. Note your **Client Code (UCC)**

### Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. Login with credentials
       ▼
┌─────────────────────┐
│  Neo Auth Server    │
└──────┬──────────────┘
       │ 2. Generate Session Token
       ▼
┌─────────────────────┐
│   Access Token      │ (Valid for 24 hours)
└──────┬──────────────┘
       │ 3. Use for API calls
       ▼
┌─────────────────────┐
│   API Endpoints     │
└─────────────────────┘
```

---

## 📚 API Endpoints Reference

### Base URL
```
Production: https://gw-napi.kotaksecurities.com
```

### 1. Authentication

#### Login
```http
POST /login
Content-Type: application/json

{
  "userId": "CLIENT_CODE",
  "password": "PASSWORD",
  "mpin": "MPIN"
}

Response:
{
  "data": {
    "token": "ACCESS_TOKEN",
    "sid": "SESSION_ID"
  },
  "status": "success"
}
```

#### Validate Session
```http
GET /session/validate
Authorization: Bearer ACCESS_TOKEN
```

### 2. Market Data

#### Get Quote (Single Stock)
```http
GET /quotes
Authorization: Bearer ACCESS_TOKEN

Params:
  - instrumentToken: "NSE:RELIANCE"
  - isIndex: false

Response:
{
  "data": {
    "symbol": "RELIANCE",
    "ltp": 2456.75,
    "open": 2450.00,
    "high": 2465.30,
    "low": 2445.50,
    "close": 2460.00,
    "volume": 1234567,
    "change": -3.25,
    "pChange": -0.13,
    "bidPrice": 2456.50,
    "askPrice": 2456.80,
    "bidQty": 500,
    "askQty": 750
  }
}
```

#### Get Multiple Quotes (Bulk)
```http
POST /quotes/bulk
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json

{
  "instruments": [
    "NSE:RELIANCE",
    "NSE:TCS",
    "NSE:INFY",
    "NSE:HDFCBANK"
  ]
}

Response:
{
  "data": [
    { "symbol": "RELIANCE", "ltp": 2456.75, ... },
    { "symbol": "TCS", "ltp": 3245.60, ... },
    ...
  ]
}
```

#### Market Depth (Order Book)
```http
GET /marketdepth
Authorization: Bearer ACCESS_TOKEN

Params:
  - instrumentToken: "NSE:RELIANCE"

Response:
{
  "data": {
    "bids": [
      { "price": 2456.50, "quantity": 500, "orders": 5 },
      { "price": 2456.25, "quantity": 750, "orders": 8 },
      ...
    ],
    "asks": [
      { "price": 2456.75, "quantity": 600, "orders": 6 },
      { "price": 2457.00, "quantity": 800, "orders": 7 },
      ...
    ]
  }
}
```

#### Search Instruments
```http
GET /search
Authorization: Bearer ACCESS_TOKEN

Params:
  - query: "RELIANCE"
  - exchange: "NSE" (optional)

Response:
{
  "data": [
    {
      "instrumentToken": "NSE:RELIANCE",
      "symbol": "RELIANCE",
      "name": "Reliance Industries Ltd",
      "exchange": "NSE",
      "segment": "EQ",
      "lotSize": 1
    }
  ]
}
```

#### Download Instrument Master
```http
GET /instruments
Authorization: Bearer ACCESS_TOKEN

Params:
  - exchange: "NSE" or "BSE" or "ALL"

Response: CSV file
instrumentToken,symbol,name,exchange,segment,lotSize,tickSize
NSE:RELIANCE,RELIANCE,Reliance Industries Ltd,NSE,EQ,1,0.05
...
```

### 3. Order Management

#### Place Order
```http
POST /orders
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json

{
  "instrumentToken": "NSE:RELIANCE",
  "transactionType": "BUY",
  "quantity": 10,
  "price": 2450.00,
  "product": "CNC",  // CNC, MIS, NRML
  "validity": "DAY",  // DAY, IOC
  "variety": "REGULAR",  // REGULAR, BO, CO
  "disclosedQuantity": 0,
  "triggerPrice": 0,
  "isAMO": false
}

Response:
{
  "data": {
    "orderId": "240601000123456",
    "status": "PENDING"
  },
  "status": "success"
}
```

#### Modify Order
```http
PUT /orders/:orderId
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json

{
  "quantity": 15,
  "price": 2455.00,
  "triggerPrice": 0
}
```

#### Cancel Order
```http
DELETE /orders/:orderId
Authorization: Bearer ACCESS_TOKEN
```

#### Get Order Book
```http
GET /orders
Authorization: Bearer ACCESS_TOKEN

Response:
{
  "data": [
    {
      "orderId": "240601000123456",
      "symbol": "RELIANCE",
      "transactionType": "BUY",
      "quantity": 10,
      "price": 2450.00,
      "status": "COMPLETE",
      "filledQuantity": 10,
      "averagePrice": 2449.75,
      "orderTime": "2024-06-01T09:15:30Z"
    }
  ]
}
```

#### Get Trade Book
```http
GET /trades
Authorization: Bearer ACCESS_TOKEN

Response:
{
  "data": [
    {
      "tradeId": "240601001",
      "orderId": "240601000123456",
      "symbol": "RELIANCE",
      "transactionType": "BUY",
      "quantity": 10,
      "price": 2449.75,
      "tradeTime": "2024-06-01T09:16:05Z"
    }
  ]
}
```

### 4. Portfolio & Holdings

#### Get Holdings
```http
GET /portfolio/holdings
Authorization: Bearer ACCESS_TOKEN

Response:
{
  "data": [
    {
      "symbol": "RELIANCE",
      "exchange": "NSE",
      "quantity": 50,
      "averagePrice": 2400.00,
      "lastPrice": 2456.75,
      "pnl": 2837.50,
      "pnlPercentage": 2.37,
      "product": "CNC"
    }
  ]
}
```

#### Get Positions (Open)
```http
GET /portfolio/positions
Authorization: Bearer ACCESS_TOKEN

Response:
{
  "data": {
    "day": [  // Intraday positions
      {
        "symbol": "TCS",
        "quantity": 5,
        "buyQuantity": 5,
        "sellQuantity": 0,
        "averagePrice": 3240.00,
        "lastPrice": 3245.60,
        "pnl": 28.00,
        "product": "MIS"
      }
    ],
    "net": [  // Net positions
      ...
    ]
  }
}
```

### 5. Funds & Margin

#### Get Margins
```http
GET /margins
Authorization: Bearer ACCESS_TOKEN

Response:
{
  "data": {
    "equity": {
      "available": 125000.50,
      "used": 24500.00,
      "collateral": 50000.00
    },
    "commodity": {
      "available": 0,
      "used": 0
    }
  }
}
```

---

## 🐍 Python SDK Implementation

### Installation
```bash
pip install neo-api-client
```

### Basic Usage
```python
from neo_api_client import NeoAPI

# Initialize client
client = NeoAPI(
    consumer_key="YOUR_CONSUMER_KEY",
    consumer_secret="YOUR_CONSUMER_SECRET",
    environment="prod"  # or "uat" for testing
)

# Login
client.login(
    mobilenumber="+919876543210",
    password="YOUR_PASSWORD"
)

# Session login with OTP
client.session_2fa(OTP="123456")

# Get quote
quote = client.quotes(
    instrument_tokens=["NSE:RELIANCE"],
    isIndex=False
)
print(quote)

# Place order
order = client.place_order(
    instrument_token="NSE:RELIANCE",
    exchange_segment="nse_cm",
    product="CNC",
    price="2450",
    order_type="L",
    quantity="10",
    validity="DAY",
    trading_symbol="RELIANCE-EQ",
    transaction_type="B"
)
print(f"Order placed: {order['nOrdNo']}")

# Get holdings
holdings = client.holdings()
for holding in holdings['data']:
    print(f"{holding['tSym']}: {holding['netQty']} @ ₹{holding['avgPrice']}")

# Get positions
positions = client.positions()
print(positions)

# Cancel order
client.cancel_order(order_id="240601000123456")
```

### Advanced: WebSocket for Live Data
```python
from neo_api_client import NeoAPI

client = NeoAPI(
    consumer_key="YOUR_CONSUMER_KEY",
    consumer_secret="YOUR_CONSUMER_SECRET",
    environment="prod"
)

# Login
client.login(mobilenumber="+919876543210", password="YOUR_PASSWORD")
client.session_2fa(OTP="123456")

# Subscribe to live quotes
def on_message(message):
    print(f"Live update: {message}")

def on_error(error):
    print(f"Error: {error}")

# Connect WebSocket
client.subscribe_to_orderfeed()
client.on_message = on_message
client.on_error = on_error

# Subscribe to instruments
instruments = [
    {"exchangeSegment": 1, "token": "2885"},  # RELIANCE
    {"exchangeSegment": 1, "token": "11536"}  # TCS
]
client.subscribe(instruments, isIndex=False, isDepth=False)

# Keep connection alive
import time
while True:
    time.sleep(1)
```

---

## 🏗️ FastAPI Backend Integration

### Kotak Client Wrapper
```python
# app/market/kotak_client.py
from neo_api_client import NeoAPI
from typing import Optional, List, Dict
import os
from dotenv import load_dotenv

load_dotenv()

class KotakNeoClient:
    def __init__(self):
        self.client = NeoAPI(
            consumer_key=os.getenv("KOTAK_CONSUMER_KEY"),
            consumer_secret=os.getenv("KOTAK_CONSUMER_SECRET"),
            environment="prod"
        )
        self.is_authenticated = False
    
    async def authenticate(self, mobile: str, password: str, otp: str = None):
        """Authenticate with Kotak Neo"""
        try:
            # Initial login
            login_response = self.client.login(
                mobilenumber=mobile,
                password=password
            )
            
            if otp:
                # Complete 2FA
                self.client.session_2fa(OTP=otp)
                self.is_authenticated = True
                return {"status": "success", "message": "Authenticated"}
            else:
                return {"status": "otp_required", "message": "OTP sent to mobile"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def get_quote(self, symbol: str, exchange: str = "NSE") -> Dict:
        """Get single stock quote"""
        if not self.is_authenticated:
            raise Exception("Not authenticated")
        
        instrument_token = f"{exchange}:{symbol}"
        response = self.client.quotes(
            instrument_tokens=[instrument_token],
            isIndex=False
        )
        return response['data'][0] if response.get('data') else {}
    
    async def get_quotes_bulk(self, symbols: List[str], exchange: str = "NSE") -> List[Dict]:
        """Get multiple quotes"""
        if not self.is_authenticated:
            raise Exception("Not authenticated")
        
        instrument_tokens = [f"{exchange}:{symbol}" for symbol in symbols]
        response = self.client.quotes(
            instrument_tokens=instrument_tokens,
            isIndex=False
        )
        return response.get('data', [])
    
    async def search_stocks(self, query: str) -> List[Dict]:
        """Search for stocks"""
        # Note: Neo API doesn't have direct search endpoint
        # You'll need to download master list and search locally
        # or use NSE/BSE search APIs
        pass
    
    async def get_holdings(self) -> List[Dict]:
        """Get user holdings"""
        if not self.is_authenticated:
            raise Exception("Not authenticated")
        
        response = self.client.holdings()
        return response.get('data', [])
    
    async def get_positions(self) -> Dict:
        """Get open positions"""
        if not self.is_authenticated:
            raise Exception("Not authenticated")
        
        response = self.client.positions()
        return response.get('data', {})
    
    async def place_order(
        self,
        symbol: str,
        exchange: str,
        transaction_type: str,
        quantity: int,
        price: float,
        product: str = "CNC"
    ) -> Dict:
        """Place order"""
        if not self.is_authenticated:
            raise Exception("Not authenticated")
        
        response = self.client.place_order(
            instrument_token=f"{exchange}:{symbol}",
            exchange_segment="nse_cm" if exchange == "NSE" else "bse_cm",
            product=product,
            price=str(price),
            order_type="L",  # Limit order
            quantity=str(quantity),
            validity="DAY",
            trading_symbol=f"{symbol}-EQ",
            transaction_type="B" if transaction_type == "BUY" else "S"
        )
        return response
    
    async def cancel_order(self, order_id: str) -> Dict:
        """Cancel order"""
        if not self.is_authenticated:
            raise Exception("Not authenticated")
        
        response = self.client.cancel_order(order_id=order_id)
        return response
```

### FastAPI Endpoints
```python
# app/market/router.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from .kotak_client import KotakNeoClient
from .schemas import QuoteRequest, OrderRequest

router = APIRouter(prefix="/api/market", tags=["market"])
kotak_client = KotakNeoClient()

@router.post("/auth")
async def authenticate(mobile: str, password: str, otp: str = None):
    """Authenticate with Kotak Neo"""
    result = await kotak_client.authenticate(mobile, password, otp)
    return result

@router.get("/quote/{symbol}")
async def get_quote(symbol: str, exchange: str = "NSE"):
    """Get stock quote"""
    try:
        quote = await kotak_client.get_quote(symbol, exchange)
        return {"data": quote, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quotes/bulk")
async def get_quotes_bulk(symbols: List[str], exchange: str = "NSE"):
    """Get multiple quotes"""
    try:
        quotes = await kotak_client.get_quotes_bulk(symbols, exchange)
        return {"data": quotes, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/holdings")
async def get_holdings():
    """Get user holdings"""
    try:
        holdings = await kotak_client.get_holdings()
        return {"data": holdings, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/order")
async def place_order(order: OrderRequest):
    """Place order"""
    try:
        result = await kotak_client.place_order(
            symbol=order.symbol,
            exchange=order.exchange,
            transaction_type=order.transaction_type,
            quantity=order.quantity,
            price=order.price,
            product=order.product
        )
        return {"data": result, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 🔄 Data Flow Architecture

```
┌──────────────────┐
│  React Frontend  │
│  (NEORA UI)      │
└────────┬─────────┘
         │ HTTPS
         ▼
┌──────────────────┐
│  FastAPI Backend │
│  (Your Server)   │
└────────┬─────────┘
         │ API Calls
         ▼
┌──────────────────┐
│  Kotak Neo API   │
│  (Live Data)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  NSE/BSE         │
│  (Market Data)   │
└──────────────────┘
```

---

## 📊 Rate Limits & Best Practices

### Rate Limits
- **Quotes API**: 10 requests/second (per user)
- **Order Placement**: 10 orders/second
- **WebSocket**: 100 instruments/connection
- **Session**: 24-hour validity

### Best Practices
1. **Cache quotes** for 1-5 seconds to reduce API calls
2. **Use bulk quotes API** instead of multiple single requests
3. **Implement retry logic** with exponential backoff
4. **Use WebSocket** for real-time updates (more efficient than polling)
5. **Store instrument master** locally (download once per day)
6. **Handle token expiry** gracefully with auto-refresh

### Error Handling
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
async def get_quote_with_retry(symbol: str):
    try:
        return await kotak_client.get_quote(symbol)
    except Exception as e:
        if "token expired" in str(e).lower():
            await kotak_client.authenticate()
            return await kotak_client.get_quote(symbol)
        raise
```

---

## 🎯 Implementation Roadmap for NEORA

### Phase 1: Basic Integration (Week 2)
- [ ] Setup Neo SDK
- [ ] Implement authentication
- [ ] Get live quotes API
- [ ] Test with 5-10 stocks
- [ ] Cache quotes in Redis

### Phase 2: Portfolio Sync (Week 3)
- [ ] Fetch holdings from Kotak
- [ ] Sync with local database
- [ ] Calculate P&L
- [ ] Display in dashboard

### Phase 3: Real-time Updates (Week 3)
- [ ] WebSocket integration
- [ ] Live price updates
- [ ] Portfolio value updates
- [ ] Price alerts

### Phase 4: Order Management (Future)
- [ ] Place orders UI
- [ ] Order book display
- [ ] Trade history
- [ ] Position tracking

---

## 🔐 Security Considerations

1. **Never store** user passwords or MPIN
2. **Encrypt** Kotak access tokens in database
3. **Use environment variables** for API credentials
4. **Implement rate limiting** on your backend
5. **Log all order placements** for audit
6. **Require 2FA** for order placement
7. **Validate all inputs** before sending to Kotak API

---

## 📝 Sample .env Configuration

```env
# Kotak Neo API
KOTAK_CONSUMER_KEY=your_consumer_key_here
KOTAK_CONSUMER_SECRET=your_consumer_secret_here
KOTAK_ENVIRONMENT=prod  # or uat for testing

# User credentials (for testing only - remove in production)
KOTAK_TEST_MOBILE=+919876543210
KOTAK_TEST_PASSWORD=test_password
```

---

## 🎉 Advantages for NEORA

1. **Zero Cost**: No API fees or brokerage
2. **Real Data**: Live market data from NSE/BSE
3. **Complete**: Quotes, orders, portfolio, everything
4. **Python SDK**: Easy integration with FastAPI
5. **WebSocket**: Efficient real-time updates
6. **Reliable**: From established broker (Kotak Securities)

---

**Next**: Implement this in Week 2 backend development!