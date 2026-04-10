"use client";
import { useState, useEffect, useCallback } from "react";
import { TabId, ScreenedStock, IndexData, GlobalIndex } from "@/types/stock";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import TickerBanner from "@/components/TickerBanner";
import OverviewTab from "@/components/OverviewTab";
import RisingStockTable from "@/components/RisingStockTable";
import FallingStockTable from "@/components/FallingStockTable";
import IndiaIndexesTab from "@/components/IndiaIndexesTab";
import GlobalIndexesTab from "@/components/GlobalIndexesTab";
import { SkeletonTable, SkeletonCard } from "@/components/Skeleton";

interface TabState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  updatedAt: string;
}

function createInitialState<T>(): TabState<T> {
  return { data: null, loading: false, error: null, updatedAt: "" };
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const [indiaIndexes, setIndiaIndexes] =
    useState<TabState<IndexData[]>>(createInitialState());
  const [globalIndexes, setGlobalIndexes] =
    useState<TabState<GlobalIndex[]>>(createInitialState());
  const [rising1m, setRising1m] =
    useState<TabState<ScreenedStock[]>>(createInitialState());
  const [rising2m, setRising2m] =
    useState<TabState<ScreenedStock[]>>(createInitialState());
  const [falling1m, setFalling1m] =
    useState<TabState<ScreenedStock[]>>(createInitialState());
  const [falling2m, setFalling2m] =
    useState<TabState<ScreenedStock[]>>(createInitialState());

  const fetchData = useCallback(
    async <T,>(
      url: string,
      setter: React.Dispatch<React.SetStateAction<TabState<T>>>,
    ) => {
      setter((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setter({
          data: json.data,
          loading: false,
          error: null,
          updatedAt: json.updatedAt,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setter((s) => ({ ...s, loading: false, error: msg }));
      }
    },
    [],
  );

  // Load india indexes on mount (used by overview too)
  useEffect(() => {
    fetchData<IndexData[]>("/api/indexes/india", setIndiaIndexes);
  }, [fetchData]);

  // Load data for each tab when visited
  useEffect(() => {
    if (activeTab === "rising-1m" && !rising1m.data && !rising1m.loading) {
      fetchData<ScreenedStock[]>("/api/screener/rising-1m", setRising1m);
    }
    if (activeTab === "rising-2m" && !rising2m.data && !rising2m.loading) {
      fetchData<ScreenedStock[]>("/api/screener/rising-2m", setRising2m);
    }
    if (activeTab === "falling-1m" && !falling1m.data && !falling1m.loading) {
      fetchData<ScreenedStock[]>("/api/screener/falling-1m", setFalling1m);
    }
    if (activeTab === "falling-2m" && !falling2m.data && !falling2m.loading) {
      fetchData<ScreenedStock[]>("/api/screener/falling-2m", setFalling2m);
    }
    if (
      activeTab === "global-indexes" &&
      !globalIndexes.data &&
      !globalIndexes.loading
    ) {
      fetchData<GlobalIndex[]>("/api/indexes/global", setGlobalIndexes);
    }
  }, [
    activeTab,
    fetchData,
    rising1m,
    rising2m,
    falling1m,
    falling2m,
    globalIndexes,
  ]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const id = setInterval(
      () => {
        fetchData<IndexData[]>("/api/indexes/india", setIndiaIndexes);
        if (globalIndexes.data)
          fetchData<GlobalIndex[]>("/api/indexes/global", setGlobalIndexes);
      },
      0.25 * 60 * 1000,
    );
    return () => clearInterval(id);
  }, [fetchData, globalIndexes.data]);

  const ErrorBanner = ({
    msg,
    onRetry,
  }: {
    msg: string;
    onRetry: () => void;
  }) => (
    <div className="glass rounded-xl p-8 text-center">
      <p className="text-loss font-mono text-sm mb-4">
        ⚠ Failed to load: {msg}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-[var(--surface-2)] text-[var(--text)] text-sm font-display hover:bg-[var(--border)] transition-colors"
      >
        Retry
      </button>
    </div>
  );

  const SectionHeader = ({
    title,
    subtitle,
    color = "#F59E0B",
  }: {
    title: string;
    subtitle: string;
    color?: string;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-3 mb-4">
      <h2 className="font-display font-bold text-lg" style={{ color }}>
        {title}
      </h2>
      <p className="text-xs font-mono text-[var(--text-dim)]">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Ticker banner */}
      {indiaIndexes.data && <TickerBanner indexes={indiaIndexes.data} />}

      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* TAB: Overview */}
        {activeTab === "overview" && (
          <div>
            {indiaIndexes.loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}
            {indiaIndexes.error && (
              <ErrorBanner
                msg={indiaIndexes.error}
                onRetry={() =>
                  fetchData<IndexData[]>("/api/indexes/india", setIndiaIndexes)
                }
              />
            )}
            {indiaIndexes.data && (
              <OverviewTab
                indexes={indiaIndexes.data}
                updatedAt={indiaIndexes.updatedAt}
              />
            )}
          </div>
        )}

        {/* TAB: Rising 1M */}
        {activeTab === "rising-1m" && (
          <div>
            <SectionHeader
              title="📈 Stocks Likely to Rise 10–20% in 1 Month"
              subtitle="Screened using RSI, MACD, volume surge & 52W proximity signals"
              color="#22C55E"
            />
            {rising1m.loading && <SkeletonTable rows={10} cols={12} />}
            {rising1m.error && (
              <ErrorBanner
                msg={rising1m.error}
                onRetry={() =>
                  fetchData<ScreenedStock[]>(
                    "/api/screener/rising-1m",
                    setRising1m,
                  )
                }
              />
            )}
            {rising1m.data && (
              <RisingStockTable stocks={rising1m.data} timeframe="1m" />
            )}
          </div>
        )}

        {/* TAB: Rising 2M */}
        {activeTab === "rising-2m" && (
          <div>
            <SectionHeader
              title="📈 Stocks Likely to Rise 10–20% in 2 Months"
              subtitle="Screened using accumulation phase, delivery %, earnings catalysts & value metrics"
              color="#22C55E"
            />
            {rising2m.loading && <SkeletonTable rows={10} cols={13} />}
            {rising2m.error && (
              <ErrorBanner
                msg={rising2m.error}
                onRetry={() =>
                  fetchData<ScreenedStock[]>(
                    "/api/screener/rising-2m",
                    setRising2m,
                  )
                }
              />
            )}
            {rising2m.data && (
              <RisingStockTable stocks={rising2m.data} timeframe="2m" />
            )}
          </div>
        )}

        {/* TAB: Falling 1M */}
        {activeTab === "falling-1m" && (
          <div>
            <SectionHeader
              title="📉 Stocks Likely to Fall 10–20% in 1 Month"
              subtitle="Screened using overbought RSI, MACD divergence, high pledge & distribution signals"
              color="#EF4444"
            />
            {falling1m.loading && <SkeletonTable rows={10} cols={13} />}
            {falling1m.error && (
              <ErrorBanner
                msg={falling1m.error}
                onRetry={() =>
                  fetchData<ScreenedStock[]>(
                    "/api/screener/falling-1m",
                    setFalling1m,
                  )
                }
              />
            )}
            {falling1m.data && <FallingStockTable stocks={falling1m.data} />}
          </div>
        )}

        {/* TAB: Falling 2M */}
        {activeTab === "falling-2m" && (
          <div>
            <SectionHeader
              title="📉 Stocks Likely to Fall 10–20% in 2 Months"
              subtitle="Screened using fundamental deterioration, high D/E ratio, insider selling & sector weakness"
              color="#EF4444"
            />
            {falling2m.loading && <SkeletonTable rows={10} cols={13} />}
            {falling2m.error && (
              <ErrorBanner
                msg={falling2m.error}
                onRetry={() =>
                  fetchData<ScreenedStock[]>(
                    "/api/screener/falling-2m",
                    setFalling2m,
                  )
                }
              />
            )}
            {falling2m.data && <FallingStockTable stocks={falling2m.data} />}
          </div>
        )}

        {/* TAB: India Indexes */}
        {activeTab === "india-indexes" && (
          <div>
            <SectionHeader
              title="🇮🇳 Indian Market Indexes"
              subtitle="NSE & BSE broad, sectoral and thematic indices"
              color="#F59E0B"
            />
            {indiaIndexes.loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: 20 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}
            {indiaIndexes.error && (
              <ErrorBanner
                msg={indiaIndexes.error}
                onRetry={() =>
                  fetchData<IndexData[]>("/api/indexes/india", setIndiaIndexes)
                }
              />
            )}
            {indiaIndexes.data && (
              <IndiaIndexesTab
                indexes={indiaIndexes.data}
                updatedAt={indiaIndexes.updatedAt}
              />
            )}
          </div>
        )}

        {/* TAB: Global Indexes */}
        {activeTab === "global-indexes" && (
          <div>
            <SectionHeader
              title="🌍 Global Market Indexes"
              subtitle="Americas · Europe · Middle East · Asia Pacific · Oceania"
              color="#60A5FA"
            />
            {globalIndexes.loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: 18 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}
            {globalIndexes.error && (
              <ErrorBanner
                msg={globalIndexes.error}
                onRetry={() =>
                  fetchData<GlobalIndex[]>(
                    "/api/indexes/global",
                    setGlobalIndexes,
                  )
                }
              />
            )}
            {globalIndexes.data && (
              <GlobalIndexesTab
                indexes={globalIndexes.data}
                updatedAt={globalIndexes.updatedAt}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer disclaimer */}
      <footer className="border-t border-[var(--border)] py-4 px-6 mt-8">
        <p className="text-center text-[10px] font-mono text-[var(--text-dim)] max-w-3xl mx-auto">
          ⚠ Equity Decoder is for <strong>informational purposes only</strong>.
          Stock screener signals are based on technical indicators and are{" "}
          <strong>not SEBI-registered investment advice</strong>. Always consult
          a qualified financial advisor before making investment decisions. Past
          performance does not guarantee future results.
        </p>
      </footer>
    </div>
  );
}
