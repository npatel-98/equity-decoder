import { IndexData } from "@/types/stock";

const NSE_BASE = "https://www.nseindia.com";
const YF_QUOTE = "https://query1.finance.yahoo.com/v8/finance/chart";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
};

// Module-scoped cookie cache (valid 5 minutes per server process)
let cookieCache: { value: string; expiresAt: number } | null = null;

async function getSessionCookies(): Promise<string> {
  if (cookieCache && Date.now() < cookieCache.expiresAt) {
    return cookieCache.value;
  }
  const res = await fetch(NSE_BASE, {
    headers: {
      ...BROWSER_HEADERS,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
    cache: "no-store",
  });
  const rawCookies = res.headers.getSetCookie?.() ?? [];
  const value = rawCookies.map((c) => c.split(";")[0]).join("; ");
  cookieCache = { value, expiresAt: Date.now() + 5 * 60 * 1000 };
  return value;
}

interface NSERawIndex {
  index: string;
  last: number;
  variation: number;
  percentChange: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
}

// Maps NSE API "index" names → our symbol/category config
const NSE_INDEX_MAP: Record<
  string,
  { symbol: string; category: "broad" | "sectoral" | "thematic" }
> = {
  "NIFTY 50": { symbol: "NIFTY50", category: "broad" },
  "NIFTY NEXT 50": { symbol: "NIFTYNEXT50", category: "broad" },
  "NIFTY 100": { symbol: "NIFTY100", category: "broad" },
  "NIFTY 200": { symbol: "NIFTY200", category: "broad" },
  "NIFTY 500": { symbol: "NIFTY500", category: "broad" },
  "NIFTY MIDCAP 50": { symbol: "NIFTYMIDCAP50", category: "broad" },
  "NIFTY MIDCAP 100": { symbol: "NIFTYMIDCAP100", category: "broad" },
  "NIFTY SMLCAP 100": { symbol: "NIFTYSMALLCAP100", category: "broad" },
  "NIFTY BANK": { symbol: "NIFTYBANK", category: "sectoral" },
  "NIFTY IT": { symbol: "NIFTYIT", category: "sectoral" },
  "NIFTY PHARMA": { symbol: "NIFTYPHARMA", category: "sectoral" },
  "NIFTY AUTO": { symbol: "NIFTYAUTO", category: "sectoral" },
  "NIFTY FMCG": { symbol: "NIFTYFMCG", category: "sectoral" },
  "NIFTY METAL": { symbol: "NIFTYMETAL", category: "sectoral" },
  "NIFTY REALTY": { symbol: "NIFTYREALTY", category: "sectoral" },
  "NIFTY ENERGY": { symbol: "NIFTYENERGY", category: "sectoral" },
  "NIFTY INFRA": { symbol: "NIFTYINFRA", category: "thematic" },
  "NIFTY COMMODITIES": { symbol: "NIFTYCOMMODITIES", category: "thematic" },
  "NIFTY FIN SERVICE": { symbol: "NIFTYFINSERVICE", category: "sectoral" },
  "NIFTY HEALTHCARE INDEX": { symbol: "NIFTYHEALTHCARE", category: "sectoral" },
  "NIFTY OIL & GAS": { symbol: "NIFTYOILGAS", category: "sectoral" },
  "NIFTY PSU BANK": { symbol: "NIFTYPSUBANK", category: "sectoral" },
  "NIFTY PRIVATE BANK": { symbol: "NIFTYPVTBANK", category: "sectoral" },
  "NIFTY CONSUMPTION": { symbol: "NIFTYCONSUMPTION", category: "thematic" },
  "NIFTY MNC": { symbol: "NIFTYMNC", category: "thematic" },
  "NIFTY MEDIA": { symbol: "NIFTYMEDIA", category: "sectoral" },
  "NIFTY SERVICES SECTOR": { symbol: "NIFTYSERVICES", category: "sectoral" },
};

// BSE indices fetched via Yahoo Finance's public chart API (no package needed)
const BSE_YAHOO_CONFIG = [
  { yahooSymbol: "%5EBSESN", symbol: "SENSEX", name: "SENSEX", category: "broad" as const },
];

// NSE indices fetched via Yahoo Finance as fallback when NSE API is blocked
const NSE_YAHOO_FALLBACK = [
  { yahooSymbol: "%5ENSEI", symbol: "NIFTY50", name: "NIFTY 50", category: "broad" as const, exchange: "NSE" },
  { yahooSymbol: "%5ENSEBANK", symbol: "NIFTYBANK", name: "NIFTY BANK", category: "sectoral" as const, exchange: "NSE" },
  { yahooSymbol: "%5ECNXIT", symbol: "NIFTYIT", name: "NIFTY IT", category: "sectoral" as const, exchange: "NSE" },
  { yahooSymbol: "%5ECNXPHARMA", symbol: "NIFTYPHARMA", name: "NIFTY PHARMA", category: "sectoral" as const, exchange: "NSE" },
  { yahooSymbol: "%5ECNXAUTO", symbol: "NIFTYAUTO", name: "NIFTY AUTO", category: "sectoral" as const, exchange: "NSE" },
  { yahooSymbol: "%5ECNXFMCG", symbol: "NIFTYFMCG", name: "NIFTY FMCG", category: "sectoral" as const, exchange: "NSE" },
  { yahooSymbol: "%5ECNXMETAL", symbol: "NIFTYMETAL", name: "NIFTY METAL", category: "sectoral" as const, exchange: "NSE" },
  { yahooSymbol: "%5ECNXREALTY", symbol: "NIFTYREALTY", name: "NIFTY REALTY", category: "sectoral" as const, exchange: "NSE" },
  { yahooSymbol: "%5ECNXENERGY", symbol: "NIFTYENERGY", name: "NIFTY ENERGY", category: "sectoral" as const, exchange: "NSE" },
  { yahooSymbol: "%5ECNXINFRA", symbol: "NIFTYINFRA", name: "NIFTY INFRA", category: "thematic" as const, exchange: "NSE" },
  { yahooSymbol: "%5ENSEMDCP50", symbol: "NIFTYMIDCAP50", name: "NIFTY MIDCAP 50", category: "broad" as const, exchange: "NSE" },
  { yahooSymbol: "%5EBSESN", symbol: "SENSEX", name: "SENSEX", category: "broad" as const, exchange: "BSE" },
];

// Generates a realistic intraday-style sparkline from real OHLC values.
// Starts at open, ends at last, stays within [low, high].
function generateSparkline(
  open: number,
  last: number,
  high: number,
  low: number,
  points = 30
): number[] {
  const spark: number[] = [];
  const range = Math.max(high - low, 1);
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const trend = open + (last - open) * t;
    const noise = (Math.random() - 0.5) * range * 0.35;
    spark.push(parseFloat(Math.max(low, Math.min(high, trend + noise)).toFixed(2)));
  }
  spark[0] = open;
  spark[points - 1] = last;
  return spark;
}

// Fetches a single index quote from Yahoo Finance's public chart API (no auth needed)
async function fetchYahooQuote(encodedSymbol: string): Promise<{
  last: number; open: number; high: number; low: number;
  change: number; changePct: number;
} | null> {
  try {
    const url = `${YF_QUOTE}/${encodedSymbol}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        ...BROWSER_HEADERS,
        Accept: "application/json",
        Referer: "https://finance.yahoo.com/",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;

    const last: number = meta.regularMarketPrice;
    const prev: number = meta.chartPreviousClose ?? meta.previousClose ?? last;
    return {
      last,
      open: meta.regularMarketOpen ?? prev,
      high: meta.regularMarketDayHigh ?? last,
      low: meta.regularMarketDayLow ?? last,
      change: parseFloat((last - prev).toFixed(2)),
      changePct: parseFloat((((last - prev) / prev) * 100).toFixed(2)),
    };
  } catch {
    return null;
  }
}

async function fetchNSEIndexes(): Promise<IndexData[]> {
  const cookies = await getSessionCookies();
  const res = await fetch(`${NSE_BASE}/api/allIndices`, {
    headers: {
      ...BROWSER_HEADERS,
      Accept: "application/json, text/plain, */*",
      Referer: `${NSE_BASE}/`,
      "X-Requested-With": "XMLHttpRequest",
      Cookie: cookies,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`NSE API returned HTTP ${res.status}`);

  const json = await res.json();
  const raw: NSERawIndex[] = json.data ?? [];

  const result: IndexData[] = [];
  for (const idx of raw) {
    const config = NSE_INDEX_MAP[idx.index];
    if (!config) continue;
    result.push({
      symbol: config.symbol,
      name: idx.index,
      exchange: "NSE",
      value: idx.last,
      change: parseFloat(idx.variation.toFixed(2)),
      changePct: parseFloat(idx.percentChange.toFixed(2)),
      high: idx.high,
      low: idx.low,
      open: idx.open,
      sparkline: generateSparkline(idx.open, idx.last, idx.high, idx.low),
      category: config.category,
    });
  }

  if (result.length === 0) throw new Error("NSE API returned no matching indices");
  return result;
}

async function fetchBSEIndexes(): Promise<IndexData[]> {
  const results: IndexData[] = [];
  for (const config of BSE_YAHOO_CONFIG) {
    const q = await fetchYahooQuote(config.yahooSymbol);
    if (!q) continue;
    results.push({
      symbol: config.symbol,
      name: config.name,
      exchange: "BSE",
      value: q.last,
      change: q.change,
      changePct: q.changePct,
      high: q.high,
      low: q.low,
      open: q.open,
      sparkline: generateSparkline(q.open, q.last, q.high, q.low),
      category: config.category,
    });
  }
  return results;
}

// Full Yahoo Finance fallback used when NSE API is blocked
async function fetchAllViaYahoo(): Promise<IndexData[]> {
  const results = await Promise.all(
    NSE_YAHOO_FALLBACK.map(async (config) => {
      const q = await fetchYahooQuote(config.yahooSymbol);
      if (!q) return null;
      return {
        symbol: config.symbol,
        name: config.name,
        exchange: config.exchange,
        value: q.last,
        change: q.change,
        changePct: q.changePct,
        high: q.high,
        low: q.low,
        open: q.open,
        sparkline: generateSparkline(q.open, q.last, q.high, q.low),
        category: config.category,
      } satisfies IndexData;
    })
  );
  return results.filter((r): r is IndexData => r !== null);
}

export async function fetchAllIndiaIndexes(): Promise<IndexData[]> {
  try {
    // Primary: NSE's official allIndices API (most complete for NSE)
    const [nseIndexes, bseIndexes] = await Promise.all([
      fetchNSEIndexes(),
      fetchBSEIndexes(),
    ]);
    return [...nseIndexes, ...bseIndexes];
  } catch (nseError) {
    console.warn("NSE API failed, falling back to Yahoo Finance:", nseError);
    const indexes = await fetchAllViaYahoo();
    if (indexes.length === 0) {
      throw new Error("Both NSE API and Yahoo Finance fallback failed");
    }
    return indexes;
  }
}
