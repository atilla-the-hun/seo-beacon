import { motion } from "framer-motion";
import { DonutChart } from "./DonutChart";
import { GaugeChart } from "./GaugeChart";

interface Props {
  metadata: {
    hasFaq: boolean;
    headingsAsQuestions: number;
    questionHeadings: string[];
    hasDefinitionIntro: boolean;
    hasConclusionSection: boolean;
    hasTableOfContents: boolean;
    numberedStepsCount: number;
    bulletListCount: number;
    numberedListCount: number;
    tableCount: number;
    blockquoteCount: number;
    totalLists: number;
  };
}

export function SnippetSignalsPanel({ metadata }: Props) {
  const snippetScore = [
    metadata.hasFaq ? 15 : 0,
    metadata.headingsAsQuestions > 0 ? 12 : 0,
    metadata.hasDefinitionIntro ? 12 : 0,
    metadata.hasConclusionSection ? 12 : 0,
    metadata.hasTableOfContents ? 12 : 0,
    metadata.numberedStepsCount > 0 ? 10 : 0,
    metadata.bulletListCount > 0 ? 9 : 0,
    metadata.numberedListCount > 0 ? 9 : 0,
    metadata.tableCount > 0 ? 9 : 0,
  ].reduce((a, b) => a + b, 0);

  const structureItems = [
    { label: "Definition/Intro", ok: metadata.hasDefinitionIntro },
    { label: "Conclusion Section", ok: metadata.hasConclusionSection },
    { label: "Table of Contents", ok: metadata.hasTableOfContents },
  ];

  const contentItems = [
    { label: "Bullet Lists", count: metadata.bulletListCount },
    { label: "Numbered Lists", count: metadata.numberedListCount },
    { label: "Tables", count: metadata.tableCount },
    { label: "Blockquotes", count: metadata.blockquoteCount },
  ];

  return (
    <div className="glass p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
        <h3 className="font-display text-xl font-semibold">Snippet & Extraction Signals</h3>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Content features that help AI engines extract answers for featured snippets and direct responses.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* FAQ + Question headings gauge */}
        <div className="rounded-xl border border-glass-border bg-card/40 p-4">
          <h4 className="mb-3 font-display text-sm font-medium">Q&A Readiness</h4>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <GaugeChart value={snippetScore} max={100} label="Snippet Score" size={80} color="oklch(0.7 0.2 200)" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={metadata.hasFaq ? "text-green-400" : "text-red-400"}>
                  {metadata.hasFaq ? "✓" : "✗"}
                </span>
                <span>FAQ Schema detected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={metadata.headingsAsQuestions > 0 ? "text-green-400" : "text-yellow-400"}>
                  {metadata.headingsAsQuestions > 0 ? "✓" : "—"}
                </span>
                <span>{metadata.headingsAsQuestions} question-formatted heading(s)</span>
              </div>
              {metadata.questionHeadings.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {metadata.questionHeadings.slice(0, 5).map((q, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Structure scorecard */}
        <div className="rounded-xl border border-glass-border bg-card/40 p-4">
          <h4 className="mb-3 font-display text-sm font-medium">Structured Content</h4>
          <div className="space-y-3">
            {structureItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className={item.ok ? "text-green-400" : "text-muted-foreground"}>
                  {item.ok ? "✓" : "✗"}
                </span>
                <div className="flex-1 text-xs">{item.label}</div>
                <div className="h-2 w-[40px] overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: item.ok ? "oklch(0.7 0.2 150)" : "oklch(0.3 0 0)" }}
                    initial={{ width: 0 }}
                    animate={{ width: item.ok ? "100%" : "50%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 border-t border-glass-border pt-2">
              <span className={metadata.numberedStepsCount > 0 ? "text-green-400" : "text-yellow-400"}>
                {metadata.numberedStepsCount > 0 ? "✓" : "—"}
              </span>
              <span className="text-xs">
                {metadata.numberedStepsCount} numbered step{metadata.numberedStepsCount !== 1 ? "s" : ""} detected
              </span>
            </div>
          </div>
        </div>

        {/* Lists & tables donut */}
        <div className="rounded-xl border border-glass-border bg-card/40 p-4">
          <h4 className="mb-3 font-display text-sm font-medium">Lists & Tables</h4>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <DonutChart
                slices={contentItems.map((c, i) => ({
                  label: c.label,
                  value: c.count,
                  color: ["oklch(0.7 0.18 200)", "oklch(0.68 0.16 160)", "oklch(0.66 0.2 250)", "oklch(0.64 0.14 30)"][i] ?? "oklch(0.5 0 0)",
                }))}
                size={96}
              />
            </div>
            <div className="space-y-1 text-xs">
              {contentItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="truncate text-muted-foreground">{item.label}</span>
                  <div className="h-1.5 w-full max-w-[60px] overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.count > 0 ? "oklch(0.65 0.15 200)" : "oklch(0.3 0 0)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, item.count * 17)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Snippet extraction score breakdown */}
        <div className="rounded-xl border border-glass-border bg-card/40 p-4">
          <h4 className="mb-3 font-display text-sm font-medium">Extraction Readiness</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>FAQ Schema</span>
              <span className={metadata.hasFaq ? "text-green-400" : "text-muted-foreground"}>
                {metadata.hasFaq ? "+15" : "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Question Headings</span>
              <span className={metadata.headingsAsQuestions > 0 ? "text-green-400" : "text-muted-foreground"}>
                {metadata.headingsAsQuestions > 0 ? "+12" : "0"}
              </span>
            </div>
            {structureItems.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span className={item.ok ? "text-green-400" : "text-muted-foreground"}>
                  {item.ok ? "+12" : "0"}
                </span>
              </div>
            ))}
            <div className="flex justify-between">
              <span>Numbered Steps</span>
              <span className={metadata.numberedStepsCount > 0 ? "text-green-400" : "text-muted-foreground"}>
                {metadata.numberedStepsCount > 0 ? "+10" : "0"}
              </span>
            </div>
            <div className="border-t border-glass-border pt-1 font-medium">
              <div className="flex justify-between">
                <span>Total Snippet Score</span>
                <span>{snippetScore}/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
