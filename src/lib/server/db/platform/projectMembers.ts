import { mysqlTable, bigint, varchar, timestamp, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { projects } from './projects';
import { users } from './users';
export const projectMembers = mysqlTable('project_members', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	projectId: bigint('project_id', { mode: 'number', unsigned: true }).notNull(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	role: varchar('role', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_proj_id: index('idx_pm_pid').on(table.projectId),
	idx_user_id: index('idx_pm_uid').on(table.userId),
	fk_proj: foreignKey({ name: 'fk_pm_pid', columns: [table.projectId], foreignColumns: [projects.id] }),
	fk_user: foreignKey({ name: 'fk_pm_uid', columns: [table.userId], foreignColumns: [users.id] }),
	unique_member: unique('uq_project_member').on(table.projectId, table.userId),
}));
