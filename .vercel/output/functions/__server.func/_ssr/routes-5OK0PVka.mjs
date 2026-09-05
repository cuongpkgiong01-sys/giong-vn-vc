import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as VEHICLE_BY_ID, g as pathLabel, r as LOCATIONS, t as CLUSTERS } from "./calculator-DEVecDDO.mjs";
import { S as Car, T as ArrowRight, c as Route, f as MapPinned, n as Wallet, w as Bike } from "../_libs/lucide-react.mjs";
import { i as Button, r as useAppStore } from "./router-CSy7gJSc.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DmmQeq2C.mjs";
import { t as Badge } from "./badge-yNqnGKGj.mjs";
import { t as ClusterMap } from "./cluster-map-B4jiYeJu.mjs";
import { a as monthLabel, i as formatVnd, n as formatDateVi, o as todayIso, r as formatKm, t as currentMonthKey } from "./format-DZn_BDL4.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-5OK0PVka.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const receipts = useAppStore((s) => s.receipts);
	const month = currentMonthKey(todayIso());
	const monthReceipts = receipts.filter((r) => r.date.startsWith(month));
	const tripCount = monthReceipts.length;
	const totalKm = monthReceipts.reduce((s, r) => s + r.totalKm, 0);
	const totalPay = monthReceipts.reduce((s, r) => s + r.totalAmount, 0);
	const avg = tripCount ? Math.round(totalPay / tripCount) : 0;
	const byDayMap = /* @__PURE__ */ new Map();
	for (const r of monthReceipts) {
		const cur = byDayMap.get(r.date) ?? {
			km: 0,
			amount: 0,
			n: 0
		};
		cur.km += r.totalKm;
		cur.amount += r.totalAmount;
		cur.n += 1;
		byDayMap.set(r.date, cur);
	}
	const byDay = [...byDayMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, v]) => ({
		day: date.slice(8),
		amount: v.amount,
		km: Math.round(v.km * 10) / 10
	}));
	const byCluster = CLUSTERS.map((c) => {
		const ids = new Set(LOCATIONS.filter((l) => l.cluster === c.id).map((l) => l.id));
		const amount = monthReceipts.reduce((s, r) => {
			return r.path.slice(1).some((id) => ids.has(id)) ? s + r.totalAmount : s;
		}, 0);
		return {
			name: c.name,
			amount
		};
	});
	const xeMay = monthReceipts.filter((r) => r.vehicleId === "xe-may").length;
	const oTo = monthReceipts.filter((r) => r.vehicleId === "o-to").length;
	const recent = [...receipts].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground",
						children: "Công ty CP Giong Việt Nam"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-semibold tracking-tight lg:text-3xl",
						children: "Tổng quan vận chuyển"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [monthLabel(`${month}-01`), " · Định mức theo Quy chế phụ cấp nội bộ"]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/chuyen-moi",
						children: ["Tạo chuyến mới", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Route,
						label: "Chuyến tháng này",
						value: String(tripCount),
						hint: "Đã ghi nhận"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: MapPinned,
						label: "Tổng km",
						value: formatKm(totalKm),
						hint: "Đường bộ 1 chiều"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Wallet,
						label: "Tổng phụ cấp",
						value: formatVnd(totalPay),
						hint: "Đã gồm phí mở chuyến"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Bike,
						label: "Trung bình / chuyến",
						value: formatVnd(avg),
						hint: `${xeMay} xe máy · ${oTo} ô tô`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Phụ cấp theo ngày" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-56",
						children: byDay.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChart, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: byDay,
								margin: {
									top: 8,
									right: 8,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "fillAmt",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "#1c5c52",
											stopOpacity: .28
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "#1c5c52",
											stopOpacity: .02
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "rgba(21,32,28,0.08)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										tick: {
											fontSize: 11,
											fill: "#5c6864"
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fontSize: 11,
											fill: "#5c6864"
										},
										axisLine: false,
										tickLine: false,
										tickFormatter: (v) => `${Math.round(Number(v) / 1e3)}k`,
										width: 40
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											background: "#fffcf7",
											border: "1px solid #d4cdc0",
											borderRadius: 8,
											fontSize: 12
										},
										formatter: (v) => [formatVnd(Number(v ?? 0)), "Phụ cấp"],
										labelFormatter: (l) => `Ngày ${l}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "amount",
										stroke: "#1c5c52",
										strokeWidth: 2,
										fill: "url(#fillAmt)"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Theo cụm" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: byCluster,
								margin: {
									top: 8,
									right: 8,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "rgba(21,32,28,0.08)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: {
											fontSize: 11,
											fill: "#5c6864"
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											background: "#fffcf7",
											border: "1px solid #d4cdc0",
											borderRadius: 8,
											fontSize: 12
										},
										formatter: (v) => [formatVnd(Number(v ?? 0)), "Phụ cấp"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "amount",
										fill: "#1c5c52",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Chuyến gần đây" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "link",
							asChild: true,
							className: "h-auto p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/phieu",
								children: "Xem tất cả"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "px-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/phieu/$id",
								params: { id: r.id },
								className: "flex items-start justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: pathLabel(r.path)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: [
											formatDateVi(r.date),
											" · ",
											r.employeeName,
											" · ",
											VEHICLE_BY_ID[r.vehicleId].name
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "shrink-0 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold tabular-nums",
										children: formatVnd(r.totalAmount)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs tabular-nums text-muted-foreground",
										children: [formatKm(r.totalKm), " km"]
									})]
								})]
							}) }, r.id))
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Mạng lưới 18 điểm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "link",
							asChild: true,
							className: "h-auto p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dia-diem",
								children: "Chi tiết"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClusterMap, { className: "min-h-48" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: CLUSTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							children: [
								c.name,
								" · ",
								LOCATIONS.filter((l) => l.cluster === c.id).length
							]
						}, c.id))
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintCard, {
						icon: Wallet,
						title: "Công thức khoán",
						body: "Phí mở chuyến (1 lần) + tổng km thực tế × đơn giá. Xe máy 10.000 + 4.000/km · Ô tô 20.000 + 8.000/km.",
						to: "/quy-che"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintCard, {
						icon: Car,
						title: "Đa điểm, một phí mở",
						body: "Đi nhiều điểm liên tiếp chỉ tính phí mở 1 lần. Tối ưu thứ tự ngay trên màn tạo chuyến.",
						to: "/chuyen-moi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintCard, {
						icon: MapPinned,
						title: "Km Google Maps",
						body: "55 tuyến đã đo đường bộ thực tế. Điểm Long Biên – Ngọc Lâm – Sài Đồng không khoán riêng.",
						to: "/dinh-muc"
					})
				]
			})
		]
	});
}
function Kpi({ icon: Icon, label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex flex-col gap-2 p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-medium uppercase tracking-[0.12em]",
					children: label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xl font-semibold tabular-nums tracking-tight sm:text-2xl",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			})
		]
	}) });
}
function EmptyChart() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full items-center justify-center text-sm text-muted-foreground",
		children: "Chưa có chuyến trong tháng này"
	});
}
function HintCard({ icon: Icon, title, body, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: "block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "h-full transition-shadow hover:shadow-[var(--shadow-border-hover)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex h-full flex-col gap-2 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: body
					})
				]
			})
		})
	});
}
//#endregion
export { Dashboard as component };
