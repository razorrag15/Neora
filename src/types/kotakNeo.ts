/**
 * Kotak Neo API Type Definitions
 * Zero brokerage trading API for Indian stock market
 * Based on official Kotak Neo API documentation
 */

// ==================== Base Response Types ====================

export type ResponseStatus = 'Ok' | 'Not_Ok';

export interface BaseResponse {
  stat: ResponseStatus;
  stCode?: number;
  errMsg?: string;
}

// ==================== Authentication Types ====================

export interface LoginRequest {
  mobilenumber: string;
  password: string;
}

export interface LoginResponse extends BaseResponse {
  data?: {
    token: string;
    sid: string;
  };
}

export interface OTPRequest {
  OTP: string;
}

export interface SessionResponse extends BaseResponse {
  sid?: string;
  rid?: string;
  hsServerId?: string;
  isUserPwdExpired?: boolean;
  cacheTime?: string;
  ucc?: string;
  greetingName?: string;
  exchange?: string[];
  product?: string[];
  lastLoginTime?: string;
  accountID?: string;
  activityTime?: string;
  susertoken?: string;
  Authorization?: string;
}

// ==================== Market Data Types ====================

export type QuoteType = 'ltp' | 'depth' | 'ohlc';
export type ExchangeSegment = 'nse_cm' | 'bse_cm' | 'nse_fo' | 'bse_fo' | 'cde_fo' | 'mcx_fo' | 'bcd_fo';

export interface QuoteRequest {
  instrument_tokens: string[];
  quote_type?: QuoteType;
  isIndex?: boolean;
}

export interface QuoteLTP {
  ltp: number;           // Last Traded Price
  ltt: string;           // Last Trade Time
  ltq: number;           // Last Trade Quantity
  lto: string;           // Last Trade Order
  pc: number;            // Price Change
  pcp: number;           // Price Change Percentage
  oi: number;            // Open Interest
  vol: number;           // Volume
  bidQty: number;        // Total Bid Quantity
  askQty: number;        // Total Ask Quantity
  tbq: number;           // Total Buy Quantity
  tsq: number;           // Total Sell Quantity
}

export interface QuoteOHLC extends QuoteLTP {
  open: number;          // Open Price
  high: number;          // Day High
  low: number;           // Day Low
  close: number;         // Previous Close
  lc: number;            // Lower Circuit
  uc: number;            // Upper Circuit
  yh: number;            // 52-week High
  yl: number;            // 52-week Low
  yhDt: string;          // 52-week High Date
  ylDt: string;          // 52-week Low Date
  wh: number;            // Week High
  wl: number;            // Week Low
  mh: number;            // Month High
  ml: number;            // Month Low
}

export interface MarketDepthLevel {
  price: number;
  quantity: number;
  orders: number;
}

export interface QuoteDepth extends QuoteOHLC {
  bid: MarketDepthLevel[];  // 5 levels
  ask: MarketDepthLevel[];  // 5 levels
  totalBuyQty: number;
  totalSellQty: number;
}

export interface QuoteResponse extends BaseResponse {
  data?: {
    [instrumentToken: string]: QuoteLTP | QuoteOHLC | QuoteDepth;
  };
}

// ==================== Scrip Master Types ====================

export interface ScripMasterItem {
  pSymbol: string;           // Symbol
  pTrdSymbol: string;        // Trading Symbol
  pGroup: string;            // Group
  pExchSeg: ExchangeSegment; // Exchange Segment
  pInstType: string;         // Instrument Type
  pEToken: string;           // Exchange Token
  pSymbolName: string;       // Symbol Name
  pCompanyName: string;      // Company Name
  pExpiryDate?: string;      // Expiry Date (for F&O)
  pStrikePrice?: string;     // Strike Price (for Options)
  pOptionType?: 'CE' | 'PE'; // Option Type
  pPriceTick: string;        // Price Tick Size
  pLotSize: string;          // Lot Size
  pFreezeQty: string;        // Freeze Quantity
  pTickSize: string;         // Tick Size
  pIsinCode: string;         // ISIN Code
  pSector: string;           // Sector
  pIndustry: string;         // Industry
}

export interface ScripMasterResponse extends BaseResponse {
  data?: ScripMasterItem[];
}

// ==================== Trading Types ====================

export type ProductType = 'CNC' | 'MIS' | 'NRML' | 'CO' | 'BO';
export type OrderType = 'L' | 'MKT' | 'SL' | 'SL-M';
export type TransactionType = 'B' | 'S';
export type ValidityType = 'DAY' | 'IOC' | 'EOS' | 'GTD' | 'GTC';
export type OrderStatus = 
  | 'pending' 
  | 'open' 
  | 'complete' 
  | 'rejected' 
  | 'cancelled' 
  | 'trigger pending' 
  | 'after market order req received'
  | 'modify pending'
  | 'cancel pending'
  | 'modify after market order req received'
  | 'cancel after market order req received';

export interface PlaceOrderRequest {
  exchange_segment: ExchangeSegment;
  product: ProductType;
  price: string;
  order_type: OrderType;
  quantity: string;
  validity: ValidityType;
  trading_symbol: string;
  transaction_type: TransactionType;
  amo: 'YES' | 'NO';
  disclosed_quantity?: string;
  market_protection?: string;
  pf?: 'N' | 'M';  // Fresh or Modify
  trigger_price?: string;
  dd?: string;  // GTD date in DD-MM-YYYY format
  tag?: string;  // Optional tag for order
}

export interface PlaceOrderResponse extends BaseResponse {
  nOrdNo?: string;  // Neo Order Number
  data?: {
    orderId: string;
    message?: string;
  };
}

export interface ModifyOrderRequest {
  instrument_token: string;
  exchange_segment: ExchangeSegment;
  product: ProductType;
  price: string;
  order_type: OrderType;
  quantity: string;
  validity: ValidityType;
  trading_symbol: string;
  transaction_type: TransactionType;
  order_id: string;
  market_protection?: string;
  disclosed_quantity?: string;
  trigger_price?: string;
  dd?: string;
}

export interface ModifyOrderResponse extends BaseResponse {
  nOrdNo?: string;
  data?: {
    orderId: string;
    message?: string;
  };
}

export interface CancelOrderRequest {
  order_id: string;
}

export interface CancelOrderResponse extends BaseResponse {
  data?: {
    orderId: string;
    message?: string;
  };
}

export interface Order {
  nOrdNo: string;              // Neo Order Number
  exchOrdID: string;           // Exchange Order ID
  trnsTp: TransactionType;     // Transaction Type
  ordSt: OrderStatus;          // Order Status
  prcTp: OrderType;            // Price Type
  prod: ProductType;           // Product Type
  exSeg: ExchangeSegment;      // Exchange Segment
  trdSym: string;              // Trading Symbol
  qty: string;                 // Quantity
  unFldSz: string;             // Unfilled Size
  dsQty: string;               // Disclosed Quantity
  prc: string;                 // Price
  trgPrc: string;              // Trigger Price
  avgPrc: string;              // Average Price
  ordDtTm: string;             // Order Date Time
  exchTm: string;              // Exchange Time
  sts: string;                 // Status Message
  rjRsn?: string;              // Rejection Reason
  exUsrInfo?: string;          // Exchange User Info
  fldQty: string;              // Filled Quantity
  cpName?: string;             // Counterparty Name
  flBuyQty?: string;           // Fill Buy Quantity
  flSellQty?: string;          // Fill Sell Quantity
  ordGenTp?: string;           // Order Generation Type
  vldt?: ValidityType;         // Validity
  tckSz?: string;              // Tick Size
  lotSz?: string;              // Lot Size
  orderUserMessage?: string;   // User Message
  sym?: string;                // Symbol
  multiplier?: string;         // Multiplier
  precisn?: string;            // Precision
  prcftr?: string;             // Price Factor
  trailTick?: string;          // Trail Tick
  trailPrc?: string;           // Trail Price
  sipInd?: string;             // SIP Indicator
  panNo?: string;              // PAN Number
  snoValueMultiplied?: string; // SNO Value Multiplied
  prdCode?: string;            // Product Code
}

export interface OrderBookResponse extends BaseResponse {
  data?: Order[];
}

export interface Trade {
  ordID: string;               // Order ID
  nOrdNo: string;              // Neo Order Number
  exchOrdID: string;           // Exchange Order ID
  flID: string;                // Fill ID
  fldQty: string;              // Filled Quantity
  flPrc: string;               // Fill Price
  flTm: string;                // Fill Time
  flDtTm: string;              // Fill Date Time
  ordTm: string;               // Order Time
  prcTp: OrderType;            // Price Type
  prod: ProductType;           // Product Type
  exSeg: ExchangeSegment;      // Exchange Segment
  trdSym: string;              // Trading Symbol
  sym: string;                 // Symbol
  trnsTp: TransactionType;     // Transaction Type
  qty: string;                 // Quantity
  dsQty: string;               // Disclosed Quantity
  prc: string;                 // Price
  trgPrc: string;              // Trigger Price
  vldt: ValidityType;          // Validity
  ordSrc?: string;             // Order Source
  rjRsn?: string;              // Rejection Reason
  cpName?: string;             // Counterparty Name
  exchangeTime?: string;       // Exchange Time
  nstReqID?: string;           // Nest Request ID
}

export interface TradeBookResponse extends BaseResponse {
  data?: Trade[];
}

// ==================== Position Types ====================

export interface Position {
  flBuyQty: string;            // Fill Buy Quantity
  flSellQty: string;           // Fill Sell Quantity
  netQty: string;              // Net Quantity
  avgSlPrc: string;            // Average Sell Price
  avgByPrc: string;            // Average Buy Price
  rlzPL: string;               // Realized P&L
  urlzPL: string;              // Unrealized P&L
  ltp: string;                 // Last Traded Price
  trdSym: string;              // Trading Symbol
  exc: string;                 // Exchange
  ntPL: string;                // Net P&L
  tok: string;                 // Token
  prod: ProductType;           // Product
  exSeg: ExchangeSegment;      // Exchange Segment
  mult: string;                // Multiplier
  prcftr: string;              // Price Factor
  buyAmt: string;              // Buy Amount
  sellAmt: string;             // Sell Amount
  sym: string;                 // Symbol
  cpName?: string;             // Company Name
  dlvBuyQty?: string;          // Delivery Buy Quantity
  dlvSellQty?: string;         // Delivery Sell Quantity
  cfBuyQty?: string;           // Carry Forward Buy Quantity
  cfSellQty?: string;          // Carry Forward Sell Quantity
  buyAvg?: string;             // Buy Average
  sellAvg?: string;            // Sell Average
}

export interface PositionsResponse extends BaseResponse {
  data?: Position[];
}

// ==================== Holdings Types ====================

export interface Holding {
  trdSym: string;              // Trading Symbol
  exc: string;                 // Exchange
  ISIN: string;                // ISIN Number
  hldQty: string;              // Holding Quantity
  brkColQty: string;           // Broker Collateral Quantity
  dpQty: string;               // Demat Quantity
  benQty: string;              // Beneficial Quantity
  unplgdQty: string;           // Unpledged Quantity
  avgPrice: string;            // Average Price
  ltp: string;                 // Last Traded Price
  cstPrc: string;              // Cost Price
  val: string;                 // Current Value
  unrealizedPL: string;        // Unrealized P&L
  realizedPL: string;          // Realized P&L
  dayChange: string;           // Day Change
  dayChangePerc: string;       // Day Change Percentage
  sym: string;                 // Symbol
  assetType?: string;          // Asset Type
  usedQty?: string;            // Used Quantity
  cpName?: string;             // Company Name
}

export interface HoldingsResponse extends BaseResponse {
  data?: Holding[];
}

// ==================== Margin & Limits Types ====================

export interface Limits {
  cashmrg: string;             // Cash Margin
  collatrl: string;            // Collateral
  credlmt: string;             // Credit Limit
  grospnl: string;             // Gross P&L
  csh: string;                 // Cash
  nfoSpnMrg: string;           // NFO Span Margin
  ctegry: string;              // Category
  lmtUtlzd: string;            // Limit Utilized
  ntCsh: string;               // Net Cash
  stat: string;                // Status
  mtm: string;                // Mark to Market
  ntPnl: string;               // Net P&L
  totAvlbl: string;            // Total Available
  rlsblMrg: string;            // Releasable Margin
  payoutAmt: string;           // Payout Amount
  nfoExpMrg: string;           // NFO Exposure Margin
  premim: string;              // Premium
  expMrg: string;              // Exposure Margin
  varelmn: string;             // Value at Risk Element
  seg: string;                 // Segment
  brkg: string;                // Brokerage
  adhocMrg: string;            // Adhoc Margin
  adhocExpMrg: string;         // Adhoc Exposure Margin
  notionlCsh: string;          // Notional Cash
  turnovr: string;             // Turnover
  pendngOdrVal: string;        // Pending Order Value
  nfoCompMrg: string;          // NFO Composite Margin
}

export interface LimitsResponse extends BaseResponse {
  data?: Limits[];
}

export interface MarginRequiredRequest {
  exchange_segment: ExchangeSegment;
  price: string;
  order_type: OrderType;
  product: ProductType;
  quantity: string;
  instrument_token: string;
  transaction_type: TransactionType;
  trigger_price?: string;
}

export interface MarginRequiredResponse extends BaseResponse {
  data?: {
    stat: string;
    required_margin: string;
    available_margin: string;
    rms_rule: string;
    rms_message?: string;
  };
}

// ==================== User Profile Types ====================

export interface Profile {
  ucc: string;                 // Unique Client Code
  name: string;                // Client Name
  email: string;               // Email
  mobile: string;              // Mobile Number
  pan: string;                 // PAN Number
  address: string;             // Address
  city: string;                // City
  state: string;               // State
  pincode: string;             // PIN Code
  dob: string;                 // Date of Birth
  clientType: string;          // Client Type
  dpType: string;              // DP Type
  dpName: string;              // DP Name
  dpId: string;                // DP ID
  bankName: string;            // Bank Name
  bankAccount: string;         // Bank Account Number
  ifsc: string;                // IFSC Code
  branch: string;              // Branch
  activationDate: string;      // Activation Date
  segments: string[];          // Active Segments
  products: string[];          // Active Products
  exchanges: string[];         // Active Exchanges
}

export interface ProfileResponse extends BaseResponse {
  data?: Profile;
}

// ==================== WebSocket Types ====================

export interface WebSocketSubscription {
  instrument_tokens: string[];
  exchange_segment: ExchangeSegment;
}

export interface WebSocketTick {
  tk: string;                  // Token
  lp: number;                  // Last Price
  pc: number;                  // Price Change
  pcp: number;                 // Price Change Percentage
  v: number;                   // Volume
  o: number;                   // Open
  h: number;                   // High
  l: number;                   // Low
  c: number;                   // Close
  ap: number;                  // Average Price
}

// ==================== Error Handling ====================

export interface NeoError extends BaseResponse {
  stat: 'Not_Ok';
  errMsg: string;
  stCode: number;
}

export class KotakNeoAPIError extends Error {
  statusCode: number;
  response: NeoError;

  constructor(error: NeoError) {
    super(error.errMsg);
    this.name = 'KotakNeoAPIError';
    this.statusCode = error.stCode;
    this.response = error;
  }
}

// ==================== Constants ====================

export const EXCHANGE_SEGMENTS = {
  NSE_CASH: 'nse_cm',
  BSE_CASH: 'bse_cm',
  NSE_FO: 'nse_fo',
  BSE_FO: 'bse_fo',
  CDS: 'cde_fo',
  MCX: 'mcx_fo',
  BCD: 'bcd_fo',
} as const;

export const PRODUCT_TYPES = {
  CNC: 'CNC',        // Cash and Carry (Delivery)
  MIS: 'MIS',        // Margin Intraday Square Off
  NRML: 'NRML',      // Normal (F&O)
  CO: 'CO',          // Cover Order
  BO: 'BO',          // Bracket Order
} as const;

export const ORDER_TYPES = {
  LIMIT: 'L',
  MARKET: 'MKT',
  STOP_LOSS: 'SL',
  STOP_LOSS_MARKET: 'SL-M',
} as const;

export const TRANSACTION_TYPES = {
  BUY: 'B',
  SELL: 'S',
} as const;

export const VALIDITY_TYPES = {
  DAY: 'DAY',
  IOC: 'IOC',        // Immediate or Cancel
  EOS: 'EOS',        // End of Season
  GTD: 'GTD',        // Good Till Date
  GTC: 'GTC',        // Good Till Cancelled
} as const;