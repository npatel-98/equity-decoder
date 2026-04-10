"use client";
import { TabId } from "@/types/stock";

const TABS: { id: TabId; label: string; icon: string; shortLabel: string }[] = [
  { id: "overview", label: "Market Pulse", icon: "📊", shortLabel: "Pulse" },
  { id: "rising-1m", label: "Rising 1M", icon: "📈", shortLabel: "↑ 1M" },
  { id: "rising-2m", label: "Rising 2M", icon: "📈", shortLabel: "↑ 2M" },
  { id: "falling-1m", label: "Falling 1M", icon: "📉", shortLabel: "↓ 1M" },
  { id: "falling-2m", label: "Falling 2M", icon: "📉", shortLabel: "↓ 2M" },
  { id: "india-indexes", label: "India Indexes", icon: "🇮🇳", shortLabel: "India" },
  { id: "global-indexes", label: "Global Markets", icon: "🌍", shortLabel: "Global" },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex overflow-x-auto gap-0 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isRising = tab.id.startsWith("rising");
            const isFalling = tab.id.startsWith("falling");
            const accentColor = isRising ? "#22C55E" : isFalling ? "#EF4444" : "#F59E0B";

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex items-center gap-1.5 px-4 py-3.5 text-xs font-display font-medium whitespace-nowrap transition-all duration-200 group"
                style={{ color: isActive ? accentColor : "var(--text-dim)" }}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>

                {/* Active indicator */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                    style={{ background: accentColor }}
                  />
                )}

                {/* Hover effect */}
                {!isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t opacity-0 group-hover:opacity-30 transition-opacity" style={{ background: accentColor }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
