export {
  DEFAULT_USER_AGENT,
  DEFAULT_WIKI_API,
  fetchAllCargoRows,
  fetchWikiVehicleProduction,
  fetchWikiVehicles,
  parseProductionCargo,
  parseVehiclesCargo,
} from "./cargo";
export type { FetchCargoOptions } from "./cargo";
export {
  WIKI_TYPE_CHAPTER_MAP,
  isUnmappedWikiType,
  mapWikiTypeToChapter,
} from "./chapterMap";
export { compareWikiToLocal } from "./compare";
export {
  loadLocalRecipeVehicleNames,
  loadLocalVehicleNames,
} from "./loadLocal";
export {
  editDistance,
  findNearMisses,
  normalizeName,
  resolveAlias,
} from "./normalize";
export { formatMarkdownReport, formatTextReport } from "./report";
export type {
  CargoQueryResponse,
  CompareOptions,
  CompareResult,
  MissingVehicle,
  ThinChapter,
  WikiProduction,
  WikiVehicle,
} from "./types";

import aliasesJson from "./aliases.json";

/** Seeded wiki → local display-name aliases. */
export const DEFAULT_ALIASES: Record<string, string> = aliasesJson;
