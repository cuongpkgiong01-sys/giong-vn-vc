import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime, n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as OFFICE_ID, d as getLocation, f as googleMapsDir, h as optimizePath, l as calculateTrip, m as haversineMeters, r as LOCATIONS, s as VEHICLES, t as CLUSTERS } from "./calculator-DEVecDDO.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as Camera, D as ArrowDown, i as Trash2, o as Sparkles, t as X, u as Plus, x as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Button, r as useAppStore } from "./router-CSy7gJSc.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DmmQeq2C.mjs";
import { a as SelectItem, c as SelectValue, i as SelectGroup, n as Select, o as SelectLabel, r as SelectContent, s as SelectTrigger, t as Input } from "./select-CH4OnjdB.mjs";
import { t as Badge } from "./badge-yNqnGKGj.mjs";
import { t as ClusterMap } from "./cluster-map-B4jiYeJu.mjs";
import { i as formatVnd, o as todayIso, r as formatKm } from "./format-DZn_BDL4.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chuyen-moi-DB-ZG-GK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
	...props
}));
Label.displayName = Root.displayName;
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("peer size-4 shrink-0 rounded-xs border border-input bg-card shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: "flex items-center justify-center text-current",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
function readU16(view, offset, le) {
	return le ? view.getUint16(offset, true) : view.getUint16(offset, false);
}
function readU32(view, offset, le) {
	return le ? view.getUint32(offset, true) : view.getUint32(offset, false);
}
function readRational(view, offset, le) {
	return readU32(view, offset, le) / (readU32(view, offset + 4, le) || 1);
}
/** Minimal JPEG EXIF GPS reader — no extra dependency. */
function readGpsFromJpeg(buffer) {
	const view = new DataView(buffer);
	if (view.byteLength < 4 || view.getUint16(0, false) !== 65496) return null;
	let offset = 2;
	while (offset + 4 < view.byteLength) {
		if (view.getUint8(offset) !== 255) break;
		const marker = view.getUint8(offset + 1);
		const size = view.getUint16(offset + 2, false);
		if (marker === 225) {
			const start = offset + 4;
			if (String.fromCharCode(view.getUint8(start), view.getUint8(start + 1), view.getUint8(start + 2), view.getUint8(start + 3)) === "Exif") return parseExifGps(view, start + 6);
		}
		if (marker === 218) break;
		offset += 2 + size;
	}
	return null;
}
function parseExifGps(view, tiffStart) {
	if (tiffStart + 8 > view.byteLength) return null;
	const endian = String.fromCharCode(view.getUint8(tiffStart), view.getUint8(tiffStart + 1));
	const le = endian === "II";
	if (!le && endian !== "MM") return null;
	const gpsPtr = findTagOffset(view, tiffStart + readU32(view, tiffStart + 4, le), tiffStart, le, 34853);
	if (gpsPtr == null) return null;
	const gpsIfd = tiffStart + gpsPtr;
	const latRef = findTagAscii(view, gpsIfd, tiffStart, le, 1);
	const lonRef = findTagAscii(view, gpsIfd, tiffStart, le, 3);
	const lat = findTagDms(view, gpsIfd, tiffStart, le, 2);
	const lon = findTagDms(view, gpsIfd, tiffStart, le, 4);
	if (lat == null || lon == null) return null;
	const latDec = latRef === "S" ? -lat : lat;
	const lonDec = lonRef === "W" ? -lon : lon;
	if (!Number.isFinite(latDec) || !Number.isFinite(lonDec)) return null;
	return {
		lat: latDec,
		lon: lonDec
	};
}
function findTagOffset(view, ifd, tiffStart, le, tag) {
	if (ifd + 2 > view.byteLength) return null;
	const count = readU16(view, ifd, le);
	for (let i = 0; i < count; i++) {
		const entry = ifd + 2 + i * 12;
		if (entry + 12 > view.byteLength) return null;
		if (readU16(view, entry, le) === tag) return readU32(view, entry + 8, le);
	}
	return null;
}
function findTagAscii(view, ifd, tiffStart, le, tag) {
	if (ifd + 2 > view.byteLength) return null;
	const count = readU16(view, ifd, le);
	for (let i = 0; i < count; i++) {
		const entry = ifd + 2 + i * 12;
		if (entry + 12 > view.byteLength) return null;
		if (readU16(view, entry, le) === tag) {
			const type = readU16(view, entry + 2, le);
			const n = readU32(view, entry + 4, le);
			if (type === 2 && n <= 4) return String.fromCharCode(view.getUint8(entry + 8));
			const off = tiffStart + readU32(view, entry + 8, le);
			if (off < view.byteLength) return String.fromCharCode(view.getUint8(off));
		}
	}
	return null;
}
function findTagDms(view, ifd, tiffStart, le, tag) {
	if (ifd + 2 > view.byteLength) return null;
	const count = readU16(view, ifd, le);
	for (let i = 0; i < count; i++) {
		const entry = ifd + 2 + i * 12;
		if (entry + 12 > view.byteLength) return null;
		if (readU16(view, entry, le) === tag) {
			const off = tiffStart + readU32(view, entry + 8, le);
			if (off + 24 > view.byteLength) return null;
			const deg = readRational(view, off, le);
			const min = readRational(view, off + 8, le);
			const sec = readRational(view, off + 16, le);
			return deg + min / 60 + sec / 3600;
		}
	}
	return null;
}
function matchGps(lat, lon, locationIds, toleranceM = 500) {
	const pool = locationIds ? LOCATIONS.filter((l) => locationIds.includes(l.id)) : LOCATIONS;
	let best = pool[0];
	let bestD = Infinity;
	for (const loc of pool) {
		const d = haversineMeters(lat, lon, loc.lat, loc.lng);
		if (d < bestD) {
			bestD = d;
			best = loc;
		}
	}
	if (!best) return {
		hasGps: true,
		lat,
		lon,
		matchStatus: "Unmatched",
		matchedLocationId: null,
		matchedLocation: null,
		distanceM: null,
		warning: "Không có điểm để đối chiếu"
	};
	const matched = bestD <= toleranceM;
	return {
		hasGps: true,
		lat,
		lon,
		matchStatus: matched ? "Matched" : "Unmatched",
		matchedLocationId: best.id,
		matchedLocation: best.name,
		distanceM: Math.round(bestD),
		warning: matched ? null : `Ảnh cách điểm gần nhất (${best.name}) ${Math.round(bestD)} m, vượt quá ${toleranceM} m`
	};
}
async function processEvidenceFile(file, routeLocationIds) {
	const preview = await compressImage(file);
	const coords = readGpsFromJpeg(await file.arrayBuffer());
	if (!coords) return {
		preview,
		gps: {
			hasGps: false,
			lat: null,
			lon: null,
			matchStatus: "No_GPS",
			matchedLocationId: null,
			matchedLocation: null,
			distanceM: null,
			warning: "Ảnh không chứa dữ liệu GPS. Bật Vị trí trên điện thoại khi chụp."
		}
	};
	return {
		preview,
		gps: matchGps(coords.lat, coords.lon, routeLocationIds)
	};
}
function compressImage(file, max = 720, quality = .72) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, max / Math.max(img.width, img.height));
			const w = Math.max(1, Math.round(img.width * scale));
			const h = Math.max(1, Math.round(img.height * scale));
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("Canvas không khả dụng"));
				return;
			}
			ctx.drawImage(img, 0, 0, w, h);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", quality));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Không đọc được ảnh"));
		};
		img.src = url;
	});
}
function NewTripPage() {
	const navigate = useNavigate();
	const employees = useAppStore((s) => s.employees);
	const addEmployee = useAppStore((s) => s.addEmployee);
	const saveReceipt = useAppStore((s) => s.saveReceipt);
	const [date, setDate] = (0, import_react.useState)(todayIso());
	const [employee, setEmployee] = (0, import_react.useState)(employees[0] ?? "");
	const [newEmp, setNewEmp] = (0, import_react.useState)("");
	const [vehicleId, setVehicleId] = (0, import_react.useState)("xe-may");
	const [path, setPath] = (0, import_react.useState)([OFFICE_ID]);
	const [addId, setAddId] = (0, import_react.useState)("");
	const [night, setNight] = (0, import_react.useState)(false);
	const [holiday, setHoliday] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [evidence, setEvidence] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const calc = (0, import_react.useMemo)(() => calculateTrip({
		vehicleId,
		path,
		nightSurcharge: night,
		holidaySurcharge: holiday
	}), [
		vehicleId,
		path,
		night,
		holiday
	]);
	const used = new Set(path);
	const addable = LOCATIONS.filter((l) => !used.has(l.id));
	function addStop() {
		if (!addId) return;
		setPath((p) => [...p, addId]);
		setAddId("");
	}
	function removeAt(i) {
		if (i === 0) return;
		setPath((p) => p.filter((_, idx) => idx !== i));
	}
	function move(i, dir) {
		setPath((p) => {
			const j = i + dir;
			if (j <= 0 || j >= p.length) return p;
			const next = [...p];
			[next[i], next[j]] = [next[j], next[i]];
			return next;
		});
	}
	async function onFiles(files) {
		if (!files?.length) return;
		setBusy(true);
		try {
			const ids = [...new Set(path)];
			for (const file of Array.from(files)) {
				const { preview, gps } = await processEvidenceFile(file, ids);
				setEvidence((prev) => [...prev, {
					id: `${Date.now()}-${file.name}`,
					name: file.name,
					preview,
					hasGps: gps.hasGps,
					lat: gps.lat,
					lon: gps.lon,
					matchStatus: gps.matchStatus,
					matchedLocation: gps.matchedLocation,
					distanceM: gps.distanceM,
					warning: gps.warning
				}]);
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
			const rec = await saveReceipt({
				date,
				employeeName: employee.trim(),
				calc,
				path,
				evidence,
				notes
			});
			toast.success(`Đã lưu phiếu ${rec.number}`);
			await navigate({
				to: "/phieu/$id",
				params: { id: rec.id }
			});
		} catch (error) {
			console.error(error);
			toast.error("Không lưu được phiếu vào máy chủ.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-6 lg:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5 lg:col-span-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground",
						children: "Tạo chuyến"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-semibold tracking-tight",
						children: "Phiếu phụ cấp mới"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Phí mở chuyến chỉ tính một lần. Km lấy theo Google Maps, hai chiều đảo ngược cùng số km."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Thông tin chuyến" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "date",
								children: "Ngày vận chuyển"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "date",
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phương tiện" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: vehicleId,
								onValueChange: (v) => setVehicleId(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: VEHICLES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: v.id,
									children: [
										v.name,
										" · ",
										formatVnd(v.baseFee),
										" + ",
										formatVnd(v.perKmFee),
										"/km"
									]
								}, v.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Người vận chuyển" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: employee,
									onValueChange: setEmployee,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "sm:flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Chọn nhân sự" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: e,
										children: e
									}, e)) })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Thêm tên mới",
										value: newEmp,
										onChange: (e) => setNewEmp(e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										onClick: () => {
											(async () => {
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
										},
										children: "Thêm"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: night,
								onCheckedChange: (v) => setNight(Boolean(v))
							}), "Ban đêm / ngoài giờ +15%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: holiday,
								onCheckedChange: (v) => setHoliday(Boolean(v))
							}), "Lễ, Tết +20%"]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex-row items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Lộ trình" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => setPath(optimizePath(path)),
						disabled: path.length < 3,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Tối ưu thứ tự"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "flex flex-col",
							children: path.map((id, i) => {
								const loc = getLocation(id);
								const leg = i > 0 ? calc.legs[i - 1] : null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex w-6 flex-col items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 size-2.5 rounded-full bg-primary" }), i < path.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-px flex-1 bg-border" }) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex min-w-0 flex-1 items-start justify-between gap-2 rounded-md bg-muted/50 px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "truncate text-sm font-medium",
												children: [i === 0 ? "Xuất phát · " : `${i}. `, loc.name]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													CLUSTERS.find((c) => c.id === loc.cluster)?.name,
													loc.noAllowance ? " · không khoán riêng" : "",
													leg ? ` · ${formatKm(leg.km)} km${leg.estimated ? " (ước tính)" : ""}` : ""
												]
											})]
										}), i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex shrink-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "size-8",
													onClick: () => move(i, -1),
													"aria-label": "Lên",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3.5 rotate-180" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "size-8",
													onClick: () => move(i, 1),
													"aria-label": "Xuống",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "size-8",
													onClick: () => removeAt(i),
													"aria-label": "Xóa",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
												})
											]
										}) : null]
									})]
								}, `${id}-${i}`);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: addId || "",
								onValueChange: setAddId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "sm:flex-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Thêm điểm đến" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CLUSTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel, { children: c.name }), addable.filter((l) => l.cluster === c.id).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: l.id,
									children: [l.name, l.noAllowance ? " (không khoán)" : ""]
								}, l.id))] }, c.id)) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								onClick: addStop,
								disabled: !addId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Thêm điểm"]
							})]
						}),
						calc.hasEstimate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-warn",
							children: "Một số chặng chưa có trong bảng Google Maps — km được ước tính từ tọa độ × hệ số đường bộ 1,45."
						}) : null
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Chứng cứ ảnh GPS" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Ảnh JPEG chụp tại điểm giao, bật vị trí trên điện thoại. Hệ thống đối chiếu trong bán kính 500 m."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground transition-colors hover:bg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mb-1 size-5" }),
								busy ? "Đang đọc EXIF…" : "Chọn hoặc thả ảnh",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/jpeg,image/jpg,image/png",
									multiple: true,
									className: "hidden",
									onChange: (e) => void onFiles(e.target.files)
								})
							]
						}),
						evidence.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
							children: evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "relative overflow-hidden rounded-md bg-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: e.preview,
										alt: e.name,
										className: "h-28 w-full object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-sidebar-foreground",
										onClick: () => setEvidence((prev) => prev.filter((x) => x.id !== e.id)),
										"aria-label": "Xóa ảnh",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: e.matchStatus === "Matched" ? "ok" : e.matchStatus === "No_GPS" ? "warn" : "muted",
											children: e.matchStatus === "Matched" ? e.matchedLocation : e.matchStatus === "No_GPS" ? "Không GPS" : "Không khớp"
										})
									})
								]
							}, e.id))
						}) : null
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "notes",
						children: "Ghi chú"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "notes",
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Lệnh điều xe, số thùng…"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex flex-col gap-4 lg:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:sticky lg:top-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tính phụ cấp" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3 text-sm",
					children: [
						calc.noAllowanceOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-md bg-warn/10 px-3 py-2 text-warn",
							children: "Long Biên, Ngọc Lâm, Sài Đồng gần văn phòng — không áp dụng khoán riêng."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Phí mở chuyến (1 lần)",
									v: formatVnd(calc.baseFee)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: `${formatKm(calc.totalKm)} km × ${formatVnd(calc.perKmFee)}`,
									v: formatVnd(calc.kmAmount)
								}),
								calc.surchargeAmount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Phụ phí",
									v: formatVnd(calc.surchargeAmount)
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-between border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Tổng phụ cấp"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl font-semibold tabular-nums tracking-tight text-primary",
								children: formatVnd(calc.totalAmount)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void onSave(),
							disabled: path.length < 2 || busy,
							className: "mt-1 h-11",
							children: "Lưu phiếu"
						}),
						calc.legs.length === 1 && !calc.legs[0].estimated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "text-center text-xs text-primary underline-offset-4 hover:underline",
							href: googleMapsDir(getLocation(calc.legs[0].fromId || calc.legs[0].from), getLocation(calc.legs[0].toId || calc.legs[0].to)),
							target: "_blank",
							rel: "noreferrer",
							children: "Mở tuyến trên Google Maps"
						}) : null
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClusterMap, {
				pathIds: path,
				highlightIds: path,
				className: "min-h-56"
			})]
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "tabular-nums font-medium",
			children: v
		})]
	});
}
//#endregion
export { NewTripPage as component };
