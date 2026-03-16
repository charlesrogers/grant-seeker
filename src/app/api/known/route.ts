import { NextResponse } from "next/server";
import { KNOWN_GRANTS } from "@/lib/known-grants";
import { scoreGrant } from "@/lib/scorer";

export async function GET() {
  const scored = KNOWN_GRANTS.map(scoreGrant).sort(
    (a, b) => b.totalScore - a.totalScore
  );
  return NextResponse.json({ grants: scored });
}
