import { useMemo, useState } from "react";
import { CLUSTERS, LOCATIONS, ROUTES, type ClusterId, type Location } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";

const W = 720;
const H = 560;
const PAD = 36;

function project(lat: number, lng: number) {
  const lats = LOCATIONS.map((l) => l.lat);
  const lngs = LOCATIONS.map((l) => l.lng);
  const minLat = Math.min(...lats) - 0.02;
  const maxLat = Math.max(...lats) + 0.02;
  const minLng = Math.min(...lngs) - 0.02;
  const maxLng = Math.max(...lngs) + 0.02;
  const x = PAD + ((lng - minLng) / (maxLng - minLng)) * (W - PAD * 2);
  const y = PAD + ((maxLat - lat) / (maxLat - minLat)) * (H - PAD * 2);
  return { x, y };
}

function convexHull(points: { x: number; y: number }[]) {
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  if (pts.length <= 2) return pts;
  const cross = (o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: typeof pts = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: typeof pts = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function hullPath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return "";
  if (pts.length === 1) {
    const p = pts[0];
    return `M ${p.x} ${p.y} m -28 0 a 28 28 0 1 0 56 0 a 28 28 0 1 0 -56 0`;
  }
  const hull = convexHull(pts);
  const pad = 22;
  const cx = hull.reduce((s, p) => s + p.x, 0) / hull.length;
  const cy = hull.reduce((s, p) => s + p.y, 0) / hull.length;
  const expanded = hull.map((p) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x + (dx / len) * pad, y: p.y + (dy / len) * pad };
  });
  return expanded.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
}

const CLUSTER_FILL: Record<ClusterId, string> = {
  "long-bien": "rgba(28,92,82,0.10)",
  "tu-son": "rgba(28,92,82,0.16)",
  "me-linh": "rgba(18,58,52,0.14)",
  "thanh-oai": "rgba(28,92,82,0.08)",
};

export function ClusterMap({
  highlightIds = [],
  pathIds = [],
  onSelect,
  className,
}: {
  highlightIds?: string[];
  pathIds?: string[];
  onSelect?: (loc: Location) => void;
  className?: string;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const projected = useMemo(
    () =>
      Object.fromEntries(
        LOCATIONS.map((l) => [l.id, { ...l, ...project(l.lat, l.lng) }]),
      ) as Record<string, Location & { x: number; y: number }>,
    [],
  );

  const hulls = useMemo(
    () =>
      CLUSTERS.map((c) => {
        const pts = LOCATIONS.filter((l) => l.cluster === c.id).map((l) => projected[l.id]);
        return { cluster: c, d: hullPath(pts) };
      }),
    [projected],
  );

  const pathPairs: Array<[string, string]> = [];
  for (let i = 0; i < pathIds.length - 1; i++) pathPairs.push([pathIds[i], pathIds[i + 1]]);

  const active = hover ? projected[hover] : null;

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-[#e7efe9]", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Bản đồ 18 điểm giao nhận">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(21,32,28,0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />

        {hulls.map((h) => (
          <path key={h.cluster.id} d={h.d} fill={CLUSTER_FILL[h.cluster.id]} stroke="rgba(28,92,82,0.18)" strokeWidth="1" />
        ))}

        {ROUTES.map((r) => {
          const a = projected[r.fromId];
          const b = projected[r.toId];
          return (
            <line
              key={`${r.fromId}-${r.toId}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(28,92,82,0.18)"
              strokeWidth={r.kind === "vp" ? 1 : 0.8}
            />
          );
        })}

        {pathPairs.map(([from, to]) => {
          const a = projected[from];
          const b = projected[to];
          return (
            <line
              key={`hl-${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#1c5c52"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}

        {LOCATIONS.map((l) => {
          const p = projected[l.id];
          const isHi = highlightIds.includes(l.id) || pathIds.includes(l.id);
          const isHov = hover === l.id;
          return (
            <g
              key={l.id}
              transform={`translate(${p.x},${p.y})`}
              className="cursor-pointer text-foreground"
              onMouseEnter={() => setHover(l.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect?.(l)}
            >
              {l.isOffice ? (
                <rect
                  x="-6"
                  y="-6"
                  width="12"
                  height="12"
                  rx="2"
                  fill={isHi || isHov ? "var(--color-primary)" : "var(--color-ink)"}
                  stroke="var(--color-card)"
                  strokeWidth="1.5"
                />
              ) : (
                <circle
                  r={isHi || isHov ? 6.5 : 5}
                  fill={isHi || isHov ? "var(--color-primary)" : l.isHub ? "var(--color-primary)" : "var(--color-muted-foreground)"}
                  stroke="var(--color-card)"
                  strokeWidth="1.5"
                />
              )}
              {(l.isOffice || l.isHub || isHi || isHov) && (
              <text
                y={l.id === "dong-xuan" || l.id === "phuc-yen" || l.id === "huong-mac" ? -12 : 16}
                textAnchor="middle"
                className="pointer-events-none"
                fill="currentColor"
                fontSize="10"
                fontWeight={isHi ? 600 : 500}
                fontFamily="Be Vietnam Pro, sans-serif"
              >
                {l.name.replace("Văn phòng (Ngọc Lâm)", "Văn phòng")}
              </text>
              )}
            </g>
          );
        })}
      </svg>

      {active && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-md bg-ink/90 px-3 py-2 text-xs text-sidebar-foreground sm:right-auto">
          <p className="font-medium">{active.name}</p>
          <p className="text-sidebar-muted">
            {CLUSTERS.find((c) => c.id === active.cluster)?.name} · {active.lat.toFixed(4)}, {active.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}
