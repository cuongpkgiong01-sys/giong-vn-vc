CREATE TABLE IF NOT EXISTS app_employees (
  name TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_receipts (
  id TEXT PRIMARY KEY,
  receipt_number TEXT NOT NULL UNIQUE,
  receipt_date DATE NOT NULL,
  employee_name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS app_receipts_date_idx ON app_receipts (receipt_date DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS app_receipts_employee_idx ON app_receipts (employee_name);
