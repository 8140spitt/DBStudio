// src/lib/db/adapters/PostgresAdapter.ts

import { Client as PGClient } from 'pg';
import type {
    DBAdapter,
    DBConfig,
    QueryResult,
    TableColumn,
    TableInfo,
    DBSchema,
} from './types';

export class PostgresAdapter implements DBAdapter {
    private config: DBConfig;
    private client: InstanceType<typeof PGClient>;

    constructor(config: DBConfig) {
        this.config = config;
        this.client = new PGClient({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
            ssl: config.ssl === 'true',
        });
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    async disconnect(): Promise<void> {
        await this.client.end();
    }

    async runQuery(sql: string): Promise<QueryResult> {
        const start = Date.now();
        const result = await this.client.query(sql);
        const executionTimeMs = Date.now() - start;
        return {
            rows: result.rows,
            fields: result.fields.map((f: { name: string }) => f.name),
            rowCount: result.rowCount ?? undefined,
            executionTimeMs,
        };
    }

    async getTables(): Promise<TableInfo[]> {
        const res = await this.client.query(
            `SELECT table_name AS name, table_type AS type
       FROM information_schema.tables
       WHERE table_schema = 'public'`
        );
        return res.rows.map((r: { name: string; type: string }) => ({
            name: r.name,
            type: r.type as 'BASE TABLE' | 'VIEW',
        }));
    }

    async getTableColumns(table: string): Promise<TableColumn[]> {
        const res = await this.client.query(
            `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1`,
            [table]
        );

        const pkRes = await this.client.query(
            `SELECT a.attname as column_name
       FROM pg_index i
       JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
       WHERE i.indrelid = $1::regclass AND i.indisprimary`,
            [table]
        );

        const pkCols = new Set(pkRes.rows.map((r: { column_name: string }) => r.column_name));

        return res.rows.map((col: any) => ({
            column_name: col.column_name,
            data_type: col.data_type,
            is_nullable: col.is_nullable,
            default: col.column_default,
            is_primary_key: pkCols.has(col.column_name),
        }));
    }

    async getSchema(): Promise<DBSchema> {
        const tables = await this.getTables();
        const schema: DBSchema = { tables: {}, relationships: [] };

        for (const t of tables) {
            const columns = await this.getTableColumns(t.name);
            schema.tables[t.name] = columns;
            // Relationships can be added here in the future
        }

        return schema;
    }

    async createTable(table: string, columns: TableColumn[]): Promise<void> {
        const defs = columns.map(col => {
            let def = `\"${col.column_name}\" ${col.data_type}`;
            if (col.is_primary_key) def += ' PRIMARY KEY';
            if (col.is_nullable === 'NO') def += ' NOT NULL';
            if (col.default !== undefined && col.default !== null) def += ` DEFAULT '${col.default}'`;
            return def;
        });
        const sql = `CREATE TABLE \"${table}\" (${defs.join(', ')});`;
        await this.runQuery(sql);
    }

    async dropTable(table: string): Promise<void> {
        await this.runQuery(`DROP TABLE IF EXISTS \"${table}\";`);
    }

    async renameTable(oldName: string, newName: string): Promise<void> {
        await this.runQuery(`ALTER TABLE \"${oldName}\" RENAME TO \"${newName}\";`);
    }

    async addColumn(table: string, column: TableColumn): Promise<void> {
        let sql = `ALTER TABLE \"${table}\" ADD COLUMN \"${column.column_name}\" ${column.data_type}`;
        if (column.is_nullable === 'NO') sql += ' NOT NULL';
        if (column.default !== undefined && column.default !== null) sql += ` DEFAULT '${column.default}'`;
        await this.runQuery(sql);
    }

    async dropColumn(table: string, column: string): Promise<void> {
        await this.runQuery(`ALTER TABLE \"${table}\" DROP COLUMN \"${column}\";`);
    }

    async updateColumn(table: string, column: TableColumn): Promise<void> {
        let sql = `ALTER TABLE \"${table}\" ALTER COLUMN \"${column.column_name}\" TYPE ${column.data_type}`;
        if (column.default !== undefined) sql += `; ALTER TABLE \"${table}\" ALTER COLUMN \"${column.column_name}\" SET DEFAULT '${column.default}'`;
        await this.runQuery(sql);
    }

    async getVersion(): Promise<string> {
        const res = await this.client.query('SELECT version()');
        return res.rows[0].version;
    }

    async explainQuery(sql: string): Promise<any> {
        const res = await this.client.query(`EXPLAIN ${sql}`);
        return res.rows;
    }

    async exportTableCSV(table: string): Promise<string> {
        const res = await this.client.query(`SELECT * FROM \"${table}\"`);
        if (!res.rows.length) return '';
        const headers = Object.keys(res.rows[0]);
        const csv = [headers.join(',')];
        for (const row of res.rows) {
            csv.push(headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
        }
        return csv.join('\n');
    }

    async importTableCSV(table: string, csv: string): Promise<void> {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => line.split(',').map(v => v.replace(/^"|"$/g, '')));

        for (const row of rows) {
            const sql = `INSERT INTO \"${table}\" (${headers.map(h => `\"${h}\"`).join(',')}) VALUES (${row.map((_, i) => `$${i + 1}`).join(',')})`;
            await this.client.query(sql, row);
        }
    }

    async beginTransaction(): Promise<void> {
        await this.client.query('BEGIN');
    }

    async commit(): Promise<void> {
        await this.client.query('COMMIT');
    }

    async rollback(): Promise<void> {
        await this.client.query('ROLLBACK');
    }
}
