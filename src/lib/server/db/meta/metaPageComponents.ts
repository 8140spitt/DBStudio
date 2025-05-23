import { mysqlTable, bigint, varchar, json, index, foreignKey } from 'drizzle-orm/mysql-core';
import { metaPages } from './metaPages';

export const metaPageComponents = mysqlTable('meta_page_components', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    pageId: bigint('page_id', { unsigned: true, mode: 'number' }).notNull(),
    type: varchar('type', { length: 50 }),
    config: json('config'),
    order: bigint('order', { unsigned: true, mode: 'number' }),
}, (table) => ({
    idx_page_id: index('idx_mpagecomp_pid').on(table.pageId),
    fk_page: foreignKey({ name: 'fk_mpagecomp_pid', columns: [table.pageId], foreignColumns: [metaPages.id] }),
    // Optionally: unique('uq_page_component_order').on(table.pageId, table.order),
}));
