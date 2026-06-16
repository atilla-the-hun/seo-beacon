import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import type { CrawlResult } from "@/lib/crawler";
import { ScoreRadar } from "./ScoreRadar";
import { DonutChart, DonutLegend } from "./DonutChart";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  result: CrawlResult;
}

const SCORE_COLORS: Record<string, string> = {
  overall: "var(--color-primary)",
  technical: "var(--color-info)",
  content: "var(--color-success)",
  aiVisibility: "var(--color-warning)",
  structure: "var(--color-info)",
  metadata: "var(--color-primary)",
  readability: "var(--color-success)",
  images: "var(--color-warning)",
  links: "var(--color-info)",
  social: "var(--color-primary)",
  schema: "var(--color-warning)",
};

const DISTRIBUTION_KEYS = [
  { key: "overall", label: "Overall" },
  { key: "technical", label: "Technical" },
  { key: "content", label: "Content" },
  { key: "aiVisibility", label: "AI Visibility" },
  { key: "readability", label: "Readability" },
  { key: "structure", label: "Structure" },
  { key: "metadata", label: "Metadata" },
  { key: "links", label: "Links" },
  { key: "images", label: "Images" },
  { key: "social", label: "Social" },
  { key: "schema", label: "Schema" },
];

export function SiteOverview({ result }: Props) {
  const { averageScores, pagesSucceeded, pages, crawlDurationMs, status, scoreDistribution } = result;

  const avgForRadar = {
    technical: averageScores.technical ?? 0,
    content: averageScores.content ?? 0,
    aiVisibility: averageScores.aiVisibility ?? 0,
    structure: averageScores.structure ?? 0,
    metadata: averageScores.metadata ?? 0,
    readability: averageScores.readability ?? 0,
    images: averageScores.images ?? 0,
    links: averageScores.links ?? 0,
    social: averageScores.social ?? 0,
    schema: averageScores.schema ?? 0,
  };

  const duration =
    crawlDurationMs > 1000 ? `${(crawlDurationMs / 1000).toFixed(0)}s` : `${crawlDurationMs}ms`;

  const fetchedCount = pages.filter((p) => p.status === "fetched").length;
  const errorCount = pages.filter((p) => p.status === "error").length;
  const skippedCount = pages.filter((p) => p.status === "skipped").length;

  const statusSlices = [
    { label: "Fetched", value: fetchedCount, color: "var(--color-success)" },
    { label: "Error", value: errorCount, color: "var(--color-destructive)" },
    { label: "Skipped", value: skippedCount, color: "var(--color-warning)" },
  ].filter((s) => s.value > 0);

  const buckets = [0, 20, 40, 60, 80];
  const scoreHistogram = useMemo(() => {
    const counts = buckets.map(() => 0);
    for (const p of pages) {
      const score = p.result?.scores.overall ?? 0;
      for (let i = buckets.length - 1; i >= 0; i--) {
        if (score >= buckets[i]) {
          counts[i]++;
          break;
        }
      }
    }
    return buckets.map((b, i) => ({
      range: `${b}${i < buckets.length - 1 ? `–${buckets[i + 1] - 1}` : "+"}`,
      count: counts[i],
    }));
  }, [pages]);

  const maxHistCount = Math.max(...scoreHistogram.map((d) => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass px-2 py-6 sm:p-6"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold">Site Overview</h3>
          <p className="truncate text-sm text-muted-foreground">
            {result.startUrl} · <AnimatedCounter value={pagesSucceeded} /> page
            {pagesSucceeded !== 1 ? "s" : ""} analyzed
          </p>
        </div>
        <span
          className={`self-start rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            status === "complete"
              ? "border-success/40 bg-success/10 text-success"
              : "border-warning/40 bg-warning/10 text-warning"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="h-64 overflow-x-hidden">
            <ScoreRadar scores={avgForRadar} />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Overall SEO" value={averageScores.overall ?? 0} color={SCORE_COLORS.overall} />
            <StatCard label="Content" value={averageScores.content ?? 0} color={SCORE_COLORS.content} />
            <StatCard label="Technical" value={averageScores.technical ?? 0} color={SCORE_COLORS.technical} />
            <StatCard
              label="AI Visibility"
              value={averageScores.aiVisibility ?? 0}
              color={SCORE_COLORS.aiVisibility}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg border border-glass-border bg-card/30 p-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                <AnimatedCounter value={pagesSucceeded} />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Analyzed
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                <AnimatedCounter value={errorCount} />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Failed
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{duration}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Duration
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                <AnimatedCounter value={result.allDiscoveredUrls.length} />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Links found
              </div>
            </div>
          </div>

          {/* Status donut + score histogram */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-lg border border-glass-border bg-card/30 p-4">
              {statusSlices.length > 0 && (
                <>
                  <DonutChart slices={statusSlices} size={80} innerRadius={20} outerRadius={36} />
                  <DonutLegend slices={statusSlices} />
                </>
              )}
            </div>

            <div className="rounded-lg border border-glass-border bg-card/30 p-4">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Score distribution
              </div>
              <div className="h-16 overflow-x-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreHistogram} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis
                      dataKey="range"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide domain={[0, maxHistCount]} />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]} animationDuration={1000}>
                      {scoreHistogram.map((entry, i) => (
                        <Cell
                          key={entry.range}
                          fill={
                            i >= 4
                              ? "var(--color-success)"
                              : i >= 3
                                ? "var(--color-info)"
                                : i >= 2
                                  ? "var(--color-warning)"
                                  : "var(--color-destructive)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Depth distribution + status codes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <DepthChart pages={pages} />
            <StatusCodeChart pages={pages} />
          </div>

          <div className="flex flex-wrap gap-2">
            {result.hasRobotsTxt && <Badge label="robots.txt" color="var(--color-success)" />}
            {!result.hasRobotsTxt && <Badge label="No robots.txt" color="var(--color-warning)" />}
            {result.hasSitemap && (
              <Badge label={`Sitemap (${result.sitemapUrlCount} URLs)`} color="var(--color-success)" />
            )}
            {result.disallowedPaths.length > 0 && (
              <Badge
                label={`${result.disallowedPaths.length} paths disallowed`}
                color="var(--color-info)"
              />
            )}
          </div>

          {scoreDistribution && (
            <div className="rounded-lg border border-glass-border bg-card/30 p-4">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Score distribution stats
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-glass-border text-muted-foreground">
                      <th className="py-1 pr-2 text-left font-medium">Category</th>
                      <th className="py-1 px-2 text-right font-medium">Min</th>
                      <th className="py-1 px-2 text-right font-medium">Avg</th>
                      <th className="py-1 px-2 text-right font-medium">Med</th>
                      <th className="py-1 pl-2 text-right font-medium">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DISTRIBUTION_KEYS.map(({ key, label }) => {
                      const d = scoreDistribution[key];
                      if (!d) return null;
                      const color = SCORE_COLORS[key] || "var(--foreground)";
                      return (
                        <tr key={key} className="border-b border-glass-border/50">
                          <td className="py-1 pr-2 text-left text-muted-foreground" style={{ color }}>{label}</td>
                          <td className="py-1 px-2 text-right text-foreground">{d.min}</td>
                          <td className="py-1 px-2 text-right font-medium text-foreground">{Math.round(d.avg)}</td>
                          <td className="py-1 px-2 text-right text-foreground">{Math.round(d.median)}</td>
                          <td className="py-1 pl-2 text-right font-medium text-foreground">{d.max}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DepthChart({ pages }: { pages: CrawlResult["pages"] }) {
  const depthMap = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const p of pages) {
      counts[p.depth] = (counts[p.depth] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([depth, count]) => ({ depth: `d=${depth}`, count }))
      .sort((a, b) => a.depth.localeCompare(b.depth));
  }, [pages]);

  const maxCount = Math.max(...depthMap.map((d) => d.count), 1);

  if (depthMap.length === 0) return null;

  return (
    <div className="rounded-lg border border-glass-border bg-card/30 p-4">
      <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        Crawl depth distribution
      </div>
      <div className="h-16 overflow-x-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={depthMap} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="depth"
              tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, maxCount]} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]} animationDuration={1000}>
              {depthMap.map((entry, i) => (
                <Cell
                  key={entry.depth}
                  fill={
                    i === 0
                      ? "var(--color-success)"
                      : i === 1
                        ? "var(--color-info)"
                        : "var(--color-warning)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatusCodeChart({ pages }: { pages: CrawlResult["pages"] }) {
  const codeData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of pages) {
      if (p.statusCode) {
        const code = p.statusCode.toString();
        counts[code] = (counts[code] || 0) + 1;
      } else {
        const key = p.status;
        counts[key] = (counts[key] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [pages]);

  const maxCount = Math.max(...codeData.map((d) => d.count), 1);

  if (codeData.length === 0) return null;

  return (
    <div className="rounded-lg border border-glass-border bg-card/30 p-4">
      <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        HTTP status codes
      </div>
      <div className="h-16 overflow-x-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={codeData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="code"
              tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, maxCount]} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]} animationDuration={1000}>
              {codeData.map((entry) => {
                const code = parseInt(entry.code);
                const fill =
                  code >= 200 && code < 300
                    ? "var(--color-success)"
                    : code >= 300 && code < 400
                      ? "var(--color-info)"
                      : code >= 400
                        ? "var(--color-destructive)"
                        : "var(--color-warning)";
                return <Cell key={entry.code} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-lg border border-glass-border bg-card/30 p-3 text-center">
      <div
        className="font-display text-2xl font-semibold"
        style={{ color: color || "var(--foreground)" }}
      >
        <AnimatedCounter value={value} />
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium"
      style={{ borderColor: color, color }}
    >
      {label}
    </span>
  );
}
