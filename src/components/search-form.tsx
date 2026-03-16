"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchFormProps {
  onSearch: (params: {
    keyword: string;
    minScore: number;
    deadlineDays: number | null;
  }) => void;
  loading: boolean;
}

const scoreFilters = [
  { label: "All", value: 0 },
  { label: "35+", value: 35 },
  { label: "50+", value: 50 },
  { label: "65+", value: 65 },
];

const deadlineFilters = [
  { label: "Any", value: null },
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 },
  { label: "90 days", value: 90 },
];

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [keyword, setKeyword] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [deadlineDays, setDeadlineDays] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword, minScore, deadlineDays });
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
            Min Score:
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
