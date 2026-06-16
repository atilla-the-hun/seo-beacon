import { motion } from "framer-motion";

interface Props {
  scores: {
    technical: number;
    content: number;
    metadata: number;
    aiVisibility: number;
    structure: number;
    readability: number;
    images: number;
    links: number;
    social: number;
    schema: number;
    overall: number;
  };
}

const WEIGHTS: { key: keyof Props["scores"]; label: string; weight: number; color: string }[] = [
  { key: "technical", label: "Technical", weight: 0.15, color: "oklch(0.68 0.18 250)" },
  { key: "content", label: "Content", weight: 0.2, color: "oklch(0.7 0.2 160)" },
  { key: "metadata", label: "Metadata", weight: 0.1, color: "oklch(0.72 0.16 280)" },
  { key: "aiVisibility", label: "AI Visibility", weight: 0.1, color: "oklch(0.66 0.2 330)" },
  { key: "structure", label: "Structure", weight: 0.1, color: "oklch(0.64 0.18 200)" },
  { key: "readability", label: "Readability", weight: 0.1, color: "oklch(0.68 0.15 30)" },
  { key: "images", label: "Images", weight: 0.08, color: "oklch(0.65 0.2 140)" },
  { key: "links", label: "Links", weight: 0.07, color: "oklch(0.7 0.15 50)" },
  { key: "social", label: "Social", weight: 0.05, color: "oklch(0.67 0.17 220)" },
  { key: "schema", label: "Schema", weight: 0.05, color: "oklch(0.7 0.2 300)" },
];

export function ScoreWaterfall({ scores }: Props) {
  const items = WEIGHTS.map((w) => {
    const raw = scores[w.key] * w.weight;
    return { ...w, raw, pct: scores[w.key] };
  }).sort((a, b) => b.raw - a.raw);

  const maxRaw = Math.max(...items.map((i) => i.raw), 20);

  return (
    <div className="glass p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
        <h3 className="font-display text-xl font-semibold">Score Composition</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        How each dimension contributes to the overall score ({scores.overall}/100).
      </p>
      <div className="space-y-2">
        {items.map((item, i) => {
          const barWidth = (item.raw / maxRaw) * 100;
          return (
            <div key={item.key}>
              <div className="mb-0.5 flex justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                  {item.label}
                  <span className="text-muted-foreground">({item.weight * 100}%)</span>
                </span>
                <span className="text-muted-foreground">
                  {item.pct} × {item.weight} = <span className="font-medium text-foreground">{item.raw.toFixed(1)}</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 border-t border-glass-border pt-3 text-right text-xs text-muted-foreground">
        Sum of weighted contributions ={" "}
        <span className="font-semibold text-foreground">
          {items.reduce((s, i) => s + i.raw, 0).toFixed(1)}
        </span>
        /100
      </div>
    </div>
  );
}
