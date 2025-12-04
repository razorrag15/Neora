import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, RegisterData } from '@/types/auth'
import { supabase, authHelpers } from '@/services/supabase'
import { profileService } from '@/services/profileService'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  clearError: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { user: authUser, session } = await authHelpers.signIn(email, password)
          
          if (session && authUser) {
            // Fetch complete profile from database
            const profile = await profileService.getProfile(authUser.id)
            
            if (profile) {
              const userData: User = {
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name || '',
                role: profile.role,
                avatar_url: profile.avatar_url || undefined,
                phone: profile.phone || undefined,
                kyc_status: profile.kyc_status,
                kyc_submitted_at: profile.kyc_submitted_at || undefined,
                kyc_verified_at: profile.kyc_verified_at || undefined,
                created_at: profile.created_at,
                updated_at: profile.updated_at
              }
              
              set({ user: userData, isAuthenticated: true, isLoading: false })
            } else {
              // Fallback to auth user data if profile fetch fails
              const userData: User = {
                id: authUser.id,
                email: authUser.email || '',
                full_name: authUser.user_metadata?.full_name || '',
                role: 'user',
                created_at: authUser.created_at,
                updated_at: authUser.updated_at || authUser.created_at
              }
              set({ user: userData, isAuthenticated: true, isLoading: false })
            }
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const result = await authHelpers.signUp(data.email, data.password, data.full_name)
          
          // If email confirmation is disabled, auto-login to fetch profile
          if (result.user && result.session) {
            // Profile was created by trigger, now fetch it
            const profile = await profileService.getProfile(result.user.id)
            
            if (profile) {
              const userData: User = {
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name || '',
                role: profile.role,
                avatar_url: profile.avatar_url || undefined,
                phone: profile.phone || undefined,
                kyc_status: profile.kyc_status,
                kyc_submitted_at: profile.kyc_submitted_at || undefined,
                kyc_verified_at: profile.kyc_verified_at || undefined,
                created_at: profile.created_at,
                updated_at: profile.updated_at
              }
              set({ user: userData, isAuthenticated: true, isLoading: false })
            } else {
              set({ isLoading: false })
            }
          } else {
            // Email confirmation required - user must verify email
            set({ isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await authHelpers.signOut()
          set({ user: null, isAuthenticated: false })
        } catch (error: any) {
          console.error('Logout error:', error)
        }
      },

      updateProfile: async (data) => {
        const user = get().user
        if (!user) return
        
        try {
          // Update in database
          const updatedProfile = await profileService.updateProfile(user.id, data)
          
          if (updatedProfile) {
            const userData: User = {
              id: updatedProfile.id,
              email: updatedProfile.email,
              full_name: updatedProfile.full_name || '',
              role: updatedProfile.role,
              avatar_url: updatedProfile.avatar_url || undefined,
              phone: updatedProfile.phone || undefined,
              kyc_status: updatedProfile.kyc_status,
              kyc_submitted_at: updatedProfile.kyc_submitted_at || undefined,
              kyc_verified_at: updatedProfile.kyc_verified_at || undefined,
              created_at: updatedProfile.created_at,
              updated_at: updatedProfile.updated_at
            }
            set({ user: userData })
          }
        } catch (error: any) {
          console.error('Profile update error:', error)
          throw error
        }
      },

      clearError: () => set({ error: null }),

      checkAuth: async () => {
        try {
          const authUser = await authHelpers.getUser()
          if (authUser) {
            // Fetch complete profile from database
            const profile = await profileService.getProfile(authUser.id)
            
            if (profile) {
              const userData: User = {
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name || '',
                role: profile.role,
                avatar_url: profile.avatar_url || undefined,
                phone: profile.phone || undefined,
                kyc_status: profile.kyc_status,
                kyc_submitted_at: profile.kyc_submitted_at || undefined,
                kyc_verified_at: profile.kyc_verified_at || undefined,
                created_at: profile.created_at,
                updated_at: profile.updated_at
              }
              set({ user: userData, isAuthenticated: true })
            } else {
              // Fallback if profile doesn't exist
              set({ user: null, isAuthenticated: false })
            }
          } else {
            set({ user: null, isAuthenticated: false })
          }
        } catch (error) {
          console.error('Check auth error:', error)
          set({ user: null, isAuthenticated: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)