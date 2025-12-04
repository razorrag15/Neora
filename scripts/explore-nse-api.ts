/**
 * NSE API Explorer & Response Structure Analyzer
 * 
 * This script helps us understand all NSE API endpoints,
 * their response structures, and available data fields.
 * 
 * Run with: npx tsx scripts/explore-nse-api.ts
 */

import axios, { AxiosInstance } from 'axios'
import * as fs from 'fs'
import * as path from 'path'

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

class NSEAPIExplorer {
  private client: AxiosInstance
  private results: any = {}
  private outputDir = './api-exploration-results'

  constructor() {
    // Create axios instance with NSE-like headers
    this.client = axios.create({
      baseURL: 'https://www.nseindia.com',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Referer': 'https://www.nseindia.com/',
      },
      timeout: 30000,
    })

    // Create output directory
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }

  log(message: string, color: string = colors.reset) {
    console.log(`${color}${message}${colors.reset}`)
  }

  async initSession() {
    this.log('\n🔐 Initializing NSE session...', colors.cyan)
    try {
      await this.client.get('/')
      this.log('✅ Session initialized successfully', colors.green)
      return true
    } catch (error: any) {
      this.log(`❌ Session initialization failed: ${error.message}`, colors.red)
      return false
    }
  }

  async exploreEndpoint(name: string, endpoint: string, description: string) {
    this.log(`\n📡 Exploring: ${name}`, colors.bright)
    this.log(`   Endpoint: ${endpoint}`, colors.blue)
    this.log(`   Description: ${description}`, colors.yellow)

    try {
      const response = await this.client.get(endpoint)
      const data = response.data

      this.results[name] = {
        endpoint,
        description,
        status: 'success',
        statusCode: response.status,
        dataStructure: this.analyzeStructure(data),
        sampleData: this.getSampleData(data),
        responseSize: JSON.stringify(data).length,
        timestamp: new Date().toISOString(),
      }

      this.log('✅ Success', colors.green)
      this.log(`   Response Size: ${this.results[name].responseSize} bytes`, colors.cyan)
      this.log(`   Data Type: ${typeof data}`, colors.cyan)
      
      if (Array.isArray(data)) {
        this.log(`   Array Length: ${data.length}`, colors.cyan)
      } else if (typeof data === 'object' && data !== null) {
        this.log(`   Object Keys: ${Object.keys(data).length}`, colors.cyan)
        this.log(`   Top-level Keys: ${Object.keys(data).slice(0, 10).join(', ')}`, colors.blue)
      }

      // Save individual response
      this.saveResponse(name, data)

      return data
    } catch (error: any) {
      this.results[name] = {
        endpoint,
        description,
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      }

      this.log(`❌ Failed: ${error.message}`, colors.red)
      if (error.response) {
        this.log(`   Status Code: ${error.response.status}`, colors.red)
      }
      return null
    }
  }

  analyzeStructure(data: any, depth: number = 0, maxDepth: number = 3): any {
    if (depth > maxDepth) return 'MAX_DEPTH_REACHED'

    if (Array.isArray(data)) {
      if (data.length === 0) return []
      return [this.analyzeStructure(data[0], depth + 1, maxDepth)]
    }

    if (typeof data === 'object' && data !== null) {
      const structure: any = {}
      for (const key of Object.keys(data).slice(0, 20)) { // Limit to 20 keys
        structure[key] = this.getTypeInfo(data[key], depth + 1, maxDepth)
      }
      return structure
    }

    return typeof data
  }

  getTypeInfo(value: any, depth: number, maxDepth: number): any {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    
    const type = typeof value
    
    if (type === 'object') {
      if (Array.isArray(value)) {
        if (value.length === 0) return 'array(empty)'
        return `array(${value.length}) of ${this.analyzeStructure(value[0], depth, maxDepth)}`
      }
      return this.analyzeStructure(value, depth, maxDepth)
    }
    
    return type
  }

  getSampleData(data: any): any {
    if (Array.isArray(data)) {
      return data.slice(0, 3) // First 3 items
    }
    if (typeof data === 'object' && data !== null) {
      const sample: any = {}
      const keys = Object.keys(data).slice(0, 10)
      for (const key of keys) {
        sample[key] = data[key]
      }
      return sample
    }
    return data
  }

  saveResponse(name: string, data: any) {
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.json`
    const filepath = path.join(this.outputDir, filename)
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
    this.log(`   💾 Saved to: ${filepath}`, colors.cyan)
  }

  async exploreAllEndpoints() {
    this.log('\n🚀 Starting NSE API Exploration...', colors.bright)
    this.log('=' .repeat(60), colors.blue)

    // Initialize session first
    const sessionOk = await this.initSession()
    if (!sessionOk) {
      this.log('\n⚠️  Continuing without session (may cause CORS issues)', colors.yellow)
    }

    // Wait a bit after session init
    await this.delay(2000)

    // 1. Market Status
    await this.exploreEndpoint(
      'Market Status',
      '/api/marketStatus',
      'Overall market status - pre-open, open, closed'
    )
    await this.delay(1000)

    // 2. All Indices
    await this.exploreEndpoint(
      'All Indices',
      '/api/allIndices',
      'All NSE indices with current values'
    )
    await this.delay(1000)

    // 3. Index Quote - NIFTY 50
    await this.exploreEndpoint(
      'NIFTY 50 Quote',
      '/api/equity-stockIndices?index=NIFTY%2050',
      'Detailed NIFTY 50 index data'
    )
    await this.delay(1000)

    // 4. Index Quote - BANK NIFTY
    await this.exploreEndpoint(
      'BANK NIFTY Quote',
      '/api/equity-stockIndices?index=NIFTY%20BANK',
      'Detailed BANK NIFTY index data'
    )
    await this.delay(1000)

    // 5. Stock Quote - Reliance
    await this.exploreEndpoint(
      'Stock Quote Reliance',
      '/api/quote-equity?symbol=RELIANCE',
      'Detailed stock quote for Reliance Industries'
    )
    await this.delay(1000)

    // 6. Stock Quote - TCS
    await this.exploreEndpoint(
      'Stock Quote TCS',
      '/api/quote-equity?symbol=TCS',
      'Detailed stock quote for TCS'
    )
    await this.delay(1000)

    // 7. Top Gainers
    await this.exploreEndpoint(
      'Top Gainers',
      '/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O',
      'Top gaining stocks'
    )
    await this.delay(1000)

    // 8. Live Market Data
    await this.exploreEndpoint(
      'Live Market',
      '/api/marketStatus',
      'Live market status and trading hours'
    )
    await this.delay(1000)

    // 9. Pre-Open Market
    await this.exploreEndpoint(
      'Pre Open Market',
      '/api/market-data-pre-open?key=ALL',
      'Pre-open market data for all securities'
    )
    await this.delay(1000)

    // 10. FNO Stock List
    await this.exploreEndpoint(
      'FNO Stocks',
      '/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O',
      'List of stocks in F&O segment'
    )
    await this.delay(1000)

    // 11. Holiday Calendar
    await this.exploreEndpoint(
      'Holidays',
      '/api/holiday-master?type=trading',
      'Trading holidays calendar'
    )
    await this.delay(1000)

    // 12. Circulars
    await this.exploreEndpoint(
      'Circulars',
      '/api/circulars',
      'Latest NSE circulars and announcements'
    )
    await this.delay(1000)

    // 13. Corporate Actions
    await this.exploreEndpoint(
      'Corporate Actions',
      '/api/corporates-corporateActions?index=equities',
      'Corporate actions like dividends, splits, bonuses'
    )
    await this.delay(1000)

    // 14. IPO List
    await this.exploreEndpoint(
      'IPO List',
      '/api/ipo-detail',
      'Current and upcoming IPO details'
    )
    await this.delay(1000)

    // 15. Block Deals
    await this.exploreEndpoint(
      'Block Deals',
      '/api/block-deal',
      'Block deals on NSE'
    )
    await this.delay(1000)

    // 16. Bulk Deals
    await this.exploreEndpoint(
      'Bulk Deals',
      '/api/equity-bulk',
      'Bulk deals on NSE'
    )
    await this.delay(1000)

    // 17. Market Turnover
    await this.exploreEndpoint(
      'Market Turnover',
      '/api/market-turnover',
      'Market turnover statistics'
    )
    await this.delay(1000)

    // 18. Search Stocks
    await this.exploreEndpoint(
      'Search',
      '/api/search/autocomplete?q=reli',
      'Stock search autocomplete'
    )
    await this.delay(1000)

    // 19. Index Stock List - NIFTY 50
    await this.exploreEndpoint(
      'NIFTY 50 Stocks',
      '/api/equity-stockIndices?index=NIFTY%2050',
      'List of all stocks in NIFTY 50'
    )
    await this.delay(1000)

    // 20. Advance Decline
    await this.exploreEndpoint(
      'Advance Decline',
      '/api/chart-databyindex?index=NIFTY%2050&indices=true',
      'Advance decline ratio'
    )

    this.log('\n' + '='.repeat(60), colors.blue)
    this.log('✅ Exploration Complete!', colors.green)
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  generateSummaryReport() {
    this.log('\n📊 Generating Summary Report...', colors.cyan)

    const summary = {
      totalEndpoints: Object.keys(this.results).length,
      successful: Object.values(this.results).filter((r: any) => r.status === 'success').length,
      failed: Object.values(this.results).filter((r: any) => r.status === 'failed').length,
      timestamp: new Date().toISOString(),
      endpoints: this.results,
    }

    // Save summary
    const summaryPath = path.join(this.outputDir, 'SUMMARY.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))

    // Generate markdown report
    this.generateMarkdownReport(summary)

    this.log(`\n📄 Summary saved to: ${summaryPath}`, colors.green)
    
    // Print quick summary
    this.log('\n📈 Quick Summary:', colors.bright)
    this.log(`   Total Endpoints: ${summary.totalEndpoints}`, colors.blue)
    this.log(`   Successful: ${summary.successful}`, colors.green)
    this.log(`   Failed: ${summary.failed}`, colors.red)
  }

  generateMarkdownReport(summary: any) {
    let markdown = '# NSE API Exploration Report\n\n'
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`
    markdown += `## Summary\n\n`
    markdown += `- **Total Endpoints Tested:** ${summary.totalEndpoints}\n`
    markdown += `- **Successful:** ${summary.successful}\n`
    markdown += `- **Failed:** ${summary.failed}\n\n`
    markdown += `---\n\n`

    markdown += '## Endpoints\n\n'

    for (const [name, result] of Object.entries(this.results)) {
      const r = result as any
      markdown += `### ${name}\n\n`
      markdown += `- **Endpoint:** \`${r.endpoint}\`\n`
      markdown += `- **Description:** ${r.description}\n`
      markdown += `- **Status:** ${r.status === 'success' ? '✅ Success' : '❌ Failed'}\n`
      
      if (r.status === 'success') {
        markdown += `- **Response Size:** ${r.responseSize} bytes\n`
        markdown += `- **Data Structure:**\n\`\`\`json\n${JSON.stringify(r.dataStructure, null, 2)}\n\`\`\`\n`
      } else {
        markdown += `- **Error:** ${r.error}\n`
      }
      
      markdown += '\n---\n\n'
    }

    const reportPath = path.join(this.outputDir, 'EXPLORATION_REPORT.md')
    fs.writeFileSync(reportPath, markdown)
    this.log(`📄 Markdown report saved to: ${reportPath}`, colors.green)
  }

  async run() {
    console.clear()
    this.log('╔═══════════════════════════════════════════════════════════╗', colors.bright)
    this.log('║         NSE API EXPLORER & RESPONSE ANALYZER            ║', colors.bright)
    this.log('╚═══════════════════════════════════════════════════════════╝', colors.bright)

    await this.exploreAllEndpoints()
    this.generateSummaryReport()

    this.log('\n✨ All results saved in: ' + this.outputDir, colors.cyan)
    this.log('📚 Check EXPLORATION_REPORT.md for detailed analysis\n', colors.yellow)
  }
}

// Run the explorer
const explorer = new NSEAPIExplorer()
explorer.run().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})