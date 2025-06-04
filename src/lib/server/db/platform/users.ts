
import { mysqlTable, bigint, varchar, timestamp, index, unique, } from 'drizzle-orm/mysql-core';
export const users = mysqlTable('users', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),
	hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
	status: varchar('status', { length: 255 }).default('active'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_username: index('idx_users_username').on(table.username),
	unique_username: unique('uq_users_username').on(table.username),
}));