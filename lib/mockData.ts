import { Stock, ScreenedStock, IndexData, GlobalIndex } from "@/types/stock";

function randomBetween(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateSparkline(base: number, points = 30, volatility = 0.02): number[] {
  const data: number[] = [base];
  for (let i = 1; i < points; i++) {
    const prev = data[i - 1];
    const change = prev * randomBetween(-volatility, volatility);
    data.push(parseFloat((prev + change).toFixed(2)));
  }
  return data;
}

const NSE_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy" },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT" },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking" },
  { symbol: "INFY", name: "Infosys", sector: "IT" },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "ITC", name: "ITC Limited", sector: "FMCG" },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", sector: "Finance" },
  { symbol: "WIPRO", name: "Wipro", sector: "IT" },
  { symbol: "HCLTECH", name: "HCL Technologies", sector: "IT" },
  { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking" },
  { symbol: "ASIANPAINT", name: "Asian Paints", sector: "Consumer" },
  { symbol: "MARUTI", name: "Maruti Suzuki", sector: "Auto" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", sector: "Pharma" },
  { symbol: "TITAN", name: "Titan Company", sector: "Consumer" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement", sector: "Cement" },
  { symbol: "NESTLEIND", name: "Nestle India", sector: "FMCG" },
  { symbol: "TECHM", name: "Tech Mahindra", sector: "IT" },
  { symbol: "POWERGRID", name: "Power Grid Corp", sector: "Power" },
  { symbol: "ADANIPORTS", name: "Adani Ports", sector: "Infrastructure" },
  { symbol: "ONGC", name: "ONGC", sector: "Energy" },
  { symbol: "COALINDIA", name: "Coal India", sector: "Mining" },
  { symbol: "JSWSTEEL", name: "JSW Steel", sector: "Metal" },
];

const BSE_STOCKS = [
  { symbol: "500325", name: "Reliance Industries", sector: "Energy" },
  { symbol: "532540", name: "TCS", sector: "IT" },
  { symbol: "500180", name: "HDFC Bank", sector: "Banking" },
  { symbol: "500209", name: "Infosys", sector: "IT" },
  { symbol: "532174", name: "ICICI Bank", sector: "Banking" },
  { symbol: "500696", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "500875", name: "ITC Limited", sector: "FMCG" },
  { symbol: "500112", name: "State Bank of India", sector: "Banking" },
  { symbol: "532454", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "500034", name: "Bajaj Finance", sector: "Finance" },
];

function generateStock(base: { symbol: string; name: string; sector: string }, exchange: "NSE" | "BSE"): Stock {
  const cmp = randomBetween(100, 5000);
  const changePct = randomBetween(-5, 5);
  const change = parseFloat(((cmp * changePct) / 100).toFixed(2));

  return {
    symbol: base.symbol,
    name: base.name,
    exchange,
    sector: base.sector,
    cmp,
    change,
    changePct,
    high: cmp * randomBetween(1.001, 1.03),
    low: cmp * randomBetween(0.97, 0.999),
    volume: randomBetween(100000, 10000000, 0),
    avgVolume: randomBetween(500000, 8000000, 0),
    rsi: randomBetween(30, 80),
    macd: randomBetween(-10, 10),
    sma20: cmp * randomBetween(0.95, 1.05),
    sma50: cmp * randomBetween(0.9, 1.1),
    sma200: cmp * randomBetween(0.85, 1.15),
    week52High: cmp * randomBetween(1.05, 1.5),
    week52Low: cmp * randomBetween(0.5, 0.95),
    pe: randomBetween(10, 60),
    debtToEquity: randomBetween(0, 3),
    promoterPledge: randomBetween(0, 60),
    deliveryPct: randomBetween(30, 90),
    marketCap: randomBetween(1000, 1000000, 0),
    sparkline: generateSparkline(cmp),
  };
}

function scoreRising(stock: Stock): { score: number; signals: string[] } {
  let score = 0;
  const signals: string[] = [];

  if (stock.rsi >= 45 && stock.rsi <= 60) { score += 20; signals.push("RSI in momentum zone"); }
  if (stock.cmp > stock.sma20) { score += 15; signals.push("Above 20-day SMA"); }
  if (stock.volume > stock.avgVolume * 1.5) { score += 20; signals.push("Volume surge detected"); }
  if (stock.macd > 0) { score += 15; signals.push("Positive MACD crossover"); }
  if (stock.cmp >= stock.week52High * 0.7 && stock.cmp <= stock.week52High * 0.85) { score += 15; signals.push("Near 52W high breakout zone"); }
  if (stock.deliveryPct > 60) { score += 15; signals.push("High institutional delivery"); }

  return { score: Math.min(score, 100), signals };
}

function scoreFalling(stock: Stock): { score: number; signals: string[] } {
  let score = 0;
  const signals: string[] = [];

  if (stock.rsi > 70) { score += 20; signals.push("RSI overbought"); }
  if (stock.cmp > stock.sma200 * 1.1) { score += 20; signals.push("10%+ above 200-day SMA"); }
  if (stock.promoterPledge > 30) { score += 20; signals.push(`High promoter pledge ${stock.promoterPledge.toFixed(0)}%`); }
  if (stock.volume < stock.avgVolume * 0.8) { score += 15; signals.push("Declining volume on updays"); }
  if (stock.macd < 0) { score += 15; signals.push("Negative MACD divergence"); }
  if (stock.debtToEquity > 2) { score += 10; signals.push(`High D/E ratio ${stock.debtToEquity.toFixed(1)}`); }

  return { score: Math.min(score, 100), signals };
}

export function getMockRisingStocks(timeframe: "1m" | "2m", count = 10): ScreenedStock[] {
  const pool = [...NSE_STOCKS, ...BSE_STOCKS.slice(0, 5)];
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count);

  return shuffled.map((base, i) => {
    const exchange = i < 7 ? "NSE" : "BSE";
    const stock = generateStock(base, exchange);
    stock.rsi = randomBetween(45, 60);
    stock.macd = randomBetween(0.5, 10);
    stock.volume = stock.avgVolume * randomBetween(1.5, 3);
    const { score, signals } = scoreRising(stock);
    const upsidePct = randomBetween(10, 20);

    return {
      ...stock,
      targetLow: stock.cmp * 1.1,
      targetHigh: stock.cmp * 1.2,
      upsidePct,
      downsidePct: 0,
      confidenceScore: score,
      riskScore: 0,
      signals,
      catalystDate: timeframe === "2m" ? new Date(Date.now() + randomBetween(30, 60) * 86400000).toLocaleDateString("en-IN") : undefined,
    };
  });
}

export function getMockFallingStocks(count = 10): ScreenedStock[] {
  const pool = [...NSE_STOCKS.slice(10), ...BSE_STOCKS];
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count);

  return shuffled.map((base, i) => {
    const exchange = i < 6 ? "NSE" : "BSE";
    const stock = generateStock(base, exchange);
    stock.rsi = randomBetween(68, 82);
    stock.macd = randomBetween(-10, -0.5);
    stock.promoterPledge = randomBetween(25, 60);
    stock.debtToEquity = randomBetween(1.5, 3.5);
    const { score, signals } = scoreFalling(stock);
    const downsidePct = randomBetween(10, 20);

    return {
      ...stock,
      targetLow: stock.cmp * 0.8,
      targetHigh: stock.cmp * 0.9,
      upsidePct: 0,
      downsidePct,
      confidenceScore: 0,
      riskScore: score,
      signals,
    };
  });
}

export function getMockIndiaIndexes(): IndexData[] {
  const indexes = [
    { symbol: "NIFTY50", name: "NIFTY 50", exchange: "NSE", category: "broad" as const },
    { symbol: "NIFTYNEXT50", name: "NIFTY NEXT 50", exchange: "NSE", category: "broad" as const },
    { symbol: "NIFTY100", name: "NIFTY 100", exchange: "NSE", category: "broad" as const },
    { symbol: "NIFTY200", name: "NIFTY 200", exchange: "NSE", category: "broad" as const },
    { symbol: "NIFTYMIDCAP50", name: "NIFTY MIDCAP 50", exchange: "NSE", category: "broad" as const },
    { symbol: "NIFTYMIDCAP100", name: "NIFTY MIDCAP 100", exchange: "NSE", category: "broad" as const },
    { symbol: "NIFTYSMALLCAP100", name: "NIFTY SMALLCAP 100", exchange: "NSE", category: "broad" as const },
    { symbol: "NIFTYBANK", name: "NIFTY BANK", exchange: "NSE", category: "sectoral" as const },
    { symbol: "NIFTYIT", name: "NIFTY IT", exchange: "NSE", category: "sectoral" as const },
    { symbol: "NIFTYPHARMA", name: "NIFTY PHARMA", exchange: "NSE", category: "sectoral" as const },
    { symbol: "NIFTYAUTO", name: "NIFTY AUTO", exchange: "NSE", category: "sectoral" as const },
    { symbol: "NIFTYFMCG", name: "NIFTY FMCG", exchange: "NSE", category: "sectoral" as const },
    { symbol: "NIFTYMETAL", name: "NIFTY METAL", exchange: "NSE", category: "sectoral" as const },
    { symbol: "NIFTYREALTY", name: "NIFTY REALTY", exchange: "NSE", category: "sectoral" as const },
    { symbol: "NIFTYENERGY", name: "NIFTY ENERGY", exchange: "NSE", category: "sectoral" as const },
    { symbol: "SENSEX", name: "SENSEX", exchange: "BSE", category: "broad" as const },
    { symbol: "BSE100", name: "BSE 100", exchange: "BSE", category: "broad" as const },
    { symbol: "BSE200", name: "BSE 200", exchange: "BSE", category: "broad" as const },
    { symbol: "BSEMIDCAP", name: "BSE MIDCAP", exchange: "BSE", category: "broad" as const },
    { symbol: "BSESMALLCAP", name: "BSE SMALLCAP", exchange: "BSE", category: "broad" as const },
    { symbol: "NIFTYINFRA", name: "NIFTY INFRA", exchange: "NSE", category: "thematic" as const },
  ];

  const bases: Record<string, number> = {
    NIFTY50: 22500, NIFTYNEXT50: 63000, NIFTY100: 23200, NIFTY200: 12800,
    NIFTYMIDCAP50: 13500, NIFTYMIDCAP100: 47000, NIFTYSMALLCAP100: 16000,
    NIFTYBANK: 48000, NIFTYIT: 33000, NIFTYPHARMA: 18500, NIFTYAUTO: 22000,
    NIFTYFMCG: 20500, NIFTYMETAL: 8500, NIFTYREALTY: 900, NIFTYENERGY: 9200,
    SENSEX: 74000, BSE100: 23500, BSE200: 12000, BSEMIDCAP: 33000,
    BSESMALLCAP: 42000, NIFTYINFRA: 8800,
  };

  return indexes.map((idx) => {
    const base = bases[idx.symbol] || 10000;
    const changePct = randomBetween(-2, 2);
    const value = parseFloat((base * (1 + changePct / 100)).toFixed(2));
    const change = parseFloat(((value - base)).toFixed(2));

    return {
      ...idx,
      value,
      change,
      changePct,
      high: value * randomBetween(1.001, 1.01),
      low: value * randomBetween(0.99, 0.999),
      open: base,
      sparkline: generateSparkline(base, 30, 0.005),
    };
  });
}

export function getMockGlobalIndexes(): GlobalIndex[] {
  return [
    { symbol: "^GSPC", name: "S&P 500", region: "Americas", country: "USA", flag: "🇺🇸", currency: "USD", value: 5234.18, change: 18.5, changePct: 0.35, localTime: "09:35 EST", isOpen: true },
    { symbol: "^DJI", name: "Dow Jones", region: "Americas", country: "USA", flag: "🇺🇸", currency: "USD", value: 38765.00, change: -120.4, changePct: -0.31, localTime: "09:35 EST", isOpen: true },
    { symbol: "^IXIC", name: "NASDAQ", region: "Americas", country: "USA", flag: "🇺🇸", currency: "USD", value: 16340.50, change: 95.2, changePct: 0.59, localTime: "09:35 EST", isOpen: true },
    { symbol: "^RUT", name: "Russell 2000", region: "Americas", country: "USA", flag: "🇺🇸", currency: "USD", value: 2045.30, change: -8.9, changePct: -0.43, localTime: "09:35 EST", isOpen: true },
    { symbol: "^FTSE", name: "FTSE 100", region: "Europe", country: "UK", flag: "🇬🇧", currency: "GBP", value: 8245.60, change: 32.1, changePct: 0.39, localTime: "14:35 GMT", isOpen: true },
    { symbol: "^GDAXI", name: "DAX", region: "Europe", country: "Germany", flag: "🇩🇪", currency: "EUR", value: 18432.00, change: -45.2, changePct: -0.24, localTime: "15:35 CET", isOpen: true },
    { symbol: "^FCHI", name: "CAC 40", region: "Europe", country: "France", flag: "🇫🇷", currency: "EUR", value: 8125.30, change: 28.7, changePct: 0.35, localTime: "15:35 CET", isOpen: true },
    { symbol: "^TASI.SR", name: "Tadawul (Saudi)", region: "Middle East", country: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", value: 12456.00, change: 156.8, changePct: 1.27, localTime: "17:35 AST", isOpen: false },
    { symbol: "^DFMGI", name: "Dubai DFM", region: "Middle East", country: "UAE", flag: "🇦🇪", currency: "AED", value: 4320.50, change: -22.3, changePct: -0.51, localTime: "17:35 GST", isOpen: false },
    { symbol: "^ADX", name: "Abu Dhabi ADX", region: "Middle East", country: "UAE", flag: "🇦🇪", currency: "AED", value: 9856.00, change: 45.6, changePct: 0.46, localTime: "17:35 GST", isOpen: false },
    { symbol: "^N225", name: "Nikkei 225", region: "Japan", country: "Japan", flag: "🇯🇵", currency: "JPY", value: 38640.00, change: 320.5, changePct: 0.84, localTime: "22:35 JST", isOpen: false },
    { symbol: "^TPX", name: "TOPIX", region: "Japan", country: "Japan", flag: "🇯🇵", currency: "JPY", value: 2745.80, change: 18.2, changePct: 0.67, localTime: "22:35 JST", isOpen: false },
    { symbol: "^HSI", name: "Hang Seng", region: "SE Asia", country: "Hong Kong", flag: "🇭🇰", currency: "HKD", value: 17890.40, change: -234.5, changePct: -1.29, localTime: "21:35 HKT", isOpen: false },
    { symbol: "^STI", name: "STI Singapore", region: "SE Asia", country: "Singapore", flag: "🇸🇬", currency: "SGD", value: 3425.60, change: 12.3, changePct: 0.36, localTime: "21:35 SGT", isOpen: false },
    { symbol: "^KLSE", name: "KLCI Malaysia", region: "SE Asia", country: "Malaysia", flag: "🇲🇾", currency: "MYR", value: 1545.20, change: -5.8, changePct: -0.37, localTime: "21:35 MYT", isOpen: false },
    { symbol: "000001.SS", name: "Shanghai Composite", region: "China", country: "China", flag: "🇨🇳", currency: "CNY", value: 3145.80, change: 28.4, changePct: 0.91, localTime: "21:35 CST", isOpen: false },
    { symbol: "000300.SS", name: "CSI 300", region: "China", country: "China", flag: "🇨🇳", currency: "CNY", value: 3654.20, change: 32.1, changePct: 0.89, localTime: "21:35 CST", isOpen: false },
    { symbol: "^AXJO", name: "ASX 200", region: "Oceania", country: "Australia", flag: "🇦🇺", currency: "AUD", value: 7845.30, change: 45.6, changePct: 0.58, localTime: "00:35 AEST", isOpen: false },
  ].map((idx) => ({
    ...idx,
    sparkline: generateSparkline(idx.value, 30, 0.005),
  }));
}
