import { mysqlTable, bigint, varchar, json, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { projects } from '../platform/projects';

export const metaPages = mysqlTable('meta_pages', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    projectId: bigint('project_id', { unsigned: true, mode: 'number' }).notNull(),
    name: varchar('name', { length: 255 }),
    layout: json('layout'),
    metadata: json('metadata'),
}, (table) => ({
    idx_proj_id: index('idx_mpage_pid').on(table.projectId),
    fk_proj: foreignKey({ name: 'fk_mpage_pid', columns: [table.projectId], foreignColumns: [projects.id] }),
    unique_name: unique('uq_mpage_name').on(table.name, table.projectId),
}));
