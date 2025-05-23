import { mysqlTable, bigint, varchar, timestamp, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { workspaces } from './workspaces';
import { users } from './users';
export const workspaceMembers = mysqlTable('workspace_members', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	workspaceId: bigint('workspace_id', { mode: 'number', unsigned: true }).notNull(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	role: varchar('role', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_ws_id: index('idx_ws_mem_wsid').on(table.workspaceId),
	idx_user_id: index('idx_ws_mem_uid').on(table.userId),
	fk_ws: foreignKey({ name: 'fk_ws_mem_wsid', columns: [table.workspaceId], foreignColumns: [workspaces.id] }),
	fk_user: foreignKey({ name: 'fk_ws_mem_uid', columns: [table.userId], foreignColumns: [users.id] }),
	unique_member: unique('uq_workspace_member').on(table.workspaceId, table.userId),
}));
