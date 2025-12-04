# NEORA FastAPI Backend

Real-time stock market data platform powered by Kotak Neo API v2.

## 🚀 Features

- ✅ **Real-time Stock Quotes** - Get live market data for stocks
- ✅ **Stock Search** - Search stocks across NSE, BSE, MCX
- ✅ **Market Indices** - Track NIFTY 50, SENSEX, BANK NIFTY
- ✅ **WebSocket Support** - Real-time price updates
- ✅ **OHLC Data** - Open, High, Low, Close data
- ✅ **Market Depth** - Bid/Ask prices and quantities
- ✅ **Scrip Master** - Complete instrument database
- ✅ **Swagger UI** - Interactive API documentation

## 📋 Prerequisites

- Python 3.10 or higher
- Kotak Neo trading account
- TOTP authenticator app configured

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   # Copy example env file
   copy .env.example .env
   
   # Edit .env and add your Kotak Neo credentials
   ```

5. **Run the server**
   ```bash
   python main.py
   ```

Server will start at: `http://localhost:8000`

## 📚 API Documentation

Once the server is running, access:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json

## 🔌 WebSocket

Connect to WebSocket for real-time market data:

```
ws://localhost:8000/api/v1/ws/market-feed
```

### WebSocket Message Format

**Subscribe to instruments:**
```json
{
  "action": "subscribe",
  "instruments": [
    {"instrument_token": "11536", "exchange_segment": "nse_cm"}
  ],
  "is_index": false,
  "is_depth": false
}
```

**Unsubscribe:**
```json
{
  "action": "unsubscribe",
  "instruments": [
    {"instrument_token": "11536", "exchange_segment": "nse_cm"}
  ]
}
```

## 🔑 Authentication

### Step 1: TOTP Login
```bash
POST /api/v1/auth/totp-login
{
  "mobile_number": "+919876543210",
  "ucc": "YOUR_UCC",
  "totp": "123456"
}
```

### Step 2: TOTP Validate
```bash
POST /api/v1/auth/totp-validate
{
  "mpin": "123456"
}
```

## 📊 Market Data Endpoints

### Get Real-time Quotes
```bash
POST /api/v1/market/quotes
{
  "instruments": [
    {"instrument_token": "11536", "exchange_segment": "nse_cm"}
  ],
  "quote_type": "all"
}
```

### Search Stocks
```bash
POST /api/v1/market/search
{
  "exchange_segment": "nse_cm",
  "symbol": "RELIANCE"
}
```

### Get Market Indices
```bash
GET /api/v1/market/indices
```

### Get OHLC Data
```bash
GET /api/v1/market/ohlc/{exchange_segment}/{instrument_token}
```

### Get Market Depth
```bash
GET /api/v1/market/depth/{exchange_segment}/{instrument_token}
```

### Get Scrip Master
```bash
GET /api/v1/market/scrip-master?exchange_segment=nse_cm
```

## 🏢 Exchange Segments

| Code | Description |
|------|-------------|
| `nse_cm` | NSE Cash Market |
| `bse_cm` | BSE Cash Market |
| `nse_fo` | NSE Futures & Options |
| `bse_fo` | BSE Futures & Options |
| `mcx_fo` | MCX Futures & Options |
| `cde_fo` | Currency Derivatives |

## 🎯 Quote Types

| Type | Description |
|------|-------------|
| `all` | Complete quote data (default) |
| `ltp` | Last traded price only |
| `ohlc` | Open, High, Low, Close |
| `depth` | Market depth (bid/ask) |
| `52w` | 52-week high/low |
| `circuit_limits` | Circuit limit information |
| `scrip_details` | Scrip details |

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env                   # Environment configuration
├── .env.example          # Example environment file
│
└── app/
    ├── core/             # Core configuration
    │   ├── config.py    # Settings
    │   └── exceptions.py # Custom exceptions
    │
    ├── models/           # Pydantic models
    │   ├── auth.py      # Auth models
    │   └── market.py    # Market data models
    │
    ├── services/         # Business logic
    │   ├── neo_client.py      # Kotak Neo API wrapper
    │   └── market_service.py  # Market data service
    │
    └── api/v1/          # API routes
        ├── auth.py      # Auth endpoints
        ├── market.py    # Market endpoints
        ├── websocket.py # WebSocket endpoint
        └── router.py    # Main router
```

## 🔧 Configuration

Edit `.env` file:

```env
# Environment
ENVIRONMENT=uat  # or prod
DEBUG=true

# Kotak Neo API
NEO_CONSUMER_KEY=your_consumer_key
NEO_FIN_KEY=neotradeapi

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Server
HOST=0.0.0.0
PORT=8000
```

## 🧪 Testing with Swagger UI

1. Start the server: `python main.py`
2. Open browser: http://localhost:8000/api/docs
3. Try the endpoints interactively
4. No authentication required for market quotes

## 📝 Example Usage

### Python Client
```python
import httpx
import asyncio

async def get_stock_quote():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/market/quotes",
            json={
                "instruments": [
                    {"instrument_token": "11536", "exchange_segment": "nse_cm"}
                ],
                "quote_type": "all"
            }
        )
        print(response.json())

asyncio.run(get_stock_quote())
```

### JavaScript/TypeScript
```typescript
// Fetch quotes
const response = await fetch('http://localhost:8000/api/v1/market/quotes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    instruments: [
      { instrument_token: "11536", exchange_segment: "nse_cm" }
    ],
    quote_type: "all"
  })
});
const data = await response.json();
```

### WebSocket Client
```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/market-feed');

ws.onopen = () => {
  ws.send(JSON.stringify({
    action: 'subscribe',
    instruments: [
      { instrument_token: '11536', exchange_segment: 'nse_cm' }
    ]
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Market data:', data);
};
```

## 🚨 Error Handling

All errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

## 📖 Additional Resources

- [Kotak Neo API Documentation](https://github.com/Kotak-Neo/Kotak-neo-api-v2)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)

## 🤝 Support

For issues or questions:
1. Check Swagger UI documentation
2. Review Kotak Neo API documentation
3. Check the logs for detailed error messages

## 📄 License

This project is for educational and trading purposes.

---

**Built with FastAPI** 🚀 **Powered by Kotak Neo API v2** 📈