import { mysqlTable, bigint, varchar, timestamp, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { workspaces } from './workspaces';
export const projects = mysqlTable('projects', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	workspaceId: bigint('workspace_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	defaultDialect: varchar('default_dialect', { length: 32 }).default('mysql'),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_ws_id: index('idx_proj_wsid').on(table.workspaceId),
	fk_ws: foreignKey({ name: 'fk_proj_wsid', columns: [table.workspaceId], foreignColumns: [workspaces.id] }),
	unique_name: unique('uq_project_name').on(table.workspaceId, table.name),
}));
