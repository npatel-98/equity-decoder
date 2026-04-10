import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 2): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)}L`;
  return value.toFixed(decimals);
}

export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export function formatCurrency(value: number, currency = "INR"): string {
  const symbols: Record<string, string> = {
    INR: "₹", USD: "$", GBP: "£", EUR: "€",
    JPY: "¥", HKD: "HK$", SGD: "S$", AED: "د.إ",
    SAR: "﷼", AUD: "A$", MYR: "RM", CNY: "¥",
  };
  const symbol = symbols[currency] || currency;
  if (value >= 1000) {
    return `${symbol}${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  }
  return `${symbol}${value.toFixed(2)}`;
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-gain";
  if (value < 0) return "text-loss";
  return "text-gray-400";
}

export function getChangeBg(value: number): string {
  if (value > 0) return "bg-gain/10 text-gain";
  if (value < 0) return "bg-loss/10 text-loss";
  return "bg-gray-500/10 text-gray-400";
}

export function isMarketOpen(): boolean {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = ist.getDay();
  const hour = ist.getHours();
  const min = ist.getMinutes();
  const timeInMin = hour * 60 + min;
  if (day === 0 || day === 6) return false;
  return timeInMin >= 555 && timeInMin <= 930; // 9:15 AM to 3:30 PM
}

export function getISTTime(): string {
  return new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
