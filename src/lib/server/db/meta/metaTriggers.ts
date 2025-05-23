import { mysqlTable, bigint, varchar, text, json, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { metaDatabases } from './metaDatabases';

export const metaTriggers = mysqlTable('meta_triggers', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    databaseId: bigint('database_id', { unsigned: true, mode: 'number' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    event: varchar('event', { length: 64 }).notNull(),
    timing: varchar('timing', { length: 32 }).notNull(),
    tableName: varchar('table_name', { length: 255 }).notNull(),
    body: text('body').notNull(),
    metadata: json('metadata'),
}, (table) => ({
    idx_dbid: index('idx_mtrg_dbid').on(table.databaseId),
    fk_db: foreignKey({ name: 'fk_mtrg_dbid', columns: [table.databaseId], foreignColumns: [metaDatabases.id] }),
    unique_name: unique('uq_mtrg_name').on(table.name, table.databaseId),
    unique_name_event: unique('uq_mtrg_name_event').on(table.name, table.event, table.databaseId),
}));
