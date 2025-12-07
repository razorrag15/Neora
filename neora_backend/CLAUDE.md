# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Development Philosophy
### KISS (Keep It Simple, Stupid)
Choose straightforward solutions over complex ones. Simple code is easier to understand, maintain, and debug.

### YAGNI (You Aren't Gonna Need It)
Implement features only when needed, not when you anticipate future use.

### Test-Driven Development (TDD)

1. **Write the test first** - Define expected behavior before implementation
2. **Watch it fail** - Ensure the test actually tests something
3. **Write minimal code** - Just enough to make the test pass
4. **Refactor** - Improve code while keeping tests green
5. **Repeat** - One test at a time

**Test Coding Principles:**
1. Remove redundancy within and across test files
2. Write purposeful tests that match current source code (quality > quantity)
3. Remove trivial tests that provide no value
4. Keep code concise, simple, and time-efficient
5. Use mocks with real sample data when available
6. Document purpose/scenario in docstrings

## 🧱 Code Structure & Modularity

### File and Function Limits
- **Files**: Max 500 lines. Refactor by splitting into modules if approaching limit.
- **Functions**: Max 50 lines with single, clear responsibility (excluding docstrings).
- **Classes**: Max 100 lines representing single concept (excluding docstrings).
- **Modules**: Group by feature or responsibility.
- **Always use venv** for Python commands and tests.

## 📋 Style & Conventions

### Python Style Guide

- **Follow PEP8** with these specific choices:
  - Line length: 100 characters (set by Ruff in pyproject.toml)
  - Use double quotes f\or strings
  - Use trailing commas in multi-line structures
- **Always use type hints** for function signatures and class attributes
- **Use `pydantic` v2** for data validation and settings management

### Docstring Standards

Use Google-style docstrings for all public functions, classes, and modules:

```python
def calculate_discount(
    price: Decimal,
    discount_percent: float,
    min_amount: Decimal = Decimal("0.01")
) -> Decimal:
    """
    Calculate the discounted price for a product.

    Args:
        price: Original price of the product
        discount_percent: Discount percentage (0-100)
        min_amount: Minimum allowed final price

    Returns:
        Final price after applying discount

    Raises:
        ValueError: If discount_percent is not between 0 and 100
        ValueError: If final price would be below min_amount

    Example:
        >>> calculate_discount(Decimal("100"), 20)
        Decimal('80.00')
    """
```

### Naming Conventions

- **Variables and functions**: `snake_case`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private attributes/methods**: `_leading_underscore`
- **Type aliases**: `PascalCase`
- **Enum values**: `UPPER_SNAKE_CASE`


## Project Overview

FastAPI service managing multi-exchange instrument data (NSE, BSE, NASDAQ, NYSE, US) and historical OHLCV data. Integrates Kite Connect API (Indian markets), EODHD API (international markets), and GFDS API (Global Financial Data Service) with TimescaleDB storage.

## Development Commands

### Running the Application

**Development Mode (with auto-reload):**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 4000 --reload
```

**Alternative - Using dev script:**
```bash
python dev.py
```

**With debug logging:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 4000 --reload --log-level debug
```

**Production Mode:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 4000 --workers 4
```

### Installing Dependencies

```bash
pip install -r requirements.txt
```

### API Documentation

- **Interactive Docs:** http://localhost:4000/docs
- **Alternative Docs:** http://localhost:4000/redoc
- **Health Check:** http://localhost:4000/health

### Testing

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test modules
python -m pytest tests/utils/test_historical_data_fetcher_utils.py -v
python -m pytest tests/services/test_historical_data_fetcher_service.py -v
python -m pytest tests/services/test_historical_data_fetcher_datetime_bug.py -v
```

**Note:** Tests use dynamic date generation (not hardcoded dates) for CI/CD reliability across different execution times.

## Architecture Overview

### Clean Architecture Pattern

The codebase follows **clean architecture** with clear separation of concerns:

1. **API Layer** (`app/api/v1/`) - FastAPI route handlers
2. **Service Layer** (`app/services/`) - Business logic
3. **Repository Layer** (`app/repositories/`) - Data access implementations
4. **Models Layer** (`app/models/`) - Pydantic data models
5. **Core Layer** (`app/core/`) - Configuration, database, and dependency injection

### Key Architectural Principles

- **Dependency Injection**: All dependencies are injected via `app/core/dependencies.py` using FastAPI's `Depends()` and `@lru_cache()` for singletons
- **Direct Repository Access**: Services connect directly to repository implementations, following YAGNI principle (interfaces layer removed in v2.3.0)
- **Repository Pattern**: All database operations go through repository classes
- **Connection Pooling**: Database uses `psycopg2.pool.SimpleConnectionPool` (managed in `app/core/database.py`)
- **Composite Key Architecture**: Historical data system uses `(tradingsymbol, exchange)` composite keys instead of instrument_token for multi-exchange support

### Database Architecture

**Five Main Tables:**

1. **`kite_instruments`** - Kite master reference (~122k+ instruments)
   - PK: `(tradingsymbol, exchange)` | Unique: `instrument_token`
   - Contains: token, symbol, exchange, segment, lot_size
   - Docs: `app/docs/KITE_INSTRUMENTS.md`
   - **Note**: Kite API may return duplicates in same batch; deduplication logic keeps last occurrence (latest data)

2. **`eodhd_instruments`** - EODHD master reference
   - PK: `(tradingsymbol, exchange)`
   - Multi-exchange lookup (US, NSE) | Docs: `app/docs/EODHD_INSTRUMENTS.md`

3. **`gfds_instruments`** - GFDS master reference
   - PK: `(tradingsymbol, exchange)`
   - Multi-exchange support (NSE, BSE) | Docs: `app/docs/GFDS_INSTRUMENTS.md`

4. **`trader_tote_instruments`** - User-curated instruments
   - PK: `(tradingsymbol, exchange, source)`
   - Sources: `SCREENER`, `CUSTOM`, `US`, `INDEX`
   - Status: `Active`/`Inactive` (set when data unavailable)
   - UPSERT: Merges totes for duplicates

5. **`instrument_historical_data`** - Time-series OHLCV
   - PK: `id` | Unique: `(tradingsymbol, exchange, time)`
   - Composite key for lookups

**Database Config:** `docker_config.env` (takes precedence over docker-compose.yml)
- Development: `timescaledb:5432/historical_database` (local TimescaleDB container)
- Staging/Production: Configure `DATABASE_HOST` in docker_config.env for external databases (e.g., Neon PostgreSQL)
- Data persistence: `./data/postgresql/` (for local development only)

### Data Flow for Excel Upload

1. **API** receives Excel file + source (SCREENER, CUSTOM, US, or INDEX)
2. **ExcelUploadTTInstruments** processes file:
   - Validates unified column headers (Name, Trading Symbol, Exchange, Tote Name, Exchange Code)
   - Reads sheets (sheet name = tote name)
   - Validates rows against master lists
   - Returns `ExcelProcessingResult`
3. **TTInstrumentRepository** performs UPSERT:
   - PK: `(tradingsymbol, exchange, source)`
   - Merges totes if duplicate, inserts if new
4. **Historical Data Fetcher** (optional endpoint):
   - Validates against master tables
   - Fetches 5 years via Kite/EODHD/GFDS APIs
   - Calculates missing ranges (incremental updates)
   - Marks "Inactive" if no data found
5. Returns response with counts and errors

**GFDS EOD Upload (v2.4.0):**
1. **API** receives multi-sheet Excel file + exchange/segment
2. **GFDSInstrumentService** processes all sheets:
   - Each sheet = one trading date (DD/MM/YYYY format)
   - Validates exchange (NSE/BSE) and segment (STOCK/INDEX)
   - Parses OHLCV data, handles both string and Excel datetime formats
3. **Auto-registration**: Missing instruments added to `gfds_instruments`
4. **InstrumentHistoricalRepository** performs bulk UPSERT:
   - Atomic operation: INSERT new or UPDATE existing on conflict
   - Conflict key: `(tradingsymbol, exchange, time)`
5. Returns aggregated statistics (records, sheets, dates processed)

### API Response Models (v2.4.0)

Typed Pydantic schemas for type-safe API contracts:
- `ExcelUploadApiResponse` - Upload status, counts, errors
- `InstrumentUploadError` - Validation failure details
- `HistoricalDataFetchResponse` - Fetch results with counts
- `InstrumentFetchResult` - Individual fetch details
- `GFDSEODUploadResponse` - EOD upload statistics with sheets_processed, dates list

Benefits: Runtime error prevention, clean internal/API separation, improved Swagger docs

### Multi-Source Data Architecture

**Multi-API Strategy:**

1. **Kite Connect API** (Primary) - Indian markets (NSE/BSE)
   - Auth: Access token in config | Rate limit: 3/sec (0.35s delay)
   - Reference: `kite_instruments`

2. **EODHD API** (Secondary) - International markets (US, NSE)
   - Config: `EODHD_API_KEY`, `EODHD_SUPPORTED_EXCHANGES`
   - Reference: `eodhd_instruments` | Fallback when Kite unavailable

3. **GFDS API** (Tertiary) - Alternative data source for Indian markets (NSE/BSE)
   - Config: `GFDS_SUPPORTED_EXCHANGES`, `GFDS_SUPPORTED_SEGMENTS`
   - Reference: `gfds_instruments` | Additional fallback option

4. **Smart Fetching**
   - Calculates existing ranges, fetches only missing dates
   - Buffer: 90 days (`HISTORICAL_DATA_BUFFER_DAYS`)

### Configuration

**File:** `docker_config.env` (untracked, in .gitignore) | **Class:** `app/core/config.py` (Pydantic)

**Key Settings:**
- Database: `DATABASE_HOST`, `DATABASE_URL`, credentials
- API Keys: `KITE_API_KEY`, `KITE_ACCESS_TOKEN`, `EODHD_API_KEY`
- Historical Data: `MAX_HISTORICAL_DATA_YEARS=5`, `HISTORICAL_DATA_BUFFER_DAYS=90`
- GFDS: `GFDS_SUPPORTED_EXCHANGES`, `GFDS_SUPPORTED_SEGMENTS`

**Configuration Precedence:**
- `docker_config.env` **overrides** `docker-compose.yml` environment variables
- Enables flexible deployment: local dev uses TimescaleDB container, staging/production uses external databases

**Excel Configuration:**
- `EXCEL_COLUMN_MAPPINGS`: Unified column mapping (single `Dict[str, str]`) for all sources (SCREENER, CUSTOM, US, INDEX)
- Required columns: `Name`, `Trading Symbol`, `Exchange`, `Tote Name`, `Exchange Code`
- No source-specific mappings needed (v2.5.0 refactoring)

## Important Implementation Details

### Source Types (SourceEnum)

Four supported data sources for trader tote instruments:

1. **SCREENER** - Instruments from stock screener tools/platforms
2. **CUSTOM** - User-defined/manually added instruments
3. **US** - United States market instruments (NASDAQ, NYSE, etc.)
4. **INDEX** - Market benchmark indices (NIFTY50, SENSEX, S&P500, etc.)

**Architecture:**
- Defined in `app/models/tradertote_instruments.py` as `SourceEnum(str, Enum)`
- Part of composite primary key: `(tradingsymbol, exchange, source)`
- All sources use unified Excel column format (no source-specific handling needed)
- API endpoints automatically support all source types via enum validation

**Adding new sources:** Simply add new enum value - no API/service changes required due to source-agnostic design.

### Kite Authentication Flow

1. User navigates to `/api/v1/auth/login` to get login URL
2. After authentication, Kite redirects to `/api/v1/auth/callback`
3. Access token is saved and used for all subsequent API calls
4. Check status with `/api/v1/auth/status`

### Kite Instruments Sync

**Endpoint:** `/api/v1/kite-instruments/sync`

**Deduplication Logic:**
- Kite API occasionally returns duplicate (tradingsymbol, exchange) pairs in the same batch (~122k+ instruments)
- Service deduplicates before bulk upsert, keeping **last occurrence** (latest data)
- Prevents PostgreSQL ON CONFLICT errors: "command cannot affect row a second time"
- Logs number of duplicates removed for monitoring

**Implementation:** `app/services/kite_instrument_service.py:86-99`

**Why needed:** PostgreSQL's ON CONFLICT DO UPDATE cannot handle multiple rows with same conflict key in a single INSERT statement

### UPSERT Logic

**Trader Tote Instruments:**
Composite key: `(tradingsymbol, exchange, source)`
- **Same source**: Merges totes (["Banking"] + ["Large_Cap"] = ["Banking", "Large_Cap"])
- **Different source**: Creates separate record (RELIANCE-NSE-SCREENER ≠ RELIANCE-NSE-CUSTOM)

**GFDS EOD Historical Data:**
Composite key: `(tradingsymbol, exchange, time)`
- **INSERT**: New records added if composite key doesn't exist
- **UPDATE**: Existing records overwritten (OHLCV fields updated) on conflict
- Atomic bulk operation using `execute_values()` for performance

### Inactive Instrument Marking

When data fetch fails from all available sources (Kite, EODHD, GFDS):
1. Validates against master tables before API calls
2. Marks ALL occurrences as "Inactive" across sources via `update_instrument_status()`
3. Returns in `inactive_instruments` array
4. Logs warning

Prevents repeated failed fetches and maintains cross-source consistency.

### Rate Limiting

Kite API: 3 req/sec, 0.35s delay between calls

### Timezone Handling

**Core Principle**: Backend and PostgreSQL work exclusively in UTC. Timezone conversions occur only at API client boundaries.

**Architecture:**
- **Backend/Database**: All datetime operations use UTC (`datetime.now(timezone.utc)`)
- **PostgreSQL**: Stores timestamps in UTC (TimescaleDB `TIMESTAMPTZ`)
- **API Clients**: Each client has `timezone` class attribute
  - `KiteClient.timezone = "Asia/Kolkata"` (IST)
  - `EODHDClient.timezone = "UTC"`

**Critical: Trading Date Preservation**

When processing API responses, preserve the trading date instead of converting timezones:

```python
# CORRECT: Extract date and create UTC midnight
trading_date = dt.date()
utc_datetime = datetime.combine(trading_date, time.min, tzinfo=UTC)
# "2025-10-24T00:00:00+0530" → "2025-10-24T00:00:00+00"

# WRONG: Timezone conversion shifts the date
utc_datetime = dt.astimezone(UTC)
# "2025-10-24T00:00:00+0530" → "2025-10-23T18:30:00+00" ❌
```

**Why:** Kite API returns IST midnight timestamps. Direct timezone conversion shifts Oct 24 data to Oct 23 UTC, causing 1-day backward shift in all trading dates.

**Utility Functions** (`app/utils/historical_data_fetcher_utils.py`):
- `fill_missing_dates()`: Preserves trading dates, fills gaps with forward fill
- `localize_to_utc()`: Makes naive datetimes UTC-aware
- `parse_utc_string()`: Parses ISO format timestamps
- `calculate_missing_ranges()`: Determines date gaps for incremental fetching

## Common Development Tasks

### Adding a New API Endpoint

1. Define Pydantic models in `app/models/`
2. Add business logic to appropriate service in `app/services/`
3. Create route handler in `app/api/v1/`
4. Register route via the router (already included in `app/api/__init__.py`)

### Adding a New Source Type

To add a new instrument source (like INDEX was added):
1. Add enum value to `SourceEnum` in `app/models/tradertote_instruments.py`
2. Add tests in `tests/models/test_tradertote_instruments.py`
3. That's it! All APIs/services work automatically due to source-agnostic architecture

### Adding a New Data Provider (API)

To integrate a new data provider (like Kite/EODHD/GFDS):
1. Implement client in `app/repositories/` (e.g., `new_client.py`)
2. Add configuration to `app/core/config.py`
3. Register in dependency injection (`app/core/dependencies.py`)
4. Update `HistoricalDataFetcherService` to use new provider

### Modifying Database Schema

1. Update SQL schema in `scripts/historical_database.sql`
2. Update corresponding Pydantic models in `app/models/`
3. Update repository methods in `app/repositories/`
4. Run schema updates on database manually (no migration tool currently)

### Excel Uploads

**Unified Column Mapping** (all sources use same format):
- All sources (SCREENER, CUSTOM, US, INDEX) require: **Name**, **Trading Symbol**, **Exchange**, **Tote Name**, **Exchange Code**
- Configure via `EXCEL_COLUMN_MAPPINGS` in `docker_config.env` (single mapping applies to all sources)
- Simplifies uploads and eliminates source-specific validation

**Structure:** Sheet name = tote name | Each row = one instrument | Multi-exchange support

**Response:** `inserted_records`, `processed_records`, `errors[]` (name, symbol, exchange, reason)

## File References

- **Main application**: `app/main.py` (FastAPI app factory)
- **Entry point**: `main.py` (runs uvicorn)
- **Database manager**: `app/core/database.py` (DatabaseManager class)
- **Dependency injection**: `app/core/dependencies.py` (all factory functions)
- **TT Instruments API**: `app/api/v1/tradertote_instruments.py` (Excel upload, fetch, filter, historical data endpoints)
- **TT Instruments Service**: `app/services/tradertote_instruments.py` (Filter logic with AND behavior)
- **TT Instruments Repository**: `app/repositories/tradertote_instruments.py` (ExcelUploadTTInstruments, TTInstrumentRepository with UPSERT)
- **Historical data fetcher**: `app/services/historical_data_fetcher_service.py` (HistoricalDataFetcherService)
- **Kite client**: `app/repositories/kite_client.py`
- **EODHD client**: `app/repositories/eodhd_client.py`
- **GFDS client**: `app/repositories/gfds_client.py` (GFDSInstrumentRepository)
- **GFDS Instruments API**: `app/api/v1/gfds_instruments.py` (GFDS instrument management, EOD upload endpoints)
- **GFDS Instruments Service**: `app/services/gfds_instrument_service.py` (GFDS business logic, multi-sheet EOD upload)
- **Historical data repository**: `app/repositories/instrument_historical_repository.py` (bulk_upsert_eod_data with UPSERT)
- **Historical data utilities**: `app/utils/historical_data_fetcher_utils.py` (UTC timezone processing, date preservation, gap filling)
- **Utility tests**: `tests/utils/test_historical_data_fetcher_utils.py` (TDD tests for timezone handling)
- **Service tests**: `tests/services/test_historical_data_fetcher_service.py` (Integration tests)

## Database Context Manager

Always use context manager pattern:
```python
with self.db_manager.get_cursor(dict_cursor=True) as cursor:
    cursor.execute("SELECT * FROM instruments WHERE id = %s", (instrument_id,))
    return cursor.fetchone()
```
Handles: pool management, transactions, cleanup, errors

## API Versioning

All endpoints under `/api/v1/` prefix
