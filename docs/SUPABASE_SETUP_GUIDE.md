# Supabase Setup Guide for NEORA

## Overview
This guide will help you set up Supabase authentication for the NEORA application. Supabase provides a complete backend solution with PostgreSQL database, authentication, real-time subscriptions, and more.

## Step 1: Create Supabase Project

1. **Go to Supabase**
   - Visit: https://app.supabase.com
   - Sign up or log in with your account

2. **Create New Project**
   - Click "New Project"
   - Fill in the details:
     - **Name**: NEORA-Production (or your preferred name)
     - **Database Password**: Generate a strong password (save it securely!)
     - **Region**: Choose closest to your users (e.g., Mumbai for India)
     - **Pricing Plan**: Start with Free tier
   - Click "Create new project"
   - Wait 2-3 minutes for project initialization

3. **Copy API Credentials**
   - Once the project is ready, go to **Settings** → **API**
   - You'll see two important values:
     - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
     - **anon public key**: `eyJhbGci...` (long string)

## Step 2: Configure Environment Variables

1. **Open your `.env.local` file** (already created in project root)

2. **Replace the placeholder values**:
   ```env
   # Replace these with your actual Supabase credentials
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_from_supabase
   
   # Keep these as-is for now
   VITE_API_URL=http://localhost:8000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Restart the development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

## Step 3: Configure Authentication Settings

1. **In Supabase Dashboard**, go to **Authentication** → **Providers**

2. **Enable Email Authentication** (should be enabled by default)
   - Confirm email: You can disable this for development
   - For production: Enable email confirmation

3. **Configure Site URL and Redirect URLs**:
   - Go to **Authentication** → **URL Configuration**
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add these:
     ```
     http://localhost:3000/**
     http://localhost:3000/auth/callback
     ```

4. **Optional: Configure Email Templates**
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation, reset password, and invite emails
   - Add your app branding and colors

## Step 4: Create Database Tables (Optional - For Week 2+)

For now, we're only using Supabase for authentication. In Week 2, we'll add these tables:

```sql
-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Watchlist table
create table public.watchlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  symbol text not null,
  added_at timestamp with time zone default now()
);

-- User preferences
create table public.user_preferences (
  user_id uuid references auth.users on delete cascade primary key,
  theme text default 'light',
  notifications_enabled boolean default true,
  updated_at timestamp with time zone default now()
);
```

## Step 5: Test Authentication

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Navigate to**: http://localhost:3000

3. **Test Registration**:
   - Click "Get Started" or "Register"
   - Fill in the form:
     - Full Name: Test User
     - Email: test@example.com
     - Password: Test123456!
   - Click "Create Account"
   - You should be redirected to the dashboard

4. **Test Login**:
   - Log out
   - Click "Login"
   - Use the same credentials
   - You should be logged in successfully

5. **Test Password Reset**:
   - Click "Forgot Password?"
   - Enter your email
   - Check your email inbox for reset link
   - Follow the link to reset password

## Step 6: Verify in Supabase Dashboard

1. **Check Users**:
   - Go to **Authentication** → **Users**
   - You should see your test user listed
   - Verify email status, last sign-in, etc.

2. **View Auth Logs**:
   - Go to **Authentication** → **Logs**
   - See all authentication events (sign-ups, sign-ins, etc.)

## Security Best Practices

### ⚠️ IMPORTANT: Never commit `.env.local` to Git!

The `.env.local` file is already in `.gitignore`, but double-check:

```bash
# Verify it's gitignored
git status
# .env.local should NOT appear in the list
```

### Production Deployment

When deploying to production (Render, Vercel, etc.):

1. **Add environment variables in hosting platform**:
   - Don't commit `.env.local` or `.env.production`
   - Use platform's environment variable settings
   - Example for Render:
     - Dashboard → Environment → Environment Variables
     - Add each variable individually

2. **Update Supabase URLs**:
   - In Supabase Dashboard → **Authentication** → **URL Configuration**
   - Add your production URLs:
     ```
     https://neora.yourdomain.com/**
     https://neora.yourdomain.com/auth/callback
     ```

3. **Enable Email Confirmation**:
   - For production, enable email confirmation
   - Configure custom email templates
   - Use custom SMTP (optional, for better deliverability)

## Troubleshooting

### Error: "Missing Supabase environment variables"
**Solution**: Make sure `.env.local` exists and has correct values, then restart dev server

### Error: "Invalid API key"
**Solution**: Check that you copied the **anon public key**, not the service_role key

### Error: "User not confirmed"
**Solution**: 
- Development: Disable email confirmation in Supabase settings
- Production: Check email for confirmation link

### Users can't sign up
**Solution**: Check Supabase dashboard → Authentication → Users for error messages

### Password reset email not received
**Solution**:
- Check spam folder
- Verify SMTP settings in Supabase
- Check Supabase logs for email delivery status

## Alternative: Development Mode Without Supabase

If you want to work on the UI without setting up Supabase yet:

1. **Comment out Supabase checks** in `src/services/supabase.ts`:
   ```typescript
   // Temporarily disable error
   // if (!supabaseUrl || !supabaseAnonKey) {
   //   console.error('Missing Supabase environment variables')
   // }
   ```

2. **Use mock authentication** in development:
   - The app will still run
   - Authentication features won't work
   - Focus on UI and market data features

## Next Steps

Once Supabase is configured:

1. ✅ Test all auth flows (signup, login, logout, reset)
2. ✅ Verify users appear in Supabase dashboard
3. ✅ Check that protected routes work correctly
4. ✅ Test admin route access control
5. 📋 Move on to Week 2: Backend development with Kotak Neo API

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Auth Guide**: https://supabase.com/docs/guides/auth
- **React Integration**: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
- **Security Best Practices**: https://supabase.com/docs/guides/auth/auth-helpers/auth-ui

## Support

If you encounter issues:
1. Check Supabase Dashboard → Logs
2. Check browser console for errors
3. Verify environment variables are loaded: `console.log(import.meta.env)`
4. Check Supabase Discord: https://discord.supabase.com