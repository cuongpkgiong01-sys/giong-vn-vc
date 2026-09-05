import { getSql } from './db';
import type { Receipt } from './store';

export async function loadAppStateAPI() {
  const sql = await getSql();
  const [employees, receipts] = await Promise.all([
    sql<{ name: string }>`select name from app_employees order by name`,
    sql<{ data: Receipt }>`select data from app_receipts order by receipt_date desc, created_at desc`,
  ]);
  return {
    employees: employees.map((row) => row.name),
    receipts: receipts.map((row) => row.data),
  };
}
