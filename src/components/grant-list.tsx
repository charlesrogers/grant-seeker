"use client";

import { useState } from "react";
import type { ScoredGrant } from "@/lib/types";
import { GrantCard } from "./grant-card";
import { GrantDetailDialog } from "./grant-detail-dialog";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 25;

export function GrantList({ grants }: { grants: ScoredGrant[] }) {
  const [selectedGrant, setSelectedGrant] = useState<ScoredGrant | null>(null);
  const [showCount, setShowCount] = useState(PAGE_SIZE);

  const visible = grants.slice(0, showCount);
  const hasMore = showCount < grants.length;

  if (grants.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-[13px]">
        No grants found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {visible.map((grant) => (
          <GrantCard
            key={grant.id}
            grant={grant}
            onClick={() => setSelectedGrant(grant)}
          />
        ))}
      </div>
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="secondary"
            onClick={() => setShowCount((c) => c + PAGE_SIZE)}
          >
            Show More ({grants.length - showCount} remaining)
          </Button>
        </div>
      )}
      <GrantDetailDialog
        grant={selectedGrant}
        open={!!selectedGrant}
        onClose={() => setSelectedGrant(null)}
      />
    </>
  );
}
