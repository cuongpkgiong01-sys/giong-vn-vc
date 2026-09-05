import {
  LOCATIONS,
  ROUTES,
  VEHICLE_BY_ID,
  lookupLeg,
  type ClusterId,
  type VehicleId,
} from "./catalog";

export interface TripLeg {
  from: string;
  to: string;
  fromId: string;
  toId: string;
  km: number;
  estimated?: boolean;
}

export interface CalcResult {
  vehicleId: VehicleId;
  legs: TripLeg[];
  totalKm: number;
  baseFee: number;
  perKmFee: number;
  kmAmount: number;
  nightSurcharge: boolean;
  holidaySurcharge: boolean;
  surchargeRate: number;
  surchargeAmount: number;
  subtotal: number;
  totalAmount: number;
  noAllowanceOnly: boolean;
  hasEstimate: boolean;
}

function getRouteKm(from: string, to: string): number {
  const direct = ROUTES.find((r) => r.fromId === from && r.toId === to);
  if (direct) return direct.km;
  const reverse = ROUTES.find((r) => r.fromId === to && r.toId === from);
  if (reverse) return reverse.km;
  return 0;
}

export function getClusterForRoute(_from: string, to: string): ClusterId | null {
  const loc = LOCATIONS.find((l) => l.id === to);
  return loc ? loc.cluster : null;
}

export function getPerKmRate(vehicleId: VehicleId, cluster: ClusterId | null): number {
  if (vehicleId === "o-to") return 8000;

  // Xe máy: phụ thuộc vào cụm (Từ Sơn 4.000 đ/km; Mê Linh & Thanh Oai 5.000 đ/km)
  if (cluster === "tu-son") return 4000;
  if (cluster === "me-linh" || cluster === "thanh-oai") return 5000;

  // Mặc định 5000 nếu không xác định được cụm
  return 5000;
}

export function calculateTrip({
  vehicleId,
  path,
  nightSurcharge = false,
  holidaySurcharge = false,
}: {
  vehicleId: VehicleId;
  path: string[];
  nightSurcharge?: boolean;
  holidaySurcharge?: boolean;
}): CalcResult {
  const legs: TripLeg[] = [];
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
        estimated: legInfo.estimated,
      });
      totalKm += legInfo.km;
      if (legInfo.estimated) hasEstimate = true;
    }
  }

  const noAllowanceOnly =
    path.length > 0 &&
    path.every((id) => Boolean(LOCATIONS.find((l) => l.id === id)?.noAllowance));

  const vehicle = VEHICLE_BY_ID[vehicleId];
  const baseFee = noAllowanceOnly ? 0 : vehicle.baseFee;

  // Lấy đơn giá/km dựa trên cụm của điểm đến đầu tiên
  const firstCluster = legs.length > 0 ? getClusterForRoute(legs[0].from, legs[0].to) : null;
  const perKmRate = getPerKmRate(vehicleId, firstCluster);

  const kmAmount = noAllowanceOnly ? 0 : Math.round(totalKm * perKmRate);
  const subtotal = noAllowanceOnly ? 0 : baseFee + kmAmount;

  // Tính phụ phí
  let surchargeRate = 0;
  if (nightSurcharge) surchargeRate += 0.15;
  if (holidaySurcharge) surchargeRate += 0.2;

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
    hasEstimate,
  };
}

export function pathLabel(path: string[]): string {
  const names = path.map((id) => {
    const loc = LOCATIONS.find((l) => l.id === id);
    return loc ? loc.name : id;
  });
  if (names.length <= 2) return names.join(" → ");
  return `${names[0]} → ... → ${names[names.length - 1]}`;
}

export function generateReceiptNumber(date: string, count: number): string {
  const [year, month, dayPart] = String(date).split("-");
  const day = dayPart ?? "01";
  const seq = String(count + 1).padStart(3, "0");
  return `${seq}_${day}_${month}_${year}`;
}

// Function tối ưu lộ trình (sắp xếp lại các điểm để đi ngắn nhất)
export function optimizePath(path: string[]): string[] {
  if (path.length <= 2) return path;

  const [start, ...rest] = path;
  const end = rest[rest.length - 1];
  const middle = rest.slice(0, -1);

  // Simple nearest neighbor algorithm
  const optimized: string[] = [start];
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