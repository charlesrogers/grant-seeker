"use client";

import { cn } from "@/lib/utils";
import type { ScoredGrant } from "@/lib/types";

const ratingColors: Record<ScoredGrant["rating"], string> = {
  EXCELLENT: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  STRONG: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  MODERATE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  POSSIBLE: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  POOR: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function ScoreBadge({
  score,
  rating,
  size = "default",
}: {
  score: number;
  rating: ScoredGrant["rating"];
  size?: "default" | "sm";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-bold tabular-nums",
        ratingColors[rating],
        size === "sm"
          ? "h-8 w-8 text-[11px]"
          : "h-11 w-11 text-[13px]"
      )}
    >
      {score}
    </div>
  );
}
