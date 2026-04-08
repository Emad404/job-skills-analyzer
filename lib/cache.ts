import type { AnalysisResult } from "@/types";

const CACHE_PREFIX = "job_skills_cache_";
const CACHE_VERSION = "v1";

/**
 * Normalises a job title into a consistent cache key.
 * e.g. "  Data ANALYST " → "job_skills_cache_v1_data analyst"
 */
function buildKey(jobTitle: string): string {
  return `${CACHE_PREFIX}${CACHE_VERSION}_${jobTitle.trim().toLowerCase()}`;
}

/**
 * Attempts to retrieve a cached AnalysisResult for a given job title.
 * Returns null if not found, expired, or the cache is unavailable (SSR).
 */
export function getCachedResult(jobTitle: string): AnalysisResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(buildKey(jobTitle));
    if (!raw) return null;

    const parsed: AnalysisResult = JSON.parse(raw);

    // Basic shape validation — ensure arrays exist and are non-empty
    if (
      !Array.isArray(parsed.skills) ||
      !Array.isArray(parsed.tools) ||
      !Array.isArray(parsed.certifications) ||
      parsed.skills.length === 0
    ) {
      return null;
    }

    return parsed;
  } catch {
    // Corrupted cache entry — silently ignore
    return null;
  }
}

/**
 * Persists an AnalysisResult to LocalStorage keyed by job title.
 * Silently fails if LocalStorage is unavailable (e.g. private browsing).
 */
export function setCachedResult(
  jobTitle: string,
  result: AnalysisResult
): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(buildKey(jobTitle), JSON.stringify(result));
  } catch {
    // Storage quota exceeded or unavailable — silently ignore
  }
}

/**
 * Removes a single cached result (useful for manual cache invalidation).
 */
export function clearCachedResult(jobTitle: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(buildKey(jobTitle));
  } catch {
    // silently ignore
  }
}
