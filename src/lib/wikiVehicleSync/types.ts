/** Wiki Cargo `vehicles` row (subset used by the sync script). */
export interface WikiVehicle {
  name: string;
  type: string;
  faction: string;
  codename: string;
  status: string;
}

/** Wiki Cargo `Production` row filtered to vehicle outputs. */
export interface WikiProduction {
  source: string;
  productionCategory: string;
  output: string;
  faction: string;
  specialStatus: string;
}

export interface CompareOptions {
  includeRelic: boolean;
  includeUnavailable: boolean;
  /** Wiki types with at least this many vehicles that look thin locally. */
  thinChapterThreshold: number;
}

export interface MissingVehicle {
  name: string;
  type: string;
  status: string;
  hasProduction: boolean;
  nearMisses: string[];
}

export interface ThinChapter {
  wikiType: string;
  wikiCount: number;
  matchedLocal: number;
  chapterFile: string | null;
}

export interface CompareResult {
  missingInCalculator: MissingVehicle[];
  orphansInCalculator: string[];
  thinChapters: ThinChapter[];
  noProductionOnWiki: Array<{ name: string; type: string; status: string }>;
  matchedCount: number;
  wikiConsideredCount: number;
  wikiTotalCount: number;
  localCount: number;
}

export interface CargoQueryResponse {
  cargoquery?: Array<{ title: Record<string, string | undefined> }>;
  error?: { code?: string; info?: string };
}
