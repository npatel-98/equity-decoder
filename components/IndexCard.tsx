"use client";
import { IndexData } from "@/types/stock";
import { getChangeBg, getChangeColor } from "@/lib/utils";
import Sparkline from "./Sparkline";

interface IndexCardProps {
  index: IndexData;
}

export default function IndexCard({ index }: IndexCardProps) {
  const isPositive = index.changePct >= 0;

  return (
    <div className={`glass rounded-xl p-4 hover:scale-[1.02] transition-transform duration-200 ${isPositive ? "hover:gain-glow" : "hover:loss-glow"}`}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[10px] font-display tracking-widest uppercase text-[var(--text-dim)]">{index.exchange}</p>
          <h3 className="font-display font-semibold text-sm text-[var(--text)] leading-tight mt-0.5">{index.name}</h3>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${getChangeBg(index.changePct)}`}>
          {index.exchange}
        </span>
      </div>

      <div className="mt-2">
        <p className="font-mono font-medium text-xl text-[var(--text)]">
          {index.value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
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

      <div className="mt-2 flex justify-between text-[10px] font-mono text-[var(--text-dim)]">
        <span>H: {index.high.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
        <span>L: {index.low.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}
