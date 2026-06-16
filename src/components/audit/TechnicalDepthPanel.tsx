import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import type { AnalyzeResult, SchemaDetails } from "@/lib/seo-analyzer";
import { DonutChart, DonutLegend } from "./DonutChart";
import { GaugeChart } from "./GaugeChart";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  metadata: AnalyzeResult["metadata"];
}

const RECOMMENDED_SCHEMA_TYPES = [
  "Organization",
  "Person",
  "Article",
  "BlogPosting",
  "BreadcrumbList",
  "FAQPage",
  "HowTo",
  "Product",
  "LocalBusiness",
  "Event",
  "Review",
  "VideoObject",
];

const HEADING_COLORS = [
  "var(--color-destructive)",
  "var(--color-warning)",
  "var(--color-primary)",
  "var(--color-info)",
  "var(--color-success)",
  "var(--color-muted)",
];

export function TechnicalDepthPanel({ metadata }: Props) {
  const {
    hasHeader,
    hasNav,
    hasMain,
    hasArticle,
    hasSection,
    hasAside,
    hasFooter,
    semanticElementCount,
    h1Count,
    h2Count,
    h3Count,
    h4Count,
    h5Count,
    h6Count,
    headingHierarchyStatus,
    hasSchema,
    schemaTypes,
    schemaDetails,
    internalLinks,
    externalLinks,
    nofollowLinks,
    sponsoredLinks,
    ugcLinks,
    totalLinks,
    genericLinkTexts,
    emptyLinkCount,
    pageSize,
    hasCharset,
    charset,
    hasDoctype,
    hasHreflang,
    hreflangTags,
    hasFavicon,
    faviconHref,
    dlCount,
    videoCount,
    hasViewport,
    viewportContent,
    hasCSP,
    hasXUACompatible,
    hasHttpEquivRefresh,
    lang,
    robots,
  } = metadata;

  const semEls = [
    { name: "header", present: hasHeader },
    { name: "nav", present: hasNav },
    { name: "main", present: hasMain },
    { name: "article", present: hasArticle },
    { name: "section", present: hasSection },
    { name: "aside", present: hasAside },
    { name: "footer", present: hasFooter },
  ];

  const hierarchyLabel =
    headingHierarchyStatus === "valid"
      ? "Valid"
      : headingHierarchyStatus === "skipped"
        ? "Levels skipped"
        : headingHierarchyStatus === "multiple_h1"
          ? "Multiple H1"
          : headingHierarchyStatus === "no_h1"
            ? "Missing H1"
            : "Empty";
  const hierarchyColor =
    headingHierarchyStatus === "valid" ? "var(--color-success)" : "var(--color-warning)";

  const pageSizeStr =
    pageSize > 1048576
      ? `${(pageSize / 1048576).toFixed(1)} MB`
      : pageSize > 1024
        ? `${(pageSize / 1024).toFixed(0)} KB`
        : `${pageSize} B`;

  const semPresent = semEls.filter((e) => e.present).length;
  const semMissing = semEls.length - semPresent;
  const semSlices = [
    { label: "Present", value: semPresent, color: "var(--color-success)" },
    { label: "Missing", value: semMissing, color: "var(--color-muted)" },
  ].filter((s) => s.value > 0);

  const headingData = [
    { level: "H1", count: h1Count },
    { level: "H2", count: h2Count },
    { level: "H3", count: h3Count },
    { level: "H4", count: h4Count },
    { level: "H5", count: h5Count },
    { level: "H6", count: h6Count },
  ];
  const maxHeadingCount = Math.max(...headingData.map((d) => d.count), 1);

  const techFlags = [
    { label: "Charset", ok: hasCharset },
    { label: "DOCTYPE", ok: hasDoctype },
    { label: "Viewport", ok: hasViewport },
    { label: "Favicon", ok: hasFavicon },
    { label: "HTML lang", ok: !!lang },
    { label: "CSP", ok: hasCSP },
  ];
  const techOk = techFlags.filter((f) => f.ok).length;
  const techFail = techFlags.length - techOk;

  const linkSlices = [
    { label: "Internal", value: internalLinks, color: "var(--color-info)" },
    { label: "External", value: externalLinks, color: "var(--color-primary)" },
    { label: "Nofollow", value: nofollowLinks, color: "var(--color-warning)" },
    { label: "Sponsored", value: sponsoredLinks, color: "var(--color-destructive)" },
    { label: "UGC", value: ugcLinks, color: "var(--color-success)" },
  ].filter((s) => s.value > 0);

  const headingCounts = [h1Count, h2Count, h3Count, h4Count, h5Count, h6Count];
  const maxHeading = Math.max(...headingCounts, 1);

  const schemaComplete = schemaDetails.filter((s) => s.hasRequiredFields).length;
  const schemaTotal = schemaDetails.length;

  const schemaPresent = new Set(schemaTypes);
  const schemaCoverage = RECOMMENDED_SCHEMA_TYPES.map((type) => ({
    type,
    present: schemaPresent.has(type),
  }));

  const goodLinks = Math.max(0, totalLinks - emptyLinkCount - genericLinkTexts.length);
  const linkQualitySlices = [
    { label: "Good text", value: goodLinks, color: "var(--color-success)" },
    { label: "Generic text", value: genericLinkTexts.length, color: "var(--color-warning)" },
    { label: "Empty text", value: emptyLinkCount, color: "var(--color-destructive)" },
  ].filter((s) => s.value > 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {/* Semantic HTML */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Semantic HTML</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          {semanticElementCount}/7 semantic landmark elements used
        </p>
        <div className="grid grid-cols-2 gap-2">
          {semEls.map((el) => (
            <div
              key={el.name}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                el.present
                  ? "border-success/30 bg-success/5 text-success"
                  : "border-glass-border text-muted-foreground"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${el.present ? "bg-success" : "bg-muted"}`}
              />
              <span className="font-mono">&lt;{el.name}&gt;</span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
          {semSlices.length > 0 && (
            <>
              <DonutChart slices={semSlices} size={80} innerRadius={20} outerRadius={36} />
              <DonutLegend slices={semSlices} />
            </>
          )}
        </div>

        <div className="mt-4">
          <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            Heading hierarchy
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: hierarchyColor }}
            />
            <span className="text-sm text-foreground">{hierarchyLabel}</span>
          </div>
          <div className="flex items-end gap-1.5">
            {headingCounts.map((count, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-sm"
                  style={{
                    background: count > 0 ? "var(--color-primary)" : "var(--glass-border)",
                    opacity: count > 0 ? 0.7 + Math.min(count * 0.1, 0.3) : 0.3,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: Math.max(4, Math.min(60, count * 12)) }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                />
                <span className="text-[10px] text-muted-foreground">H{i + 1}</span>
                <span className="text-[10px] font-medium text-foreground">
                  <AnimatedCounter value={count} delay={i * 0.08} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 h-28 overflow-x-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={headingData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="level"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, maxHeadingCount]} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1000}>
                {headingData.map((entry, i) => (
                  <Cell
                    key={entry.level}
                    fill={entry.count > 0 ? HEADING_COLORS[i] : "var(--glass-border)"}
                    opacity={entry.count > 0 ? 0.8 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
          <DonutChart
            slices={[
              { label: "Pass", value: techOk, color: "var(--color-success)" },
              { label: "Missing", value: techFail, color: "var(--color-destructive)" },
            ].filter((s) => s.value > 0)}
            size={80}
            innerRadius={20}
            outerRadius={36}
          />
          <DonutLegend
            slices={[
              { label: "Tech checks passed", value: techOk, color: "var(--color-success)" },
              { label: "Tech checks missing", value: techFail, color: "var(--color-destructive)" },
            ].filter((s) => s.value > 0)}
          />
        </div>
      </motion.div>

      {/* Schema + Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Structured Data</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          {hasSchema
            ? `${schemaTypes.length} schema type(s) found — ${schemaComplete}/${schemaTotal} with required fields`
            : "No JSON-LD structured data detected."}
        </p>

        {hasSchema && (
          <>
            <div className="mb-4 flex justify-center">
              <GaugeChart
                value={schemaComplete}
                max={schemaTotal}
                color="var(--color-success)"
                label="Complete schemas"
                size={100}
              />
            </div>

            <div className="mb-4">
              <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Schema coverage
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {schemaCoverage.map((sc) => (
                  <div
                    key={sc.type}
                    className={`flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] ${
                      sc.present
                        ? "border-success/30 bg-success/5 text-success"
                        : "border-glass-border text-muted-foreground"
                    }`}
                  >
                    <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${sc.present ? "bg-success" : "bg-muted"}`} />
                    <span className="truncate">{sc.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {hasSchema &&
          schemaDetails.map((s: SchemaDetails, i: number) => (
            <motion.div
              key={s.type + i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="mb-2 rounded-lg border border-glass-border bg-card/30 p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">{s.type}</span>
                <span
                  className={`text-[10px] ${s.hasRequiredFields ? "text-success" : "text-destructive"}`}
                >
                  {s.hasRequiredFields ? "✓ Complete" : `${s.missingRequiredFields.length} missing`}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                {s.fieldCount} fields
                {s.missingRequiredFields.length > 0 && (
                  <span className="text-destructive">
                    {" "}
                    — missing: {s.missingRequiredFields.join(", ")}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        {!hasSchema && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            Adding structured data is critical for AI search visibility. Start with Organization and
            Article schema.
          </div>
        )}
      </motion.div>

      {/* Link Profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Link Profile</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          <AnimatedCounter value={totalLinks} /> total links found.
        </p>

        <div className="mb-4 grid grid-cols-[auto_1fr] gap-4">
          <DonutChart slices={linkSlices} size={100} innerRadius={26} outerRadius={46} />
          <DonutLegend slices={linkSlices} />
        </div>

        <BarRow
          label="Internal"
          value={internalLinks}
          max={Math.max(totalLinks, 1)}
          color="var(--color-info)"
        />
        <BarRow
          label="External"
          value={externalLinks}
          max={Math.max(totalLinks, 1)}
          color="var(--color-primary)"
        />
        <BarRow
          label="nofollow"
          value={nofollowLinks}
          max={Math.max(totalLinks, 1)}
          color="var(--color-warning)"
        />
        <BarRow
          label="sponsored"
          value={sponsoredLinks}
          max={Math.max(totalLinks, 1)}
          color="var(--color-warning)"
        />
        <BarRow
          label="ugc"
          value={ugcLinks}
          max={Math.max(totalLinks, 1)}
          color="var(--color-success)"
        />
        <BarRow
          label="empty text"
          value={emptyLinkCount}
          max={Math.max(totalLinks, 1)}
          color="var(--color-destructive)"
        />

        <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
          <DonutChart slices={linkQualitySlices} size={80} innerRadius={20} outerRadius={36} />
          <DonutLegend slices={linkQualitySlices} />
        </div>

        {genericLinkTexts.length > 0 && (
          <div className="mt-3 text-xs text-muted-foreground">
            Generic link text: "{genericLinkTexts.slice(0, 3).join('", "')}"
          </div>
        )}
      </motion.div>

      {/* Page Details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Page Details</h3>
        <p className="mb-4 text-xs text-muted-foreground">Technical page-level information.</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">HTML size</span>
            <span className="font-medium text-foreground">{pageSizeStr}</span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">Charset</span>
            <span className="font-medium text-foreground">
              {hasCharset ? charset || "declared" : "Not declared"}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">DOCTYPE</span>
            <span className="font-medium text-foreground">{hasDoctype ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">Viewport</span>
            <span className="font-medium text-foreground">{hasViewport ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">Favicon</span>
            <span className="font-medium text-foreground">{hasFavicon ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">Hreflang</span>
            <span className="font-medium text-foreground">
              {hasHreflang ? `${hreflangTags.length} tag(s)` : "None"}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">HTML lang</span>
            <span className="font-medium text-foreground">{lang || "Not set"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">Robots</span>
            <span className="font-medium text-foreground">{robots || "All"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">CSP</span>
            <span className="font-medium text-foreground">{hasCSP ? "✓" : "✗"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">Definition lists</span>
            <span className="font-medium text-foreground"><AnimatedCounter value={dlCount} /></span>
          </div>
          <div className="flex items-center justify-between border-b border-glass-border py-1.5">
            <span className="text-muted-foreground">Video elements</span>
            <span className="font-medium text-foreground"><AnimatedCounter value={videoCount} /></span>
          </div>
        </div>
        {faviconHref && (
          <div className="mt-3 truncate text-[10px] text-muted-foreground" title={faviconHref}>
            favicon: {faviconHref}
          </div>
        )}
        {viewportContent && (
          <div className="mt-1 truncate text-[10px] text-muted-foreground" title={viewportContent}>
            viewport: {viewportContent}
          </div>
        )}
      </motion.div>

      {/* Tech check heat grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6"
      >
        <h3 className="mb-1 font-display text-lg font-semibold">Technical Health Grid</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Pass/fail status for essential technical SEO checks.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {[
            { label: "Charset", ok: hasCharset },
            { label: "Doctype", ok: hasDoctype },
            { label: "Viewport", ok: hasViewport },
            { label: "Favicon", ok: hasFavicon },
            { label: "Language", ok: !!lang },
            { label: "CSP", ok: hasCSP },
          ].map((check) => (
            <div
              key={check.label}
              className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 ${check.ok ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
            >
              <span className={check.ok ? "text-green-400" : "text-red-400"}>
                {check.ok ? "✓" : "✗"}
              </span>
              <span className="text-[10px] text-muted-foreground">{check.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mb-2">
      <div className="mb-0.5 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
