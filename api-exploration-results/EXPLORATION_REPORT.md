# NSE API Exploration Report

**Generated:** 12/1/2025, 8:12:02 PM

## Summary

- **Total Endpoints Tested:** 20
- **Successful:** 19
- **Failed:** 1

---

## Endpoints

### Market Status

- **Endpoint:** `/api/marketStatus`
- **Description:** Overall market status - pre-open, open, closed
- **Status:** ✅ Success
- **Response Size:** 1869 bytes
- **Data Structure:**
```json
{
  "marketState": "array(5) of [object Object]",
  "marketcap": {
    "timeStamp": "string",
    "marketCapinTRDollars": "number",
    "marketCapinLACCRRupees": "number",
    "marketCapinCRRupees": "number",
    "marketCapinCRRupeesFormatted": "string",
    "marketCapinLACCRRupeesFormatted": "string",
    "underlying": "string"
  },
  "indicativenifty50": {
    "dateTime": "string",
    "indicativeTime": "null",
    "indexName": "string",
    "indexLast": "null",
    "indexPercChange": "null",
    "indexTimeVal": "null",
    "closingValue": "number",
    "finalClosingValue": "number",
    "change": "number",
    "perChange": "number",
    "status": "string"
  },
  "giftnifty": {
    "INSTRUMENTTYPE": "string",
    "SYMBOL": "string",
    "EXPIRYDATE": "string",
    "OPTIONTYPE": "string",
    "STRIKEPRICE": "string",
    "LASTPRICE": "number",
    "DAYCHANGE": "string",
    "PERCHANGE": "string",
    "CONTRACTSTRADED": "number",
    "TIMESTMP": "string",
    "id": "string"
  }
}
```

---

### All Indices

- **Endpoint:** `/api/allIndices`
- **Description:** All NSE indices with current values
- **Status:** ✅ Success
- **Response Size:** 108492 bytes
- **Data Structure:**
```json
{
  "data": "array(133) of [object Object]",
  "timestamp": "string",
  "advances": "number",
  "declines": "number",
  "unchanged": "number",
  "dates": {
    "previousDay": "string",
    "oneWeekAgo": "string",
    "oneMonthAgo": "string",
    "oneYearAgo": "string"
  }
}
```

---

### NIFTY 50 Quote

- **Endpoint:** `/api/equity-stockIndices?index=NIFTY%2050`
- **Description:** Detailed NIFTY 50 index data
- **Status:** ✅ Success
- **Response Size:** 64824 bytes
- **Data Structure:**
```json
{
  "name": "string",
  "advance": {
    "declines": "string",
    "advances": "string",
    "unchanged": "string"
  },
  "timestamp": "string",
  "data": "array(51) of [object Object]",
  "metadata": {
    "indexName": "string",
    "open": "number",
    "high": "number",
    "low": "number",
    "previousClose": "number",
    "last": "number",
    "percChange": "number",
    "change": "number",
    "timeVal": "string",
    "yearHigh": "number",
    "yearLow": "number",
    "indicativeClose": "number",
    "perChange365d": "number",
    "perChange30d": "number",
    "date365dAgo": "string",
    "date30dAgo": "string",
    "chartTodayPath": "string",
    "chart30dPath": "string",
    "chart365dPath": "string",
    "totalTradedVolume": "number"
  },
  "marketStatus": {
    "market": "string",
    "marketStatus": "string",
    "tradeDate": "string",
    "index": "string",
    "last": "number",
    "variation": "number",
    "percentChange": "number",
    "marketStatusMessage": "string"
  }
}
```

---

### BANK NIFTY Quote

- **Endpoint:** `/api/equity-stockIndices?index=NIFTY%20BANK`
- **Description:** Detailed BANK NIFTY index data
- **Status:** ✅ Success
- **Response Size:** 16939 bytes
- **Data Structure:**
```json
{
  "name": "string",
  "advance": {
    "declines": "string",
    "advances": "string",
    "unchanged": "string"
  },
  "timestamp": "string",
  "data": "array(13) of [object Object]",
  "metadata": {
    "indexName": "string",
    "open": "number",
    "high": "number",
    "low": "number",
    "previousClose": "number",
    "last": "number",
    "percChange": "number",
    "change": "number",
    "timeVal": "string",
    "yearHigh": "number",
    "yearLow": "number",
    "indicativeClose": "number",
    "perChange365d": "number",
    "perChange30d": "number",
    "date365dAgo": "string",
    "date30dAgo": "string",
    "chartTodayPath": "string",
    "chart30dPath": "string",
    "chart365dPath": "string",
    "totalTradedVolume": "number"
  },
  "marketStatus": {
    "market": "string",
    "marketStatus": "string",
    "tradeDate": "string",
    "index": "string",
    "last": "number",
    "variation": "number",
    "percentChange": "number",
    "marketStatusMessage": "string"
  }
}
```

---

### Stock Quote Reliance

- **Endpoint:** `/api/quote-equity?symbol=RELIANCE`
- **Description:** Detailed stock quote for Reliance Industries
- **Status:** ✅ Success
- **Response Size:** 3221 bytes
- **Data Structure:**
```json
{
  "info": {
    "symbol": "string",
    "companyName": "string",
    "industry": "string",
    "activeSeries": "array(2) of string",
    "debtSeries": "array(empty)",
    "isFNOSec": "boolean",
    "isCASec": "boolean",
    "isSLBSec": "boolean",
    "isDebtSec": "boolean",
    "isSuspended": "boolean",
    "tempSuspendedSeries": "array(empty)",
    "isETFSec": "boolean",
    "isDelisted": "boolean",
    "isin": "string",
    "slb_isin": "string",
    "listingDate": "string",
    "isMunicipalBond": "boolean",
    "isHybridSymbol": "boolean",
    "segment": "string",
    "isTop10": "boolean"
  },
  "metadata": {
    "series": "string",
    "symbol": "string",
    "isin": "string",
    "status": "string",
    "listingDate": "string",
    "industry": "string",
    "lastUpdateTime": "string",
    "pdSectorPe": "number",
    "pdSymbolPe": "number",
    "pdSectorInd": "string",
    "pdSectorIndAll": "array(32) of string"
  },
  "securityInfo": {
    "boardStatus": "string",
    "tradingStatus": "string",
    "tradingSegment": "string",
    "sessionNo": "string",
    "slb": "string",
    "classOfShare": "string",
    "derivatives": "string",
    "surveillance": {
      "surv": "null",
      "desc": "null"
    },
    "faceValue": "number",
    "issuedSize": "number"
  },
  "sddDetails": {
    "SDDAuditor": "string",
    "SDDStatus": "string"
  },
  "currentMarketType": "string",
  "priceInfo": {
    "lastPrice": "number",
    "change": "number",
    "pChange": "number",
    "previousClose": "number",
    "open": "number",
    "close": "number",
    "vwap": "number",
    "stockIndClosePrice": "number",
    "lowerCP": "string",
    "upperCP": "string",
    "pPriceBand": "string",
    "basePrice": "number",
    "intraDayHighLow": {
      "min": "number",
      "max": "number",
      "value": "number"
    },
    "weekHighLow": {
      "min": "number",
      "minDate": "string",
      "max": "number",
      "maxDate": "string",
      "value": "number"
    },
    "iNavValue": "null",
    "checkINAV": "boolean",
    "tickSize": "number",
    "ieq": "string"
  },
  "industryInfo": {
    "macro": "string",
    "sector": "string",
    "industry": "string",
    "basicIndustry": "string"
  },
  "preOpenMarket": {
    "preopen": "array(10) of [object Object]",
    "ato": {
      "buy": "number",
      "sell": "number"
    },
    "IEP": "number",
    "totalTradedVolume": "number",
    "finalPrice": "number",
    "finalQuantity": "number",
    "lastUpdateTime": "string",
    "totalBuyQuantity": "number",
    "totalSellQuantity": "number",
    "atoBuyQty": "number",
    "atoSellQty": "number",
    "Change": "number",
    "perChange": "number",
    "prevClose": "number"
  }
}
```

---

### Stock Quote TCS

- **Endpoint:** `/api/quote-equity?symbol=TCS`
- **Description:** Detailed stock quote for TCS
- **Status:** ✅ Success
- **Response Size:** 3497 bytes
- **Data Structure:**
```json
{
  "info": {
    "symbol": "string",
    "companyName": "string",
    "industry": "string",
    "activeSeries": "array(2) of string",
    "debtSeries": "array(empty)",
    "isFNOSec": "boolean",
    "isCASec": "boolean",
    "isSLBSec": "boolean",
    "isDebtSec": "boolean",
    "isSuspended": "boolean",
    "tempSuspendedSeries": "array(empty)",
    "isETFSec": "boolean",
    "isDelisted": "boolean",
    "isin": "string",
    "slb_isin": "string",
    "listingDate": "string",
    "isMunicipalBond": "boolean",
    "isHybridSymbol": "boolean",
    "segment": "string",
    "isTop10": "boolean"
  },
  "metadata": {
    "series": "string",
    "symbol": "string",
    "isin": "string",
    "status": "string",
    "listingDate": "string",
    "industry": "string",
    "lastUpdateTime": "string",
    "pdSectorPe": "number",
    "pdSymbolPe": "number",
    "pdSectorInd": "string",
    "pdSectorIndAll": "array(40) of string"
  },
  "securityInfo": {
    "boardStatus": "string",
    "tradingStatus": "string",
    "tradingSegment": "string",
    "sessionNo": "string",
    "slb": "string",
    "classOfShare": "string",
    "derivatives": "string",
    "surveillance": {
      "surv": "null",
      "desc": "null"
    },
    "faceValue": "number",
    "issuedSize": "number"
  },
  "sddDetails": {
    "SDDAuditor": "string",
    "SDDStatus": "string"
  },
  "currentMarketType": "string",
  "priceInfo": {
    "lastPrice": "number",
    "change": "number",
    "pChange": "number",
    "previousClose": "number",
    "open": "number",
    "close": "number",
    "vwap": "number",
    "stockIndClosePrice": "number",
    "lowerCP": "string",
    "upperCP": "string",
    "pPriceBand": "string",
    "basePrice": "number",
    "intraDayHighLow": {
      "min": "number",
      "max": "number",
      "value": "number"
    },
    "weekHighLow": {
      "min": "number",
      "minDate": "string",
      "max": "number",
      "maxDate": "string",
      "value": "number"
    },
    "iNavValue": "null",
    "checkINAV": "boolean",
    "tickSize": "number",
    "ieq": "string"
  },
  "industryInfo": {
    "macro": "string",
    "sector": "string",
    "industry": "string",
    "basicIndustry": "string"
  },
  "preOpenMarket": {
    "preopen": "array(10) of [object Object]",
    "ato": {
      "buy": "number",
      "sell": "number"
    },
    "IEP": "number",
    "totalTradedVolume": "number",
    "finalPrice": "number",
    "finalQuantity": "number",
    "lastUpdateTime": "string",
    "totalBuyQuantity": "number",
    "totalSellQuantity": "number",
    "atoBuyQty": "number",
    "atoSellQty": "number",
    "Change": "number",
    "perChange": "number",
    "prevClose": "number"
  }
}
```

---

### Top Gainers

- **Endpoint:** `/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O`
- **Description:** Top gaining stocks
- **Status:** ✅ Success
- **Response Size:** 250676 bytes
- **Data Structure:**
```json
{
  "name": "string",
  "advance": {
    "advances": "number",
    "declines": "number",
    "unchanged": "number"
  },
  "timestamp": "string",
  "data": "array(208) of [object Object]",
  "metadata": {
    "timeVal": "string",
    "ffmc_sum": "null"
  },
  "marketStatus": {
    "market": "string",
    "marketStatus": "string",
    "tradeDate": "string",
    "index": "string",
    "last": "number",
    "variation": "number",
    "percentChange": "number",
    "marketStatusMessage": "string"
  }
}
```

---

### Live Market

- **Endpoint:** `/api/marketStatus`
- **Description:** Live market status and trading hours
- **Status:** ✅ Success
- **Response Size:** 1869 bytes
- **Data Structure:**
```json
{
  "marketState": "array(5) of [object Object]",
  "marketcap": {
    "timeStamp": "string",
    "marketCapinTRDollars": "number",
    "marketCapinLACCRRupees": "number",
    "marketCapinCRRupees": "number",
    "marketCapinCRRupeesFormatted": "string",
    "marketCapinLACCRRupeesFormatted": "string",
    "underlying": "string"
  },
  "indicativenifty50": {
    "dateTime": "string",
    "indicativeTime": "null",
    "indexName": "string",
    "indexLast": "null",
    "indexPercChange": "null",
    "indexTimeVal": "null",
    "closingValue": "number",
    "finalClosingValue": "number",
    "change": "number",
    "perChange": "number",
    "status": "string"
  },
  "giftnifty": {
    "INSTRUMENTTYPE": "string",
    "SYMBOL": "string",
    "EXPIRYDATE": "string",
    "OPTIONTYPE": "string",
    "STRIKEPRICE": "string",
    "LASTPRICE": "number",
    "DAYCHANGE": "string",
    "PERCHANGE": "string",
    "CONTRACTSTRADED": "number",
    "TIMESTMP": "string",
    "id": "string"
  }
}
```

---

### Pre Open Market

- **Endpoint:** `/api/market-data-pre-open?key=ALL`
- **Description:** Pre-open market data for all securities
- **Status:** ✅ Success
- **Response Size:** 2854221 bytes
- **Data Structure:**
```json
{
  "declines": "number",
  "unchanged": "number",
  "data": "array(2747) of [object Object]",
  "advances": "number",
  "timestamp": "string",
  "totalTradedValue": "number",
  "totalmarketcap": "number",
  "totalTradedVolume": "number"
}
```

---

### FNO Stocks

- **Endpoint:** `/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O`
- **Description:** List of stocks in F&O segment
- **Status:** ✅ Success
- **Response Size:** 250676 bytes
- **Data Structure:**
```json
{
  "name": "string",
  "advance": {
    "advances": "number",
    "declines": "number",
    "unchanged": "number"
  },
  "timestamp": "string",
  "data": "array(208) of [object Object]",
  "metadata": {
    "timeVal": "string",
    "ffmc_sum": "null"
  },
  "marketStatus": {
    "market": "string",
    "marketStatus": "string",
    "tradeDate": "string",
    "index": "string",
    "last": "number",
    "variation": "number",
    "percentChange": "number",
    "marketStatusMessage": "string"
  }
}
```

---

### Holidays

- **Endpoint:** `/api/holiday-master?type=trading`
- **Description:** Trading holidays calendar
- **Status:** ✅ Success
- **Response Size:** 31886 bytes
- **Data Structure:**
```json
{
  "CBM": "array(23) of [object Object]",
  "CD": "array(23) of [object Object]",
  "CM": "array(18) of [object Object]",
  "CMOT": "array(18) of [object Object]",
  "COM": "array(19) of [object Object]",
  "FO": "array(18) of [object Object]",
  "IRD": "array(23) of [object Object]",
  "MF": "array(18) of [object Object]",
  "NDM": "array(23) of [object Object]",
  "NTRP": "array(23) of [object Object]",
  "SLBS": "array(18) of [object Object]"
}
```

---

### Circulars

- **Endpoint:** `/api/circulars`
- **Description:** Latest NSE circulars and announcements
- **Status:** ✅ Success
- **Response Size:** 72656 bytes
- **Data Structure:**
```json
{
  "data": "array(164) of [object Object]",
  "fromDate": "string",
  "toDate": "string"
}
```

---

### Corporate Actions

- **Endpoint:** `/api/corporates-corporateActions?index=equities`
- **Description:** Corporate actions like dividends, splits, bonuses
- **Status:** ✅ Success
- **Response Size:** 4813 bytes
- **Data Structure:**
```json
[
  {
    "symbol": "string",
    "series": "string",
    "ind": "string",
    "faceVal": "string",
    "subject": "string",
    "exDate": "string",
    "recDate": "string",
    "bcStartDate": "string",
    "bcEndDate": "string",
    "ndStartDate": "string",
    "comp": "string",
    "isin": "string",
    "ndEndDate": "string",
    "caBroadcastDate": "null"
  }
]
```

---

### IPO List

- **Endpoint:** `/api/ipo-detail`
- **Description:** Current and upcoming IPO details
- **Status:** ✅ Success
- **Response Size:** 16 bytes
- **Data Structure:**
```json
"string"
```

---

### Block Deals

- **Endpoint:** `/api/block-deal`
- **Description:** Block deals on NSE
- **Status:** ✅ Success
- **Response Size:** 735 bytes
- **Data Structure:**
```json
{
  "timestamp": "string",
  "data": "array(1) of [object Object]",
  "totalTradedValue": "number",
  "totalTradedVolume": "number",
  "Session 2": {
    "advances": "number",
    "declines": "number",
    "unchanged": "number"
  },
  "Session 1": {
    "advances": "number",
    "declines": "number",
    "unchanged": "number"
  },
  "marketStatus": {
    "market": "string",
    "marketStatus": "string",
    "tradeDate": "string",
    "index": "string",
    "last": "number",
    "variation": "number",
    "percentChange": "number",
    "marketStatusMessage": "string"
  }
}
```

---

### Bulk Deals

- **Endpoint:** `/api/equity-bulk`
- **Description:** Bulk deals on NSE
- **Status:** ❌ Failed
- **Error:** Request failed with status code 404

---

### Market Turnover

- **Endpoint:** `/api/market-turnover`
- **Description:** Market turnover statistics
- **Status:** ✅ Success
- **Response Size:** 2 bytes
- **Data Structure:**
```json
"string"
```

---

### Search

- **Endpoint:** `/api/search/autocomplete?q=reli`
- **Description:** Stock search autocomplete
- **Status:** ✅ Success
- **Response Size:** 25773 bytes
- **Data Structure:**
```json
{
  "symbols": "array(20) of [object Object]",
  "mfsymbols": "array(empty)",
  "search_content": "array(50) of [object Object]",
  "sitemap": "array(empty)"
}
```

---

### NIFTY 50 Stocks

- **Endpoint:** `/api/equity-stockIndices?index=NIFTY%2050`
- **Description:** List of all stocks in NIFTY 50
- **Status:** ✅ Success
- **Response Size:** 64824 bytes
- **Data Structure:**
```json
{
  "name": "string",
  "advance": {
    "declines": "string",
    "advances": "string",
    "unchanged": "string"
  },
  "timestamp": "string",
  "data": "array(51) of [object Object]",
  "metadata": {
    "indexName": "string",
    "open": "number",
    "high": "number",
    "low": "number",
    "previousClose": "number",
    "last": "number",
    "percChange": "number",
    "change": "number",
    "timeVal": "string",
    "yearHigh": "number",
    "yearLow": "number",
    "indicativeClose": "number",
    "perChange365d": "number",
    "perChange30d": "number",
    "date365dAgo": "string",
    "date30dAgo": "string",
    "chartTodayPath": "string",
    "chart30dPath": "string",
    "chart365dPath": "string",
    "totalTradedVolume": "number"
  },
  "marketStatus": {
    "market": "string",
    "marketStatus": "string",
    "tradeDate": "string",
    "index": "string",
    "last": "number",
    "variation": "number",
    "percentChange": "number",
    "marketStatusMessage": "string"
  }
}
```

---

### Advance Decline

- **Endpoint:** `/api/chart-databyindex?index=NIFTY%2050&indices=true`
- **Description:** Advance decline ratio
- **Status:** ✅ Success
- **Response Size:** 62 bytes
- **Data Structure:**
```json
{
  "identifier": "null",
  "name": "null",
  "grapthData": "array(empty)",
  "closePrice": "number"
}
```

---

