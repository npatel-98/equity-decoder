"use client";
import { IndexData } from "@/types/stock";
import { getChangeBg, getChangeColor } from "@/lib/utils";
import Sparkline from "./Sparkline";

interface OverviewTabProps {
  indexes: IndexData[];
  updatedAt: string;
}

const KEY_INDEXES = [
  "NIFTY50",
  "SENSEX",
  "NIFTYBANK",
  "NIFTYIT",
  "NIFTYMIDCAP50",
  "NIFTYSMALLCAP100",
];

export default function OverviewTab({ indexes, updatedAt }: OverviewTabProps) {
  const keyIdxs = indexes.filter((idx) => KEY_INDEXES.includes(idx.symbol));
  const topGainers = [...indexes]
    .sort((a, b) => b.changePct - a.changePct)
    .slice(0, 5);
  const topLosers = [...indexes]
    .sort((a, b) => a.changePct - b.changePct)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Indexes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-sm tracking-wide text-[var(--text-dim)] uppercase">
            Key Indices
          </h2>
          <span className="text-[10px] font-mono text-[var(--text-dim)]">
            Updated {new Date(updatedAt).toLocaleTimeString("en-IN")}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {keyIdxs.map((idx) => (
            <div
              key={idx.symbol}
              className="glass rounded-xl p-4 hover:scale-[1.02] transition-transform"
            >
              <p className="text-[10px] font-display tracking-widest uppercase text-[var(--text-dim)]">
                {idx.symbol}
              </p>
              <p className="font-mono font-semibold text-base text-[var(--text)] mt-1">
                {idx.value.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded mt-1 inline-block ${getChangeBg(idx.changePct)}`}
              >
                {idx.changePct >= 0 ? "+" : ""}
                {idx.changePct.toFixed(2)}%
              </span>
              <div className="mt-2 h-8">
                <Sparkline data={idx.sparkline} height={32} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gainers / Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <section>
          <h2 className="font-display font-semibold text-sm tracking-wide text-gain uppercase mb-3">
            ▲ Top Gainers
          </h2>
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left">Index</th>
                  <th className="text-right">Value</th>
                  <th className="text-right">Change %</th>
                </tr>
              </thead>
              <tbody>
                {topGainers.map((idx, i) => (
                  <tr
                    key={idx.symbol}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <td>
                      <span className="font-display font-medium text-[var(--text)] text-xs">
                        {idx.name}
                      </span>
                    </td>
                    <td className="text-right font-mono text-xs">
                      {idx.value.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-right">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded ${getChangeBg(idx.changePct)}`}
                      >
                        +{idx.changePct.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Losers */}
        <section>
          <h2 className="font-display font-semibold text-sm tracking-wide text-loss uppercase mb-3">
            ▼ Top Losers
          </h2>
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left">Index</th>
                  <th className="text-right">Value</th>
                  <th className="text-right">Change %</th>
                </tr>
              </thead>
              <tbody>
                {topLosers.map((idx, i) => (
                  <tr
                    key={idx.symbol}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <td>
                      <span className="font-display font-medium text-[var(--text)] text-xs">
                        {idx.name}
                      </span>
                    </td>
                    <td className="text-right font-mono text-xs">
                      {idx.value.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-right">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded ${getChangeBg(idx.changePct)}`}
                      >
                        {idx.changePct.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Breadth indicator */}
      <section>
        <h2 className="font-display font-semibold text-sm tracking-wide text-[var(--text-dim)] uppercase mb-3">
          Market Breadth
        </h2>
        <div className="glass rounded-xl p-4">
          {(() => {
            const advancing = indexes.filter((i) => i.changePct > 0).length;
            const declining = indexes.filter((i) => i.changePct < 0).length;
            const total = indexes.length;
            const advPct = (advancing / total) * 100;
            return (
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-gain">▲ {advancing} Advancing</span>
                  <span className="text-[var(--text-dim)]">
                    {total} Indices
                  </span>
                  <span className="text-loss">▼ {declining} Declining</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex bg-loss/30">
                  <div
                    className="h-full bg-gain rounded-l-full transition-all duration-1000"
                    style={{ width: `${advPct}%` }}
                  />
                </div>
                <p className="text-center text-xs font-mono text-[var(--text-dim)]">
                  {advPct > 60
                    ? "🟢 Broadly Positive"
                    : advPct < 40
                      ? "🔴 Broadly Negative"
                      : "🟡 Mixed Sentiment"}
                </p>
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
