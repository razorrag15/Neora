export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: string;
    sector: string;
    trend: 'up' | 'down' | 'neutral';
    data: { time: string; value: number }[]; // Sparkline data
}

export interface NewsItem {
    id: string;
    headline: string;
    source: string;
    timeAgo: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    summary: string;
}

export interface IPO {
    company: string;
    priceRange: string;
    openDate: string;
    closeDate: string;
    status: 'upcoming' | 'open' | 'closed';
    gmp: string; // Grey Market Premium
}

export interface MarketIndex {
    symbol: string;
    name: string;
    value: number;
    change: number;
    changePercent: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
    isLoading?: boolean;
}

export type View = 
  | 'dashboard' 
  | 'markets' 
  | 'stocks' 
  | 'stock-detail'
  | 'ipos' 
  | 'corporate-actions'
  | 'watchlists' 
  | 'portfolio' 
  | 'screener' 
  | 'analytics' 
  | 'news' 
  | 'research'
  | 'trading'
  | 'community' 
  | 'learn' 
  | 'alerts' 
  | 'settings';