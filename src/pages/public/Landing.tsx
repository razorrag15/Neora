import { Link } from 'react-router-dom'
import { Crown, TrendingUp, BarChart3, Brain, Shield, Zap } from 'lucide-react'

export default function Landing() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-main rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 mb-6">
            <Crown className="w-16 h-16 text-accent-main animate-float" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="bg-gradient-royal bg-clip-text text-transparent">
              Royal Market Intelligence
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Your ultimate companion for the Indian stock market. Real-time data, AI-powered insights, and comprehensive analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-main text-white rounded-lg font-semibold hover:shadow-glow transition-all text-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/market"
              className="px-8 py-4 bg-surface-elevated border border-border-light rounded-lg font-semibold hover:border-accent-main transition-all text-lg"
            >
              View Market Data
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-main">3000+</div>
              <div className="text-sm text-text-tertiary">Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-main">Real-time</div>
              <div className="text-sm text-text-tertiary">Data</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-main">AI</div>
              <div className="text-sm text-text-tertiary">Insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-main">Free</div>
              <div className="text-sm text-text-tertiary">Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-surface-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-text-secondary">
              Powerful features for modern investors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-royal p-8">
              <div className="w-12 h-12 bg-gradient-main rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Quotes</h3>
              <p className="text-text-secondary">
                Live market data from NSE & BSE with minimal latency
              </p>
            </div>

            <div className="card-royal p-8">
              <div className="w-12 h-12 bg-gradient-main rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Portfolio Tracking</h3>
              <p className="text-text-secondary">
                Monitor your investments with real-time P&L calculations
              </p>
            </div>

            <div className="card-royal p-8">
              <div className="w-12 h-12 bg-gradient-main rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-text-secondary">
                Get intelligent insights powered by advanced AI
              </p>
            </div>

            <div className="card-royal p-8">
              <div className="w-12 h-12 bg-gradient-main rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-text-secondary">
                Your data is encrypted and protected with industry-standard security
              </p>
            </div>

            <div className="card-royal p-8">
              <div className="w-12 h-12 bg-gradient-main rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-text-secondary">
                Optimized performance for quick decision making
              </p>
            </div>

            <div className="card-royal p-8">
              <div className="w-12 h-12 bg-gradient-main rounded-lg flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Analytics</h3>
              <p className="text-text-secondary">
                Advanced charting and technical indicators
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Join thousands of investors using NEORA for smarter decisions
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gradient-main text-white rounded-lg font-semibold hover:shadow-glow transition-all text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}