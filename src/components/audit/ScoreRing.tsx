import { motion } from "framer-motion";

interface Props {
  label: string;
  value: number;
  accent?: "primary" | "success" | "warning" | "danger" | "info";
  size?: number;
}

const colorFor = (v: number, accent?: Props["accent"]) => {
  if (accent === "primary") return "var(--color-primary)";
  if (accent === "info") return "var(--color-info)";
  if (accent === "success") return "var(--color-success)";
  if (accent === "warning") return "var(--color-warning)";
  if (accent === "danger") return "var(--color-destructive)";
  if (v >= 80) return "var(--color-success)";
  if (v >= 60) return "var(--color-info)";
  if (v >= 40) return "var(--color-warning)";
  return "var(--color-destructive)";
};

export function ScoreRing({ label, value, accent, size = 132 }: Props) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = colorFor(value, accent);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--color-border)"
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ strokeDasharray: c }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display text-2xl font-semibold sm:text-3xl"
            style={{ color }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {value}
          </motion.span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-medium text-foreground/90">{label}</span>
    </div>
  );
}
