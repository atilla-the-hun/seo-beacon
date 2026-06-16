export interface SeoIssue {
  severity: "high" | "medium" | "low";
  category:
    | "technical"
    | "content"
    | "structure"
    | "social"
    | "schema"
    | "links"
    | "images"
    | "readability"
    | "metadata"
    | "ai";
  issue: string;
  fix: string;
}

export interface SchemaDetails {
  type: string;
  hasRequiredFields: boolean;
  fieldCount: number;
  requiredFieldsPresent: string[];
  missingRequiredFields: string[];
}

export interface AnalyzeResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  htmlSize: number;

  scores: {
    overall: number;
    metadata: number;
    technical: number;
    structure: number;
    content: number;
    readability: number;
    images: number;
    links: number;
    social: number;
    schema: number;
    aiVisibility: number;
  };

  aiEngines: {
    chatgpt: number;
    gemini: number;
    perplexity: number;
    claude: number;
    grok: number;
    deepseek: number;
    kimi: number;
    copilot: number;
    mistral: number;
    you: number;
    braveLeo: number;
    qwen: number;
  };

  aiEngineDetails: {
    [engine: string]: {
      score: number;
      factors: { name: string; value: number; max: number }[];
    };
  };

  metadata: {
    title: string;
    titleLength: number;
    description: string;
    descriptionLength: number;
    canonical: string;
    robots: string;
    lang: string;
    hasViewport: boolean;
    viewportContent: string;
    hasCharset: boolean;
    charset: string;
    hasDoctype: boolean;
    hasFavicon: boolean;
    faviconHref: string;
    hasHreflang: boolean;
    hreflangTags: string[];
    hasCSP: boolean;
    hasXUACompatible: boolean;
    hasHttpEquivRefresh: boolean;
    pageSize: number;

    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogType: string;
    ogUrl: string;
    hasOpenGraph: boolean;
    twitterCard: string;
    twitterSite: string;
    twitterCreator: string;
    hasTwitterCard: boolean;

    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
    headingHierarchyStatus: "valid" | "skipped" | "multiple_h1" | "no_h1" | "empty";
    headingsAsQuestions: number;
    questionHeadings: string[];

    wordCount: number;
    paragraphCount: number;
    avgParagraphLength: number;
    fleschReadingEase: number;
    fleschGradeLevel: number;
    avgWordsPerSentence: number;
    complexWordPercentage: number;
    sentenceCount: number;
    longSentenceCount: number;
    shortSentenceCount: number;
    bulletListCount: number;
    numberedListCount: number;
    tableCount: number;
    blockquoteCount: number;
    codeBlockCount: number;
    boldCount: number;
    iframeCount: number;

    hasHeader: boolean;
    hasNav: boolean;
    hasMain: boolean;
    hasArticle: boolean;
    hasSection: boolean;
    hasAside: boolean;
    hasFooter: boolean;
    semanticElementCount: number;

    imageCount: number;
    imagesMissingAlt: number;
    imagesWithAlt: number;
    imagesWithDescriptiveAlt: number;
    imagesWithGenericAlt: number;
    imagesWithSrcset: number;
    imagesWithLazyLoading: number;
    imageFormats: string[];

    internalLinks: number;
    externalLinks: number;
    nofollowLinks: number;
    sponsoredLinks: number;
    ugcLinks: number;
    totalLinks: number;
    internalLinksFound: string[];
    genericLinkTexts: string[];
    emptyLinkCount: number;

    hasSchema: boolean;
    schemaTypes: string[];
    schemaDetails: SchemaDetails[];

    authorName: string;
    publishDate: string;
    modifiedDate: string;

    datedEntities: string[];
    capitalizedPhrases: string[];
    entityCount: number;

    hasFaq: boolean;
    hasDefinitionIntro: boolean;
    hasConclusionSection: boolean;
    hasTableOfContents: boolean;
    numberedStepsCount: number;
    totalLists: number;

    topKeywords: { word: string; count: number; frequency: number }[];

    readingTime: number;
    contentToHtmlRatio: number;
    dlCount: number;
    videoCount: number;
    allHeadingTexts: string[];
    nGrams: {
      bigrams: { text: string; count: number }[];
      trigrams: { text: string; count: number }[];
    };
    freshnessDays: number | null;
  };
  issues: SeoIssue[];
  summary: string;
}

const COMMON_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "is",
  "was",
  "are",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "shall",
  "can",
  "need",
  "dare",
  "ought",
  "used",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "he",
  "she",
  "they",
  "we",
  "you",
  "me",
  "him",
  "her",
  "us",
  "them",
  "my",
  "your",
  "his",
  "its",
  "our",
  "their",
  "not",
  "no",
  "nor",
  "so",
  "if",
  "then",
  "else",
  "than",
  "too",
  "very",
  "just",
  "about",
  "above",
  "below",
  "up",
  "down",
  "out",
  "off",
  "over",
  "under",
  "again",
  "further",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "each",
  "every",
  "both",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "only",
  "own",
  "same",
  "what",
  "which",
  "who",
  "whom",
  "whose",
  "any",
  "into",
  "upon",
  "also",
  "per",
  "via",
  "many",
  "much",
  "get",
  "got",
  "gets",
  "make",
  "made",
  "makes",
  "said",
  "like",
  "well",
  "back",
  "even",
  "still",
  "way",
  "because",
  "after",
  "before",
  "between",
  "during",
  "without",
  "through",
  "among",
  "along",
  "around",
  "about",
  "across",
  "against",
  "behind",
  "below",
  "beneath",
  "beside",
  "beyond",
  "inside",
  "outside",
  "toward",
  "within",
  "while",
  "although",
  "though",
  "until",
  "unless",
  "since",
  "despite",
  "except",
  "however",
  "therefore",
  "meanwhile",
  "moreover",
  "nevertheless",
  "nonetheless",
  "furthermore",
  "accordingly",
  "consequently",
  "additionally",
  "alternatively",
  "otherwise",
  "instead",
  "regarding",
  "including",
  "excluding",
  "whether",
  "neither",
  "either",
  "another",
  "everything",
  "nothing",
  "something",
  "anything",
  "everyone",
  "someone",
  "anyone",
  "nobody",
  "somebody",
  "anybody",
  "everywhere",
  "somewhere",
  "anywhere",
  "nowhere",
  "always",
  "never",
  "sometimes",
  "often",
  "usually",
  "normally",
  "generally",
  "typically",
  "frequently",
  "rarely",
  "seldom",
  "annually",
  "monthly",
  "weekly",
  "daily",
  "yearly",
  "quarterly",
  "hereby",
  "herein",
  "hereinafter",
  "hereof",
  "hereto",
  "hereunder",
  "herewith",
  "thereafter",
  "thereat",
  "thereby",
  "therefor",
  "therefrom",
  "therein",
  "thereof",
  "thereon",
  "thereto",
  "thereunder",
  "therewith",
  "whereas",
  "whereat",
  "whereby",
  "wherein",
  "whereof",
  "whereon",
  "whereto",
  "whereunder",
  "wherewith",
  "wherewithal",
  "hereinbefore",
  "hereinbelow",
  "hereinabove",
  "aforementioned",
  "aforesaid",
  "aforethought",
]);

const GENERIC_LINK_TEXTS = new Set([
  "click here",
  "read more",
  "learn more",
  "more",
  "here",
  "link",
  "this",
  "go",
  "next",
  "previous",
  "back",
  "continue",
  "details",
  "view",
  "start",
  "get started",
  "sign up",
  "sign in",
  "login",
  "register",
  "download",
  "buy now",
  "purchase",
  "shop now",
  "order now",
  "see more",
  "explore",
  "find out more",
  "visit",
  "see all",
  "show more",
  "view all",
  "full story",
  "read full article",
  "continue reading",
  "this page",
  "that",
  "click",
  "tap here",
  "open",
  "launch",
  "submit",
  "send",
  "share",
]);

const SCHEMA_REQUIRED_FIELDS: Record<string, string[]> = {
  Article: ["headline", "author"],
  NewsArticle: ["headline", "author", "datePublished"],
  BlogPosting: ["headline", "author", "datePublished"],
  Product: ["name"],
  Organization: ["name"],
  Person: ["name"],
  LocalBusiness: ["name", "address"],
  Event: ["name", "startDate"],
  Recipe: ["name", "recipeIngredient"],
  Review: ["itemReviewed", "reviewRating"],
  Movie: ["name"],
  Book: ["name", "author"],
  Course: ["name", "provider"],
  FAQPage: ["mainEntity"],
  HowTo: ["name", "step"],
  BreadcrumbList: ["itemListElement"],
  VideoObject: ["name", "description"],
  JobPosting: ["title", "description"],
  SoftwareApplication: ["name", "applicationCategory"],
  MedicalCondition: ["name"],
  Dataset: ["name", "description"],
};

const QUESTIONS_REGEX =
  /^(what|how|why|when|where|who|which|whom|whose|can|could|would|should|is|are|was|were|do|does|did|has|have|had|will|shall|may|might|does)\b/i;

const stripTags = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const matchAll = (html: string, re: RegExp) => {
  const out: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) out.push(m);
  return out;
};

const getAttr = (tag: string, name: string) => {
  const re = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i");
  const m = tag.match(re);
  return m ? (m[2] ?? m[3] ?? "") : "";
};

const getMeta = (html: string, key: "name" | "property", value: string) => {
  const re = new RegExp(`<meta[^>]*${key}\\s*=\\s*["']${value}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  if (!tag) return "";
  return getAttr(tag, "content");
};

const clamp = (n: number, min = 0, max = 100) => Number.isNaN(n) ? min : Math.max(min, Math.min(max, Math.round(n)));

const countSyllables = (word: string): number => {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const s = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const matches = s.match(/[aeiouy]{1,2}/g);
  if (!matches) return 1;
  let count = matches.length;
  if (w.endsWith("le") && w.length > 4 && !/[^aeiouy]le$/.test(w)) count++;
  if (w.endsWith("ion") || w.endsWith("ious") || w.endsWith("ions")) count++;
  if (w.endsWith("ing") && w.length > 5) count++;
  if (w.endsWith("ness") && w.length > 6) count--;
  if (w.endsWith("ment") && w.length > 6) count--;
  return Math.max(1, count);
};

export function analyzeHtml(url: string, finalUrl: string, html: string): AnalyzeResult {
  const lowered = html.toLowerCase();

  // -- Page basics --
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
  const titleLength = title.length;
  const description = getMeta(html, "name", "description");
  const descriptionLength = description.length;
  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const canonicalHref = getAttr(canonical, "href");
  const robots = getMeta(html, "name", "robots");
  const lang = html.match(/<html[^>]*lang=["']([^"']+)["']/i)?.[1] || "";
  const viewportContent = getMeta(html, "name", "viewport");
  const hasViewport = !!viewportContent;

  const hasCharset =
    /<meta[^>]*charset\s*=/i.test(html) ||
    /charset=/i.test(html.match(/^[\s\S]{0,500}/)?.[0] || "");
  const charsetMatch = html.match(/charset\s*=\s*["']?([\w-]+)["']?/i);
  const charset = charsetMatch?.[1] || "";
  const hasDoctype = /^<!doctype\s/i.test(html.trim());

  const faviconMatch = html.match(
    /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/i,
  );
  const hasFavicon = !!faviconMatch;
  const faviconHref = faviconMatch ? getAttr(faviconMatch[0], "href") : "";

  const hreflangTags = matchAll(
    html,
    /<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*>/gi,
  ).map((m) => {
    const h = getAttr(m[0], "hreflang");
    const href = getAttr(m[0], "href");
    return `${h}: ${href}`;
  });
  const hasHreflang = hreflangTags.length > 0;

  const hasCSP = /<meta[^>]*http-equiv=["']content-security-policy["']/i.test(html);
  const hasXUACompatible = /<meta[^>]*http-equiv=["']x-ua-compatible["']/i.test(html);
  const hasHttpEquivRefresh = /<meta[^>]*http-equiv=["']refresh["']/i.test(html);
  const pageSize = new TextEncoder().encode(html).length;

  // -- Social meta --
  const ogTitle = getMeta(html, "property", "og:title");
  const ogDescription = getMeta(html, "property", "og:description");
  const ogImage = getMeta(html, "property", "og:image");
  const ogType = getMeta(html, "property", "og:type");
  const ogUrl = getMeta(html, "property", "og:url");
  const hasOpenGraph = /<meta[^>]*property=["']og:/i.test(html);
  const twitterCard = getMeta(html, "name", "twitter:card");
  const twitterSite = getMeta(html, "name", "twitter:site");
  const twitterCreator = getMeta(html, "name", "twitter:creator");
  const hasTwitterCard = /<meta[^>]*name=["']twitter:/i.test(html);

  // -- Headings --
  const h1s = matchAll(html, /<h1[\s\S]*?<\/h1>/gi);
  const h2s = matchAll(html, /<h2[\s\S]*?<\/h2>/gi);
  const h3s = matchAll(html, /<h3[\s\S]*?<\/h3>/gi);
  const h4s = matchAll(html, /<h4[\s\S]*?<\/h4>/gi);
  const h5s = matchAll(html, /<h5[\s\S]*?<\/h5>/gi);
  const h6s = matchAll(html, /<h6[\s\S]*?<\/h6>/gi);

  let headingHierarchyStatus: AnalyzeResult["metadata"]["headingHierarchyStatus"] = "valid";
  if (h1s.length === 0) headingHierarchyStatus = "no_h1";
  else if (h1s.length > 1) headingHierarchyStatus = "multiple_h1";
  else {
    const headingOrder = matchAll(html, /<h([1-6])[\s\S]*?<\/h\1>/gi).map((m) => parseInt(m[1]));
    let skipped = false;
    for (let i = 1; i < headingOrder.length; i++) {
      if (headingOrder[i] > headingOrder[i - 1] + 1) {
        skipped = true;
        break;
      }
    }
    if (skipped) headingHierarchyStatus = "skipped";
  }

  const allHeadingTexts: string[] = [];
  const questionHeadings: string[] = [];
  [...h1s, ...h2s, ...h3s, ...h4s, ...h5s, ...h6s].forEach((m) => {
    const t = stripTags(m[0]).trim();
    if (t) {
      allHeadingTexts.push(t);
      if (QUESTIONS_REGEX.test(t)) questionHeadings.push(t);
    }
  });

  // -- Content stats --
  const text = stripTags(html);
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+\s*/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const longSentenceCount = sentences.filter(
    (s) => s.split(/\s+/).filter(Boolean).length > 30,
  ).length;
  const shortSentenceCount = sentences.filter(
    (s) => s.split(/\s+/).filter(Boolean).length > 0 && s.split(/\s+/).filter(Boolean).length < 8,
  ).length;

  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = Math.max(1, paragraphs.length);
  const avgParagraphLength = wordCount / paragraphCount;

  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const fleschReadingEase =
    sentenceCount > 0 && wordCount > 0
      ? clamp(
          206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount),
          0,
          100,
        )
      : 0;
  const fleschGradeLevel =
    sentenceCount > 0 && wordCount > 0
      ? Math.round(
          (0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59) * 10,
        ) / 10
      : 0;

  const complexWords = words.filter((w) => countSyllables(w) >= 3).length;
  const complexWordPercentage =
    wordCount > 0 ? Math.round((complexWords / wordCount) * 1000) / 10 : 0;

  const bulletListCount = (html.match(/<ul[\s\S]*?<\/ul>/gi) || []).length;
  const numberedListCount = (html.match(/<ol[\s\S]*?<\/ol>/gi) || []).length;
  const tableCount = (html.match(/<table[\s\S]*?<\/table>/gi) || []).length;
  const blockquoteCount = (html.match(/<blockquote[\s\S]*?<\/blockquote>/gi) || []).length;
  const codeBlockCount =
    (html.match(/<pre[\s\S]*?<\/pre>/gi) || []).length +
    (html.match(/<code[\s\S]*?<\/code>/gi) || []).length;
  const boldCount = (html.match(/<(?:strong|b)\b[^>]*>[\s\S]*?<\/(?:strong|b)>/gi) || []).length;
  const iframeCount = (html.match(/<iframe[\s\S]*?(?:<\/iframe>|\/>)/gi) || []).length;
  const dlCount = (html.match(/<dl[\s\S]*?<\/dl>/gi) || []).length;
  const videoCount = (html.match(/<video[\s\S]*?<\/video>/gi) || []).length;

  // -- Semantic HTML5 elements --
  const hasHeader = /<header[\s>]/i.test(html);
  const hasNav = /<nav[\s>]/i.test(html);
  const hasMain = /<main[\s>]/i.test(html);
  const hasArticle = /<article[\s>]/i.test(html);
  const hasSection = /<section[\s>]/i.test(html);
  const hasAside = /<aside[\s>]/i.test(html);
  const hasFooter = /<footer[\s>]/i.test(html);
  const semanticElementCount = [
    hasHeader,
    hasNav,
    hasMain,
    hasArticle,
    hasSection,
    hasAside,
    hasFooter,
  ].filter(Boolean).length;

  // -- Images --
  const imgs = matchAll(html, /<img\b[^>]*>/gi).map((m) => m[0]);
  const imageCount = imgs.length;
  let imagesWithAlt = 0,
    imagesWithDescriptiveAlt = 0,
    imagesWithGenericAlt = 0;
  let imagesWithSrcset = 0,
    imagesWithLazyLoading = 0;
  const formatSet = new Set<string>();

  for (const img of imgs) {
    const alt = getAttr(img, "alt");
    const src = getAttr(img, "src");
    if (alt) {
      imagesWithAlt++;
      if (
        alt.length >= 5 &&
        alt.length <= 125 &&
        !/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(alt)
      ) {
        imagesWithDescriptiveAlt++;
      } else {
        imagesWithGenericAlt++;
      }
    }
    if (getAttr(img, "srcset")) imagesWithSrcset++;
    if (/\bloading\s*=\s*["']lazy["']/i.test(img)) imagesWithLazyLoading++;
    const ext = src.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(?:\?|$)/i);
    if (ext) formatSet.add(ext[1].toLowerCase());
  }
  const imagesMissingAlt = imageCount - imagesWithAlt;
  const imageFormats = Array.from(formatSet);

  // -- Links --
  const links = matchAll(html, /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi).map((m) => ({
    href: m[1],
    tag: m[0],
  }));
  const host = (() => {
    try {
      return new URL(finalUrl).hostname;
    } catch {
      return "";
    }
  })();

  let internalLinks = 0,
    externalLinks = 0;
  let nofollowLinks = 0,
    sponsoredLinks = 0,
    ugcLinks = 0;
  const genericLinkTexts: string[] = [];
  let emptyLinkCount = 0;
  const internalLinksFound: string[] = [];

  for (const { href, tag } of links) {
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    const rel = getAttr(tag, "rel").toLowerCase();
    if (/\bnofollow\b/i.test(rel)) nofollowLinks++;
    if (/\bsponsored\b/i.test(rel)) sponsoredLinks++;
    if (/\bugc\b/i.test(rel)) ugcLinks++;

    const innerMatch = html.match(
      new RegExp(`<a\\b[^>]*href=["']${escapeRegex(href)}["'][^>]*>([\\s\\S]*?)<\\/a>`, "i"),
    );
    if (innerMatch) {
      const linkText = stripTags(innerMatch[1]).trim().toLowerCase();
      if (!linkText) emptyLinkCount++;
      else if (GENERIC_LINK_TEXTS.has(linkText)) genericLinkTexts.push(linkText);
    }

    if (href.startsWith("/") || href.startsWith("?")) {
      internalLinks++;
      try {
        internalLinksFound.push(new URL(href, finalUrl).href);
      } catch {
        /* skip */
      }
    } else if (/^https?:\/\//i.test(href)) {
      try {
        if (new URL(href).hostname === host) {
          internalLinks++;
          internalLinksFound.push(new URL(href).href);
        } else externalLinks++;
      } catch {
        /* skip */
      }
    } else {
      internalLinks++;
      try {
        internalLinksFound.push(new URL(href, finalUrl).href);
      } catch {
        /* skip */
      }
    }
  }
  const totalLinks = internalLinks + externalLinks;

  // -- Schema --
  const jsonLdBlocks = matchAll(
    html,
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  const schemaTypes: string[] = [];
  const schemaDetails: SchemaDetails[] = [];
  let hasFaq = false;

  for (const m of jsonLdBlocks) {
    try {
      const parsed: unknown = JSON.parse(m[1].trim());
      const analyzeSchemaNode = (node: unknown, path: string) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) {
          node.forEach((n) => analyzeSchemaNode(n, path));
          return;
        }
        const obj = node as Record<string, unknown>;
        const types = Array.isArray(obj["@type"]) ? obj["@type"] : [obj["@type"]].filter(Boolean);
        for (const t of types) {
          if (typeof t !== "string") continue;
          schemaTypes.push(t);

          const required = SCHEMA_REQUIRED_FIELDS[t] || [];
          const present = required.filter(
            (f) => obj[f] !== undefined && obj[f] !== null && obj[f] !== "",
          );
          const missing = required.filter(
            (f) => obj[f] === undefined || obj[f] === null || obj[f] === "",
          );
          schemaDetails.push({
            type: t,
            hasRequiredFields: missing.length === 0,
            fieldCount: Object.keys(obj).filter((k) => !k.startsWith("@")).length,
            requiredFieldsPresent: present,
            missingRequiredFields: missing,
          });

          if (/faq/i.test(t) || (typeof t === "string" && /faq/i.test(t))) hasFaq = true;
        }
        for (const key of Object.keys(obj)) analyzeSchemaNode(obj[key], `${path}.${key}`);
      };
      analyzeSchemaNode(parsed, "$");
    } catch {
      /* ignore malformed JSON-LD */
    }
  }

  if (!hasFaq && /faq|frequently asked/.test(lowered)) hasFaq = true;
  const hasSchema = schemaTypes.length > 0;

  // -- Author / Date --
  const authorMeta = getMeta(html, "name", "author");
  const authorMatch = text.match(
    /(?:by|written by|author[:：])\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/,
  );
  const authorName = authorMeta || (authorMatch ? authorMatch[1].trim() : "");

  const pubMeta =
    getMeta(html, "property", "article:published_time") ||
    getMeta(html, "name", "date") ||
    getMeta(html, "name", "pubdate");
  const modMeta =
    getMeta(html, "property", "article:modified_time") || getMeta(html, "name", "modified_date");
  const dateInUrl = finalUrl.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  const publishDate =
    pubMeta || (dateInUrl ? `${dateInUrl[1]}-${dateInUrl[2]}-${dateInUrl[3]}` : "");
  const modifiedDate = modMeta || "";

  // -- Entity extraction --
  const datedEntities: string[] = [];
  const datePatterns = [
    /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/g,
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b/gi,
    /\b\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b/gi,
  ];
  for (const pat of datePatterns) {
    const matches = text.match(pat);
    if (matches) datedEntities.push(...matches.map((m) => m.trim()));
  }

  const capitalizedPhrases: string[] = [];
  const capMatches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}/g);
  if (capMatches) {
    const seen = new Set<string>();
    for (const phrase of capMatches) {
      const clean = phrase.trim();
      if (clean.length > 3 && !COMMON_WORDS.has(clean.toLowerCase()) && !seen.has(clean)) {
        const words = clean.split(/\s+/);
        if (words.every((w) => !COMMON_WORDS.has(w.toLowerCase()) || w[0] === w[0].toUpperCase())) {
          seen.add(clean);
          capitalizedPhrases.push(clean);
        }
      }
    }
  }

  // -- Snippet signals --
  const hasDefinitionIntro =
    /^(this (article|guide|post|page|document|tutorial|overview)|in this (article|guide|post)\b)/i.test(
      text.slice(0, 200),
    );
  const hasConclusionSection =
    /<h[1-6][^>]*>.*?(conclusion|summary|key takeaway|wrapping up|final thoughts|recap|closing)\b/i.test(
      html,
    );
  const hasTableOfContents =
    /<nav[\s>]/i.test(html) ||
    /\b(table of contents|toc|on this page|what('s covered| you['\u2019]ll learn))\b/i.test(
      text.slice(0, 500),
    );

  const numberedStepsCount = (text.match(/\b\d+\.\s/g) || []).length;
  const totalLists = bulletListCount + numberedListCount;

  // -- Keywords --
  const stopWords = COMMON_WORDS;
  const wordFreq = new Map<string, { count: number; frequency: number }>();
  for (const w of words) {
    const clean = w
      .replace(/^[^a-zA-Z]+/, "")
      .replace(/[^a-zA-Z]+$/, "")
      .toLowerCase();
    if (clean.length < 3 || stopWords.has(clean) || /^\d+$/.test(clean)) continue;
    const existing = wordFreq.get(clean) || { count: 0, frequency: 0 };
    existing.count++;
    wordFreq.set(clean, existing);
  }
  for (const [, v] of wordFreq)
    v.frequency = Math.round((v.count / Math.max(1, wordCount)) * 10000) / 100;
  const topKeywords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 30)
    .map(([word, data]) => ({ word, count: data.count, frequency: data.frequency }));

  // -- Reading time, content ratio, n-grams, freshness --
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const contentToHtmlRatio =
    html.length > 0 ? Math.round((text.length / html.length) * 100) : 0;

  const nGramMap = new Map<string, { count: number }>();
  const cleanWords = words
    .map((w) =>
      w
        .replace(/^[^a-zA-Z]+/, "")
        .replace(/[^a-zA-Z]+$/, "")
        .toLowerCase(),
    )
    .filter((w) => w.length >= 3 && !COMMON_WORDS.has(w));
  for (let i = 0; i < cleanWords.length - 1; i++) {
    const bigram = cleanWords[i] + " " + cleanWords[i + 1];
    const existing = nGramMap.get(bigram) || { count: 0 };
    existing.count++;
    nGramMap.set(bigram, existing);
    if (i < cleanWords.length - 2) {
      const trigram = cleanWords[i] + " " + cleanWords[i + 1] + " " + cleanWords[i + 2];
      const existing3 = nGramMap.get(trigram) || { count: 0 };
      existing3.count++;
      nGramMap.set(trigram, existing3);
    }
  }
  const allNGrams = Array.from(nGramMap.entries())
    .map(([text, data]) => ({ text, count: data.count }))
    .sort((a, b) => b.count - a.count);
  const nGramLimit = 15;
  const nGrams = {
    bigrams: allNGrams
      .filter((n) => n.text.split(/\s+/).length === 2 && n.count > 1)
      .slice(0, nGramLimit),
    trigrams: allNGrams
      .filter((n) => n.text.split(/\s+/).length === 3 && n.count > 1)
      .slice(0, nGramLimit),
  };

  const freshnessDays = publishDate
    ? Math.round((Date.now() - new Date(publishDate).getTime()) / 86400000)
    : null;

  // -------- Scoring --------
  const h1Count = h1s.length;
  const h2Count = h2s.length;
  const h3Count = h3s.length;
  const h4Count = h4s.length;
  const h5Count = h5s.length;
  const h6Count = h6s.length;
  const headingsAsQuestions = questionHeadings.length;

  // Metadata score (0-100)
  let metadataScore = 0;
  if (title) metadataScore += titleLength >= 30 && titleLength <= 65 ? 25 : 15;
  else metadataScore += 0;
  if (description) metadataScore += descriptionLength >= 70 && descriptionLength <= 160 ? 25 : 15;
  else metadataScore += 0;
  if (canonicalHref) metadataScore += 10;
  if (hasFavicon) metadataScore += 10;
  if (authorName) metadataScore += 10;
  if (publishDate) metadataScore += 10;
  if (hasCharset && hasDoctype) metadataScore += 10;
  metadataScore = clamp(metadataScore);

  // Technical score (0-100)
  let technicalScore = 0;
  if (hasViewport) technicalScore += 20;
  if (canonicalHref) technicalScore += 15;
  if (!/noindex/i.test(robots)) technicalScore += 15;
  if (lang) technicalScore += 10;
  if (hasDoctype) technicalScore += 10;
  if (hasCharset) technicalScore += 10;
  if (hasFavicon) technicalScore += 10;
  if (hasHreflang) technicalScore += 5;
  if (!hasXUACompatible) technicalScore += 5;
  technicalScore = clamp(technicalScore);

  // Structure score (0-100)
  let structureScore = 0;
  if (h1Count === 1) structureScore += 20;
  else if (h1Count > 1) structureScore += 5;
  if (h2Count >= 3) structureScore += 20;
  else if (h2Count >= 1) structureScore += 10;
  if (h3Count >= 3) structureScore += 10;
  else if (h3Count >= 1) structureScore += 5;
  if (headingHierarchyStatus === "valid") structureScore += 15;
  if (semanticElementCount >= 5) structureScore += 20;
  else if (semanticElementCount >= 3) structureScore += 12;
  else if (semanticElementCount >= 1) structureScore += 5;
  if (internalLinks >= 5) structureScore += 15;
  else if (internalLinks >= 3) structureScore += 8;
  structureScore = clamp(structureScore);

  // Readability score (0-100)
  let readabilityScore = 50;
  if (fleschReadingEase >= 80) readabilityScore += 30;
  else if (fleschReadingEase >= 60) readabilityScore += 20;
  else if (fleschReadingEase >= 40) readabilityScore += 10;
  else if (fleschReadingEase >= 20) readabilityScore += 5;
  else readabilityScore -= 10;
  if (avgWordsPerSentence > 0 && avgWordsPerSentence <= 15) readabilityScore += 15;
  else if (avgWordsPerSentence <= 22) readabilityScore += 10;
  else if (avgWordsPerSentence > 28) readabilityScore -= 10;
  if (complexWordPercentage <= 15) readabilityScore += 10;
  else if (complexWordPercentage > 30) readabilityScore -= 10;
  if (wordCount >= 600) readabilityScore += 5;
  else if (wordCount < 200) readabilityScore -= 15;
  readabilityScore = clamp(readabilityScore);

  // Content score (0-100)
  let contentScore = 0;
  if (wordCount >= 2000) contentScore += 30;
  else if (wordCount >= 1200) contentScore += 25;
  else if (wordCount >= 600) contentScore += 18;
  else if (wordCount >= 300) contentScore += 10;
  contentScore += clamp(Math.round(structureScore * 0.15));
  contentScore += clamp(Math.round(readabilityScore * 0.2));
  if (tableCount > 0) contentScore += 8;
  if (totalLists > 0) contentScore += 7;
  if (boldCount > 0 && boldCount < wordCount / 20) contentScore += 5;
  if (paragraphCount >= 3) contentScore += 5;
  contentScore = clamp(contentScore);

  // Images score (0-100)
  let imagesScore = 50;
  if (imageCount === 0) imagesScore = 50;
  else {
    const altRatio = imageCount > 0 ? imagesWithAlt / imageCount : 0;
    if (altRatio >= 0.9) imagesScore += 25;
    else if (altRatio >= 0.7) imagesScore += 15;
    else if (altRatio >= 0.5) imagesScore += 5;
    else imagesScore -= 15;
    const descriptiveRatio = imageCount > 0 ? imagesWithDescriptiveAlt / imageCount : 0;
    if (descriptiveRatio >= 0.6) imagesScore += 10;
    const lazyRatio = imageCount > 0 ? imagesWithLazyLoading / imageCount : 0;
    if (lazyRatio >= 0.5) imagesScore += 10;
    const srcsetRatio = imageCount > 0 ? imagesWithSrcset / imageCount : 0;
    if (srcsetRatio >= 0.5) imagesScore += 5;
    if (imageFormats.includes("avif") || imageFormats.includes("webp")) imagesScore += 5;
  }
  imagesScore = clamp(imagesScore);

  // Links score (0-100)
  let linksScore = 50;
  if (internalLinks >= 10) linksScore += 20;
  else if (internalLinks >= 5) linksScore += 12;
  else if (internalLinks >= 3) linksScore += 5;
  else linksScore -= 10;
  if (externalLinks > 0 && externalLinks <= 20) linksScore += 10;
  else if (externalLinks > 50) linksScore -= 5;
  if (emptyLinkCount === 0) linksScore += 10;
  else if (emptyLinkCount <= 3) linksScore += 5;
  else linksScore -= 10;
  if (genericLinkTexts.length === 0) linksScore += 10;
  else linksScore -= 5;
  if (nofollowLinks + sponsoredLinks + ugcLinks > 0) linksScore += 5;
  linksScore = clamp(linksScore);

  // Social score (0-100)
  let socialScore = 0;
  if (ogTitle) socialScore += 15;
  if (ogDescription) socialScore += 15;
  if (ogImage) socialScore += 20;
  if (ogType) socialScore += 5;
  if (ogUrl) socialScore += 5;
  if (twitterCard) socialScore += 15;
  if (twitterSite) socialScore += 5;
  if (twitterCreator) socialScore += 5;
  if (hasOpenGraph && hasTwitterCard && ogTitle && ogDescription && ogImage) socialScore += 15;
  socialScore = clamp(socialScore);

  // Schema score (0-100)
  let schemaScore = 0;
  if (hasSchema) schemaScore += 25;
  else schemaScore = 0;
  const hasOrgOrPerson = schemaDetails.some(
    (s) => s.type === "Organization" || s.type === "Person" || s.type === "LocalBusiness",
  );
  if (hasOrgOrPerson) schemaScore += 10;
  const hasArticleOrBlog = schemaDetails.some(
    (s) => s.type === "Article" || s.type === "BlogPosting" || s.type === "NewsArticle",
  );
  if (hasArticleOrBlog) schemaScore += 10;
  const hasBreadcrumb = schemaDetails.some((s) => s.type === "BreadcrumbList");
  if (hasBreadcrumb) schemaScore += 10;
  const hasFaqSchema = schemaDetails.some((s) => s.type === "FAQPage");
  if (hasFaqSchema) schemaScore += 15;
  else if (hasFaq) schemaScore += 5;
  const hasHowTo = schemaDetails.some((s) => s.type === "HowTo");
  if (hasHowTo) schemaScore += 10;
  if (schemaDetails.length > 0) {
    const validRatio =
      schemaDetails.filter((s) => s.hasRequiredFields).length / schemaDetails.length;
    if (validRatio >= 0.8) schemaScore += 15;
    else if (validRatio >= 0.5) schemaScore += 8;
    else schemaScore += 3;
    const totalFields = schemaDetails.reduce((sum, s) => sum + s.fieldCount, 0);
    if (totalFields > 10) schemaScore += 10;
    else if (totalFields > 5) schemaScore += 5;
  }
  schemaScore = clamp(schemaScore);

  // AI Visibility score (0-100)
  let aiVisibility = 0;
  if (hasSchema) aiVisibility += 10;
  if (hasFaq) aiVisibility += 8;
  if (
    schemaDetails.some((s) =>
      /Organization|Person|Product|Article|HowTo|BreadcrumbList|FAQPage/i.test(s.type),
    )
  )
    aiVisibility += 8;
  if (h2Count >= 3) aiVisibility += 6;
  if (headingHierarchyStatus === "valid") aiVisibility += 6;
  if (wordCount >= 1000) aiVisibility += 8;
  else if (wordCount >= 600) aiVisibility += 5;
  if (description && descriptionLength >= 70) aiVisibility += 5;
  if (avgWordsPerSentence > 0 && avgWordsPerSentence <= 20) aiVisibility += 5;
  if (semanticElementCount >= 4) aiVisibility += 8;
  if (tableCount > 0) aiVisibility += 5;
  if (totalLists > 0) aiVisibility += 5;
  if (hasDefinitionIntro) aiVisibility += 5;
  if (hasConclusionSection) aiVisibility += 5;
  if (authorName && publishDate) aiVisibility += 6;
  if (fleschReadingEase >= 60) aiVisibility += 5;
  if (codeBlockCount > 0) aiVisibility += 3;
  if (blockquoteCount > 0) aiVisibility += 3;
  if (sentenceCount > 0 && sentenceCount < wordCount / 5) aiVisibility += 4;
  if (totalLists + tableCount + blockquoteCount + codeBlockCount >= 3) aiVisibility += 5;
  aiVisibility = clamp(aiVisibility);

  // Overall SEO
  const overall = clamp(
    technicalScore * 0.15 +
      contentScore * 0.2 +
      metadataScore * 0.1 +
      aiVisibility * 0.1 +
      structureScore * 0.1 +
      readabilityScore * 0.1 +
      imagesScore * 0.08 +
      linksScore * 0.07 +
      socialScore * 0.05 +
      schemaScore * 0.05,
  );

  // Per-engine AI readiness
  const freshnessScore = freshnessDays !== null && !Number.isNaN(freshnessDays) ? Math.max(0, Math.min(100, 100 - freshnessDays * 0.5)) : 0;

  const aiEngines = {
    chatgpt: clamp(
      aiVisibility * 0.25 +
        readabilityScore * 0.2 +
        structureScore * 0.15 +
        contentScore * 0.15 +
        (hasSchema ? 10 : 0) +
        (authorName && publishDate ? 5 : 0) +
        (hasFaq ? 5 : 0) +
        (semanticElementCount >= 4 ? 5 : 0),
    ),
    gemini: clamp(
      aiVisibility * 0.2 +
        schemaScore * 0.25 +
        technicalScore * 0.15 +
        imagesScore * 0.1 +
        structureScore * 0.1 +
        contentScore * 0.1 +
        (semanticElementCount >= 4 ? 5 : 0) +
        (hasSchema ? 5 : 0),
    ),
    perplexity: clamp(
      aiVisibility * 0.15 +
        contentScore * 0.15 +
        structureScore * 0.1 +
        (hasFaq ? 10 : 0) +
        (headingsAsQuestions > 1 ? 10 : headingsAsQuestions > 0 ? 6 : 0) +
        (authorName && publishDate ? 8 : 0) +
        readabilityScore * 0.05 +
        (tableCount > 0 || totalLists > 0 ? 6 : 0) +
        (hasConclusionSection ? 6 : 0) +
        freshnessScore * 0.1 +
        (hasSchema ? 5 : 0) +
        (externalLinks > 0 ? 5 : 0) +
        (semanticElementCount >= 4 ? 5 : 0),
    ),
    claude: clamp(
      aiVisibility * 0.2 +
        readabilityScore * 0.25 +
        contentScore * 0.2 +
        structureScore * 0.15 +
        (semanticElementCount >= 4 ? 5 : 0) +
        (hasConclusionSection ? 5 : 0) +
        (hasDefinitionIntro ? 5 : 0) +
        (codeBlockCount > 0 ? 5 : 0),
    ),
    grok: clamp(
      aiVisibility * 0.15 +
        freshnessScore * 0.2 +
        technicalScore * 0.15 +
        structureScore * 0.1 +
        contentScore * 0.1 +
        readabilityScore * 0.05 +
        (codeBlockCount > 0 ? 10 : 0) +
        (hasSchema ? 5 : 0) +
        (authorName && publishDate ? 5 : 0) +
        (semanticElementCount >= 4 ? 5 : 0),
    ),
    deepseek: clamp(
      aiVisibility * 0.15 +
        structureScore * 0.2 +
        schemaScore * 0.15 +
        contentScore * 0.15 +
        technicalScore * 0.1 +
        (codeBlockCount > 0 ? 10 : 0) +
        (tableCount > 0 ? 5 : 0) +
        (totalLists > 0 ? 5 : 0) +
        (hasSchema ? 5 : 0) +
        (semanticElementCount >= 4 ? 5 : 0),
    ),
    kimi: clamp(
      aiVisibility * 0.15 +
        contentScore * 0.25 +
        readabilityScore * 0.15 +
        structureScore * 0.1 +
        (wordCount >= 2000 ? 10 : wordCount >= 1000 ? 5 : 0) +
        (hasConclusionSection ? 5 : 0) +
        (hasTableOfContents ? 5 : 0) +
        (hasDefinitionIntro ? 5 : 0) +
        (totalLists > 0 || tableCount > 0 ? 5 : 0) +
        (authorName && publishDate ? 5 : 0),
    ),
    copilot: clamp(
      aiVisibility * 0.15 +
        metadataScore * 0.2 +
        contentScore * 0.15 +
        schemaScore * 0.15 +
        technicalScore * 0.1 +
        structureScore * 0.1 +
        (authorName && publishDate ? 5 : 0) +
        (hasSchema ? 5 : 0) +
        (hasFaq ? 5 : 0),
    ),
    mistral: clamp(
      aiVisibility * 0.15 +
        contentScore * 0.15 +
        structureScore * 0.15 +
        readabilityScore * 0.15 +
        (hasHreflang ? 10 : 0) +
        (lang ? 5 : 0) +
        (hreflangTags.length > 1 ? 5 : 0) +
        (bulletListCount > 0 || tableCount > 0 ? 5 : 0) +
        (semanticElementCount >= 4 ? 5 : 0),
    ),
    you: clamp(
      aiVisibility * 0.15 +
        contentScore * 0.15 +
        structureScore * 0.15 +
        technicalScore * 0.1 +
        (codeBlockCount > 0 ? 10 : 0) +
        (externalLinks > 0 ? 8 : 0) +
        (tableCount > 0 ? 5 : 0) +
        (hasSchema ? 5 : 0) +
        (semanticElementCount >= 4 ? 5 : 0),
    ),
    braveLeo: clamp(
      aiVisibility * 0.15 +
        contentScore * 0.2 +
        structureScore * 0.15 +
        readabilityScore * 0.15 +
        technicalScore * 0.1 +
        (semanticElementCount >= 4 ? 5 : 0) +
        (hasSchema ? 5 : 0) +
        (hasDoctype ? 5 : 0) +
        (hasCharset ? 5 : 0),
    ),
    qwen: clamp(
      aiVisibility * 0.15 +
        contentScore * 0.2 +
        structureScore * 0.15 +
        schemaScore * 0.1 +
        (hreflangTags.length > 0 ? 10 : 0) +
        (wordCount >= 1500 ? 8 : wordCount >= 800 ? 5 : 0) +
        (capitalizedPhrases.length > 0 ? 5 : 0) +
        (hasSchema ? 5 : 0) +
        (hasConclusionSection ? 5 : 0),
    ),
  };

  const aiEngineDetails = {
    chatgpt: {
      score: aiEngines.chatgpt,
      factors: [
        { name: "AI Visibility", value: aiVisibility * 0.25, max: 25 },
        { name: "Readability", value: readabilityScore * 0.2, max: 20 },
        { name: "Structure", value: structureScore * 0.15, max: 15 },
        { name: "Content", value: contentScore * 0.15, max: 15 },
        { name: "Schema", value: hasSchema ? 10 : 0, max: 10 },
        { name: "Author + Date", value: authorName && publishDate ? 5 : 0, max: 5 },
        { name: "FAQ Detection", value: hasFaq ? 5 : 0, max: 5 },
        { name: "Semantic HTML", value: semanticElementCount >= 4 ? 5 : 0, max: 5 },
      ],
    },
    gemini: {
      score: aiEngines.gemini,
      factors: [
        { name: "Schema", value: schemaScore * 0.25, max: 25 },
        { name: "AI Visibility", value: aiVisibility * 0.2, max: 20 },
        { name: "Technical", value: technicalScore * 0.15, max: 15 },
        { name: "Images", value: imagesScore * 0.1, max: 10 },
        { name: "Structure", value: structureScore * 0.1, max: 10 },
        { name: "Content", value: contentScore * 0.1, max: 10 },
        { name: "Semantic HTML", value: semanticElementCount >= 4 ? 5 : 0, max: 5 },
        { name: "Schema Present", value: hasSchema ? 5 : 0, max: 5 },
      ],
    },
    perplexity: {
      score: aiEngines.perplexity,
      factors: [
        { name: "Q&A Readiness", value: (hasFaq ? 10 : 0) + (headingsAsQuestions > 1 ? 10 : headingsAsQuestions > 0 ? 6 : 0), max: 20 },
        { name: "Citation Credibility", value: (authorName && publishDate ? 8 : 0) + (externalLinks > 0 ? 5 : 0), max: 13 },
        { name: "Content Extractability", value: (tableCount > 0 || totalLists > 0 ? 6 : 0) + (hasConclusionSection ? 6 : 0), max: 12 },
        { name: "AI Visibility", value: aiVisibility * 0.15, max: 15 },
        { name: "Content Quality", value: contentScore * 0.15, max: 15 },
        { name: "Freshness", value: freshnessScore * 0.1, max: 10 },
        { name: "Structure", value: structureScore * 0.1, max: 10 },
        { name: "Readability", value: readabilityScore * 0.05, max: 5 },
      ],
    },
    claude: {
      score: aiEngines.claude,
      factors: [
        { name: "Readability", value: readabilityScore * 0.25, max: 25 },
        { name: "AI Visibility", value: aiVisibility * 0.2, max: 20 },
        { name: "Content", value: contentScore * 0.2, max: 20 },
        { name: "Structure", value: structureScore * 0.15, max: 15 },
        { name: "Semantic HTML", value: semanticElementCount >= 4 ? 5 : 0, max: 5 },
        { name: "Conclusion", value: hasConclusionSection ? 5 : 0, max: 5 },
        { name: "Definition Intro", value: hasDefinitionIntro ? 5 : 0, max: 5 },
        { name: "Code Blocks", value: codeBlockCount > 0 ? 5 : 0, max: 5 },
      ],
    },
    grok: {
      score: aiEngines.grok,
      factors: [
        { name: "Freshness", value: freshnessScore * 0.2, max: 20 },
        { name: "Technical", value: technicalScore * 0.15, max: 15 },
        { name: "AI Visibility", value: aiVisibility * 0.15, max: 15 },
        { name: "Structure", value: structureScore * 0.1, max: 10 },
        { name: "Content", value: contentScore * 0.1, max: 10 },
        { name: "Code Blocks", value: codeBlockCount > 0 ? 10 : 0, max: 10 },
        { name: "Semantic HTML", value: semanticElementCount >= 4 ? 5 : 0, max: 5 },
        { name: "Schema", value: hasSchema ? 5 : 0, max: 5 },
        { name: "Author + Date", value: authorName && publishDate ? 5 : 0, max: 5 },
        { name: "Readability", value: readabilityScore * 0.05, max: 5 },
      ],
    },
    deepseek: {
      score: aiEngines.deepseek,
      factors: [
        { name: "Structure", value: structureScore * 0.2, max: 20 },
        { name: "Schema", value: schemaScore * 0.15, max: 15 },
        { name: "Content", value: contentScore * 0.15, max: 15 },
        { name: "AI Visibility", value: aiVisibility * 0.15, max: 15 },
        { name: "Technical", value: technicalScore * 0.1, max: 10 },
        { name: "Code Blocks", value: codeBlockCount > 0 ? 10 : 0, max: 10 },
        { name: "Tables", value: tableCount > 0 ? 5 : 0, max: 5 },
        { name: "Lists", value: totalLists > 0 ? 5 : 0, max: 5 },
        { name: "Schema Present", value: hasSchema ? 5 : 0, max: 5 },
        { name: "Semantic HTML", value: semanticElementCount >= 4 ? 5 : 0, max: 5 },
      ],
    },
    kimi: {
      score: aiEngines.kimi,
      factors: [
        { name: "Content Depth", value: contentScore * 0.25, max: 25 },
        { name: "AI Visibility", value: aiVisibility * 0.15, max: 15 },
        { name: "Readability", value: readabilityScore * 0.15, max: 15 },
        { name: "Structure", value: structureScore * 0.1, max: 10 },
        { name: "Word Count", value: wordCount >= 2000 ? 10 : wordCount >= 1000 ? 5 : 0, max: 10 },
        { name: "Conclusion", value: hasConclusionSection ? 5 : 0, max: 5 },
        { name: "Table of Contents", value: hasTableOfContents ? 5 : 0, max: 5 },
        { name: "Definition Intro", value: hasDefinitionIntro ? 5 : 0, max: 5 },
        { name: "Structured Content", value: totalLists > 0 || tableCount > 0 ? 5 : 0, max: 5 },
        { name: "Author + Date", value: authorName && publishDate ? 5 : 0, max: 5 },
      ],
    },
    copilot: {
      score: aiEngines.copilot,
      factors: [
        { name: "Metadata", value: metadataScore * 0.2, max: 20 },
        { name: "Content", value: contentScore * 0.15, max: 15 },
        { name: "Schema", value: schemaScore * 0.15, max: 15 },
        { name: "AI Visibility", value: aiVisibility * 0.15, max: 15 },
        { name: "Technical", value: technicalScore * 0.1, max: 10 },
        { name: "Structure", value: structureScore * 0.1, max: 10 },
        { name: "Author + Date", value: authorName && publishDate ? 5 : 0, max: 5 },
        { name: "Schema Present", value: hasSchema ? 5 : 0, max: 5 },
        { name: "FAQ Detection", value: hasFaq ? 5 : 0, max: 5 },
      ],
    },
    mistral: {
      score: aiEngines.mistral,
      factors: [
        { name: "Content", value: contentScore * 0.15, max: 15 },
        { name: "Structure", value: structureScore * 0.15, max: 15 },
        { name: "Readability", value: readabilityScore * 0.15, max: 15 },
        { name: "AI Visibility", value: aiVisibility * 0.15, max: 15 },
        { name: "Hreflang", value: hasHreflang ? 10 : 0, max: 10 },
        { name: "Language Tag", value: lang ? 5 : 0, max: 5 },
        { name: "Multi-language", value: hreflangTags.length > 1 ? 5 : 0, max: 5 },
        { name: "Lists/Tables", value: bulletListCount > 0 || tableCount > 0 ? 5 : 0, max: 5 },
        { name: "Semantic HTML", value: semanticElementCount >= 4 ? 5 : 0, max: 5 },
      ],
    },
    you: {
      score: aiEngines.you,
      factors: [
        { name: "Content", value: contentScore * 0.15, max: 15 },
        { name: "Structure", value: structureScore * 0.15, max: 15 },
        { name: "Technical", value: technicalScore * 0.1, max: 10 },
        { name: "AI Visibility", value: aiVisibility * 0.15, max: 15 },
        { name: "Code Blocks", value: codeBlockCount > 0 ? 10 : 0, max: 10 },
        { name: "External Links", value: externalLinks > 0 ? 8 : 0, max: 8 },
        { name: "Tables", value: tableCount > 0 ? 5 : 0, max: 5 },
        { name: "Schema Present", value: hasSchema ? 5 : 0, max: 5 },
        { name: "Semantic HTML", value: semanticElementCount >= 4 ? 5 : 0, max: 5 },
      ],
    },
    braveLeo: {
      score: aiEngines.braveLeo,
      factors: [
        { name: "Content", value: contentScore * 0.2, max: 20 },
        { name: "Structure", value: structureScore * 0.15, max: 15 },
        { name: "Readability", value: readabilityScore * 0.15, max: 15 },
        { name: "AI Visibility", value: aiVisibility * 0.15, max: 15 },
        { name: "Technical", value: technicalScore * 0.1, max: 10 },
        { name: "Semantic HTML", value: semanticElementCount >= 4 ? 5 : 0, max: 5 },
        { name: "Schema Present", value: hasSchema ? 5 : 0, max: 5 },
        { name: "Doctype", value: hasDoctype ? 5 : 0, max: 5 },
        { name: "Charset", value: hasCharset ? 5 : 0, max: 5 },
      ],
    },
    qwen: {
      score: aiEngines.qwen,
      factors: [
        { name: "Content", value: contentScore * 0.2, max: 20 },
        { name: "Structure", value: structureScore * 0.15, max: 15 },
        { name: "Schema", value: schemaScore * 0.1, max: 10 },
        { name: "AI Visibility", value: aiVisibility * 0.15, max: 15 },
        { name: "Hreflang", value: hreflangTags.length > 0 ? 10 : 0, max: 10 },
        { name: "Word Count", value: wordCount >= 1500 ? 8 : wordCount >= 800 ? 5 : 0, max: 8 },
        { name: "Entity Richness", value: capitalizedPhrases.length > 0 ? 5 : 0, max: 5 },
        { name: "Schema Present", value: hasSchema ? 5 : 0, max: 5 },
        { name: "Conclusion", value: hasConclusionSection ? 5 : 0, max: 5 },
      ],
    },
  };

  // -------- Issues --------
  const issues: SeoIssue[] = [];

  // Metadata issues
  if (!title)
    issues.push({
      severity: "high",
      category: "metadata",
      issue: "Missing <title> tag",
      fix: "Add a unique, descriptive title between 30–65 characters.",
    });
  else if (titleLength < 30 || titleLength > 65)
    issues.push({
      severity: "medium",
      category: "metadata",
      issue: `Title length is ${titleLength} characters (recommended 30–65)`,
      fix: "Shorten or expand the title to 30–65 characters for optimal SERP display.",
    });
  if (!description)
    issues.push({
      severity: "high",
      category: "metadata",
      issue: "Missing meta description",
      fix: "Add a compelling meta description (70–160 characters) that summarizes the page.",
    });
  else if (descriptionLength < 70 || descriptionLength > 160)
    issues.push({
      severity: "medium",
      category: "metadata",
      issue: `Meta description length is ${descriptionLength} characters`,
      fix: "Keep meta description between 70–160 characters.",
    });
  if (!canonicalHref)
    issues.push({
      severity: "medium",
      category: "technical",
      issue: "Missing canonical tag",
      fix: 'Add <link rel="canonical"> to prevent duplicate content issues.',
    });
  if (!hasViewport)
    issues.push({
      severity: "high",
      category: "technical",
      issue: "Missing viewport meta tag",
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> for mobile usability.',
    });
  if (/noindex/i.test(robots))
    issues.push({
      severity: "high",
      category: "technical",
      issue: "Page is set to noindex",
      fix: "Remove noindex from robots meta if you want this page indexed.",
    });
  if (!hasCharset)
    issues.push({
      severity: "high",
      category: "technical",
      issue: "Missing character encoding declaration",
      fix: 'Add <meta charset="UTF-8"> in the <head>.',
    });
  if (!hasDoctype)
    issues.push({
      severity: "medium",
      category: "technical",
      issue: "Missing DOCTYPE declaration",
      fix: "Start the HTML with <!DOCTYPE html>.",
    });
  if (!hasFavicon)
    issues.push({
      severity: "low",
      category: "technical",
      issue: "Missing favicon",
      fix: 'Add a favicon via <link rel="icon" href="...">.',
    });
  if (hasXUACompatible)
    issues.push({
      severity: "low",
      category: "technical",
      issue: "Using outdated X-UA-Compatible meta tag",
      fix: 'Remove <meta http-equiv="X-UA-Compatible"> — it\'s only needed for legacy IE.',
    });
  if (hasHttpEquivRefresh)
    issues.push({
      severity: "low",
      category: "technical",
      issue: "Using meta refresh redirect",
      fix: 'Use server-side 301 redirects instead of <meta http-equiv="refresh">.',
    });
  if (!lang)
    issues.push({
      severity: "low",
      category: "technical",
      issue: "Missing <html lang> attribute",
      fix: "Set the lang attribute on <html> for accessibility and SEO.",
    });

  // Social issues
  if (!hasOpenGraph)
    issues.push({
      severity: "medium",
      category: "social",
      issue: "Missing Open Graph tags",
      fix: "Add og:title, og:description, and og:image for rich social sharing previews.",
    });
  else {
    if (!ogTitle)
      issues.push({
        severity: "medium",
        category: "social",
        issue: "Missing og:title",
        fix: 'Add <meta property="og:title" content="...">.',
      });
    if (!ogDescription)
      issues.push({
        severity: "medium",
        category: "social",
        issue: "Missing og:description",
        fix: 'Add <meta property="og:description" content="...">.',
      });
    if (!ogImage)
      issues.push({
        severity: "medium",
        category: "social",
        issue: "Missing og:image",
        fix: 'Add <meta property="og:image" content="..."> — social shares need an image.',
      });
  }
  if (!hasTwitterCard)
    issues.push({
      severity: "low",
      category: "social",
      issue: "Missing Twitter Card tags",
      fix: "Add twitter:card and related tags for Twitter previews.",
    });

  // Heading issues
  if (h1Count === 0)
    issues.push({
      severity: "high",
      category: "structure",
      issue: "No H1 heading found",
      fix: "Add a single, descriptive H1 that matches the page topic.",
    });
  else if (h1Count > 1)
    issues.push({
      severity: "medium",
      category: "structure",
      issue: `${h1Count} H1 tags found (use exactly one)`,
      fix: "Use only one H1 per page to maintain clear hierarchy.",
    });
  if (h2Count === 0)
    issues.push({
      severity: "medium",
      category: "structure",
      issue: "No H2 headings found",
      fix: "Break content into sections using H2 headings for better structure and readability.",
    });
  if (headingHierarchyStatus === "skipped")
    issues.push({
      severity: "medium",
      category: "structure",
      issue: "Heading hierarchy is skipped",
      fix: "Don't skip heading levels (e.g., H1 → H3 without H2). Maintain a logical hierarchy.",
    });

  // Semantic HTML
  if (semanticElementCount < 3)
    issues.push({
      severity: "medium",
      category: "structure",
      issue: `Only ${semanticElementCount} semantic HTML5 element(s) used`,
      fix: "Use <header>, <nav>, <main>, <article>, <section>, <aside>, and <footer> for better structure.",
    });
  if (!hasMain)
    issues.push({
      severity: "medium",
      category: "structure",
      issue: "Missing <main> landmark element",
      fix: "Wrap primary content in <main> for accessibility and screen reader navigation.",
    });
  if (!hasHeader)
    issues.push({
      severity: "low",
      category: "structure",
      issue: "Missing <header> element",
      fix: "Wrap page/heading content in <header> for better semantic structure.",
    });
  if (!hasFooter)
    issues.push({
      severity: "low",
      category: "structure",
      issue: "Missing <footer> element",
      fix: "Wrap footer content in <footer> for better semantic structure.",
    });
  if (!hasNav)
    issues.push({
      severity: "low",
      category: "structure",
      issue: "Missing <nav> element",
      fix: "Use <nav> to wrap navigation links for accessibility.",
    });

  // Content issues
  if (wordCount < 300)
    issues.push({
      severity: "high",
      category: "content",
      issue: `Thin content — only ${wordCount} words`,
      fix: "Expand the content to at least 600+ words covering the topic comprehensively.",
    });
  else if (wordCount < 600)
    issues.push({
      severity: "medium",
      category: "content",
      issue: `Low word count (${wordCount} words)`,
      fix: "Add more depth — AI engines favor comprehensive, well-structured content.",
    });

  // Readability issues
  if (fleschReadingEase < 40)
    issues.push({
      severity: "medium",
      category: "readability",
      issue: `Very low readability score (${fleschReadingEase}/100)`,
      fix: "Use shorter sentences, simpler words, and break up complex ideas to reach FRE > 60.",
    });
  else if (fleschReadingEase < 60)
    issues.push({
      severity: "low",
      category: "readability",
      issue: `Low readability score (${fleschReadingEase}/100)`,
      fix: "Aim for Flesch Reading Ease above 60 by simplifying sentence structure and vocabulary.",
    });
  if (avgWordsPerSentence > 28)
    issues.push({
      severity: "low",
      category: "readability",
      issue: `Long average sentence length (${Math.round(avgWordsPerSentence)} words)`,
      fix: "Shorten sentences to ~15–22 words on average for better readability and AI chunking.",
    });
  if (complexWordPercentage > 25)
    issues.push({
      severity: "low",
      category: "readability",
      issue: `High proportion of complex words (${complexWordPercentage}%)`,
      fix: "Replace some multi-syllable words with simpler alternatives.",
    });

  // Image issues
  if (imageCount > 0) {
    if (imagesMissingAlt > 0)
      issues.push({
        severity: "medium",
        category: "images",
        issue: `${imagesMissingAlt} image(s) missing alt text out of ${imageCount}`,
        fix: 'Add descriptive alt attributes to all meaningful images (use alt="" for decorative ones).',
      });
    if (imagesWithGenericAlt > 0)
      issues.push({
        severity: "low",
        category: "images",
        issue: `${imagesWithGenericAlt} image(s) have generic or file-name alt text`,
        fix: "Replace generic alt text with meaningful descriptions of the image content.",
      });
    if (imagesWithSrcset === 0 && imageCount > 1)
      issues.push({
        severity: "low",
        category: "images",
        issue: "No responsive images (srcset) found",
        fix: "Use srcset on <img> tags to serve appropriately sized images for different viewports.",
      });
    if (imagesWithLazyLoading < imageCount * 0.5)
      issues.push({
        severity: "low",
        category: "images",
        issue: `${imageCount - imagesWithLazyLoading} image(s) without loading="lazy"`,
        fix: 'Add loading="lazy" to below-the-fold images to improve initial page load.',
      });
  }

  // Link issues
  if (internalLinks < 3)
    issues.push({
      severity: "low",
      category: "links",
      issue: `Only ${internalLinks} internal link(s)`,
      fix: "Add more internal links to related content for better navigation and topical authority.",
    });
  if (emptyLinkCount > 0)
    issues.push({
      severity: "medium",
      category: "links",
      issue: `${emptyLinkCount} link(s) with empty anchor text`,
      fix: "All links should have descriptive anchor text — never leave them empty.",
    });
  if (genericLinkTexts.length > 0)
    issues.push({
      severity: "low",
      category: "links",
      issue: `${genericLinkTexts.length} link(s) use generic text like "${genericLinkTexts[0]}"`,
      fix: "Use descriptive anchor text that tells users and search engines what the linked page is about.",
    });

  // Schema issues
  if (!hasSchema)
    issues.push({
      severity: "high",
      category: "schema",
      issue: "No structured data (JSON-LD) found",
      fix: "Add Organization, Article, Product, or other relevant schema markup — critical for AI search visibility.",
    });
  else {
    const missingRequired = schemaDetails.filter((s) => !s.hasRequiredFields);
    if (missingRequired.length > 0) {
      for (const s of missingRequired.slice(0, 3)) {
        issues.push({
          severity: "medium",
          category: "schema",
          issue: `${s.type} schema is missing required fields: ${s.missingRequiredFields.join(", ")}`,
          fix: `Add the missing required properties (${s.missingRequiredFields.join(", ")}) to the ${s.type} schema block.`,
        });
      }
    }
    if (!hasFaq)
      issues.push({
        severity: "medium",
        category: "schema",
        issue: "No FAQ schema detected",
        fix: "Add an FAQ section with FAQPage schema to boost visibility in AI answer engines.",
      });
    if (!schemaDetails.some((s) => s.type === "BreadcrumbList"))
      issues.push({
        severity: "low",
        category: "schema",
        issue: "Missing BreadcrumbList schema",
        fix: "Add BreadcrumbList schema to improve navigation understanding and rich snippets.",
      });
    if (!hasOrgOrPerson)
      issues.push({
        severity: "low",
        category: "schema",
        issue: "Missing Organization or Person schema",
        fix: "Add Organization schema with name, logo, and contact info for entity recognition.",
      });
  }
  if (!hasFaq && /faq|frequently asked/.test(lowered))
    issues.push({
      severity: "medium",
      category: "content",
      issue: "FAQ content detected but no FAQPage schema",
      fix: "Wrap your FAQ section with FAQPage structured data for rich answer results.",
    });

  // Author/date issues
  if (!authorName)
    issues.push({
      severity: "low",
      category: "metadata",
      issue: "No author information found",
      fix: 'Add author attribution via <meta name="author"> or visible byline — important for AI engine trust.',
    });
  if (!publishDate)
    issues.push({
      severity: "low",
      category: "content",
      issue: "No publication date found",
      fix: 'Add a visible publish date or <meta property="article:published_time"> to signal content freshness.',
    });
  if (publishDate) {
    const pubAgeDays = (Date.now() - new Date(publishDate).getTime()) / 86400000;
    if (pubAgeDays > 365)
      issues.push({
        severity: "low",
        category: "content",
        issue: "Content is over a year old",
        fix: "Review and update older content to keep it fresh and relevant.",
      });
  }

  // Snippet structure issues
  if (!hasTableOfContents)
    issues.push({
      severity: "low",
      category: "structure",
      issue: "No table of contents detected",
      fix: "Add a table of contents or 'on this page' navigation for long-form content.",
    });
  if (!hasConclusionSection && wordCount > 500)
    issues.push({
      severity: "low",
      category: "content",
      issue: "No conclusion or summary section found",
      fix: "Add a concluding section summarizing key points — helps AI engines extract takeaways.",
    });
  if (paragraphCount > 0) {
    const longParagraphs = paragraphs.filter(
      (p) => p.split(/\s+/).filter(Boolean).length > 100,
    ).length;
    if (longParagraphs > 0)
      issues.push({
        severity: "low",
        category: "readability",
        issue: `${longParagraphs} very long paragraph(s) (>100 words)`,
        fix: "Break long paragraphs into shorter chunks of 3–4 sentences for better readability.",
      });
  }

  // Keyword issues
  const hasKeywordInH1 =
    h1s.length > 0 &&
    topKeywords.length > 0 &&
    topKeywords[0] &&
    stripTags(h1s[0][0]).toLowerCase().includes(topKeywords[0].word);
  if (topKeywords.length > 0 && !hasKeywordInH1 && h1s.length > 0) {
    const firstKeyword = topKeywords[0].word;
    issues.push({
      severity: "low",
      category: "content",
      issue: `Top keyword "${firstKeyword}" not found in H1`,
      fix: "Include your primary keyword in the H1 heading for topic relevance.",
    });
  }

  // -- Summary --
  const highCount = issues.filter((i) => i.severity === "high").length;
  const medCount = issues.filter((i) => i.severity === "medium").length;
  const lowCount = issues.filter((i) => i.severity === "low").length;
  const qualityLabel =
    overall >= 80
      ? "Looking good!"
      : overall >= 60
        ? "Room for improvement."
        : overall >= 40
          ? "Significant work needed."
          : "Major overhaul recommended.";
  const summary =
    `Analyzed ${finalUrl} — overall SEO score ${overall}/100. ` +
    `Metadata ${metadataScore}, Technical ${technicalScore}, Content ${contentScore}, ` +
    `Readability ${fleschReadingEase}/100, AI Visibility ${aiVisibility}/100. ` +
    (issues.length
      ? `Found ${highCount} critical, ${medCount} warning, and ${lowCount} minor issues. ` +
        `Top issue: "${issues[0].issue}". ${qualityLabel}`
      : `No major issues detected. ${qualityLabel}`);

  return {
    url,
    finalUrl,
    fetchedAt: new Date().toISOString(),
    htmlSize: pageSize,

    scores: {
      overall,
      metadata: metadataScore,
      technical: technicalScore,
      structure: structureScore,
      content: contentScore,
      readability: readabilityScore,
      images: imagesScore,
      links: linksScore,
      social: socialScore,
      schema: schemaScore,
      aiVisibility,
    },

    aiEngines,

    aiEngineDetails,

    metadata: {
      title,
      titleLength,
      description,
      descriptionLength,
      canonical: canonicalHref,
      robots,
      lang,
      hasViewport,
      viewportContent,
      hasCharset,
      charset,
      hasDoctype,
      hasFavicon,
      faviconHref,
      hasHreflang,
      hreflangTags,
      hasCSP,
      hasXUACompatible,
      hasHttpEquivRefresh,
      pageSize,

      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      ogUrl,
      hasOpenGraph,
      twitterCard,
      twitterSite,
      twitterCreator,
      hasTwitterCard,

      h1Count,
      h2Count,
      h3Count,
      h4Count,
      h5Count,
      h6Count,
      headingHierarchyStatus,
      headingsAsQuestions,
      questionHeadings,

      wordCount,
      paragraphCount,
      avgParagraphLength: Math.round(avgParagraphLength * 10) / 10,
      fleschReadingEase,
      fleschGradeLevel,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      complexWordPercentage,
      sentenceCount,
      longSentenceCount,
      shortSentenceCount,
      bulletListCount,
      numberedListCount,
      tableCount,
      blockquoteCount,
      codeBlockCount,
      boldCount,
      iframeCount,

      hasHeader,
      hasNav,
      hasMain,
      hasArticle,
      hasSection,
      hasAside,
      hasFooter,
      semanticElementCount,

      imageCount,
      imagesMissingAlt,
      imagesWithAlt,
      imagesWithDescriptiveAlt,
      imagesWithGenericAlt,
      imagesWithSrcset,
      imagesWithLazyLoading,
      imageFormats,

      internalLinks,
      externalLinks,
      nofollowLinks,
      sponsoredLinks,
      ugcLinks,
      totalLinks,
      internalLinksFound,
      genericLinkTexts,
      emptyLinkCount,

      hasSchema,
      schemaTypes: Array.from(new Set(schemaTypes)),
      schemaDetails,

      authorName,
      publishDate,
      modifiedDate,

      datedEntities: Array.from(new Set(datedEntities)),
      capitalizedPhrases: capitalizedPhrases.slice(0, 30),
      entityCount: capitalizedPhrases.length,

      hasFaq,
      hasDefinitionIntro,
      hasConclusionSection,
      hasTableOfContents,
      numberedStepsCount,
      totalLists,

      topKeywords: topKeywords.slice(0, 20),

      readingTime,
      contentToHtmlRatio,
      dlCount,
      videoCount,
      allHeadingTexts,
      nGrams,
      freshnessDays,
    },

    issues,
    summary,
  };
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("URL is required");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
