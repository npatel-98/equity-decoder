# 📊 Equity Decoder

A professional NSE & BSE stock market analyser built with Next.js 14, featuring AI-powered stock screening, Indian index tracking, and global market monitoring.

## ✨ Features

- **Market Pulse** — Live ticker, market status, top gainers/losers, breadth indicator
- **Stock Screener (Rising 1M)** — 10 stocks likely to rise 10–20% in 1 month
- **Stock Screener (Rising 2M)** — 10 stocks likely to rise 10–20% in 2 months
- **Stock Screener (Falling 1M)** — 10 stocks at risk of falling 10–20% in 1 month
- **Stock Screener (Falling 2M)** — 10 stocks at risk of falling 10–20% in 2 months
- **India Indexes** — 21 NSE & BSE indices (broad, sectoral, thematic)
- **Global Markets** — 18 world indices across Americas, Europe, Middle East, Asia & Oceania

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
# Edit .env.local and fill in your API keys
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚢 Deploy to Vercel

### Option A — Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login with your token (set VERCEL_TOKEN in env first)
vercel login --token $VERCEL_TOKEN

# Deploy to production
vercel --prod --token $VERCEL_TOKEN

# Add environment variables
vercel env add TWELVE_DATA_API_KEY production
vercel env add ALPHA_VANTAGE_API_KEY production
```

### Option B — Push to GitHub and connect Vercel

1. Push this repo to `https://github.com/npatel-98/equity-decoder`
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repo
4. Add environment variables in the Vercel dashboard
5. Deploy!

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TWELVE_DATA_API_KEY` | Optional | Twelve Data API key (free tier) |
| `ALPHA_VANTAGE_API_KEY` | Optional | Alpha Vantage API key (free tier) |
| `NEXT_PUBLIC_APP_NAME` | No | App display name |
| `NEXT_PUBLIC_REFRESH_INTERVAL` | No | Auto-refresh ms (default 300000) |

> The app works with mock data out of the box — API keys unlock real market data.

---

## 🛠️ Tech Stack

- **Next.js 14** — App Router, TypeScript, Server Components
- **Tailwind CSS** — Dark-first styling with CSS variables
- **Recharts** — Sparkline charts
- **Yahoo Finance 2** — Market data (optional)
- **Zustand** — Lightweight state management
- **Lucide React** — Icons
- **Syne + DM Sans + JetBrains Mono** — Typography

---

## 📁 Project Structure

```
equity-decoder/
├── app/
│   ├── api/
│   │   ├── indexes/india/     # India index data API
│   │   ├── indexes/global/    # Global index data API
│   │   └── screener/          # Stock screener APIs
│   ├── dashboard/             # Main dashboard page
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── Header.tsx
│   ├── TabNav.tsx
│   ├── TickerBanner.tsx
│   ├── OverviewTab.tsx
│   ├── RisingStockTable.tsx
│   ├── FallingStockTable.tsx
│   ├── IndiaIndexesTab.tsx
│   ├── GlobalIndexesTab.tsx
│   ├── IndexCard.tsx
│   ├── GlobalIndexCard.tsx
│   ├── Sparkline.tsx
│   └── Skeleton.tsx
├── lib/
│   ├── mockData.ts            # Mock data generator
│   └── utils.ts               # Utility functions
├── types/
│   └── stock.ts               # TypeScript interfaces
└── vercel.json
```

---

## ⚠️ Disclaimer

Equity Decoder is for **informational purposes only**. Stock screener signals are based on technical indicators and are **not SEBI-registered investment advice**. Always consult a qualified financial advisor before making investment decisions.
