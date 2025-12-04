# 🚀 Quick Start Guide

## Step 1: Install Dependencies

```bash
# Make sure you're in the backend directory
cd backend

# Install all required packages
pip install -r requirements.txt
```

## Step 2: Configure Environment

The `.env` file is already created. If you have Kotak Neo credentials, add them:

```env
NEO_CONSUMER_KEY=your_consumer_key_here
```

## Step 3: Run the Server

```bash
python main.py
```

You should see:
```
============================================================
🚀 NEORA Backend Starting...
============================================================
📝 Environment: uat
🔧 Debug Mode: True
🌐 Base URL: https://nsbxapi-gw.kotaksecurities.com/
📚 API Documentation: http://localhost:8000/api/docs
🔌 WebSocket: ws://localhost:8000/api/v1/ws/market-feed
============================================================
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## Step 4: Test the API

Open your browser and go to:

**http://localhost:8000/api/docs**

This will open the Swagger UI where you can test all endpoints interactively!

## 🎯 Quick Test Without Authentication

Try these endpoints without needing authentication:

### 1. Get Market Indices
```
GET /api/v1/market/indices
```
Click "Try it out" → "Execute"

### 2. Search for a Stock
```
POST /api/v1/market/search
```
Request body:
```json
{
  "exchange_segment": "nse_cm",
  "symbol": "RELIANCE"
}
```

### 3. Get Real-time Quote
```
POST /api/v1/market/quotes
```
Request body:
```json
{
  "instruments": [
    {
      "instrument_token": "11536",
      "exchange_segment": "nse_cm"
    }
  ],
  "quote_type": "all"
}
```

## 🔌 Test WebSocket

You can test WebSocket using any WebSocket client or this simple HTML:

```html
<!DOCTYPE html>
<html>
<body>
<h2>NEORA WebSocket Test</h2>
<div id="output"></div>

<script>
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/market-feed');
const output = document.getElementById('output');

ws.onopen = () => {
  output.innerHTML += '<p>✅ Connected!</p>';
  
  // Subscribe to a stock
  ws.send(JSON.stringify({
    action: 'subscribe',
    instruments: [
      { instrument_token: '11536', exchange_segment: 'nse_cm' }
    ]
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  output.innerHTML += `<p>${JSON.stringify(data, null, 2)}</p>`;
};

ws.onerror = (error) => {
  output.innerHTML += `<p>❌ Error: ${error}</p>`;
};
</script>
</body>
</html>
```

## 🔑 Authentication (Optional)

If you have Kotak Neo credentials and want to test authenticated endpoints:

1. **TOTP Login**
   ```
   POST /api/v1/auth/totp-login
   ```
   Body:
   ```json
   {
     "mobile_number": "+919876543210",
     "ucc": "YOUR_UCC",
     "totp": "123456"
   }
   ```

2. **TOTP Validate**
   ```
   POST /api/v1/auth/totp-validate
   ```
   Body:
   ```json
   {
     "mpin": "123456"
   }
   ```

## 🐛 Troubleshooting

### Module Not Found Error
```bash
pip install -r requirements.txt
```

### Port Already in Use
Change the port in `.env`:
```env
PORT=8001
```

### CORS Issues
Add your frontend URL to `.env`:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## ✅ Success!

If everything is working, you should be able to:
- ✅ Access Swagger UI at http://localhost:8000/api/docs
- ✅ Get market data without authentication
- ✅ Search for stocks
- ✅ Connect via WebSocket

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check the [Swagger UI](http://localhost:8000/api/docs) for all available endpoints
- Test WebSocket connections for real-time data

---

**Happy Trading! 📈**