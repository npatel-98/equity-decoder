"use client";
import { useState, useEffect } from "react";
import { isMarketOpen } from "@/lib/utils";

export default function Header() {
  const [marketOpen, setMarketOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setMarketOpen(isMarketOpen());
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12 L5 8 L8 10 L11 5 L14 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="14" cy="3" r="1.5" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-base text-[var(--text)] leading-none">
              Equity Decoder
            </h1>
            <p className="text-[10px] text-[var(--text-dim)] font-mono mt-0.5">NSE · BSE · Global Markets</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Market status */}
          <div className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full ${marketOpen ? "bg-gain/10 text-gain border border-gain/20" : "bg-gray-500/10 text-gray-400 border border-gray-500/20"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? "bg-gain animate-pulse" : "bg-gray-500"}`} />
            <span>NSE/BSE {marketOpen ? "Open" : "Closed"}</span>
            <span className="text-[var(--text-dim)]">· {time} IST</span>
          </div>

          {/* Disclaimer badge */}
          <div className="hidden md:flex items-center gap-1 text-[10px] text-[var(--text-dim)] font-mono">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
              <path d="M6 5v3M6 4v.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            Not SEBI registered
          </div>
        </div>
      </div>
    </header>
  );
}
