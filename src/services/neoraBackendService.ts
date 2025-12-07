/**
 * NEORA Backend Service - Market Dashboard Integration
 * 
 * Connects to the NEORA backend API for real-time market data
 */

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api/v1';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

// ============== Types ==============

export interface StockData {
  symbol: string;
  name: string;
  last_price: number;
  change: number;
  change_percent: number;
  color: string;  // Added: backend provides this field
}

export interface IndexData {
  symbol: string;
  last_value: number;
  change: number;
  change_percent: number;
  stocks: StockData[];
}

export interface MarketDashboard {
  nifty_50: IndexData;
  sensex: IndexData;
  timestamp: string;
  source?: 'mock' | 'real';
}

export interface AuthStatus {
  authenticated: boolean;
  message: string;
}

export interface TOTPInfo {
  date: string;
  current_code: string;
  expires_in_seconds: number;
  expires_at: string;
  message?: string;
}

// ============== Market Data API ==============

/**
 * Get complete market dashboard with NIFTY 50 and SENSEX
 */
export async function getMarketDashboard(): Promise<MarketDashboard> {
  const response = await apiClient.get<MarketDashboard>('/market/dashboard');
  return response.data;
}

/**
 * Get detailed NIFTY 50 data
 */
export async function getNifty50Detail() {
  const response = await apiClient.get('/market/nifty50');
  return response.data;
}

/**
 * Get detailed SENSEX data
 */
export async function getSensexDetail() {
  const response = await apiClient.get('/market/sensex');
  return response.data;
}

// ============== Authentication API ==============

/**
 * Login with TOTP code (Admin only)
 */
export async function loginWithTOTP(totpCode: string) {
  const response = await apiClient.post('/auth/login', {
    totp_code: totpCode
  });
  return response.data;
}

/**
 * Check authentication status
 */
export async function getAuthStatus(): Promise<AuthStatus> {
  const response = await apiClient.get<AuthStatus>('/auth/status');
  return response.data;
}

// ============== Admin API ==============

/**
 * Get current TOTP code (Admin only - requires X-Admin-Key header)
 */
export async function getCurrentTOTP(adminKey: string): Promise<TOTPInfo> {
  const response = await apiClient.get<TOTPInfo>('/admin/totp/current', {
    headers: {
      'X-Admin-Key': adminKey
    }
  });
  return response.data;
}

/**
 * Refresh TOTP code (Admin only - requires X-Admin-Key header)
 */
export async function refreshTOTPCode(adminKey: string): Promise<TOTPInfo> {
  const response = await apiClient.get<TOTPInfo>('/admin/totp/refresh', {
    headers: {
      'X-Admin-Key': adminKey
    }
  });
  return response.data;
}

/**
 * Get system status (Admin only)
 */
export async function getAdminStatus(adminKey: string) {
  const response = await apiClient.get('/admin/status', {
    headers: {
      'X-Admin-Key': adminKey
    }
  });
  return response.data;
}

/**
 * Health check
 */
export async function healthCheck() {
  const response = await apiClient.get('/admin/health');
  return response.data;
}

// ============== Helper Functions ==============

/**
 * Format price with Indian number system (lakhs/crores)
 */
export function formatIndianPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Format change percentage
 */
export function formatChangePercent(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/**
 * Get color class based on change
 */
export function getChangeColorClass(change: number): string {
  return change >= 0 ? 'text-green-600' : 'text-red-600';
}

export default {
  getMarketDashboard,
  getNifty50Detail,
  getSensexDetail,
  loginWithTOTP,
  getAuthStatus,
  getCurrentTOTP,
  refreshTOTPCode,
  getAdminStatus,
  healthCheck,
  formatIndianPrice,
  formatChangePercent,
  getChangeColorClass,
};