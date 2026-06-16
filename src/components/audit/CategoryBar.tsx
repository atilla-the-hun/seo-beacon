import { motion } from "framer-motion";

interface BarItem {
  label: string;
  value: number;
  color: string;
}

export function CategoryBar({ items }: { items: BarItem[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);

  if (items.every((i) => i.value === 0)) {
    return <div className="text-xs text-muted-foreground">No issues</div>;
  }

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={item.label}>
            <div className="mb-0.5 flex justify-between text-xs">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
