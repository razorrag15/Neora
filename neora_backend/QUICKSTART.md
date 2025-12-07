# QUICKSTART - Backend Setup (PowerShell)

## You are already in the correct directory!
Current location: `D:\nextjs projects\NEORA\neora_frontend\neora_backend`

## Step 1: Run Setup Script

**PowerShell requires `.\` prefix for local scripts:**

```powershell
.\setup_venv.bat
```

**What this does:**
- Creates virtual environment in `venv` folder
- Installs all Python dependencies
- Takes ~2-3 minutes

## Step 2: Configure Kite Credentials

Edit `docker_config.env` in this directory:

```env
KITE_API_KEY=your_key_here
KITE_API_SECRET=your_secret_here
```

Get credentials from: https://kite.zerodha.com/

## Step 3: Start Backend Server

```powershell
.\start.bat
```

**Expected Output:**
```
✓ Virtual environment activated
Starting FastAPI server...
INFO:     Uvicorn running on http://0.0.0.0:4000
```

## Step 4: Start Frontend

**Open NEW PowerShell terminal** in project root:

```powershell
cd "D:\nextjs projects\NEORA\neora_frontend"
npm run dev
```

## Step 5: Access Admin Panel

Browser: `http://localhost:5173/admin`

---

## If Setup Script Fails

**Manual Setup (if batch file doesn't work):**

```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start server
python dev.py
```

**If you get execution policy error:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Current Issue: "uvicorn not found"

**Why**: You're running `python dev.py` WITHOUT activating virtual environment

**Solution**: Use the batch scripts OR manually activate venv first:

```powershell
# Activate venv first
.\venv\Scripts\activate.bat

# Then run dev.py
python dev.py
```

---

## Complete Command Sequence (Copy-Paste)

```powershell
# Step 1: Setup (one-time)
.\setup_venv.bat

# Step 2: Start backend (daily)
.\start.bat
```

That's it! The batch scripts handle venv activation automatically.