import type { GrantType } from "./types";

export interface WritingAngle {
  id: string;
  name: string;
  emoji: string;
  pitch: string;
  stats: string[];
  exampleLanguage: string;
  bestFor: GrantType[];
}

export const WRITING_ANGLES: WritingAngle[] = [
  {
    id: "volunteer_leverage",
    name: "Volunteer Leverage / Taxpayer ROI",
    emoji: "7:1",
    pitch:
      "Every $1 of grant funding generates $7 in trail maintenance value through trained volunteer labor and donated pack stock support.",
    stats: [
      "NWSA Trail Partners programs achieve a 7:1 leverage ratio — $18.7M in cash and in-kind support against federal dollars",
      "Independent Sector values volunteer time at $33.49/hour (2024)",
      "A 10-person trail crew working 8 days = 640 volunteer hours = $21,434 in volunteer value from a single project",
      "Pack stock support (mules/horses) eliminates helicopter costs of $3,000-$8,000/day for material transport",
    ],
    exampleLanguage:
      "This project will leverage $X in grant funding into $Y of total trail maintenance value through Z volunteer hours and donated pack stock support, achieving a leverage ratio of N:1. Our trained volunteers, equipped with hand tools and supported by mule pack strings, deliver professional-grade trail maintenance at a fraction of contracted costs.",
    bestFor: ["federal", "state", "foundation"],
  },
  {
    id: "wilderness_act",
    name: "Wilderness Act Compliance",
    emoji: "WA",
    pitch:
      "We are one of the few organizations equipped to maintain trails in federally designated Wilderness where motorized equipment is prohibited by the Wilderness Act of 1964.",
    stats: [
      "The Wilderness Act of 1964 prohibits motorized equipment in designated Wilderness areas",
      "USFS manages 110M+ acres of Wilderness — most trail crews can't work there because they need chainsaws",
      "Only organizations with crosscut saw certification and pack stock capability can do this work",
      "Utah has 21 designated Wilderness areas totaling 800,000+ acres on USFS and BLM land",
    ],
    exampleLanguage:
      "Our organization possesses the specialized capability to maintain trails in federally designated Wilderness areas, where the Wilderness Act of 1964 prohibits motorized equipment. Using crosscut saws, bowsaws, hand tools, and mule/horse pack strings, we deliver trail maintenance that preserves wilderness character while meeting the same quality standards as mechanized methods. This capability fills a critical gap that federal agencies cannot address with standard contracted crews.",
    bestFor: ["federal", "foundation"],
  },
  {
    id: "economic_impact",
    name: "Economic Impact of Outdoor Recreation",
    emoji: "$B",
    pitch:
      "Maintained trails are the infrastructure that enables Utah's $10B outdoor recreation economy.",
    stats: [
      "Outdoor recreation generates $10.1B in consumer spending in Utah (Bureau of Economic Analysis)",
      "88,000 jobs in Utah depend on outdoor recreation",
      "Outdoor recreation contributes 3.4% of Utah's GDP",
      "Trail-based recreation (hiking, backpacking, horseback riding) is the most popular outdoor activity in Utah",
      "National parks in Utah generate $1.4B in visitor spending annually",
    ],
    exampleLanguage:
      "Utah's outdoor recreation economy generates $10.1 billion in consumer spending and supports 88,000 jobs. Maintained trails are the foundational infrastructure that makes this economic engine possible. This project directly supports the trail network that draws millions of visitors to Utah's public lands, generating tax revenue, supporting local businesses, and sustaining rural communities that depend on recreation tourism.",
    bestFor: ["state", "corporate", "foundation"],
  },
  {
    id: "agency_backlog",
    name: "Agency Maintenance Backlog",
    emoji: "1B+",
    pitch:
      "Federal land agencies cannot maintain their trail systems alone. Our volunteers directly reduce the $1B+ deferred maintenance backlog.",
    stats: [
      "USFS has a $1B+ deferred trail maintenance backlog across 159,000 miles of trails",
      "Only ~25% of National Forest trails are maintained to standard annually",
      "BLM and NPS face similar backlogs on their trail systems",
      "Agency budgets have declined in real terms while trail usage has increased 40%+ since 2010",
      "Nonprofit partners now perform the majority of trail maintenance on many forests",
    ],
    exampleLanguage:
      "The USDA Forest Service faces a deferred trail maintenance backlog exceeding $1 billion across 159,000 miles of trails, with only 25% of trails maintained to standard annually. Our organization directly addresses this critical infrastructure gap by deploying trained volunteer crews to maintain X miles of trail that would otherwise remain degraded. Without nonprofit partners like us, these trails would continue to deteriorate, increasing erosion, safety hazards, and environmental damage.",
    bestFor: ["federal", "state"],
  },
  {
    id: "safety_sar",
    name: "Safety & Emergency Response",
    emoji: "SAR",
    pitch:
      "Maintained trails with clear signage prevent SAR incidents that cost taxpayers $5K-$50K per mission.",
    stats: [
      "Search and rescue missions cost $5,000–$50,000 each, funded primarily by county taxpayers",
      "Utah had 500+ SAR missions in 2024, many on trails with poor signage or maintenance",
      "Lost or injured hikers on poorly maintained trails are the #1 cause of backcountry SAR calls",
      "Clear trail signage with location identifiers (like what3words addresses) can reduce SAR response time by 30-60 minutes",
      "Proper trail maintenance reduces injury-causing hazards (deadfall, erosion, washouts)",
    ],
    exampleLanguage:
      "Every sign we install and every mile of trail we maintain reduces the likelihood of costly search and rescue incidents — which average $5,000–$50,000 per mission, funded by county taxpayers. Our signage includes precise location identifiers that enable lost hikers to communicate their exact position to emergency responders, dramatically reducing rescue response times. Trail maintenance directly prevents the hazards — deadfall, erosion, and washouts — that cause the injuries triggering SAR calls.",
    bestFor: ["state", "corporate", "sponsorship"],
  },
  {
    id: "youth_community",
    name: "Youth & Community Engagement",
    emoji: "YTH",
    pitch:
      "Our trail crews provide hands-on conservation experience for youth, building the next generation of public land stewards.",
    stats: [
      "Youth conservation corps participants are 3x more likely to pursue careers in natural resources",
      "Trail crew experience builds leadership, teamwork, physical fitness, and land ethic skills",
      "Pack stock programs introduce youth to traditional backcountry skills and western heritage",
      "Volunteer trail work is the #1 gateway to long-term conservation engagement",
      "Utah Conservation Corps (UCC) and similar programs provide trained youth crews for partnership projects",
    ],
    exampleLanguage:
      "This project engages X young people in hands-on trail maintenance, teaching crosscut saw skills, wilderness navigation, pack stock handling, and land stewardship. Participants gain practical conservation skills, build physical fitness, and develop a lifelong connection to public lands. Our program creates the next generation of wilderness stewards who will continue this critical work for decades to come.",
    bestFor: ["corporate", "foundation", "federal"],
  },
  {
    id: "ecosystem",
    name: "Ecosystem Stewardship",
    emoji: "ECO",
    pitch:
      "Trail maintenance prevents erosion, protects riparian areas, and reduces human impact on wildlife corridors.",
    stats: [
      "Poorly maintained trails cause 2-3x more erosion than well-maintained trails",
      "Trail erosion can send 10-50 tons of sediment per mile per year into waterways",
      "Maintained trails keep hikers on designated routes, reducing off-trail trampling of sensitive habitat",
      "Wilderness areas in Utah provide critical habitat for mule deer, elk, moose, and endangered species",
      "Non-motorized trail maintenance has zero air/noise pollution impact on wildlife — unlike mechanized methods",
    ],
    exampleLanguage:
      "Our non-motorized trail maintenance methods protect the very ecosystems we work within. By maintaining trails to standard with hand tools and pack stock, we prevent the erosion that degrades riparian areas and pollutes waterways, keep recreational users on designated routes to protect sensitive habitat, and ensure zero air or noise pollution impact on wildlife. Every mile of trail we maintain is a mile of functioning wildlife corridor preserved.",
    bestFor: ["foundation", "federal", "corporate"],
  },
];

export function getAnglesForGrant(grantType?: GrantType): WritingAngle[] {
  if (!grantType) return WRITING_ANGLES.slice(0, 4);

  // Sort by relevance: angles where this grantType appears first in bestFor
  return [...WRITING_ANGLES].sort((a, b) => {
    const aIdx = a.bestFor.indexOf(grantType);
    const bIdx = b.bestFor.indexOf(grantType);
    const aScore = aIdx === -1 ? 99 : aIdx;
    const bScore = bIdx === -1 ? 99 : bIdx;
    return aScore - bScore;
  });
}
