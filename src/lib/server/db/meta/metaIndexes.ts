import { mysqlTable, bigint, varchar, json, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { metaTables } from './metaTables';

export const metaIndexes = mysqlTable('meta_indexes', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    tableId: bigint('table_id', { unsigned: true, mode: 'number' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    columns: varchar('columns', { length: 255 }).notNull(),
    isUnique: bigint('is_unique', { unsigned: true, mode: 'number' }).default(0),
    type: varchar('type', { length: 32 }),
    metadata: json('metadata'),
}, (table) => ({
    idx_table_id: index('idx_midx_tid').on(table.tableId),
    fk_table: foreignKey({ name: 'fk_midx_tid', columns: [table.tableId], foreignColumns: [metaTables.id] }),
    unique_name: unique('uq_midx_name').on(table.name, table.tableId),
    unique_name_type: unique('uq_midx_name_type').on(table.name, table.type, table.tableId),
}));
