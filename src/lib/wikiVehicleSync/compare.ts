import { isUnmappedWikiType, mapWikiTypeToChapter } from "./chapterMap";
import { findNearMisses, normalizeName, resolveAlias } from "./normalize";
import type {
  CompareOptions,
  CompareResult,
  MissingVehicle,
  ThinChapter,
  WikiProduction,
  WikiVehicle,
} from "./types";

const DEFAULT_OPTIONS: CompareOptions = {
  includeRelic: false,
  includeUnavailable: false,
  thinChapterThreshold: 2,
};

function shouldExclude(status: string, options: CompareOptions): boolean {
  const normalized = status.trim().toLowerCase();
  if (normalized === "unavailable" && !options.includeUnavailable) {
    return true;
  }
  if (normalized === "relic" && !options.includeRelic) {
    return true;
  }
  return false;
}

function productionOutputSet(
  production: WikiProduction[],
  aliases: Record<string, string>
): Set<string> {
  const set = new Set<string>();
  for (const row of production) {
    if (!row.output) continue;
    set.add(resolveAlias(row.output, aliases));
  }
  return set;
}

/**
 * Compare wiki Cargo vehicle inventory to local calculator vehicle names.
 * Read-only: does not mutate recipe files or the Vehicles enum.
 */
export function compareWikiToLocal(
  wikiVehicles: WikiVehicle[],
  localNames: string[],
  production: WikiProduction[] = [],
  aliases: Record<string, string> = {},
  options: Partial<CompareOptions> = {}
): CompareResult {
  const opts: CompareOptions = { ...DEFAULT_OPTIONS, ...options };
  const localNormalized = new Map<string, string>();
  for (const name of localNames) {
    localNormalized.set(normalizeName(name), name);
  }
  const localNormalizedSet = new Set(localNormalized.keys());
  const productionSet = productionOutputSet(production, aliases);

  /** Keys present on wiki (all statuses) — used so orphans ignore filter flags. */
  const wikiKeysPresent = new Set<string>();
  const matchedWikiKeys = new Set<string>();
  const missingInCalculator: MissingVehicle[] = [];
  const noProductionOnWiki: Array<{
    name: string;
    type: string;
    status: string;
  }> = [];

  const namedWiki = wikiVehicles.filter((v) => Boolean(v.name));
  const considered = namedWiki.filter((v) => !shouldExclude(v.status, opts));

  for (const vehicle of namedWiki) {
    const key = resolveAlias(vehicle.name, aliases);
    wikiKeysPresent.add(key);
    if (localNormalizedSet.has(key)) {
      matchedWikiKeys.add(key);
    }
  }

  const typeStats = new Map<
    string,
    { wikiCount: number; matchedLocal: number }
  >();

  for (const vehicle of considered) {
    const key = resolveAlias(vehicle.name, aliases);
    const type = vehicle.type || "(unknown)";
    const stats = typeStats.get(type) ?? { wikiCount: 0, matchedLocal: 0 };
    stats.wikiCount += 1;

    if (localNormalizedSet.has(key)) {
      stats.matchedLocal += 1;
    } else {
      missingInCalculator.push({
        name: vehicle.name,
        type,
        status: vehicle.status || "",
        hasProduction: productionSet.has(key),
        nearMisses: findNearMisses(vehicle.name, localNames),
      });
    }

    if (production.length > 0 && !productionSet.has(key)) {
      noProductionOnWiki.push({
        name: vehicle.name,
        type,
        status: vehicle.status || "",
      });
    }

    typeStats.set(type, stats);
  }

  const orphansInCalculator = localNames.filter(
    (name) => !wikiKeysPresent.has(normalizeName(name))
  );

  const thinChapters: ThinChapter[] = [];
  for (const [wikiType, stats] of [...typeStats.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    if (stats.wikiCount < opts.thinChapterThreshold) {
      continue;
    }
    const chapterFile = mapWikiTypeToChapter(wikiType);
    const thin =
      isUnmappedWikiType(wikiType) ||
      stats.matchedLocal === 0 ||
      stats.matchedLocal / stats.wikiCount < 0.5;
    if (thin) {
      thinChapters.push({
        wikiType,
        wikiCount: stats.wikiCount,
        matchedLocal: stats.matchedLocal,
        chapterFile,
      });
    }
  }

  missingInCalculator.sort(
    (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
  );
  orphansInCalculator.sort((a, b) => a.localeCompare(b));
  noProductionOnWiki.sort(
    (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
  );

  return {
    missingInCalculator,
    orphansInCalculator,
    thinChapters,
    noProductionOnWiki,
    matchedCount: matchedWikiKeys.size,
    wikiConsideredCount: considered.length,
    wikiTotalCount: wikiVehicles.length,
    localCount: localNames.length,
  };
}
