import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";

interface Factor {
  name: string;
  value: number;
  max: number;
}

interface EngineDetail {
  score: number;
  factors: Factor[];
}

interface Props {
  engineDetails: Record<string, EngineDetail>;
}

const ENGINE_META: { key: string; name: string; tagline: string; description: string; color: string }[] = [
  { key: "chatgpt", name: "ChatGPT", tagline: "Conversational answers", description: "OpenAI's conversational AI — prioritizes readability, clear structure, and semantic HTML for answer extraction.", color: "oklch(0.78 0.16 160)" },
  { key: "gemini", name: "Gemini", tagline: "Multimodal grounding", description: "Google's multimodal AI — values schema markup, technical health, images, and structured data for rich responses.", color: "oklch(0.74 0.16 240)" },
  { key: "perplexity", name: "Perplexity", tagline: "Cited answer engine", description: "Real-time answer engine with citations — favors Q&A content, fresh dates, authoritative sources, and extractable answers.", color: "oklch(0.74 0.18 200)" },
  { key: "claude", name: "Claude", tagline: "Long-form reasoning", description: "Anthropic's reasoning model — values readability, deep content, semantic structure, and code/documentation clarity.", color: "oklch(0.78 0.15 50)" },
  { key: "grok", name: "Grok", tagline: "Real-time intelligence", description: "xAI's real-time model — prioritizes freshness, technical depth, code blocks, and recent content.", color: "oklch(0.72 0.18 30)" },
  { key: "deepseek", name: "DeepSeek", tagline: "Reasoning & code", description: "DeepSeek's reasoning engine — rewards clear structure, schema, code blocks, tables, and technical documentation.", color: "oklch(0.7 0.15 280)" },
  { key: "kimi", name: "Kimi", tagline: "Long-context analysis", description: "Moonshot AI's long-context model — prefers in-depth content, definitions, conclusions, and comprehensive coverage.", color: "oklch(0.75 0.14 330)" },
  { key: "copilot", name: "Copilot", tagline: "Web-integrated AI", description: "Microsoft's AI assistant — values clear metadata, authoritative sources, schema, and factual authorship signals.", color: "oklch(0.72 0.12 220)" },
  { key: "mistral", name: "Mistral", tagline: "Multilingual AI", description: "Mistral AI's Le Chat — prioritizes multilingual readiness, hreflang tags, concise structure, and clear language signals.", color: "oklch(0.73 0.14 180)" },
  { key: "you", name: "You.com", tagline: "Customizable AI search", description: "You.com's customizable engine — values code, source diversity, external links, and technical depth.", color: "oklch(0.71 0.16 140)" },
  { key: "braveLeo", name: "Brave Leo", tagline: "Privacy-first AI", description: "Brave's on-device AI — favors accessible content, semantic HTML, well-formed documents, and no-JS-dependent pages.", color: "oklch(0.69 0.12 30)" },
  { key: "qwen", name: "Qwen", tagline: "Multilingual Asian AI", description: "Alibaba's Qwen — values multilingual content, long-form docs, schema, hreflang, and entity-rich text.", color: "oklch(0.74 0.14 10)" },
];

export function AiEnginesPanel({ engineDetails }: Props) {
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);

  const engines = ENGINE_META.map((meta) => ({
    ...meta,
    detail: engineDetails[meta.key] ?? { score: 0, factors: [] },
  }));

  const chartData = engines.map((e) => ({ name: e.name, score: e.detail.score }));

  return (
    <div className="glass p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
        <h3 className="font-display text-xl font-semibold">AI Search Readiness</h3>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        How well your page is positioned to be surfaced as an answer by today's leading AI engines.
      </p>

      {/* AI Search Landscape */}
      <div className="mb-8 rounded-xl border border-glass-border bg-card/30 p-5">
        <h4 className="mb-2 font-display text-base font-medium">AI Search Landscape</h4>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          AI-powered search is transforming how users discover information. Unlike traditional search
          engines that return ranked links, AI engines read, reason, and synthesize answers directly
          from your content. Each engine has unique preferences — from Perplexity's focus on cited
          facts to Gemini's reliance on structured data and schema markup. Optimizing for AI search
          means making your content extractable, authoritative, and semantically rich across
          dimensions like readability, structure, freshness, and machine-readable metadata.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          {engines.map((e) => (
            <div key={e.key} className="flex items-center gap-1.5 rounded-md bg-card/40 px-2 py-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.color }} />
              <span className="text-muted-foreground">{e.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Engine cards */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {engines.map((e, i) => {
          const v = e.detail.score;
          const topFactor = e.detail.factors.length > 0
            ? e.detail.factors.reduce((a, b) => (a.value > b.value ? a : b))
            : null;
          return (
            <motion.button
              key={e.key}
              onClick={() => setSelectedEngine(selectedEngine === e.key ? null : e.key)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="w-full rounded-xl border border-glass-border bg-card/40 p-4 text-left transition-all hover:bg-card/60"
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="font-display text-base font-medium">{e.name}</div>
                  <div className="text-[11px] text-muted-foreground">{e.tagline}</div>
                </div>
                <div className="font-display text-xl font-semibold" style={{ color: e.color }}>
                  {v}
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: e.color, boxShadow: `0 0 10px ${e.color}` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${v}%` }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.04, ease: "easeOut" }}
                />
              </div>
              {topFactor && (
                <div className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Top: {topFactor.name} ({Math.round(topFactor.value)})
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* All-engine comparison bar chart */}
      <div className="mt-6">
        <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
          All-engine comparison
        </div>
        <div className="h-48 overflow-x-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, 100]} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} animationDuration={1200}>
                {engines.map((e) => (
                  <Cell key={e.key} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-engine factor breakdown */}
      <AnimatePresence mode="wait">
        {selectedEngine && (() => {
          const engine = engines.find((e) => e.key === selectedEngine)!;
          return (
            <motion.div
              key={selectedEngine}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 overflow-hidden rounded-xl border border-glass-border bg-card/30 p-5"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: engine.color }} />
                <h4 className="font-display text-base font-medium">
                  {engine.name} — Factor Breakdown
                </h4>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                {engine.description}
              </p>
              <div className="space-y-2">
                {engine.detail.factors.map((f) => {
                  const pct = f.max > 0 ? (f.value / f.max) * 100 : 0;
                  return (
                    <div key={f.name}>
                      <div className="mb-0.5 flex justify-between text-xs">
                        <span>{f.name}</span>
                        <span className="text-muted-foreground">
                          {Math.round(f.value)}/{f.max}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: engine.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
