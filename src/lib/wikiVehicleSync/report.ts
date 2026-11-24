import type { CompareResult } from "./types";

function pad(value: string, width: number): string {
  return value.length >= width
    ? value
    : value + " ".repeat(width - value.length);
}

/** Human-readable stdout table report. */
export function formatTextReport(result: CompareResult): string {
  const lines: string[] = [];
  lines.push("Wiki ↔ Calculator vehicle sync");
  lines.push("=".repeat(40));
  lines.push(
    `Wiki total: ${result.wikiTotalCount}  considered: ${result.wikiConsideredCount}  matched: ${result.matchedCount}  local: ${result.localCount}`
  );
  lines.push(
    `Missing in calculator: ${result.missingInCalculator.length}  orphans: ${result.orphansInCalculator.length}  thin chapters: ${result.thinChapters.length}`
  );
  lines.push("");

  lines.push("## Missing in calculator");
  if (result.missingInCalculator.length === 0) {
    lines.push("(none)");
  } else {
    lines.push(
      `${pad("Type", 28)} ${pad("Name", 42)} ${pad("Status", 12)} Prod  Near misses`
    );
    for (const row of result.missingInCalculator) {
      const near = row.nearMisses.length > 0 ? row.nearMisses.join("; ") : "-";
      lines.push(
        `${pad(row.type, 28)} ${pad(row.name, 42)} ${pad(row.status || "—", 12)} ${row.hasProduction ? "yes" : "no "}  ${near}`
      );
    }
  }
  lines.push("");

  lines.push("## Orphans in calculator (not on wiki)");
  if (result.orphansInCalculator.length === 0) {
    lines.push("(none)");
  } else {
    for (const name of result.orphansInCalculator) {
      lines.push(`- ${name}`);
    }
  }
  lines.push("");

  lines.push("## Thin / unmapped chapters");
  if (result.thinChapters.length === 0) {
    lines.push("(none)");
  } else {
    lines.push(
      `${pad("Wiki type", 32)} ${pad("Wiki#", 6)} ${pad("Match", 6)} Local file`
    );
    for (const row of result.thinChapters) {
      lines.push(
        `${pad(row.wikiType, 32)} ${pad(String(row.wikiCount), 6)} ${pad(String(row.matchedLocal), 6)} ${row.chapterFile ?? "unmapped"}`
      );
    }
  }
  lines.push("");

  lines.push("## Wiki vehicles with no Production row");
  if (result.noProductionOnWiki.length === 0) {
    lines.push("(none — or Production data not loaded)");
  } else {
    for (const row of result.noProductionOnWiki) {
      lines.push(`- [${row.type}] ${row.name}`);
    }
  }
  lines.push("");
  lines.push(
    "Note: empty wiki status is not proof of release — review missing names before adding."
  );

  return lines.join("\n");
}

/** Markdown report suitable for `--out report.md`. */
export function formatMarkdownReport(result: CompareResult): string {
  const lines: string[] = [];
  lines.push("# Wiki ↔ Calculator vehicle sync");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Wiki total | ${result.wikiTotalCount} |`);
  lines.push(`| Wiki considered | ${result.wikiConsideredCount} |`);
  lines.push(`| Matched | ${result.matchedCount} |`);
  lines.push(`| Local enum | ${result.localCount} |`);
  lines.push(
    `| Missing in calculator | ${result.missingInCalculator.length} |`
  );
  lines.push(
    `| Orphans in calculator | ${result.orphansInCalculator.length} |`
  );
  lines.push(`| Thin chapters | ${result.thinChapters.length} |`);
  lines.push("");

  lines.push("## Missing in calculator");
  lines.push("");
  if (result.missingInCalculator.length === 0) {
    lines.push("_None_");
  } else {
    lines.push("| Type | Name | Status | Has production | Near misses |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const row of result.missingInCalculator) {
      lines.push(
        `| ${row.type} | ${row.name} | ${row.status || "—"} | ${row.hasProduction ? "yes" : "no"} | ${row.nearMisses.join("; ") || "—"} |`
      );
    }
  }
  lines.push("");

  lines.push("## Orphans in calculator");
  lines.push("");
  if (result.orphansInCalculator.length === 0) {
    lines.push("_None_");
  } else {
    for (const name of result.orphansInCalculator) {
      lines.push(`- ${name}`);
    }
  }
  lines.push("");

  lines.push("## Thin / unmapped chapters");
  lines.push("");
  if (result.thinChapters.length === 0) {
    lines.push("_None_");
  } else {
    lines.push("| Wiki type | Wiki count | Matched | Local file |");
    lines.push("| --- | ---: | ---: | --- |");
    for (const row of result.thinChapters) {
      lines.push(
        `| ${row.wikiType} | ${row.wikiCount} | ${row.matchedLocal} | ${row.chapterFile ?? "unmapped"} |`
      );
    }
  }
  lines.push("");

  lines.push("## Wiki vehicles with no Production row");
  lines.push("");
  if (result.noProductionOnWiki.length === 0) {
    lines.push("_None (or Production data not loaded)_");
  } else {
    for (const row of result.noProductionOnWiki) {
      lines.push(`- **${row.type}**: ${row.name}`);
    }
  }
  lines.push("");
  lines.push(
    "> Empty wiki `status` is not proof of release — triage missing names before adding recipes."
  );
  lines.push("");

  return lines.join("\n");
}
