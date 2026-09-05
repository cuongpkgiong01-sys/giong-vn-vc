import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bike, Car, MapPinned, Route as RouteIcon, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClusterMap } from "@/components/map/cluster-map";
import { CLUSTERS, LOCATIONS, VEHICLE_BY_ID } from "@/lib/data/catalog";
import { pathLabel } from "@/lib/data/calculator";
import { currentMonthKey, formatDateVi, formatKm, formatVnd, monthLabel, todayIso } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const receipts = useAppStore((s) => s.receipts);
  const month = currentMonthKey(todayIso());
  const monthReceipts = receipts.filter((r) => r.date.startsWith(month));

  const tripCount = monthReceipts.length;
  const totalKm = monthReceipts.reduce((s, r) => s + r.totalKm, 0);
  const totalPay = monthReceipts.reduce((s, r) => s + r.totalAmount, 0);
  const avg = tripCount ? Math.round(totalPay / tripCount) : 0;

  const byDayMap = new Map<string, { km: number; amount: number; n: number }>();
  for (const r of monthReceipts) {
    const cur = byDayMap.get(r.date) ?? { km: 0, amount: 0, n: 0 };
    cur.km += r.totalKm;
    cur.amount += r.totalAmount;
    cur.n += 1;
    byDayMap.set(r.date, cur);
  }
  const byDay = [...byDayMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({
      day: date.slice(8),
      amount: v.amount,
      km: Math.round(v.km * 10) / 10,
    }));

  const byCluster = CLUSTERS.map((c) => {
    const ids = new Set(LOCATIONS.filter((l) => l.cluster === c.id).map((l) => l.id));
    const amount = monthReceipts.reduce((s, r) => {
      const hits = r.path.slice(1).some((id) => ids.has(id));
      return hits ? s + r.totalAmount : s;
    }, 0);
    return { name: c.name, amount };
  });

  const xeMay = monthReceipts.filter((r) => r.vehicleId === "xe-may").length;
  const oTo = monthReceipts.filter((r) => r.vehicleId === "o-to").length;
  const recent = [...receipts].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Công ty CP Giong Việt Nam
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">Tổng quan vận chuyển</h1>
          <p className="mt-1 text-sm text-muted-foreground">{monthLabel(`${month}-01`)} · Định mức theo Quy chế phụ cấp nội bộ</p>
        </div>
        <Button asChild>
          <Link to="/chuyen-moi">
            Tạo chuyến mới
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={RouteIcon} label="Chuyến tháng này" value={String(tripCount)} hint="Đã ghi nhận" />
        <Kpi icon={MapPinned} label="Tổng km" value={formatKm(totalKm)} hint="Đường bộ 1 chiều" />
        <Kpi icon={Wallet} label="Tổng phụ cấp" value={formatVnd(totalPay)} hint="Đã gồm phí mở chuyến" />
        <Kpi icon={Bike} label="Trung bình / chuyến" value={formatVnd(avg)} hint={`${xeMay} xe máy · ${oTo} ô tô`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Phụ cấp theo ngày</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            {byDay.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={byDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1c5c52" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#1c5c52" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(21,32,28,0.08)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#5c6864" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#5c6864" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                    width={40}
                  />
                  <RTooltip
                    contentStyle={{ background: "#fffcf7", border: "1px solid #d4cdc0", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [formatVnd(Number(v ?? 0)), "Phụ cấp"]}
                    labelFormatter={(l) => `Ngày ${l}`}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#1c5c52" strokeWidth={2} fill="url(#fillAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Theo cụm</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCluster} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(21,32,28,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5c6864" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <RTooltip
                  contentStyle={{ background: "#fffcf7", border: "1px solid #d4cdc0", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [formatVnd(Number(v ?? 0)), "Phụ cấp"]}
                />
                <Bar dataKey="amount" fill="#1c5c52" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Chuyến gần đây</CardTitle>
            <Button variant="link" asChild className="h-auto p-0">
              <Link to="/phieu">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y divide-border">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link
                    to="/phieu/$id"
                    params={{ id: r.id }}
                    className="flex items-start justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{pathLabel(r.path)}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDateVi(r.date)} · {r.employeeName} · {VEHICLE_BY_ID[r.vehicleId].name}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums">{formatVnd(r.totalAmount)}</p>
                      <p className="text-xs tabular-nums text-muted-foreground">{formatKm(r.totalKm)} km</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Mạng lưới 18 điểm</CardTitle>
            <Button variant="link" asChild className="h-auto p-0">
              <Link to="/dia-diem">Chi tiết</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ClusterMap className="min-h-48" />
            <div className="mt-3 flex flex-wrap gap-2">
              {CLUSTERS.map((c) => (
                <Badge key={c.id} variant="secondary">
                  {c.name} · {LOCATIONS.filter((l) => l.cluster === c.id).length}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <HintCard
          icon={Wallet}
          title="Công thức khoán"
          body="Phí mở chuyến (1 lần) + tổng km thực tế × đơn giá. Xe máy 10.000 + 4.000/km · Ô tô 20.000 + 8.000/km."
          to="/quy-che"
        />
        <HintCard
          icon={Car}
          title="Đa điểm, một phí mở"
          body="Đi nhiều điểm liên tiếp chỉ tính phí mở 1 lần. Tối ưu thứ tự ngay trên màn tạo chuyến."
          to="/chuyen-moi"
        />
        <HintCard
          icon={MapPinned}
          title="Km Google Maps"
          body="55 tuyến đã đo đường bộ thực tế. Điểm Long Biên – Ngọc Lâm – Sài Đồng không khoán riêng."
          to="/dinh-muc"
        />
      </section>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="size-4" />
          <span className="text-[11px] font-medium uppercase tracking-[0.12em]">{label}</span>
        </div>
        <p className="text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Chưa có chuyến trong tháng này
    </div>
  );
}

function HintCard({
  icon: Icon,
  title,
  body,
  to,
}: {
  icon: typeof Wallet;
  title: string;
  body: string;
  to: string;
}) {
  return (
    <Link to={to} className="block">
      <Card className="h-full transition-shadow hover:shadow-[var(--shadow-border-hover)]">
        <CardContent className="flex h-full flex-col gap-2 p-5">
          <Icon className="size-4 text-primary" />
          <p className="font-medium">{title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
