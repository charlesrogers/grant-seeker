"use client";

import { useState } from "react";
import type { ScoredGrant } from "@/lib/types";
import { GrantCard } from "./grant-card";
import { GrantDetailDialog } from "./grant-detail-dialog";

export function GrantList({ grants }: { grants: ScoredGrant[] }) {
  const [selectedGrant, setSelectedGrant] = useState<ScoredGrant | null>(null);

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
        {grants.map((grant) => (
          <GrantCard
            key={grant.id}
            grant={grant}
            onClick={() => setSelectedGrant(grant)}
          />
        ))}
      </div>
      <GrantDetailDialog
        grant={selectedGrant}
        open={!!selectedGrant}
        onClose={() => setSelectedGrant(null)}
      />
    </>
  );
}
