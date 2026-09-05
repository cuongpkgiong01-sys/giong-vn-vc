import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { p as googleMapsPoint, r as LOCATIONS, t as CLUSTERS } from "./calculator-DEVecDDO.mjs";
import { v as ExternalLink } from "../_libs/lucide-react.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DmmQeq2C.mjs";
import { t as Badge } from "./badge-yNqnGKGj.mjs";
import { t as ClusterMap } from "./cluster-map-B4jiYeJu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dia-diem-D1EvwGLY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LocationsPage() {
	const [selected, setSelected] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground",
					children: "Mạng lưới"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-semibold tracking-tight",
					children: "18 điểm giao nhận"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Tọa độ dùng để đối chiếu GPS và kiểm tra trên Google Maps. Cập nhật 21/08/2026."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClusterMap, {
				highlightIds: selected ? [selected.id] : [],
				onSelect: setSelected,
				className: "min-h-72"
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: selected.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm tabular-nums text-muted-foreground",
					children: [
						selected.lat.toFixed(6),
						", ",
						selected.lng.toFixed(6)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: googleMapsPoint(selected),
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex h-10 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline",
					children: ["Mở Google Maps", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })]
				})]
			}) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: CLUSTERS.map((c) => {
					const locs = LOCATIONS.filter((l) => l.cluster === c.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							children: [locs.length, " điểm"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: c.blurb
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "px-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: locs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelected(l),
								className: "flex w-full items-start justify-between gap-3 px-5 py-3 text-left hover:bg-muted/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium",
									children: l.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs tabular-nums text-muted-foreground",
									children: [
										l.lat.toFixed(5),
										", ",
										l.lng.toFixed(5)
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex shrink-0 flex-col items-end gap-1",
									children: [l.isHub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Hub" }) : null, l.noAllowance ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "muted",
										children: "Không khoán"
									}) : null]
								})]
							}) }, l.id))
						})
					})] }, c.id);
				})
			})
		]
	});
}
//#endregion
export { LocationsPage as component };
