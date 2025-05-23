import { mysqlTable, bigint, varchar, text, json, timestamp, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { metaTables } from './metaTables';

export const metaColumns = mysqlTable('meta_columns', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    tableId: bigint('table_id', { unsigned: true, mode: 'number' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 100 }).notNull(),
    length: bigint('length', { unsigned: true, mode: 'number' }),
    isNullable: bigint('is_nullable', { unsigned: true, mode: 'number' }).default(1),
    isPrimaryKey: bigint('is_primary_key', { unsigned: true, mode: 'number' }).default(0),
    isUnique: bigint('is_unique', { unsigned: true, mode: 'number' }).default(0),
    defaultValue: varchar('default_value', { length: 255 }),
    metadata: json('metadata'),
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    idx_table_id: index('idx_mcol_tid').on(table.tableId),
    fk_table: foreignKey({ name: 'fk_mcol_tid', columns: [table.tableId], foreignColumns: [metaTables.id] }),
    unique_name: unique('uq_mcol_name').on(table.name, table.tableId),
}));
