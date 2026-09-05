export type ClusterId = "long-bien" | "tu-son" | "me-linh" | "thanh-oai";
export type VehicleId = "xe-may" | "o-to";

export interface Location {
  id: string;
  name: string;
  cluster: ClusterId;
  lat: number;
  lng: number;
  isHub: boolean;
  noAllowance: boolean;
  isOffice: boolean;
}

export interface Cluster {
  id: ClusterId;
  name: string;
  blurb: string;
}

export interface Vehicle {
  id: VehicleId;
  name: string;
  baseFee: number;
  perKmFee: number;
}

export interface RouteEdge {
  fromId: string;
  toId: string;
  km: number;
  kind: "vp" | "noi-bo";
  source: "google" | "estimate";
}

export const CLUSTERS: Cluster[] = [
  { id: "long-bien", name: "Long Biên", blurb: "Văn phòng và các điểm nội thành gần trụ sở" },
  { id: "tu-son", name: "Từ Sơn", blurb: "Cụm phía Bắc — Từ Sơn, Hương Mạc, Tiên Du" },
  { id: "me-linh", name: "Mê Linh", blurb: "Cụm lớn nhất — 8 điểm phía Tây Bắc" },
  { id: "thanh-oai", name: "Thanh Oai", blurb: "Cụm phía Nam — Bích Hòa, Thanh Oai, Thanh Thùy, Quốc Oai" },
];

export const LOCATIONS: Location[] = [
  { id: "van-phong", name: "Văn phòng (Ngọc Lâm)", cluster: "long-bien", lat: 21.0474332763591, lng: 105.877959916828, isHub: true, noAllowance: true, isOffice: true },
  { id: "long-bien", name: "Long Biên", cluster: "long-bien", lat: 21.0627442279662, lng: 105.896874627276, isHub: false, noAllowance: true, isOffice: false },
  { id: "sai-dong", name: "Sài Đồng", cluster: "long-bien", lat: 21.0358391981518, lng: 105.910284561007, isHub: false, noAllowance: true, isOffice: false },
  { id: "tu-son", name: "Từ Sơn", cluster: "tu-son", lat: 21.1097603704972, lng: 105.959349075733, isHub: true, noAllowance: false, isOffice: false },
  { id: "huong-mac", name: "Hương Mạc", cluster: "tu-son", lat: 21.1604551272353, lng: 105.928950837069, isHub: false, noAllowance: false, isOffice: false },
  { id: "tien-du", name: "Tiên Du", cluster: "tu-son", lat: 21.0992855121102, lng: 105.98409833805, isHub: false, noAllowance: false, isOffice: false },
  { id: "me-linh", name: "Mê Linh", cluster: "me-linh", lat: 21.2028488019131, lng: 105.702030257183, isHub: true, noAllowance: false, isOffice: false },
  { id: "tien-phong", name: "Tiền Phong", cluster: "me-linh", lat: 21.1541597941742, lng: 105.760914581966, isHub: false, noAllowance: false, isOffice: false },
  { id: "phuc-yen", name: "Phúc Yên", cluster: "me-linh", lat: 21.23089636549, lng: 105.693047432748, isHub: false, noAllowance: false, isOffice: false },
  { id: "chi-dong", name: "Chi Đông", cluster: "me-linh", lat: 21.2079877314573, lng: 105.753097625428, isHub: false, noAllowance: false, isOffice: false },
  { id: "thach-da", name: "Thạch Đà", cluster: "me-linh", lat: 21.1785771646301, lng: 105.677740211935, isHub: false, noAllowance: false, isOffice: false },
  { id: "tam-an", name: "Tâm An", cluster: "me-linh", lat: 21.1113327403996, lng: 105.789616743218, isHub: false, noAllowance: false, isOffice: false },
  { id: "lien-mac", name: "Liên Mạc", cluster: "me-linh", lat: 21.190999741066, lng: 105.644812840771, isHub: false, noAllowance: false, isOffice: false },
  { id: "dong-xuan", name: "Đồng Xuân", cluster: "me-linh", lat: 21.2774027206022, lng: 105.729285040773, isHub: false, noAllowance: false, isOffice: false },
  { id: "bich-hoa", name: "Bích Hòa", cluster: "thanh-oai", lat: 20.9102039791977, lng: 105.760748937588, isHub: true, noAllowance: false, isOffice: false },
  { id: "thanh-oai", name: "Thanh Oai", cluster: "thanh-oai", lat: 20.8652384616011, lng: 105.760769483094, isHub: false, noAllowance: false, isOffice: false },
  { id: "thanh-thuy", name: "Thanh Thùy", cluster: "thanh-oai", lat: 20.8713064777181, lng: 105.805278894736, isHub: false, noAllowance: false, isOffice: false },
  { id: "quoc-oai", name: "Quốc Oai", cluster: "thanh-oai", lat: 20.9689120615865, lng: 105.681552999765, isHub: false, noAllowance: false, isOffice: false },
];

export const LOCATION_BY_ID: Record<string, Location> = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, l]),
);

export const VEHICLES: Vehicle[] = [
  { id: "xe-may", name: "Xe máy", baseFee: 10000, perKmFee: 5000 },
  { id: "o-to", name: "Ô tô", baseFee: 20000, perKmFee: 8000 },
];

export const VEHICLE_BY_ID: Record<VehicleId, Vehicle> = {
  "xe-may": VEHICLES[0],
  "o-to": VEHICLES[1],
};

export const OFFICE_ID = "van-phong";
export const NIGHT_RATE = 0.15;
export const HOLIDAY_RATE = 0.2;
export const GPS_TOLERANCE_M = 500;
export const ROAD_FACTOR = 1.45;

const RAW_ROUTES: Array<[string, string, number, "vp" | "noi-bo"]> = [
  ["van-phong", "bich-hoa", 28.5, "vp"],
  ["van-phong", "chi-dong", 28.1, "vp"],
  ["van-phong", "huong-mac", 19.4, "vp"],
  ["van-phong", "lien-mac", 36.9, "vp"],
  ["van-phong", "long-bien", 0, "vp"],
  ["van-phong", "me-linh", 30.9, "vp"],
  ["van-phong", "phuc-yen", 35.7, "vp"],
  ["van-phong", "quoc-oai", 30.4, "vp"],
  ["van-phong", "sai-dong", 0, "vp"],
  ["van-phong", "thanh-oai", 32.6, "vp"],
  ["van-phong", "thanh-thuy", 38.5, "vp"],
  ["van-phong", "thach-da", 32.8, "vp"],
  ["van-phong", "tien-du", 21.4, "vp"],
  ["van-phong", "tien-phong", 22.9, "vp"],
  ["van-phong", "tam-an", 16.2, "vp"],
  ["van-phong", "tu-son", 12.2, "vp"],
  ["van-phong", "dong-xuan", 38.3, "vp"],
  ["long-bien", "sai-dong", 0, "noi-bo"],
  ["tu-son", "huong-mac", 7.6, "noi-bo"],
  ["tu-son", "tien-du", 5.6, "noi-bo"],
  ["huong-mac", "tien-du", 12.0, "noi-bo"],
  ["me-linh", "tien-phong", 9.2, "noi-bo"],
  ["me-linh", "phuc-yen", 5.0, "noi-bo"],
  ["me-linh", "chi-dong", 8.2, "noi-bo"],
  ["me-linh", "thach-da", 4.6, "noi-bo"],
  ["me-linh", "tam-an", 17.7, "noi-bo"],
  ["me-linh", "lien-mac", 8.3, "noi-bo"],
  ["me-linh", "dong-xuan", 9.8, "noi-bo"],
  ["tien-phong", "phuc-yen", 14.0, "noi-bo"],
  ["tien-phong", "chi-dong", 9.2, "noi-bo"],
  ["tien-phong", "thach-da", 11.5, "noi-bo"],
  ["tien-phong", "tam-an", 8.9, "noi-bo"],
  ["tien-phong", "lien-mac", 15.7, "noi-bo"],
  ["tien-phong", "dong-xuan", 18.0, "noi-bo"],
  ["phuc-yen", "chi-dong", 8.4, "noi-bo"],
  ["phuc-yen", "thach-da", 8.5, "noi-bo"],
  ["phuc-yen", "tam-an", 20.7, "noi-bo"],
  ["phuc-yen", "lien-mac", 8.0, "noi-bo"],
  ["phuc-yen", "dong-xuan", 7.5, "noi-bo"],
  ["chi-dong", "thach-da", 12.7, "noi-bo"],
  ["chi-dong", "tam-an", 13.9, "noi-bo"],
  ["chi-dong", "lien-mac", 16.5, "noi-bo"],
  ["chi-dong", "dong-xuan", 10.5, "noi-bo"],
  ["thach-da", "tam-an", 20.9, "noi-bo"],
  ["thach-da", "lien-mac", 5.3, "noi-bo"],
  ["thach-da", "dong-xuan", 17.1, "noi-bo"],
  ["tam-an", "lien-mac", 21.8, "noi-bo"],
  ["tam-an", "dong-xuan", 23.7, "noi-bo"],
  ["lien-mac", "dong-xuan", 14.8, "noi-bo"],
  ["bich-hoa", "thanh-oai", 5.2, "noi-bo"],
  ["bich-hoa", "thanh-thuy", 8.0, "noi-bo"],
  ["bich-hoa", "quoc-oai", 13.7, "noi-bo"],
  ["thanh-oai", "thanh-thuy", 7.5, "noi-bo"],
  ["thanh-oai", "quoc-oai", 20.0, "noi-bo"],
  ["thanh-thuy", "quoc-oai", 22.7, "noi-bo"],
];

export const ROUTES: RouteEdge[] = RAW_ROUTES.map(([fromId, toId, km, kind]) => ({
  fromId,
  toId,
  km,
  kind,
  source: "google",
}));

function pairKey(a: string, b: string): string {
  return a < b ? a + "|" + b : b + "|" + a;
}

const ROUTE_INDEX = new Map<string, RouteEdge>();
for (const r of ROUTES) {
  ROUTE_INDEX.set(pairKey(r.fromId, r.toId), r);
}

export function getLocation(id: string): Location {
  const loc = LOCATION_BY_ID[id];
  if (!loc) throw new Error("Không tìm thấy điểm: " + id);
  return loc;
}

export function clusterName(id: ClusterId): string {
  return CLUSTERS.find((c) => c.id === id)?.name ?? id;
}

export function haversineKm(a: Location, b: Location): number {
  const R = 6371;
  const lat1Rad = (a.lat * Math.PI) / 180;
  const lat2Rad = (b.lat * Math.PI) / 180;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export interface LegLookup {
  km: number;
  estimated: boolean;
  source: "google" | "estimate";
}

export function lookupLeg(fromId: string, toId: string): LegLookup {
  if (fromId === toId) return { km: 0, estimated: false, source: "google" };
  const known = ROUTE_INDEX.get(pairKey(fromId, toId));
  if (known) return { km: known.km, estimated: false, source: "google" };
  const a = getLocation(fromId);
  const b = getLocation(toId);
  const km = Math.round(haversineKm(a, b) * ROAD_FACTOR * 10) / 10;
  return { km, estimated: true, source: "estimate" };
}

export function googleMapsDir(from: Location, to: Location): string {
  return "https://www.google.com/maps/dir/?api=1&origin=" + from.lat + "," + from.lng + "&destination=" + to.lat + "," + to.lng + "&travelmode=driving";
}

export function googleMapsPoint(loc: Location): string {
  return "https://www.google.com/maps?q=" + loc.lat + "," + loc.lng;
}

export function roundToThousand(n: number): number {
  return Math.round(n / 1000) * 1000;
}

export function singleHopRate(km: number, vehicle: Vehicle, roundTable = true): number {
  const raw = vehicle.baseFee + km * vehicle.perKmFee;
  return roundTable ? roundToThousand(raw) : Math.round(raw);
}

export const DEFAULT_EMPLOYEES = [
  "Phạm Kiên Cường",
];