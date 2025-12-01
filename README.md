# NEORA Intelligence 📈

> Next-generation Indian stock market intelligence platform with real-time data, AI insights, and comprehensive portfolio management.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-yellow)](https://www.python.org/)

---

## 🌟 Features

### Current (MVP)
- ✅ **Real-Time Market Data** - Live stock quotes via Kotak Neo API
- ✅ **User Authentication** - Secure login/signup with email verification
- ✅ **Portfolio Management** - Track holdings, P&L, and performance
- ✅ **Watchlists** - Create and manage multiple watchlists
- ✅ **Market Overview** - Indices, top gainers/losers
- ✅ **AI Assistant** - Gemini-powered market insights
- ✅ **Admin Dashboard** - User management and activity monitoring
- ✅ **Beautiful UI** - Royal-themed design with dark/light mode

### Coming Soon
- 🔄 **WebSocket Real-Time Updates** - Zero-delay price updates
- 📊 **Advanced Charts** - TradingView integration with 50+ indicators
- 🤖 **ML Predictions** - AI-powered stock predictions
- 📰 **News Aggregation** - Multi-source news with sentiment analysis
- 🎯 **Stock Screener** - Advanced filtering with 50+ criteria
- 💰 **Premium Features** - Subscription tiers and advanced analytics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 19+
- Python 3.11+
- PostgreSQL (via Supabase)
- Redis
- Kotak Neo API credentials

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/neora.git
cd neora

# Frontend setup
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev

# Backend setup
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
uvicorn app.main:app --reload
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 📚 Documentation

- **[Complete Documentation](docs/NEORA_COMPLETE_DOCUMENTATION.md)** - Full project documentation (2,400+ lines)
- **[MVP Implementation Guide](docs/MVP_IMPLEMENTATION_GUIDE.md)** - Quick start for developers
- **[API Reference](http://localhost:8000/docs)** - Interactive API documentation (Swagger)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TS)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Public Pages │  │ Auth Pages   │  │ Dashboard    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Python FastAPI)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Service │  │ Market Data  │  │ Portfolio    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Supabase    │    │  Kotak Neo   │    │    Redis     │
│  PostgreSQL  │    │     API      │    │    Cache     │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.2.0 + TypeScript 5.8
- **Build Tool:** Vite 6.2.0
- **Routing:** React Router v6
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Charts:** Recharts (MVP), TradingView (Future)
- **Icons:** Lucide React
- **AI:** Google Gemini

### Backend
- **Framework:** Python 3.11 + FastAPI 0.104
- **Database:** Supabase PostgreSQL
- **ORM:** SQLAlchemy 2.0
- **Authentication:** Supabase Auth + JWT
- **Caching:** Redis
- **Market Data:** Kotak Neo API
- **ML/AI:** Pandas, NumPy, Scikit-learn (Future)

### Infrastructure
- **Hosting:** Render (Frontend + Backend)
- **Database:** Supabase (Managed PostgreSQL)
- **CDN:** Cloudflare
- **Monitoring:** Sentry (Future)
- **CI/CD:** GitHub Actions

---

## 📁 Project Structure

```
neora/
├── frontend/                    # React TypeScript app
│   ├── src/
│   │   ├── pages/              # Route pages
│   │   ├── components/         # Reusable components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API services
│   │   ├── store/              # Zustand stores
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Helper functions
│   └── package.json
│
├── backend/                     # Python FastAPI server
│   ├── app/
│   │   ├── auth/               # Authentication
│   │   ├── market/             # Market data
│   │   ├── portfolio/          # Portfolio management
│   │   ├── admin/              # Admin panel
│   │   └── main.py             # FastAPI app
│   ├── requirements.txt
│   └── alembic/                # Database migrations
│
├── docs/                        # Documentation
│   ├── NEORA_COMPLETE_DOCUMENTATION.md
│   └── MVP_IMPLEMENTATION_GUIDE.md
│
└── README.md                    # This file
```

---

## 🔐 Security Features

- ✅ **Password Hashing** - bcrypt with salt
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Email Verification** - Confirmed email addresses only
- ✅ **Role-Based Access** - User/Admin permissions
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **SQL Injection Prevention** - ORM-based queries
- ✅ **XSS Protection** - Input sanitization
- ✅ **HTTPS Enforced** - Encrypted communication
- ✅ **Audit Logging** - All admin actions logged

---

## 🎯 Roadmap

### Phase 1: MVP (Current) ✅
- User authentication system
- Real-time market data (Kotak Neo)
- Portfolio management
- Watchlist functionality
- Basic admin dashboard

### Phase 2: Enhanced Features (Month 2)
- Web scraping (NSE, BSE, Moneycontrol)
- News aggregation & sentiment analysis
- IPO tracker
- Corporate actions calendar
- Price alerts

### Phase 3: Real-Time & Analytics (Month 3)
- WebSocket live updates
- Advanced charting (TradingView)
- Stock screener (50+ filters)
- Technical indicators
- Options chain analysis

### Phase 4: AI & ML (Month 4)
- Stock price predictions
- Portfolio optimization AI
- Risk analysis models
- Pattern recognition
- Sentiment analysis

### Phase 5: Premium (Month 5)
- Subscription payments
- Premium analytics
- API access for developers
- Backtesting engine
- Research reports

### Phase 6: Mobile & Scale (Month 6)
- Progressive Web App
- Push notifications
- Docker containers
- Kubernetes deployment
- Global CDN

See [Complete Documentation](docs/NEORA_COMPLETE_DOCUMENTATION.md) for detailed roadmap.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
```
feat: Add new feature
fix: Bug fix
docs: Documentation update
style: Code formatting
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead:** [Your Name]
- **Backend Developer:** [Name]
- **Frontend Developer:** [Name]
- **DevOps:** [Name]

---

## 📧 Contact

- **Website:** https://neora.app
- **Email:** hello@neora.app
- **Support:** support@neora.app
- **GitHub:** https://github.com/neora-app

---

## 🙏 Acknowledgments

- **Kotak Neo** - Market data API
- **Supabase** - Backend infrastructure
- **Google Gemini** - AI capabilities
- **TradingView** - Charting library (future)
- **React Community** - Frontend ecosystem

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/neora-app/neora?style=social)
![GitHub forks](https://img.shields.io/github/forks/neora-app/neora?style=social)
![GitHub issues](https://img.shields.io/github/issues/neora-app/neora)
![GitHub pull requests](https://img.shields.io/github/issues-pr/neora-app/neora)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ in India for Indian investors**

*Last Updated: December 2024*
