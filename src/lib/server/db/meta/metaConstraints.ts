import { mysqlTable, bigint, varchar, json, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { metaTables } from './metaTables';

export const metaConstraints = mysqlTable('meta_constraints', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    tableId: bigint('table_id', { unsigned: true, mode: 'number' }).notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }),
    columns: varchar('columns', { length: 255 }),
    referenceTable: varchar('reference_table', { length: 255 }),
    referenceColumns: varchar('reference_columns', { length: 255 }),
    onDelete: varchar('on_delete', { length: 32 }),
    onUpdate: varchar('on_update', { length: 32 }),
    expression: varchar('expression', { length: 255 }),
    metadata: json('metadata'),
}, (table) => ({
    idx_table_id: index('idx_mconst_tid').on(table.tableId),
    fk_table: foreignKey({ name: 'fk_mconst_tid', columns: [table.tableId], foreignColumns: [metaTables.id] }),
    unique_name: unique('uq_mconst_name').on(table.name, table.tableId),
    unique_name_type: unique('uq_mconst_name_type').on(table.name, table.type, table.tableId),
}));
