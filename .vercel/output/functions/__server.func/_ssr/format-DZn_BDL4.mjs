//#region node_modules/.nitro/vite/services/ssr/assets/format-DZn_BDL4.js
function formatVnd(amount) {
	return new Intl.NumberFormat("vi-VN").format(Math.round(amount)) + " đ";
}
function formatKm(km) {
	return new Intl.NumberFormat("vi-VN", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	}).format(km);
}
function formatDateVi(iso) {
	const [y, m, d] = iso.split("-");
	if (!y || !m || !d) return iso;
	return `${d}/${m}/${y}`;
}
function todayIso() {
	const d = /* @__PURE__ */ new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function monthLabel(iso) {
	const [y, m] = iso.split("-");
	return `Tháng ${Number(m)}/${y}`;
}
function currentMonthKey(iso) {
	return (iso ?? todayIso()).slice(0, 7);
}
//#endregion
export { monthLabel as a, formatVnd as i, formatDateVi as n, todayIso as o, formatKm as r, currentMonthKey as t };
