import { createFileRoute } from "@tanstack/react-router";
import { runCrawl, type CrawlConfig } from "@/lib/crawler";

export const Route = createFileRoute("/api/crawl")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as {
            url?: string;
            maxPages?: number;
            maxDepth?: number;
            respectRobotsTxt?: boolean;
          };

          if (!body.url || typeof body.url !== "string") {
            return Response.json({ error: "Missing 'url' in request body" }, { status: 400 });
          }

          const config: CrawlConfig = {
            startUrl: body.url,
            maxPages: Math.min(Math.max(body.maxPages ?? 10, 1), 30),
            maxDepth: Math.min(Math.max(body.maxDepth ?? 1, 0), 3),
            respectRobotsTxt: body.respectRobotsTxt ?? true,
          };

          const result = await runCrawl(config);
          return Response.json(result);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Unknown error";
          return Response.json({ error: msg }, { status: 500 });
        }
      },
    },
  },
});
