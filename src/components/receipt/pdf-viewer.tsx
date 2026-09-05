import { useEffect, useRef } from "react";
import { Download, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PdfViewer({
  url,
  title,
  filename,
  onClose,
}: {
  url: string;
  title: string;
  filename: string;
  onClose: () => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  function handlePrint() {
    const frame = frameRef.current;
    try {
      frame?.contentWindow?.focus();
      frame?.contentWindow?.print();
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  function handleDownload() {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ink"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <header className="no-print flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-3 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">{title}</p>
          <p className="truncate text-xs text-sidebar-muted">Đã lưu PDF — in hoặc đóng khi xong</p>
        </div>
        <Button variant="outline" size="sm" onClick={handlePrint} className="hidden border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent sm:inline-flex">
          <Printer className="size-4" />
          In
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} className="hidden border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent sm:inline-flex">
          <Download className="size-4" />
          Tải xuống
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrint}
          className="text-sidebar-foreground hover:bg-sidebar-accent sm:hidden"
          aria-label="In"
        >
          <Printer className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          className="text-sidebar-foreground hover:bg-sidebar-accent sm:hidden"
          aria-label="Tải xuống"
        >
          <Download className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
          aria-label="Đóng"
        >
          <X className="size-4" />
        </Button>
      </header>
      <div className="min-h-0 flex-1 bg-muted">
        <iframe
          ref={frameRef}
          title={title}
          src={url}
          className="h-full w-full border-0 bg-card"
        />
      </div>
    </div>
  );
}
