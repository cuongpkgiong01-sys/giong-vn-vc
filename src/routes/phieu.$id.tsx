import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileDown, Loader2, PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReceiptView } from "@/components/receipt/receipt-view";
import { PdfViewer } from "@/components/receipt/pdf-viewer";
import { useAppStore } from "@/lib/store";
import { buildReceiptPdf, downloadPdf, pdfBlob, receiptPdfFilename } from "@/lib/pdf/receipt-pdf";

export const Route = createFileRoute("/phieu/$id")({ component: ReceiptDetailPage });

function ReceiptDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const receipt = useAppStore((s) => s.receipts.find((r) => r.id === id));
  const deleteReceipt = useAppStore((s) => s.deleteReceipt);
  const [busy, setBusy] = useState(false);
  const [viewer, setViewer] = useState<{ url: string; filename: string } | null>(null);

  if (!receipt) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-xl font-semibold">Không tìm thấy phiếu</h1>
        <p className="mt-2 text-sm text-muted-foreground">Phiếu có thể đã bị xóa trên thiết bị này.</p>
        <Button asChild className="mt-6">
          <Link to="/phieu">Quay lại sổ phiếu</Link>
        </Button>
      </div>
    );
  }

  async function savePdf() {
    if (!receipt) return;
    setBusy(true);
    try {
      const bytes = await buildReceiptPdf(receipt);
      const blob = pdfBlob(bytes);
      const filename = receiptPdfFilename(receipt);
      const url = downloadPdf(blob, filename);
      setViewer({ url, filename });
      toast.success("Đã lưu PDF");
    } catch (err) {
      console.error(err);
      toast.error("Không tạo được PDF. Thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="no-print flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/phieu">
            <ArrowLeft className="size-4" />
            Sổ phiếu
          </Link>
        </Button>
        <div className="ml-auto flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate({ to: "/chuyen-moi", search: { edit: receipt.id } })}
          >
            <PencilLine className="size-4" />
            Sửa phiếu
          </Button>
          <Button size="sm" onClick={() => void savePdf()} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
            {busy ? "Đang tạo PDF…" : "Lưu PDF"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              void (async () => {
                try {
                  await deleteReceipt(receipt.id);
                  toast.success("Đã xóa phiếu");
                  await navigate({ to: "/phieu" });
                } catch (error) {
                  console.error(error);
                  toast.error("Không xóa được phiếu trên máy chủ.");
                }
              })();
            }}
          >
            <Trash2 className="size-4" />
            Xóa
          </Button>
        </div>
      </div>
      <ReceiptView receipt={receipt} />

      {viewer ? (
        <PdfViewer
          url={viewer.url}
          title={`Phiếu ${receipt.number}`}
          filename={viewer.filename}
          onClose={() => {
            URL.revokeObjectURL(viewer.url);
            setViewer(null);
          }}
        />
      ) : null}
    </div>
  );
}
