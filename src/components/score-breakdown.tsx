"use client";

import type { ScoreBreakdown as ScoreBreakdownType } from "@/lib/types";

const pillars = [
  { key: "eligibility" as const, label: "Elig", max: 25 },
  { key: "category" as const, label: "Cat", max: 25 },
  { key: "geography" as const, label: "Geo", max: 25 },
  { key: "activity" as const, label: "Act", max: 25 },
];

export function ScoreBreakdown({
  breakdown,
}: {
  breakdown: ScoreBreakdownType;
}) {
  return (
    <div className="flex gap-2">
      {pillars.map((p) => {
        const value = breakdown[p.key];
        const pct = (value / p.max) * 100;
        return (
          <div key={p.key} className="flex flex-col items-center gap-0.5">
            <div className="h-1.5 w-8 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/60 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {p.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
