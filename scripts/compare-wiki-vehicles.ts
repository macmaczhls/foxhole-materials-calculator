#!/usr/bin/env npx tsx
/**
 * Read-only compare: foxhole.wiki.gg Cargo vehicles vs local Vehicles enum.
 *
 * Usage:
 *   npm run compare:wiki-vehicles
 *   npm run compare:wiki-vehicles -- --include-relic --out tmp/wiki-vehicles.md
 *   npm run compare:wiki-vehicles -- --offline --cache-dir tmp
 *   npm run compare:wiki-vehicles -- --fixture
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  DEFAULT_ALIASES,
  compareWikiToLocal,
  fetchWikiVehicleProduction,
  fetchWikiVehicles,
  formatMarkdownReport,
  formatTextReport,
  loadLocalVehicleNames,
  parseProductionCargo,
  parseVehiclesCargo,
  type CargoQueryResponse,
  type CompareResult,
  type WikiProduction,
  type WikiVehicle,
} from "../src/lib/wikiVehicleSync";

interface CliOptions {
  includeRelic: boolean;
  includeUnavailable: boolean;
  json: boolean;
  out: string | null;
  cacheDir: string;
  offline: boolean;
  refresh: boolean;
  fixture: boolean;
  thinChapterThreshold: number;
  help: boolean;
}

function printHelp(): void {
  console.log(`compare-wiki-vehicles — Cargo wiki ↔ calculator diff (read-only)

Options:
  --include-relic          Include wiki status=Relic in missing report
  --include-unavailable    Include wiki status=Unavailable in missing report
  --json                   Print JSON instead of a text table
  --out <file>             Also write a Markdown report to this path
  --cache-dir <dir>        Cache directory (default: tmp)
  --offline                Use cache only (no network)
  --refresh                Force re-fetch and overwrite cache
  --fixture                Use bundled sample Cargo fixtures (offline)
  --thin-threshold <n>     Min wiki vehicles per type for thin-chapter check (default: 2)
  --help                   Show this help
`);
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    includeRelic: false,
    includeUnavailable: false,
    json: false,
    out: null,
    cacheDir: "tmp",
    offline: false,
    refresh: false,
    fixture: false,
    thinChapterThreshold: 2,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--include-relic":
        options.includeRelic = true;
        break;
      case "--include-unavailable":
        options.includeUnavailable = true;
        break;
      case "--json":
        options.json = true;
        break;
      case "--out":
        options.out = argv[++i] ?? null;
        if (!options.out) throw new Error("--out requires a file path");
        break;
      case "--cache-dir":
        options.cacheDir = argv[++i] ?? "tmp";
        break;
      case "--offline":
        options.offline = true;
        break;
      case "--refresh":
        options.refresh = true;
        break;
      case "--fixture":
        options.fixture = true;
        break;
      case "--thin-threshold": {
        const raw = argv[++i];
        const value = Number(raw);
        if (!Number.isFinite(value) || value < 1) {
          throw new Error("--thin-threshold requires a positive number");
        }
        options.thinChapterThreshold = value;
        break;
      }
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

async function loadJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function loadFixtures(): Promise<{
  vehicles: WikiVehicle[];
  production: WikiProduction[];
}> {
  const base = path.join(process.cwd(), "src/lib/wikiVehicleSync/fixtures");
  const vehicles = parseVehiclesCargo(
    await loadJsonFile<CargoQueryResponse>(
      path.join(base, "cargo-vehicles-sample.json")
    )
  );
  const production = parseProductionCargo(
    await loadJsonFile<CargoQueryResponse>(
      path.join(base, "cargo-production-sample.json")
    )
  );
  return { vehicles, production };
}

async function loadFromCache(cacheDir: string): Promise<{
  vehicles: WikiVehicle[];
  production: WikiProduction[];
} | null> {
  try {
    const vehicles = await loadJsonFile<WikiVehicle[]>(
      path.join(cacheDir, "wiki-vehicles-cache.json")
    );
    const production = await loadJsonFile<WikiProduction[]>(
      path.join(cacheDir, "wiki-production-cache.json")
    );
    return { vehicles, production };
  } catch {
    return null;
  }
}

async function saveCache(
  cacheDir: string,
  vehicles: WikiVehicle[],
  production: WikiProduction[]
): Promise<void> {
  await mkdir(cacheDir, { recursive: true });
  await writeFile(
    path.join(cacheDir, "wiki-vehicles-cache.json"),
    JSON.stringify(vehicles, null, 2),
    "utf8"
  );
  await writeFile(
    path.join(cacheDir, "wiki-production-cache.json"),
    JSON.stringify(production, null, 2),
    "utf8"
  );
  await writeFile(
    path.join(cacheDir, "wiki-sync-cache-meta.json"),
    JSON.stringify({ fetchedAt: new Date().toISOString() }, null, 2),
    "utf8"
  );
}

async function loadWikiData(options: CliOptions): Promise<{
  vehicles: WikiVehicle[];
  production: WikiProduction[];
  source: string;
}> {
  if (options.fixture) {
    const data = await loadFixtures();
    return { ...data, source: "fixture" };
  }

  if (options.offline && options.refresh) {
    throw new Error("Cannot combine --offline and --refresh");
  }

  if (options.offline) {
    const cached = await loadFromCache(options.cacheDir);
    if (!cached) {
      throw new Error(
        `No cache in ${options.cacheDir}. Run without --offline once, or pass --fixture.`
      );
    }
    return { ...cached, source: `cache:${options.cacheDir}` };
  }

  try {
    const vehicles = await fetchWikiVehicles();
    const production = await fetchWikiVehicleProduction();
    await saveCache(options.cacheDir, vehicles, production);
    return { vehicles, production, source: "network" };
  } catch (error) {
    const cached = await loadFromCache(options.cacheDir);
    if (cached && !options.refresh) {
      console.error(
        `Network fetch failed (${error instanceof Error ? error.message : error}); using cache.`
      );
      return { ...cached, source: `cache-fallback:${options.cacheDir}` };
    }
    throw error;
  }
}

function buildResult(
  vehicles: WikiVehicle[],
  production: WikiProduction[],
  options: CliOptions
): CompareResult {
  return compareWikiToLocal(
    vehicles,
    loadLocalVehicleNames(),
    production,
    DEFAULT_ALIASES,
    {
      includeRelic: options.includeRelic,
      includeUnavailable: options.includeUnavailable,
      thinChapterThreshold: options.thinChapterThreshold,
    }
  );
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const { vehicles, production, source } = await loadWikiData(options);
  const result = buildResult(vehicles, production, options);

  if (options.json) {
    console.log(JSON.stringify({ source, result }, null, 2));
  } else {
    console.log(`Data source: ${source}`);
    console.log(formatTextReport(result));
  }

  if (options.out) {
    await mkdir(path.dirname(path.resolve(options.out)), { recursive: true });
    await writeFile(options.out, formatMarkdownReport(result), "utf8");
    console.error(`Wrote Markdown report to ${options.out}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
