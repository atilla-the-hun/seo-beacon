import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import type { AnalyzeResult } from "@/lib/seo-analyzer";
import { DonutChart, DonutLegend } from "./DonutChart";
import { GaugeChart } from "./GaugeChart";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  metadata: AnalyzeResult["metadata"];
}

export function ContentQualityPanel({ metadata }: Props) {
  const {
    fleschReadingEase,
    fleschGradeLevel,
    avgWordsPerSentence,
    complexWordPercentage,
    wordCount,
    sentenceCount,
    longSentenceCount,
    shortSentenceCount,
    paragraphCount,
    avgParagraphLength,
    bulletListCount,
    numberedListCount,
    tableCount,
    blockquoteCount,
    codeBlockCount,
    boldCount,
    iframeCount,
    topKeywords,
    capitalizedPhrases,
    datedEntities,
    entityCount,
    hasDefinitionIntro,
    hasConclusionSection,
    hasTableOfContents,
    numberedStepsCount,
    questionHeadings,
    readingTime,
    contentToHtmlRatio,
    allHeadingTexts,
    nGrams,
    freshnessDays,
    publishDate,
  } = metadata;

  const freLabel =
    fleschReadingEase >= 80
      ? "Very Easy"
      : fleschReadingEase >= 60
        ? "Easy"
        : fleschReadingEase >= 40
          ? "Moderate"
          : fleschReadingEase >= 20
            ? "Difficult"
            : "Very Difficult";
  const freColor =
    fleschReadingEase >= 80
      ? "var(--color-success)"
      : fleschReadingEase >= 60
        ? "var(--color-info)"
        : fleschReadingEase >= 40
          ? "var(--color-warning)"
          : "var(--color-destructive)";

  const mediumSentenceCount = Math.max(0, sentenceCount - shortSentenceCount - longSentenceCount);

  const sentenceSlices = [
    { label: `Short (<8w)`, value: shortSentenceCount, color: "var(--color-info)" },
    { label: `Medium`, value: mediumSentenceCount, color: "var(--color-primary)" },
    { label: `Long (>30w)`, value: longSentenceCount, color: "var(--color-warning)" },
  ];

  const keywordData = topKeywords.slice(0, 10).map((kw) => ({
    word: kw.word,
    count: kw.count,
  }));
  const maxKwCount = keywordData.length > 0 ? Math.max(...keywordData.map((d) => d.count)) : 1;

  const bigramData = nGrams.bigrams.slice(0, 8).map((n) => ({
    text: n.text.length > 18 ? n.text.slice(0, 17) + "…" : n.text,
    count: n.count,
  }));
  const maxBigramCount = bigramData.length > 0 ? Math.max(...bigramData.map((d) => d.count)) : 1;

  const structureSlices = [
    { label: "Lists", value: bulletListCount + numberedListCount, color: "var(--color-info)" },
    { label: "Tables", value: tableCount, color: "var(--color-primary)" },
    { label: "Blockquotes", value: blockquoteCount, color: "var(--color-warning)" },
    { label: "Code blocks", value: codeBlockCount, color: "var(--color-success)" },
    { label: "Embeds", value: iframeCount, color: "var(--color-destructive)" },
  ].filter((s) => s.value > 0);

  const freshnessColor =
    freshnessDays === null
      ? "var(--muted-foreground)"
      : freshnessDays <= 90
        ? "var(--color-success)"
        : freshnessDays <= 365
          ? "var(--color-warning)"
          : "var(--color-destructive)";
  const freshnessLabel =
    freshnessDays === null
      ? "Unknown"
      : freshnessDays <= 90
        ? "Fresh"
        : freshnessDays <= 365
          ? "Aging"
          : "Stale";

  const Stat = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-baseline justify-between gap-3 border-b border-glass-border py-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {/* Readability & Language */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Readability & Language</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Flesch Reading Ease: {fleschReadingEase}/100 — {freLabel}
        </p>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{ background: freColor, boxShadow: `0 0 8px ${freColor}` }}
            initial={{ width: 0 }}
            animate={{ width: `${fleschReadingEase}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <Stat label="Flesch-Kincaid Grade" value={fleschGradeLevel} />
        <Stat label="Word count" value={<AnimatedCounter value={wordCount} />} />
        <Stat label="Reading time" value={`${readingTime} min`} />
        <Stat label="Sentences" value={<AnimatedCounter value={sentenceCount} />} />
        <Stat label="Avg words/sentence" value={avgWordsPerSentence} />
        <Stat label="Complex words (3+ syll)" value={`${complexWordPercentage}%`} />
        <Stat label="Paragraphs" value={<AnimatedCounter value={paragraphCount} />} />
        <Stat label="Avg paragraph length" value={`${Math.round(avgParagraphLength)} words`} />
        <Stat label="Content / HTML ratio" value={`${contentToHtmlRatio}%`} />

        <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
          <DonutChart slices={sentenceSlices} size={100} innerRadius={26} outerRadius={46} />
          <DonutLegend slices={sentenceSlices} />
        </div>
      </motion.div>

      {/* Content Structure & Heading Texts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Content Structure</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Formatting elements and snippet-readiness signals.
        </p>

        <div className="mb-4 grid grid-cols-[auto_1fr] gap-4">
          <GaugeChart
            value={readingTime}
            max={30}
            color={readingTime <= 10 ? "var(--color-success)" : readingTime <= 20 ? "var(--color-warning)" : "var(--color-destructive)"}
            label="Min read"
            size={80}
          />
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: freshnessColor }} />
              <span className="text-muted-foreground">Freshness:</span>
              <span className="font-medium text-foreground" style={{ color: freshnessColor }}>{freshnessLabel}</span>
              {freshnessDays !== null && <span className="text-muted-foreground">({freshnessDays}d)</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-success" />
              <span className="text-muted-foreground">Content ratio:</span>
              <span className="font-medium text-foreground">{contentToHtmlRatio}%</span>
            </div>
            {publishDate && (
              <div className="text-muted-foreground">Published: {publishDate}</div>
            )}
          </div>
        </div>

        <Stat label="Bullet lists" value={bulletListCount} />
        <Stat label="Numbered lists" value={numberedListCount} />
        <Stat label="Tables" value={tableCount} />
        <Stat label="Blockquotes" value={blockquoteCount} />
        <Stat label="Code blocks" value={codeBlockCount} />
        <Stat label="Bold/strong usage" value={boldCount} />
        <Stat label="Iframe embeds" value={iframeCount} />
        <Stat label="Numbered steps found" value={numberedStepsCount} />

        {structureSlices.length > 0 && (
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
            <DonutChart slices={structureSlices} size={100} innerRadius={26} outerRadius={46} />
            <DonutLegend slices={structureSlices} />
          </div>
        )}

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className={`inline-block h-2 w-2 rounded-full ${hasDefinitionIntro ? "bg-success" : "bg-muted"}`} />
            <span>Definition intro {hasDefinitionIntro ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`inline-block h-2 w-2 rounded-full ${hasConclusionSection ? "bg-success" : "bg-muted"}`} />
            <span>Conclusion/summary {hasConclusionSection ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`inline-block h-2 w-2 rounded-full ${hasTableOfContents ? "bg-success" : "bg-muted"}`} />
            <span>Table of contents {hasTableOfContents ? "✓" : "✗"}</span>
          </div>
        </div>

        {allHeadingTexts.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              All headings ({allHeadingTexts.length})
            </div>
            <div className="space-y-1">
              {allHeadingTexts.slice(0, 10).map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="truncate rounded border border-glass-border bg-card/20 px-2.5 py-1 text-[11px] text-foreground"
                >
                  {h}
                </motion.div>
              ))}
              {allHeadingTexts.length > 10 && (
                <div className="text-[10px] text-muted-foreground">+{allHeadingTexts.length - 10} more</div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Top Keywords + N-grams */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Keywords & Phrases</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Top keywords, bigrams, and trigrams from your content.
        </p>

        {keywordData.length > 0 ? (
          <div className="h-44 overflow-x-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={keywordData}
                layout="vertical"
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              >
                <XAxis type="number" hide domain={[0, maxKwCount]} />
                <YAxis
                  type="category"
                  dataKey="word"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} animationDuration={1000}>
                  {keywordData.map((entry, i) => (
                    <Cell
                      key={entry.word}
                      fill={`var(--color-${i < 3 ? "primary" : i < 6 ? "info" : "muted-foreground"})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Not enough content to extract keywords.</span>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {topKeywords.slice(0, 15).map((kw, i) => (
            <motion.span
              key={kw.word}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-card/40 px-3 py-1 text-xs"
            >
              <span className="font-medium text-foreground">{kw.word}</span>
              <span className="text-muted-foreground">×{kw.count}</span>
            </motion.span>
          ))}
        </div>

        {bigramData.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Top bigrams
            </div>
            <div className="flex flex-wrap gap-1.5">
              {bigramData.map((n, i) => (
                <span
                  key={n.text}
                  className="rounded-md border border-glass-border bg-card/30 px-2 py-0.5 text-[10px] text-foreground"
                >
                  "{n.text}" ×{n.count}
                </span>
              ))}
            </div>
          </div>
        )}

        {nGrams.trigrams.length > 0 && (
          <div className="mt-3">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Top trigrams
            </div>
            <div className="flex flex-wrap gap-1.5">
              {nGrams.trigrams.slice(0, 6).map((n, i) => (
                <span
                  key={n.text}
                  className="rounded-md border border-glass-border bg-card/30 px-2 py-0.5 text-[10px] text-foreground"
                >
                  "{n.text}" ×{n.count}
                </span>
              ))}
            </div>
          </div>
        )}

        {questionHeadings.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Question-style headings
            </div>
            <div className="space-y-1">
              {questionHeadings.slice(0, 5).map((q, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-glass-border bg-card/20 px-3 py-1.5 text-xs text-foreground"
                >
                  "{q}"
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Entities & Dates */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Entities & Dates</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Recognized named entities (<AnimatedCounter value={entityCount} /> found) and date
          references.
        </p>
        {entityCount > 0 && (
          <div className="mb-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Capitalized phrases
            </div>
            <div className="flex flex-wrap gap-1.5">
              {capitalizedPhrases.slice(0, 15).map((p, i) => (
                <span
                  key={i}
                  className="rounded-md border border-glass-border bg-card/30 px-2 py-0.5 text-[11px] text-foreground"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
        {datedEntities.length > 0 && (
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Dates found</div>
            <div className="flex flex-wrap gap-1.5">
              {datedEntities.slice(0, 8).map((d, i) => (
                <span
                  key={i}
                  className="rounded-md border border-glass-border bg-card/30 px-2 py-0.5 text-[11px] text-foreground"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
        {entityCount === 0 && datedEntities.length === 0 && (
          <span className="text-xs text-muted-foreground">No clear entities or dates detected.</span>
        )}
      </motion.div>

      {/* Content formatting signals */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Content Formatting Signals</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Formatting elements that help AI engines parse and extract content structure.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Bold / Strong", count: boldCount, color: "oklch(0.7 0.18 50)" },
            { label: "Code Blocks", count: codeBlockCount, color: "oklch(0.65 0.15 280)" },
            { label: "Iframe Embeds", count: iframeCount, color: "oklch(0.66 0.16 200)" },
            { label: "Numbered Steps", count: numberedStepsCount, color: "oklch(0.7 0.2 160)" },
            { label: "Blockquotes", count: blockquoteCount, color: "oklch(0.68 0.14 30)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg border border-glass-border bg-card/30 p-3">
              <div className="flex-1 text-xs">{item.label}</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-full max-w-20 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: item.color, width: `${Math.min(100, item.count * 10)}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, item.count * 10)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ color: item.color }}>
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Entity richness tri-gauge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Entity Richness</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Named entities, capitalized phrases, and date references add depth for AI understanding.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="oklch(0.3 0 0)" strokeWidth="4" />
                <motion.circle
                  cx="32" cy="32" r="26"
                  fill="none" stroke="oklch(0.7 0.2 200)" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${Math.min(100, entityCount * 4) / 100 * 163.36} 163.36`}
                  transform="rotate(-90 32 32)"
                  initial={{ strokeDasharray: "0 163.36" }}
                  animate={{ strokeDasharray: `${Math.min(100, entityCount * 4) / 100 * 163.36} 163.36` }}
                  transition={{ duration: 1 }}
                />
                <text x="32" y="32" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="11" fontWeight="600">
                  {entityCount}
                </text>
              </svg>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Entities</div>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="oklch(0.3 0 0)" strokeWidth="4" />
                <motion.circle
                  cx="32" cy="32" r="26"
                  fill="none" stroke="oklch(0.72 0.18 160)" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${Math.min(100, capitalizedPhrases.length * 5) / 100 * 163.36} 163.36`}
                  transform="rotate(-90 32 32)"
                  initial={{ strokeDasharray: "0 163.36" }}
                  animate={{ strokeDasharray: `${Math.min(100, capitalizedPhrases.length * 5) / 100 * 163.36} 163.36` }}
                  transition={{ duration: 1 }}
                />
                <text x="32" y="32" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="11" fontWeight="600">
                  {capitalizedPhrases.length}
                </text>
              </svg>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Phrases</div>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="oklch(0.3 0 0)" strokeWidth="4" />
                <motion.circle
                  cx="32" cy="32" r="26"
                  fill="none" stroke="oklch(0.68 0.16 50)" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${Math.min(100, datedEntities.length * 10) / 100 * 163.36} 163.36`}
                  transform="rotate(-90 32 32)"
                  initial={{ strokeDasharray: "0 163.36" }}
                  animate={{ strokeDasharray: `${Math.min(100, datedEntities.length * 10) / 100 * 163.36} 163.36` }}
                  transition={{ duration: 1 }}
                />
                <text x="32" y="32" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="11" fontWeight="600">
                  {datedEntities.length}
                </text>
              </svg>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Dates</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
