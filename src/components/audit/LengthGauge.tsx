import { motion } from "framer-motion";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  idealMin: number;
  idealMax: number;
  unit?: string;
}

export function LengthGauge({ label, value, min, max, idealMin, idealMax, unit = "" }: Props) {
  const total = max - min;
  const pct = total > 0 ? ((value - min) / total) * 100 : 0;
  const idealPctMin = total > 0 ? ((idealMin - min) / total) * 100 : 0;
  const idealPctMax = total > 0 ? ((idealMax - min) / total) * 100 : 0;

  const inRange = value >= idealMin && value <= idealMax;
  const color = inRange ? "var(--color-success)" : "var(--color-warning)";

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">
          {value}{unit}
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="absolute top-0 h-full rounded-full bg-success/20"
          initial={{ left: 0, width: 0 }}
          animate={{ left: `${idealPctMin}%`, width: `${idealPctMax - idealPctMin}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="mt-0.5 flex justify-between text-[9px] text-muted-foreground">
        <span>{min}</span>
        <span className={inRange ? "text-success" : "text-warning"}>
          {inRange ? "Ideal range" : `Target: ${idealMin}${unit}–${idealMax}${unit}`}
        </span>
        <span>{max}</span>
      </div>
    </div>
  );
}
