// NSE API Type Definitions - Based on Real API Response Structures

// ==================== Market Status Types ====================

export interface MarketState {
  market: string;
  marketStatus: 'Open' | 'Closed';
  tradeDate: string;
  index: string;
  last: number | string;
  variation: number | string;
  percentChange: number | string;
  marketStatusMessage: string;
  // Optional fields for currency futures
  expiryDate?: string;
  underlying?: string;
  updated_time?: string;
  tradeDateFormatted?: string;
  slickclass?: string;
}

export interface MarketCap {
  timeStamp: string;
  marketCapinTRDollars: number;
  marketCapinLACCRRupees: number;
  marketCapinCRRupees: number;
  marketCapinCRRupeesFormatted: string;
  marketCapinLACCRRupeesFormatted: string;
  underlying: string;
}

export interface IndicativeNifty50 {
  dateTime: string;
  indicativeTime: string | null;
  indexName: string;
  indexLast: number | null;
  indexPercChange: number | null;
  indexTimeVal: string | null;
  closingValue: number;
  finalClosingValue: number;
  change: number;
  perChange: number;
  status: string;
}

export interface GiftNifty {
  INSTRUMENTTYPE: string;
  SYMBOL: string;
  EXPIRYDATE: string;
  OPTIONTYPE: string;
  STRIKEPRICE: string;
  LASTPRICE: number;
  DAYCHANGE: string;
  PERCHANGE: string;
  CONTRACTSTRADED: number;
  TIMESTMP: string;
  id: string;
}

export interface MarketStatusResponse {
  marketState: MarketState[];
  marketcap: MarketCap;
  indicativenifty50: IndicativeNifty50;
  giftnifty: GiftNifty;
}

// ==================== Stock Quote Types ====================

export interface StockInfo {
  symbol: string;
  companyName: string;
  industry: string;
  activeSeries: string[];
  debtSeries: string[];
  isFNOSec: boolean;
  isCASec: boolean;
  isSLBSec: boolean;
  isDebtSec: boolean;
  isSuspended: boolean;
  tempSuspendedSeries: string[];
  isETFSec: boolean;
  isDelisted: boolean;
  isin: string;
  slb_isin: string;
  listingDate: string;
  isMunicipalBond: boolean;
  isHybridSymbol: boolean;
  segment: string;
  isTop10: boolean;
  identifier?: string;
}

export interface StockMetadata {
  series: string;
  symbol: string;
  isin: string;
  status: string;
  listingDate: string;
  industry: string;
  lastUpdateTime: string;
  pdSectorPe: number;
  pdSymbolPe: number;
  pdSectorInd: string;
  pdSectorIndAll: string[];
}

export interface SecurityInfo {
  boardStatus: string;
  tradingStatus: string;
  tradingSegment: string;
  sessionNo: string;
  slb: string;
  classOfShare: string;
  derivatives: string;
  surveillance: {
    surv: string | null;
    desc: string | null;
  };
  faceValue: number;
  issuedSize: number;
}

export interface PriceInfo {
  lastPrice: number;
  change: number;
  pChange: number;
  previousClose: number;
  open: number;
  close: number;
  vwap: number;
  stockIndClosePrice: number;
  lowerCP: string;
  upperCP: string;
  pPriceBand: string;
  basePrice: number;
  intraDayHighLow: {
    min: number;
    max: number;
    value: number;
  };
  weekHighLow: {
    min: number;
    minDate: string;
    max: number;
    maxDate: string;
    value: number;
  };
  iNavValue: number | null;
  checkINAV: boolean;
  tickSize: number;
  ieq: string;
}

export interface IndustryInfo {
  macro: string;
  sector: string;
  industry: string;
  basicIndustry: string;
}

export interface PreOpenMarketData {
  price: number;
  buyQty: number;
  sellQty: number;
  iep?: boolean;
}

export interface PreOpenMarket {
  preopen: PreOpenMarketData[];
  ato: {
    buy: number;
    sell: number;
  };
  IEP: number;
  totalTradedVolume: number;
  finalPrice: number;
  finalQuantity: number;
  lastUpdateTime: string;
  totalBuyQuantity: number;
  totalSellQuantity: number;
  atoBuyQty: number;
  atoSellQty: number;
  Change: number;
  perChange: number;
  prevClose: number;
}

export interface StockQuoteResponse {
  info: StockInfo;
  metadata: StockMetadata;
  securityInfo: SecurityInfo;
  sddDetails: {
    SDDAuditor: string;
    SDDStatus: string;
  };
  currentMarketType: string;
  priceInfo: PriceInfo;
  industryInfo: IndustryInfo;
  preOpenMarket: PreOpenMarket;
}

// ==================== Index Types ====================

export interface IndexData {
  key: string;
  index: string;
  indexSymbol: string;
  last: number;
  variation: number;
  percentChange: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  yearHigh: number;
  yearLow: number;
  indicativeClose: number;
  pe: string;
  pb: string;
  dy: string;
  declines: string | number;
  advances: string | number;
  unchanged: string | number;
  perChange365d: number;
  perChange30d: number;
  date365dAgo: string | null;
  date30dAgo: string | null;
  previousDay: string | null;
  oneWeekAgo: string | null;
  oneMonthAgoVal: number;
  oneWeekAgoVal: number;
  oneYearAgoVal: number;
  previousDayVal: number;
  chart365dPath: string;
  chart30dPath: string;
  chartTodayPath: string;
}

export interface AllIndicesResponse {
  data: IndexData[];
  timestamp: string;
  advances: number;
  declines: number;
  unchanged: number;
  dates: {
    previousDay: string;
    oneWeekAgo: string;
    oneMonthAgo: string;
    oneYearAgo: string;
  };
}

export interface IndexQuoteMetadata {
  indexName: string;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  last: number;
  percChange: number;
  change: number;
  timeVal: string;
  yearHigh: number;
  yearLow: number;
  indicativeClose: number;
  perChange365d: number;
  perChange30d: number;
  date365dAgo: string;
  date30dAgo: string;
  chartTodayPath: string;
  chart30dPath: string;
  chart365dPath: string;
  totalTradedVolume: number;
}

export interface IndexConstituent {
  symbol: string;
  open: number;
  dayHigh: number;
  dayLow: number;
  lastPrice: number;
  previousClose: number;
  change: number;
  pChange: number;
  totalTradedVolume: number;
  totalTradedValue: number;
  lastUpdateTime: string;
  yearHigh: number;
  yearLow: number;
  perChange365d: number;
  perChange30d: number;
}

export interface IndexQuoteResponse {
  name: string;
  advance: {
    declines: string;
    advances: string;
    unchanged: string;
  };
  timestamp: string;
  data: IndexConstituent[];
  metadata: IndexQuoteMetadata;
  marketStatus: MarketState;
}

// ==================== Search Types ====================

export interface SearchSymbol {
  symbol: string;
  symbol_info: string;
  symbol_suggest: string[];
  activeSeries?: string[];
  meta?: {
    symbol: string;
    companyName: string;
    industry: string;
    isin: string;
  };
}

export interface SearchContent {
  id: string;
  title: string;
  result_type: string;
  result_sub_type?: string;
  symbol_suggest?: string[];
}

export interface SearchResponse {
  symbols: SearchSymbol[];
  mfsymbols: any[];
  search_content: SearchContent[];
  sitemap: any[];
}

// ==================== Corporate Actions Types ====================

export interface CorporateAction {
  symbol: string;
  series: string;
  ind: string;
  faceVal: string;
  subject: string;
  exDate: string;
  recDate: string;
  bcStartDate: string;
  bcEndDate: string;
  ndStartDate: string;
  comp: string;
  isin: string;
  ndEndDate: string;
  caBroadcastDate: string | null;
}

// ==================== Holiday Types ====================

export interface Holiday {
  tradingDate: string;
  weekDay: string;
  description: string;
  Sr_no: number;
}

export interface HolidaysResponse {
  CBM: Holiday[];
  CD: Holiday[];
  CM: Holiday[];
  CMOT: Holiday[];
  COM: Holiday[];
  FO: Holiday[];
  IRD: Holiday[];
  MF: Holiday[];
  NDM: Holiday[];
  NTRP: Holiday[];
  SLBS: Holiday[];
}

// ==================== Block/Bulk Deal Types ====================

export interface BlockDeal {
  symbol: string;
  clientName: string;
  dealType: string;
  quantity: number;
  tradePrice: number;
  tradeDate: string;
  remarks?: string;
}

export interface BlockDealsResponse {
  timestamp: string;
  data: BlockDeal[];
  totalTradedValue: number;
  totalTradedVolume: number;
  'Session 1': {
    advances: number;
    declines: number;
    unchanged: number;
  };
  'Session 2': {
    advances: number;
    declines: number;
    unchanged: number;
  };
  marketStatus: MarketState;
}

// ==================== Pre-Open Market Types ====================

export interface PreOpenSecurity {
  symbol: string;
  series: string;
  corpActionDate: string;
  caAct: string;
  isin: string;
  xDt: string;
  sum_val: number;
  sum_quantity: number;
  finPrice: number;
  caDesc: string;
  trdQnty: number;
  iep: number;
  chnge: number;
  pCng: number;
  pCls: number;
  mktcap: number;
  yPC: number;
  trdValue: number;
  wkhi: number;
  wklo: number;
  wk52hi: number;
  wk52lo: number;
  wkHiDt: string;
  wkLoDt: string;
  wk52HiDt: string;
  wk52LoDt: string;
  pe: number;
  secWtAvgPrice: number;
  trdBuyQnty: number;
  trdSellQnty: number;
  ttlTrdQty: number;
}

export interface PreOpenMarketResponse {
  declines: number;
  unchanged: number;
  data: PreOpenSecurity[];
  advances: number;
  timestamp: string;
  totalTradedValue: number;
  totalmarketcap: number;
  totalTradedVolume: number;
}

// ==================== Helper Types ====================

export interface NSEError {
  message: string;
  statusCode: number;
  endpoint: string;
}

export type MarketStatus = 'PRE_OPEN' | 'OPEN' | 'CLOSED' | 'HOLIDAY';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}