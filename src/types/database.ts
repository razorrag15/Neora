/**
 * Database Types - Generated from Supabase Schema
 * These types match the database schema exactly
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'premium'
          phone: string | null
          kyc_status: 'pending' | 'verified' | 'rejected'
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'premium'
          phone?: string | null
          kyc_status?: 'pending' | 'verified' | 'rejected'
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'premium'
          phone?: string | null
          kyc_status?: 'pending' | 'verified' | 'rejected'
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          theme: 'light' | 'dark' | 'auto'
          language: 'en' | 'hi'
          currency: string
          notifications_enabled: boolean
          email_alerts: boolean
          sms_alerts: boolean
          price_alerts: boolean
          news_alerts: boolean
          default_chart_interval: string
          show_advanced_features: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: 'light' | 'dark' | 'auto'
          language?: 'en' | 'hi'
          currency?: string
          notifications_enabled?: boolean
          email_alerts?: boolean
          sms_alerts?: boolean
          price_alerts?: boolean
          news_alerts?: boolean
          default_chart_interval?: string
          show_advanced_features?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: 'light' | 'dark' | 'auto'
          language?: 'en' | 'hi'
          currency?: string
          notifications_enabled?: boolean
          email_alerts?: boolean
          sms_alerts?: boolean
          price_alerts?: boolean
          news_alerts?: boolean
          default_chart_interval?: string
          show_advanced_features?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      watchlists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          description?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      watchlist_items: {
        Row: {
          id: string
          watchlist_id: string
          symbol: string
          exchange: 'NSE' | 'BSE'
          added_at: string
          notes: string | null
          target_price: number | null
          stop_loss: number | null
        }
        Insert: {
          id?: string
          watchlist_id: string
          symbol: string
          exchange?: 'NSE' | 'BSE'
          added_at?: string
          notes?: string | null
          target_price?: number | null
          stop_loss?: number | null
        }
        Update: {
          id?: string
          watchlist_id?: string
          symbol?: string
          exchange?: 'NSE' | 'BSE'
          added_at?: string
          notes?: string | null
          target_price?: number | null
          stop_loss?: number | null
        }
      }
      portfolio_holdings: {
        Row: {
          id: string
          user_id: string
          symbol: string
          exchange: 'NSE' | 'BSE'
          quantity: number
          average_price: number
          current_price: number | null
          invested_amount: number
          current_value: number | null
          profit_loss: number | null
          profit_loss_percentage: number | null
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          exchange?: 'NSE' | 'BSE'
          quantity: number
          average_price: number
          current_price?: number | null
          current_value?: number | null
          profit_loss?: number | null
          profit_loss_percentage?: number | null
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          exchange?: 'NSE' | 'BSE'
          quantity?: number
          average_price?: number
          current_price?: number | null
          current_value?: number | null
          profit_loss?: number | null
          profit_loss_percentage?: number | null
          last_updated?: string
          created_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          symbol: string
          exchange: 'NSE' | 'BSE'
          trade_type: 'BUY' | 'SELL'
          order_type: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M'
          quantity: number
          price: number
          total_amount: number
          brokerage: number
          taxes: number
          net_amount: number | null
          status: 'pending' | 'executed' | 'cancelled' | 'rejected'
          executed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          symbol: string
          exchange?: 'NSE' | 'BSE'
          trade_type: 'BUY' | 'SELL'
          order_type: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M'
          quantity: number
          price: number
          brokerage?: number
          taxes?: number
          net_amount?: number | null
          status?: 'pending' | 'executed' | 'cancelled' | 'rejected'
          executed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          symbol?: string
          exchange?: 'NSE' | 'BSE'
          trade_type?: 'BUY' | 'SELL'
          order_type?: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M'
          quantity?: number
          price?: number
          brokerage?: number
          taxes?: number
          net_amount?: number | null
          status?: 'pending' | 'executed' | 'cancelled' | 'rejected'
          executed_at?: string | null
          created_at?: string
        }
      }
      price_alerts: {
        Row: {
          id: string
          user_id: string
          symbol: string
          exchange: 'NSE' | 'BSE'
          alert_type: 'above' | 'below'
          target_price: number
          current_price: number | null
          is_active: boolean
          triggered_at: string | null
          notification_sent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          exchange?: 'NSE' | 'BSE'
          alert_type: 'above' | 'below'
          target_price: number
          current_price?: number | null
          is_active?: boolean
          triggered_at?: string | null
          notification_sent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          exchange?: 'NSE' | 'BSE'
          alert_type?: 'above' | 'below'
          target_price?: number
          current_price?: number | null
          is_active?: boolean
          triggered_at?: string | null
          notification_sent?: boolean
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action_type: string
          action_details: Record<string, any> | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action_type: string
          action_details?: Record<string, any> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action_type?: string
          action_details?: Record<string, any> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      api_usage: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          method: string
          status_code: number | null
          response_time: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          method: string
          status_code?: number | null
          response_time?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          method?: string
          status_code?: number | null
          response_time?: number | null
          created_at?: string
        }
      }
      market_data_cache: {
        Row: {
          id: string
          symbol: string
          exchange: string
          data_type: 'quote' | 'ohlc' | 'depth'
          data: Record<string, any>
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          symbol: string
          exchange?: string
          data_type: 'quote' | 'ohlc' | 'depth'
          data: Record<string, any>
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          exchange?: string
          data_type?: 'quote' | 'ohlc' | 'depth'
          data?: Record<string, any>
          expires_at?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      get_portfolio_summary: {
        Args: { p_user_id: string }
        Returns: {
          total_invested: number
          current_value: number
          total_profit_loss: number
          profit_loss_percentage: number
          holdings_count: number
        }[]
      }
    }
    Enums: {}
  }
}