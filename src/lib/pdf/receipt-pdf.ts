import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { VEHICLE_BY_ID, getLocation } from "@/lib/data/catalog";
import { pathLabel } from "@/lib/data/calculator";
import { formatDateVi, formatKm, formatVnd } from "@/lib/format";
import type { Receipt } from "@/lib/store";

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 48;

const ink = rgb(21 / 255, 32 / 255, 28 / 255);
const muted = rgb(92 / 255, 104 / 255, 100 / 255);
const primary = rgb(28 / 255, 92 / 255, 82 / 255);
const line = rgb(212 / 255, 205 / 255, 192 / 255);
const headerBg = rgb(18 / 255, 26 / 255, 24 / 255);
const white = rgb(1, 1, 1);
const warn = rgb(138 / 255, 90 / 255, 40 / 255);
const paper = rgb(255 / 255, 252 / 255, 247 / 255);
const rowBg = rgb(243 / 255, 239 / 255, 230 / 255);

let fontBytes: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;

async function loadFontBytes() {
  if (fontBytes) return fontBytes;
  const [regular, bold] = await Promise.all([
    fetch("/fonts/DejaVuSans.ttf").then((r) => {
      if (!r.ok) throw new Error("Không tải được font");
      return r.arrayBuffer();
    }),
    fetch("/fonts/DejaVuSans-Bold.ttf").then((r) => {
      if (!r.ok) throw new Error("Không tải được font");
      return r.arrayBuffer();
    }),
  ]);
  fontBytes = { regular, bold };
  return fontBytes;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  const push = (s: string) => {
    if (s) lines.push(s);
  };
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
      current = trial;
      continue;
    }
    push(current);
    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
      continue;
    }
    let chunk = "";
    for (const ch of word) {
      const next = chunk + ch;
      if (font.widthOfTextAtSize(next, size) <= maxWidth) chunk = next;
      else {
        push(chunk);
        chunk = ch;
      }
    }
    current = chunk;
  }
  push(current);
  return lines.length ? lines : [""];
}

function drawCentered(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: (A4.width - w) / 2,
    y,
    font,
    size,
    color,
  });
}

export function receiptPdfFilename(receipt: Receipt): string {
  return `Phieu_${receipt.number}.pdf`;
}

export async function buildReceiptPdf(receipt: Receipt): Promise<Uint8Array> {
  const fonts = await loadFontBytes();
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const regular = await doc.embedFont(fonts.regular, { subset: true });
  const bold = await doc.embedFont(fonts.bold, { subset: true });

  const vehicle = VEHICLE_BY_ID[receipt.vehicleId];
  const start = getLocation(receipt.path[0] ?? "van-phong");
  const contentWidth = A4.width - MARGIN * 2;

  let page = doc.addPage([A4.width, A4.height]);
  page.drawRectangle({ x: 0, y: 0, width: A4.width, height: A4.height, color: paper });

  const ensureSpace = (need: number, y: number) => {
    if (y - need > 56) return y;
    page = doc.addPage([A4.width, A4.height]);
    page.drawRectangle({ x: 0, y: 0, width: A4.width, height: A4.height, color: paper });
    return A4.height - 40;
  };

  // Header: white background, black text, same font/sizes as before
  page.drawRectangle({ x: 0, y: A4.height - 96, width: A4.width, height: 96, color: white });
  drawCentered(page, "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", A4.height - 28, regular, 8, ink);
  drawCentered(page, "Độc lập — Tự do — Hạnh phúc", A4.height - 42, regular, 8, ink);
  drawCentered(page, "CÔNG TY CỔ PHẦN GIONG VIỆT NAM", A4.height - 64, bold, 13, ink);
  drawCentered(page, "Phiếu tính phụ cấp vận chuyển", A4.height - 82, regular, 11, ink);

  let y = A4.height - 120;

  const info = [
    ["Số phiếu", receipt.number, "Ngày vận chuyển", formatDateVi(receipt.date)],
    ["Người vận chuyển", receipt.employeeName, "Phương tiện", vehicle.name],
  ];

  const col = contentWidth / 2;
  const rowH = 32;
  const boxX = MARGIN;
  const boxW = contentWidth;
  const boxH = rowH * 2;
  page.drawRectangle({
    x: boxX,
    y: y - boxH,
    width: boxW,
    height: boxH,
    borderColor: line,
    borderWidth: 0.8,
    color: white,
  });
  page.drawLine({
    start: { x: boxX + col, y: y },
    end: { x: boxX + col, y: y - boxH },
    thickness: 0.6,
    color: line,
  });
  page.drawLine({
    start: { x: boxX, y: y - rowH },
    end: { x: boxX + boxW, y: y - rowH },
    thickness: 0.6,
    color: line,
  });

  info.forEach((row, i) => {
    const top = y - i * rowH;
    page.drawText(row[0], { x: boxX + 8, y: top - 12, font: regular, size: 7.5, color: muted });
    page.drawText(row[1], { x: boxX + 8, y: top - 25, font: bold, size: 10, color: ink });
    page.drawText(row[2], { x: boxX + col + 8, y: top - 12, font: regular, size: 7.5, color: muted });
    page.drawText(row[3], { x: boxX + col + 8, y: top - 25, font: bold, size: 10, color: ink });
  });

  y -= boxH + 16;

  page.drawText("Điểm bắt đầu", { x: MARGIN, y, font: regular, size: 7.5, color: muted });
  y -= 13;
  page.drawText(start.name, { x: MARGIN, y, font: bold, size: 10, color: ink });
  y -= 16;
  page.drawText("Lộ trình", { x: MARGIN, y, font: regular, size: 7.5, color: muted });
  y -= 13;
  const routeLines = wrapText(pathLabel(receipt.path), bold, 10, contentWidth);
  for (const ln of routeLines) {
    y = ensureSpace(14, y);
    page.drawText(ln, { x: MARGIN, y, font: bold, size: 10, color: ink });
    y -= 13;
  }

  y -= 10;
  y = ensureSpace(40, y);

  // Table header
  const cols = { stt: MARGIN, route: MARGIN + 36, km: A4.width - MARGIN - 70 };
  const headerY = y;
  page.drawRectangle({
    x: MARGIN,
    y: headerY - 18,
    width: contentWidth,
    height: 22,
    color: rowBg,
  });
  page.drawText("STT", { x: cols.stt + 8, y: headerY - 12, font: bold, size: 8, color: muted });
  page.drawText("Chặng", { x: cols.route, y: headerY - 12, font: bold, size: 8, color: muted });
  page.drawText("Km", { x: cols.km + 30, y: headerY - 12, font: bold, size: 8, color: muted });
  y = headerY - 26;

  receipt.legs.forEach((leg, i) => {
    const fromId = leg.fromId || leg.from;
    const toId = leg.toId || leg.to;
    const from = getLocation(fromId).name.replace("Văn phòng (Ngọc Lâm)", "Văn phòng");
    const to = getLocation(toId).name;
    const label = `${from}  →  ${to}${leg.estimated ? "  (ước tính)" : ""}`;
    const wrapped = wrapText(label, regular, 9, cols.km - cols.route - 8);
    const h = Math.max(20, wrapped.length * 12 + 8);
    y = ensureSpace(h + 4, y);
    if (i % 2 === 1) {
      page.drawRectangle({
        x: MARGIN,
        y: y - h + 8,
        width: contentWidth,
        height: h,
        color: rgb(0.98, 0.97, 0.94),
      });
    }
    page.drawText(String(i + 1), { x: cols.stt + 10, y: y - 4, font: regular, size: 9, color: ink });
    wrapped.forEach((ln, li) => {
      page.drawText(ln, { x: cols.route, y: y - 4 - li * 12, font: regular, size: 9, color: ink });
    });
    const kmText = formatKm(leg.km);
    const kmW = regular.widthOfTextAtSize(kmText, 9);
    page.drawText(kmText, { x: A4.width - MARGIN - 12 - kmW, y: y - 4, font: regular, size: 9, color: ink });
    y -= h;
    page.drawLine({
      start: { x: MARGIN, y: y + 6 },
      end: { x: A4.width - MARGIN, y: y + 6 },
      thickness: 0.4,
      color: line,
    });
  });

  y -= 18;
  y = ensureSpace(120, y);

  const rows: Array<[string, string, boolean?]> = [
    ["Tổng quãng đường", `${formatKm(receipt.totalKm)} km`],
  ];
  if (receipt.noAllowanceOnly) {
    rows.push(["Ghi chú khoán", "Long Biên / Ngọc Lâm / Sài Đồng — không áp dụng khoán", true]);
  } else {
    rows.push(["Phí mở chuyến", formatVnd(receipt.baseFee)]);
    rows.push([`${formatKm(receipt.totalKm)} km × ${formatVnd(receipt.perKmFee)}/km`, formatVnd(receipt.kmAmount)]);
    if (receipt.nightSurcharge) rows.push(["Phụ phí ban đêm / ngoài giờ", "+15%"]);
    if (receipt.holidaySurcharge) rows.push(["Phụ phí lễ, Tết", "+20%"]);
    if (receipt.surchargeAmount > 0) rows.push(["Tiền phụ phí", formatVnd(receipt.surchargeAmount)]);
  }

  for (const [k, v, isWarn] of rows) {
    y = ensureSpace(16, y);
    page.drawText(k, { x: MARGIN, y, font: regular, size: 9, color: isWarn ? warn : muted });
    const vw = (isWarn ? regular : bold).widthOfTextAtSize(v, 9);
    page.drawText(v, {
      x: A4.width - MARGIN - vw,
      y,
      font: isWarn ? regular : bold,
      size: 9,
      color: isWarn ? warn : ink,
    });
    y -= 16;
  }

  y -= 6;
  y = ensureSpace(36, y);
  page.drawLine({
    start: { x: MARGIN, y: y + 12 },
    end: { x: A4.width - MARGIN, y: y + 12 },
    thickness: 0.8,
    color: line,
  });
  page.drawText("TỔNG PHỤ CẤP", { x: MARGIN, y, font: bold, size: 11, color: ink });
  const total = formatVnd(receipt.totalAmount);
  const tw = bold.widthOfTextAtSize(total, 14);
  page.drawText(total, { x: A4.width - MARGIN - tw, y: y - 2, font: bold, size: 14, color: primary });

  if (receipt.notes) {
    y -= 28;
    y = ensureSpace(28, y);
    page.drawText("Ghi chú", { x: MARGIN, y, font: regular, size: 7.5, color: muted });
    y -= 13;
    for (const ln of wrapText(receipt.notes, regular, 9, contentWidth)) {
      y = ensureSpace(13, y);
      page.drawText(ln, { x: MARGIN, y, font: regular, size: 9, color: ink });
      y -= 13;
    }
  }

  if (receipt.evidence.length > 0) {
    y -= 10;
    y = ensureSpace(20, y);
    page.drawText("Chứng cứ GPS", { x: MARGIN, y, font: bold, size: 9, color: ink });
    y -= 14;
    for (const e of receipt.evidence) {
      const status =
        e.matchStatus === "Matched"
          ? `khớp ${e.matchedLocation ?? ""}`
          : e.matchStatus === "No_GPS"
            ? "không có GPS"
            : "không khớp";
      const lineText = `${e.name} — ${status}`;
      for (const ln of wrapText(lineText, regular, 8.5, contentWidth)) {
        y = ensureSpace(12, y);
        page.drawText(ln, { x: MARGIN, y, font: regular, size: 8.5, color: muted });
        y -= 12;
      }
    }
  }

  y -= 36;
  y = ensureSpace(70, y);
  const sigW = contentWidth / 3;
  const labels = ["Người vận chuyển", "Kế toán", "Người duyệt"];
  const hints = ["(Ký, ghi rõ họ tên)", "(Ký)", "(Ký)"];
  labels.forEach((label, i) => {
    const cx = MARGIN + sigW * i + sigW / 2;
    const lw = bold.widthOfTextAtSize(label, 9);
    page.drawText(label, { x: cx - lw / 2, y, font: bold, size: 9, color: ink });
    const hw = regular.widthOfTextAtSize(hints[i], 7.5);
    page.drawText(hints[i], { x: cx - hw / 2, y: y - 12, font: regular, size: 7.5, color: muted });
  });

  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const footer = `QC-GIONG  ·  Phụ cấp vận chuyển nội bộ  ·  Trang ${i + 1}/${pages.length}`;
    const fw = regular.widthOfTextAtSize(footer, 7);
    p.drawText(footer, {
      x: (A4.width - fw) / 2,
      y: 28,
      font: regular,
      size: 7,
      color: muted,
    });
  });

  doc.setTitle(`Phiếu ${receipt.number} — Giong Việt Nam`);
  doc.setAuthor("Công ty cổ phần Giong Việt Nam");
  doc.setSubject("Phiếu tính phụ cấp vận chuyển nội bộ");

  return doc.save();
}

export function pdfBlob(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: "application/pdf" });
}

export function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  return url;
}
