// src/lib/db/adapters/MySQLAdapter.ts

import mysql from 'mysql2/promise';
import type { Connection } from 'mysql2/promise';

import type {
    DBAdapter,
    DBConfig,
    QueryResult,
    TableColumn,
    TableInfo,
    DBSchema,
    MySQLQueryResponse,
    MySQLQueryResult,
} from './types';

export class MySQLAdapter implements DBAdapter {
    private config: DBConfig;
    private connection: Connection | null = null;

    constructor(config: DBConfig) {
        this.config = config;
    }

    async connect(): Promise<void> {
        this.connection = await mysql.createConnection({
            host: this.config.host,
            port: this.config.port,
            user: this.config.user,
            password: this.config.password,
            database: this.config.database,
            ssl: this.config.ssl === 'true' ? {} : undefined,
        });
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
        }
    }

    async runQuery(sql: string): Promise<QueryResult> {
        const start = Date.now();
        const [rows, fields]: MySQLQueryResponse = await this.connection!.query(sql);
        const executionTimeMs = Date.now() - start;
        return {
            rows,
            fields: fields.map(f => f.name),
            rowCount: rows.length,
            executionTimeMs,
        };
    }

    async getTables(): Promise<TableInfo[]> {
        const [rows]: MySQLQueryResponse = await this.connection!.query(
            `SELECT table_name AS name, table_type AS type FROM information_schema.tables WHERE table_schema = ?`,
            [this.config.database]
        );
        return rows as TableInfo[];
    }

    async getTableColumns(table: string): Promise<TableColumn[]> {
        const [rows]: MySQLQueryResponse = await this.connection!.query(
            `SELECT c.column_name, c.data_type, c.is_nullable, c.column_default as \`default\`,
              k.constraint_name, k.referenced_table_name, k.referenced_column_name
       FROM information_schema.columns c
       LEFT JOIN information_schema.key_column_usage k
         ON c.table_schema = k.table_schema AND c.table_name = k.table_name AND c.column_name = k.column_name
       WHERE c.table_schema = ? AND c.table_name = ?`,
            [this.config.database, table]
        );

        return rows.map(col => ({
            column_name: col.column_name,
            data_type: col.data_type,
            is_nullable: col.is_nullable,
            default: col.default,
            is_primary_key: col.constraint_name === 'PRIMARY',
            is_unique: col.constraint_name?.includes('UNIQUE') || false,
            is_foreign_key: !!col.referenced_table_name,
            referenced_table: col.referenced_table_name,
            referenced_column: col.referenced_column_name,
        }));
    }

    async getSchema(): Promise<DBSchema> {
        const tables = await this.getTables();
        const schema: DBSchema = { tables: {}, relationships: [] };

        for (const t of tables) {
            const columns = await this.getTableColumns(t.name);
            schema.tables[t.name] = columns;

            for (const col of columns) {
                if (col.is_foreign_key && col.referenced_table && col.referenced_column) {
                    schema.relationships!.push({
                        from_table: t.name,
                        from_column: col.column_name,
                        to_table: col.referenced_table,
                        to_column: col.referenced_column,
                    });
                }
            }
        }

        return schema;
    }

    async createTable(table: string, columns: TableColumn[]): Promise<void> {
        const defs = columns.map(col => {
            let def = `\`${col.column_name}\` ${col.data_type}`;
            if (col.is_primary_key) def += ' PRIMARY KEY';
            if (col.is_nullable === 'NO') def += ' NOT NULL';
            if (col.default !== undefined && col.default !== null) def += ` DEFAULT '${col.default}'`;
            return def;
        });
        const sql = `CREATE TABLE \`${table}\` (${defs.join(', ')});`;
        await this.runQuery(sql);
    }

    async dropTable(table: string): Promise<void> {
        await this.runQuery(`DROP TABLE IF EXISTS \`${table}\`;`);
    }

    async renameTable(oldName: string, newName: string): Promise<void> {
        await this.runQuery(`RENAME TABLE \`${oldName}\` TO \`${newName}\`;`);
    }

    async addColumn(table: string, column: TableColumn): Promise<void> {
        let sql = `ALTER TABLE \`${table}\` ADD COLUMN \`${column.column_name}\` ${column.data_type}`;
        if (column.is_nullable === 'NO') sql += ' NOT NULL';
        if (column.default !== undefined && column.default !== null) sql += ` DEFAULT '${column.default}'`;
        await this.runQuery(sql);
    }

    async dropColumn(table: string, column: string): Promise<void> {
        await this.runQuery(`ALTER TABLE \`${table}\` DROP COLUMN \`${column}\`;`);
    }

    async updateColumn(table: string, column: TableColumn): Promise<void> {
        let sql = `ALTER TABLE \`${table}\` MODIFY COLUMN \`${column.column_name}\` ${column.data_type}`;
        if (column.is_nullable === 'NO') sql += ' NOT NULL';
        if (column.default !== undefined && column.default !== null) sql += ` DEFAULT '${column.default}'`;
        await this.runQuery(sql);
    }

    async getVersion(): Promise<string> {
        const [rows]: MySQLQueryResponse = await this.connection!.query('SELECT VERSION() as version');
        return (rows[0] as any).version;
    }

    async explainQuery(sql: string): Promise<any> {
        const [rows]: MySQLQueryResponse = await this.connection!.query(`EXPLAIN ${sql}`);
        return rows;
    }

    async exportTableCSV(table: string): Promise<string> {
        const [rows]: MySQLQueryResponse = await this.connection!.query(`SELECT * FROM \`${table}\``);
        if (!rows.length) return '';
        const headers = Object.keys(rows[0]);
        const csv = [headers.join(',')];
        for (const row of rows) {
            csv.push(headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
        }
        return csv.join('\n');
    }

    async importTableCSV(table: string, csv: string): Promise<void> {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        const values = lines.slice(1).map(line => line.split(',').map(v => v.replace(/^"|"$/g, '')));

        for (const row of values) {
            const sql = `INSERT INTO \`${table}\` (${headers.map(h => `\`${h}\``).join(',')}) VALUES (${row.map(() => '?').join(',')});`;
            await this.connection!.execute(sql, row);
        }
    }

    async beginTransaction(): Promise<void> {
        await this.connection!.beginTransaction();
    }

    async commit(): Promise<void> {
        await this.connection!.commit();
    }

    async rollback(): Promise<void> {
        await this.connection!.rollback();
    }
}
