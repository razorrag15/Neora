# 🚨 CRITICAL INTEGRATION ISSUES - NEORA Platform

**Date**: 2025-12-03  
**Status**: BLOCKING - Must Fix Before Testing

---

## Issue #1: Database Schema vs Frontend Type Mismatch

### Problem
The **database schema** defines `role` as:
```sql
role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'premium'))
```

But the **frontend TypeScript type** only allows:
```typescript
role: 'user' | 'admin'  // Missing 'premium'!
```

### Impact
- Users with 'premium' role will fail type validation
- Profile updates will be rejected
- Admin checks won't work for premium users

### Location
- **Database**: `database/supabase-schema.sql` Line 26
- **Frontend**: `src/types/auth.ts` Line 5

---

## Issue #2: Missing Profile Query After Registration

### Problem
The registration flow has a **critical gap**:

1. User registers → Supabase creates auth.users record
2. Trigger `handle_new_user()` creates profile in database
3. Frontend redirects to login **WITHOUT fetching profile data**
4. User data is incomplete (missing role, kyc_status, phone, etc.)

### Code Flow
```typescript
// src/pages/auth/Register.tsx Line 30
await register({ email, password, full_name: fullName })
setSuccess(true)
setTimeout(() => {
  navigate('/login')  // ❌ No profile fetch!
}, 2000)
```

```typescript
// src/store/authStore.ts Line 52-60
register: async (data) => {
  set({ isLoading: true, error: null })
  try {
    await authHelpers.signUp(data.email, data.password, data.full_name)
    set({ isLoading: false })  // ❌ User data not populated!
  } catch (error: any) {
    set({ error: error.message, isLoading: false })
    throw error
  }
}
```

### Impact
- Auth store has incomplete user data
- Profile page may crash accessing undefined fields
- Role-based access control won't work properly

---

## Issue #3: Profile Data Not Fetched from Database

### Problem
The authentication flow **NEVER queries the profiles table**:

```typescript
// src/store/authStore.ts Line 82-101
checkAuth: async () => {
  try {
    const user = await authHelpers.getUser()  // Only gets auth.users data
    if (user) {
      const userData: User = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',  // ❌ From metadata only!
        role: user.user_metadata?.role || 'user',        // ❌ Not from DB!
        avatar_url: user.user_metadata?.avatar_url,      // ❌ Not from DB!
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at
      }
      set({ user: userData, isAuthenticated: true })
    }
  } catch (error) {
    set({ user: null, isAuthenticated: false })
  }
}
```

The profile data exists in `public.profiles` table but is **NEVER fetched**!

### What's Missing
```typescript
// Should query Supabase:
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Impact
- Database profile fields (phone, kyc_status, role) are ignored
- User metadata (which is limited) is used instead
- Profile updates won't persist properly
- Admin role checking is broken

---

## Issue #4: No Profile Sync After Login

### Problem
Login flow has same issue - doesn't fetch profile:

```typescript
// src/store/authStore.ts Line 28-49
login: async (email, password) => {
  set({ isLoading: true, error: null })
  try {
    const { user, session } = await authHelpers.signIn(email, password)
    
    if (session && user) {
      const userData: User = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',  // ❌ metadata only
        role: user.user_metadata?.role || 'user',        // ❌ not from DB
        // ... rest from metadata
      }
      
      set({ user: userData, isAuthenticated: true, isLoading: false })
    }
  }
}
```

### Impact
- Fresh login doesn't sync with database profile
- Role changes won't be reflected
- Profile page shows stale data

---

## Issue #5: Missing Database Fields in Frontend Type

### Problem
Database `profiles` table has these fields:
```sql
phone TEXT,
kyc_status TEXT,
kyc_submitted_at TIMESTAMPTZ,
kyc_verified_at TIMESTAMPTZ,
```

But frontend `User` type doesn't include them:
```typescript
export interface User {
  id: string
  email: string
  full_name: string
  role: 'user' | 'admin'  // Only 2 roles, DB has 3
  avatar_url?: string
  created_at: string
  updated_at: string
  // ❌ Missing: phone, kyc_status, kyc_submitted_at, kyc_verified_at
}
```

### Impact
- Cannot display or edit phone number
- Cannot show KYC status
- Type mismatch will cause runtime errors

---

## Issue #6: Profile Update Doesn't Save to Database

### Problem
```typescript
// src/store/authStore.ts Line 72-78
updateProfile: async (data) => {
  const user = get().user
  if (!user) return
  
  const updatedUser = { ...user, ...data }
  set({ user: updatedUser })  // ❌ Only updates local state!
}
```

This **ONLY updates Zustand store**, not Supabase database!

### Impact
- Profile changes are lost on refresh
- Data never persists to database
- Users can't actually update their profiles

---

## Issue #7: No Error Handling for Database Operations

### Problem
When triggers run (`handle_new_user()`), there's no error handling if:
- Profile creation fails
- Default watchlist creation fails
- User preferences creation fails

The user will be in auth.users but with no profile data.

### Impact
- Orphaned auth records with no profiles
- App crashes when accessing profile data
- No way to recover without manual DB fixes

---

## Issue #8: Missing Supabase Client Import in Auth Store

### Problem
```typescript
// src/store/authStore.ts
import { authHelpers } from '@/services/supabase'  // ✅ Has auth helpers
// ❌ Missing: import { supabase } from '@/services/supabase'
```

Can't query database tables without the client!

---

## Issue #9: Dashboard Uses Mock User Name

### Problem
```typescript
// src/pages/dashboard/Dashboard.tsx Line 100
<p className="text-text-secondary text-lg font-light max-w-xl leading-relaxed">
  Welcome back, <span className="font-bold text-text-primary">{user?.full_name}</span>
</p>
```

If profile fetch fails, `user.full_name` will be undefined or stale.

---

## Issue #10: No Real-Time Profile Sync

### Problem
Database has `updated_at` trigger, but frontend never re-fetches profile data.

If user updates profile in another tab/device, current session won't know.

### Impact
- Stale data across sessions
- Confusing user experience
- Data inconsistency

---

## 🔧 REQUIRED FIXES

### Fix #1: Update User Type
```typescript
// src/types/auth.ts
export interface User {
  id: string
  email: string
  full_name: string
  role: 'user' | 'admin' | 'premium'  // ✅ Add premium
  avatar_url?: string
  phone?: string                      // ✅ Add phone
  kyc_status?: 'pending' | 'verified' | 'rejected'  // ✅ Add KYC
  kyc_submitted_at?: string
  kyc_verified_at?: string
  created_at: string
  updated_at: string
}
```

### Fix #2: Create Profile Service
```typescript
// src/services/profileService.ts
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },
  
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
```

### Fix #3: Update Auth Store - Fetch Profile After Auth
```typescript
// src/store/authStore.ts
import { supabase, authHelpers } from '@/services/supabase'

login: async (email, password) => {
  set({ isLoading: true, error: null })
  try {
    const { user: authUser, session } = await authHelpers.signIn(email, password)
    
    if (session && authUser) {
      // ✅ Fetch profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      if (error) throw error
      
      const userData: User = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
        phone: profile.phone,
        kyc_status: profile.kyc_status,
        kyc_submitted_at: profile.kyc_submitted_at,
        kyc_verified_at: profile.kyc_verified_at,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
      
      set({ user: userData, isAuthenticated: true, isLoading: false })
    }
  } catch (error: any) {
    set({ error: error.message, isLoading: false })
    throw error
  }
}
```

### Fix #4: Update Profile Update Method
```typescript
updateProfile: async (data) => {
  const user = get().user
  if (!user) return
  
  try {
    // ✅ Update in database
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) throw error
    
    // Update local state
    set({ user: { ...user, ...updatedProfile } })
  } catch (error: any) {
    console.error('Profile update error:', error)
    throw error
  }
}
```

### Fix #5: Add Profile Fetch After Registration
```typescript
// src/store/authStore.ts
register: async (data) => {
  set({ isLoading: true, error: null })
  try {
    const result = await authHelpers.signUp(data.email, data.password, data.full_name)
    
    // ✅ Auto-login after registration to fetch profile
    if (result.user) {
      await get().login(data.email, data.password)
    }
    
    set({ isLoading: false })
  } catch (error: any) {
    set({ error: error.message, isLoading: false })
    throw error
  }
}
```

---

## 🎯 TESTING CHECKLIST

After fixes are applied:

- [ ] User can register and profile is created in database
- [ ] Profile data is fetched after login
- [ ] Profile updates persist to database
- [ ] Role field supports all 3 values (user, admin, premium)
- [ ] Phone and KYC fields are accessible
- [ ] Dashboard shows correct user name
- [ ] Profile page displays all fields
- [ ] Admin route checks work correctly
- [ ] No TypeScript errors
- [ ] No console errors on auth operations

---

## 📊 SEVERITY ASSESSMENT

| Issue | Severity | Impact | Blocks Testing? |
|-------|----------|--------|-----------------|
| Profile not fetched from DB | 🔴 CRITICAL | Complete data loss | YES |
| Role type mismatch | 🔴 CRITICAL | Access control broken | YES |
| Profile updates not saved | 🔴 CRITICAL | Data persistence broken | YES |
| Missing fields in User type | 🟡 HIGH | Feature incomplete | NO |
| No error handling | 🟡 HIGH | Silent failures | NO |
| No real-time sync | 🟢 MEDIUM | UX issue | NO |

**Total Critical Issues**: 3  
**Total High Issues**: 2  
**Status**: **CANNOT TEST UNTIL CRITICAL ISSUES FIXED**

---

## 🚀 IMMEDIATE ACTION PLAN

1. **Fix Type Definitions** (5 min)
   - Update User interface with all fields
   - Fix role type to include 'premium'

2. **Create Profile Service** (10 min)
   - Add getProfile function
   - Add updateProfile function
   - Add proper error handling

3. **Fix Auth Store** (15 min)
   - Import supabase client
   - Update login to fetch profile
   - Update checkAuth to fetch profile
   - Fix updateProfile to save to DB
   - Fix register to auto-login

4. **Test Integration** (20 min)
   - Deploy schema to Supabase
   - Test registration flow
   - Test login flow
   - Test profile updates
   - Verify data persistence

**Total Time**: ~50 minutes

---

## 📝 NOTES

These are **fundamental integration issues** that prevent the app from working correctly. The frontend and database are essentially **not connected properly** - they're just passing auth tokens but not actually syncing user data.

This explains why the user kept asking "can we test it?" - the app would appear to work but would fail silently or show wrong data.

**Bottom Line**: The authentication works, but user data management is completely broken. Must fix before any real testing can happen.