import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onStart: (config: { url: string; maxPages: number; maxDepth: number }) => void;
  loading: boolean;
}

export function CrawlForm({ onStart, loading }: Props) {
  const [url, setUrl] = useState("");
  const [maxPages, setMaxPages] = useState(30);
  const [maxDepth, setMaxDepth] = useState(3);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    onStart({ url: url.trim(), maxPages, maxDepth });
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass mx-auto max-w-2xl space-y-5 p-6"
    >
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Website URL
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          inputMode="url"
          autoComplete="url"
          className="w-full rounded-lg border border-glass-border bg-background/50 px-4 py-3 text-base outline-none transition focus:border-primary/60 placeholder:text-muted-foreground"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Max pages: {maxPages}
          </label>
          <input
            type="range"
            min={3}
            max={30}
            value={maxPages}
            onChange={(e) => setMaxPages(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>3</span>
            <span>15</span>
            <span>30</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Max depth: {maxDepth}
          </label>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>0 (page only)</span>
            <span>1</span>
            <span>2</span>
            <span>3 (deep)</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-info/20 bg-info/5 px-4 py-3 text-xs text-info">
        Respects robots.txt · max 30 pages · ~15-25s for a full site
      </div>

      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="relative flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        {loading ? "Auditing..." : "Audit Entire Site"}
      </button>
      <p className="-mt-[15px] text-center text-[10px] text-muted-foreground">
        No signup, no database, no tracking. Everything runs in your browser.
      </p>
    </motion.form>
  );
}
