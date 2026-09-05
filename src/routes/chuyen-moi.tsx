import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDown, Camera, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClusterMap } from "@/components/map/cluster-map";
import {
  CLUSTERS,
  LOCATIONS,
  OFFICE_ID,
  VEHICLES,
  getLocation,
  googleMapsDir,
  type VehicleId,
} from "@/lib/data/catalog";
import { calculateTrip, optimizePath } from "@/lib/data/calculator";
import { processEvidenceFile } from "@/lib/data/gps";
import { formatKm, formatVnd, todayIso } from "@/lib/format";
import { useAppStore, type EvidenceItem } from "@/lib/store";

export const Route = createFileRoute("/chuyen-moi")({ component: NewTripPage });

function NewTripPage() {
  const navigate = useNavigate();
  const employees = useAppStore((s) => s.employees);
  const addEmployee = useAppStore((s) => s.addEmployee);
  const saveReceipt = useAppStore((s) => s.saveReceipt);
  const updateReceipt = useAppStore((s) => s.updateReceipt);
  const receipts = useAppStore((s) => s.receipts);

  const editId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("edit") : null;
  const editingReceipt = editId ? receipts.find((r) => r.id === editId) : undefined;

  const [date, setDate] = useState(todayIso());
  const [employee, setEmployee] = useState(employees[0] ?? "");
  const [newEmp, setNewEmp] = useState("");
  const [vehicleId, setVehicleId] = useState<VehicleId>("xe-may");
  const [path, setPath] = useState<string[]>([OFFICE_ID]);
  const [addId, setAddId] = useState<string>("");
  const [night, setNight] = useState(false);
  const [holiday, setHoliday] = useState(false);
  const [notes, setNotes] = useState("");
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editingReceipt) return;
    setDate(editingReceipt.date);
    setEmployee(editingReceipt.employeeName);
    setVehicleId(editingReceipt.vehicleId);
    setPath(editingReceipt.path);
    setNight(editingReceipt.nightSurcharge);
    setHoliday(editingReceipt.holidaySurcharge);
    setNotes(editingReceipt.notes);
    setEvidence(editingReceipt.evidence);
  }, [editingReceipt]);

  const calc = useMemo(
    () => calculateTrip({ vehicleId, path, nightSurcharge: night, holidaySurcharge: holiday }),
    [vehicleId, path, night, holiday],
  );

  const used = new Set(path);
  const addable = LOCATIONS.filter((l) => !used.has(l.id));

  function addStop() {
    if (!addId) return;
    setPath((p) => [...p, addId]);
    setAddId("");
  }

  function removeAt(i: number) {
    if (i === 0) return;
    setPath((p) => p.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    setPath((p) => {
      const j = i + dir;
      if (j <= 0 || j >= p.length) return p;
      const next = [...p];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const ids = [...new Set(path)];
      for (const file of Array.from(files)) {
        const { preview, gps } = await processEvidenceFile(file, ids);
        setEvidence((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${file.name}`,
            name: file.name,
            preview,
            hasGps: gps.hasGps,
            lat: gps.lat,
            lon: gps.lon,
            matchStatus: gps.matchStatus,
            matchedLocation: gps.matchedLocation,
            distanceM: gps.distanceM,
            warning: gps.warning,
          },
        ]);
      }
    } catch {
      toast.error("Không đọc được ảnh. Thử file JPEG từ điện thoại.");
    } finally {
      setBusy(false);
    }
  }

  async function onSave() {
    if (path.length < 2) {
      toast.error("Thêm ít nhất một điểm đến.");
      return;
    }
    if (!employee.trim()) {
      toast.error("Chọn người vận chuyển.");
      return;
    }
    setBusy(true);
    try {
      if (editingReceipt) {
        const rec = await updateReceipt({
          id: editingReceipt.id,
          date,
          employeeName: employee.trim(),
          calc,
          path,
          evidence,
          notes,
        });
        toast.success(`Đã cập nhật phiếu ${rec.number}`);
        await navigate({ to: "/phieu/$id", params: { id: rec.id } });
        return;
      }

      const rec = await saveReceipt({
        date,
        employeeName: employee.trim(),
        calc,
        path,
        evidence,
        notes,
      });
      toast.success(`Đã lưu phiếu ${rec.number}`);
      await navigate({ to: "/phieu/$id", params: { id: rec.id } });
    } catch (error) {
      console.error(error);
      toast.error(editingReceipt ? "Không cập nhật được phiếu vào máy chủ." : "Không lưu được phiếu vào máy chủ.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-5 lg:items-start">
      <div className="flex flex-col gap-5 lg:col-span-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {editingReceipt ? "Chỉnh sửa" : "Tạo chuyến"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {editingReceipt ? `Sửa phiếu ${editingReceipt.number}` : "Phiếu phụ cấp mới"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Phí mở chuyến chỉ tính một lần. Km lấy theo Google Maps, hai chiều đảo ngược cùng số km.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin chuyến</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Ngày vận chuyển</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Phương tiện</Label>
              <Select value={vehicleId} onValueChange={(v) => setVehicleId(v as VehicleId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLES.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} · {formatVnd(v.baseFee)} + {formatVnd(v.perKmFee)}/km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label>Người vận chuyển</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select value={employee} onValueChange={setEmployee}>
                  <SelectTrigger className="sm:flex-1">
                    <SelectValue placeholder="Chọn nhân sự" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    placeholder="Thêm tên mới"
                    value={newEmp}
                    onChange={(e) => setNewEmp(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      void (async () => {
                        if (!newEmp.trim()) return;
                        try {
                          await addEmployee(newEmp);
                          setEmployee(newEmp.trim());
                          setNewEmp("");
                        } catch (error) {
                          console.error(error);
                          toast.error("Không thêm được người vận chuyển vào máy chủ.");
                        }
                      })();
                    }}
                  >
                    Thêm
                  </Button>
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={night} onCheckedChange={(v) => setNight(Boolean(v))} />
              Ban đêm / ngoài giờ +15%
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={holiday} onCheckedChange={(v) => setHoliday(Boolean(v))} />
              Lễ, Tết +20%
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Lộ trình</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPath(optimizePath(path))}
              disabled={path.length < 3}
            >
              <Sparkles className="size-4" />
              Tối ưu thứ tự
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ol className="flex flex-col">
              {path.map((id, i) => {
                const loc = getLocation(id);
                const leg = i > 0 ? calc.legs[i - 1] : null;
                return (
                  <li key={`${id}-${i}`} className="flex gap-3">
                    <div className="flex w-6 flex-col items-center">
                      <span className="mt-1 size-2.5 rounded-full bg-primary" />
                      {i < path.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
                    </div>
                    <div className="mb-3 flex min-w-0 flex-1 items-start justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {i === 0 ? "Xuất phát · " : `${i}. `}
                          {loc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {CLUSTERS.find((c) => c.id === loc.cluster)?.name}
                          {loc.noAllowance ? " · không khoán riêng" : ""}
                          {leg ? ` · ${formatKm(leg.km)} km${leg.estimated ? " (ước tính)" : ""}` : ""}
                        </p>
                      </div>
                      {i > 0 ? (
                        <div className="flex shrink-0">
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => move(i, -1)} aria-label="Lên">
                            <ArrowDown className="size-3.5 rotate-180" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => move(i, 1)} aria-label="Xuống">
                            <ArrowDown className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => removeAt(i)} aria-label="Xóa">
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={addId || ""} onValueChange={setAddId}>
                <SelectTrigger className="sm:flex-1">
                  <SelectValue placeholder="Thêm điểm đến" />
                </SelectTrigger>
                <SelectContent>
                  {CLUSTERS.map((c) => (
                    <SelectGroup key={c.id}>
                      <SelectLabel>{c.name}</SelectLabel>
                      {addable
                        .filter((l) => l.cluster === c.id)
                        .map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.name}
                            {l.noAllowance ? " (không khoán)" : ""}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="secondary" onClick={addStop} disabled={!addId}>
                <Plus className="size-4" />
                Thêm điểm
              </Button>
            </div>
            {calc.hasEstimate ? (
              <p className="text-xs text-warn">
                Một số chặng chưa có trong bảng Google Maps — km được ước tính từ tọa độ × hệ số đường bộ 1,45.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chứng cứ ảnh GPS</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Ảnh JPEG chụp tại điểm giao, bật vị trí trên điện thoại. Hệ thống đối chiếu trong bán kính 500 m.
            </p>
            <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground transition-colors hover:bg-muted">
              <Camera className="mb-1 size-5" />
              {busy ? "Đang đọc EXIF…" : "Chọn hoặc thả ảnh"}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                className="hidden"
                onChange={(e) => void onFiles(e.target.files)}
              />
            </label>
            {evidence.length > 0 ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {evidence.map((e) => (
                  <li key={e.id} className="relative overflow-hidden rounded-md bg-muted">
                    <img src={e.preview} alt={e.name} className="h-28 w-full object-cover" />
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-sidebar-foreground"
                      onClick={() => setEvidence((prev) => prev.filter((x) => x.id !== e.id))}
                      aria-label="Xóa ảnh"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                    <div className="p-2">
                      <Badge
                        variant={e.matchStatus === "Matched" ? "ok" : e.matchStatus === "No_GPS" ? "warn" : "muted"}
                      >
                        {e.matchStatus === "Matched"
                          ? e.matchedLocation
                          : e.matchStatus === "No_GPS"
                            ? "Không GPS"
                            : "Không khớp"}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-2">
          <Label htmlFor="notes">Ghi chú</Label>
          <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Lệnh điều xe, số thùng…" />
        </div>
      </div>

      <aside className="flex flex-col gap-4 lg:col-span-2 lg:mt-24 lg:self-start">
        <Card className="lg:relative">
          <CardHeader>
            <CardTitle>Tính phụ cấp</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {calc.noAllowanceOnly ? (
              <p className="rounded-md bg-warn/10 px-3 py-2 text-warn">
                Long Biên, Ngọc Lâm, Sài Đồng gần văn phòng — không áp dụng khoán riêng.
              </p>
            ) : (
              <dl className="space-y-2">
                <Row k="Phí mở chuyến (1 lần)" v={formatVnd(calc.baseFee)} />
                <Row k={`${formatKm(calc.totalKm)} km × ${formatVnd(calc.perKmFee)}`} v={formatVnd(calc.kmAmount)} />
                {calc.surchargeAmount > 0 ? <Row k="Phụ phí" v={formatVnd(calc.surchargeAmount)} /> : null}
              </dl>
            )}
            <div className="flex items-end justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Tổng phụ cấp</span>
              <span className="text-2xl font-semibold tabular-nums tracking-tight text-primary">
                {formatVnd(calc.totalAmount)}
              </span>
            </div>
            <Button onClick={() => void onSave()} disabled={path.length < 2 || busy} className="mt-1 h-11">
              {editingReceipt ? "Cập nhật phiếu" : "Lưu phiếu"}
            </Button>
            {calc.legs.length === 1 && !calc.legs[0].estimated ? (
              <a
                className="text-center text-xs text-primary underline-offset-4 hover:underline"
                href={googleMapsDir(
                  getLocation(calc.legs[0].fromId || calc.legs[0].from),
                  getLocation(calc.legs[0].toId || calc.legs[0].to),
                )}
                target="_blank"
                rel="noreferrer"
              >
                Mở tuyến trên Google Maps
              </a>
            ) : null}
          </CardContent>
        </Card>
        <ClusterMap pathIds={path} highlightIds={path} className="min-h-56" />
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="tabular-nums font-medium">{v}</dd>
    </div>
  );
}
