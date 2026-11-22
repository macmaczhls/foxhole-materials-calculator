import type { CargoQueryResponse, WikiProduction, WikiVehicle } from "./types";

export const DEFAULT_WIKI_API = "https://foxhole.wiki.gg/api.php";
export const DEFAULT_USER_AGENT =
  "foxhole-materials-calculator-wiki-sync/1.0 (local read-only script)";

export interface FetchCargoOptions {
  apiUrl?: string;
  userAgent?: string;
  pageSize?: number;
  sleepMs?: number;
  fetchImpl?: typeof fetch;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rowField(
  title: Record<string, string | undefined>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = title[key];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }
  return "";
}

/** Parse Cargo `vehicles` query JSON into typed rows. */
export function parseVehiclesCargo(
  response: CargoQueryResponse
): WikiVehicle[] {
  if (response.error) {
    throw new Error(
      `Cargo vehicles error: ${response.error.code ?? "unknown"} ${response.error.info ?? ""}`.trim()
    );
  }
  return (response.cargoquery ?? []).map((row) => {
    const title = row.title ?? {};
    return {
      name: rowField(title, "name", "Name"),
      type: rowField(title, "type", "Type"),
      faction: rowField(title, "faction", "Faction"),
      codename: rowField(title, "codename", "Codename"),
      status: rowField(title, "status", "Status"),
    };
  });
}

/** Parse Cargo `Production` query JSON into typed rows. */
export function parseProductionCargo(
  response: CargoQueryResponse
): WikiProduction[] {
  if (response.error) {
    throw new Error(
      `Cargo Production error: ${response.error.code ?? "unknown"} ${response.error.info ?? ""}`.trim()
    );
  }
  return (response.cargoquery ?? []).map((row) => {
    const title = row.title ?? {};
    return {
      source: rowField(title, "Source", "source"),
      productionCategory: rowField(
        title,
        "ProductionCategory",
        "productionCategory"
      ),
      output: rowField(title, "Output", "output"),
      faction: rowField(title, "Faction", "faction"),
      specialStatus: rowField(title, "SpecialStatus", "specialStatus"),
    };
  });
}

async function cargoQueryPage(
  params: Record<string, string>,
  options: FetchCargoOptions
): Promise<CargoQueryResponse> {
  const apiUrl = options.apiUrl ?? DEFAULT_WIKI_API;
  const fetchImpl = options.fetchImpl ?? fetch;
  const url = new URL(apiUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetchImpl(url.toString(), {
    headers: {
      "User-Agent": options.userAgent ?? DEFAULT_USER_AGENT,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Cargo HTTP ${response.status} ${response.statusText} for ${url.toString()}`
    );
  }

  return (await response.json()) as CargoQueryResponse;
}

/**
 * Paginated `action=cargoquery` fetch. Stops when a page returns fewer than
 * `pageSize` rows (or zero).
 */
export async function fetchAllCargoRows(
  baseParams: Record<string, string>,
  options: FetchCargoOptions = {}
): Promise<CargoQueryResponse[]> {
  const pageSize = options.pageSize ?? 500;
  const sleepMs = options.sleepMs ?? 200;
  const pages: CargoQueryResponse[] = [];
  let offset = 0;

  for (;;) {
    const page = await cargoQueryPage(
      {
        ...baseParams,
        action: "cargoquery",
        format: "json",
        limit: String(pageSize),
        offset: String(offset),
      },
      options
    );

    if (page.error) {
      throw new Error(
        `Cargo query error: ${page.error.code ?? "unknown"} ${page.error.info ?? ""}`.trim()
      );
    }

    pages.push(page);
    const count = page.cargoquery?.length ?? 0;
    if (count < pageSize) {
      break;
    }
    offset += pageSize;
    if (sleepMs > 0) {
      await sleep(sleepMs);
    }
  }

  return pages;
}

export async function fetchWikiVehicles(
  options: FetchCargoOptions = {}
): Promise<WikiVehicle[]> {
  const pages = await fetchAllCargoRows(
    {
      tables: "vehicles",
      fields: "name,type,faction,codename,status",
    },
    options
  );
  return pages.flatMap(parseVehiclesCargo);
}

export async function fetchWikiVehicleProduction(
  options: FetchCargoOptions = {}
): Promise<WikiProduction[]> {
  const pages = await fetchAllCargoRows(
    {
      tables: "Production",
      fields: "Source,ProductionCategory,Output,Faction,SpecialStatus",
      where: 'OutputType="vehicle"',
    },
    options
  );
  return pages.flatMap(parseProductionCargo);
}
