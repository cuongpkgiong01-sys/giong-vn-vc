import { n as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { n as DEFAULT_EMPLOYEES, u as generateReceiptNumber } from "./calculator-DEVecDDO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-state-Cgb30OZ5.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _001_app_data_default = "CREATE TABLE IF NOT EXISTS app_employees (\n  name TEXT PRIMARY KEY,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\nCREATE TABLE IF NOT EXISTS app_receipts (\n  id TEXT PRIMARY KEY,\n  receipt_number TEXT NOT NULL UNIQUE,\n  receipt_date DATE NOT NULL,\n  employee_name TEXT NOT NULL,\n  data JSONB NOT NULL,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\nCREATE INDEX IF NOT EXISTS app_receipts_date_idx ON app_receipts (receipt_date DESC, created_at DESC);\nCREATE INDEX IF NOT EXISTS app_receipts_employee_idx ON app_receipts (employee_name);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/001_app_data.sql": _001_app_data_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
async function ensureDefaultEmployees() {
	const sql = await getSql();
	if (((await sql`select count(*)::int as count from app_employees`)[0]?.count ?? 0) > 0) return;
	for (const name of DEFAULT_EMPLOYEES) await sql.query("insert into app_employees (name) values ($1) on conflict (name) do nothing", [name]);
}
var loadAppState_createServerFn_handler = createServerRpc({
	id: "25cb7e1db24518bf0676c5947a9bacc42b83a379144b32680a8e499fd843a5ce",
	name: "loadAppState",
	filename: "src/lib/app-state.ts"
}, (opts) => loadAppState.__executeServer(opts));
var loadAppState = createServerFn({ method: "GET" }).handler(loadAppState_createServerFn_handler, async () => {
	await ensureDefaultEmployees();
	const sql = await getSql();
	const [employees, receipts] = await Promise.all([sql`select name from app_employees order by name`, sql`select data from app_receipts order by receipt_date desc, created_at desc`]);
	return {
		employees: employees.map((row) => row.name),
		receipts: receipts.map((row) => row.data)
	};
});
var addEmployeeServer_createServerFn_handler = createServerRpc({
	id: "3d2035759e5b94ddd91df03c7318959b1459a5fdca754d4f5cc51ccf052b62cd",
	name: "addEmployeeServer",
	filename: "src/lib/app-state.ts"
}, (opts) => addEmployeeServer.__executeServer(opts));
var addEmployeeServer = createServerFn({ method: "POST" }).validator((name) => name).handler(addEmployeeServer_createServerFn_handler, async ({ data }) => {
	const name = String(data ?? "").trim();
	if (!name) throw new Error("Tên người vận chuyển không được để trống");
	await (await getSql()).query("insert into app_employees (name) values ($1) on conflict (name) do nothing", [name]);
	return name;
});
var saveReceiptServer_createServerFn_handler = createServerRpc({
	id: "8b6b7e984a9ce8743fcc29f3e06ce9abcfab349d27cdc659f0d3b963fe5df32b",
	name: "saveReceiptServer",
	filename: "src/lib/app-state.ts"
}, (opts) => saveReceiptServer.__executeServer(opts));
var saveReceiptServer = createServerFn({ method: "POST" }).validator((receipt) => receipt).handler(saveReceiptServer_createServerFn_handler, async ({ data }) => {
	const incoming = data;
	if (!incoming?.id || !incoming.date || !incoming.employeeName) throw new Error("Dữ liệu phiếu không hợp lệ");
	const sql = await getSql();
	await sql.query("insert into app_employees (name) values ($1) on conflict (name) do nothing", [incoming.employeeName]);
	for (let attempt = 0; attempt < 20; attempt += 1) {
		const rows = await sql.query("select count(*)::int as count from app_receipts where receipt_date = $1", [incoming.date]);
		const number = generateReceiptNumber(incoming.date, rows[0]?.count ?? 0);
		const receipt = {
			...incoming,
			number
		};
		try {
			await sql.query("insert into app_receipts (id, receipt_number, receipt_date, employee_name, data) values ($1, $2, $3, $4, $5::jsonb)", [
				receipt.id,
				receipt.number,
				receipt.date,
				receipt.employeeName,
				JSON.stringify(receipt)
			]);
			return receipt;
		} catch (error) {
			if (error?.code === "23505") continue;
			throw error;
		}
	}
	throw new Error("Không thể cấp số phiếu. Vui lòng lưu lại.");
});
var deleteReceiptServer_createServerFn_handler = createServerRpc({
	id: "a46cc47d0c477d8692436494705dbb919f02f42769fc0f4a12a6efaf4e8a302e",
	name: "deleteReceiptServer",
	filename: "src/lib/app-state.ts"
}, (opts) => deleteReceiptServer.__executeServer(opts));
var deleteReceiptServer = createServerFn({ method: "POST" }).validator((id) => id).handler(deleteReceiptServer_createServerFn_handler, async ({ data }) => {
	const id = String(data ?? "").trim();
	if (!id) throw new Error("Thiếu mã phiếu");
	await (await getSql()).query("delete from app_receipts where id = $1", [id]);
});
//#endregion
export { addEmployeeServer_createServerFn_handler, deleteReceiptServer_createServerFn_handler, loadAppState_createServerFn_handler, saveReceiptServer_createServerFn_handler };
