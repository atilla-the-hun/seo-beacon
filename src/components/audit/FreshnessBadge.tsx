import { motion } from "framer-motion";

interface Props {
  days: number | null;
  publishDate: string;
}

export function FreshnessBadge({ days, publishDate }: Props) {
  if (days === null) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-glass-border bg-card/30 px-3 py-2 text-xs text-muted-foreground">
        <span className="inline-block h-2 w-2 rounded-full bg-muted" />
        No publish date
      </div>
    );
  }

  const isFresh = days <= 90;
  const isAging = days <= 365;
  const color = isFresh ? "var(--color-success)" : isAging ? "var(--color-warning)" : "var(--color-destructive)";
  const label = isFresh ? "Fresh" : isAging ? "Aging" : "Stale";
  const detail = isFresh
    ? `Published ${days}d ago — recent`
    : isAging
      ? `${days}d old — review soon`
      : `${days}d old — consider updating`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
      style={{ borderColor: `${color}40`, background: `${color}10`, color }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span className="font-medium">{label}</span>
      <span className="opacity-80">— {detail}</span>
      <span className="ml-auto opacity-60">{publishDate}</span>
    </motion.div>
  );
}
