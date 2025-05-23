import { mysqlTable, bigint, varchar, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { users } from './users';
export const userRoles = mysqlTable('user_roles', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	role: varchar('role', { length: 255 }).notNull(),
}, (table) => ({
	idx_user_id: index('idx_ur_uid').on(table.userId),
	fk_user: foreignKey({ name: 'fk_ur_uid', columns: [table.userId], foreignColumns: [users.id] }),
	unique_user_role: unique('uq_user_role').on(table.userId, table.role),
}));
