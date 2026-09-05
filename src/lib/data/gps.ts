import { GPS_TOLERANCE_M, LOCATIONS, haversineMeters } from "./catalog";

export interface GpsMatch {
  hasGps: boolean;
  lat: number | null;
  lon: number | null;
  matchStatus: "Matched" | "Unmatched" | "No_GPS";
  matchedLocationId: string | null;
  matchedLocation: string | null;
  distanceM: number | null;
  warning: string | null;
}

function readU16(view: DataView, offset: number, le: boolean): number {
  return le ? view.getUint16(offset, true) : view.getUint16(offset, false);
}
function readU32(view: DataView, offset: number, le: boolean): number {
  return le ? view.getUint32(offset, true) : view.getUint32(offset, false);
}

function readRational(view: DataView, offset: number, le: boolean): number {
  const num = readU32(view, offset, le);
  const den = readU32(view, offset + 4, le) || 1;
  return num / den;
}

/** Minimal JPEG EXIF GPS reader — no extra dependency. */
export function readGpsFromJpeg(buffer: ArrayBuffer): { lat: number; lon: number } | null {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 4 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    const size = view.getUint16(offset + 2, false);
    if (marker === 0xe1) {
      const start = offset + 4;
      const header = String.fromCharCode(
        view.getUint8(start),
        view.getUint8(start + 1),
        view.getUint8(start + 2),
        view.getUint8(start + 3),
      );
      if (header === "Exif") {
        return parseExifGps(view, start + 6);
      }
    }
    if (marker === 0xda) break;
    offset += 2 + size;
  }
  return null;
}

function parseExifGps(view: DataView, tiffStart: number): { lat: number; lon: number } | null {
  if (tiffStart + 8 > view.byteLength) return null;
  const endian = String.fromCharCode(view.getUint8(tiffStart), view.getUint8(tiffStart + 1));
  const le = endian === "II";
  if (!le && endian !== "MM") return null;

  const ifd0 = tiffStart + readU32(view, tiffStart + 4, le);
  const gpsPtr = findTagOffset(view, ifd0, tiffStart, le, 0x8825);
  if (gpsPtr == null) return null;
  const gpsIfd = tiffStart + gpsPtr;

  const latRef = findTagAscii(view, gpsIfd, tiffStart, le, 0x0001);
  const lonRef = findTagAscii(view, gpsIfd, tiffStart, le, 0x0003);
  const lat = findTagDms(view, gpsIfd, tiffStart, le, 0x0002);
  const lon = findTagDms(view, gpsIfd, tiffStart, le, 0x0004);
  if (lat == null || lon == null) return null;

  const latDec = latRef === "S" ? -lat : lat;
  const lonDec = lonRef === "W" ? -lon : lon;
  if (!Number.isFinite(latDec) || !Number.isFinite(lonDec)) return null;
  return { lat: latDec, lon: lonDec };
}

function findTagOffset(
  view: DataView,
  ifd: number,
  tiffStart: number,
  le: boolean,
  tag: number,
): number | null {
  if (ifd + 2 > view.byteLength) return null;
  const count = readU16(view, ifd, le);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > view.byteLength) return null;
    if (readU16(view, entry, le) === tag) {
      return readU32(view, entry + 8, le);
    }
  }
  return null;
}

function findTagAscii(
  view: DataView,
  ifd: number,
  tiffStart: number,
  le: boolean,
  tag: number,
): string | null {
  if (ifd + 2 > view.byteLength) return null;
  const count = readU16(view, ifd, le);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > view.byteLength) return null;
    if (readU16(view, entry, le) === tag) {
      const type = readU16(view, entry + 2, le);
      const n = readU32(view, entry + 4, le);
      if (type === 2 && n <= 4) {
        return String.fromCharCode(view.getUint8(entry + 8));
      }
      const off = tiffStart + readU32(view, entry + 8, le);
      if (off < view.byteLength) return String.fromCharCode(view.getUint8(off));
    }
  }
  return null;
}

function findTagDms(
  view: DataView,
  ifd: number,
  tiffStart: number,
  le: boolean,
  tag: number,
): number | null {
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

export function matchGps(
  lat: number,
  lon: number,
  locationIds?: string[],
  toleranceM = GPS_TOLERANCE_M,
): GpsMatch {
  const pool = locationIds
    ? LOCATIONS.filter((l) => locationIds.includes(l.id))
    : LOCATIONS;

  let best = pool[0];
  let bestD = Infinity;
  for (const loc of pool) {
    const d = haversineMeters(lat, lon, loc.lat, loc.lng);
    if (d < bestD) {
      bestD = d;
      best = loc;
    }
  }

  if (!best) {
    return {
      hasGps: true,
      lat,
      lon,
      matchStatus: "Unmatched",
      matchedLocationId: null,
      matchedLocation: null,
      distanceM: null,
      warning: "Không có điểm để đối chiếu",
    };
  }

  const matched = bestD <= toleranceM;
  return {
    hasGps: true,
    lat,
    lon,
    matchStatus: matched ? "Matched" : "Unmatched",
    matchedLocationId: best.id,
    matchedLocation: best.name,
    distanceM: Math.round(bestD),
    warning: matched
      ? null
      : `Ảnh cách điểm gần nhất (${best.name}) ${Math.round(bestD)} m, vượt quá ${toleranceM} m`,
  };
}

export async function processEvidenceFile(
  file: File,
  routeLocationIds: string[],
): Promise<{ preview: string; gps: GpsMatch }> {
  const preview = await compressImage(file);
  const buf = await file.arrayBuffer();
  const coords = readGpsFromJpeg(buf);
  if (!coords) {
    return {
      preview,
      gps: {
        hasGps: false,
        lat: null,
        lon: null,
        matchStatus: "No_GPS",
        matchedLocationId: null,
        matchedLocation: null,
        distanceM: null,
        warning: "Ảnh không chứa dữ liệu GPS. Bật Vị trí trên điện thoại khi chụp.",
      },
    };
  }
  return {
    preview,
    gps: matchGps(coords.lat, coords.lon, routeLocationIds),
  };
}

function compressImage(file: File, max = 720, quality = 0.72): Promise<string> {
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
        reject(new Error("Canvas không khả dụng"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Không đọc được ảnh"));
    };
    img.src = url;
  });
}
