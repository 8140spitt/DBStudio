import { mysqlTable, bigint, varchar, text, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { users } from './users';
export const userProfiles = mysqlTable('user_profiles', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	avatar: varchar('avatar', { length: 255 }),
	bio: text('bio'),
}, (table) => ({
	idx_user_id: index('idx_uprofile_uid').on(table.userId),
	fk_user: foreignKey({ name: 'fk_uprofile_uid', columns: [table.userId], foreignColumns: [users.id] }),
	unique_user: unique('uq_user_profile_userid').on(table.userId),
	unique_email: unique('uq_user_profile_email').on(table.email),
}));
