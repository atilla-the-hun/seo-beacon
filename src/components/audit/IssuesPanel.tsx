import { useMemo } from "react";
import { motion } from "framer-motion";
import type { SeoIssue } from "@/lib/seo-analyzer";
import { DonutChart, DonutLegend } from "./DonutChart";
import { CategoryBar } from "./CategoryBar";
import { AnimatedCounter } from "./AnimatedCounter";

const sevStyles: Record<SeoIssue["severity"], { label: string; cls: string; dot: string }> = {
  high: {
    label: "Critical",
    cls: "border-destructive/40 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  medium: {
    label: "Warning",
    cls: "border-warning/40 bg-warning/10 text-warning",
    dot: "bg-warning",
  },
  low: {
    label: "Suggestion",
    cls: "border-info/40 bg-info/10 text-info",
    dot: "bg-info",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  technical: "var(--color-info)",
  content: "var(--color-success)",
  structure: "var(--color-primary)",
  social: "var(--color-warning)",
  schema: "var(--color-destructive)",
  links: "var(--color-info)",
  images: "var(--color-warning)",
  readability: "var(--color-success)",
  metadata: "var(--color-primary)",
  ai: "var(--color-destructive)",
};

const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical",
  content: "Content",
  structure: "Structure",
  social: "Social",
  schema: "Schema",
  links: "Links",
  images: "Images",
  readability: "Readability",
  metadata: "Metadata",
  ai: "AI",
};

export function IssuesPanel({ issues }: { issues: SeoIssue[] }) {
  const highCount = issues.filter((i) => i.severity === "high").length;
  const medCount = issues.filter((i) => i.severity === "medium").length;
  const lowCount = issues.filter((i) => i.severity === "low").length;

  const severitySlices = [
    { label: "Critical", value: highCount, color: "var(--color-destructive)" },
    { label: "Warning", value: medCount, color: "var(--color-warning)" },
    { label: "Suggestion", value: lowCount, color: "var(--color-info)" },
  ].filter((s) => s.value > 0);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const iss of issues) {
      counts[iss.category] = (counts[iss.category] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([cat, count]) => ({
        label: CATEGORY_LABELS[cat] || cat,
        value: count,
        color: CATEGORY_COLORS[cat] || "var(--muted-foreground)",
      }))
      .sort((a, b) => b.value - a.value);
  }, [issues]);

  if (issues.length === 0) {
    return (
      <div className="glass p-6 text-center text-muted-foreground">
        No issues detected. Your page looks great.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-6">
            <DonutChart slices={severitySlices} size={80} innerRadius={20} outerRadius={36} />
            <div>
              <div className="font-display text-lg font-semibold text-foreground">
                <AnimatedCounter value={issues.length} /> issue{issues.length !== 1 ? "s" : ""}
              </div>
              <DonutLegend slices={severitySlices} />
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              By category
            </div>
            <CategoryBar items={categoryCounts} />
          </div>
        </div>
      </div>

      {issues.map((iss, i) => {
        const s = sevStyles[iss.severity];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${s.dot} shadow-[0_0_10px_currentColor]`}
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.cls}`}
                  >
                    {s.label}
                  </span>
                  <h4 className="font-medium text-foreground">{iss.issue}</h4>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{iss.fix}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
