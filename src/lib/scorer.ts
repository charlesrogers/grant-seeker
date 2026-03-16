import type { Grant, ScoredGrant, ScoreBreakdown } from "./types";

// --- Eligibility Signals ---
const NONPROFIT_KEYWORDS = [
  "nonprofit",
  "non-profit",
  "501(c)(3)",
  "501c3",
  "nongovernmental",
  "ngo",
];

const GOVT_ONLY_KEYWORDS = [
  "government only",
  "state agencies only",
  "federal agencies only",
];

// --- Category Signals (weight per keyword match) ---
const CATEGORY_SIGNALS: Record<string, number> = {
  "trail maintenance": 8,
  "trail restoration": 8,
  wilderness: 7,
  stewardship: 6,
  "recreation trail": 6,
  "recreational trail": 6,
  conservation: 5,
  "public lands": 5,
  "outdoor recreation": 4,
  "natural resources": 3,
  environmental: 3,
  volunteer: 2,
  "youth conservation": 2,
  "land management": 2,
  // Negative signals
  motorized: -10,
  ohv: -10,
  "off-highway": -10,
  urban: -3,
  technology: -5,
  healthcare: -8,
  clinical: -8,
  pharmaceutical: -8,
  cyber: -8,
};

// --- Geography Signals ---
const GEO_STRONG = ["utah", " ut ", "wasatch", "uinta"];
const GEO_WESTERN = [
  "western states",
  "intermountain",
  "rocky mountain",
  "colorado plateau",
];
const GEO_LAND_AGENCIES = [
  "forest service",
  "usfs",
  "bureau of land management",
  "blm",
  "national park service",
  "nps",
  "usda",
  "department of interior",
  "doi",
];
const GEO_AGENCY_CODES = [
  "USDA-FS",
  "DOI-BLM",
  "DOI-NPS",
  "DOI-FWS",
  "DOI-BOR",
  "DOI-USGS1",
];

// --- Activity Signals ---
const ACTIVITY_SIGNALS: Record<string, number> = {
  "trail sign": 8,
  signage: 8,
  "pack stock": 8,
  mule: 8,
  "non-motorized": 7,
  nonmotorized: 7,
  "crosscut saw": 8,
  crosscut: 8,
  bowsaw: 8,
  "hand tools": 6,
  "hand tool": 6,
  "primitive tools": 7,
  "trail crew": 6,
  "trail clearing": 7,
  brushing: 5,
  "wilderness character": 7,
  "minimum tool": 8,
  horse: 5,
  equestrian: 5,
};

function textContains(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

function scoreEligibility(grant: Grant): number {
  const text = `${grant.title} ${grant.description}`.toLowerCase();
  const eligLabels = grant.eligibility.join(" ").toLowerCase();

  // Disqualifier: government only
  for (const kw of GOVT_ONLY_KEYWORDS) {
    if (textContains(text, kw)) return 0;
  }

  let score = 0;

  // Check eligibility array for 501(c)(3) code
  if (
    grant.eligibility.some(
      (e) => e === "12" || e.includes("501(c)(3)") || e.includes("nonprofit")
    )
  ) {
    score += 20;
  } else if (eligLabels.includes("nonprofit") || eligLabels.includes("501")) {
    score += 15;
  }

  // Check description text
  for (const kw of NONPROFIT_KEYWORDS) {
    if (textContains(text, kw)) {
      score += 3;
      break;
    }
  }

  // Known grants that are pre-tagged as nonprofit eligible
  if (grant.source === "known") {
    score = Math.max(score, 20);
  }

  return Math.min(score, 25);
}

function scoreCategory(grant: Grant): number {
  const text = `${grant.title} ${grant.description}`.toLowerCase();
  let score = 0;

  for (const [keyword, weight] of Object.entries(CATEGORY_SIGNALS)) {
    if (text.includes(keyword.toLowerCase())) {
      score += weight;
    }
  }

  // Bonus for relevant CFDA categories
  for (const cat of grant.categories) {
    if (cat === "NR" || cat === "ENV") score += 3;
  }

  return Math.max(0, Math.min(score, 25));
}

function scoreGeography(grant: Grant): number {
  const text =
    `${grant.title} ${grant.description} ${grant.agency}`.toLowerCase();
  let score = 0;

  // Utah specifically mentioned
  for (const kw of GEO_STRONG) {
    if (text.includes(kw)) {
      score += 15;
      break;
    }
  }

  // Western region
  for (const kw of GEO_WESTERN) {
    if (text.includes(kw)) {
      score += 5;
      break;
    }
  }

  // Relevant land agency
  for (const kw of GEO_LAND_AGENCIES) {
    if (text.includes(kw)) {
      score += 8;
      break;
    }
  }

  // Agency code match
  if (GEO_AGENCY_CODES.includes(grant.agencyCode)) {
    score += 8;
  }

  // National/all states (if no state specificity found, moderate score)
  if (
    score === 0 &&
    (text.includes("nationwide") ||
      text.includes("all states") ||
      text.includes("national"))
  ) {
    score += 5;
  }

  return Math.min(score, 25);
}

function scoreActivity(grant: Grant): number {
  const text = `${grant.title} ${grant.description}`.toLowerCase();
  let score = 0;

  for (const [keyword, weight] of Object.entries(ACTIVITY_SIGNALS)) {
    if (text.includes(keyword.toLowerCase())) {
      score += weight;
    }
  }

  return Math.max(0, Math.min(score, 25));
}

function getRating(
  score: number
): ScoredGrant["rating"] {
  if (score >= 80) return "EXCELLENT";
  if (score >= 65) return "STRONG";
  if (score >= 50) return "MODERATE";
  if (score >= 35) return "POSSIBLE";
  return "POOR";
}

export function scoreGrant(grant: Grant): ScoredGrant {
  // Disqualifier: closed grants with past deadlines
  if (grant.deadline) {
    const deadlineDate = new Date(grant.deadline);
    if (deadlineDate < new Date() && grant.status === "closed") {
      return {
        ...grant,
        totalScore: 0,
        scoreBreakdown: {
          eligibility: 0,
          category: 0,
          geography: 0,
          activity: 0,
        },
        rating: "POOR",
      };
    }
  }

  const breakdown: ScoreBreakdown = {
    eligibility: scoreEligibility(grant),
    category: scoreCategory(grant),
    geography: scoreGeography(grant),
    activity: scoreActivity(grant),
  };

  const totalScore =
    breakdown.eligibility +
    breakdown.category +
    breakdown.geography +
    breakdown.activity;

  return {
    ...grant,
    totalScore,
    scoreBreakdown: breakdown,
    rating: getRating(totalScore),
  };
}
