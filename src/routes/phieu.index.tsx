import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VEHICLE_BY_ID } from "@/lib/data/catalog";
import { pathLabel } from "@/lib/data/calculator";
import { formatDateVi, formatKm, formatVnd } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/phieu/")({ component: PhieuList });

function PhieuList() {
  const receipts = useAppStore((s) => s.receipts);
  const employees = useAppStore((s) => s.employees);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employee, setEmployee] = useState("all");
  const [vehicle, setVehicle] = useState("all");

  const sorted = useMemo(
    () => [...receipts].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    [receipts],
  );

  const filtered = useMemo(() => {
    return sorted.filter((r) => {
      if (fromDate && r.date < fromDate) return false;
      if (toDate && r.date > toDate) return false;
      if (employee !== "all" && r.employeeName !== employee) return false;
      if (vehicle !== "all" && r.vehicleId !== vehicle) return false;
      return true;
    });
  }, [sorted, fromDate, toDate, employee, vehicle]);

  const totalKm = filtered.reduce((sum, r) => sum + r.totalKm, 0);
  const totalAmount = filtered.reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Phiếu phụ cấp</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tổng cộng <span className="font-medium text-foreground">{sorted.length}</span> phiếu đã ghi nhận
          </p>
        </div>
        <Button asChild>
          <Link to="/chuyen-moi">Tạo chuyến mới</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lọc dữ liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-5">
            <label className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Từ ngày</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-ring"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Đến ngày</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-ring"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Người VC</span>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
              >
                <option value="all">Tất cả</option>
                {employees.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phương tiện</span>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
              >
                <option value="all">Tất cả</option>
                {Object.entries(VEHICLE_BY_ID).map(([id, v]) => (
                  <option key={id} value={id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setEmployee("all");
                  setVehicle("all");
                }}
                className="w-full"
              >
                Xóa lọc
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Phiếu lọc</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{filtered.length}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Tổng KM</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{formatKm(totalKm)}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Tổng tiền</p>
              <p className="mt-1 text-xl font-semibold text-primary">{formatVnd(totalAmount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 size-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">Chưa có phiếu nào</p>
            <p className="mt-1 text-sm text-muted-foreground">Hãy tạo chuyến đầu tiên để bắt đầu</p>
            <Button asChild className="mt-4">
              <Link to="/chuyen-moi">Tạo chuyến mới</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {filtered.length === sorted.length ? "Danh sách phiếu" : `Danh sách phiếu lọc (${filtered.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Ngày</th>
                    <th className="px-5 py-3 font-medium">Lộ trình</th>
                    <th className="px-5 py-3 font-medium">Người VC</th>
                    <th className="px-5 py-3 font-medium">Phương tiện</th>
                    <th className="px-5 py-3 text-right font-medium">Km</th>
                    <th className="px-5 py-3 text-right font-medium">Phụ cấp</th>
                    <th className="px-5 py-3 text-center font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3 tabular-nums">{formatDateVi(r.date)}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium">{pathLabel(r.path)}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {r.legs.length} chặng · Mã: {r.number}
                        </p>
                      </td>
                      <td className="px-5 py-3">{r.employeeName}</td>
                      <td className="px-5 py-3">
                        <Badge variant="secondary">{VEHICLE_BY_ID[r.vehicleId].name}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatKm(r.totalKm)}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-primary">
                        {formatVnd(r.totalAmount)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/phieu/$id" params={{ id: r.id }}>
                            <Eye className="mr-1 size-4" />
                            Xem
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}