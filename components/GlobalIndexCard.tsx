"use client";
import { GlobalIndex } from "@/types/stock";
import { getChangeBg, getChangeColor } from "@/lib/utils";
import Sparkline from "./Sparkline";

interface GlobalIndexCardProps {
  index: GlobalIndex;
}

export default function GlobalIndexCard({ index }: GlobalIndexCardProps) {
  const isPositive = index.changePct >= 0;

  return (
    <div className={`glass rounded-xl p-4 hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{index.flag}</span>
          <div>
            <p className="font-display font-semibold text-sm text-[var(--text)] leading-tight">{index.name}</p>
            <p className="text-[10px] text-[var(--text-dim)] font-mono mt-0.5">{index.country}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${index.isOpen ? "bg-gain/15 text-gain" : "bg-gray-500/15 text-gray-400"}`}>
            {index.isOpen ? "● LIVE" : "○ CLOSED"}
          </span>
          <span className="text-[9px] font-mono text-[var(--text-dim)]">{index.localTime}</span>
        </div>
      </div>

      <div className="mt-3">
        <p className="font-mono font-medium text-lg text-[var(--text)]">
          {index.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`font-mono text-xs ${getChangeColor(index.changePct)}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(index.change).toFixed(2)}
          </span>
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${getChangeBg(index.changePct)}`}>
            {isPositive ? "+" : ""}{index.changePct.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="mt-3 h-10">
        <Sparkline data={index.sparkline} height={40} />
      </div>

      <div className="mt-1 text-[10px] font-mono text-[var(--text-dim)] text-right">
        {index.currency}
      </div>
    </div>
  );
}
