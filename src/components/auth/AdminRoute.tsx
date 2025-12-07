import { ReactNode } from 'react'

interface AdminRouteProps {
  children: ReactNode
}

/**
 * Simplified Admin Route - No Supabase authentication required
 * Admin panel only needs backend API access for TOTP/Kite operations
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  // Direct access - no authentication checks
  // Admin panel is protected by backend API key (VITE_ADMIN_KEY)
  return <>{children}</>
}