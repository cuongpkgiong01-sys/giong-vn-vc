import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { o as ROUTES, r as LOCATIONS, t as CLUSTERS } from "./calculator-DEVecDDO.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cluster-map-B4jiYeJu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var W = 720;
var H = 560;
var PAD = 36;
function project(lat, lng) {
	const lats = LOCATIONS.map((l) => l.lat);
	const lngs = LOCATIONS.map((l) => l.lng);
	const minLat = Math.min(...lats) - .02;
	const maxLat = Math.max(...lats) + .02;
	const minLng = Math.min(...lngs) - .02;
	const maxLng = Math.max(...lngs) + .02;
	return {
		x: PAD + (lng - minLng) / (maxLng - minLng) * 648,
		y: PAD + (maxLat - lat) / (maxLat - minLat) * 488
	};
}
function convexHull(points) {
	const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
	if (pts.length <= 2) return pts;
	const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
	const lower = [];
	for (const p of pts) {
		while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
		lower.push(p);
	}
	const upper = [];
	for (let i = pts.length - 1; i >= 0; i--) {
		const p = pts[i];
		while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
		upper.push(p);
	}
	lower.pop();
	upper.pop();
	return lower.concat(upper);
}
function hullPath(pts) {
	if (pts.length === 0) return "";
	if (pts.length === 1) {
		const p = pts[0];
		return `M ${p.x} ${p.y} m -28 0 a 28 28 0 1 0 56 0 a 28 28 0 1 0 -56 0`;
	}
	const hull = convexHull(pts);
	const pad = 22;
	const cx = hull.reduce((s, p) => s + p.x, 0) / hull.length;
	const cy = hull.reduce((s, p) => s + p.y, 0) / hull.length;
	return hull.map((p) => {
		const dx = p.x - cx;
		const dy = p.y - cy;
		const len = Math.hypot(dx, dy) || 1;
		return {
			x: p.x + dx / len * pad,
			y: p.y + dy / len * pad
		};
	}).map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
}
var CLUSTER_FILL = {
	"long-bien": "rgba(28,92,82,0.10)",
	"tu-son": "rgba(28,92,82,0.16)",
	"me-linh": "rgba(18,58,52,0.14)",
	"thanh-oai": "rgba(28,92,82,0.08)"
};
function ClusterMap({ highlightIds = [], pathIds = [], onSelect, className }) {
	const [hover, setHover] = (0, import_react.useState)(null);
	const projected = (0, import_react.useMemo)(() => Object.fromEntries(LOCATIONS.map((l) => [l.id, {
		...l,
		...project(l.lat, l.lng)
	}])), []);
	const hulls = (0, import_react.useMemo)(() => CLUSTERS.map((c) => {
		return {
			cluster: c,
			d: hullPath(LOCATIONS.filter((l) => l.cluster === c.id).map((l) => projected[l.id]))
		};
	}), [projected]);
	const pathPairs = [];
	for (let i = 0; i < pathIds.length - 1; i++) pathPairs.push([pathIds[i], pathIds[i + 1]]);
	const active = hover ? projected[hover] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-lg bg-[#e7efe9]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${W} ${H}`,
			className: "h-auto w-full",
			role: "img",
			"aria-label": "Bản đồ 18 điểm giao nhận",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
					id: "grid",
					width: "24",
					height: "24",
					patternUnits: "userSpaceOnUse",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 24 0 L 0 0 0 24",
						fill: "none",
						stroke: "rgba(21,32,28,0.05)",
						strokeWidth: "1"
					})
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: W,
					height: H,
					fill: "url(#grid)"
				}),
				hulls.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: h.d,
					fill: CLUSTER_FILL[h.cluster.id],
					stroke: "rgba(28,92,82,0.18)",
					strokeWidth: "1"
				}, h.cluster.id)),
				ROUTES.map((r) => {
					const a = projected[r.fromId];
					const b = projected[r.toId];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: a.x,
						y1: a.y,
						x2: b.x,
						y2: b.y,
						stroke: "rgba(28,92,82,0.18)",
						strokeWidth: r.kind === "vp" ? 1 : .8
					}, `${r.fromId}-${r.toId}`);
				}),
				pathPairs.map(([from, to]) => {
					const a = projected[from];
					const b = projected[to];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: a.x,
						y1: a.y,
						x2: b.x,
						y2: b.y,
						stroke: "#1c5c52",
						strokeWidth: "2.5",
						strokeLinecap: "round"
					}, `hl-${from}-${to}`);
				}),
				LOCATIONS.map((l) => {
					const p = projected[l.id];
					const isHi = highlightIds.includes(l.id) || pathIds.includes(l.id);
					const isHov = hover === l.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `translate(${p.x},${p.y})`,
						className: "cursor-pointer text-foreground",
						onMouseEnter: () => setHover(l.id),
						onMouseLeave: () => setHover(null),
						onClick: () => onSelect?.(l),
						children: [l.isOffice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "-6",
							y: "-6",
							width: "12",
							height: "12",
							rx: "2",
							fill: isHi || isHov ? "var(--color-primary)" : "var(--color-ink)",
							stroke: "var(--color-card)",
							strokeWidth: "1.5"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							r: isHi || isHov ? 6.5 : 5,
							fill: isHi || isHov ? "var(--color-primary)" : l.isHub ? "var(--color-primary)" : "var(--color-muted-foreground)",
							stroke: "var(--color-card)",
							strokeWidth: "1.5"
						}), (l.isOffice || l.isHub || isHi || isHov) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							y: l.id === "dong-xuan" || l.id === "phuc-yen" || l.id === "huong-mac" ? -12 : 16,
							textAnchor: "middle",
							className: "pointer-events-none",
							fill: "currentColor",
							fontSize: "10",
							fontWeight: isHi ? 600 : 500,
							fontFamily: "Be Vietnam Pro, sans-serif",
							children: l.name.replace("Văn phòng (Ngọc Lâm)", "Văn phòng")
						})]
					}, l.id);
				})
			]
		}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute bottom-3 left-3 right-3 rounded-md bg-ink/90 px-3 py-2 text-xs text-sidebar-foreground sm:right-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: active.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sidebar-muted",
				children: [
					CLUSTERS.find((c) => c.id === active.cluster)?.name,
					" · ",
					active.lat.toFixed(4),
					", ",
					active.lng.toFixed(4)
				]
			})]
		})]
	});
}
//#endregion
export { ClusterMap as t };
