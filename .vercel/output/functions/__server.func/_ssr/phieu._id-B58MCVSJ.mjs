import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as VEHICLE_BY_ID, d as getLocation, g as pathLabel } from "./calculator-DEVecDDO.mjs";
import { E as ArrowLeft, g as FileDown, i as Trash2, l as Printer, p as LoaderCircle, t as X, y as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Button, n as Route$1, r as useAppStore } from "./router-CSy7gJSc.mjs";
import { i as formatVnd, n as formatDateVi, r as formatKm } from "./format-DZn_BDL4.mjs";
import { n as rgb, t as PDFDocument } from "../_libs/pdf-lib.mjs";
import { t as fontkit } from "../_libs/pako+pdf-lib__fontkit.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/phieu._id-B58MCVSJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReceiptView({ receipt }) {
	const vehicle = VEHICLE_BY_ID[receipt.vehicleId];
	const start = getLocation(receipt.path[0] ?? "van-phong");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-2xl bg-card px-6 py-8 text-foreground shadow-[var(--shadow-border)] print:max-w-none print:shadow-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-border pb-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: "Cộng hòa xã hội chủ nghĩa Việt Nam"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Độc lập — Tự do — Hạnh phúc"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 text-lg font-semibold tracking-tight",
						children: "Công ty cổ phần Giong Việt Nam"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Hệ thống tính phụ cấp vận chuyển nội bộ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 text-xl font-semibold",
						children: "Phiếu tính phụ cấp vận chuyển"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "Số phiếu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium tabular-nums",
						children: receipt.number
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "Ngày vận chuyển"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium",
						children: formatDateVi(receipt.date)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "Người vận chuyển"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium",
						children: receipt.employeeName
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted-foreground",
						children: "Phương tiện"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium",
						children: vehicle.name
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Điểm bắt đầu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: start.name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Lộ trình"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: pathLabel(receipt.path)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "mt-6 w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-y border-border text-left text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 font-medium",
							children: "STT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 font-medium",
							children: "Chặng"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 text-right font-medium",
							children: "Km"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: receipt.legs.map((leg, i) => {
					const fromId = leg.fromId || leg.from;
					const toId = leg.toId || leg.to;
					const fromName = getLocation(fromId).name.replace("Văn phòng (Ngọc Lâm)", "Văn phòng");
					const toName = getLocation(toId).name;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 tabular-nums",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-2",
								children: [
									fromName,
									" → ",
									toName,
									leg.estimated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-xs text-warn",
										children: "ước tính"
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-right tabular-nums",
								children: formatKm(leg.km)
							})
						]
					}, `${fromId}-${toId}-${i}`);
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-6 space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tổng quãng đường" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "tabular-nums",
							children: [formatKm(receipt.totalKm), " km"]
						})]
					}),
					receipt.noAllowanceOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-warn",
						children: "Điểm Long Biên / Ngọc Lâm / Sài Đồng — không áp dụng khoán."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Phí mở chuyến" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: formatVnd(receipt.baseFee)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [
								formatKm(receipt.totalKm),
								" km × ",
								formatVnd(receipt.perKmFee),
								"/km"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: formatVnd(receipt.kmAmount)
							})]
						}),
						receipt.nightSurcharge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Phụ phí ban đêm / ngoài giờ +15%" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: "có"
							})]
						}) : null,
						receipt.holidaySurcharge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Phụ phí lễ, Tết +20%" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: "có"
							})]
						}) : null,
						receipt.surchargeAmount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tiền phụ phí" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: formatVnd(receipt.surchargeAmount)
							})]
						}) : null
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-t border-border pt-3 text-base font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tổng phụ cấp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "tabular-nums text-primary",
							children: formatVnd(receipt.totalAmount)
						})]
					})
				]
			}),
			receipt.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: ["Ghi chú: ", receipt.notes]
			}) : null,
			receipt.evidence.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Chứng cứ GPS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1 text-sm text-muted-foreground",
					children: receipt.evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						e.name,
						" — ",
						e.matchStatus === "Matched" ? `khớp ${e.matchedLocation}` : e.matchStatus === "No_GPS" ? "không có GPS" : "không khớp"
					] }, e.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid grid-cols-3 gap-4 text-center text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Người vận chuyển"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "(Ký, ghi rõ họ tên)"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Kế toán"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "(Ký)"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Người duyệt"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "(Ký)"
					})] })
				]
			})
		]
	});
}
function PdfViewer({ url, title, filename, onClose }) {
	const frameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [onClose]);
	function handlePrint() {
		const frame = frameRef.current;
		try {
			frame?.contentWindow?.focus();
			frame?.contentWindow?.print();
		} catch {
			window.open(url, "_blank", "noopener,noreferrer");
		}
	}
	function handleDownload() {
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.rel = "noopener";
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-ink",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": title,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "no-print flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-3 sm:px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-semibold text-sidebar-foreground",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-sidebar-muted",
						children: "Đã lưu PDF — in hoặc đóng khi xong"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: handlePrint,
					className: "hidden border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent sm:inline-flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "In"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: handleDownload,
					className: "hidden border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent sm:inline-flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Tải xuống"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: handlePrint,
					className: "text-sidebar-foreground hover:bg-sidebar-accent sm:hidden",
					"aria-label": "In",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: handleDownload,
					className: "text-sidebar-foreground hover:bg-sidebar-accent sm:hidden",
					"aria-label": "Tải xuống",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onClose,
					className: "text-sidebar-foreground hover:bg-sidebar-accent",
					"aria-label": "Đóng",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				ref: frameRef,
				title,
				src: url,
				className: "h-full w-full border-0 bg-card"
			})
		})]
	});
}
var A4 = {
	width: 595.28,
	height: 841.89
};
var MARGIN = 48;
var ink = rgb(21 / 255, 32 / 255, 28 / 255);
var muted = rgb(92 / 255, 104 / 255, 100 / 255);
var primary = rgb(28 / 255, 92 / 255, 82 / 255);
var line = rgb(212 / 255, 205 / 255, 192 / 255);
var headerBg = rgb(18 / 255, 26 / 255, 24 / 255);
var white = rgb(1, 1, 1);
var warn = rgb(138 / 255, 90 / 255, 40 / 255);
var paper = rgb(1, 252 / 255, 247 / 255);
var rowBg = rgb(243 / 255, 239 / 255, 230 / 255);
var fontBytes = null;
async function loadFontBytes() {
	if (fontBytes) return fontBytes;
	const [regular, bold] = await Promise.all([fetch("/fonts/DejaVuSans.ttf").then((r) => {
		if (!r.ok) throw new Error("Không tải được font");
		return r.arrayBuffer();
	}), fetch("/fonts/DejaVuSans-Bold.ttf").then((r) => {
		if (!r.ok) throw new Error("Không tải được font");
		return r.arrayBuffer();
	})]);
	fontBytes = {
		regular,
		bold
	};
	return fontBytes;
}
function wrapText(text, font, size, maxWidth) {
	const words = text.split(/\s+/);
	const lines = [];
	let current = "";
	const push = (s) => {
		if (s) lines.push(s);
	};
	for (const word of words) {
		const trial = current ? `${current} ${word}` : word;
		if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
			current = trial;
			continue;
		}
		push(current);
		if (font.widthOfTextAtSize(word, size) <= maxWidth) {
			current = word;
			continue;
		}
		let chunk = "";
		for (const ch of word) {
			const next = chunk + ch;
			if (font.widthOfTextAtSize(next, size) <= maxWidth) chunk = next;
			else {
				push(chunk);
				chunk = ch;
			}
		}
		current = chunk;
	}
	push(current);
	return lines.length ? lines : [""];
}
function drawCentered(page, text, y, font, size, color) {
	const w = font.widthOfTextAtSize(text, size);
	page.drawText(text, {
		x: (A4.width - w) / 2,
		y,
		font,
		size,
		color
	});
}
function receiptPdfFilename(receipt) {
	return `Phieu_${receipt.number}.pdf`;
}
async function buildReceiptPdf(receipt) {
	const fonts = await loadFontBytes();
	const doc = await PDFDocument.create();
	doc.registerFontkit(fontkit);
	const regular = await doc.embedFont(fonts.regular, { subset: true });
	const bold = await doc.embedFont(fonts.bold, { subset: true });
	const vehicle = VEHICLE_BY_ID[receipt.vehicleId];
	const start = getLocation(receipt.path[0] ?? "van-phong");
	const contentWidth = A4.width - 96;
	let page = doc.addPage([A4.width, A4.height]);
	page.drawRectangle({
		x: 0,
		y: 0,
		width: A4.width,
		height: A4.height,
		color: paper
	});
	const ensureSpace = (need, y) => {
		if (y - need > 56) return y;
		page = doc.addPage([A4.width, A4.height]);
		page.drawRectangle({
			x: 0,
			y: 0,
			width: A4.width,
			height: A4.height,
			color: paper
		});
		return A4.height - 40;
	};
	page.drawRectangle({
		x: 0,
		y: A4.height - 96,
		width: A4.width,
		height: 96,
		color: headerBg
	});
	drawCentered(page, "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", A4.height - 28, regular, 8, rgb(.55, .65, .61));
	drawCentered(page, "Độc lập — Tự do — Hạnh phúc", A4.height - 42, regular, 8, rgb(.55, .65, .61));
	drawCentered(page, "CÔNG TY CỔ PHẦN GIONG VIỆT NAM", A4.height - 64, bold, 13, white);
	drawCentered(page, "Phiếu tính phụ cấp vận chuyển", A4.height - 82, regular, 11, rgb(.72, .86, .82));
	let y = A4.height - 120;
	const info = [[
		"Số phiếu",
		receipt.number,
		"Ngày vận chuyển",
		formatDateVi(receipt.date)
	], [
		"Người vận chuyển",
		receipt.employeeName,
		"Phương tiện",
		vehicle.name
	]];
	const col = contentWidth / 2;
	const rowH = 32;
	const boxX = MARGIN;
	const boxW = contentWidth;
	const boxH = 64;
	page.drawRectangle({
		x: boxX,
		y: y - boxH,
		width: boxW,
		height: boxH,
		borderColor: line,
		borderWidth: .8,
		color: white
	});
	page.drawLine({
		start: {
			x: boxX + col,
			y
		},
		end: {
			x: boxX + col,
			y: y - boxH
		},
		thickness: .6,
		color: line
	});
	page.drawLine({
		start: {
			x: boxX,
			y: y - rowH
		},
		end: {
			x: boxX + boxW,
			y: y - rowH
		},
		thickness: .6,
		color: line
	});
	info.forEach((row, i) => {
		const top = y - i * rowH;
		page.drawText(row[0], {
			x: 56,
			y: top - 12,
			font: regular,
			size: 7.5,
			color: muted
		});
		page.drawText(row[1], {
			x: 56,
			y: top - 25,
			font: bold,
			size: 10,
			color: ink
		});
		page.drawText(row[2], {
			x: boxX + col + 8,
			y: top - 12,
			font: regular,
			size: 7.5,
			color: muted
		});
		page.drawText(row[3], {
			x: boxX + col + 8,
			y: top - 25,
			font: bold,
			size: 10,
			color: ink
		});
	});
	y -= 80;
	page.drawText("Điểm bắt đầu", {
		x: MARGIN,
		y,
		font: regular,
		size: 7.5,
		color: muted
	});
	y -= 13;
	page.drawText(start.name, {
		x: MARGIN,
		y,
		font: bold,
		size: 10,
		color: ink
	});
	y -= 16;
	page.drawText("Lộ trình", {
		x: MARGIN,
		y,
		font: regular,
		size: 7.5,
		color: muted
	});
	y -= 13;
	const routeLines = wrapText(pathLabel(receipt.path), bold, 10, contentWidth);
	for (const ln of routeLines) {
		y = ensureSpace(14, y);
		page.drawText(ln, {
			x: MARGIN,
			y,
			font: bold,
			size: 10,
			color: ink
		});
		y -= 13;
	}
	y -= 10;
	y = ensureSpace(40, y);
	const cols = {
		stt: MARGIN,
		route: 84,
		km: A4.width - MARGIN - 70
	};
	const headerY = y;
	page.drawRectangle({
		x: MARGIN,
		y: headerY - 18,
		width: contentWidth,
		height: 22,
		color: rowBg
	});
	page.drawText("STT", {
		x: cols.stt + 8,
		y: headerY - 12,
		font: bold,
		size: 8,
		color: muted
	});
	page.drawText("Chặng", {
		x: cols.route,
		y: headerY - 12,
		font: bold,
		size: 8,
		color: muted
	});
	page.drawText("Km", {
		x: cols.km + 30,
		y: headerY - 12,
		font: bold,
		size: 8,
		color: muted
	});
	y = headerY - 26;
	receipt.legs.forEach((leg, i) => {
		const fromId = leg.fromId || leg.from;
		const toId = leg.toId || leg.to;
		const wrapped = wrapText(`${getLocation(fromId).name.replace("Văn phòng (Ngọc Lâm)", "Văn phòng")}  →  ${getLocation(toId).name}${leg.estimated ? "  (ước tính)" : ""}`, regular, 9, cols.km - cols.route - 8);
		const h = Math.max(20, wrapped.length * 12 + 8);
		y = ensureSpace(h + 4, y);
		if (i % 2 === 1) page.drawRectangle({
			x: MARGIN,
			y: y - h + 8,
			width: contentWidth,
			height: h,
			color: rgb(.98, .97, .94)
		});
		page.drawText(String(i + 1), {
			x: cols.stt + 10,
			y: y - 4,
			font: regular,
			size: 9,
			color: ink
		});
		wrapped.forEach((ln, li) => {
			page.drawText(ln, {
				x: cols.route,
				y: y - 4 - li * 12,
				font: regular,
				size: 9,
				color: ink
			});
		});
		const kmText = formatKm(leg.km);
		const kmW = regular.widthOfTextAtSize(kmText, 9);
		page.drawText(kmText, {
			x: A4.width - MARGIN - 12 - kmW,
			y: y - 4,
			font: regular,
			size: 9,
			color: ink
		});
		y -= h;
		page.drawLine({
			start: {
				x: MARGIN,
				y: y + 6
			},
			end: {
				x: A4.width - MARGIN,
				y: y + 6
			},
			thickness: .4,
			color: line
		});
	});
	y -= 18;
	y = ensureSpace(120, y);
	const rows = [["Tổng quãng đường", `${formatKm(receipt.totalKm)} km`]];
	if (receipt.noAllowanceOnly) rows.push([
		"Ghi chú khoán",
		"Long Biên / Ngọc Lâm / Sài Đồng — không áp dụng khoán",
		true
	]);
	else {
		rows.push(["Phí mở chuyến", formatVnd(receipt.baseFee)]);
		rows.push([`${formatKm(receipt.totalKm)} km × ${formatVnd(receipt.perKmFee)}/km`, formatVnd(receipt.kmAmount)]);
		if (receipt.nightSurcharge) rows.push(["Phụ phí ban đêm / ngoài giờ", "+15%"]);
		if (receipt.holidaySurcharge) rows.push(["Phụ phí lễ, Tết", "+20%"]);
		if (receipt.surchargeAmount > 0) rows.push(["Tiền phụ phí", formatVnd(receipt.surchargeAmount)]);
	}
	for (const [k, v, isWarn] of rows) {
		y = ensureSpace(16, y);
		page.drawText(k, {
			x: MARGIN,
			y,
			font: regular,
			size: 9,
			color: isWarn ? warn : muted
		});
		const vw = (isWarn ? regular : bold).widthOfTextAtSize(v, 9);
		page.drawText(v, {
			x: A4.width - MARGIN - vw,
			y,
			font: isWarn ? regular : bold,
			size: 9,
			color: isWarn ? warn : ink
		});
		y -= 16;
	}
	y -= 6;
	y = ensureSpace(36, y);
	page.drawLine({
		start: {
			x: MARGIN,
			y: y + 12
		},
		end: {
			x: A4.width - MARGIN,
			y: y + 12
		},
		thickness: .8,
		color: line
	});
	page.drawText("TỔNG PHỤ CẤP", {
		x: MARGIN,
		y,
		font: bold,
		size: 11,
		color: ink
	});
	const total = formatVnd(receipt.totalAmount);
	const tw = bold.widthOfTextAtSize(total, 14);
	page.drawText(total, {
		x: A4.width - MARGIN - tw,
		y: y - 2,
		font: bold,
		size: 14,
		color: primary
	});
	if (receipt.notes) {
		y -= 28;
		y = ensureSpace(28, y);
		page.drawText("Ghi chú", {
			x: MARGIN,
			y,
			font: regular,
			size: 7.5,
			color: muted
		});
		y -= 13;
		for (const ln of wrapText(receipt.notes, regular, 9, contentWidth)) {
			y = ensureSpace(13, y);
			page.drawText(ln, {
				x: MARGIN,
				y,
				font: regular,
				size: 9,
				color: ink
			});
			y -= 13;
		}
	}
	if (receipt.evidence.length > 0) {
		y -= 10;
		y = ensureSpace(20, y);
		page.drawText("Chứng cứ GPS", {
			x: MARGIN,
			y,
			font: bold,
			size: 9,
			color: ink
		});
		y -= 14;
		for (const e of receipt.evidence) {
			const status = e.matchStatus === "Matched" ? `khớp ${e.matchedLocation ?? ""}` : e.matchStatus === "No_GPS" ? "không có GPS" : "không khớp";
			const lineText = `${e.name} — ${status}`;
			for (const ln of wrapText(lineText, regular, 8.5, contentWidth)) {
				y = ensureSpace(12, y);
				page.drawText(ln, {
					x: MARGIN,
					y,
					font: regular,
					size: 8.5,
					color: muted
				});
				y -= 12;
			}
		}
	}
	y -= 36;
	y = ensureSpace(70, y);
	const sigW = contentWidth / 3;
	const labels = [
		"Người vận chuyển",
		"Kế toán",
		"Người duyệt"
	];
	const hints = [
		"(Ký, ghi rõ họ tên)",
		"(Ký)",
		"(Ký)"
	];
	labels.forEach((label, i) => {
		const cx = MARGIN + sigW * i + sigW / 2;
		const lw = bold.widthOfTextAtSize(label, 9);
		page.drawText(label, {
			x: cx - lw / 2,
			y,
			font: bold,
			size: 9,
			color: ink
		});
		const hw = regular.widthOfTextAtSize(hints[i], 7.5);
		page.drawText(hints[i], {
			x: cx - hw / 2,
			y: y - 12,
			font: regular,
			size: 7.5,
			color: muted
		});
	});
	const pages = doc.getPages();
	pages.forEach((p, i) => {
		const footer = `QC-GIONG  ·  Phụ cấp vận chuyển nội bộ  ·  Trang ${i + 1}/${pages.length}`;
		const fw = regular.widthOfTextAtSize(footer, 7);
		p.drawText(footer, {
			x: (A4.width - fw) / 2,
			y: 28,
			font: regular,
			size: 7,
			color: muted
		});
	});
	doc.setTitle(`Phiếu ${receipt.number} — Giong Việt Nam`);
	doc.setAuthor("Công ty cổ phần Giong Việt Nam");
	doc.setSubject("Phiếu tính phụ cấp vận chuyển nội bộ");
	return doc.save();
}
function pdfBlob(bytes) {
	const copy = new Uint8Array(bytes.byteLength);
	copy.set(bytes);
	return new Blob([copy], { type: "application/pdf" });
}
function downloadPdf(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	return url;
}
function ReceiptDetailPage() {
	const { id } = Route$1.useParams();
	const navigate = useNavigate();
	const receipt = useAppStore((s) => s.receipts.find((r) => r.id === id));
	const deleteReceipt = useAppStore((s) => s.deleteReceipt);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [viewer, setViewer] = (0, import_react.useState)(null);
	if (!receipt) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Không tìm thấy phiếu"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Phiếu có thể đã bị xóa trên thiết bị này."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/phieu",
					children: "Quay lại sổ phiếu"
				})
			})
		]
	});
	async function savePdf() {
		if (!receipt) return;
		setBusy(true);
		try {
			const blob = pdfBlob(await buildReceiptPdf(receipt));
			const filename = receiptPdfFilename(receipt);
			const url = downloadPdf(blob, filename);
			setViewer({
				url,
				filename
			});
			toast.success("Đã lưu PDF");
		} catch (err) {
			console.error(err);
			toast.error("Không tạo được PDF. Thử lại.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/phieu",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Sổ phiếu"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => void savePdf(),
						disabled: busy,
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), busy ? "Đang tạo PDF…" : "Lưu PDF"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						size: "sm",
						onClick: () => {
							(async () => {
								try {
									await deleteReceipt(receipt.id);
									toast.success("Đã xóa phiếu");
									await navigate({ to: "/phieu" });
								} catch (error) {
									console.error(error);
									toast.error("Không xóa được phiếu trên máy chủ.");
								}
							})();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Xóa"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptView, { receipt }),
			viewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfViewer, {
				url: viewer.url,
				title: `Phiếu ${receipt.number}`,
				filename: viewer.filename,
				onClose: () => {
					URL.revokeObjectURL(viewer.url);
					setViewer(null);
				}
			}) : null
		]
	});
}
//#endregion
export { ReceiptDetailPage as component };
