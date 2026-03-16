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

function decodeEntities(text: string): string {
  return text
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function hitToGrant(hit: GrantsGovHit): Grant {
  return {
    id: `grants_gov_${hit.id}`,
    source: "grants_gov",
    sourceId: hit.id,
    title: decodeEntities(hit.title),
    agency: hit.agency,
    agencyCode: hit.agencyCode,
    description: "",
    amountMin: null,
    amountMax: null,
    deadline: parseDate(hit.closeDate),
    openDate: parseDate(hit.openDate),
    url: `https://www.grants.gov/search-results-detail/${hit.id}`,
    status: hit.oppStatus,
    eligibility: [],
    categories: hit.cfdaList || [],
  };
}

async function fetchGrantsGov(
  body: Record<string, string | number>
): Promise<{ grants: Grant[]; totalHits: number }> {
  try {
    const response = await fetch(GRANTS_GOV_SEARCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`Grants.gov search failed: ${response.status}`);
      return { grants: [], totalHits: 0 };
    }

    const data: GrantsGovResponse = await response.json();

    if (data.errorcode !== 0) {
      console.error(`Grants.gov error: ${data.msg}`);
      return { grants: [], totalHits: 0 };
    }

    const eligibilityCodes = (data.data.eligibilities || []).map(
      (e) => e.value
    );

    const grants = data.data.oppHits.map((hit) => {
      const grant = hitToGrant(hit);
      grant.eligibility = eligibilityCodes;
      return grant;
    });

    return { grants, totalHits: data.data.hitCount };
  } catch (err) {
    console.error("Grants.gov fetch error:", err);
    return { grants: [], totalHits: 0 };
  }
}

// Search by keyword
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
    rows: options.rows || 100,
  };

  if (options.fundingCategories) {
    body.fundingCategories = options.fundingCategories;
  }
  if (options.eligibilities) {
    body.eligibilities = options.eligibilities;
  }

  return fetchGrantsGov(body);
}

// Browse by category (no keyword) — pulls ALL grants in NR and ENV categories
export async function browseByCategory(
  categories: string = "NR|ENV",
  options: {
    rows?: number;
    oppStatuses?: string;
  } = {}
): Promise<Grant[]> {
  const body: Record<string, string | number> = {
    oppStatuses: options.oppStatuses || "posted|forecasted",
    fundingCategories: categories,
    rows: options.rows || 200,
  };

  const result = await fetchGrantsGov(body);
  return result.grants;
}

// Browse by agency — pull all grants from DOI and USDA
export async function browseByAgency(
  agencies: string[],
  options: {
    rows?: number;
    oppStatuses?: string;
  } = {}
): Promise<Grant[]> {
  const results = await Promise.all(
    agencies.map((agency) =>
      fetchGrantsGov({
        oppStatuses: options.oppStatuses || "posted|forecasted",
        agencies: agency,
        rows: options.rows || 100,
      })
    )
  );

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

// Full search: keywords + category browse + agency browse — maximum coverage
export async function comprehensiveSearch(
  keywords: string[]
): Promise<Grant[]> {
  const [keywordResults, categoryResults, agencyResults] = await Promise.all([
    searchMultipleKeywords(keywords),
    browseByCategory("NR|ENV"),
    browseByAgency(["USDA", "DOI"]),
  ]);

  // Merge and deduplicate
  const seen = new Set<string>();
  const all: Grant[] = [];

  for (const grant of [...keywordResults, ...categoryResults, ...agencyResults]) {
    if (!seen.has(grant.sourceId)) {
      seen.add(grant.sourceId);
      all.push(grant);
    }
  }

  return all;
}
