import { mysqlTable, bigint, varchar, timestamp, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { users } from './users';
export const userSessions = mysqlTable('user_sessions', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	sessionToken: varchar('session_token', { length: 255 }).notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_user_id: index('idx_us_uid').on(table.userId),
	fk_user: foreignKey({ name: 'fk_us_uid', columns: [table.userId], foreignColumns: [users.id] }),
	unique_token: unique('uq_user_session_token').on(table.sessionToken),
}));
