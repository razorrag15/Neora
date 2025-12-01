import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Newspaper, 
  Settings, 
  Menu, 
  Bell, 
  Search, 
  Moon, 
  Sun,
  Rocket,
  Sparkles,
  ChevronDown,
  Briefcase,
  Eye,
  Filter,
  PieChart,
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  Calendar,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  LogOut,
  TrendingUp,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { View, Stock } from './types';
import { MOCK_STOCKS, MOCK_NEWS, MOCK_IPOS, MARKET_INDICES } from './constants';
import StockCard from './components/StockCard';
import GeminiAssistant from './components/GeminiAssistant';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// --- Components ---

const IndicesBar = () => (
  <div className="w-full bg-surface-primary/80 dark:bg-surface-glass backdrop-blur-lg border-b border-border-light overflow-hidden whitespace-nowrap py-3 hidden md:flex z-20 shadow-sm relative">
    <div className="flex items-center animate-marquee space-x-16 px-4">
      {[...MARKET_INDICES, ...MARKET_INDICES, ...MARKET_INDICES].map((index, i) => ( 
        <div key={`${index.symbol}-${i}`} className="flex items-center space-x-3 text-sm group cursor-pointer">
          <span className="font-bold text-text-secondary group-hover:text-accent-main transition-colors font-display tracking-wider">{index.symbol}</span>
          <span className="font-mono text-text-primary font-semibold">{index.value.toLocaleString()}</span>
          <span className={`flex items-center font-bold text-xs px-2 py-0.5 rounded-full ${index.change >= 0 ? 'text-market-gain bg-market-gain/10' : 'text-market-loss bg-market-loss/10'}`}>
             {index.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
             {Math.abs(index.changePercent).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none"></div>
    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none"></div>
  </div>
);

const BackgroundEffects = () => {
  // Generate random particles only once on mount to avoid re-rendering flicker
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 2, // 2px to 5px
      duration: Math.random() * 15 + 15, // 15s to 30s
      delay: Math.random() * -30, // Negative delay to start mid-animation
      opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5
      // Randomly choose between accent main and secondary colors via CSS variables
      colorVar: Math.random() > 0.6 ? 'var(--accent-main)' : 'var(--accent-secondary)'
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-bg-primary transition-colors duration-700">
       {/* Flowing Gradient Base */}
       <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary bg-[length:400%_400%] animate-gradient-flow opacity-100 dark:opacity-100"></div>

       {/* Animated Grid that moves slowly */}
       <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] dark:opacity-[0.1] animate-grid-move mix-blend-overlay dark:mix-blend-normal"></div>
       
       {/* Floating Particles */}
       {particles.map((p) => (
         <div 
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.colorVar,
              opacity: p.opacity,
              animation: `particle-float ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              filter: 'blur(1px)',
              boxShadow: `0 0 ${p.size * 2}px ${p.colorVar}`
            }}
         />
       ))}

       {/* Ambient Light Orbs - Refined for elegance and subtlety */}
       {/* Orb 1: Main Accent (Green or Purple) */}
       <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-accent-main rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-5 dark:opacity-10 animate-blob" />
       
       {/* Orb 2: Secondary Accent (Gold or Orange) */}
       <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-accent-secondary rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-5 dark:opacity-10 animate-blob animation-delay-2000" />
       
       {/* Orb 3: Floating Center - Very subtle */}
       <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-accent-main rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] opacity-0 dark:opacity-5 animate-blob animation-delay-4000" />
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);

  useEffect(() => {
    // Check system preference or default to Dark mode for the "Royal" feel if not set
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleStockClick = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setView('stock-detail');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'markets', label: 'Markets', icon: Globe },
    { id: 'stocks', label: 'Stocks', icon: Activity },
    { id: 'corporate-actions', label: 'Actions', icon: Calendar },
    { id: 'ipos', label: 'IPOs', icon: Rocket },
    { id: 'watchlists', label: 'Watchlists', icon: Eye },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'screener', label: 'Screener', icon: Filter },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'research', label: 'Research', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'learn', label: 'Academy', icon: GraduationCap },
  ];

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-8 animate-fade-in relative z-10 pb-24">
        {/* Royal Welcome Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-surface-primary dark:bg-surface-glass border border-border-light p-8 md:p-12 shadow-3d transition-all group">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-main/5 to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                         <span className="px-3 py-1 rounded-full bg-accent-main/10 text-accent-main text-xs font-bold uppercase tracking-widest border border-accent-main/20">
                            Market Status: Live
                         </span>
                         <span className="text-xs text-text-tertiary font-medium">Updated 1m ago</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-4 tracking-tight leading-tight">
                        Royal Market <br/><span className="bg-clip-text text-transparent bg-gradient-royal">Intelligence Suite</span>
                    </h1>
                    <p className="text-text-secondary text-lg font-light max-w-xl leading-relaxed">
                        Welcome back. Your portfolio has outperformed the <span className="font-bold text-text-primary">NIFTY 50</span> by <span className="text-market-gain font-bold">+1.2%</span> today.
                    </p>
                </div>
                
                {/* Net Worth Card */}
                <div className="w-full md:w-auto transform hover:scale-105 transition-transform duration-300">
                    <div 
                      onClick={() => setView('portfolio')}
                      className="p-6 bg-gradient-card rounded-2xl border border-border-light shadow-3d cursor-pointer group/card relative overflow-hidden min-w-[280px]"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:opacity-20 transition-opacity">
                            <Briefcase size={80} className="text-accent-secondary" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-accent-main/10 rounded-lg text-accent-main">
                                    <Briefcase size={18} />
                                </div>
                                <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">Total Net Worth</p>
                            </div>
                            <p className="text-4xl font-mono font-bold text-text-primary tracking-tight mt-2">₹12,45,680</p>
                            <div className="flex items-center gap-3 mt-4">
                                <span className="text-sm text-market-gain flex items-center gap-1 font-bold bg-market-gain/10 px-2 py-1 rounded-md">
                                    <ArrowUpRight size={14} /> +₹28,450
                                </span>
                                <span className="text-xs text-text-tertiary">Today's P&L</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Top Movers Section */}
        <section>
            <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-text-primary">Market Movers</h2>
                  <p className="text-text-tertiary mt-1">Stocks with highest trading volume today</p>
                </div>
                <button 
                  onClick={() => setView('stocks')}
                  className="px-5 py-2 rounded-full bg-surface-elevated hover:bg-accent-main hover:text-white text-text-primary text-sm font-bold transition-all shadow-sm border border-border-light flex items-center gap-2 group"
                >
                    View All Assets <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_STOCKS.slice(0, 4).map(stock => (
                    <StockCard key={stock.symbol} stock={stock} onClick={handleStockClick} />
                ))}
            </div>
        </section>

        {/* Main Grid: News & Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             {/* News Feed - Takes 8 cols */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-display font-bold text-text-primary flex items-center gap-3">
                        <Newspaper size={24} className="text-accent-secondary" />
                        Intelligence Feed
                    </h2>
                </div>
                
                <div className="grid gap-6">
                    {MOCK_NEWS.slice(0, 3).map(news => (
                        <div key={news.id} className="card-royal p-0 flex flex-col md:flex-row cursor-pointer group h-full md:h-48" onClick={() => setView('news')}>
                            <div className="w-full md:w-64 h-48 md:h-full bg-bg-secondary overflow-hidden shrink-0 relative">
                                <img src={`https://picsum.photos/seed/${news.id}/800/600`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" alt="News" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-black dark:text-white shadow-sm">
                                        {news.source}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-center relative">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-medium text-text-tertiary flex items-center gap-1 bg-surface-elevated px-2 py-1 rounded">
                                        <Calendar size={12} /> {news.timeAgo}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                      news.sentiment === 'positive' ? 'bg-market-gain/10 text-market-gain' : 'bg-market-loss/10 text-market-loss'
                                    }`}>
                                        {news.sentiment === 'positive' ? <TrendingUp size={12}/> : <Activity size={12}/>}
                                        {news.sentiment}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-main transition-colors leading-snug">{news.headline}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">{news.summary}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

             {/* Sidebar Widgets - Takes 4 cols */}
            <div className="lg:col-span-4 space-y-8">
                 {/* IPO Widget */}
                 <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-display font-bold text-text-primary">IPO Radar</h2>
                    </div>
                    <div className="card-royal p-8 relative overflow-hidden group border-accent-secondary/30">
                        {/* Decorative background for IPO */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-accent-secondary/10 rounded-full -mr-12 -mt-12 blur-3xl transition-all group-hover:bg-accent-secondary/20 animate-pulse-slow"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-surface-elevated rounded-2xl flex items-center justify-center text-2xl font-bold font-display shadow-inner-light text-text-primary border border-border-light">
                                    {MOCK_IPOS[1].company.charAt(0)}
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-white bg-market-gain px-3 py-1 rounded-full shadow-lg shadow-market-gain/30 animate-pulse mb-1">
                                        LIVE NOW
                                    </span>
                                    <span className="text-[10px] text-text-tertiary">Closes {MOCK_IPOS[1].closeDate}</span>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-text-primary mb-2 leading-tight">{MOCK_IPOS[1].company}</h3>
                            <p className="text-sm text-text-secondary mb-6 font-mono">{MOCK_IPOS[1].priceRange}</p>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-surface-elevated rounded-xl border border-border-light">
                                    <span className="text-xs text-text-secondary font-medium">Subscription</span>
                                    <span className="text-sm font-bold text-text-primary">2.45x</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-surface-elevated rounded-xl border border-border-light">
                                    <span className="text-xs text-text-secondary font-medium">Grey Market Premium</span>
                                    <span className="text-sm font-mono font-bold text-market-gain">{MOCK_IPOS[1].gmp}</span>
                                </div>
                            </div>
                            
                            <button className="w-full mt-6 py-3 bg-text-primary text-bg-primary rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
                                View Details <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Assistant Promo */}
                <div className="card-royal p-8 bg-gradient-royal text-white relative overflow-hidden border-none shadow-xl shadow-accent-glow/40 group">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/30">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold font-display mb-3">NEORA AI</h3>
                        <p className="text-white/80 text-sm mb-6 leading-relaxed">Your personal royal financial analyst. Get instant insights on portfolio health and market trends.</p>
                        <button 
                            onClick={() => setIsAssistantOpen(true)}
                            className="w-full py-3.5 bg-white text-accent-main rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-1 transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            Start Conversation <Sparkles size={14} />
                        </button>
                    </div>
                    {/* Abstract circles */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                </div>
            </div>
        </div>
    </div>
  );

  const StockListView = () => (
    <div className="space-y-8 animate-fade-in relative z-10">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
             <div>
                <h2 className="text-4xl font-display font-bold text-text-primary mb-2">Stock Explorer</h2>
                <p className="text-text-secondary text-lg">Real-time quotes across global exchanges.</p>
             </div>
             <div className="flex gap-2 bg-surface-elevated p-1.5 rounded-2xl border border-border-light shadow-inner-light">
                 {['NSE', 'BSE', 'US', 'CRYPTO'].map((tab, i) => (
                    <button key={tab} className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${i === 0 ? 'bg-accent-main text-white shadow-lg shadow-accent-glow' : 'text-text-secondary hover:bg-surface-primary hover:text-text-primary'}`}>
                        {tab}
                    </button>
                 ))}
             </div>
        </div>
        
        <div className="card-royal overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-surface-elevated border-b border-border-light">
                        <tr>
                            <th className="text-left p-6 text-xs font-bold text-text-tertiary uppercase tracking-widest">Symbol</th>
                            <th className="text-right p-6 text-xs font-bold text-text-tertiary uppercase tracking-widest">Price</th>
                            <th className="text-right p-6 text-xs font-bold text-text-tertiary uppercase tracking-widest">Change</th>
                            <th className="text-right p-6 text-xs font-bold text-text-tertiary uppercase tracking-widest">Volume</th>
                            <th className="text-right p-6 text-xs font-bold text-text-tertiary uppercase tracking-widest">Mkt Cap</th>
                            <th className="text-center p-6 text-xs font-bold text-text-tertiary uppercase tracking-widest">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                        {MOCK_STOCKS.map(stock => (
                            <tr 
                                key={stock.symbol} 
                                className="hover:bg-surface-elevated/50 transition-colors cursor-pointer group"
                                onClick={() => handleStockClick(stock.symbol)}
                            >
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border-light flex items-center justify-center font-bold text-text-secondary text-xs shadow-sm">
                                            {stock.symbol[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-text-primary font-display text-lg group-hover:text-accent-main transition-colors">{stock.symbol}</span>
                                            <span className="text-xs text-text-tertiary font-medium">{stock.name}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-right font-mono text-text-primary font-bold text-lg">₹{stock.price.toFixed(2)}</td>
                                <td className="p-6 text-right">
                                    <span className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm inline-flex items-center gap-1 ${stock.change >= 0 ? 'bg-market-gain/10 text-market-gain' : 'bg-market-loss/10 text-market-loss'}`}>
                                        {stock.change > 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                                        {Math.abs(stock.change).toFixed(2)}%
                                    </span>
                                </td>
                                <td className="p-6 text-right font-mono text-text-secondary">{(stock.volume / 1000000).toFixed(2)}M</td>
                                <td className="p-6 text-right font-mono text-text-secondary font-medium">{stock.marketCap}</td>
                                <td className="p-6 text-center">
                                    <div className="h-10 w-28 ml-auto opacity-80 group-hover:opacity-100 transition-opacity">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={stock.data}>
                                                <defs>
                                                    <linearGradient id={`grad-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={stock.change >= 0 ? 'var(--gain-green)' : 'var(--loss-red)'} stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor={stock.change >= 0 ? 'var(--gain-green)' : 'var(--loss-red)'} stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="value" 
                                                    stroke={stock.change >= 0 ? 'var(--gain-green)' : 'var(--loss-red)'} 
                                                    strokeWidth={2} 
                                                    fill={`url(#grad-${stock.symbol})`} 
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const StockDetailView = () => {
    const stock = MOCK_STOCKS.find(s => s.symbol === selectedStockSymbol);
    if (!stock) return <PlaceholderView title="Stock Not Found" icon={Activity} description="The stock you are looking for is not currently in our database." />;

    const isPositive = stock.change >= 0;

    return (
      <div className="space-y-8 animate-fade-in relative z-10 pb-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('stocks')} className="p-2 hover:bg-surface-elevated rounded-xl transition-colors border border-transparent hover:border-border-light">
              <ArrowLeft size={24} className="text-text-secondary" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                 <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">{stock.symbol}</h1>
                 <span className="px-2 py-1 rounded bg-surface-elevated border border-border-light text-xs font-bold text-text-tertiary">NSE</span>
              </div>
              <p className="text-text-secondary text-lg mt-1">{stock.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-5xl font-mono font-bold text-text-primary tracking-tighter">₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <div className={`flex items-center gap-2 mt-2 font-bold text-lg ${isPositive ? 'text-market-gain' : 'text-market-loss'}`}>
               {isPositive ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
               <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
               <span>({stock.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Main Chart Card */}
        <div className="card-royal p-6 md:p-8 h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                   {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((time, i) => (
                      <button key={time} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${i === 2 ? 'bg-accent-main text-white shadow-md' : 'text-text-secondary hover:bg-surface-elevated'}`}>
                          {time}
                      </button>
                   ))}
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated text-text-primary text-sm font-bold hover:bg-surface-primary border border-border-light transition-colors">
                        <Activity size={16} /> Indicators
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated text-text-primary text-sm font-bold hover:bg-surface-primary border border-border-light transition-colors">
                        <Settings size={16} />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stock.data}>
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? 'var(--gain-green)' : 'var(--loss-red)'} stopOpacity={0.2}/>
                                <stop offset="95%" stopColor={isPositive ? 'var(--gain-green)' : 'var(--loss-red)'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" opacity={0.5} />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--text-tertiary)', fontSize: 12}} dy={10} />
                        <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: 'var(--text-tertiary)', fontSize: 12}} domain={['auto', 'auto']} dx={10} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'var(--surface-primary)', 
                                borderColor: 'var(--border-light)', 
                                borderRadius: '12px',
                                boxShadow: 'var(--shadow-3d)',
                                color: 'var(--text-primary)'
                            }}
                            itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                            formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={isPositive ? 'var(--gain-green)' : 'var(--loss-red)'} 
                            strokeWidth={3}
                            fill="url(#chartGradient)" 
                            activeDot={{ r: 6, fill: isPositive ? 'var(--gain-green)' : 'var(--loss-red)', stroke: 'var(--surface-primary)', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-royal p-8">
                <h3 className="text-xl font-bold font-display text-text-primary mb-6">Key Statistics</h3>
                <div className="space-y-5">
                    <div className="flex justify-between items-center">
                        <span className="text-text-tertiary text-sm">Market Cap</span>
                        <span className="font-mono font-bold text-text-primary">{stock.marketCap}</span>
                    </div>
                    <div className="h-px bg-border-light w-full"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-text-tertiary text-sm">Volume</span>
                        <span className="font-mono font-bold text-text-primary">{(stock.volume / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="h-px bg-border-light w-full"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-text-tertiary text-sm">Sector</span>
                        <span className="font-bold text-text-primary">{stock.sector}</span>
                    </div>
                    <div className="h-px bg-border-light w-full"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-text-tertiary text-sm">52W High</span>
                        <span className="font-mono font-bold text-text-primary">₹{(stock.price * 1.2).toFixed(2)}</span>
                    </div>
                </div>
            </div>

             <div className="card-royal p-8 md:col-span-2">
                <h3 className="text-xl font-bold font-display text-text-primary mb-6">About {stock.name}</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                    {stock.name} is a leading player in the {stock.sector} sector. The company has shown resilient performance with steady growth in revenue and market share over the last few quarters. Analysts remain optimistic about its long-term trajectory given the robust fundamental indicators.
                </p>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-accent-main text-white rounded-xl font-bold shadow-lg shadow-accent-glow hover:translate-y-[-2px] transition-all">
                        Buy {stock.symbol}
                    </button>
                    <button className="px-6 py-3 bg-surface-elevated text-text-primary rounded-xl font-bold border border-border-light hover:bg-surface-primary transition-colors">
                        Add to Watchlist
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const PlaceholderView = ({ title, icon: Icon, description }: { title: string, icon: any, description: string }) => (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8 animate-fade-in relative z-10">
          <div className="w-32 h-32 bg-surface-primary rounded-[2rem] flex items-center justify-center mb-8 shadow-3d border border-border-light relative group hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-accent-main/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>
              <Icon size={64} className="text-accent-main relative z-10 drop-shadow-md" />
          </div>
          <h2 className="text-5xl font-display font-bold text-text-primary mb-6">{title}</h2>
          <p className="text-text-secondary max-w-xl mb-12 text-xl leading-relaxed font-light">{description}</p>
          <div className="flex gap-6">
              <button onClick={() => setView('dashboard')} className="px-8 py-4 rounded-xl border border-border-light text-text-primary hover:bg-surface-elevated transition-colors bg-surface-primary font-bold shadow-sm">
                  Back to Dashboard
              </button>
              <button onClick={() => setIsAssistantOpen(true)} className="px-8 py-4 rounded-xl bg-gradient-main text-white shadow-xl shadow-accent-glow hover:translate-y-[-2px] transition-all flex items-center gap-3 font-bold">
                  <Sparkles size={20} /> Ask NEORA
              </button>
          </div>
      </div>
  );

  // --- Layout Structure ---

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-body transition-colors duration-700 flex overflow-hidden selection:bg-accent-main selection:text-white">
        
        {/* Animated Background System */}
        <BackgroundEffects />

        {/* Sidebar (Desktop) - Conditional styling based on mode */}
        <aside 
            className={`hidden md:flex flex-col border-r border-border-light h-screen z-40 transition-all duration-300 ${isSidebarCollapsed ? 'w-24' : 'w-72'} 
            ${isDarkMode ? 'bg-surface-glass backdrop-blur-xl border-r border-white/10' : 'bg-surface-primary shadow-xl border-r border-gray-100'}`}
        >
            <div className="h-24 flex items-center justify-center relative">
                 <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-main flex items-center justify-center text-white font-bold font-display text-3xl shadow-lg shadow-accent-glow group-hover:scale-110 transition-transform duration-300">
                        N
                    </div>
                    {!isSidebarCollapsed && <span className="font-display font-bold text-2xl tracking-tight text-text-primary animate-fade-in">NEORA</span>}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
                <div className={`text-xs font-bold text-text-tertiary uppercase tracking-widest px-4 mb-2 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>Main Menu</div>
                {navItems.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setView(item.id as View)}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                            view === item.id 
                            ? 'bg-gradient-royal text-white shadow-lg shadow-accent-glow' 
                            : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary hover:shadow-sm'
                        } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <item.icon size={22} className={`relative z-10 transition-transform group-hover:scale-110 ${view === item.id ? 'text-white' : 'text-text-tertiary group-hover:text-accent-main'}`} />
                        {!isSidebarCollapsed && <span className={`text-sm font-bold relative z-10 ${view === item.id ? 'text-white' : ''}`}>{item.label}</span>}
                    </button>
                ))}
            </div>

            <div className="p-6 border-t border-border-light/50">
                 <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="w-full flex items-center justify-center p-4 text-text-tertiary hover:bg-surface-elevated rounded-2xl transition-all hover:text-text-primary"
                 >
                    {isSidebarCollapsed ? <ChevronRight size={24} /> : (
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-main to-accent-secondary p-[2px]">
                            <div className="w-full h-full rounded-full bg-surface-primary flex items-center justify-center overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                            </div>
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-bold text-text-primary">John Doe</p>
                          <p className="text-xs text-accent-main font-medium">Pro Member</p>
                        </div>
                        <LogOut size={18} className="text-text-tertiary hover:text-loss-red transition-colors"/>
                      </div>
                    )}
                 </button>
            </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
            
            {/* Header - Transparent Glass */}
            <header className="h-24 bg-transparent z-30 flex items-center justify-between px-6 md:px-10 transition-all">
                <div className="flex items-center gap-4 md:hidden">
                     <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-text-primary bg-surface-primary/50 backdrop-blur rounded-xl border border-border-light">
                         <Menu size={24} />
                     </button>
                </div>

                {/* Desktop Search - Floating Glass */}
                <div className="hidden md:flex relative group w-[500px] transition-all duration-300 focus-within:w-[550px]">
                    <div className="absolute inset-0 bg-surface-primary/50 dark:bg-surface-glass backdrop-blur-md rounded-2xl shadow-sm border border-border-light group-focus-within:shadow-lg group-focus-within:border-accent-main/50 transition-all"></div>
                    <input 
                        type="text" 
                        placeholder="Search for stocks, news, or insights..." 
                        className="relative z-10 w-full bg-transparent py-4 pl-14 pr-4 text-sm focus:outline-none placeholder:text-text-tertiary text-text-primary font-medium"
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5 group-focus-within:text-accent-main transition-colors z-10" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                        <span className="text-[10px] font-bold text-text-tertiary bg-surface-elevated border border-border-light px-2 py-1 rounded-lg">⌘ K</span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 md:gap-6 bg-surface-primary/50 dark:bg-surface-glass backdrop-blur-md p-2 rounded-2xl border border-border-light shadow-sm">
                    <button 
                        onClick={() => setIsAssistantOpen(true)}
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-main text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-accent-glow hover:-translate-y-0.5 transition-all"
                    >
                        <Sparkles size={16} />
                        <span>AI Assistant</span>
                    </button>

                    <div className="h-8 w-px bg-border-light hidden md:block"></div>

                    <button className="p-2.5 text-text-secondary hover:text-accent-main hover:bg-surface-elevated rounded-xl transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-market-loss rounded-full ring-2 ring-surface-primary animate-pulse"></span>
                    </button>

                    <button 
                        onClick={toggleTheme} 
                        className="p-2.5 text-text-secondary hover:text-accent-main hover:bg-surface-elevated rounded-xl transition-all"
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            {/* Indices Bar (Desktop) */}
            <IndicesBar />

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth relative z-10 custom-scrollbar">
                <div className="max-w-[1800px] mx-auto min-h-[calc(100vh-200px)]">
                    {view === 'dashboard' && <DashboardView />}
                    {view === 'stocks' && <StockListView />}
                    {view === 'stock-detail' && <StockDetailView />}
                    {view === 'ipos' && <PlaceholderView title="IPO Center" icon={Rocket} description="Detailed analysis, live subscription status, and GMP for upcoming IPOs." />}
                    {view === 'news' && <PlaceholderView title="Market News" icon={Newspaper} description="Real-time curated news from top financial sources with AI sentiment analysis." />}
                    {view === 'portfolio' && <PlaceholderView title="My Portfolio" icon={Briefcase} description="Track your net worth, analyze holdings, and view performance reports." />}
                    {/* Other Placeholders */}
                    {view === 'markets' && <PlaceholderView title="Global Markets" icon={Globe} description="Deep dive into global indices, currencies, commodities, and sector performance." />}
                    {view === 'corporate-actions' && <PlaceholderView title="Corporate Actions" icon={Calendar} description="Track upcoming dividends, splits, bonus issues, and rights issues." />}
                    {view === 'watchlists' && <PlaceholderView title="My Watchlists" icon={Eye} description="Create and manage multiple watchlists. Track your favorite stocks and sectors." />}
                    {view === 'screener' && <PlaceholderView title="Stock Screener" icon={Filter} description="Filter stocks based on 50+ fundamental and technical parameters." />}
                    {view === 'analytics' && <PlaceholderView title="Advanced Analytics" icon={PieChart} description="Technical charts, F&O analysis, Option Chain, and market breadth indicators." />}
                    {view === 'research' && <PlaceholderView title="Research Reports" icon={BookOpen} description="Access premium research reports, sector analysis, and investment themes." />}
                    {view === 'community' && <PlaceholderView title="Traders Community" icon={Users} description="Connect with other investors, share ideas, and participate in prediction contests." />}
                    {view === 'learn' && <PlaceholderView title="NEORA Academy" icon={GraduationCap} description="Master the markets with our comprehensive courses and tutorials." />}
                </div>
                
                {/* Footer */}
                <div className="max-w-[1800px] mx-auto mt-12 pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center text-xs text-text-tertiary pb-8">
                    <p className="font-medium">© 2025 NEORA Intelligence. Royal Financial Suite.</p>
                    <div className="flex gap-8 mt-4 md:mt-0 font-medium">
                        <a href="#" className="hover:text-accent-main transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-accent-main transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-accent-main transition-colors">Support</a>
                    </div>
                </div>
            </main>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className="absolute left-0 top-0 bottom-0 w-80 bg-bg-primary shadow-2xl flex flex-col animate-slide-in-left border-r border-border-light">
                    <div className="p-6 border-b border-border-light flex justify-between items-center bg-surface-primary">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center text-white font-bold font-display text-xl">N</div>
                            <span className="font-display font-bold text-2xl text-text-primary">NEORA</span>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-surface-elevated"><X size={20} className="text-text-secondary" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                        {navItems.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => { setView(item.id as View); setIsMobileMenuOpen(false); }}
                                className={`w-full text-left px-5 py-4 rounded-xl text-sm font-bold flex items-center gap-4 transition-colors ${
                                  view === item.id 
                                  ? 'bg-gradient-royal text-white shadow-lg' 
                                  : 'text-text-secondary hover:bg-surface-elevated'
                                }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* AI Assistant Sidebar */}
        <GeminiAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
        
        {/* Mobile AI FAB */}
        <button 
            onClick={() => setIsAssistantOpen(true)}
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-main text-white rounded-full shadow-2xl shadow-accent-glow flex items-center justify-center z-40 hover:scale-110 transition-transform active:scale-95 border-2 border-white/20"
        >
            <Sparkles size={24} />
        </button>
    </div>
  );
};

export default App;