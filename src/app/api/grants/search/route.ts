import { NextRequest, NextResponse } from "next/server";
import { searchMultipleKeywords } from "@/lib/grants-gov";
import { scoreGrant } from "@/lib/scorer";
import { KNOWN_GRANTS } from "@/lib/known-grants";
import { DEFAULT_KEYWORDS } from "@/lib/config";
import type { ScoredGrant, SearchResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    keyword,
    minScore = 0,
    deadlineDays,
  } = body as {
    keyword?: string;
    minScore?: number;
    deadlineDays?: number;
  };

  // Build keyword list: user keyword + defaults
  const keywords = keyword
    ? [keyword, ...DEFAULT_KEYWORDS]
    : DEFAULT_KEYWORDS;

  // Fetch from Grants.gov in parallel across keywords
  const govGrants = await searchMultipleKeywords(keywords);

  // Score all Grants.gov results
  const scoredGov = govGrants.map(scoreGrant);

  // Score known grants
  const scoredKnown = KNOWN_GRANTS.map(scoreGrant);

  // Merge and sort
  let allGrants: ScoredGrant[] = [...scoredGov, ...scoredKnown];

  // Filter by minimum score
  if (minScore > 0) {
    allGrants = allGrants.filter((g) => g.totalScore >= minScore);
  }

  // Filter by deadline window
  if (deadlineDays) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + deadlineDays);
    allGrants = allGrants.filter((g) => {
      if (!g.deadline) return true; // Include grants with unknown deadlines
      return new Date(g.deadline) <= cutoff;
    });
  }

  // Sort by score descending, then by deadline ascending
  allGrants.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (a.deadline && b.deadline)
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    if (a.deadline) return -1;
    return 1;
  });

  // Take top 100
  const grants = allGrants.slice(0, 100);

  // Compute stats
  const now = new Date();
  const thirtyDays = new Date();
  thirtyDays.setDate(now.getDate() + 30);

  const stats = {
    total: grants.length,
    strongPlus: grants.filter((g) => g.totalScore >= 65).length,
    upcomingDeadlines: grants.filter(
      (g) => g.deadline && new Date(g.deadline) <= thirtyDays
    ).length,
  };

  const response: SearchResponse = { grants, stats };
  return NextResponse.json(response);
}
