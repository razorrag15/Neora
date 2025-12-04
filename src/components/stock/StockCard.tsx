import React from 'react';
import { Stock } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StockCardProps {
  stock: Stock;
  onClick?: (symbol: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.change >= 0;
  
  return (
    <div 
      onClick={() => onClick?.(stock.symbol)}
      className="card-royal p-6 relative group cursor-pointer"
    >
        {/* Decorative background element for Light Mode (Subtle Gradient Corner) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-main/5 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-all duration-500 group-hover:scale-125 hidden md:block dark:hidden"></div>
        
        {/* Glow effect for Dark Mode */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden dark:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-main/10 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-main to-transparent opacity-50"></div>
        </div>

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <h3 className="font-display font-bold text-xl text-text-primary tracking-tight group-hover:text-accent-main transition-colors">{stock.symbol}</h3>
                <p className="text-xs text-text-secondary font-medium truncate max-w-[140px] mt-1">{stock.name}</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-surface-elevated border border-border-light text-text-tertiary uppercase tracking-wider shadow-sm group-hover:border-accent-main/30 transition-colors">
                NSE
            </span>
        </div>

        <div className="flex justify-between items-end mb-5 relative z-10">
            <div>
                <span className="block font-mono text-3xl font-bold text-text-primary tracking-tight">
                    ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <div className={`flex items-center space-x-1.5 mt-1.5 font-mono text-sm font-bold ${isPositive ? 'text-market-gain' : 'text-market-loss'} transition-all duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]`}>
                    {isPositive ? <TrendingUp size={16} strokeWidth={3} /> : <TrendingDown size={16} strokeWidth={3} />}
                    <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                    <span className="opacity-70 text-xs ml-1">({stock.changePercent.toFixed(2)}%)</span>
                </div>
            </div>
        </div>

        {/* Mini Chart */}
        <div className="h-16 w-full opacity-60 group-hover:opacity-100 transition-all duration-500 filter group-hover:drop-shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stock.data}>
                    <defs>
                        <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isPositive ? 'var(--gain-green)' : 'var(--loss-red)'} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={isPositive ? 'var(--gain-green)' : 'var(--loss-red)'} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={isPositive ? 'var(--gain-green)' : 'var(--loss-red)'} 
                        fillOpacity={1} 
                        fill={`url(#gradient-${stock.symbol})`} 
                        strokeWidth={2.5}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default StockCard;