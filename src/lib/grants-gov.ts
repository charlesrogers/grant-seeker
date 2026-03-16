import type { Grant, GrantsGovHit, GrantsGovResponse } from "./types";
import { GRANTS_GOV_SEARCH_URL } from "./config";

function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  // Grants.gov returns dates as MM/DD/YYYY
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function hitToGrant(hit: GrantsGovHit): Grant {
  return {
    id: `grants_gov_${hit.id}`,
    source: "grants_gov",
    sourceId: hit.id,
    title: hit.title
      .replace(/&ndash;/g, "–")
      .replace(/&rsquo;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">"),
    agency: hit.agency,
    agencyCode: hit.agencyCode,
    description: "", // search2 doesn't return descriptions
    amountMin: null,
    amountMax: null,
    deadline: parseDate(hit.closeDate),
    openDate: parseDate(hit.openDate),
    url: `https://www.grants.gov/search-results-detail/${hit.id}`,
    status: hit.oppStatus,
    eligibility: [], // will be populated from facets if available
    categories: hit.cfdaList || [],
  };
}

export async function searchGrantsGov(
  keyword: string,
  options: {
    rows?: number;
    fundingCategories?: string;
    eligibilities?: string;
    oppStatuses?: string;
  } = {}
): Promise<{ grants: Grant[]; totalHits: number }> {
  const body: Record<string, string | number> = {
    keyword,
    oppStatuses: options.oppStatuses || "posted|forecasted",
    rows: options.rows || 50,
  };

  if (options.fundingCategories) {
    body.fundingCategories = options.fundingCategories;
  }
  if (options.eligibilities) {
    body.eligibilities = options.eligibilities;
  }

  const response = await fetch(GRANTS_GOV_SEARCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error(
      `Grants.gov search failed for "${keyword}": ${response.status}`
    );
    return { grants: [], totalHits: 0 };
  }

  const data: GrantsGovResponse = await response.json();

  if (data.errorcode !== 0) {
    console.error(`Grants.gov error for "${keyword}": ${data.msg}`);
    return { grants: [], totalHits: 0 };
  }

  // Extract eligible applicant types from facets
  const eligibilityCodes = (data.data.eligibilities || []).map((e) => e.value);

  const grants = data.data.oppHits.map((hit) => {
    const grant = hitToGrant(hit);
    // Attach the search-level eligibility facets to each grant
    // (imperfect — these are facets for the whole result set, not per-grant)
    grant.eligibility = eligibilityCodes;
    return grant;
  });

  return { grants, totalHits: data.data.hitCount };
}

export async function searchMultipleKeywords(
  keywords: string[],
  options: {
    fundingCategories?: string;
    eligibilities?: string;
  } = {}
): Promise<Grant[]> {
  const results = await Promise.all(
    keywords.map((kw) => searchGrantsGov(kw, options))
  );

  // Deduplicate by sourceId
  const seen = new Set<string>();
  const deduped: Grant[] = [];

  for (const result of results) {
    for (const grant of result.grants) {
      if (!seen.has(grant.sourceId)) {
        seen.add(grant.sourceId);
        deduped.push(grant);
      }
    }
  }

  return deduped;
}
