import type { AnalyzeResult } from "./seo-analyzer";

const KEY = "seo-auditor:history";
const MAX = 5;

export interface HistoryEntry {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  seo: number;
  overall: number;
  result: AnalyzeResult;
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveToHistory(result: AnalyzeResult): HistoryEntry[] {
  const entry: HistoryEntry = {
    url: result.url,
    finalUrl: result.finalUrl,
    fetchedAt: result.fetchedAt,
    seo: result.scores.overall,
    overall: result.scores.overall,
    result,
  };
  const existing = loadHistory().filter((e) => e.finalUrl !== result.finalUrl);
  const next = [entry, ...existing].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
  return next;
}

export function clearHistory() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
