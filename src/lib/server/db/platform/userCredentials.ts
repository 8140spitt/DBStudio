import { mysqlTable, bigint, varchar, timestamp, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { users } from './users';
export const userCredentials = mysqlTable('user_credentials', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	credentialType: varchar('credential_type', { length: 255 }).notNull(),
	credentialValue: varchar('credential_value', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_user_id: index('idx_uc_uid').on(table.userId),
	fk_user: foreignKey({ name: 'fk_uc_uid', columns: [table.userId], foreignColumns: [users.id] }),
	unique_user_type: unique('uq_uc_user_type').on(table.userId, table.credentialType),
}));
