// src/lib/db/adapters/SQLiteAdapter.ts

import Database from 'better-sqlite3';
import type {
    DBAdapter,
    DBConfig,
    QueryResult,
    TableColumn,
    TableInfo,
    DBSchema,
} from './types';

export class SQLiteAdapter implements DBAdapter {
    private config: DBConfig;
    private db: Database.Database;

    constructor(config: DBConfig) {
        if (!config.filepath) throw new Error('Missing filepath for SQLite');
        this.config = config;
        this.db = new Database(config.filepath);
    }

    async connect(): Promise<void> {
        // No-op for better-sqlite3 (sync connection)
    }

    async disconnect(): Promise<void> {
        this.db.close();
    }

    async runQuery(sql: string): Promise<QueryResult> {
        const start = Date.now();
        const stmt = this.db.prepare(sql);
        const rows = stmt.all() as Record<string, unknown>[];
        const executionTimeMs = Date.now() - start;
        return {
            rows,
            fields: rows.length ? Object.keys(rows[0]) : [],
            rowCount: rows.length,
            executionTimeMs,
        };
    }

    async getTables(): Promise<TableInfo[]> {
        const rows = this.db.prepare(`
      SELECT name, type FROM sqlite_master
      WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'
    `).all() as { name: string; type: string }[];

        return rows.map((row: { name: string; type: string }) => ({
            name: row.name,
            type: row.type === 'view' ? 'VIEW' : 'BASE TABLE',
        }));
    }

    async getTableColumns(table: string): Promise<TableColumn[]> {
        const rows = this.db.prepare(`PRAGMA table_info(${table})`).all();

        return rows.map((col: any) => ({
            column_name: col.name,
            data_type: col.type,
            is_nullable: col.notnull === 0 ? 'YES' : 'NO',
            default: col.dflt_value,
            is_primary_key: col.pk === 1,
        }));
    }

    async getSchema(): Promise<DBSchema> {
        const tables = await this.getTables();
        const schema: DBSchema = { tables: {}, relationships: [] };

        for (const t of tables) {
            const columns = await this.getTableColumns(t.name);
            schema.tables[t.name] = columns;
        }

        return schema;
    }

    async createTable(table: string, columns: TableColumn[]): Promise<void> {
        const defs = columns.map(col => {
            let def = `\"${col.column_name}\" ${col.data_type}`;
            if (col.is_primary_key) def += ' PRIMARY KEY';
            if (col.is_nullable === 'NO') def += ' NOT NULL';
            if (col.default !== undefined && col.default !== null) def += ` DEFAULT ${col.default}`;
            return def;
        });
        const sql = `CREATE TABLE \"${table}\" (${defs.join(', ')});`;
        this.db.prepare(sql).run();
    }

    async dropTable(table: string): Promise<void> {
        this.db.prepare(`DROP TABLE IF EXISTS \"${table}\";`).run();
    }

    async renameTable(oldName: string, newName: string): Promise<void> {
        this.db.prepare(`ALTER TABLE \"${oldName}\" RENAME TO \"${newName}\";`).run();
    }

    async addColumn(table: string, column: TableColumn): Promise<void> {
        let sql = `ALTER TABLE \"${table}\" ADD COLUMN \"${column.column_name}\" ${column.data_type}`;
        if (column.is_nullable === 'NO') sql += ' NOT NULL';
        if (column.default !== undefined && column.default !== null) sql += ` DEFAULT ${column.default}`;
        this.db.prepare(sql).run();
    }

    async dropColumn(): Promise<void> {
        throw new Error('SQLite does not support dropping columns directly');
    }

    async updateColumn(): Promise<void> {
        throw new Error('SQLite does not support altering column definitions directly');
    }

    async getVersion(): Promise<string> {
        const row = this.db.prepare('SELECT sqlite_version() as version').get() as { version: string };
        return row.version;
    }

    async explainQuery(sql: string): Promise<any> {
        return this.db.prepare(`EXPLAIN ${sql}`).all();
    }

    async exportTableCSV(table: string): Promise<string> {
        const rows = this.db.prepare(`SELECT * FROM \"${table}\"`).all();
        if (!rows.length) return '';
        const headers = Object.keys(rows[0] as object);
        const csv = [headers.join(',')];
        for (const row of rows) {
            csv.push(headers.map(h => JSON.stringify((row as Record<string, unknown>)[h] ?? '')).join(','));
        }
        return csv.join('\n');
    }

    async importTableCSV(table: string, csv: string): Promise<void> {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => line.split(',').map(v => v.replace(/^"|"$/g, '')));

        const insert = this.db.prepare(`INSERT INTO \"${table}\" (${headers.map(h => `\"${h}\"`).join(',')}) VALUES (${headers.map(() => '?').join(',')})`);
        const insertMany = this.db.transaction((rows: string[][]) => {
            for (const row of rows) {
                insert.run(row);
            }
        });

        insertMany(rows);
    }

    async beginTransaction(): Promise<void> {
        this.db.prepare('BEGIN').run();
    }

    async commit(): Promise<void> {
        this.db.prepare('COMMIT').run();
    }

    async rollback(): Promise<void> {
        this.db.prepare('ROLLBACK').run();
    }
}
