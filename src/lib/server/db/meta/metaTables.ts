import { mysqlTable, bigint, varchar, text, json, timestamp, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { metaDatabases } from './metaDatabases';

export const metaTables = mysqlTable('meta_tables', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    databaseId: bigint('database_id', { unsigned: true, mode: 'number' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    comment: text('comment'),
    metadata: json('metadata'),
    isDeployed: bigint('is_deployed', { unsigned: true, mode: 'number' }).default(0),
    deployedAt: timestamp('deployed_at'),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    idx_dbid: index('idx_mtab_dbid').on(table.databaseId),
    fk_db: foreignKey({ name: 'fk_mtab_dbid', columns: [table.databaseId], foreignColumns: [metaDatabases.id] }),
    unique_name: unique('uq_mtab_name').on(table.name, table.databaseId),
}));
