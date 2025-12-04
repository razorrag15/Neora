export interface User {
  id: string
  email: string
  full_name: string
  role: 'user' | 'admin' | 'premium'
  avatar_url?: string
  phone?: string
  kyc_status?: 'pending' | 'verified' | 'rejected'
  kyc_submitted_at?: string
  kyc_verified_at?: string
  created_at: string
  updated_at: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthResponse {
  user: User
  token: string
}