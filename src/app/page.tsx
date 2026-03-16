"use client";

import { useState, useCallback, useEffect } from "react";
import type { ScoredGrant, SearchResponse } from "@/lib/types";
import { SearchForm } from "@/components/search-form";
import { GrantList } from "@/components/grant-list";

export default function Home() {
  const [grants, setGrants] = useState<ScoredGrant[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    strongPlus: 0,
    upcomingDeadlines: 0,
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    async (params: {
      keyword: string;
      minScore: number;
      deadlineDays: number | null;
    }) => {
      setLoading(true);
      setHasSearched(true);
      try {
        const res = await fetch("/api/grants/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyword: params.keyword || undefined,
            minScore: params.minScore,
            deadlineDays: params.deadlineDays ?? undefined,
          }),
        });
        const data: SearchResponse = await res.json();
        setGrants(data.grants);
        setStats(data.stats);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load known grants on mount
  useEffect(() => {
    async function loadKnown() {
      try {
        const res = await fetch("/api/known");
        const data = await res.json();
        setGrants(data.grants);
        setStats({
          total: data.grants.length,
          strongPlus: data.grants.filter(
            (g: ScoredGrant) => g.totalScore >= 65
          ).length,
          upcomingDeadlines: 0,
        });
      } catch (err) {
        console.error("Failed to load known grants:", err);
      }
    }
    loadKnown();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold">Grant Seeker</h1>
            <p className="text-[12px] text-muted-foreground">
              Wilderness Trail Maintenance Grants
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Utah Focus</p>
            <p className="text-[11px] text-muted-foreground">
              USFS / BLM / NPS
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Stats */}
        <div className="flex gap-4">
          <div className="rounded-xl border bg-card shadow-sm shadow-black/[0.04] px-4 py-2.5 flex-1">
            <p className="text-[11px] text-muted-foreground">Total Found</p>
            <p className="text-[20px] font-bold tabular-nums">
              {stats.total}
            </p>
          </div>
          <div className="rounded-xl border bg-card shadow-sm shadow-black/[0.04] px-4 py-2.5 flex-1">
            <p className="text-[11px] text-muted-foreground">Strong+ Matches</p>
            <p className="text-[20px] font-bold tabular-nums text-emerald-600">
              {stats.strongPlus}
            </p>
          </div>
          <div className="rounded-xl border bg-card shadow-sm shadow-black/[0.04] px-4 py-2.5 flex-1">
            <p className="text-[11px] text-muted-foreground">
              Due in 30 Days
            </p>
            <p className="text-[20px] font-bold tabular-nums text-amber-600">
              {stats.upcomingDeadlines}
            </p>
          </div>
        </div>

        {/* Results */}
        {!hasSearched && grants.length > 0 && (
          <div>
            <h2 className="text-[15px] font-semibold mb-3">
              Curated Grants for Your Mission
            </h2>
            <p className="text-[12px] text-muted-foreground mb-3">
              Pre-scored grants known to fund wilderness trail work. Click
              &quot;Search&quot; to also pull live results from Grants.gov.
            </p>
          </div>
        )}

        {hasSearched && !loading && (
          <h2 className="text-[15px] font-semibold">
            Search Results
            <span className="text-[12px] text-muted-foreground font-normal ml-2">
              Grants.gov + Curated
            </span>
          </h2>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-[12px] text-muted-foreground mt-2">
              Searching Grants.gov across 7 keywords...
            </p>
          </div>
        ) : (
          <GrantList grants={grants} />
        )}
      </main>

      <footer className="border-t mt-12">
        <div className="max-w-3xl mx-auto px-4 py-4 text-[11px] text-muted-foreground text-center">
          Data from Grants.gov (real-time) and curated sources. Scores are
          estimates — always verify eligibility on the grant website.
        </div>
      </footer>
    </div>
  );
}
