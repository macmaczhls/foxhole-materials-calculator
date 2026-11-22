/**
 * Normalize vehicle display names for wiki ↔ calculator matching.
 * Handles curly quotes, apostrophe variants, and whitespace; matching is
 * case-insensitive (covers O'Brien v. vs V. drift).
 */
export function normalizeName(name: string): string {
  return name
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Resolve a wiki name through an optional alias map, then normalize.
 * Alias keys may be raw wiki names or already-normalized keys.
 */
export function resolveAlias(
  wikiName: string,
  aliases: Record<string, string>
): string {
  const direct = aliases[wikiName];
  if (direct) {
    return normalizeName(direct);
  }
  const normalizedKey = normalizeName(wikiName);
  for (const [from, to] of Object.entries(aliases)) {
    if (normalizeName(from) === normalizedKey) {
      return normalizeName(to);
    }
  }
  return normalizedKey;
}

/** Simple Levenshtein distance for near-miss suggestions. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

/**
 * Suggest local names that are close to an unmatched wiki name.
 * Returns up to `limit` display names sorted by distance.
 */
export function findNearMisses(
  wikiName: string,
  localNames: string[],
  limit = 3,
  maxDistance = 4
): string[] {
  const target = normalizeName(wikiName);
  const scored = localNames
    .map((local) => ({
      local,
      distance: editDistance(target, normalizeName(local)),
    }))
    .filter((s) => s.distance > 0 && s.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance || a.local.localeCompare(b.local));

  return scored.slice(0, limit).map((s) => s.local);
}
