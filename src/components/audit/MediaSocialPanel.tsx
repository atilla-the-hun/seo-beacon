import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import type { AnalyzeResult } from "@/lib/seo-analyzer";
import { DonutChart, DonutLegend } from "./DonutChart";
import { GaugeChart } from "./GaugeChart";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  metadata: AnalyzeResult["metadata"];
}

export function MediaSocialPanel({ metadata }: Props) {
  const {
    imageCount,
    imagesMissingAlt,
    imagesWithAlt,
    imagesWithDescriptiveAlt,
    imagesWithGenericAlt,
    imagesWithSrcset,
    imagesWithLazyLoading,
    imageFormats,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    ogUrl,
    hasOpenGraph,
    twitterCard,
    twitterSite,
    twitterCreator,
    hasTwitterCard,
    videoCount,
  } = metadata;

  const ogComplete = ogTitle && ogDescription && ogImage;
  const ogScore = [ogTitle, ogDescription, ogImage].filter(Boolean).length;

  const formatData = imageFormats.map((fmt) => ({ format: fmt, count: 1 }));
  const hasModern = imageFormats.includes("webp") || imageFormats.includes("avif");

  const socialTags = [
    { label: "og:title", present: !!ogTitle },
    { label: "og:description", present: !!ogDescription },
    { label: "og:image", present: !!ogImage },
    { label: "og:type", present: !!ogType },
    { label: "og:url", present: !!ogUrl },
    { label: "twitter:card", present: !!twitterCard },
    { label: "twitter:site", present: !!twitterSite },
    { label: "twitter:creator", present: !!twitterCreator },
  ];

  const altSlices = [
    {
      label: "Descriptive alt",
      value: imagesWithDescriptiveAlt,
      color: "var(--color-success)",
    },
    { label: "Generic alt", value: imagesWithGenericAlt, color: "var(--color-warning)" },
    { label: "Missing alt", value: imagesMissingAlt, color: "var(--color-destructive)" },
  ].filter((s) => s.value > 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {/* Image Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Image Analysis</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          {imageCount === 0
            ? "No images found on this page."
            : `${imageCount} image(s) — ${imagesWithAlt} with alt text, ${imagesMissingAlt} without.`}
        </p>
        {imageCount > 0 && (
          <>
            {altSlices.length > 0 && (
              <div className="mb-4 grid grid-cols-[auto_1fr] gap-4">
                <DonutChart slices={altSlices} size={100} innerRadius={26} outerRadius={46} />
                <DonutLegend slices={altSlices} />
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-glass-border py-1.5">
                <span className="text-muted-foreground">Total images</span>
                <span className="font-medium text-foreground">
                  <AnimatedCounter value={imageCount} />
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-glass-border py-1.5">
                <span className="text-muted-foreground">With alt text</span>
                <span className="font-medium text-foreground">
                  <AnimatedCounter value={imagesWithAlt} />
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-glass-border py-1.5">
                <span className="text-muted-foreground">Descriptive alt</span>
                <span className="font-medium text-foreground">
                  <AnimatedCounter value={imagesWithDescriptiveAlt} />
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-glass-border py-1.5">
                <span className="text-muted-foreground">Generic/file-name alt</span>
                <span className="font-medium text-foreground">
                  <AnimatedCounter value={imagesWithGenericAlt} />
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-glass-border py-1.5">
                <span className="text-muted-foreground">Missing alt</span>
                <span className="font-medium text-foreground">
                  <AnimatedCounter value={imagesMissingAlt} />
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-glass-border py-1.5">
                <span className="text-muted-foreground">With srcset (responsive)</span>
                <span className="font-medium text-foreground">
                  <AnimatedCounter value={imagesWithSrcset} />
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-glass-border py-1.5">
                <span className="text-muted-foreground">Lazy loaded</span>
                <span className="font-medium text-foreground">
                  <AnimatedCounter value={imagesWithLazyLoading} />
                </span>
              </div>
            </div>

            {imageFormats.length > 0 && (
              <div className="mt-3">
                <div className="mb-1.5 flex flex-wrap gap-1">
                  {imageFormats.map((fmt) => (
                    <span
                      key={fmt}
                      className="rounded-full border border-glass-border bg-card/30 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      .{fmt}
                    </span>
                  ))}
                  {!hasModern && (
                    <span className="text-[10px] text-warning">
                      Consider next-gen formats (WebP/AVIF)
                    </span>
                  )}
                </div>
                <div className="h-16 overflow-x-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <XAxis
                        dataKey="format"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide domain={[0, 1]} />
                      <Bar dataKey="count" radius={[3, 3, 0, 0]} animationDuration={800}>
                        {formatData.map((entry) => (
                          <Cell
                            key={entry.format}
                            fill={
                              entry.format === "webp" || entry.format === "avif"
                                ? "var(--color-success)"
                                : "var(--color-info)"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Social Preview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Social & Rich Previews</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Open Graph {hasOpenGraph ? "✓" : "✗"} · Twitter Card {hasTwitterCard ? "✓" : "✗"}
        </p>

        {hasOpenGraph || hasTwitterCard ? (
          <div className="mb-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Social tag completeness
            </div>
            <div className="space-y-1">
              {socialTags.map((tag) => (
                <div key={tag.label} className="flex items-center gap-2 text-xs">
                  <span
                    className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                      tag.present ? "bg-success shadow-[0_0_6px_var(--color-success)]" : "bg-muted"
                    }`}
                  />
                  <span className={tag.present ? "text-foreground" : "text-muted-foreground"}>
                    {tag.label}
                  </span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {tag.present ? "✓" : "✗"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {hasOpenGraph && (
          <div className="mb-4 flex justify-center">
            <GaugeChart
              value={ogScore}
              max={3}
              color="var(--color-info)"
              label="OG tags present"
              size={100}
            />
          </div>
        )}

        {hasOpenGraph && (
          <div className="mb-4 rounded-lg border border-glass-border bg-card/20 p-3">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Open Graph
            </div>
            <div className="space-y-1 text-xs">
              {ogTitle && (
                <div className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">title:</span>
                  <span className="truncate text-foreground">{ogTitle}</span>
                </div>
              )}
              {ogDescription && (
                <div className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">desc:</span>
                  <span className="truncate text-foreground">{ogDescription}</span>
                </div>
              )}
              {ogImage && (
                <div className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">image:</span>
                  <span className="truncate text-foreground">{ogImage}</span>
                </div>
              )}
              {ogType && (
                <div className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">type:</span>
                  <span className="text-foreground">{ogType}</span>
                </div>
              )}
              {ogUrl && (
                <div className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">url:</span>
                  <span className="truncate text-foreground">{ogUrl}</span>
                </div>
              )}
            </div>
            {!ogComplete && (
              <div className="mt-2 text-[10px] text-warning">
                Missing: {!ogTitle ? "og:title " : ""}
                {!ogDescription ? "og:description " : ""}
                {!ogImage ? "og:image " : ""}
              </div>
            )}
          </div>
        )}

        {hasTwitterCard && (
          <div className="rounded-lg border border-glass-border bg-card/20 p-3">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Twitter Card
            </div>
            <div className="space-y-1 text-xs">
              {twitterCard && (
                <div className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">card:</span>
                  <span className="text-foreground">{twitterCard}</span>
                </div>
              )}
              {twitterSite && (
                <div className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">site:</span>
                  <span className="text-foreground">{twitterSite}</span>
                </div>
              )}
              {twitterCreator && (
                <div className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">creator:</span>
                  <span className="text-foreground">{twitterCreator}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {!hasOpenGraph && !hasTwitterCard && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            No social sharing tags detected. Add Open Graph and Twitter Card meta tags for rich link
            previews.
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className={`inline-block h-2 w-2 rounded-full ${videoCount > 0 ? "bg-success" : "bg-muted"}`} />
          <span className="text-muted-foreground">Video content:</span>
          <span className="font-medium text-foreground">
            {videoCount > 0 ? `${videoCount} video element(s) found` : "None detected"}
          </span>
        </div>
      </motion.div>

      {/* Image optimization composite gauge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Image Optimization Score</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Composite score based on alt text coverage, responsive images, lazy loading, and modern formats.
        </p>
        {(() => {
          const altPct = imageCount > 0 ? (imagesWithAlt / imageCount) * 100 : 0;
          const srcsetPct = imageCount > 0 ? (imagesWithSrcset / imageCount) * 100 : 0;
          const lazyPct = imageCount > 0 ? (imagesWithLazyLoading / imageCount) * 100 : 0;
          const hasModernFormat = imageFormats.some((f) => /webp|avif/i.test(f));
          const modernFormatScore = hasModernFormat ? 100 : 0;
          const composite = Math.round((altPct * 0.3 + srcsetPct * 0.25 + lazyPct * 0.25 + modernFormatScore * 0.2));

          return (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4">
                <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="oklch(0.3 0 0)" strokeWidth="5" />
                  <motion.circle
                    cx="36" cy="36" r="30"
                    fill="none" stroke={composite >= 70 ? "oklch(0.7 0.2 160)" : composite >= 40 ? "oklch(0.72 0.2 80)" : "oklch(0.7 0.25 25)"}
                    strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${(composite / 100) * 188.5} 188.5`}
                    transform="rotate(-90 36 36)"
                    initial={{ strokeDasharray: "0 188.5" }}
                    animate={{ strokeDasharray: `${(composite / 100) * 188.5} 188.5` }}
                    transition={{ duration: 1 }}
                  />
                  <text x="36" y="36" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="16" fontWeight="600">
                    {composite}
                  </text>
                </svg>
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between gap-4">
                    <span>Alt text</span>
                    <span className="font-medium text-foreground">{Math.round(altPct)}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Srcset</span>
                    <span className="font-medium text-foreground">{Math.round(srcsetPct)}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Lazy loading</span>
                    <span className="font-medium text-foreground">{Math.round(lazyPct)}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Modern formats</span>
                    <span className="font-medium text-foreground">{hasModernFormat ? "✓" : "✗"}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-xs">Alt text coverage</div>
                  <div className="h-2 w-full max-w-24 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "oklch(0.7 0.2 200)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${altPct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-xs">Responsive images</div>
                  <div className="h-2 w-full max-w-24 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "oklch(0.68 0.18 160)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${srcsetPct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-xs">Lazy loading</div>
                  <div className="h-2 w-full max-w-24 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "oklch(0.72 0.16 250)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${lazyPct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-xs">Modern formats</div>
                  <div className="h-2 w-full max-w-24 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "oklch(0.66 0.2 330)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${modernFormatScore}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </motion.div>
    </div>
  );
}
