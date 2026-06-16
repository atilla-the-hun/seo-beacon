import { useState, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

interface Props {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
  onCustomCapture?: () => Promise<void>;
}

export function PdfReportButton({ targetRef, fileName, onCustomCapture }: Props) {
  const [mounted, setMounted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleGenerate = async () => {
    setError(null);

    if (onCustomCapture) {
      setGenerating(true);
      try {
        await onCustomCapture();
        setError(null);
      } catch (err) {
        console.error("Custom PDF capture failed:", err);
        setError("Visual PDF capture failed. Try fewer pages or a shorter URL.");
      } finally {
        setGenerating(false);
      }
      return;
    }

    if (!targetRef.current) {
      setError("Report content not available for capture.");
      return;
    }
    setGenerating(true);
    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#0c0a1a",
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const name = fileName ?? "ai-ready-seo-report";
      pdf.save(`${name}.pdf`);
    } catch (err) {
      console.error("Visual PDF failed:", err);
      setError("Could not capture the page. The browser may not support this feature.");
    } finally {
      setGenerating(false);
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleGenerate}
      disabled={generating}
      className="flex items-center gap-2 rounded-lg border border-glass-border bg-card/40 px-4 py-2 text-sm transition-all hover:bg-card/60 disabled:opacity-50"
      title={error ?? undefined}
    >
      {generating ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )}
      <span>
        {generating ? "Generating..." : error ? "PDF failed" : "Download PDF"}
      </span>
    </button>
  );
}
