// src/lib/db/types.ts

export type SupportedDBType = 'mysql' | 'postgres' | 'sqlite';

export interface DBConfig {
    type: SupportedDBType;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    filepath?: string;
    name?: string;
    ssl?: string;
}

export interface TableColumn {
    column_name: string;
    data_type: string;
    is_nullable: string;
    default?: string | null;
    is_primary_key?: boolean;
    is_unique?: boolean;
    is_foreign_key?: boolean;
    referenced_table?: string;
    referenced_column?: string;
}

export interface TableInfo {
    name: string;
    type: 'BASE TABLE' | 'VIEW';
    comment?: string;
}

export interface TableRelationship {
    from_table: string;
    from_column: string;
    to_table: string;
    to_column: string;
}

export interface DBSchema {
    tables: Record<string, TableColumn[]>;
    relationships?: TableRelationship[];
}

export interface QueryResult {
    rows: any[];
    fields?: string[];
    rowCount?: number;
    executionTimeMs?: number;
}

export interface DBAdapter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;

    runQuery(sql: string): Promise<QueryResult>;

    getSchema(): Promise<DBSchema>;
    getTables(): Promise<TableInfo[]>;
    getTableColumns(table: string): Promise<TableColumn[]>;

    createTable(table: string, columns: TableColumn[]): Promise<void>;
    dropTable(table: string): Promise<void>;
    renameTable(oldName: string, newName: string): Promise<void>;

    addColumn(table: string, column: TableColumn): Promise<void>;
    dropColumn(table: string, column: string): Promise<void>;
    updateColumn(table: string, column: TableColumn): Promise<void>;

    getVersion(): Promise<string>;
    explainQuery(sql: string): Promise<any>;

    exportTableCSV(table: string): Promise<string>;
    importTableCSV(table: string, csv: string): Promise<void>;

    getUsers?(): Promise<string[]>;
    createUser?(username: string, password: string): Promise<void>;
    grantPrivileges?(username: string, db: string): Promise<void>;
    revokePrivileges?(username: string, db: string): Promise<void>;

    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}

// For MySQL result typing
export type MySQLQueryResponse = [any[], { name: string }[]];
export type MySQLQueryResult = {
    rows: any[];
    fields: { name: string }[];
    rowCount: number;
    executionTimeMs: number;
};