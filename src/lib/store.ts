import { create } from "zustand";
import { DEFAULT_EMPLOYEES, type VehicleId } from "./data/catalog";
import { generateReceiptNumber, type CalcResult, type TripLeg } from "./data/calculator";
import { APP_VERSION, highestVersion, nextVersion } from "./version";
import {
  addEmployeeServer,
  deleteReceiptServer,
  loadAppState,
  saveReceiptServer,
  updateReceiptServer,
} from "./app-state";

export interface EvidenceItem {
  id: string;
  name: string;
  preview: string;
  hasGps: boolean;
  lat: number | null;
  lon: number | null;
  matchStatus: "Matched" | "Unmatched" | "No_GPS";
  matchedLocation: string | null;
  distanceM: number | null;
  warning: string | null;
}

export interface Receipt {
  id: string;
  number: string;
  version: string;
  date: string;
  employeeName: string;
  vehicleId: VehicleId;
  path: string[];
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
  evidence: EvidenceItem[];
  notes: string;
  createdAt: string;
  status: "confirmed";
}

interface AppState {
  hydrated: boolean;
  employees: string[];
  receipts: Receipt[];
  currentVersion: string;
  hydrate: () => Promise<void>;
  addEmployee: (name: string) => Promise<void>;
  removeEmployee: (name: string) => void;
  saveReceipt: (input: {
    date: string;
    employeeName: string;
    calc: CalcResult;
    path: string[];
    evidence: EvidenceItem[];
    notes: string;
  }) => Promise<Receipt>;
  updateReceipt: (input: {
    id: string;
    date: string;
    employeeName: string;
    calc: CalcResult;
    path: string[];
    evidence: EvidenceItem[];
    notes: string;
  }) => Promise<Receipt>;
  deleteReceipt: (id: string) => Promise<void>;
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useAppStore = create<AppState>()((set, get) => ({
  hydrated: false,
  employees: DEFAULT_EMPLOYEES,
  receipts: [],
  currentVersion: APP_VERSION,

  hydrate: async () => {
    const data = await loadAppState();
    const versions = data.receipts.map((receipt) => receipt.version ?? APP_VERSION);
    set({
      employees: data.employees.length ? data.employees : DEFAULT_EMPLOYEES,
      receipts: data.receipts,
      currentVersion: highestVersion([...versions, APP_VERSION]),
      hydrated: true,
    });
  },

  addEmployee: async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await addEmployeeServer({ data: trimmed });
    set((state) => ({
      employees: state.employees.includes(trimmed)
        ? state.employees
        : [...state.employees, trimmed].sort((a, b) => a.localeCompare(b, "vi")),
    }));
  },

  removeEmployee: (name) => {
    set({ employees: get().employees.filter((employee) => employee !== name) });
  },

  saveReceipt: async (input) => {
    const localCount = get().receipts.filter((receipt) => receipt.date === input.date).length;
    const nextAppVersion = nextVersion(get().currentVersion);
    const provisional: Receipt = {
      id: uid(),
      number: generateReceiptNumber(input.date, localCount),
      version: nextAppVersion,
      date: input.date,
      employeeName: input.employeeName,
      vehicleId: input.calc.vehicleId,
      path: input.path,
      legs: input.calc.legs,
      totalKm: input.calc.totalKm,
      baseFee: input.calc.baseFee,
      perKmFee: input.calc.perKmFee,
      kmAmount: input.calc.kmAmount,
      nightSurcharge: input.calc.nightSurcharge,
      holidaySurcharge: input.calc.holidaySurcharge,
      surchargeRate: input.calc.surchargeRate,
      surchargeAmount: input.calc.surchargeAmount,
      subtotal: input.calc.subtotal,
      totalAmount: input.calc.totalAmount,
      noAllowanceOnly: input.calc.noAllowanceOnly,
      hasEstimate: input.calc.hasEstimate,
      evidence: input.evidence,
      notes: input.notes,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };

    const receipt = await saveReceiptServer({ data: provisional });
    set((state) => ({
      receipts: [receipt, ...state.receipts.filter((item) => item.id !== receipt.id)],
      currentVersion: receipt.version,
    }));
    return receipt;
  },

  updateReceipt: async (input) => {
    const existing = get().receipts.find((receipt) => receipt.id === input.id);
    if (!existing) throw new Error("Không tìm thấy phiếu để cập nhật");

    const updated: Receipt = {
      ...existing,
      version: nextVersion(existing.version ?? get().currentVersion),
      date: input.date,
      employeeName: input.employeeName,
      vehicleId: input.calc.vehicleId,
      path: input.path,
      legs: input.calc.legs,
      totalKm: input.calc.totalKm,
      baseFee: input.calc.baseFee,
      perKmFee: input.calc.perKmFee,
      kmAmount: input.calc.kmAmount,
      nightSurcharge: input.calc.nightSurcharge,
      holidaySurcharge: input.calc.holidaySurcharge,
      surchargeRate: input.calc.surchargeRate,
      surchargeAmount: input.calc.surchargeAmount,
      subtotal: input.calc.subtotal,
      totalAmount: input.calc.totalAmount,
      noAllowanceOnly: input.calc.noAllowanceOnly,
      hasEstimate: input.calc.hasEstimate,
      evidence: input.evidence,
      notes: input.notes,
    };

    const receipt = await updateReceiptServer({ data: updated });
    set((state) => ({
      receipts: state.receipts.map((item) => (item.id === receipt.id ? receipt : item)),
      currentVersion: receipt.version,
    }));
    return receipt;
  },

  deleteReceipt: async (id) => {
    await deleteReceiptServer({ data: id });
    set((state) => ({ receipts: state.receipts.filter((receipt) => receipt.id !== id) }));
  },
}));