import { motion } from "framer-motion";
import { ScoreRing } from "./ScoreRing";

interface Props {
  scores: {
    overall: number;
    technical: number;
    content: number;
    aiVisibility: number;
    structure: number;
    metadata: number;
    readability: number;
    images: number;
    links: number;
    social: number;
    schema: number;
  };
}

const CATEGORIES: { key: keyof Props["scores"]; label: string; accent?: "primary" | "success" | "warning" | "danger" | "info" }[] = [
  { key: "technical", label: "Technical", accent: "info" },
  { key: "content", label: "Content", accent: "success" },
  { key: "aiVisibility", label: "AI Visibility", accent: "warning" },
  { key: "readability", label: "Readability", accent: "success" },
  { key: "structure", label: "Structure", accent: "info" },
  { key: "metadata", label: "Metadata", accent: "primary" },
  { key: "links", label: "Links", accent: "info" },
  { key: "images", label: "Images", accent: "warning" },
  { key: "social", label: "Social", accent: "primary" },
  { key: "schema", label: "Schema", accent: "warning" },
];

export function ScoreGrid({ scores }: Props) {
  return (
    <div className="space-y-8">
      {/* Hero overall score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto flex max-w-sm flex-col items-center"
        style={{ perspective: "800px" }}
      >
        <div style={{ transform: "rotateX(3deg) translateZ(20px)", transformStyle: "preserve-3d" }}>
          <ScoreRing label="Overall SEO" value={scores.overall} accent="primary" size={160} />
        </div>
      </motion.div>

      {/* Category scores */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className="flex flex-col items-center"
          >
            <ScoreRing
              label={cat.label}
              value={scores[cat.key]}
              accent={cat.accent}
              size={100}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}