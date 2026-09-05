//#region node_modules/.nitro/vite/services/ssr/assets/calculator-DEVecDDO.js
var CLUSTERS = [
	{
		id: "long-bien",
		name: "Long Bien",
		blurb: "Van phong va cac diem noi thanh gan tru so"
	},
	{
		id: "tu-son",
		name: "Tu Son",
		blurb: "Cum phia Bac - Tu Son, Huong Mac, Tien Du"
	},
	{
		id: "me-linh",
		name: "Me Linh",
		blurb: "Cum lon nhat - 8 diem phia Tay Bac"
	},
	{
		id: "thanh-oai",
		name: "Thanh Oai",
		blurb: "Cum phia Nam - Bich Hoa, Thanh Oai, Thanh Thuy, Quoc Oai"
	}
];
var LOCATIONS = [
	{
		id: "van-phong",
		name: "Van phong (Ngoc Lam)",
		cluster: "long-bien",
		lat: 21.0474332763591,
		lng: 105.877959916828,
		isHub: true,
		noAllowance: true,
		isOffice: true
	},
	{
		id: "long-bien",
		name: "Long Bien",
		cluster: "long-bien",
		lat: 21.0627442279662,
		lng: 105.896874627276,
		isHub: false,
		noAllowance: true,
		isOffice: false
	},
	{
		id: "sai-dong",
		name: "Sai Dong",
		cluster: "long-bien",
		lat: 21.0358391981518,
		lng: 105.910284561007,
		isHub: false,
		noAllowance: true,
		isOffice: false
	},
	{
		id: "tu-son",
		name: "Tu Son",
		cluster: "tu-son",
		lat: 21.1097603704972,
		lng: 105.959349075733,
		isHub: true,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "huong-mac",
		name: "Huong Mac",
		cluster: "tu-son",
		lat: 21.1604551272353,
		lng: 105.928950837069,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "tien-du",
		name: "Tien Du",
		cluster: "tu-son",
		lat: 21.0992855121102,
		lng: 105.98409833805,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "me-linh",
		name: "Me Linh",
		cluster: "me-linh",
		lat: 21.2028488019131,
		lng: 105.702030257183,
		isHub: true,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "tien-phong",
		name: "Tien Phong",
		cluster: "me-linh",
		lat: 21.1541597941742,
		lng: 105.760914581966,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "phuc-yen",
		name: "Phuc Yen",
		cluster: "me-linh",
		lat: 21.23089636549,
		lng: 105.693047432748,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "chi-dong",
		name: "Chi Dong",
		cluster: "me-linh",
		lat: 21.2079877314573,
		lng: 105.753097625428,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "thach-da",
		name: "Thach Da",
		cluster: "me-linh",
		lat: 21.1785771646301,
		lng: 105.677740211935,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "tam-an",
		name: "Tam An",
		cluster: "me-linh",
		lat: 21.1113327403996,
		lng: 105.789616743218,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "lien-mac",
		name: "Lien Mac",
		cluster: "me-linh",
		lat: 21.190999741066,
		lng: 105.644812840771,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "dong-xuan",
		name: "Dong Xuan",
		cluster: "me-linh",
		lat: 21.2774027206022,
		lng: 105.729285040773,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "bich-hoa",
		name: "Bich Hoa",
		cluster: "thanh-oai",
		lat: 20.9102039791977,
		lng: 105.760748937588,
		isHub: true,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "thanh-oai",
		name: "Thanh Oai",
		cluster: "thanh-oai",
		lat: 20.8652384616011,
		lng: 105.760769483094,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "thanh-thuy",
		name: "Thanh Thuy",
		cluster: "thanh-oai",
		lat: 20.8713064777181,
		lng: 105.805278894736,
		isHub: false,
		noAllowance: false,
		isOffice: false
	},
	{
		id: "quoc-oai",
		name: "Quoc Oai",
		cluster: "thanh-oai",
		lat: 20.9689120615865,
		lng: 105.681552999765,
		isHub: false,
		noAllowance: false,
		isOffice: false
	}
];
var LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));
var VEHICLES = [{
	id: "xe-may",
	name: "Xe may",
	baseFee: 1e4,
	perKmFee: 5e3
}, {
	id: "o-to",
	name: "O to",
	baseFee: 2e4,
	perKmFee: 8e3
}];
var VEHICLE_BY_ID = {
	"xe-may": VEHICLES[0],
	"o-to": VEHICLES[1]
};
var OFFICE_ID = "van-phong";
var ROAD_FACTOR = 1.45;
var ROUTES = [
	[
		"van-phong",
		"bich-hoa",
		28.5,
		"vp"
	],
	[
		"van-phong",
		"chi-dong",
		28.1,
		"vp"
	],
	[
		"van-phong",
		"huong-mac",
		19.4,
		"vp"
	],
	[
		"van-phong",
		"lien-mac",
		36.9,
		"vp"
	],
	[
		"van-phong",
		"long-bien",
		0,
		"vp"
	],
	[
		"van-phong",
		"me-linh",
		30.9,
		"vp"
	],
	[
		"van-phong",
		"phuc-yen",
		35.7,
		"vp"
	],
	[
		"van-phong",
		"quoc-oai",
		30.4,
		"vp"
	],
	[
		"van-phong",
		"sai-dong",
		0,
		"vp"
	],
	[
		"van-phong",
		"thanh-oai",
		32.6,
		"vp"
	],
	[
		"van-phong",
		"thanh-thuy",
		38.5,
		"vp"
	],
	[
		"van-phong",
		"thach-da",
		32.8,
		"vp"
	],
	[
		"van-phong",
		"tien-du",
		21.4,
		"vp"
	],
	[
		"van-phong",
		"tien-phong",
		22.9,
		"vp"
	],
	[
		"van-phong",
		"tam-an",
		16.2,
		"vp"
	],
	[
		"van-phong",
		"tu-son",
		12.2,
		"vp"
	],
	[
		"van-phong",
		"dong-xuan",
		38.3,
		"vp"
	],
	[
		"long-bien",
		"sai-dong",
		0,
		"noi-bo"
	],
	[
		"tu-son",
		"huong-mac",
		7.6,
		"noi-bo"
	],
	[
		"tu-son",
		"tien-du",
		5.6,
		"noi-bo"
	],
	[
		"huong-mac",
		"tien-du",
		12,
		"noi-bo"
	],
	[
		"me-linh",
		"tien-phong",
		9.2,
		"noi-bo"
	],
	[
		"me-linh",
		"phuc-yen",
		5,
		"noi-bo"
	],
	[
		"me-linh",
		"chi-dong",
		8.2,
		"noi-bo"
	],
	[
		"me-linh",
		"thach-da",
		4.6,
		"noi-bo"
	],
	[
		"me-linh",
		"tam-an",
		17.7,
		"noi-bo"
	],
	[
		"me-linh",
		"lien-mac",
		8.3,
		"noi-bo"
	],
	[
		"me-linh",
		"dong-xuan",
		9.8,
		"noi-bo"
	],
	[
		"tien-phong",
		"phuc-yen",
		14,
		"noi-bo"
	],
	[
		"tien-phong",
		"chi-dong",
		9.2,
		"noi-bo"
	],
	[
		"tien-phong",
		"thach-da",
		11.5,
		"noi-bo"
	],
	[
		"tien-phong",
		"tam-an",
		8.9,
		"noi-bo"
	],
	[
		"tien-phong",
		"lien-mac",
		15.7,
		"noi-bo"
	],
	[
		"tien-phong",
		"dong-xuan",
		18,
		"noi-bo"
	],
	[
		"phuc-yen",
		"chi-dong",
		8.4,
		"noi-bo"
	],
	[
		"phuc-yen",
		"thach-da",
		8.5,
		"noi-bo"
	],
	[
		"phuc-yen",
		"tam-an",
		20.7,
		"noi-bo"
	],
	[
		"phuc-yen",
		"lien-mac",
		8,
		"noi-bo"
	],
	[
		"phuc-yen",
		"dong-xuan",
		7.5,
		"noi-bo"
	],
	[
		"chi-dong",
		"thach-da",
		12.7,
		"noi-bo"
	],
	[
		"chi-dong",
		"tam-an",
		13.9,
		"noi-bo"
	],
	[
		"chi-dong",
		"lien-mac",
		16.5,
		"noi-bo"
	],
	[
		"chi-dong",
		"dong-xuan",
		10.5,
		"noi-bo"
	],
	[
		"thach-da",
		"tam-an",
		20.9,
		"noi-bo"
	],
	[
		"thach-da",
		"lien-mac",
		5.3,
		"noi-bo"
	],
	[
		"thach-da",
		"dong-xuan",
		17.1,
		"noi-bo"
	],
	[
		"tam-an",
		"lien-mac",
		21.8,
		"noi-bo"
	],
	[
		"tam-an",
		"dong-xuan",
		23.7,
		"noi-bo"
	],
	[
		"lien-mac",
		"dong-xuan",
		14.8,
		"noi-bo"
	],
	[
		"bich-hoa",
		"thanh-oai",
		5.2,
		"noi-bo"
	],
	[
		"bich-hoa",
		"thanh-thuy",
		8,
		"noi-bo"
	],
	[
		"bich-hoa",
		"quoc-oai",
		13.7,
		"noi-bo"
	],
	[
		"thanh-oai",
		"thanh-thuy",
		7.5,
		"noi-bo"
	],
	[
		"thanh-oai",
		"quoc-oai",
		20,
		"noi-bo"
	],
	[
		"thanh-thuy",
		"quoc-oai",
		22.7,
		"noi-bo"
	]
].map(([fromId, toId, km, kind]) => ({
	fromId,
	toId,
	km,
	kind,
	source: "google"
}));
function pairKey(a, b) {
	return a < b ? a + "|" + b : b + "|" + a;
}
var ROUTE_INDEX = /* @__PURE__ */ new Map();
for (const r of ROUTES) ROUTE_INDEX.set(pairKey(r.fromId, r.toId), r);
function getLocation(id) {
	const loc = LOCATION_BY_ID[id];
	if (!loc) throw new Error("Khong tim thay diem: " + id);
	return loc;
}
function haversineKm(a, b) {
	const R = 6371;
	const lat1Rad = a.lat * Math.PI / 180;
	const lat2Rad = b.lat * Math.PI / 180;
	const dLat = (b.lat - a.lat) * Math.PI / 180;
	const dLon = (b.lng - a.lng) * Math.PI / 180;
	const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
	return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}
function haversineMeters(lat1, lon1, lat2, lon2) {
	const R = 6371e3;
	const lat1Rad = lat1 * Math.PI / 180;
	const lat2Rad = lat2 * Math.PI / 180;
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
	return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}
function lookupLeg(fromId, toId) {
	if (fromId === toId) return {
		km: 0,
		estimated: false,
		source: "google"
	};
	const known = ROUTE_INDEX.get(pairKey(fromId, toId));
	if (known) return {
		km: known.km,
		estimated: false,
		source: "google"
	};
	const a = getLocation(fromId);
	const b = getLocation(toId);
	return {
		km: Math.round(haversineKm(a, b) * ROAD_FACTOR * 10) / 10,
		estimated: true,
		source: "estimate"
	};
}
function googleMapsDir(from, to) {
	return "https://www.google.com/maps/dir/?api=1&origin=" + from.lat + "," + from.lng + "&destination=" + to.lat + "," + to.lng + "&travelmode=driving";
}
function googleMapsPoint(loc) {
	return "https://www.google.com/maps?q=" + loc.lat + "," + loc.lng;
}
function roundToThousand(n) {
	return Math.round(n / 1e3) * 1e3;
}
function singleHopRate(km, vehicle, roundTable = true) {
	const raw = vehicle.baseFee + km * vehicle.perKmFee;
	return roundTable ? roundToThousand(raw) : Math.round(raw);
}
var DEFAULT_EMPLOYEES = [
	"Nguyen Van An",
	"Tran Thi Binh",
	"Le Minh Cuong",
	"Pham Thu Ha"
];
function getRouteKm(from, to) {
	const direct = ROUTES.find((r) => r.fromId === from && r.toId === to);
	if (direct) return direct.km;
	const reverse = ROUTES.find((r) => r.fromId === to && r.toId === from);
	if (reverse) return reverse.km;
	return 0;
}
function getClusterForRoute(_from, to) {
	const loc = LOCATIONS.find((l) => l.id === to);
	return loc ? loc.cluster : null;
}
function getPerKmRate(vehicleId, cluster) {
	if (vehicleId === "o-to") return 8e3;
	if (cluster === "tu-son") return 4e3;
	if (cluster === "me-linh" || cluster === "thanh-oai") return 5e3;
	return 5e3;
}
function calculateTrip({ vehicleId, path, nightSurcharge = false, holidaySurcharge = false }) {
	const legs = [];
	let totalKm = 0;
	let hasEstimate = false;
	for (let i = 0; i < path.length - 1; i += 1) {
		const from = path[i];
		const to = path[i + 1];
		const legInfo = lookupLeg(from, to);
		if (legInfo.km > 0) {
			legs.push({
				from,
				to,
				fromId: from,
				toId: to,
				km: legInfo.km,
				estimated: legInfo.estimated
			});
			totalKm += legInfo.km;
			if (legInfo.estimated) hasEstimate = true;
		}
	}
	const noAllowanceOnly = path.length > 0 && path.every((id) => Boolean(LOCATIONS.find((l) => l.id === id)?.noAllowance));
	const vehicle = VEHICLE_BY_ID[vehicleId];
	const baseFee = noAllowanceOnly ? 0 : vehicle.baseFee;
	const perKmRate = getPerKmRate(vehicleId, legs.length > 0 ? getClusterForRoute(legs[0].from, legs[0].to) : null);
	const kmAmount = noAllowanceOnly ? 0 : Math.round(totalKm * perKmRate);
	const subtotal = noAllowanceOnly ? 0 : baseFee + kmAmount;
	let surchargeRate = 0;
	if (nightSurcharge) surchargeRate += .15;
	if (holidaySurcharge) surchargeRate += .2;
	const surchargeAmount = noAllowanceOnly ? 0 : Math.round(subtotal * surchargeRate);
	const totalAmount = noAllowanceOnly ? 0 : subtotal + surchargeAmount;
	return {
		vehicleId,
		legs,
		totalKm: Math.round(totalKm * 10) / 10,
		baseFee,
		perKmFee: perKmRate,
		kmAmount,
		nightSurcharge,
		holidaySurcharge,
		surchargeRate,
		surchargeAmount,
		subtotal,
		totalAmount,
		noAllowanceOnly,
		hasEstimate
	};
}
function pathLabel(path) {
	const names = path.map((id) => {
		const loc = LOCATIONS.find((l) => l.id === id);
		return loc ? loc.name.split(" ")[0] : id;
	});
	if (names.length <= 2) return names.join(" → ");
	return `${names[0]} → ... → ${names[names.length - 1]}`;
}
function generateReceiptNumber(date, count) {
	const [year, month] = date.split("-");
	return `${year}${month}${String(count + 1).padStart(3, "0")}`;
}
function optimizePath(path) {
	if (path.length <= 2) return path;
	const [start, ...rest] = path;
	const end = rest[rest.length - 1];
	const middle = rest.slice(0, -1);
	const optimized = [start];
	const unvisited = [...middle];
	let current = start;
	while (unvisited.length > 0) {
		let nearest = unvisited[0];
		let minDist = getRouteKm(current, nearest);
		for (const point of unvisited) {
			const dist = getRouteKm(current, point);
			if (dist < minDist) {
				nearest = point;
				minDist = dist;
			}
		}
		optimized.push(nearest);
		unvisited.splice(unvisited.indexOf(nearest), 1);
		current = nearest;
	}
	optimized.push(end);
	return optimized;
}
//#endregion
export { singleHopRate as _, OFFICE_ID as a, VEHICLE_BY_ID as c, getLocation as d, googleMapsDir as f, pathLabel as g, optimizePath as h, LOCATION_BY_ID as i, calculateTrip as l, haversineMeters as m, DEFAULT_EMPLOYEES as n, ROUTES as o, googleMapsPoint as p, LOCATIONS as r, VEHICLES as s, CLUSTERS as t, generateReceiptNumber as u };
