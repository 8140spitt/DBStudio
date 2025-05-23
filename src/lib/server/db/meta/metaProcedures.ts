import { mysqlTable, bigint, varchar, text, json, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { metaDatabases } from './metaDatabases';

export const metaProcedures = mysqlTable('meta_procedures', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    databaseId: bigint('database_id', { unsigned: true, mode: 'number' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    parameters: varchar('parameters', { length: 255 }),
    body: text('body').notNull(),
    metadata: json('metadata'),
}, (table) => ({
    idx_dbid: index('idx_mproc_dbid').on(table.databaseId),
    fk_db: foreignKey({ name: 'fk_mproc_dbid', columns: [table.databaseId], foreignColumns: [metaDatabases.id] }),
    unique_name: unique('uq_mproc_name').on(table.name, table.databaseId),
}));
