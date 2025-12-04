import { supabase } from './supabase'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const profileService = {
  /**
   * Get user profile from database
   */
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Profile fetch failed:', error)
      return null
    }
  },

  /**
   * Update user profile in database
   */
  async updateProfile(userId: string, updates: Partial<ProfileUpdate>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Profile update failed:', error)
      return null
    }
  },

  /**
   * Get user preferences from database
   */
  async getPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching preferences:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Preferences fetch failed:', error)
      return null
    }
  },

  /**
   * Update user preferences in database
   */
  async updatePreferences(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating preferences:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Preferences update failed:', error)
      return null
    }
  }
}