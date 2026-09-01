export type DisclosureStatus = "official" | "combined" | "launch" | "not-disclosed";

export type CommercialRecord = {
  id: string;
  game: string;
  year: string;
  metric: string;
  metricLabel: string;
  period: string;
  status: DisclosureStatus;
  statusLabel: string;
  detail: string;
  sourceUrl: string;
  sourceLabel: string;
  accent: string;
};

export type SalesDistrict = {
  id: string;
  game: string;
  year: string;
  metric: string;
  unitLabel: string;
  reportedUnits: number;
  buildingCount: number;
  detail: string;
  sourceUrl: string;
  sourceLabel: string;
  accent: string;
};

export const commercialRecords: CommercialRecord[] = [
  {
    id: "gta-3-sales",
    game: "GTA III",
    year: "2002",
    metric: "6M+",
    metricLabel: "units sold",
    period: "By May 2002",
    status: "official",
    statusLabel: "Official milestone",
    detail: "Seven months after launch, Liberty City had already crossed six million copies worldwide.",
    sourceUrl: "https://ir.take2games.com/static-files/8a092397-e897-45d1-8989-37fda79e1a15",
    sourceLabel: "Take-Two · May 2002",
    accent: "#8dd5f3",
  },
  {
    id: "trilogy-combined",
    game: "III + Vice City",
    year: "2003",
    metric: "22M+",
    metricLabel: "combined units",
    period: "Fiscal 2003",
    status: "combined",
    statusLabel: "Combined figure",
    detail: "Take-Two reported the two landmark releases together. No honest split between them was disclosed.",
    sourceUrl: "https://ir.take2games.com/static-files/d4f7260c-a878-452f-abaa-fdc0c14e05fc",
    sourceLabel: "Take-Two · FY2003",
    accent: "#ff69b7",
  },
  {
    id: "san-andreas-sales",
    game: "San Andreas",
    year: "2005",
    metric: "12M+",
    metricLabel: "units shipped",
    period: "Within four months",
    status: "official",
    statusLabel: "Official milestone",
    detail: "The state-sized sequel moved more than twelve million units before its first spring.",
    sourceUrl: "https://ir.take2games.com/static-files/ab93d398-44b4-4ecf-ae85-f1888c7a913a",
    sourceLabel: "Take-Two · February 2005",
    accent: "#a6db67",
  },
  {
    id: "gta-4-launch",
    game: "GTA IV",
    year: "2008",
    metric: "$500M+",
    metricLabel: "estimated retail value",
    period: "First week",
    status: "launch",
    statusLabel: "Launch retail sales",
    detail: "Roughly 3.6 million copies moved on day one; the first week passed six million and half a billion dollars at retail.",
    sourceUrl: "https://ir.take2games.com/static-files/5baba02b-007b-41f7-bcaf-1ee583ce9e4c",
    sourceLabel: "Take-Two · May 2008",
    accent: "#acc9dd",
  },
  {
    id: "gta-5-launch",
    game: "GTA V",
    year: "2013",
    metric: "$1B+",
    metricLabel: "worldwide retail sales",
    period: "First three days",
    status: "launch",
    statusLabel: "Launch retail sales",
    detail: "Los Santos became the fastest entertainment property to cross one billion dollars at retail at the time.",
    sourceUrl: "https://ir.take2games.com/node/16191/pdf",
    sourceLabel: "Take-Two · September 2013",
    accent: "#c8f05f",
  },
  {
    id: "online-disclosure",
    game: "GTA Online",
    year: "2013—",
    metric: "—",
    metricLabel: "standalone lifetime revenue",
    period: "Not separately disclosed",
    status: "not-disclosed",
    statusLabel: "Not disclosed",
    detail: "Take-Two identifies GTA Online as a major contributor, but does not publish a clean lifetime revenue total for it on its own.",
    sourceUrl: "https://www.take2games.com/ir/news/take-two-interactive-software-inc-reports-results-fourth-2",
    sourceLabel: "Take-Two · FY2026 results",
    accent: "#5bd7ff",
  },
];

export const salesDistricts: SalesDistrict[] = [
  {
    id: "district-liberty",
    game: "GTA III",
    year: "2002",
    metric: "6M+",
    unitLabel: "units",
    reportedUnits: 6,
    buildingCount: 7,
    detail: "The modern open-world template finds its first mass audience.",
    sourceUrl: commercialRecords[0].sourceUrl,
    sourceLabel: commercialRecords[0].sourceLabel,
    accent: "#8dd5f3",
  },
  {
    id: "district-coasts",
    game: "III + Vice City",
    year: "2003",
    metric: "22M+",
    unitLabel: "combined units",
    reportedUnits: 22,
    buildingCount: 12,
    detail: "Two cities turn a breakthrough into a defining console-era phenomenon.",
    sourceUrl: commercialRecords[1].sourceUrl,
    sourceLabel: commercialRecords[1].sourceLabel,
    accent: "#ff69b7",
  },
  {
    id: "district-state",
    game: "San Andreas",
    year: "2005",
    metric: "12M+",
    unitLabel: "in four months",
    reportedUnits: 12,
    buildingCount: 16,
    detail: "The map grows into a state and the audience follows it there almost immediately.",
    sourceUrl: commercialRecords[2].sourceUrl,
    sourceLabel: commercialRecords[2].sourceLabel,
    accent: "#a6db67",
  },
  {
    id: "district-hd",
    game: "GTA IV",
    year: "2011",
    metric: "23M+",
    unitLabel: "sold-in",
    reportedUnits: 23,
    buildingCount: 20,
    detail: "The heavier HD-era Liberty City builds a long commercial tail after its record launch.",
    sourceUrl: "https://ir.take2games.com/static-files/a023a439-277c-43cb-b191-199c05414161",
    sourceLabel: "Take-Two investor presentation",
    accent: "#b2d1e5",
  },
  {
    id: "district-los-santos",
    game: "GTA V",
    year: "2026",
    metric: "225M+",
    unitLabel: "sold-in",
    reportedUnits: 225,
    buildingCount: 27,
    detail: "One Los Santos spans three console generations and becomes the series’ permanent metropolis.",
    sourceUrl: "https://ir.take2games.com/static-files/032e3067-32cd-4c82-b4dd-2bd20a153a6a",
    sourceLabel: "Take-Two · Q3 FY2026",
    accent: "#dfff3f",
  },
  {
    id: "district-franchise",
    game: "Grand Theft Auto",
    year: "2026",
    metric: "470M+",
    unitLabel: "franchise sold-in",
    reportedUnits: 470,
    buildingCount: 34,
    detail: "Every city, side story and generation becomes one enormous illuminated route toward Leonida.",
    sourceUrl: "https://www.take2games.com/ir/news/rockstar-games-announces-pre-orders-grand-theft-auto-vi",
    sourceLabel: "Take-Two · June 2026",
    accent: "#ff8a75",
  },
];

export const undisclosedTitles = [
  "Grand Theft Auto",
  "London 1969 / 1961",
  "GTA 2",
  "GTA Advance",
  "Liberty City Stories",
  "Vice City Stories",
  "Chinatown Wars",
  "Episodes from Liberty City",
  "The Definitive Edition",
];
