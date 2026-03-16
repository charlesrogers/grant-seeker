"use client";

import { useState } from "react";
import type { GrantType } from "@/lib/types";
import { getAnglesForGrant, type WritingAngle } from "@/lib/angles";

function AngleCard({ angle }: { angle: WritingAngle }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-muted/30 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-muted/50 transition-colors"
      >
        <span className="shrink-0 text-[11px] font-bold text-primary bg-primary/10 rounded px-1.5 py-0.5 tabular-nums">
          {angle.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold">{angle.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            {angle.pitch}
          </p>
        </div>
        <span className="text-[11px] text-muted-foreground shrink-0 mt-0.5">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2.5 border-t bg-card/50">
          <div className="pt-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Key Stats
            </p>
            <ul className="space-y-1">
              {angle.stats.map((stat, i) => (
                <li
                  key={i}
                  className="text-[11px] leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground"
                >
                  {stat}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Example Language
            </p>
            <p className="text-[11px] leading-relaxed italic text-muted-foreground bg-muted/50 rounded p-2">
              &ldquo;{angle.exampleLanguage}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function WritingAngles({ grantType }: { grantType?: GrantType }) {
  const angles = getAnglesForGrant(grantType);

  return (
    <div>
      <h4 className="text-[12px] font-semibold text-muted-foreground mb-2">
        WRITING ANGLES
      </h4>
      <p className="text-[11px] text-muted-foreground mb-2">
        Top persuasion hooks for this type of funder. Click to expand for stats
        and example language.
      </p>
      <div className="space-y-1.5">
        {angles.slice(0, 4).map((angle) => (
          <AngleCard key={angle.id} angle={angle} />
        ))}
      </div>
    </div>
  );
}
