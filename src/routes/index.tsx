import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AnalyzeResult } from "@/lib/seo-analyzer";
import { loadHistory, saveToHistory, clearHistory, type HistoryEntry } from "@/lib/history";
import type { CrawlResult } from "@/lib/crawler";

import { ScoreRing } from "@/components/audit/ScoreRing";
import { EmailBanner } from "@/components/audit/EmailBanner";
import { ScoreGrid } from "@/components/audit/ScoreGrid";
import { ScoreRadar } from "@/components/audit/ScoreRadar";
import { IssuesPanel } from "@/components/audit/IssuesPanel";
import { AiEnginesPanel } from "@/components/audit/AiEnginesPanel";
import { ContentQualityPanel } from "@/components/audit/ContentQualityPanel";
import { TechnicalDepthPanel } from "@/components/audit/TechnicalDepthPanel";
import { MediaSocialPanel } from "@/components/audit/MediaSocialPanel";
import { CrawlForm } from "@/components/audit/CrawlForm";
import { CrawlProgress } from "@/components/audit/CrawlProgress";
import { SiteOverview } from "@/components/audit/SiteOverview";
import { PageTable } from "@/components/audit/PageTable";
import { SiteIssuesPanel } from "@/components/audit/SiteIssuesPanel";
import { useTilt } from "@/hooks/useTilt";
import { LengthGauge } from "@/components/audit/LengthGauge";
import { FreshnessBadge } from "@/components/audit/FreshnessBadge";
import { SnippetSignalsPanel } from "@/components/audit/SnippetSignalsPanel";
import { RecommendationsPanel } from "@/components/audit/RecommendationsPanel";
import { PdfReportButton } from "@/components/audit/PdfReportButton";
import { ScoreWaterfall } from "@/components/audit/ScoreWaterfall";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SEO Beacon" },
      {
        name: "description",
        content:
          "Free SEO auditor: 10-dimension scoring, Flesch readability, semantic HTML analysis, schema validation, entity extraction, AI engine readiness for ChatGPT/Gemini/Perplexity/Claude.",
      },
      { property: "og:title", content: "SEO Beacon" },
      {
        property: "og:description",
        content:
          "The first auditor that scores your site for Google AND AI answer engines. Free, instant, no signup.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

type Mode = "single" | "crawl";

function Index() {
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const crawlResultsRef = useRef<HTMLDivElement | null>(null);
  const [selectedCrawlPage, setSelectedCrawlPage] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mode, setMode] = useState<Mode>("crawl");
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [crawlError, setCrawlError] = useState<string | null>(null);
  const [crawlProgress, setCrawlProgress] = useState<{
    requested: number;
    succeeded: number;
    failed: number;
  } | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const runAnalysis = async (target: string) => {
    setError(null);
    setLoading(true);
    setResult(null);
    setMode("single");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError((json as { error?: string }).error || "Analysis failed.");
      } else {
        const data = json as AnalyzeResult;
        setResult(data);
        setHistory(saveToHistory(data));
        setTimeout(() => {
          document
            .getElementById("results")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const runCrawl = useCallback(async (cfg: { url: string; maxPages: number; maxDepth: number }) => {
    setCrawlError(null);
    setCrawlLoading(true);
    setCrawlResult(null);
    setCrawlProgress(null);
    setMode("crawl");
    try {
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      const json = await res.json();
      if (!res.ok) {
        setCrawlError((json as { error?: string }).error || "Crawl failed.");
      } else {
        const data = json as CrawlResult;
        setCrawlResult(data);
        const firstPage = data.pages.find((p) => p.status === "fetched" && p.result);
        if (firstPage) setSelectedCrawlPage(firstPage.url);
        setTimeout(() => {
          crawlResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (e) {
      setCrawlError(e instanceof Error ? e.message : "Network error");
    } finally {
      setCrawlLoading(false);
    }
  }, []);

  const handleCrawlPdfCapture = useCallback(async () => {
    const result = crawlResult;
    if (!result) throw new Error("No crawl data");

    const pages = result.pages.filter((p) => p.status === "fetched" && p.result);
    if (pages.length === 0) throw new Error("No fetched pages to capture");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const groupIds = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    const injectStyles = () => {
      const s = document.createElement("style");
      s.id = "pdf-override";
      s.textContent = `
        [data-panel-group] .text-muted-foreground { color: #a0a8c0 !important; }
        [data-panel-group] .text-foreground { color: #f7f8fc !important; }
        [data-panel-group] .h-72 { height: 288px !important; min-height: 288px !important; }
        [data-panel-group] > * { overflow: visible !important; }
        [data-panel-group] .glass { background: rgba(30,35,55,0.8) !important; }
      `;
      document.head.appendChild(s);
    };

    const removeStyles = () => {
      const s = document.getElementById("pdf-override");
      if (s) s.remove();
    };

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      setSelectedCrawlPage(page.url);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => setTimeout(resolve, 300));

      injectStyles();

      try {
        for (const gId of groupIds) {
          const el = document.querySelector(`[data-panel-group="${gId}"]`);
          if (!el) continue;

          const canvas = await html2canvas(el as HTMLElement, {
            scale: 1.5,
            useCORS: true,
            logging: false,
            backgroundColor: "#0c0a1a",
          });

          let imgW = pageW - margin * 2;
          let imgH = (canvas.height * imgW) / canvas.width;

          if (imgH > pageH - margin * 2) {
            const fit = (pageH - margin * 2) / imgH;
            imgH = pageH - margin * 2;
            imgW = imgW * fit;
          }

          if (gId !== "0") pdf.addPage();
          const xOff = (pageW - imgW) / 2;
          pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", xOff, margin, imgW, imgH);
        }
      } finally {
        removeStyles();
      }
    }

    setSelectedCrawlPage(null);

    const name = `seo-site-audit-visual-${result.startUrl.replace(/[^a-z0-9]/gi, "-").toLowerCase().slice(0, 40)}`;
    pdf.save(`${name}.pdf`);
  }, [crawlResult]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    runAnalysis(url.trim());
  };

  const heroTagline = useMemo(
    () => "Free audit for Google and AI search visibility.",
    [],
  );

  return (
    <main className="relative mx-auto min-h-screen w-full px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
      <Header />

      {/* Decorative depth orbs — three layers for parallax feel */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute -left-64 -top-64 h-[500px] w-[500px] rounded-full opacity-15 blur-[150px]"
          style={{ background: "var(--color-primary)" }}
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-64 -right-48 h-[400px] w-[400px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "#a855f7" }}
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 13, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-8 blur-[100px]"
          style={{ background: "oklch(0.7 0.18 190)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, -30, 0] }}
          transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      {/* Hero */}
      <section className="mt-12 text-center sm:mt-16">

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] sm:text-6xl"
        >
          <span className="text-gradient">Get Found</span> Online
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          {heroTagline}
        </motion.p>

        {/* Mode toggle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mx-auto mt-8 flex max-w-md items-center rounded-full border border-glass-border bg-glass p-1 text-xs"
        >
          <button
            onClick={() => setMode("single")}
            className={`flex-1 rounded-full px-4 py-2 font-medium transition ${mode === "single" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Single Page
          </button>
          <button
            onClick={() => setMode("crawl")}
            className={`flex-1 rounded-full px-4 py-2 font-medium transition ${mode === "crawl" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Full Site Audit
          </button>
        </motion.div>

        {mode === "single" && (
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass mx-auto mt-4 flex max-w-2xl items-center gap-2 p-2 sm:p-2.5"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourwebsite.com"
              inputMode="url"
              autoComplete="url"
              className="flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-muted-foreground sm:text-lg"
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="relative inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              {loading ? (
                <>
                  <Spinner /> Analyzing…
                </>
              ) : (
                "Analyze Website"
              )}
            </button>
          </motion.form>
        )}

        {mode === "crawl" && (
          <div className="mx-auto mt-4 max-w-2xl">
            <CrawlForm onStart={runCrawl} loading={crawlLoading} />
          </div>
        )}

        <div className="mx-auto mt-4 max-w-2xl">
          <EmailBanner />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-4 max-w-2xl rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {!result && history.length > 0 && (
          <RecentList
            history={history}
            onPick={(h) => {
              setUrl(h.finalUrl);
              runAnalysis(h.finalUrl);
            }}
            onClear={() => {
              clearHistory();
              setHistory([]);
            }}
          />
        )}

        {!result && !loading && <FeatureGrid />}
      </section>

      {/* Crawl progress */}
      {crawlLoading && (
        <div className="mt-8">
          <CrawlProgress
            pagesRequested={crawlProgress?.requested ?? 0}
            pagesSucceeded={crawlProgress?.succeeded ?? 0}
            pagesFailed={crawlProgress?.failed ?? 0}
            maxPages={15}
          />
        </div>
      )}

      {/* Crawl error */}
      <AnimatePresence>
        {crawlError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto mt-4 max-w-2xl rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {crawlError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crawl results */}
      <AnimatePresence>
        {crawlResult && (
          <motion.section
            id="crawl-results"
            ref={crawlResultsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 space-y-8"
          >
            <CrawlResultHeader result={crawlResult} resultsRef={crawlResultsRef} onCustomCapture={handleCrawlPdfCapture} />
            <SiteOverview result={crawlResult} />
            <SiteIssuesPanel result={crawlResult} />
            <PageTable result={crawlResult} />

            {/* Page selector — detailed per-page analysis */}
            {crawlResult.pages.some((p) => p.status === "fetched" && p.result) && (
              <div className="glass p-6">
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
                  <h3 className="font-display text-xl font-semibold">Per-Page Details</h3>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Select a page below to inspect its full analysis.
                </p>
                <div className="flex flex-wrap gap-2">
                  {crawlResult.pages
                    .filter((p) => p.status === "fetched" && p.result)
                    .map((p) => (
                      <button
                        key={p.url}
                        onClick={() => setSelectedCrawlPage(selectedCrawlPage === p.url ? null : p.url)}
                        className={`rounded-lg border px-3 py-2 text-xs transition-all ${
                          selectedCrawlPage === p.url
                            ? "border-primary/60 bg-primary/10 text-primary"
                            : "border-glass-border bg-card/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="font-medium">{p.url.replace(/^https?:\/\//, "").slice(0, 40)}</div>
                        <div className="text-[10px] opacity-60">Score: {p.result!.scores.overall} · d={p.depth}</div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Detailed panels for selected page */}
            {selectedCrawlPage && (() => {
              const page = crawlResult.pages.find((p) => p.url === selectedCrawlPage && p.result);
              if (!page || !page.result) return null;
              const r = page.result;
              return (
                <div className="space-y-8" data-pdf-capture="true">
                  <div className="flex items-center justify-between" data-panel-group="0">
                    <div className="text-xs text-muted-foreground">
                      Inspecting: <span className="font-medium text-foreground">{page.url}</span>
                    </div>
                    <button
                      onClick={() => setSelectedCrawlPage(null)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Close
                    </button>
                  </div>

                  <div data-panel-group="1"><ScoreGrid scores={r.scores} /></div>
                  <div data-panel-group="2"><ScoreWaterfall scores={r.scores} /></div>

                  <div className="grid gap-6 lg:grid-cols-5" data-panel-group="3">
                    <div className="glass p-6 lg:col-span-2">
                      <h3 className="mb-1 font-display text-xl font-semibold">Score Breakdown</h3>
                      <p className="mb-4 text-sm text-muted-foreground">Ten dimensions of SEO health.</p>
                  <div className="h-72 overflow-x-hidden">
                    <ScoreRadar scores={r.scores} />
                  </div>
                    </div>
                    <div className="lg:col-span-3">
                      <AiEnginesPanel engineDetails={r.aiEngineDetails} />
                    </div>
                  </div>

                  <div data-panel-group="4"><MetadataPanel result={r} /></div>
                  <div data-panel-group="5"><ContentQualityPanel metadata={r.metadata} /></div>
                  <div data-panel-group="6"><SnippetSignalsPanel metadata={r.metadata} /></div>
                  <div data-panel-group="7"><TechnicalDepthPanel metadata={r.metadata} /></div>
                  <div data-panel-group="8"><MediaSocialPanel metadata={r.metadata} /></div>
                  <div data-panel-group="9"><IssuesPanel issues={r.issues} /></div>
                  <div data-panel-group="10"><RecommendationsPanel issues={r.issues} /></div>
                </div>
              );
            })()}
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.section
            id="results"
            ref={resultsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 space-y-8"
          >
            <ResultHeader result={result} resultsRef={resultsRef} />
            <ScoreGrid scores={result.scores} />
            <ScoreWaterfall scores={result.scores} />

            <div className="grid gap-6 lg:grid-cols-5">
              <div className="glass p-6 lg:col-span-2">
                <h3 className="mb-1 font-display text-xl font-semibold">Score Breakdown</h3>
                <p className="mb-4 text-sm text-muted-foreground">Ten dimensions of SEO health.</p>
                <div className="h-72 overflow-x-hidden">
                  <ScoreRadar scores={result.scores} />
                </div>
              </div>
              <div className="lg:col-span-3">
                <AiEnginesPanel engineDetails={result.aiEngineDetails} />
              </div>
            </div>

            <MetadataPanel result={result} />

            <div>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl font-semibold">Content & Readability</h3>
                  <p className="text-sm text-muted-foreground">
                    Readability scores, keyword analysis, entities, and content structure signals.
                  </p>
                </div>
              </div>
              <ContentQualityPanel metadata={result.metadata} />
            </div>

            <SnippetSignalsPanel metadata={result.metadata} />

            <div>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl font-semibold">Technical Structure</h3>
                  <p className="text-sm text-muted-foreground">
                    Semantic HTML, heading hierarchy, structured data, link profile, and page details.
                  </p>
                </div>
              </div>
              <TechnicalDepthPanel metadata={result.metadata} />
            </div>

            <div>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl font-semibold">Media & Social</h3>
                  <p className="text-sm text-muted-foreground">
                    Image optimization, Open Graph, and Twitter Card completeness.
                  </p>
                </div>
              </div>
              <MediaSocialPanel metadata={result.metadata} />
            </div>

            <div>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl font-semibold">Issues & Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.issues.length} actionable items, ranked by impact.
                  </p>
                </div>
              </div>
              <IssuesPanel issues={result.issues} />
            </div>

            <RecommendationsPanel issues={result.issues} />

            {history.length > 0 && (
              <RecentList
                history={history}
                onPick={(h) => {
                  setUrl(h.finalUrl);
                  runAnalysis(h.finalUrl);
                }}
                onClear={() => {
                  clearHistory();
                  setHistory([]);
                }}
              />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="mt-24 border-t border-glass-border pt-6 text-center text-xs text-muted-foreground space-y-2">
        <p>No SEO tool can give truly "factual" scores — Google's ranking algorithm is proprietary and constantly changing. AI search engine scores are simulations based on published factor weightings, not actual AI queries. What matters is whether the tool consistently identifies real issues that, when fixed, improve actual SEO performance.</p>
        <p>
          Built and maintained by{" "}
          <a
            href="https://zoltan-abonyi.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted-foreground hover:text-foreground"
          >
            Zoltan Abonyi
          </a>
        </p>
      </footer>
    </main>
  );
}

function BeaconLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
      <defs>
        <linearGradient id="beacon-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="12" stroke="url(#beacon-grad)" strokeWidth="1.5" opacity="0.3" />
      <motion.path
        d="M14 4a10 10 0 0 1 10 10"
        stroke="url(#beacon-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.6 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.path
        d="M14 8a6 6 0 0 1 6 6"
        stroke="url(#beacon-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
      />
      <circle cx="14" cy="14" r="3" fill="url(#beacon-grad)" />
      <motion.circle
        cx="14" cy="14" r="3"
        fill="url(#beacon-grad)"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
      />
    </svg>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between">
      <TiltCard className="inline-flex items-center gap-2.5">
        <BeaconLogo />
        <div className="font-display text-[20px] font-semibold tracking-tight">
          SEO<span className="text-gradient"> Beacon</span>
        </div>
      </TiltCard>

    </header>
  );
}

function Spinner() {
  return (
    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FeatureGrid() {
  const items = [
    {
      t: "Traditional SEO",
      d: "10 scored dimensions: metadata, technical, content, readability, structure, images, links, social, schema, AI visibility.",
    //  icon: "🎯",
      accent: "var(--color-primary)",
    },
    {
      t: "AI Visibility",
      d: "Schema completeness, semantic HTML, entities, FAQ, readability — everything AI engines care about.",
    //  icon: "🤖",
      accent: "var(--color-warning)",
    },
    {
      t: "Per-Engine Scores",
      d: "ChatGPT, Gemini, Perplexity, Claude, Grok, DeepSeek, Kimi, Copilot, Mistral, You.com, Brave Leo & Qwen — with detailed factor breakdowns.",
    //  icon: "📊",
      accent: "var(--color-info)",
    },
    {
      t: "Deep Analysis",
      d: "Readability (Flesch), keyword extraction, entity detection, link profile, image alt quality, and 100+ checks.",
    //  icon: "🔍",
      accent: "var(--color-success)",
    },
    {
      t: "Snippet Signals",
      d: "FAQ detection, question headings, tables, lists, conclusion sections, TOC, numbered steps — all key for featured snippets and AI answers.",
    //  icon: "📋",
      accent: "var(--color-primary)",
    },
    {
      t: "PDF Report",
      d: "Multi-page executive report covering all dimensions with issues and recommendations.",
    //  icon: "📄",
      accent: "var(--color-warning)",
    },
    {
      t: "Full Site Audit",
      d: "Crawl up to 30 pages — duplicate detection, broken links, thin content, sitemap discovery, and cross-page scoring.",
    //  icon: "🕸️",
      accent: "var(--color-info)",
    },
  ];
  return (
    <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => {
        const tilt = useTilt(6);
        return (
        <motion.div
          key={it.t}
          ref={tilt.ref}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.06 }}
          className="group glass relative cursor-default overflow-hidden p-5 text-left"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute left-0 top-0 h-full w-0.5 opacity-0 transition-opacity group-hover:opacity-100"
            style={{ background: it.accent }}
          />
          <div className="mb-3 text-xl" style={{ transform: "translateZ(16px)" }}></div>
          <div className="mb-1 font-display text-sm font-semibold">{it.t}</div>
          <div className="text-xs text-muted-foreground leading-relaxed">{it.d}</div>
        </motion.div>
        );
      })}
    </div>
  );
}

function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const tilt = useTilt(6);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

function ResultHeader({ result, resultsRef }: { result: AnalyzeResult; resultsRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="glass flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Audit results for
        </div>
        <div className="truncate font-display text-xl font-semibold sm:text-2xl">
          {result.finalUrl}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {new Date(result.fetchedAt).toLocaleString()} ·{" "}
          {result.metadata.wordCount.toLocaleString()} words
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PdfReportButton targetRef={resultsRef} fileName={`seo-report-${result.finalUrl.replace(/[^a-z0-9]/gi, "-").toLowerCase().slice(0, 40)}`} />
      </div>
    </div>
  );
}

function MetadataPanel({ result }: { result: AnalyzeResult }) {
  const m = result.metadata;
  const Item = ({ k, v }: { k: string; v: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-4 border-b border-glass-border py-2.5 last:border-0">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="truncate text-right text-sm text-foreground">{v}</div>
    </div>
  );
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="glass p-6">
        <h3 className="mb-3 font-display text-lg font-semibold">Page Metadata</h3>
        <div className="mb-4 space-y-3">
          <LengthGauge
            label="Title length"
            value={m.titleLength}
            min={0}
            max={120}
            idealMin={30}
            idealMax={65}
            unit="c"
          />
          <LengthGauge
            label="Description length"
            value={m.descriptionLength}
            min={0}
            max={320}
            idealMin={70}
            idealMax={160}
            unit="c"
          />
        </div>
        <Item k="Title" v={m.title || "(none)"} />
        <Item k="Description" v={m.description ? `${m.description.slice(0, 80)}…` : "(none)"} />
        <Item k="Canonical" v={m.canonical || "(none)"} />
        <Item k="Robots" v={m.robots || "(default)"} />
        <Item k="Language" v={m.lang || "(none)"} />
        <Item k="Viewport" v={m.hasViewport ? m.viewportContent.slice(0, 40) + "…" : "Missing"} />
      </div>
      <div className="glass p-6">
        <h3 className="mb-3 font-display text-lg font-semibold">Author & Dates</h3>
        <Item k="Author" v={m.authorName || "(none)"} />
        <Item k="Published" v={m.publishDate || "(none)"} />
        <Item k="Modified" v={m.modifiedDate || "(none)"} />
        <Item
          k="Page size"
          v={`${m.pageSize > 1048576 ? (m.pageSize / 1048576).toFixed(1) + " MB" : m.pageSize > 1024 ? (m.pageSize / 1024).toFixed(0) + " KB" : m.pageSize + " B"}`}
        />
        {m.publishDate && (
          <div className="mt-3">
            <FreshnessBadge days={m.freshnessDays} publishDate={m.publishDate} />
          </div>
        )}
        {m.publishDate && m.modifiedDate && (() => {
          const pub = new Date(m.publishDate).getTime();
          const mod = new Date(m.modifiedDate).getTime();
          const gapDays = Math.round((mod - pub) / 86400000);
          if (gapDays <= 0) return null;
          const maxGap = 730;
          const pct = Math.min(100, (gapDays / maxGap) * 100);
          return (
            <div className="mt-4">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Publish → Modified gap
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: gapDays < 90 ? "oklch(0.7 0.2 160)" : gapDays < 365 ? "oklch(0.72 0.2 80)" : "oklch(0.7 0.25 25)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{gapDays}d</span>
              </div>
            </div>
          );
        })()}
      </div>
      <div className="glass p-6">
        <h3 className="mb-3 font-display text-lg font-semibold">Signals</h3>
        <Item
          k="H1 / H2 / H3 / H4"
          v={`${m.h1Count} / ${m.h2Count} / ${m.h3Count} / ${m.h4Count}`}
        />
        <Item
          k="Total links"
          v={`${m.totalLinks} (${m.internalLinks} int, ${m.externalLinks} ext)`}
        />
        <Item k="Images" v={`${m.imageCount} total, ${m.imagesMissingAlt} no alt`} />
        <Item k="Structured data" v={m.hasSchema ? m.schemaTypes.join(", ") || "Yes" : "None"} />
        <Item k="Hreflang" v={m.hasHreflang ? `${m.hreflangTags.length} tag(s)` : "None"} />
        <Item k="Favicon" v={m.hasFavicon ? "Yes" : "No"} />
      </div>
    </div>
  );
}

function CrawlResultHeader({ result, resultsRef, onCustomCapture }: { result: CrawlResult; resultsRef: React.RefObject<HTMLDivElement | null>; onCustomCapture?: () => Promise<void> }) {
  return (
    <div className="glass flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Site audit for</div>
        <div className="truncate font-display text-xl font-semibold sm:text-2xl">
          {result.startUrl}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {result.pagesSucceeded} page{result.pagesSucceeded !== 1 ? "s" : ""} ·{" "}
          {result.crawlDurationMs > 1000
            ? `${(result.crawlDurationMs / 1000).toFixed(0)}s`
            : `${result.crawlDurationMs}ms`}{" "}
          · {result.status}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PdfReportButton targetRef={resultsRef} onCustomCapture={onCustomCapture} fileName={`seo-site-audit-${result.startUrl.replace(/[^a-z0-9]/gi, "-").toLowerCase().slice(0, 40)}`} />
      </div>
    </div>
  );
}

function RecentList({
  history,
  onPick,
  onClear,
}: {
  history: HistoryEntry[];
  onPick: (h: HistoryEntry) => void;
  onClear: () => void;
}) {
  return (
    <div className="mx-auto mt-12 max-w-3xl text-left">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Recent audits</div>
        <button onClick={onClear} className="text-xs text-muted-foreground hover:text-destructive">
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {history.map((h) => (
          <button
            key={h.finalUrl + h.fetchedAt}
            onClick={() => onPick(h)}
            className="glass flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:border-primary/40"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{h.finalUrl}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(h.fetchedAt).toLocaleString()}
              </div>
            </div>
            <div
              className="font-display text-lg font-semibold"
              style={{
                color:
                  h.seo >= 80
                    ? "var(--color-success)"
                    : h.seo >= 60
                      ? "var(--color-info)"
                      : h.seo >= 40
                        ? "var(--color-warning)"
                        : "var(--color-destructive)",
              }}
            >
              {h.seo}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
