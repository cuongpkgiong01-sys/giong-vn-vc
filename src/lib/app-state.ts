import { createServerFn } from "@tanstack/react-start";
import { DEFAULT_EMPLOYEES } from "./data/catalog";
import { generateReceiptNumber } from "./data/calculator";
import { getSql } from "./db";
import { APP_VERSION, highestVersion, nextVersion } from "./version";
import type { Receipt } from "./store";

type AppStatePayload = { employees: string[]; receipts: Receipt[] };

export function consolidateEmployeeNames(defaultNames: string[], existingNames: string[]): string[] {
  const merged = new Set(
    [...defaultNames, ...existingNames]
      .map((name) => name.trim())
      .filter((name): name is string => Boolean(name)),
  );

  return [...merged].sort((a, b) => a.localeCompare(b, "vi"));
}

async function ensureDefaultEmployees() {
  const sql = await getSql();
  const defaultEmployees = DEFAULT_EMPLOYEES.map((name) => name.trim()).filter(Boolean);
  const existing = await sql<{ name: string }>`select name from app_employees`;
  const employees = consolidateEmployeeNames(defaultEmployees, existing.map((row) => row.name));

  for (const name of employees) {
    await sql.query(
      "insert into app_employees (name) values ($1) on conflict (name) do nothing",
      [name],
    );
  }
}

export const loadAppState = createServerFn({ method: "GET" }).handler(
  async (): Promise<AppStatePayload> => {
    await ensureDefaultEmployees();
    const sql = await getSql();
    const [employees, receipts] = await Promise.all([
      sql<{ name: string }>`select name from app_employees order by name`,
      sql<{ data: Receipt }>`select data from app_receipts order by receipt_date desc, created_at desc`,
    ]);
    return {
      employees: consolidateEmployeeNames(DEFAULT_EMPLOYEES, employees.map((row) => row.name)),
      receipts: receipts.map((row) => row.data),
    };
  },
);

export const addEmployeeServer = createServerFn({ method: "POST" })
  .validator((name: string) => name)
  .handler(async ({ data }): Promise<string> => {
    const name = String(data ?? "").trim();
    if (!name) throw new Error("Tên người vận chuyển không được để trống");
    const sql = await getSql();
    await sql.query(
      "insert into app_employees (name) values ($1) on conflict (name) do nothing",
      [name],
    );
    return name;
  });

export const saveReceiptServer = createServerFn({ method: "POST" })
  .validator((receipt: Receipt) => receipt)
  .handler(async ({ data }): Promise<Receipt> => {
    const incoming = data;
    if (!incoming?.id || !incoming.date || !incoming.employeeName) {
      throw new Error("Dữ liệu phiếu không hợp lệ");
    }

    const sql = await getSql();
    await sql.query(
      "insert into app_employees (name) values ($1) on conflict (name) do nothing",
      [incoming.employeeName],
    );

    const latestVersionRow = await sql.query<{ version: string | null }>(
      "select data->>'version' as version from app_receipts order by created_at desc limit 1",
    );
    const latestVersion = highestVersion(
      [
        incoming.version ?? APP_VERSION,
        ...(latestVersionRow.map((row) => row.version).filter((version): version is string => Boolean(version))),
      ],
    );
    const version = nextVersion(latestVersion);

    // Numbering is assigned on the server so every LAN client receives the same
    // sequence. Retry on the unique constraint in the unlikely event of two
    // clients saving at exactly the same time.
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const rows = await sql.query<{ count: number }>(
        "select count(*)::int as count from app_receipts where receipt_date = $1",
        [incoming.date],
      );
      const number = generateReceiptNumber(incoming.date, rows[0]?.count ?? 0);
      const receipt: Receipt = { ...incoming, version, number };
      try {
        await sql.query(
          "insert into app_receipts (id, receipt_number, receipt_date, employee_name, data) values ($1, $2, $3, $4, $5::jsonb)",
          [
            receipt.id,
            receipt.number,
            receipt.date,
            receipt.employeeName,
            JSON.stringify(receipt),
          ],
        );
        return receipt;
      } catch (error) {
        const code = (error as { code?: string } | null)?.code;
        if (code === "23505") continue;
        throw error;
      }
    }

    throw new Error("Không thể cấp số phiếu. Vui lòng lưu lại.");
  });

export const updateReceiptServer = createServerFn({ method: "POST" })
  .validator((receipt: Receipt) => receipt)
  .handler(async ({ data }): Promise<Receipt> => {
    const incoming = data;
    if (!incoming?.id || !incoming.date || !incoming.employeeName) {
      throw new Error("Dữ liệu phiếu không hợp lệ");
    }

    const sql = await getSql();
    await sql.query(
      "insert into app_employees (name) values ($1) on conflict (name) do nothing",
      [incoming.employeeName],
    );

    const latestVersionRow = await sql.query<{ version: string | null }>(
      "select data->>'version' as version from app_receipts where id <> $1 order by created_at desc limit 1",
      [incoming.id],
    );
    const latestVersion = highestVersion(
      [
        incoming.version ?? APP_VERSION,
        ...(latestVersionRow.map((row) => row.version).filter((version): version is string => Boolean(version))),
      ],
    );

    const updated: Receipt = {
      ...incoming,
      version: nextVersion(latestVersion),
    };

    await sql.query(
      "update app_receipts set receipt_date = $1, employee_name = $2, data = $3::jsonb where id = $4",
      [updated.date, updated.employeeName, JSON.stringify(updated), updated.id],
    );

    return updated;
  });

export const deleteReceiptServer = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }): Promise<void> => {
    const id = String(data ?? "").trim();
    if (!id) throw new Error("Thiếu mã phiếu");
    const sql = await getSql();
    await sql.query("delete from app_receipts where id = $1", [id]);
  });
