// src/lib/db/adapters/factory.ts

import type { DBAdapter, DBConfig } from './types';
import { MySQLAdapter } from './MySQLAdapter';
import { PostgresAdapter } from './PostgresAdapter';
import { SQLiteAdapter } from './SQLiteAdapter';

export function createDBAdapter(config: DBConfig): DBAdapter {
    switch (config.type) {
        case 'mysql':
            return new MySQLAdapter(config);
        case 'postgres':
            return new PostgresAdapter(config);
        case 'sqlite':
            return new SQLiteAdapter(config);
        default:
            throw new Error(`Unsupported database type: ${config.type}`);
    }
}
