# 🧪 NEORA Complete Testing Guide

## Overview
This guide helps you test all features we've built in Week 1. Follow these steps to verify everything works correctly before moving to Week 2.

---

## 📋 Pre-Testing Checklist

### ✅ Prerequisites
- [ ] Supabase project created
- [ ] Database schema deployed (run `database/supabase-schema.sql`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)

### ✅ Expected State
- **App URL**: http://localhost:3000
- **Console**: No critical errors
- **Supabase**: Project active and connected

---

## 🎯 Week 1 Feature Checklist

### What We've Built (Complete & Testable):

#### ✅ **1. Build System**
- React + TypeScript + Vite
- Tailwind CSS (production-ready)
- Hot Module Replacement (HMR)

#### ✅ **2. Authentication System**
- User registration
- User login/logout
- Protected routes
- Admin routes
- Session persistence

#### ✅ **3. Database**
- 10 tables with RLS policies
- Auto-profile creation
- User preferences
- Watchlists structure

#### ✅ **4. Market Data Integration**
- NSE API service
- Real-time index data (NIFTY 50, BANK NIFTY)
- Market status
- Stock search

#### ✅ **5. UI Components**
- Landing page
- Authentication pages
- Dashboard
- Theme switcher (Light/Dark)
- Responsive layout

#### ✅ **6. Type System**
- NSE API types (519 lines)
- Kotak Neo types (628 lines)
- Auth types
- Database types

---

## 🧪 Testing Scenarios

### Test 1: Build & Development Server
**Goal**: Verify the application builds and runs correctly

```bash
# Terminal
npm run dev
```

**Expected Results:**
- ✅ Server starts on http://localhost:3000
- ✅ No build errors
- ✅ No TypeScript errors
- ✅ Hot reload works when you edit files

**Console Check:**
```
VITE v5.4.21 ready in XXX ms
➜ Local:   http://localhost:3000/
➜ Network: http://10.x.x.x:3000/
```

---

### Test 2: Landing Page
**Goal**: Verify public landing page loads correctly

**Steps:**
1. Navigate to: http://localhost:3000
2. Observe the page

**Expected Results:**
- ✅ Page loads without errors
- ✅ Beautiful UI with animations
- ✅ "Get Started" button visible
- ✅ Theme toggle works (moon/sun icon)
- ✅ Smooth scroll animations
- ✅ Background effects visible

**Visual Elements to Check:**
- [ ] NEORA logo/title
- [ ] Hero section with gradient
- [ ] Feature cards
- [ ] Call-to-action buttons
- [ ] Footer (if present)

**Console Check:**
- Should be clean (no errors)
- Supabase warning is OK (not critical)

---

### Test 3: Theme Switcher
**Goal**: Verify light/dark mode works

**Steps:**
1. On landing page, find theme toggle button (usually top-right)
2. Click to switch between light/dark

**Expected Results:**
- ✅ Theme switches smoothly
- ✅ Colors change appropriately
- ✅ Light mode: Green/white/gold theme
- ✅ Dark mode: Purple/orange cosmic theme
- ✅ Preference persists on page reload

**Visual Changes:**
- Background color changes
- Text colors invert
- Card styles change (solid → glass)
- Shadows change (3D → glow)

---

### Test 4: User Registration
**Goal**: Create a new user account

**Steps:**
1. Click "Get Started" or navigate to `/register`
2. Fill in the form:
   - **Full Name**: Test User
   - **Email**: test@youremail.com (use real email)
   - **Password**: Test123456!
   - **Confirm Password**: Test123456!
3. Click "Create Account"

**Expected Results:**
- ✅ Form validation works
- ✅ Password strength indicator shows
- ✅ No errors on submission
- ✅ Redirected to `/dashboard` after signup
- ✅ User sees dashboard content

**Supabase Verification:**
1. Open Supabase Dashboard
2. Go to **Authentication** → **Users**
3. Verify your user appears in the list
4. Go to **Table Editor** → **profiles**
5. Verify profile was auto-created
6. Check **user_preferences** table
7. Check **watchlists** table (should have one default)

**Console Check:**
- No authentication errors
- Session token stored

---

### Test 5: User Login
**Goal**: Login with existing credentials

**Steps:**
1. If logged in, click "Logout"
2. Navigate to `/login`
3. Enter credentials from Test 4
4. Click "Login"

**Expected Results:**
- ✅ Form accepts input
- ✅ Login successful
- ✅ Redirected to `/dashboard`
- ✅ User sees their dashboard

**Console Check:**
- Session restored
- No auth errors

---

### Test 6: Session Persistence
**Goal**: Verify session persists across page reloads

**Steps:**
1. Ensure you're logged in
2. Note you're on dashboard
3. Press F5 (refresh page)

**Expected Results:**
- ✅ User remains logged in
- ✅ No redirect to login page
- ✅ Dashboard loads with user data

**Additional Test:**
1. Close browser tab
2. Open new tab
3. Navigate to http://localhost:3000/dashboard

**Expected**: Still logged in (session in localStorage)

---

### Test 7: Protected Routes
**Goal**: Verify unauthorized users can't access protected pages

**Steps:**
1. Logout if logged in
2. Try to access: http://localhost:3000/dashboard
3. Observe behavior

**Expected Results:**
- ✅ Immediately redirected to `/login`
- ✅ Cannot see dashboard content
- ✅ URL changes from `/dashboard` to `/login`

**Additional Routes to Test:**
- `/portfolio` - Should redirect to login
- `/watchlist` - Should redirect to login
- `/admin` - Should redirect to login (even if logged in as normal user)

---

### Test 8: Logout Functionality
**Goal**: Verify logout works correctly

**Steps:**
1. Login if not already
2. Find "Logout" button (usually in header/sidebar)
3. Click "Logout"

**Expected Results:**
- ✅ User logged out
- ✅ Redirected to landing page or login
- ✅ Session cleared
- ✅ Cannot access protected routes
- ✅ Can login again

---

### Test 9: Market Data - IndicesBar
**Goal**: Verify real-time NSE data is fetched and displayed

**Steps:**
1. Login to dashboard
2. Look for indices bar (usually at top)
3. Observe NIFTY 50 and BANK NIFTY values

**Expected Results:**
- ✅ Index values display (e.g., "21,234.50")
- ✅ Change values display (e.g., "+123.45 (+0.58%)")
- ✅ Green for gains, red for losses
- ✅ Data refreshes (check timestamp if visible)

**Console Check:**
```
NSE API Response: { ... }
```

**Note**: Data only available during market hours (9:15 AM - 3:30 PM IST, Mon-Fri)

**Outside Market Hours:**
- May show previous close data
- Some fields might be null
- This is expected behavior

---

### Test 10: Market Data - Dashboard Widgets
**Goal**: Verify dashboard displays market information

**Steps:**
1. On dashboard, observe market widgets
2. Look for:
   - Top gainers
   - Top losers
   - Most active stocks
   - Market status

**Expected Results:**
- ✅ Widgets load without errors
- ✅ Stock symbols display
- ✅ Price changes show
- ✅ Data formatted correctly

**Demo vs Live Mode:**
- If Live toggle exists, try switching
- Demo: Shows sample data
- Live: Shows real NSE data

---

### Test 11: Responsive Design
**Goal**: Verify UI works on different screen sizes

**Steps:**
1. Open browser DevTools (F12)
2. Click responsive design mode icon
3. Test these sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**Expected Results:**
- ✅ Layout adjusts smoothly
- ✅ No horizontal scroll
- ✅ Buttons remain clickable
- ✅ Text remains readable
- ✅ Cards stack properly on mobile
- ✅ Navigation works on mobile

---

### Test 12: Password Reset Flow
**Goal**: Verify password reset works

**Steps:**
1. Logout
2. On login page, click "Forgot Password?"
3. Enter your email
4. Click "Send Reset Link"

**Expected Results:**
- ✅ Success message shows
- ✅ Email received (check inbox/spam)
- ✅ Reset link in email works
- ✅ Can set new password
- ✅ Can login with new password

**Supabase Check:**
- Go to Authentication → Logs
- See password reset email sent

---

### Test 13: Form Validation
**Goal**: Verify all forms have proper validation

**Registration Form:**
- [ ] Empty fields show errors
- [ ] Invalid email format rejected
- [ ] Weak password rejected
- [ ] Password mismatch detected
- [ ] Submit disabled until valid

**Login Form:**
- [ ] Empty fields show errors
- [ ] Invalid credentials show error message
- [ ] Error message is user-friendly

---

### Test 14: Browser Console
**Goal**: Verify no critical errors

**Steps:**
1. Open DevTools (F12)
2. Go to Console tab
3. Perform various actions (login, navigate, etc.)

**Expected Results:**
- ✅ No critical errors (red messages)
- ⚠️ Warnings acceptable (yellow)
- ✅ API calls successful (200 status)

**Common Acceptable Warnings:**
- DevTools suggestions
- React strict mode warnings
- Supabase connection notices

**Red Flags (Should NOT See):**
- TypeError
- Cannot read property of undefined
- Failed to fetch (unless NSE API down)
- CORS errors (means config issue)

---

### Test 15: Network Requests
**Goal**: Verify API calls work correctly

**Steps:**
1. Open DevTools → Network tab
2. Login to dashboard
3. Observe network requests

**Expected Requests:**
- ✅ Supabase auth calls (200 status)
- ✅ NSE API calls (200 status)
- ✅ Assets loading (CSS, JS)

**Check NSE API:**
- Request to: `https://www.nseindia.com/api/*`
- Status: 200 OK
- Response: JSON data

**CORS Note:**
- If NSE API shows CORS errors, this is expected
- We'll solve this with backend proxy in Week 2
- For now, some data may not load outside India

---

## 🎭 Feature Status Summary

### ✅ **Fully Working (Can Test Now)**

1. **Authentication System**
   - ✅ User registration
   - ✅ User login/logout
   - ✅ Session management
   - ✅ Protected routes
   - ✅ Password reset

2. **Database Integration**
   - ✅ Auto-profile creation
   - ✅ User preferences
   - ✅ Data persistence

3. **UI Components**
   - ✅ Landing page
   - ✅ Auth pages
   - ✅ Dashboard layout
   - ✅ Theme switcher
   - ✅ Responsive design

4. **Market Data (Limited)**
   - ✅ Index values (NIFTY, BANK NIFTY)
   - ⚠️ May have CORS issues (normal)
   - ⚠️ Only works during market hours

### 🚧 **Built But Not Functional Yet (Need Week 2)**

1. **Portfolio Management**
   - 📋 Database tables ready
   - 📋 Need backend API
   - 📋 Need UI implementation

2. **Watchlist Features**
   - 📋 Database ready
   - 📋 Need CRUD operations
   - 📋 Need UI components

3. **Trading Integration**
   - 📋 Types defined
   - 📋 Need Kotak Neo integration
   - 📋 Need backend proxy

4. **Real-time Updates**
   - 📋 WebSocket support planned
   - 📋 Need backend implementation

5. **Advanced Analytics**
   - 📋 Charts library ready (recharts)
   - 📋 Need data processing
   - 📋 Need visualization components

---

## 🐛 Common Issues & Solutions

### Issue 1: "Missing Supabase environment variables"
**Cause**: `.env.local` not configured
**Solution**: 
```bash
# Check .env.local exists and has correct values
cat .env.local

# Should see:
VITE_SUPABASE_URL=https://vemscitzfybqkqvtmnch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Issue 2: White screen / Nothing loads
**Cause**: Build error or route issue
**Solution**:
1. Check console for errors
2. Try clearing cache: Ctrl+Shift+R
3. Delete `node_modules/.vite` and restart

### Issue 3: Cannot register/login
**Cause**: Supabase connection issue
**Solution**:
1. Verify Supabase project is active
2. Check credentials in `.env.local`
3. Check Supabase dashboard for errors
4. Try running schema again if tables missing

### Issue 4: NSE data not loading
**Cause**: CORS restrictions or market closed
**Solution**:
- This is expected outside India/market hours
- Will be fixed with backend proxy in Week 2
- For now, you can test with demo data

### Issue 5: Styles not applying
**Cause**: Tailwind not compiling
**Solution**:
```bash
# Restart dev server
npm run dev

# If persists, clear cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📊 Testing Checklist Summary

**Copy this to track your testing progress:**

### Setup
- [ ] Dependencies installed
- [ ] Supabase configured
- [ ] Database schema deployed
- [ ] Dev server running

### Core Features
- [ ] Landing page loads
- [ ] Theme switcher works
- [ ] Registration successful
- [ ] Login successful
- [ ] Logout works
- [ ] Session persists
- [ ] Protected routes work

### Market Data
- [ ] Indices bar shows data
- [ ] Dashboard widgets load
- [ ] No critical console errors

### Database
- [ ] User in auth.users
- [ ] Profile auto-created
- [ ] Preferences created
- [ ] Watchlist created

### UI/UX
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Animations smooth
- [ ] Forms validate

---

## 🎯 Next Steps After Testing

Once all tests pass:

### ✅ Week 1 Complete
You have a working foundation with:
- Authentication system
- Database structure
- Basic UI
- Market data integration
- Type-safe codebase

### 📋 Ready for Week 2
- Backend API development
- Kotak Neo integration
- Portfolio features
- Watchlist CRUD
- Real-time updates

---

## 📝 Test Report Template

After completing tests, document results:

```markdown
# Test Results - [Date]

## Environment
- Node Version: [version]
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Edge]

## Results
- Total Tests: 15
- Passed: X
- Failed: Y
- Warnings: Z

## Passed Tests
1. ✅ Build system
2. ✅ Landing page
...

## Failed Tests
1. ❌ [Test name]
   - Error: [description]
   - Steps to reproduce: [steps]

## Notes
[Any additional observations]
```

---

## 🚀 Confidence Check

Before moving to Week 2, ensure:

- ✅ All authentication flows work
- ✅ Database operations successful
- ✅ UI is responsive and polished
- ✅ No critical console errors
- ✅ Code is type-safe (no TypeScript errors)
- ✅ Documentation is clear

**If all above pass, you're ready for Week 2!** 🎉
