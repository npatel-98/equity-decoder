export interface Stock {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  cmp: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  volume: number;
  avgVolume: number;
  rsi: number;
  macd: number;
  sma20: number;
  sma50: number;
  sma200: number;
  week52High: number;
  week52Low: number;
  sector: string;
  pe: number;
  debtToEquity: number;
  promoterPledge: number;
  deliveryPct: number;
  marketCap: number;
  sparkline: number[];
}

export interface ScreenedStock extends Stock {
  targetLow: number;
  targetHigh: number;
  upsidePct: number;
  downsidePct: number;
  confidenceScore: number;
  riskScore: number;
  signals: string[];
  catalystDate?: string;
}

export interface IndexData {
  symbol: string;
  name: string;
  exchange: string;
  value: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  open: number;
  sparkline: number[];
  category: "broad" | "sectoral" | "thematic";
}

export interface GlobalIndex {
  symbol: string;
  name: string;
  region: string;
  country: string;
  flag: string;
  value: number;
  change: number;
  changePct: number;
  localTime: string;
  isOpen: boolean;
  currency: string;
  sparkline: number[];
}

export type TabId =
  | "overview"
  | "rising-1m"
  | "rising-2m"
  | "falling-1m"
  | "falling-2m"
  | "india-indexes"
  | "global-indexes";
