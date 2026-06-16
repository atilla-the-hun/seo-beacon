import { useMemo } from "react";
import { motion } from "framer-motion";
import { DonutChart } from "./DonutChart";
import type { SeoIssue } from "@/lib/seo-analyzer";

interface Props {
  issues: SeoIssue[];
}

const CATEGORY_COLORS: Record<string, string> = {
  technical: "oklch(0.68 0.18 250)",
  content: "oklch(0.7 0.2 160)",
  structure: "oklch(0.72 0.16 280)",
  social: "oklch(0.66 0.2 330)",
  schema: "oklch(0.64 0.18 200)",
  links: "oklch(0.68 0.15 30)",
  images: "oklch(0.65 0.2 140)",
  readability: "oklch(0.7 0.15 50)",
  metadata: "oklch(0.67 0.17 220)",
  ai: "oklch(0.7 0.2 300)",
};

const SEVERITY_LABELS: Record<string, string> = {
  high: "Critical",
  medium: "Important",
  low: "Quick Win",
};

const SEVERITY_COLORS: Record<string, string> = {
  high: "oklch(0.7 0.25 25)",
  medium: "oklch(0.68 0.2 80)",
  low: "oklch(0.65 0.2 150)",
};

export function RecommendationsPanel({ issues }: Props) {
  const critical = useMemo(() => issues.filter((i) => i.severity === "high"), [issues]);
  const important = useMemo(() => issues.filter((i) => i.severity === "medium"), [issues]);
  const quickWins = useMemo(() => issues.filter((i) => i.severity === "low"), [issues]);

  const total = issues.length;
  const fixed = 0; // all issues start unfixed; user would mark them done in a real app

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const i of issues) {
      counts[i.category] = (counts[i.category] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [issues]);

  const severityDonut = [
    { label: "Critical", value: critical.length, color: SEVERITY_COLORS.high },
    { label: "Important", value: important.length, color: SEVERITY_COLORS.medium },
    { label: "Quick Win", value: quickWins.length, color: SEVERITY_COLORS.low },
  ].filter((d) => d.value > 0);

  return (
    <div className="glass p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
        <h3 className="font-display text-xl font-semibold">Recommendations</h3>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Prioritized action plan to improve your AI-ready SEO score.
      </p>

      {/* Progress + Severity donut */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-glass-border bg-card/40 p-4">
          <h4 className="mb-2 font-display text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Overall Progress
          </h4>
          <div className="flex items-center gap-4">
            <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
              <circle cx="36" cy="36" r="30" fill="none" stroke="oklch(0.3 0 0)" strokeWidth="6" />
              <motion.circle
                cx="36" cy="36" r="30"
                fill="none" stroke="oklch(0.7 0.2 160)"
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${total > 0 ? (fixed / total) * 188.5 : 0} 188.5`}
                transform="rotate(-90 36 36)"
                initial={{ strokeDasharray: "0 188.5" }}
                animate={{ strokeDasharray: `${total > 0 ? (fixed / total) * 188.5 : 0} 188.5` }}
                transition={{ duration: 1 }}
              />
              <text x="36" y="36" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="14" fontWeight="600">
                {total > 0 ? Math.round((fixed / total) * 100) : 0}%
              </text>
            </svg>
            <div className="text-xs text-muted-foreground">
              <div>{fixed} of {total} issues addressed</div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "oklch(0.7 0.2 160)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${total > 0 ? (fixed / total) * 100 : 0}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-glass-border bg-card/40 p-4">
          <h4 className="mb-2 font-display text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Severity Breakdown
          </h4>
          <div className="flex items-center gap-4">
            {severityDonut.length > 0 && <DonutChart slices={severityDonut} size={72} />}
            <div className="space-y-1 text-xs">
              {severityDonut.map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="truncate">{d.label}</span>
                  <span className="font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mb-6 rounded-xl border border-glass-border bg-card/40 p-4">
        <h4 className="mb-3 font-display text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Issues by Category
        </h4>
        <div className="space-y-2">
          {categoryCounts.map((c) => {
            const pct = total > 0 ? (c.count / total) * 100 : 0;
            return (
              <div key={c.category}>
                <div className="flex justify-between text-xs">
                  <span className="capitalize">{c.category}</span>
                  <span className="text-muted-foreground">{c.count}</span>
                </div>
                <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: CATEGORY_COLORS[c.category] ?? "oklch(0.5 0 0)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority sections */}
      <div className="space-y-6">
        {([critical, important, quickWins] as const).map((group, gi) => {
          if (group.length === 0) return null;
          const severity = gi === 0 ? "high" : gi === 1 ? "medium" : "low";
          const label = SEVERITY_LABELS[severity];
          const color = SEVERITY_COLORS[severity];
          return (
            <div key={severity}>
              <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-medium">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                {label}
                <span className="text-xs text-muted-foreground">({group.length})</span>
              </h4>
              <div className="space-y-2">
                {group.map((issue, ii) => (
                  <motion.div
                    key={`${issue.category}-${ii}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ii * 0.03 }}
                    className="rounded-lg border border-glass-border bg-card/30 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{issue.issue}</span>
                          <span
                            className="shrink-0 rounded px-1.5 py-0.5 text-[10px] capitalize"
                            style={{ background: `${CATEGORY_COLORS[issue.category]}20`, color: CATEGORY_COLORS[issue.category] }}
                          >
                            {issue.category}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{issue.fix}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
