import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as singleHopRate, c as VEHICLE_BY_ID, i as LOCATION_BY_ID, o as ROUTES, t as CLUSTERS } from "./calculator-DEVecDDO.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DmmQeq2C.mjs";
import { a as SelectItem, c as SelectValue, n as Select, r as SelectContent, s as SelectTrigger, t as Input } from "./select-CH4OnjdB.mjs";
import { t as Badge } from "./badge-yNqnGKGj.mjs";
import { i as formatVnd, r as formatKm } from "./format-DZn_BDL4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dinh-muc-DrA0WOdO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RatesPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [cluster, setCluster] = (0, import_react.useState)("all");
	const rows = (0, import_react.useMemo)(() => {
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
			return `${LOCATION_BY_ID[r.fromId].name} ${LOCATION_BY_ID[r.toId].name}`.toLowerCase().includes(query);
		});
	}, [q, cluster]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-5xl flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground",
					children: "Phụ lục 01"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-semibold tracking-tight",
					children: "Bảng định mức khoán"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Mức khi đi 1 điểm đã gồm phí mở chuyến, làm tròn đến nghìn. Đi nhiều điểm: phí mở 1 lần + tổng km."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground",
						children: "Xe máy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-lg font-semibold",
						children: "10.000 đ + 4.000 đ/km (Từ Sơn) · 5.000 đ/km (Mê Linh, Thanh Oai)"
					})]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground",
						children: "Ô tô"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-lg font-semibold",
						children: "20.000 đ + 8.000 đ/km"
					})]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Tìm tuyến…",
					value: q,
					onChange: (e) => setQ(e.target.value),
					className: "sm:flex-1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: cluster,
					onValueChange: (v) => setCluster(v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "sm:w-52",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Tất cả tuyến"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "vp",
							children: "Văn phòng → điểm"
						}),
						CLUSTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: c.id,
							children: ["Nội bộ ", c.name]
						}, c.id))
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border bg-muted/50 text-left text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Tuyến"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Loại"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right font-medium",
									children: "Km"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right font-medium",
									children: "Xe máy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right font-medium",
									children: "Ô tô"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => {
							const from = LOCATION_BY_ID[r.fromId];
							const to = LOCATION_BY_ID[r.toId];
							const skipPay = to.noAllowance && r.kind === "vp";
							const bikePerKm = to.cluster === "tu-son" ? 4e3 : 5e3;
							const bikeVehicle = {
								...VEHICLE_BY_ID["xe-may"],
								perKmFee: bikePerKm
							};
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/70 last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [
											from.name.replace("Văn phòng (Ngọc Lâm)", "Văn phòng"),
											" → ",
											to.name
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: skipPay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "muted",
											children: "Không khoán"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											children: r.kind === "vp" ? "Từ VP" : "Nội bộ"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right tabular-nums",
										children: formatKm(r.km)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right tabular-nums",
										children: skipPay ? "—" : formatVnd(singleHopRate(r.km, bikeVehicle))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right tabular-nums",
										children: skipPay ? "—" : formatVnd(singleHopRate(r.km, VEHICLE_BY_ID["o-to"]))
									})
								]
							}, `${r.fromId}-${r.toId}`);
						}) })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ví dụ đa điểm" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-2 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Văn phòng → Từ Sơn (12,2 km) xe máy → 10.000 + 12,2 × 4.000 = 58.800 đ" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Văn phòng → Từ Sơn → Hương Mạc (19,8 km) xe máy → 10.000 + 19,8 × 4.000 = 89.200 đ (chỉ mở 1 lần)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Văn phòng → Mê Linh (30,9 km) ô tô → 20.000 + 30,9 × 8.000 = 267.200 đ" })
				]
			})] })
		]
	});
}
//#endregion
export { RatesPage as component };
