import { motion } from "framer-motion";

interface Props {
  pagesRequested: number;
  pagesSucceeded: number;
  pagesFailed: number;
  maxPages: number;
}

export function CrawlProgress({ pagesRequested, pagesSucceeded, pagesFailed, maxPages }: Props) {
  const total = pagesRequested + pagesFailed;
  const pct = Math.min(100, Math.round((total / maxPages) * 100));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass mx-auto max-w-2xl space-y-4 p-6 text-center"
    >
      <div className="flex items-center justify-center gap-3">
        <svg className="h-5 w-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="3"
          />
          <path
            d="M22 12a10 10 0 0 0-10-10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-lg font-semibold">Auditing your site...</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          style={{ boxShadow: "0 0 10px var(--color-primary)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm sm:gap-x-6">
        <div>
          <span className="font-medium text-foreground">{pagesSucceeded}</span>
          <span className="ml-1 text-muted-foreground">analyzed</span>
        </div>
        {pagesFailed > 0 && (
          <div>
            <span className="font-medium text-destructive">{pagesFailed}</span>
            <span className="ml-1 text-muted-foreground">failed</span>
          </div>
        )}
        <div>
          <span className="font-medium text-foreground">
            {Math.max(0, maxPages - pagesRequested - pagesFailed)}
          </span>
          <span className="ml-1 text-muted-foreground">remaining</span>
        </div>
      </div>
    </motion.div>
  );
}
