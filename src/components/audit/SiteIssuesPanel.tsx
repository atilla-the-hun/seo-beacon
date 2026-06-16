import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CrawlResult } from "@/lib/crawler";
import { DonutChart, DonutLegend } from "./DonutChart";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  result: CrawlResult;
}

type Tab = "duplicates" | "missing" | "thin" | "noindex" | "broken";

export function SiteIssuesPanel({ result }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("duplicates");

  const tabs: { key: Tab; label: string; count: number; color: string }[] = [
    {
      key: "duplicates",
      label: "Duplicate Titles",
      count: result.duplicateTitles.length,
      color: "var(--color-warning)",
    },
    {
      key: "missing",
      label: "Missing Metadata",
      count: result.missingTitles.length + result.missingDescriptions.length,
      color: "var(--color-destructive)",
    },
    {
      key: "thin",
      label: "Thin Content",
      count: result.thinContentPages.length,
      color: "var(--color-warning)",
    },
    {
      key: "noindex",
      label: "Noindex Pages",
      count: result.noindexPages.length,
      color: "var(--color-info)",
    },
    {
      key: "broken",
      label: "Broken Links",
      count: result.brokenInternalLinks.length,
      color: "var(--color-destructive)",
    },
  ];

  const issueSlices = tabs.map((t) => ({
    label: t.label,
    value: t.count,
    color: t.color,
  }));

  const totalIssues = issueSlices.reduce((s, sl) => s + sl.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6"
    >
      <h3 className="mb-1 font-display text-xl font-semibold">Site-Wide Issues</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Cross-page problems that need attention.
      </p>

      {totalIssues > 0 && (
        <div className="mb-4 flex items-center gap-6 rounded-lg border border-glass-border bg-card/30 p-4">
          <DonutChart slices={issueSlices} size={80} innerRadius={20} outerRadius={36} />
          <div>
            <div className="font-display text-lg font-semibold text-foreground">
              <AnimatedCounter value={totalIssues} /> total
            </div>
            <DonutLegend slices={issueSlices} />
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
              activeTab === t.key
                ? "bg-primary/10 border-primary/40 text-primary"
                : "border-glass-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: t.color }}
            />
            {t.label}
            <span className="ml-0.5 opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {activeTab === "duplicates" && <DuplicateIssues result={result} />}
          {activeTab === "missing" && <MissingMetadata result={result} />}
          {activeTab === "thin" && <ThinContent result={result} />}
          {activeTab === "noindex" && <NoindexPages result={result} />}
          {activeTab === "broken" && <BrokenLinks result={result} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function DuplicateIssues({ result }: { result: CrawlResult }) {
  if (result.duplicateTitles.length === 0 && result.duplicateDescriptions.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-success">
        No duplicate titles or descriptions found.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {result.duplicateTitles.map((d, i) => (
        <IssueGroup key={`t-${i}`} label={`Title: "${d.value}"`} urls={d.urls} />
      ))}
      {result.duplicateDescriptions.map((d, i) => (
        <IssueGroup
          key={`d-${i}`}
          label={`Description: "${d.value.slice(0, 80)}…"`}
          urls={d.urls}
        />
      ))}
    </div>
  );
}

function MissingMetadata({ result }: { result: CrawlResult }) {
  if (result.missingTitles.length === 0 && result.missingDescriptions.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-success">
        All pages have titles and descriptions.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {result.missingTitles.length > 0 && (
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-destructive">
            Missing title ({result.missingTitles.length})
          </div>
          {result.missingTitles.map((u) => (
            <UrlLine key={u} url={u} />
          ))}
        </div>
      )}
      {result.missingDescriptions.length > 0 && (
        <div>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-destructive">
            Missing description ({result.missingDescriptions.length})
          </div>
          {result.missingDescriptions.map((u) => (
            <UrlLine key={u} url={u} />
          ))}
        </div>
      )}
    </div>
  );
}

function ThinContent({ result }: { result: CrawlResult }) {
  if (result.thinContentPages.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-success">No thin content pages found.</div>
    );
  }
  return (
    <div className="space-y-2">
      {result.thinContentPages
        .sort((a, b) => a.wordCount - b.wordCount)
        .map((p) => (
          <div
            key={p.url}
            className="flex items-center justify-between rounded-lg border border-glass-border bg-card/20 px-4 py-2"
          >
            <span className="max-w-[70%] truncate text-xs text-foreground">{p.url}</span>
            <span className="text-xs text-warning">{p.wordCount} words</span>
          </div>
        ))}
    </div>
  );
}

function NoindexPages({ result }: { result: CrawlResult }) {
  if (result.noindexPages.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-success">No pages are set to noindex.</div>
    );
  }
  return (
    <div className="space-y-2">
      {result.noindexPages.map((u) => (
        <UrlLine key={u} url={u} />
      ))}
    </div>
  );
}

function BrokenLinks({ result }: { result: CrawlResult }) {
  if (result.brokenInternalLinks.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-success">
        No broken internal links detected.
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {result.brokenInternalLinks.map((b, i) => (
        <div
          key={i}
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-destructive">HTTP {b.statusCode}</span>
            <span className="truncate text-foreground">{b.to}</span>
          </div>
          <div className="mt-0.5 text-muted-foreground">
            Linked from: <span className="truncate">{b.from}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function IssueGroup({ label, urls }: { label: string; urls: string[] }) {
  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs">
      <div className="mb-2 font-medium text-foreground">{label}</div>
      <div className="space-y-1">
        {urls.map((u) => (
          <div key={u} className="truncate text-muted-foreground">
            {u}
          </div>
        ))}
      </div>
    </div>
  );
}

function UrlLine({ url }: { url: string }) {
  return (
    <div className="truncate rounded-lg border border-glass-border bg-card/20 px-4 py-2 text-xs text-foreground">
      {url}
    </div>
  );
}
