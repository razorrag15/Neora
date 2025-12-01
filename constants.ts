import { Stock, NewsItem, IPO, MarketIndex } from './types';

export const MARKET_INDICES: MarketIndex[] = [
    { symbol: 'NIFTY 50', name: 'Nifty 50', value: 19674.25, change: 123.50, changePercent: 0.63 },
    { symbol: 'SENSEX', name: 'BSE Sensex', value: 66023.24, change: 350.15, changePercent: 0.53 },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', value: 44623.80, change: -85.40, changePercent: -0.19 },
    { symbol: 'NASDAQ', name: 'Nasdaq 100', value: 15123.45, change: 210.50, changePercent: 1.41 },
    { symbol: 'S&P 500', name: 'S&P 500', value: 4378.20, change: 12.40, changePercent: 0.28 },
];

export const MOCK_STOCKS: Stock[] = [
    {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd.',
        price: 2450.50,
        change: 12.30,
        changePercent: 0.50,
        volume: 12000000,
        marketCap: '16.58T',
        sector: 'Energy',
        trend: 'up',
        data: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 2400 + Math.random() * 100 }))
    },
    {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        price: 3450.20,
        change: -15.40,
        changePercent: -0.44,
        volume: 2500000,
        marketCap: '12.4T',
        sector: 'Technology',
        trend: 'down',
        data: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 3500 - Math.random() * 80 }))
    },
    {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd.',
        price: 1640.80,
        change: 8.20,
        changePercent: 0.50,
        volume: 5600000,
        marketCap: '9.2T',
        sector: 'Banking',
        trend: 'up',
        data: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 1600 + Math.random() * 50 }))
    },
    {
        symbol: 'INFY',
        name: 'Infosys Ltd.',
        price: 1420.00,
        change: -5.00,
        changePercent: -0.35,
        volume: 4100000,
        marketCap: '5.8T',
        sector: 'Technology',
        trend: 'neutral',
        data: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 1410 + Math.random() * 30 }))
    },
    {
        symbol: 'ICICIBANK',
        name: 'ICICI Bank',
        price: 950.40,
        change: 15.60,
        changePercent: 1.67,
        volume: 8900000,
        marketCap: '6.5T',
        sector: 'Banking',
        trend: 'up',
        data: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 920 + Math.random() * 60 }))
    }
];

export const MOCK_NEWS: NewsItem[] = [
    {
        id: '1',
        headline: "RBI announces major policy changes affecting banking sector liquidity.",
        source: "Economic Times",
        timeAgo: "2h ago",
        sentiment: "neutral",
        summary: "The Reserve Bank of India has maintained the repo rate at 6.5%, signaling a pause in rate hikes."
    },
    {
        id: '2',
        headline: "Reliance Industries to demerge financial services arm, sets record date.",
        source: "Bloomberg",
        timeAgo: "4h ago",
        sentiment: "positive",
        summary: "Shareholders react positively as value unlocking potential becomes clear."
    },
    {
        id: '3',
        headline: "Tech sector faces headwinds as global demand softens.",
        source: "Reuters",
        timeAgo: "6h ago",
        sentiment: "negative",
        summary: "Major IT giants report slower deal pipeline growth for Q3."
    }
];

export const MOCK_IPOS: IPO[] = [
    {
        company: "Tech Innovations Ltd",
        priceRange: "₹450 - ₹500",
        openDate: "2024-12-20",
        closeDate: "2024-12-22",
        status: "upcoming",
        gmp: "+₹85"
    },
    {
        company: "Green Energy Solutions",
        priceRange: "₹120 - ₹135",
        openDate: "2024-11-28",
        closeDate: "2024-11-30",
        status: "open",
        gmp: "+₹45"
    }
];