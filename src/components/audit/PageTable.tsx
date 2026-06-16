import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CrawlResult, CrawlPageResult } from "@/lib/crawler";

interface Props {
  result: CrawlResult;
}

type SortKey = "url" | "score" | "words" | "depth" | "status";
type SortDir = "asc" | "desc";

export function PageTable({ result }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const sorted = useMemo(() => {
    const items = result.pages.filter((p) => {
      if (filter === "all") return true;
      return p.status === filter;
    });
    return [...items].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "url") cmp = a.url.localeCompare(b.url);
      else if (sortKey === "score")
        cmp = (a.result?.scores.overall ?? 0) - (b.result?.scores.overall ?? 0);
      else if (sortKey === "words")
        cmp = (a.result?.metadata.wordCount ?? 0) - (b.result?.metadata.wordCount ?? 0);
      else if (sortKey === "depth") cmp = a.depth - b.depth;
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [result.pages, sortKey, sortDir, filter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <span className="ml-1 text-muted-foreground opacity-30">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold">Pages ({sorted.length})</h3>
          <p className="text-sm text-muted-foreground">
            {result.pagesSucceeded} analyzed · {result.pagesFailed} failed · click a row for details
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-glass-border bg-card/40 px-3 py-1.5 text-xs text-foreground outline-none"
        >
          <option value="all">All</option>
          <option value="fetched">Fetched</option>
          <option value="error">Errors</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-glass-border text-muted-foreground">
              <th
                className="cursor-pointer py-2 pr-2 font-medium hover:text-foreground"
                onClick={() => toggleSort("url")}
              >
                URL <SortIcon k="url" />
              </th>
              <th
                className="cursor-pointer py-2 px-2 font-medium hover:text-foreground"
                onClick={() => toggleSort("score")}
              >
                Score <SortIcon k="score" />
              </th>
              <th
                className="hidden sm:table-cell cursor-pointer py-2 px-2 font-medium hover:text-foreground"
                onClick={() => toggleSort("words")}
              >
                Words <SortIcon k="words" />
              </th>
              <th
                className="hidden sm:table-cell cursor-pointer py-2 px-2 font-medium hover:text-foreground"
                onClick={() => toggleSort("depth")}
              >
                Depth <SortIcon k="depth" />
              </th>
              <th
                className="cursor-pointer py-2 pl-2 font-medium hover:text-foreground"
                onClick={() => toggleSort("status")}
              >
                Status <SortIcon k="status" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((page, i) => (
              <PageRow
                key={page.url}
                page={page}
                expanded={expanded === page.url}
                onToggle={() => setExpanded(expanded === page.url ? null : page.url)}
                index={i}
              />
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No pages match the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function PageRow({
  page,
  expanded,
  onToggle,
  index,
}: {
  page: CrawlPageResult;
  expanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const score = page.result?.scores.overall ?? null;
  const scoreColor =
    score !== null
      ? score >= 80
        ? "var(--color-success)"
        : score >= 60
          ? "var(--color-info)"
          : score >= 40
            ? "var(--color-warning)"
            : "var(--color-destructive)"
      : "var(--muted-foreground)";

  const statusColor =
    page.status === "fetched"
      ? "var(--color-success)"
      : page.status === "error"
        ? "var(--color-destructive)"
        : "var(--color-warning)";

  const m = page.result?.metadata;

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.02 }}
        onClick={onToggle}
        className="cursor-pointer border-b border-glass-border transition hover:bg-card/30"
      >
        <td className="max-w-[160px] truncate py-2.5 pr-2 text-foreground sm:max-w-[280px]" title={page.url}>
          {page.url}
        </td>
        <td className="px-2 py-2.5">
          {score !== null ? (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full shadow-[0_0_6px_currentColor]"
                style={{ background: scoreColor, color: scoreColor }}
              />
              <span className="text-sm font-medium text-foreground">{score}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
        <td className="hidden sm:table-cell px-2 py-2.5 text-muted-foreground">
          {m?.wordCount?.toLocaleString() ?? "—"}
        </td>
        <td className="hidden sm:table-cell px-2 py-2.5 text-muted-foreground">{page.depth}</td>
        <td className="py-2.5 pl-2">
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: statusColor }}
            />
            {page.statusCode || page.status}
          </span>
        </td>
      </motion.tr>
      <AnimatePresence>
        {expanded && page.result && (
          <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <td colSpan={5} className="bg-card/20 p-4">
              <div className="grid gap-3 text-xs sm:grid-cols-3">
                <div>
                  <div className="font-semibold text-foreground">
                    {page.result.metadata.title || "(no title)"}
                  </div>
                  <div className="mt-0.5 text-muted-foreground">
                    {page.result.metadata.description?.slice(0, 120) || "(no description)"}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Scores</div>
                  <div className="mt-0.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {Object.entries(page.result.scores).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-muted-foreground">
                        <span>{k}</span>
                        <span className="font-medium text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Issues</div>
                  <div className="mt-0.5">
                    {page.result.issues.length === 0 ? (
                      <span className="text-success">None</span>
                    ) : (
                      <ul className="list-inside list-disc text-muted-foreground">
                        {page.result.issues.slice(0, 5).map((iss, j) => (
                          <li key={j} className="truncate">
                            {iss.issue}
                          </li>
                        ))}
                        {page.result.issues.length > 5 && (
                          <li className="text-muted-foreground">
                            +{page.result.issues.length - 5} more
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}
