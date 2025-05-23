import { mysqlTable, bigint, varchar, timestamp, unique } from 'drizzle-orm/mysql-core';
export const workspaces = mysqlTable('workspaces', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	defaultDialect: varchar('default_dialect', { length: 32 }).default('mysql'),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	unique_name: unique('uq_workspace_name').on(table.name),
}));
