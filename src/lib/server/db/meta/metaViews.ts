import { mysqlTable, bigint, varchar, text, json, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { metaDatabases } from './metaDatabases';

export const metaViews = mysqlTable('meta_views', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    databaseId: bigint('database_id', { unsigned: true, mode: 'number' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    definition: text('definition').notNull(),
    metadata: json('metadata'),
}, (table) => ({
    idx_dbid: index('idx_mview_dbid').on(table.databaseId),
    fk_db: foreignKey({ name: 'fk_mview_dbid', columns: [table.databaseId], foreignColumns: [metaDatabases.id] }),
    unique_name: unique('uq_mview_name').on(table.name, table.databaseId),
}));
