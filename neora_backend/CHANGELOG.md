# ChangeLog

## Versioning Scheme
This project uses Semantic Versioning (SemVer):
- **MAJOR** version increments for releases
- **MINOR** version increments for new features or big change in existing features
- **PATCH** version increments for backward-compatible bug fixes or partial completion of features.


## [2.5.0] - 2025-11-18 | BRANCH: feature/eod_data_with_gfds

### Features

#### Market Indices Support
- `af9dbf4` (2025-11-13): feat: add INDEX source to SourceEnum for market indices support

### Fixes

#### Data Integrity & Deployment
- `6625d62` (2025-11-18): fix: deduplicate Kite instruments before bulk upsert
- `fa5ccd7` (2025-11-18): fix: allow DATABASE_HOST override from docker_config.env
- `febe35d` (2025-11-13): fix: replace hardcoded dates with dynamic dates in datetime bug tests

### Refactoring

#### Configuration Unification
- `9ea9c17` (2025-11-13): refactor: unify Excel column mappings for all data sources

### Chores

- `094ed6c` (2025-11-18): chore: Basic syntax fix to failing test

### Documentation

- `7c83eb7` (2025-11-13): docs: added new useful sql commands for debugging
- `8ca5a85` (2025-11-13): docs: update CLAUDE.md to reflect current codebase state

### Architecture Summary

#### Kite Instrument Sync Reliability & Deployment Flexibility
Fixed critical Kite API sync issue where duplicate (tradingsymbol, exchange) pairs in API responses caused PostgreSQL ON CONFLICT failures. Enabled flexible database configuration for staging/production deployments with DATABASE_HOST override support in docker_config.env.

#### Key Design Decisions
- **Deduplication Strategy**: Keep last occurrence (latest data) when Kite API returns duplicates in same batch
- **Configuration Override**: docker_config.env now takes precedence over docker-compose.yml for DATABASE_HOST
- **Test Robustness**: Dynamic date generation replaces hardcoded dates for reliable CI/CD testing

### Benefits and Impact
- **Data Sync Reliability**: Kite instrument sync now handles 122k+ instruments without PostgreSQL conflicts
- **Deployment Flexibility**: Staging/production can use external databases (Neon PostgreSQL) while dev uses local TimescaleDB
- **Market Indices Support**: INDEX source enum enables tracking benchmark indices alongside stocks
- **Unified Configuration**: Centralized Excel column mappings eliminate redundancy and improve maintainability

---

## [2.4.0] - 2025-11-08 | BRANCH: feature/eod_data_with_gfds

### Features

#### GFDS EOD Upload System
- `e0fd5f5` (2025-11-08): feat: add bulk upsert method for EOD historical data
- `558a424` (2025-11-08): feat: add GFDS EOD Excel upload service with multi-sheet support
- `9b216a8` (2025-11-08): feat: add POST /eod-upload endpoint for GFDS EOD data

### Fixes

#### Test Suite
- `8acb57f` (2025-11-08): fix: resolve datetime test failures with timezone and buffer alignment

### Chores

- `b28b4ad` (2025-11-08): chore: /login API now returns kite login url

### Architecture Summary

#### GFDS EOD Price Upload with Multi-Sheet Excel Support
Complete EOD upload system for GFDS data with multi-sheet Excel processing. Auto-registers instruments and upserts OHLCV data with atomic operations. Refactored service layer following KISS principle with focused helper methods (all functions < 50 lines).

#### Key Design Decisions
- **UPSERT Strategy**: PostgreSQL ON CONFLICT for atomic insert/update operations
- **Multi-Sheet Processing**: Each Excel sheet represents one trading date, aggregated in single transaction
- **Code Quality**: Extracted validation logic, split large functions into single-responsibility helpers

### Benefits and Impact
- **Reduced API Calls**: Upload multiple days of data in single request (66% reduction for 3-day uploads)
- **Data Integrity**: Atomic bulk operations ensure consistency, auto-registration prevents orphaned price data
- **Maintainability**: Clean separation of concerns with all functions under 50 lines, improved testability

---

## [2.3.8] - 2025-11-06 | BRANCH: bug/consolidating_eodhd_kiteconnect_historical_data

### Fixes

#### Timezone & Data Processing
- `b40c361` (2025-11-06): fix: preserve trading dates when converting IST timestamps to UTC

### Features

#### Historical Data Processing
- `86505e8` (2025-11-05): feat: add utility functions for historical data processing

### Refactoring

#### Timezone Handling & Architecture
- `327a12c` (2025-11-06): refactor: standardize timezone handling to UTC across backend
- `3624140` (2025-11-05): refactor: enhance historical data fetcher with timezone handling and date filling

### Tests

- `52ba4cc` (2025-11-05): test: refactor and clean up historical data fetcher tests

### Documentation

- `b89780b` (2025-11-05): docs: improve documentation and logging clarity

### Architecture Summary

#### Timezone Standardization & Data Integrity
Standardized timezone handling to UTC across the backend with enhanced date preservation logic. Added utility functions for historical data processing and improved the historical data fetcher with better timezone conversion and gap filling capabilities.

#### Key Design Decisions
- **UTC Standardization**: All timestamp operations now consistently use UTC as the standard timezone
- **Trading Date Preservation**: Fixed logic to maintain accurate trading dates during timezone conversions
- **Utility Functions**: Added reusable functions for historical data processing workflows

### Benefits and Impact
- **Data Consistency**: Standardized UTC handling eliminates timezone-related data inconsistencies
- **Trading Accuracy**: Preserved trading dates ensure accurate historical data representation
- **Code Reusability**: New utility functions streamline historical data processing across the application
- **Maintainability**: Refactored test suite improves code reliability and test coverage

---

## [2.3.5] - 2025-11-05 | BRANCH: feature/integrate_GFDS_instruments

### Features

#### GFDS Instruments Reference System
- `4fd7ac2` (2025-11-05): feat: add core GFDS instruments infrastructure
- `fa1f214` (2025-11-05): feat: add GFDS instrument service layer
- `cea0c50` (2025-11-05): feat: add GFDS instruments API endpoints and integration
- `6d2b6a2` (2025-10-31): feat: ensure schema parity between SQL script and app initialization

### Documentation

- `ea721f2` (2025-11-05): docs: add GFDS instruments documentation

### Tests

- `2f04dd0` (2025-11-05): test: add comprehensive GFDS instruments test suite

### Architecture Summary

#### GFDS (Global Financial Data Services) Integration
Complete GFDS instruments reference system with clean architecture across models, repositories, services, and API layers. Features CSV upload sync, status tracking, and comprehensive API endpoints for NSE/BSE instrument validation and management. Integrates seamlessly with existing Kite and EODHD systems for multi-source instrument data capabilities.

#### Key Design Decisions
- **Multi-Source Architecture**: GFDS joins Kite and EODHD as third instrument data source
- **Composite Key Design**: `(tradingsymbol, exchange)` enables same symbol across different exchanges
- **Configuration-Driven**: Support for GFDS exchanges and segments via environment configuration

### Benefits and Impact
- **Expanded Data Sources**: Third instrument reference system providing redundancy and comprehensive coverage
- **NSE/BSE Coverage**: Enhanced support for Indian markets through additional data provider
- **Comprehensive API**: Complete CRUD operations for instrument management and status tracking
- **Clean Architecture**: Consistent with existing codebase patterns and dependency injection

---

## [2.3.0] - 2025-10-31 | BRANCH: feature/refactor_historical_data_service

### Fixes

#### API & Data Handling
- `a7fb96a` (2025-10-31): fix: Accounted for HISTORICAL_DATA_BUFFER_DAYS in /historical-data API
- `2649a22` (2025-10-31): fix: Fixed Delta of 2 days in retrieval of historical data
- `1d8a19e` (2025-10-29): fix: return 200 success for duplicate uploads instead of 422 failure
- `1e13e7c` (2025-10-28): fix: Replaced exchange_code with exchange
- `0d60c41` (2025-10-28): fix: Only mark instruments Inactive on initial fetch failure
- `cd95d1d` (2025-10-28): fix: Map US exchange codes and return proper HTTP status for Excel upload
- `65ac36c` (2025-10-27): fix: /fetch-historical-data 's filtering logic
- `f68007e` (2025-10-24): fix: remove depracated checks and imrpve function's testability

#### EODHD Exchange Integration
- `9c5ecba` (2025-10-27): fix: Keep supported exchange instead of eodhd's /exchange-symbol-list API response
- `3901a66` (2025-10-27): fix: map US exchange codes to EODHD "US" and fix datetime comparison bug
- `11306fc` (2025-10-27): fix: use instrument.exchange instead of exchange_code for EODHD lookup

### Features

#### Status Filtering System
- `eea7b58` (2025-10-28): feat: Add status filter to fetch-historical-data endpoint and remove redundant /sync endpoint
- `a6b6667` (2025-10-27): feat: add status query parameter to /fetch-instruments endpoint
- `9aeb911` (2025-10-27): feat: add status filter parameter to service layer

### Refactoring

#### Composite Key Migration
- `f5b0729` (2025-10-24): refactor: migrate instrument_historical_data to composite key
- `7da883c` (2025-10-24): refactor: update repository to use composite key queries
- `5e04ae1` (2025-10-24): refactor: migrate HistoricalDataFetcherService to composite keys
- `f519b64` (2025-10-24): refactor: update instrument status across all sources

#### Architecture Simplification
- `f696e4d` (2025-10-29): refactor: add Pydantic API response schemas and rename Excel models
- `9becb46` (2025-10-28): refactor: remove redundant interfaces layer and connect services directly to repositories
- `1bcd83b` (2025-10-28): refactor: migrate historical data GET endpoint to tradertote instruments and remove OHLCV system
- `7a98ac8` (2025-10-27): refactor: update /sync endpoint to use new status filtering method
- `75adb98` (2025-10-27): refactor: replace get_all_active_instruments with flexible status filter

### Tests

- `961485c` (2025-10-27): test: add comprehensive tests for status filtering feature
- `9bc1668` (2025-10-27): test: make tests read from settings instead of hardcoding values
- `5eb2d18` (2025-10-24): test: add comprehensive tests for HistoricalDataFetcherService
- `327777b` (2025-10-24): test: add comprehensive unit tests for InstrumentHistoricalRepository

### Chores & Documentation

- `71b7c33` (2025-10-28): docs: Added useful commands
- `f7138b0` (2025-10-28): chore: remove useless test
- `fbe9557` (2025-10-27): docs: add TDD implementation plan for status filtering
- `c787714` (2025-10-24): docs: update architecture docs with composite key refactoring

### Architecture Summary

#### Composite Key Migration & Historical Data Refactor
Complete migration from single-key (instrument_token) to composite key (tradingsymbol, exchange) architecture across historical data tables, repositories, and services. Consolidated historical data endpoint under /tradertote-instruments and removed redundant OHLCV system. Eliminated interfaces layer by connecting services directly to repositories, following YAGNI principle.

#### Type-Safe API Responses & Status Filtering
Added Pydantic response schemas for all API endpoints, improving type safety and validation. Implemented flexible status filtering system allowing queries by Active/Inactive status with proper AND logic across multiple parameters.

### Benefits and Impact
- **Composite Key Architecture**: Enables multi-exchange support without Kite dependency, supporting instruments across NSE, BSE, NASDAQ, NYSE, US markets
- **Type Safety**: Pydantic schemas prevent runtime errors and improve API contract clarity
- **Status Management**: Flexible filtering by instrument status with proper query parameter handling
- **Simplified Architecture**: Removed redundant interfaces layer, reducing complexity and maintenance overhead
- **Buffer Days Integration**: Historical data API now properly accounts for buffer periods in date range validation
- **Comprehensive Testing**: 114 tests passing, ensuring reliability across all refactored components

---

## [2.2.0] - 2025-10-17 | BRANCH: feature/refactor_tradertote_instruments

### Fixes

#### Multi-Exchange Support & Filter Logic
- `82e44ee` (2025-10-17): fix: remove hardcoded NSE/BSE exchange validation to support international exchanges
- `42720df` (2025-10-17): fix: implement AND logic for instrument filters
- `0355cfd` (2025-10-17): fix: resolve KeyError in get_column_mapping method
- `0a23f4f` (2025-10-14): fix: correct type hints in historical data services

### Features

#### Excel Upload Refactor with UPSERT
- `0368c93` (2025-10-14): feat(api): integrate Excel upload with ExcelUploadTTInstruments
- `6988640` (2025-10-14): feat(repository): implement UPSERT and Excel validation
- `ec17b38` (2025-10-14): feat(repository): implement Excel upload processing
- `b49e57c` (2025-10-14): feat(models): add Excel upload validation models
- `23efd34` (2025-10-14): feat(config): add Excel column mappings for multi-source support
- `d21aabe` (2025-10-14): feat(models): add valid_models field to ExcelUploadResult
- `679820f` (2025-10-17): feat: add traceback logging to exception handlers

#### TraderTote Instruments Refactor
- `ab80b8c` (2025-10-14): refactor: add source to trader_tote_instruments primary key
- `695248f` (2025-10-14): chore: rename tradertote_instruments classes with TT prefix
- `40aafc9` (2025-10-14): feat(database): add trader_tote_instruments migration
- `8cf17f7` (2025-10-14): refactor(core): update dependency injection for tradertote_instruments
- `0fe5281` (2025-10-14): refactor(api): consolidate endpoints to /tradertote-instruments
- `0708d98` (2025-10-14): refactor(services): streamline tradertote_instruments service layer
- `4a92bd0` (2025-10-14): refactor(repository): implement tradertote_instruments repository with composite key
- `b8de2ee` (2025-10-14): refactor(models): replace instrument models with tradertote_instruments

#### Kite Instruments Schema Enhancement
- `c0dd6bd` (2025-10-14): feat: expand kite_instruments schema to store complete Kite API data
- `b3203db` (2025-10-14): refactor(schema): change kite_instruments PRIMARY KEY to (tradingsymbol, exchange)

### Tests

- `2501638` (2025-10-17): test: add filter tests and restructure test directory
- `9acba8a` (2025-10-14): test: add integration tests for Excel upload endpoint
- `73a03de` (2025-10-14): test: Test the repository ExcelUploadTTInstruments and its models

### Chores & Documentation

- `7adb991` (2025-10-17): refactor: standardize SourceEnum values across codebase
- `bebc0b6` (2025-10-17): chore: remove obsolete test Excel file
- `d3e983b` (2025-10-17): chore: add pytest testing dependencies
- `886fec9` (2025-10-14): docs: add Excel upload refactor plan and completion status
- `44815a1` (2025-10-14): docs: add PRUNING_PLAN.md and update .gitignore

### Architecture Summary

#### Excel Upload System with UPSERT Logic
Complete refactor of Excel upload pipeline with repository-based validation, UPSERT logic for duplicate handling, and multi-source column mapping support. Implements TDD with comprehensive test coverage following clean architecture principles.

#### Multi-Exchange Support & Filter Improvements
Removed restrictive NSE/BSE-only validation to enable international exchange support (NASDAQ, NYSE, US, etc.) via EODHD integration. Fixed filter logic to use AND (intersection) instead of OR (union) for proper multi-filter combinations.

### Benefits and Impact
- **UPSERT Support**: Intelligent duplicate handling with tote merging for existing instruments
- **Multi-Source Excel**: Configurable column mappings for SCREENER, CUSTOM, and US sources
- **International Markets**: Full support for NASDAQ, NYSE, and other global exchanges
- **Better Filtering**: AND logic ensures accurate results when combining source/exchange/tote filters
- **TDD Coverage**: 21 tests (8 API + 13 model) ensuring reliability and preventing regressions

---

## [2.1.3] - 2025-10-14 | BRANCH: task/build_eodhd_instruments

### Features

#### EODHD Instruments Reference System
- `bd303e1` (2025-10-14): docs: add comprehensive EODHD instruments documentation
- `b6fff0c` (2025-10-14): feat: add automatic table initialization on app startup
- `76ff024` (2025-10-14): feat: add REST API endpoints for EODHD instruments
- `fe9001a` (2025-10-14): feat: add EODHDInstrumentService for sync and lookup
- `c5f0c4d` (2025-10-14): feat: add EODHD client and repository implementation
- `adc5ec3` (2025-10-14): feat: add EODHDInstrument model and client interface
- `c19061b` (2025-10-14): feat: add database schema and config for EODHD instruments

### Architecture Summary

#### EODHD Instruments Reference System
Complete multi-exchange instrument lookup system supporting EODHD data sources (US, NSE markets). Implements clean architecture with model, repository, service, and API layers following KISS and YAGNI principles. Features configuration-driven exchange support with automatic table initialization on application startup.

#### Key Design Decisions
- **Multi-Exchange Support**: Configuration-driven exchange list (US, NSE) with easy extensibility
- **Composite Primary Key**: `(tradingsymbol, exchange)` enables same symbol across different exchanges
- **No Interface Layer**: Direct repository implementation in eodhd_client.py (following Kite pattern)
- **Automatic Initialization**: Tables created automatically on app startup, eliminating manual setup

### Benefits and Impact
- **Multi-Market Coverage**: Supports both US and Indian (NSE) markets through single unified API
- **Instrument Validation**: Validates symbols against EODHD master lists before operations
- **Efficient Sync**: Per-exchange error handling allows partial success without failing entire sync
- **Fast Lookups**: Indexed composite key queries with <1ms execution time

---

## [2.1.0] - 2025-10-14 | BRANCH: task/build_kite_instrumets_reference

### Features

#### Kite Instruments Reference System
- `a71a0a1` (2025-10-14): docs: add implementation plan for Kite instruments feature
- `6168474` (2025-10-14): feat: add REST API endpoints for Kite instruments
- `7318de8` (2025-10-14): feat: add KiteInstrumentService for sync and lookup operations
- `a2e8b4d` (2025-10-14): feat: add KiteInstrument model and repository for reference data
- `6279484` (2025-10-14): feat: add database schema and Docker setup for Kite instruments

### Chores

- `26880df` (2025-10-14): Untrack docker_config.env and add to .gitignore

### Architecture Summary

#### Kite Instruments Reference System
Complete lookup/reference table storing Kite Connect master instrument list (~10k+ instruments) for Excel upload validation and instrument_token mapping. Implements clean architecture with model, repository, service, and API layers following YAGNI principle. Includes TimescaleDB Docker setup with data persistence and automatic schema initialization.

#### Key Design Decisions
- **Separation of Concerns**: Dedicated KiteInstrumentService separated from InstrumentService (reference data vs operational data)
- **Two-Table Design**: `kite_instruments` (complete master reference) vs `instruments` (curated operational subset)
- **No Interface Layer**: Direct repository implementation for Kite-specific operations

### Benefits and Impact
- **Excel Upload Validation**: Validates tradingsymbols against Kite master list, preventing invalid instruments
- **Token Mapping**: Maps (tradingsymbol, exchange) to instrument_token for historical data API calls
- **Efficient Lookups**: Indexed queries with <1ms execution time for high-performance validation workflows
