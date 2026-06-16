import { analyzeHtml, normalizeUrl, type AnalyzeResult } from "./seo-analyzer";

export interface CrawlConfig {
  startUrl: string;
  maxPages: number;
  maxDepth: number;
  respectRobotsTxt: boolean;
}

export interface CrawlPageResult {
  url: string;
  depth: number;
  status: "fetched" | "error" | "skipped";
  statusCode?: number;
  error?: string;
  result?: AnalyzeResult;
}

export interface DuplicateInfo {
  value: string;
  urls: string[];
}

export interface BrokenLink {
  from: string;
  to: string;
  statusCode: number;
}

export interface CrawlResult {
  startUrl: string;
  config: CrawlConfig;
  status: "complete" | "partial" | "error";
  error?: string;
  pagesRequested: number;
  pagesSucceeded: number;
  pagesFailed: number;
  pagesSkipped: number;
  crawlDurationMs: number;
  pages: CrawlPageResult[];
  averageScores: Record<string, number>;
  scoreDistribution: Record<string, { min: number; max: number; avg: number; median: number }>;
  duplicateTitles: DuplicateInfo[];
  duplicateDescriptions: DuplicateInfo[];
  missingTitles: string[];
  missingDescriptions: string[];
  thinContentPages: { url: string; wordCount: number }[];
  noindexPages: string[];
  brokenInternalLinks: BrokenLink[];
  hasSitemap: boolean;
  sitemapUrlCount: number;
  hasRobotsTxt: boolean;
  disallowedPaths: string[];
  allDiscoveredUrls: string[];
}

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "gclsrc",
  "dclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "oly_anon_id",
  "oly_enc_id",
  "_openstat",
  "vero_id",
  "wickedid",
  "yclid",
]);

function normalizeCrawlUrl(raw: string, baseUrl?: string): string | null {
  try {
    const url = new URL(raw, baseUrl);
    url.hash = "";
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const params = new URLSearchParams(url.search);
    for (const key of params.keys()) {
      if (TRACKING_PARAMS.has(key)) params.delete(key);
    }
    const sorted = Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    url.search = sorted.length > 0 ? `?${new URLSearchParams(sorted).toString()}` : "";
    let path = url.pathname;
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    if (path.endsWith("/index.html") || path.endsWith("/index.htm"))
      path = path.replace(/\/index\.html?$/, "/");
    url.pathname = path;
    return url.href;
  } catch {
    return null;
  }
}

function sameOrigin(url1: string, url2: string): boolean {
  try {
    return (
      new URL(url1).hostname.replace(/^www\./, "") === new URL(url2).hostname.replace(/^www\./, "")
    );
  } catch {
    return false;
  }
}

function parseRobotsTxt(
  text: string,
  userAgent = "*",
): { disallowed: string[]; allowed: string[] } {
  const disallowed: string[] = [];
  const allowed: string[] = [];
  let currentAgent: string | null = null;
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (/^User-agent:/i.test(trimmed)) {
      currentAgent = trimmed
        .replace(/^User-agent:\s*/i, "")
        .trim()
        .toLowerCase();
    }
    if (currentAgent !== userAgent && currentAgent !== "*") continue;
    if (/^Disallow:/i.test(trimmed)) {
      const path = trimmed.replace(/^Disallow:\s*/i, "").trim();
      if (path) disallowed.push(path);
    }
    if (/^Allow:/i.test(trimmed)) {
      const path = trimmed.replace(/^Allow:\s*/i, "").trim();
      if (path) allowed.push(path);
    }
  }
  return { disallowed, allowed };
}

function isPathDisallowed(path: string, disallowed: string[], allowed: string[]): boolean {
  for (const a of allowed) {
    if (path.startsWith(a)) return false;
  }
  for (const d of disallowed) {
    if (d === "/" || path.startsWith(d)) return true;
  }
  return false;
}

function parseSitemapXml(xml: string): string[] {
  const urls: string[] = [];
  const locRe = /<loc[^>]*>([\s\S]*?)<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = locRe.exec(xml)) !== null) {
    const u = m[1].trim();
    if (u) urls.push(u);
  }
  return urls;
}

const SCORE_KEYS = [
  "overall",
  "metadata",
  "technical",
  "structure",
  "content",
  "readability",
  "images",
  "links",
  "social",
  "schema",
  "aiVisibility",
];

export async function runCrawl(config: CrawlConfig): Promise<CrawlResult> {
  const startTime = Date.now();
  const start = normalizeCrawlUrl(normalizeUrl(config.startUrl));
  if (!start)
    return {
      status: "error",
      error: "Invalid start URL",
      startUrl: config.startUrl,
      config,
      pagesRequested: 0,
      pagesSucceeded: 0,
      pagesFailed: 0,
      pagesSkipped: 0,
      crawlDurationMs: 0,
      pages: [],
      averageScores: {},
      scoreDistribution: {},
      duplicateTitles: [],
      duplicateDescriptions: [],
      missingTitles: [],
      missingDescriptions: [],
      thinContentPages: [],
      noindexPages: [],
      brokenInternalLinks: [],
      hasSitemap: false,
      sitemapUrlCount: 0,
      hasRobotsTxt: false,
      disallowedPaths: [],
      allDiscoveredUrls: [],
    };

  const baseOrigin = (() => {
    try {
      return new URL(start).origin;
    } catch {
      return "";
    }
  })();
  let disallowedPaths: string[] = [];
  let allowedPaths: string[] = [];
  let hasRobotsTxt = false;
  let hasSitemap = false;
  let sitemapUrlCount = 0;

  // Fetch robots.txt
  try {
    const robotsRes = await fetch(`${baseOrigin}/robots.txt`, {
      signal: AbortSignal.timeout(5000),
    });
    if (robotsRes.ok) {
      hasRobotsTxt = true;
      const text = await robotsRes.text();
      const parsed = parseRobotsTxt(text);
      disallowedPaths = parsed.disallowed;
      allowedPaths = parsed.allowed;
      // Check for sitemap directives
      const sitemapLines = text.split("\n").filter((l) => /^Sitemap:/i.test(l.trim()));
      for (const sl of sitemapLines) {
        const sitemapUrl = sl.replace(/^Sitemap:\s*/i, "").trim();
        if (sitemapUrl) {
          try {
            const sitemapRes = await fetch(sitemapUrl, { signal: AbortSignal.timeout(5000) });
            if (sitemapRes.ok) {
              const sitemapXml = await sitemapRes.text();
              const sitemapUrls = parseSitemapXml(sitemapXml);
              if (sitemapUrls.length > 0) {
                hasSitemap = true;
                sitemapUrlCount += sitemapUrls.length;
              }
            }
          } catch {
            /* skip sitemap fetch error */
          }
        }
      }
    }
  } catch {
    /* robots.txt fetch failed, proceed without it */
  }

  // BFS crawl
  const visited = new Set<string>();
  const queue: { url: string; depth: number }[] = [{ url: start, depth: 0 }];
  visited.add(start);
  const pages: CrawlPageResult[] = [];
  const allDiscoveredUrls: string[] = [];
  let timedOut = false;

  const enqueue = (href: string, currentDepth: number) => {
    const normalized = normalizeCrawlUrl(href, start);
    if (!normalized) return;
    if (!sameOrigin(normalized, start)) return;
    if (visited.has(normalized)) return;
    const path = (() => {
      try {
        return new URL(normalized).pathname;
      } catch {
        return "/";
      }
    })();
    if (config.respectRobotsTxt && isPathDisallowed(path, disallowedPaths, allowedPaths)) return;
    if (normalized === start) return;
    visited.add(normalized);
    queue.push({ url: normalized, depth: currentDepth + 1 });
  };

  // Concurrency control
  const CONCURRENCY = 3;
  let activeCount = 0;
  let queueIndex = 0;

  const processNext = async (): Promise<void> => {
    while (queueIndex < queue.length && activeCount < CONCURRENCY) {
      if (Date.now() - startTime > 28000) {
        timedOut = true;
        return;
      }
      if (pages.length >= config.maxPages) return;

      const item = queue[queueIndex++];
      if (!item || item.depth > config.maxDepth) continue;

      activeCount++;
      const task = (async () => {
        if (Date.now() - startTime > 28000) {
          timedOut = true;
          return;
        }
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(item.url, {
            redirect: "follow",
            signal: controller.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; SEOAuditorBot/1.0; +https://lovable.dev)",
              Accept: "text/html,application/xhtml+xml",
            },
          });
          clearTimeout(timeout);

          const statusCode = res.status;
          if (!res.ok && statusCode >= 400) {
            pages.push({
              url: item.url,
              depth: item.depth,
              status: "error",
              statusCode,
              error: `HTTP ${statusCode}`,
            });
            // Record as broken link from parent pages
            for (const p of pages) {
              if (p.result?.metadata.internalLinksFound.includes(item.url)) {
                // broken link will be tracked in cross-page analysis
              }
            }
            return;
          }

          const contentType = res.headers.get("content-type") || "";
          if (!/text\/html|application\/xhtml/i.test(contentType)) {
            pages.push({
              url: item.url,
              depth: item.depth,
              status: "skipped",
              statusCode,
              error: `Non-HTML: ${contentType}`,
            });
            return;
          }

          const html = await res.text();
          if (!html || html.length < 50) {
            pages.push({
              url: item.url,
              depth: item.depth,
              status: "error",
              statusCode,
              error: "Empty or near-empty HTML",
            });
            return;
          }

          const result = analyzeHtml(item.url, res.url || item.url, html);

          // Enqueue discovered internal links
          for (const link of result.metadata.internalLinksFound) {
            enqueue(link, item.depth);
            allDiscoveredUrls.push(link);
          }

          pages.push({ url: item.url, depth: item.depth, status: "fetched", statusCode, result });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Unknown error";
          pages.push({ url: item.url, depth: item.depth, status: "error", error: msg });
        }
      })();

      // Don't await here to allow concurrency
      task.finally(() => {
        activeCount--;
      });
    }

    // Wait for existing tasks if we're at capacity
    if (activeCount >= CONCURRENCY || (queueIndex >= queue.length && activeCount > 0)) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  };

  // Main loop
  while (queueIndex < queue.length || activeCount > 0) {
    if (timedOut || Date.now() - startTime > 28000) {
      timedOut = true;
      break;
    }
    if (pages.length >= config.maxPages) break;
    await processNext();
    // Small yield to allow pending tasks to settle
    if (activeCount > 0) await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Wait for remaining active tasks
  while (activeCount > 0) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const crawlDurationMs = Date.now() - startTime;
  const fetchedPages = pages.filter((p) => p.status === "fetched");
  const succeeded = fetchedPages.length;
  const failed = pages.filter((p) => p.status === "error").length;
  const skipped = pages.filter((p) => p.status === "skipped").length;

  // Aggregate scores
  const scoreValues: Record<string, number[]> = {};
  for (const key of SCORE_KEYS) scoreValues[key] = [];
  for (const p of fetchedPages) {
    if (!p.result) continue;
    for (const key of SCORE_KEYS) {
      const val = (p.result.scores as Record<string, number>)[key];
      if (typeof val === "number") scoreValues[key].push(val);
    }
  }

  const averageScores: Record<string, number> = {};
  const scoreDistribution: Record<
    string,
    { min: number; max: number; avg: number; median: number }
  > = {};
  for (const key of SCORE_KEYS) {
    const vals = scoreValues[key];
    if (vals.length === 0) {
      averageScores[key] = 0;
      scoreDistribution[key] = { min: 0, max: 0, avg: 0, median: 0 };
      continue;
    }
    const sorted = [...vals].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    averageScores[key] = Math.round(sum / sorted.length);
    scoreDistribution[key] = {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: Math.round(sum / sorted.length),
      median:
        sorted.length % 2 === 0
          ? Math.round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2)
          : sorted[Math.floor(sorted.length / 2)],
    };
  }

  // Cross-page duplicate detection
  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  const missingTitles: string[] = [];
  const missingDescriptions: string[] = [];
  const thinContentPages: { url: string; wordCount: number }[] = [];
  const noindexPages: string[] = [];
  const brokenInternalLinks: BrokenLink[] = [];

  for (const p of fetchedPages) {
    if (!p.result) continue;
    const m = p.result.metadata;
    if (!m.title) missingTitles.push(p.url);
    else {
      const existing = titleMap.get(m.title) || [];
      existing.push(p.url);
      titleMap.set(m.title, existing);
    }
    if (!m.description) missingDescriptions.push(p.url);
    else {
      const existing = descMap.get(m.description) || [];
      existing.push(p.url);
      descMap.set(m.description, existing);
    }
    if (m.wordCount < 300) thinContentPages.push({ url: p.url, wordCount: m.wordCount });
    if (/noindex/i.test(m.robots)) noindexPages.push(p.url);
  }

  const duplicateTitles: DuplicateInfo[] = [];
  for (const [value, urls] of titleMap) {
    if (urls.length > 1) duplicateTitles.push({ value, urls });
  }
  const duplicateDescriptions: DuplicateInfo[] = [];
  for (const [value, urls] of descMap) {
    if (urls.length > 1) duplicateDescriptions.push({ value, urls });
  }

  // Broken internal links — check failed pages that were linked from somewhere
  const linkedFrom = new Map<string, string[]>();
  for (const p of fetchedPages) {
    if (!p.result) continue;
    for (const link of p.result.metadata.internalLinksFound) {
      const existing = linkedFrom.get(link) || [];
      existing.push(p.url);
      linkedFrom.set(link, existing);
    }
  }
  for (const p of pages) {
    if (p.status === "error" && p.statusCode && p.statusCode >= 400) {
      const sources = linkedFrom.get(p.url) || [];
      if (sources.length > 0) {
        for (const src of sources.slice(0, 3)) {
          brokenInternalLinks.push({ from: src, to: p.url, statusCode: p.statusCode });
        }
      }
    }
  }

  return {
    startUrl: config.startUrl,
    config,
    status: timedOut ? "partial" : "complete",
    pagesRequested: pages.length,
    pagesSucceeded: succeeded,
    pagesFailed: failed,
    pagesSkipped: skipped,
    crawlDurationMs,
    pages,
    averageScores,
    scoreDistribution,
    duplicateTitles,
    duplicateDescriptions,
    missingTitles,
    missingDescriptions,
    thinContentPages,
    noindexPages,
    brokenInternalLinks,
    hasSitemap,
    sitemapUrlCount,
    hasRobotsTxt,
    disallowedPaths,
    allDiscoveredUrls: Array.from(new Set(allDiscoveredUrls)),
  };
}
