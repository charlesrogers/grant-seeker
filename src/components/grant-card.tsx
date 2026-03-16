"use client";

import type { ScoredGrant, GrantType } from "@/lib/types";
import { ScoreBadge } from "./score-badge";
import { ScoreBreakdown } from "./score-breakdown";
import { Badge } from "@/components/ui/badge";

const typeLabels: Record<GrantType, string> = {
  federal: "Federal",
  state: "State",
  foundation: "Foundation",
  corporate: "Corporate",
  sponsorship: "Sponsorship",
};

const typeColors: Record<GrantType, string> = {
  federal: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  state: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  foundation: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  corporate: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  sponsorship: "bg-pink-500/10 text-pink-600 border-pink-500/20",
};

function formatDeadline(deadline: string | null): {
  text: string;
  urgency: "urgent" | "soon" | "normal" | "unknown";
} {
  if (!deadline) return { text: "Open / Rolling", urgency: "unknown" };

  const d = new Date(deadline);
  const now = new Date();
  const daysLeft = Math.ceil(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const text = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (daysLeft < 0) return { text: `Closed ${text}`, urgency: "urgent" };
  if (daysLeft <= 30)
    return { text: `${text} (${daysLeft}d)`, urgency: "urgent" };
  if (daysLeft <= 60)
    return { text: `${text} (${daysLeft}d)`, urgency: "soon" };
  return { text, urgency: "normal" };
}

const urgencyColors = {
  urgent: "text-red-600",
  soon: "text-amber-600",
  normal: "text-muted-foreground",
  unknown: "text-muted-foreground",
};

function formatAmount(min: number | null, max: number | null): string {
  if (min === null && max === null) return "Amount varies";
  const fmt = (n: number) =>
    n >= 1000000
      ? `$${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`
      : `$${(n / 1000).toFixed(0)}K`;
  if (min !== null && max !== null) return `${fmt(min)} – ${fmt(max)}`;
  if (max !== null) return `Up to ${fmt(max)}`;
  return `From ${fmt(min!)}`;
}

export function GrantCard({
  grant,
  onClick,
}: {
  grant: ScoredGrant;
  onClick: () => void;
}) {
  const deadline = formatDeadline(grant.deadline);

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border bg-card shadow-sm shadow-black/[0.04] overflow-hidden hover:shadow-md hover:shadow-black/[0.06] transition-shadow p-4"
    >
      <div className="flex gap-3">
        <ScoreBadge score={grant.totalScore} rating={grant.rating} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold leading-tight truncate">
                {grant.title}
              </h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {grant.agency}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={`shrink-0 text-[10px] rounded-4xl border ${
                grant.grantType
                  ? typeColors[grant.grantType]
                  : ""
              }`}
            >
              {grant.grantType
                ? typeLabels[grant.grantType]
                : grant.source === "known"
                  ? "Curated"
                  : "Grants.gov"}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[12px] font-medium">
              {formatAmount(grant.amountMin, grant.amountMax)}
            </span>
            <span className={`text-[12px] ${urgencyColors[deadline.urgency]}`}>
              {deadline.text}
            </span>
          </div>
          <div className="mt-2">
            <ScoreBreakdown breakdown={grant.scoreBreakdown} />
          </div>
        </div>
      </div>
    </button>
  );
}
