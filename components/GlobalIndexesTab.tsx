"use client";
import { GlobalIndex } from "@/types/stock";
import GlobalIndexCard from "./GlobalIndexCard";

interface GlobalIndexesTabProps {
  indexes: GlobalIndex[];
  updatedAt: string;
}

export default function GlobalIndexesTab({ indexes, updatedAt }: GlobalIndexesTabProps) {
  const regions = [...new Set(indexes.map((i) => i.region))];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-[var(--text-dim)]">
          Auto-refreshes every 5 min · Last updated {new Date(updatedAt).toLocaleTimeString("en-IN")} IST
        </p>
        <div className="flex gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-gain">
            <span className="w-2 h-2 rounded-full bg-gain animate-pulse inline-block" /> Live
          </span>
          <span className="flex items-center gap-1 text-[var(--text-dim)]">
            <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" /> Closed
          </span>
        </div>
      </div>

      {regions.map((region) => {
        const regionIndexes = indexes.filter((i) => i.region === region);
        return (
          <section key={region}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display font-semibold text-sm tracking-widest uppercase text-[var(--text-dim)]">{region}</h2>
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[10px] font-mono text-[var(--text-dim)]">{regionIndexes.length} markets</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {regionIndexes.map((idx) => (
                <GlobalIndexCard key={idx.symbol} index={idx} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
