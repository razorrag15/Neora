# NEORA Database Setup

This directory contains the complete database schema for the NEORA Stock Market Intelligence Platform.

## Quick Setup

### Option 1: Supabase Dashboard (Recommended)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project → SQL Editor
3. Copy the contents of `setup.sql`
4. Paste into the SQL Editor
5. Click **Run**

That's it! The script will:
- Clean up any existing tables/policies (safe to run multiple times)
- Create fresh database schema
- Set up all triggers and functions
- Configure Row Level Security
- Create all necessary indexes

### Option 2: Command Line

If you have the Supabase CLI installed:

```bash
supabase db reset
supabase db push
```

## What Gets Created

### Tables (10)
1. **profiles** - User profile information
2. **user_preferences** - User settings and preferences
3. **watchlists** - User's stock watchlists
4. **watchlist_items** - Individual stocks in watchlists
5. **portfolio_holdings** - User's actual stock holdings
6. **trades** - Trading history
7. **price_alerts** - User-defined price alerts
8. **activity_logs** - User activity tracking
9. **api_usage** - API usage tracking
10. **market_data_cache** - Cached market data

### Functions (5)
- `handle_new_user()` - Auto-creates profile/preferences/watchlist on signup
- `update_updated_at_column()` - Auto-updates timestamps
- `get_portfolio_summary()` - Calculate portfolio statistics
- `cleanup_expired_cache()` - Remove old cached data
- `cleanup_old_activity_logs()` - Remove logs older than 90 days

### Triggers (4)
- Auto-create profile on user signup
- Auto-update timestamps on profile changes
- Auto-update timestamps on preferences changes
- Auto-update timestamps on watchlist changes

### Security
- **30+ Row Level Security (RLS) policies**
- Users can only access their own data
- Admins have elevated permissions
- Public market data cache accessible to all

## Database Reset

The `setup.sql` script is **idempotent** - safe to run multiple times. It will:

1. Drop existing policies (if any)
2. Drop existing triggers (if any)
3. Drop existing functions (if any)
4. Drop existing tables (if any)
5. Create everything fresh

**Warning**: This will **DELETE ALL DATA** in the tables. Use with caution in production!

## Verification

After running the script, verify setup by checking:

1. **Tables Created**:
   - Go to Table Editor in Supabase
   - You should see all 10 tables

2. **Policies Active**:
   - Go to Authentication → Policies
   - You should see 30+ policies

3. **Triggers Working**:
   - Register a new user
   - Check that profile, preferences, and default watchlist are auto-created

## Testing the Setup

### 1. Test User Registration Flow

```sql
-- Check if trigger created all records
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  up.theme,
  w.name as default_watchlist
FROM profiles p
LEFT JOIN user_preferences up ON up.user_id = p.id
LEFT JOIN watchlists w ON w.user_id = p.id AND w.is_default = true
WHERE p.email = 'test@example.com';
```

### 2. Test Portfolio Summary Function

```sql
SELECT * FROM get_portfolio_summary('user-uuid-here');
```

### 3. Test RLS Policies

```sql
-- This should only return current user's data
SELECT * FROM profiles WHERE id = auth.uid();
```

## Troubleshooting

### Issue: "relation does not exist"
**Solution**: Make sure you ran the script in the correct database/project.

### Issue: "permission denied"
**Solution**: Ensure you're using the SQL Editor in Supabase Dashboard with proper permissions.

### Issue: "trigger already exists"
**Solution**: The script should handle this. If you see errors, run this first:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

### Issue: Profile not created after signup
**Solution**: Check if the trigger is active:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

## Schema Diagram

```
auth.users (Supabase Auth)
    ↓
profiles (Extended user info)
    ├── user_preferences (Settings)
    ├── watchlists (Stock lists)
    │   └── watchlist_items (Individual stocks)
    ├── portfolio_holdings (Actual holdings)
    ├── trades (Trading history)
    ├── price_alerts (Price notifications)
    ├── activity_logs (User actions)
    └── api_usage (API tracking)

market_data_cache (Public cached data)
```

## Environment Variables Required

Make sure your `.env.local` has:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Data Flow

1. **User Registers** → Supabase Auth creates record in `auth.users`
2. **Trigger Fires** → `handle_new_user()` creates:
   - Profile in `profiles`
   - Preferences in `user_preferences`
   - Default watchlist in `watchlists`
3. **Frontend Syncs** → `profileService.getProfile()` fetches complete data
4. **User Updates Profile** → `profileService.updateProfile()` saves to DB
5. **Data Persists** → All changes saved and accessible on refresh

## Maintenance

### Clean Old Cache (Run periodically)
```sql
SELECT cleanup_expired_cache();
```

### Clean Old Logs (Run monthly)
```sql
SELECT cleanup_old_activity_logs();
```

### Check Database Size
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Support

For issues or questions:
1. Check the `CRITICAL_ISSUES_FOUND.md` for known problems
2. Review `INTEGRATION_FIXES_APPLIED.md` for solutions
3. Check Supabase Dashboard → SQL Editor → Query history for errors

## Next Steps

After database setup:
1. ✅ Database schema deployed
2. → Test user registration
3. → Verify profile creation
4. → Test frontend integration
5. → Begin Week 2: Backend development