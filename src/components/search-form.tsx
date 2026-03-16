"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GrantType } from "@/lib/types";

interface SearchFormProps {
  onSearch: (params: {
    keyword: string;
    minScore: number;
    deadlineDays: number | null;
    grantType: GrantType | null;
  }) => void;
  loading: boolean;
  grantType: GrantType | null;
  onGrantTypeChange: (type: GrantType | null) => void;
}

const scoreFilters = [
  { label: "All", value: 0 },
  { label: "35+", value: 35 },
  { label: "50+", value: 50 },
  { label: "65+", value: 65 },
];

const deadlineFilters = [
  { label: "Any", value: null as number | null },
  { label: "30 days", value: 30 as number | null },
  { label: "60 days", value: 60 as number | null },
  { label: "90 days", value: 90 as number | null },
];

const typeFilters: { label: string; value: GrantType | null; color: string }[] = [
  { label: "All", value: null, color: "" },
  { label: "Federal", value: "federal", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { label: "State", value: "state", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { label: "Foundation", value: "foundation", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { label: "Corporate", value: "corporate", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { label: "Sponsorship", value: "sponsorship", color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
];

export function SearchForm({ onSearch, loading, grantType, onGrantTypeChange }: SearchFormProps) {
  const [keyword, setKeyword] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [deadlineDays, setDeadlineDays] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword, minScore, deadlineDays, grantType });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Search grants (e.g. trail restoration, wilderness)..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 text-[13px]"
        />
        <Button type="submit" disabled={loading} className="shrink-0">
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            Type:
          </span>
          {typeFilters.map((f) => (
            <button
              key={f.value ?? "all"}
              type="button"
              onClick={() => onGrantTypeChange(f.value)}
            >
              <Badge
                variant={grantType === f.value ? "default" : "secondary"}
                className={`text-[10px] rounded-4xl cursor-pointer border ${
                  grantType === f.value && f.color ? f.color : ""
                }`}
              >
                {f.label}
              </Badge>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            Score:
          </span>
          {scoreFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setMinScore(f.value)}
            >
              <Badge
                variant={minScore === f.value ? "default" : "secondary"}
                className="text-[10px] rounded-4xl cursor-pointer"
              >
                {f.label}
              </Badge>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            Deadline:
          </span>
          {deadlineFilters.map((f) => (
            <button
              key={f.value ?? "any"}
              type="button"
              onClick={() => setDeadlineDays(f.value)}
            >
              <Badge
                variant={deadlineDays === f.value ? "default" : "secondary"}
                className="text-[10px] rounded-4xl cursor-pointer"
              >
                {f.label}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
