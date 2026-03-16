"use client";

import type { ScoredGrant } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "./score-badge";

const pillarLabels: Record<string, string> = {
  eligibility: "Eligibility",
  category: "Category Match",
  geography: "Geography",
  activity: "Activity Match",
};

export function GrantDetailDialog({
  grant,
  open,
  onClose,
}: {
  grant: ScoredGrant | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!grant) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <ScoreBadge
              score={grant.totalScore}
              rating={grant.rating}
            />
            <div>
              <DialogTitle className="text-[15px] font-semibold leading-tight">
                {grant.title}
              </DialogTitle>
              <p className="text-[12px] text-muted-foreground mt-1">
                {grant.agency}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Score breakdown */}
          <div>
            <h4 className="text-[12px] font-semibold text-muted-foreground mb-2">
              SCORE BREAKDOWN
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(grant.scoreBreakdown).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5"
                >
                  <span className="text-[12px]">{pillarLabels[key]}</span>
                  <span className="text-[12px] font-semibold tabular-nums">
                    {value}/25
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          {grant.description && (
            <div>
              <h4 className="text-[12px] font-semibold text-muted-foreground mb-1">
                DESCRIPTION
              </h4>
              <p className="text-[13px] leading-relaxed">
                {grant.description}
              </p>
            </div>
          )}

          {/* Amount */}
          {(grant.amountMin || grant.amountMax) && (
            <div>
              <h4 className="text-[12px] font-semibold text-muted-foreground mb-1">
                FUNDING RANGE
              </h4>
              <p className="text-[13px] font-medium">
                {grant.amountMin && grant.amountMax
                  ? `$${grant.amountMin.toLocaleString()} – $${grant.amountMax.toLocaleString()}`
                  : grant.amountMax
                    ? `Up to $${grant.amountMax.toLocaleString()}`
                    : `From $${grant.amountMin!.toLocaleString()}`}
              </p>
            </div>
          )}

          {/* Deadline */}
          <div>
            <h4 className="text-[12px] font-semibold text-muted-foreground mb-1">
              DEADLINE
            </h4>
            <p className="text-[13px]">
              {grant.deadline
                ? new Date(grant.deadline).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Open / Rolling — check website for current cycle"}
            </p>
          </div>

          {/* Status */}
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-[10px] rounded-4xl">
              {grant.source === "known" ? "Curated" : "Grants.gov"}
            </Badge>
            <Badge variant="secondary" className="text-[10px] rounded-4xl capitalize">
              {grant.status}
            </Badge>
            <Badge
              className="text-[10px] rounded-4xl"
              variant={
                grant.rating === "EXCELLENT" || grant.rating === "STRONG"
                  ? "default"
                  : "secondary"
              }
            >
              {grant.rating} FIT
            </Badge>
          </div>

          {/* Apply button */}
          <a
            href={grant.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors"
          >
            View Grant &amp; Apply
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
