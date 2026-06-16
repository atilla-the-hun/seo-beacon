import { createFileRoute } from "@tanstack/react-router";
import { analyzeHtml, normalizeUrl } from "@/lib/seo-analyzer";

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as { url?: string };
          if (!body.url || typeof body.url !== "string") {
            return Response.json({ error: "Missing 'url' in request body" }, { status: 400 });
          }
          const url = normalizeUrl(body.url);

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10_000);

          let res: Response;
          try {
            res = await fetch(url, {
              redirect: "follow",
              signal: controller.signal,
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (compatible; SEOVisibilityBot/1.0; +https://lovable.dev)",
                Accept: "text/html,application/xhtml+xml",
              },
            });
          } catch (e) {
            clearTimeout(timeout);
            const msg = e instanceof Error ? e.message : "fetch failed";
            return Response.json(
              { error: `Could not fetch site: ${msg}. The site may block bots or be unreachable.` },
              { status: 502 },
            );
          }
          clearTimeout(timeout);

          if (!res.ok) {
            return Response.json(
              { error: `Site responded with ${res.status} ${res.statusText}.` },
              { status: 502 },
            );
          }

          const contentType = res.headers.get("content-type") || "";
          if (!/text\/html|application\/xhtml/i.test(contentType)) {
            return Response.json(
              { error: `Unsupported content-type: ${contentType}` },
              { status: 415 },
            );
          }

          const html = await res.text();
          if (!html || html.length < 50) {
            return Response.json(
              { error: "Page returned empty or near-empty HTML." },
              { status: 422 },
            );
          }

          const result = analyzeHtml(url, res.url || url, html);
          return Response.json(result);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Unknown error";
          return Response.json({ error: msg }, { status: 500 });
        }
      },
    },
  },
});
