import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLUSTERS,
  LOCATION_BY_ID,
  ROUTES,
  VEHICLE_BY_ID,
  singleHopRate,
  type ClusterId,
} from "@/lib/data/catalog";
import { formatKm, formatVnd } from "@/lib/format";

export const Route = createFileRoute("/dinh-muc")({ component: RatesPage });

function RatesPage() {
  const [q, setQ] = useState("");
  const [cluster, setCluster] = useState<"all" | ClusterId | "vp">("all");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ROUTES.filter((r) => {
      if (cluster === "vp") return r.kind === "vp";
      if (cluster !== "all") {
        const a = LOCATION_BY_ID[r.fromId];
        const b = LOCATION_BY_ID[r.toId];
        return a.cluster === cluster && b.cluster === cluster;
      }
      return true;
    }).filter((r) => {
      if (!query) return true;
      const a = LOCATION_BY_ID[r.fromId].name;
      const b = LOCATION_BY_ID[r.toId].name;
      return `${a} ${b}`.toLowerCase().includes(query);
    });
  }, [q, cluster]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Phụ lục 01</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Bảng định mức khoán</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mức khi đi 1 điểm đã gồm phí mở chuyến, làm tròn đến nghìn. Đi nhiều điểm: phí mở 1 lần + tổng km.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Xe máy</p>
            <p className="mt-1 text-lg font-semibold">10.000 đ + 4.000 đ/km (Từ Sơn) · 5.000 đ/km (Mê Linh, Thanh Oai)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Ô tô</p>
            <p className="mt-1 text-lg font-semibold">20.000 đ + 8.000 đ/km</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Tìm tuyến…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:flex-1" />
        <Select value={cluster} onValueChange={(v) => setCluster(v as typeof cluster)}>
          <SelectTrigger className="sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tuyến</SelectItem>
            <SelectItem value="vp">Văn phòng → điểm</SelectItem>
            {CLUSTERS.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                Nội bộ {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Tuyến</th>
                <th className="px-4 py-3 font-medium">Loại</th>
                <th className="px-4 py-3 text-right font-medium">Km</th>
                <th className="px-4 py-3 text-right font-medium">Xe máy</th>
                <th className="px-4 py-3 text-right font-medium">Ô tô</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const from = LOCATION_BY_ID[r.fromId];
                const to = LOCATION_BY_ID[r.toId];
                const skipPay = to.noAllowance && r.kind === "vp";
                const bikePerKm = to.cluster === "tu-son" ? 4000 : 5000;
                const bikeVehicle = { ...VEHICLE_BY_ID["xe-may"], perKmFee: bikePerKm };
                return (
                  <tr key={`${r.fromId}-${r.toId}`} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3">
                      {from.name.replace("Văn phòng (Ngọc Lâm)", "Văn phòng")} → {to.name}
                    </td>
                    <td className="px-4 py-3">
                      {skipPay ? (
                        <Badge variant="muted">Không khoán</Badge>
                      ) : (
                        <Badge variant="secondary">{r.kind === "vp" ? "Từ VP" : "Nội bộ"}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatKm(r.km)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {skipPay ? "—" : formatVnd(singleHopRate(r.km, bikeVehicle))}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {skipPay ? "—" : formatVnd(singleHopRate(r.km, VEHICLE_BY_ID["o-to"]))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ví dụ đa điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Văn phòng → Từ Sơn (12,2 km) xe máy → 10.000 + 12,2 × 4.000 = 58.800 đ</p>
          <p>Văn phòng → Từ Sơn → Hương Mạc (19,8 km) xe máy → 10.000 + 19,8 × 4.000 = 89.200 đ (chỉ mở 1 lần)</p>
          <p>Văn phòng → Mê Linh (30,9 km) ô tô → 20.000 + 30,9 × 8.000 = 267.200 đ</p>
        </CardContent>
      </Card>
    </div>
  );
}
