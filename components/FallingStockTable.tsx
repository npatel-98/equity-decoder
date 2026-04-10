"use client";
import { ScreenedStock } from "@/types/stock";
import { getChangeBg } from "@/lib/utils";
import Sparkline from "./Sparkline";

interface FallingStockTableProps {
  stocks: ScreenedStock[];
}

export default function FallingStockTable({ stocks }: FallingStockTableProps) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th className="text-left">#</th>
              <th className="text-left">Stock</th>
              <th className="text-right">CMP</th>
              <th className="text-right">Change</th>
              <th className="text-right">Target</th>
              <th className="text-right">Downside</th>
              <th className="text-right">RSI</th>
              <th className="text-right">Pledge %</th>
              <th className="text-right">D/E</th>
              <th className="text-left">Sector</th>
              <th className="text-right">Risk Score</th>
              <th className="text-left">Warning Signals</th>
              <th className="text-right w-24">30D Chart</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, i) => {
              const isHighRisk = stock.riskScore >= 70;
              return (
                <tr key={stock.symbol} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="text-[var(--text-dim)] font-mono">{String(i + 1).padStart(2, "0")}</td>
                  <td>
                    <div className="flex items-start gap-2">
                      {isHighRisk && (
                        <span className="text-loss text-base leading-tight mt-0.5" title="High Risk">🔴</span>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-[var(--text)]">{stock.symbol}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${stock.exchange === "NSE" ? "bg-blue-500/15 text-blue-400" : "bg-purple-500/15 text-purple-400"}`}>
                            {stock.exchange}
                          </span>
                        </div>
                        <div className="text-[10px] text-[var(--text-dim)] font-body mt-0.5 max-w-[140px] truncate">{stock.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-mono text-[var(--text)]">
                    ₹{stock.cmp.toFixed(2)}
                  </td>
                  <td className="text-right">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded ${getChangeBg(stock.changePct)}`}>
                      {stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="text-right font-mono text-xs text-[var(--text-dim)]">
                    ₹{stock.targetLow.toFixed(0)}–{stock.targetHigh.toFixed(0)}
                  </td>
                  <td className="text-right">
                    <span className="font-mono text-loss font-medium">-{stock.downsidePct.toFixed(1)}%</span>
                  </td>
                  <td className="text-right">
                    <span className={`font-mono text-xs ${stock.rsi > 70 ? "text-loss font-semibold" : stock.rsi > 60 ? "text-accent" : "text-[var(--text-dim)]"}`}>
                      {stock.rsi.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`font-mono text-xs ${stock.promoterPledge > 30 ? "text-loss" : "text-[var(--text-dim)]"}`}>
                      {stock.promoterPledge.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`font-mono text-xs ${stock.debtToEquity > 2 ? "text-loss" : "text-[var(--text-dim)]"}`}>
                      {stock.debtToEquity.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-dim)] font-body">
                      {stock.sector}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-xs font-medium text-loss">
                        {stock.riskScore}/100
                      </span>
                      <div className="score-bar w-16">
                        <div className="score-fill bg-loss" style={{ width: `${stock.riskScore}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {stock.signals.slice(0, 2).map((s, si) => (
                        <span key={si} className="text-[9px] px-1.5 py-0.5 rounded bg-loss/10 text-loss font-body">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="w-24 h-8">
                      <Sparkline data={stock.sparkline} height={32} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
