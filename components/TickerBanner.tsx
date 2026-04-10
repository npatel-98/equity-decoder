"use client";
import { useEffect, useState } from "react";
import { IndexData } from "@/types/stock";
import { getChangeColor } from "@/lib/utils";

interface TickerBannerProps {
  indexes: IndexData[];
}

export default function TickerBanner({ indexes }: TickerBannerProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const items = [...indexes, ...indexes]; // duplicate for seamless loop

  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex items-center">
        {/* IST Clock badge */}
        <div className="flex-shrink-0 px-4 py-2 border-r border-[var(--border)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gain animate-pulse-soft" />
          <span className="font-mono text-xs text-[var(--text-dim)]">IST {time}</span>
        </div>

        {/* Scrolling ticker */}
        <div className="ticker-wrap flex-1">
          <div className="ticker-content animate-ticker py-2">
            {items.map((idx, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-xs">
                <span className="font-display font-semibold tracking-wide text-[var(--text)]">
                  {idx.name}
                </span>
                <span className="font-mono font-medium">
                  {idx.value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
                <span className={`font-mono ${getChangeColor(idx.changePct)}`}>
                  {idx.changePct >= 0 ? "▲" : "▼"} {Math.abs(idx.changePct).toFixed(2)}%
                </span>
                <span className="text-[var(--border)] mx-1">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
