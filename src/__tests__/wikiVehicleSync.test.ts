import { readFileSync } from "node:fs";
import path from "node:path";

import {
  DEFAULT_ALIASES,
  compareWikiToLocal,
  editDistance,
  findNearMisses,
  formatMarkdownReport,
  formatTextReport,
  isUnmappedWikiType,
  loadLocalVehicleNames,
  mapWikiTypeToChapter,
  normalizeName,
  parseProductionCargo,
  parseVehiclesCargo,
  resolveAlias,
  type CargoQueryResponse,
} from "../lib/wikiVehicleSync";
import { fetchAllCargoRows } from "../lib/wikiVehicleSync/cargo";

const fixturesDir = path.join(
  process.cwd(),
  "src/lib/wikiVehicleSync/fixtures"
);

function loadFixture(name: string): CargoQueryResponse {
  return JSON.parse(
    readFileSync(path.join(fixturesDir, name), "utf8")
  ) as CargoQueryResponse;
}

describe("wikiVehicleSync normalize", () => {
  test("normalizes curly quotes and case", () => {
    expect(normalizeName("00MS “Stinger”")).toBe('00ms "stinger"');
    expect(normalizeName("O'Brien V.113 Gravekeeper")).toBe(
      "o'brien v.113 gravekeeper"
    );
    expect(normalizeName("O'Brien v.113 Gravekeeper")).toBe(
      "o'brien v.113 gravekeeper"
    );
  });

  test("collapses whitespace and nbsp", () => {
    expect(normalizeName('  T3\u00A0 "Xiphos"  ')).toBe('t3 "xiphos"');
  });

  test("resolveAlias maps wiki Smelter short name", () => {
    expect(resolveAlias("40-45 “Smelter”", DEFAULT_ALIASES)).toBe(
      normalizeName('40-45 "Smelter" Heavy Field Gun')
    );
  });

  test("editDistance and near misses", () => {
    expect(editDistance("abc", "abc")).toBe(0);
    expect(editDistance("abc", "ab")).toBe(1);
    const misses = findNearMisses('T3 "Xiphos"', [
      'T3 "Xiphos"',
      'T3 "Xipho"',
      'T5 "Percutio"',
    ]);
    expect(misses).toContain('T3 "Xipho"');
  });
});

describe("wikiVehicleSync cargo parsers", () => {
  test("parses vehicles fixture", () => {
    const vehicles = parseVehiclesCargo(
      loadFixture("cargo-vehicles-sample.json")
    );
    expect(vehicles.length).toBeGreaterThan(10);
    expect(vehicles.some((v) => v.name.includes("Stinger"))).toBe(true);
    expect(vehicles.some((v) => v.status === "Relic")).toBe(true);
    expect(vehicles.some((v) => v.status === "Unavailable")).toBe(true);
  });

  test("parses production fixture", () => {
    const production = parseProductionCargo(
      loadFixture("cargo-production-sample.json")
    );
    expect(production.length).toBeGreaterThan(0);
    expect(production[0].output).toBeTruthy();
  });

  test("throws on cargo error payload", () => {
    expect(() =>
      parseVehiclesCargo({
        error: { code: "internal_api_error", info: "boom" },
      })
    ).toThrow(/boom/);
  });
});

describe("wikiVehicleSync chapter map", () => {
  test("maps known types to recipe files", () => {
    expect(mapWikiTypeToChapter("Light Tank")).toBe("lightTanks.ts");
    expect(mapWikiTypeToChapter("Motorcycle")).toBe("motorcycles.ts");
    expect(mapWikiTypeToChapter("Submarine")).toBe("navalVehicles.ts");
    expect(mapWikiTypeToChapter("Fighter Aircraft")).toBe(
      "aircrafts/fighterAircrafts.ts"
    );
    expect(mapWikiTypeToChapter("Amphibious Fighter Aircraft")).toBe(
      "aircrafts/amphibiousFighterAircrafts.ts"
    );
  });

  test("treats aircraft carrier / mech as unmapped", () => {
    expect(mapWikiTypeToChapter("Aircraft Carrier")).toBeNull();
    expect(isUnmappedWikiType("Aircraft Carrier")).toBe(true);
    expect(isUnmappedWikiType("Mech")).toBe(true);
    expect(isUnmappedWikiType("Light Tank")).toBe(false);
  });
});

describe("wikiVehicleSync compare", () => {
  const vehicles = parseVehiclesCargo(
    loadFixture("cargo-vehicles-sample.json")
  );
  const production = parseProductionCargo(
    loadFixture("cargo-production-sample.json")
  );
  const localNames = [
    '00MS "Stinger"',
    '03MM "Caster"',
    '40-45 "Smelter" Heavy Field Gun',
    "AA-2 Battering Ram",
    'T3 "Xiphos"',
    "O'Brien v.113 Gravekeeper",
    "Devitt Ironhide Mk. IV",
    "BMS - White Whale",
    "Local Only Orphan",
  ];

  test("matches curly quotes and aliases; excludes Relic/Unavailable by default", () => {
    const result = compareWikiToLocal(
      vehicles,
      localNames,
      production,
      DEFAULT_ALIASES
    );

    expect(
      result.missingInCalculator.find((m) => m.name.includes("Stinger"))
    ).toBeUndefined();
    expect(
      result.missingInCalculator.find((m) => m.name.includes("Smelter"))
    ).toBeUndefined();
    expect(
      result.missingInCalculator.find((m) => m.name.includes("Battering"))
    ).toBeUndefined();
    expect(
      result.missingInCalculator.find((m) =>
        m.name.includes("Armoured Fighting Tractor")
      )
    ).toBeUndefined();
    expect(
      result.missingInCalculator.find((m) => m.name.includes("Collector"))
    ).toBeUndefined();

    expect(
      result.missingInCalculator.some((m) => m.name.includes("Trident"))
    ).toBe(true);
    expect(result.orphansInCalculator).toContain("Local Only Orphan");
    // Unavailable on wiki still counts as present for orphan detection
    expect(result.orphansInCalculator).not.toContain("BMS - White Whale");
    expect(result.matchedCount).toBeGreaterThanOrEqual(6);
  });

  test("include flags surface Relic and Unavailable", () => {
    const result = compareWikiToLocal(
      vehicles,
      localNames,
      production,
      DEFAULT_ALIASES,
      { includeRelic: true, includeUnavailable: true }
    );

    expect(
      result.missingInCalculator.some((m) =>
        m.name.includes("Armoured Fighting Tractor")
      )
    ).toBe(true);
    expect(
      result.missingInCalculator.some((m) => m.name.includes("Collector"))
    ).toBe(true);
  });

  test("flags thin/unmapped chapters", () => {
    const result = compareWikiToLocal(
      vehicles,
      localNames,
      production,
      DEFAULT_ALIASES,
      { thinChapterThreshold: 1 }
    );

    expect(
      result.thinChapters.some((c) => c.wikiType === "Aircraft Carrier")
    ).toBe(true);
    expect(
      result.thinChapters.some((c) => c.wikiType === "Dive Bomber Aircraft")
    ).toBe(true);
  });

  test("reports format without throwing", () => {
    const result = compareWikiToLocal(
      vehicles,
      localNames,
      production,
      DEFAULT_ALIASES
    );
    const text = formatTextReport(result);
    const md = formatMarkdownReport(result);
    expect(text).toContain("Missing in calculator");
    expect(md).toContain("# Wiki ↔ Calculator vehicle sync");
  });
});

describe("wikiVehicleSync loadLocal", () => {
  test("loads Vehicles enum display names", () => {
    const names = loadLocalVehicleNames();
    expect(names).toContain('T3 "Xiphos"');
    expect(names.length).toBeGreaterThan(50);
  });
});

describe("wikiVehicleSync fetch pagination", () => {
  test("paginates until a short page", async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      calls.push(url);
      const offset = Number(new URL(url).searchParams.get("offset") ?? "0");
      const rows =
        offset === 0
          ? [{ title: { name: "A" } }, { title: { name: "B" } }]
          : [{ title: { name: "C" } }];
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({ cargoquery: rows }),
      } as Response;
    };

    const pages = await fetchAllCargoRows(
      { tables: "vehicles", fields: "name" },
      {
        fetchImpl,
        pageSize: 2,
        sleepMs: 0,
        apiUrl: "https://example.test/api.php",
      }
    );

    expect(pages).toHaveLength(2);
    expect(calls).toHaveLength(2);
    expect(calls[0]).toContain("offset=0");
    expect(calls[1]).toContain("offset=2");
  });

  test("throws on HTTP failure", async () => {
    const fetchImpl: typeof fetch = async () =>
      ({
        ok: false,
        status: 503,
        statusText: "Unavailable",
      }) as Response;

    await expect(
      fetchAllCargoRows(
        { tables: "vehicles", fields: "name" },
        { fetchImpl, sleepMs: 0 }
      )
    ).rejects.toThrow(/503/);
  });
});
