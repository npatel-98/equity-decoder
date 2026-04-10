import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Equity Decoder — NSE & BSE Market Analyser",
  description: "Professional Indian stock market analyser with AI-powered screening, global indexes, and real-time market data.",
  keywords: "NSE, BSE, NIFTY, SENSEX, stock screener, equity analyser, Indian stock market",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="noise antialiased">{children}</body>
    </html>
  );
}
