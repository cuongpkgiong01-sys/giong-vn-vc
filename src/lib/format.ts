export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(amount)) + " đ";
}

export function formatKm(km: number): string {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(km);
}

export function formatDateVi(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function monthLabel(iso: string): string {
  const [y, m] = iso.split("-");
  return `Tháng ${Number(m)}/${y}`;
}

export function currentMonthKey(iso?: string): string {
  const d = iso ?? todayIso();
  return d.slice(0, 7);
}
