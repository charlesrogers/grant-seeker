export const ORG_PROFILE = {
  name: "Utah Wilderness Trails",
  type: "501c3" as const,
  state: "UT",
  mission:
    "Wilderness trail maintenance using non-motorized methods including hand tools, bowsaws, crosscuts, and mule/horse pack stock",
  landAgencies: ["USFS", "BLM", "NPS"],
  activities: [
    "trail maintenance",
    "trail restoration",
    "signage installation",
    "brushing",
    "trail clearing",
    "pack stock support",
    "wilderness stewardship",
    "volunteer coordination",
  ],
  tools: ["bowsaw", "crosscut saw", "pulaski", "mcleod", "hand drill"],
};

export const GRANTS_GOV_SEARCH_URL =
  "https://api.grants.gov/v1/api/search2";

export const DEFAULT_KEYWORDS = [
  "trail maintenance",
  "wilderness stewardship",
  "recreation trails",
  "public lands trails",
  "trail signage",
  "trail restoration",
  "conservation volunteer",
];

// Grants.gov eligibility code for 501(c)(3) nonprofits
export const NONPROFIT_ELIGIBILITY_CODE = "12";

// Relevant funding category codes
export const RELEVANT_FUNDING_CATEGORIES = ["NR", "ENV"]; // Natural Resources, Environment

// Relevant agency codes
export const RELEVANT_AGENCIES = [
  "USDA",
  "USDA-FS",
  "DOI",
  "DOI-BLM",
  "DOI-NPS",
  "DOI-FWS",
  "DOI-BOR",
];
