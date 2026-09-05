import { getLocation } from "@/lib/data/catalog";
import { VEHICLE_BY_ID } from "@/lib/data/catalog";
import { formatDateVi, formatKm, formatVnd } from "@/lib/format";
import type { Receipt } from "@/lib/store";
import { pathLabel } from "@/lib/data/calculator";

export function ReceiptView({ receipt }: { receipt: Receipt }) {
  const vehicle = VEHICLE_BY_ID[receipt.vehicleId];
  const start = getLocation(receipt.path[0] ?? "van-phong");

  return (
    <article className="mx-auto max-w-2xl bg-card px-6 py-8 text-foreground shadow-[var(--shadow-border)] print:max-w-none print:shadow-none">
      <header className="border-b border-border pb-5 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Cộng hòa xã hội chủ nghĩa Việt Nam
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Độc lập — Tự do — Hạnh phúc</p>
        <h1 className="mt-5 text-lg font-semibold tracking-tight">Công ty cổ phần Giong Việt Nam</h1>
        <p className="mt-1 text-sm text-muted-foreground">Hệ thống tính phụ cấp vận chuyển nội bộ</p>
        <h2 className="mt-5 text-xl font-semibold">Phiếu tính phụ cấp vận chuyển</h2>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Số phiếu</dt>
          <dd className="font-medium tabular-nums">{receipt.number}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Ngày vận chuyển</dt>
          <dd className="font-medium">{formatDateVi(receipt.date)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Người vận chuyển</dt>
          <dd className="font-medium">{receipt.employeeName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Phương tiện</dt>
          <dd className="font-medium">{vehicle.name}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted-foreground">Điểm bắt đầu</dt>
          <dd className="font-medium">{start.name}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted-foreground">Lộ trình</dt>
          <dd className="font-medium">{pathLabel(receipt.path)}</dd>
        </div>
      </dl>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-y border-border text-left text-muted-foreground">
            <th className="py-2 font-medium">STT</th>
            <th className="py-2 font-medium">Chặng</th>
            <th className="py-2 text-right font-medium">Km</th>
          </tr>
        </thead>
        <tbody>
          {receipt.legs.map((leg, i) => {
            const fromId = leg.fromId || leg.from;
            const toId = leg.toId || leg.to;
            const fromName = getLocation(fromId).name.replace("Văn phòng (Ngọc Lâm)", "Văn phòng");
            const toName = getLocation(toId).name;
            return (
              <tr key={`${fromId}-${toId}-${i}`} className="border-b border-border/70">
                <td className="py-2 tabular-nums">{i + 1}</td>
                <td className="py-2">
                  {fromName}
                  {" → "}
                  {toName}
                  {leg.estimated ? <span className="ml-2 text-xs text-warn">ước tính</span> : null}
                </td>
                <td className="py-2 text-right tabular-nums">{formatKm(leg.km)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Tổng quãng đường</dt>
          <dd className="tabular-nums">{formatKm(receipt.totalKm)} km</dd>
        </div>
        {receipt.noAllowanceOnly ? (
          <p className="text-warn">Điểm Long Biên / Ngọc Lâm / Sài Đồng — không áp dụng khoán.</p>
        ) : (
          <>
            <div className="flex justify-between">
              <dt>Phí mở chuyến</dt>
              <dd className="tabular-nums">{formatVnd(receipt.baseFee)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>
                {formatKm(receipt.totalKm)} km × {formatVnd(receipt.perKmFee)}/km
              </dt>
              <dd className="tabular-nums">{formatVnd(receipt.kmAmount)}</dd>
            </div>
            {receipt.nightSurcharge ? (
              <div className="flex justify-between">
                <dt>Phụ phí ban đêm / ngoài giờ +15%</dt>
                <dd className="tabular-nums">có</dd>
              </div>
            ) : null}
            {receipt.holidaySurcharge ? (
              <div className="flex justify-between">
                <dt>Phụ phí lễ, Tết +20%</dt>
                <dd className="tabular-nums">có</dd>
              </div>
            ) : null}
            {receipt.surchargeAmount > 0 ? (
              <div className="flex justify-between">
                <dt>Tiền phụ phí</dt>
                <dd className="tabular-nums">{formatVnd(receipt.surchargeAmount)}</dd>
              </div>
            ) : null}
          </>
        )}
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
          <dt>Tổng phụ cấp</dt>
          <dd className="tabular-nums text-primary">{formatVnd(receipt.totalAmount)}</dd>
        </div>
      </dl>

      {receipt.notes ? (
        <p className="mt-4 text-sm text-muted-foreground">Ghi chú: {receipt.notes}</p>
      ) : null}

      {receipt.evidence.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-medium">Chứng cứ GPS</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {receipt.evidence.map((e) => (
              <li key={e.id}>
                {e.name} — {e.matchStatus === "Matched" ? `khớp ${e.matchedLocation}` : e.matchStatus === "No_GPS" ? "không có GPS" : "không khớp"}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-12 grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <p className="font-medium">Người vận chuyển</p>
          <p className="mt-1 text-xs text-muted-foreground">(Ký, ghi rõ họ tên)</p>
        </div>
        <div>
          <p className="font-medium">Kế toán</p>
          <p className="mt-1 text-xs text-muted-foreground">(Ký)</p>
        </div>
        <div>
          <p className="font-medium">Người duyệt</p>
          <p className="mt-1 text-xs text-muted-foreground">(Ký)</p>
        </div>
      </div>
    </article>
  );
}
