import { useState, useEffect } from "react";

const FORMSPREE_URL = "https://formspree.io/f/xgobllog";
const LS_KEY = "ai-seo-email-subscribed";

export function EmailBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(LS_KEY) === "true");
  }, []);

  if (hidden) return null;

  if (status === "success") {
    return (
      <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-center text-sm text-success">
        Thanks for subscribing!
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      localStorage.setItem(LS_KEY, "true");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-glass-border bg-card/30 px-4 py-4 sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">
          Get weekly SEO insights
        </div>
        <div className="text-xs text-muted-foreground">
          No spam, unsubscribe anytime.
        </div>
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "submitting"}
          className="min-w-0 flex-1 rounded-lg border border-glass-border bg-card/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none sm:w-48"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
        >
          {status === "submitting" ? "Sending..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <div className="text-xs text-destructive">
          Something went wrong. Please try again.
        </div>
      )}
    </form>
  );
}
