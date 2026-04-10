"use client";
import { IndexData } from "@/types/stock";
import IndexCard from "./IndexCard";

interface IndiaIndexesTabProps {
  indexes: IndexData[];
  updatedAt: string;
}

export default function IndiaIndexesTab({ indexes, updatedAt }: IndiaIndexesTabProps) {
  const broad = indexes.filter((i) => i.category === "broad");
  const sectoral = indexes.filter((i) => i.category === "sectoral");
  const thematic = indexes.filter((i) => i.category === "thematic");

  const Section = ({ title, data, color }: { title: string; data: IndexData[]; color: string }) => (
    <section className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display font-semibold text-sm tracking-widest uppercase" style={{ color }}>{title}</h2>
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[10px] font-mono text-[var(--text-dim)]">{data.length} indices</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {data.map((idx) => (
          <IndexCard key={idx.symbol} index={idx} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-[var(--text-dim)]">
          Updated {new Date(updatedAt).toLocaleTimeString("en-IN")} IST
        </p>
        <div className="flex gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-gain">
            <span className="w-2 h-2 rounded-full bg-gain inline-block" /> Positive
          </span>
          <span className="flex items-center gap-1 text-loss">
            <span className="w-2 h-2 rounded-full bg-loss inline-block" /> Negative
          </span>
        </div>
      </div>

      <Section title="Broad Market" data={broad} color="#F59E0B" />
      <Section title="Sectoral Indices" data={sectoral} color="#60A5FA" />
      {thematic.length > 0 && <Section title="Thematic Indices" data={thematic} color="#A78BFA" />}
    </div>
  );
}
