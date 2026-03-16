export interface GrantsGovHit {
  id: string;
  number: string;
  title: string;
  agencyCode: string;
  agency: string;
  openDate: string;
  closeDate: string;
  oppStatus: string;
  docType: string;
  cfdaList: string[];
}

export interface GrantsGovResponse {
  errorcode: number;
  msg: string;
  data: {
    hitCount: number;
    startRecord: number;
    oppHits: GrantsGovHit[];
    eligibilities: { label: string; value: string; count: number }[];
    fundingCategories: { label: string; value: string; count: number }[];
    agencies: {
      label: string;
      value: string;
      count: number;
      subAgencyOptions: { label: string; value: string; count: number }[];
    }[];
  };
}

export type GrantType = "federal" | "state" | "foundation" | "corporate" | "sponsorship";

export interface Grant {
  id: string;
  source: "grants_gov" | "known";
  sourceId: string;
  title: string;
  agency: string;
  agencyCode: string;
  description: string;
  amountMin: number | null;
  amountMax: number | null;
  deadline: string | null;
  openDate: string | null;
  url: string;
  status: string;
  eligibility: string[];
  categories: string[];
  grantType?: GrantType;
}

export interface ScoreBreakdown {
  eligibility: number;
  category: number;
  geography: number;
  activity: number;
}

export interface ScoredGrant extends Grant {
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  rating: "EXCELLENT" | "STRONG" | "MODERATE" | "POSSIBLE" | "POOR";
}

export interface SearchRequest {
  keyword?: string;
  minScore?: number;
  deadlineDays?: number;
}

export interface SearchResponse {
  grants: ScoredGrant[];
  stats: {
    total: number;
    strongPlus: number;
    upcomingDeadlines: number;
  };
}
