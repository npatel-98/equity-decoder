import { NextResponse } from "next/server";
import { GlobalIndex } from "@/types/stock";
import { getMockGlobalIndexes } from "@/lib/mockData";

export const dynamic = "force-dynamic";

const YF_QUOTE = "https://query1.finance.yahoo.com/v8/finance/chart";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "application/json",
  Referer: "https://finance.yahoo.com/",
};

const GLOBAL_INDEX_CONFIG: Array<{
  yahooSymbol: string;
  symbol: string;
  name: string;
  region: string;
  country: string;
  flag: string;
  currency: string;
  tz: string;
}> = [
  { yahooSymbol: "%5EGSPC", symbol: "^GSPC", name: "S&P 500", region: "Americas", country: "USA", flag: "🇺🇸", currency: "USD", tz: "America/New_York" },
  { yahooSymbol: "%5EDJI", symbol: "^DJI", name: "Dow Jones", region: "Americas", country: "USA", flag: "🇺🇸", currency: "USD", tz: "America/New_York" },
  { yahooSymbol: "%5EIXIC", symbol: "^IXIC", name: "NASDAQ", region: "Americas", country: "USA", flag: "🇺🇸", currency: "USD", tz: "America/New_York" },
  { yahooSymbol: "%5ERUT", symbol: "^RUT", name: "Russell 2000", region: "Americas", country: "USA", flag: "🇺🇸", currency: "USD", tz: "America/New_York" },
  { yahooSymbol: "%5EFTSE", symbol: "^FTSE", name: "FTSE 100", region: "Europe", country: "UK", flag: "🇬🇧", currency: "GBP", tz: "Europe/London" },
  { yahooSymbol: "%5EGDAXI", symbol: "^GDAXI", name: "DAX", region: "Europe", country: "Germany", flag: "🇩🇪", currency: "EUR", tz: "Europe/Berlin" },
  { yahooSymbol: "%5EFCHI", symbol: "^FCHI", name: "CAC 40", region: "Europe", country: "France", flag: "🇫🇷", currency: "EUR", tz: "Europe/Paris" },
  { yahooSymbol: "%5ETASI.SR", symbol: "^TASI.SR", name: "Tadawul (Saudi)", region: "Middle East", country: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", tz: "Asia/Riyadh" },
  { yahooSymbol: "%5EDFMGI", symbol: "^DFMGI", name: "Dubai DFM", region: "Middle East", country: "UAE", flag: "🇦🇪", currency: "AED", tz: "Asia/Dubai" },
  { yahooSymbol: "%5EN225", symbol: "^N225", name: "Nikkei 225", region: "Japan", country: "Japan", flag: "🇯🇵", currency: "JPY", tz: "Asia/Tokyo" },
  { yahooSymbol: "%5EHSI", symbol: "^HSI", name: "Hang Seng", region: "SE Asia", country: "Hong Kong", flag: "🇭🇰", currency: "HKD", tz: "Asia/Hong_Kong" },
  { yahooSymbol: "%5ESTI", symbol: "^STI", name: "STI Singapore", region: "SE Asia", country: "Singapore", flag: "🇸🇬", currency: "SGD", tz: "Asia/Singapore" },
  { yahooSymbol: "%5EKLSE", symbol: "^KLSE", name: "KLCI Malaysia", region: "SE Asia", country: "Malaysia", flag: "🇲🇾", currency: "MYR", tz: "Asia/Kuala_Lumpur" },
  { yahooSymbol: "000001.SS", symbol: "000001.SS", name: "Shanghai Composite", region: "China", country: "China", flag: "🇨🇳", currency: "CNY", tz: "Asia/Shanghai" },
  { yahooSymbol: "000300.SS", symbol: "000300.SS", name: "CSI 300", region: "China", country: "China", flag: "🇨🇳", currency: "CNY", tz: "Asia/Shanghai" },
  { yahooSymbol: "%5EAXJO", symbol: "^AXJO", name: "ASX 200", region: "Oceania", country: "Australia", flag: "🇦🇺", currency: "AUD", tz: "Australia/Sydney" },
];

function generateSparkline(open: number, last: number, high: number, low: number, points = 30): number[] {
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

function getLocalTime(tz: string): string {
  try {
    return new Date().toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "";
  }
}

async function fetchGlobalIndexes(): Promise<GlobalIndex[]> {
  const results = await Promise.all(
    GLOBAL_INDEX_CONFIG.map(async (config) => {
      try {
        const url = `${YF_QUOTE}/${config.yahooSymbol}?interval=1d&range=1d`;
        const res = await fetch(url, { headers: BROWSER_HEADERS, cache: "no-store" });
        if (!res.ok) return null;

        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (!meta?.regularMarketPrice) return null;

        const last: number = meta.regularMarketPrice;
        const prev: number = meta.chartPreviousClose ?? meta.previousClose ?? last;
        const open: number = meta.regularMarketOpen ?? prev;
        const high: number = meta.regularMarketDayHigh ?? last;
        const low: number = meta.regularMarketDayLow ?? last;
        const change = parseFloat((last - prev).toFixed(2));
        const changePct = parseFloat((((last - prev) / prev) * 100).toFixed(4));
        const isOpen: boolean = meta.marketState === "REGULAR";

        return {
          symbol: config.symbol,
          name: config.name,
          region: config.region,
          country: config.country,
          flag: config.flag,
          currency: config.currency,
          value: last,
          change,
          changePct,
          localTime: getLocalTime(config.tz),
          isOpen,
          sparkline: generateSparkline(open, last, high, low),
        } satisfies GlobalIndex;
      } catch {
        return null;
      }
    })
  );

  const valid = results.filter((r): r is GlobalIndex => r !== null);
  if (valid.length === 0) throw new Error("No global index data returned");

  const regionOrder = ["Americas", "Europe", "Middle East", "Japan", "SE Asia", "China", "Oceania"];
  valid.sort((a, b) => regionOrder.indexOf(a.region) - regionOrder.indexOf(b.region));
  return valid;
}

export async function GET() {
  try {
    const indexes = await fetchGlobalIndexes();
    return NextResponse.json({ success: true, data: indexes, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Failed to fetch global indexes, using mock:", error);
    return NextResponse.json({
      success: true,
      data: getMockGlobalIndexes(),
      updatedAt: new Date().toISOString(),
      source: "mock",
    });
  }
}
