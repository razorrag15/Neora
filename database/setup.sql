-- ============================================================================
-- NEORA Stock Market Intelligence Platform
-- Complete Database Setup Script with Reset Capability
-- ============================================================================
-- 
-- This script can be run multiple times safely. It will:
-- 1. Clean up existing database objects (if any)
-- 2. Create fresh schema with all tables, triggers, functions, and policies
-- 3. Set up proper security and indexes
--
-- USAGE:
-- 1. Open Supabase SQL Editor
-- 2. Copy/paste this entire script
-- 3. Click "Run" to execute
-- 
-- ============================================================================

-- ============================================================================
-- SECTION 1: CLEANUP (Safe to run multiple times)
-- ============================================================================

-- Drop existing policies
DO $$ 
BEGIN
    -- Profiles policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
    
    -- User preferences policies
    DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
    DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
    
    -- Watchlists policies
    DROP POLICY IF EXISTS "Users can view their own watchlists" ON public.watchlists;
    DROP POLICY IF EXISTS "Users can create their own watchlists" ON public.watchlists;
    DROP POLICY IF EXISTS "Users can update their own watchlists" ON public.watchlists;
    DROP POLICY IF EXISTS "Users can delete their own watchlists" ON public.watchlists;
    
    -- Watchlist items policies
    DROP POLICY IF EXISTS "Users can view their own watchlist items" ON public.watchlist_items;
    DROP POLICY IF EXISTS "Users can add items to their watchlists" ON public.watchlist_items;
    DROP POLICY IF EXISTS "Users can update their watchlist items" ON public.watchlist_items;
    DROP POLICY IF EXISTS "Users can delete their watchlist items" ON public.watchlist_items;
    
    -- Portfolio holdings policies
    DROP POLICY IF EXISTS "Users can view their own holdings" ON public.portfolio_holdings;
    DROP POLICY IF EXISTS "Users can create their own holdings" ON public.portfolio_holdings;
    DROP POLICY IF EXISTS "Users can update their own holdings" ON public.portfolio_holdings;
    DROP POLICY IF EXISTS "Users can delete their own holdings" ON public.portfolio_holdings;
    
    -- Trades policies
    DROP POLICY IF EXISTS "Users can view their own trades" ON public.trades;
    DROP POLICY IF EXISTS "Users can create their own trades" ON public.trades;
    DROP POLICY IF EXISTS "Admins can view all trades" ON public.trades;
    
    -- Price alerts policies
    DROP POLICY IF EXISTS "Users can view their own alerts" ON public.price_alerts;
    DROP POLICY IF EXISTS "Users can create their own alerts" ON public.price_alerts;
    DROP POLICY IF EXISTS "Users can update their own alerts" ON public.price_alerts;
    DROP POLICY IF EXISTS "Users can delete their own alerts" ON public.price_alerts;
    
    -- Activity logs policies
    DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;
    
    -- API usage policies
    DROP POLICY IF EXISTS "Users can view their own API usage" ON public.api_usage;
    DROP POLICY IF EXISTS "Admins can view all API usage" ON public.api_usage;
    
    -- Market data cache policies
    DROP POLICY IF EXISTS "Anyone can read market data cache" ON public.market_data_cache;
END $$;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
DROP TRIGGER IF EXISTS update_watchlists_updated_at ON public.watchlists;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.get_portfolio_summary(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_expired_cache() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_old_activity_logs() CASCADE;

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.market_data_cache CASCADE;
DROP TABLE IF EXISTS public.api_usage CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.price_alerts CASCADE;
DROP TABLE IF EXISTS public.trades CASCADE;
DROP TABLE IF EXISTS public.portfolio_holdings CASCADE;
DROP TABLE IF EXISTS public.watchlist_items CASCADE;
DROP TABLE IF EXISTS public.watchlists CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================================
-- SECTION 2: CREATE FRESH SCHEMA
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: profiles
-- Extends auth.users with additional user information
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'premium')),
  phone TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  kyc_submitted_at TIMESTAMPTZ,
  kyc_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- ============================================================================
-- TABLE: user_preferences
-- Stores user-specific settings and preferences
-- ============================================================================
CREATE TABLE public.user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  currency TEXT DEFAULT 'INR',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_alerts BOOLEAN DEFAULT TRUE,
  sms_alerts BOOLEAN DEFAULT FALSE,
  price_alerts BOOLEAN DEFAULT TRUE,
  news_alerts BOOLEAN DEFAULT TRUE,
  default_chart_interval TEXT DEFAULT '1D',
  show_advanced_features BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: watchlists
-- User's stock watchlists
-- ============================================================================
CREATE TABLE public.watchlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Watchlist',
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_watchlists_user_id ON public.watchlists(user_id);

-- ============================================================================
-- TABLE: watchlist_items
-- Individual stocks in watchlists
-- ============================================================================
CREATE TABLE public.watchlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  watchlist_id UUID REFERENCES public.watchlists(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  exchange TEXT DEFAULT 'NSE' CHECK (exchange IN ('NSE', 'BSE')),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  target_price DECIMAL(10, 2),
  stop_loss DECIMAL(10, 2),
  UNIQUE(watchlist_id, symbol, exchange)
);

CREATE INDEX idx_watchlist_items_watchlist_id ON public.watchlist_items(watchlist_id);
CREATE INDEX idx_watchlist_items_symbol ON public.watchlist_items(symbol);

-- ============================================================================
-- TABLE: portfolio_holdings
-- User's actual stock holdings
-- ============================================================================
CREATE TABLE public.portfolio_holdings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  exchange TEXT DEFAULT 'NSE' CHECK (exchange IN ('NSE', 'BSE')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  average_price DECIMAL(10, 2) NOT NULL CHECK (average_price > 0),
  current_price DECIMAL(10, 2),
  invested_amount DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * average_price) STORED,
  current_value DECIMAL(12, 2),
  profit_loss DECIMAL(12, 2),
  profit_loss_percentage DECIMAL(6, 2),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol, exchange)
);

CREATE INDEX idx_portfolio_user_id ON public.portfolio_holdings(user_id);
CREATE INDEX idx_portfolio_symbol ON public.portfolio_holdings(symbol);
CREATE INDEX idx_portfolio_user_symbol ON public.portfolio_holdings(user_id, symbol);

-- ============================================================================
-- TABLE: trades
-- Trading history
-- ============================================================================
CREATE TABLE public.trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id TEXT UNIQUE,
  symbol TEXT NOT NULL,
  exchange TEXT DEFAULT 'NSE' CHECK (exchange IN ('NSE', 'BSE')),
  trade_type TEXT NOT NULL CHECK (trade_type IN ('BUY', 'SELL')),
  order_type TEXT NOT NULL CHECK (order_type IN ('MARKET', 'LIMIT', 'SL', 'SL-M')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  total_amount DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * price) STORED,
  brokerage DECIMAL(10, 2) DEFAULT 0,
  taxes DECIMAL(10, 2) DEFAULT 0,
  net_amount DECIMAL(12, 2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'cancelled', 'rejected')),
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_symbol ON public.trades(symbol);
CREATE INDEX idx_trades_status ON public.trades(status);
CREATE INDEX idx_trades_created_at ON public.trades(created_at DESC);
CREATE INDEX idx_trades_user_symbol ON public.trades(user_id, symbol);

-- ============================================================================
-- TABLE: price_alerts
-- User-defined price alerts
-- ============================================================================
CREATE TABLE public.price_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  exchange TEXT DEFAULT 'NSE' CHECK (exchange IN ('NSE', 'BSE')),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below')),
  target_price DECIMAL(10, 2) NOT NULL,
  current_price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON public.price_alerts(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_price_alerts_symbol ON public.price_alerts(symbol);

-- ============================================================================
-- TABLE: activity_logs
-- User activity tracking for admin and security
-- ============================================================================
CREATE TABLE public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action_type ON public.activity_logs(action_type);

-- ============================================================================
-- TABLE: api_usage
-- Track API usage for rate limiting and analytics
-- ============================================================================
CREATE TABLE public.api_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON public.api_usage(created_at DESC);

-- ============================================================================
-- TABLE: market_data_cache
-- Cache for frequently accessed market data
-- ============================================================================
CREATE TABLE public.market_data_cache (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  symbol TEXT NOT NULL,
  exchange TEXT DEFAULT 'NSE',
  data_type TEXT NOT NULL CHECK (data_type IN ('quote', 'ohlc', 'depth')),
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(symbol, exchange, data_type)
);

CREATE INDEX idx_market_data_symbol ON public.market_data_cache(symbol);
CREATE INDEX idx_market_data_expires_at ON public.market_data_cache(expires_at);
CREATE INDEX idx_watchlist_items_watchlist_symbol ON public.watchlist_items(watchlist_id, symbol);

-- ============================================================================
-- SECTION 3: FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlists_updated_at BEFORE UPDATE ON public.watchlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.watchlists (user_id, name, is_default)
  VALUES (NEW.id, 'My Watchlist', TRUE);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Portfolio summary function
CREATE OR REPLACE FUNCTION get_portfolio_summary(p_user_id UUID)
RETURNS TABLE (
  total_invested DECIMAL,
  current_value DECIMAL,
  total_profit_loss DECIMAL,
  profit_loss_percentage DECIMAL,
  holdings_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(invested_amount), 0)::DECIMAL as total_invested,
    COALESCE(SUM(current_value), 0)::DECIMAL as current_value,
    COALESCE(SUM(profit_loss), 0)::DECIMAL as total_profit_loss,
    CASE
      WHEN COALESCE(SUM(invested_amount), 0) > 0
      THEN (COALESCE(SUM(profit_loss), 0) / SUM(invested_amount) * 100)::DECIMAL
      ELSE 0::DECIMAL
    END as profit_loss_percentage,
    COUNT(*)::INTEGER as holdings_count
  FROM public.portfolio_holdings
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup functions
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.market_data_cache
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.activity_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 4: ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Watchlists policies
CREATE POLICY "Users can view their own watchlists"
  ON public.watchlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watchlists"
  ON public.watchlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlists"
  ON public.watchlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlists"
  ON public.watchlists FOR DELETE
  USING (auth.uid() = user_id);

-- Watchlist items policies
CREATE POLICY "Users can view their own watchlist items"
  ON public.watchlist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.watchlists
      WHERE watchlists.id = watchlist_items.watchlist_id
      AND watchlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add items to their watchlists"
  ON public.watchlist_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.watchlists
      WHERE watchlists.id = watchlist_items.watchlist_id
      AND watchlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their watchlist items"
  ON public.watchlist_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.watchlists
      WHERE watchlists.id = watchlist_items.watchlist_id
      AND watchlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their watchlist items"
  ON public.watchlist_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.watchlists
      WHERE watchlists.id = watchlist_items.watchlist_id
      AND watchlists.user_id = auth.uid()
    )
  );

-- Portfolio holdings policies
CREATE POLICY "Users can view their own holdings"
  ON public.portfolio_holdings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own holdings"
  ON public.portfolio_holdings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings"
  ON public.portfolio_holdings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holdings"
  ON public.portfolio_holdings FOR DELETE
  USING (auth.uid() = user_id);

-- Trades policies
CREATE POLICY "Users can view their own trades"
  ON public.trades FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trades"
  ON public.trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all trades"
  ON public.trades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Price alerts policies
CREATE POLICY "Users can view their own alerts"
  ON public.price_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts"
  ON public.price_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.price_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON public.price_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can view their own activity logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs"
  ON public.activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (TRUE);

-- API usage policies
CREATE POLICY "Users can view their own API usage"
  ON public.api_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all API usage"
  ON public.api_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Market data cache policies
CREATE POLICY "Anyone can read market data cache"
  ON public.market_data_cache FOR SELECT
  USING (TRUE);

-- ============================================================================
-- SECTION 5: GRANTS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT SELECT ON public.market_data_cache TO anon;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'NEORA Database Setup Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created: 10';
  RAISE NOTICE 'Functions created: 5';
  RAISE NOTICE 'Triggers created: 4';
  RAISE NOTICE 'RLS Policies created: 30+';
  RAISE NOTICE 'Indexes created: 20+';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Database is ready for use!';
  RAISE NOTICE '========================================';
END $$;