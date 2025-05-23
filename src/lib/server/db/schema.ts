import { hash } from 'crypto';
import {
	mysqlTable,
	bigint,
	varchar,
	timestamp,
	index,
	foreignKey,
	text,
	json,
	unique
} from 'drizzle-orm/mysql-core';

// ---- PLATFORM TABLES ----

export const users = mysqlTable('users', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),
	hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
	status: varchar('status', { length: 255 }).default('active'),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_username: index('idx_users_username').on(table.username),
	unique_username: unique('uq_users_username').on(table.username),
}));

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
}));

export const userRoles = mysqlTable('user_roles', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	role: varchar('role', { length: 255 }).notNull(),
}, (table) => ({
	idx_user_id: index('idx_ur_uid').on(table.userId),
	fk_user: foreignKey({ name: 'fk_ur_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

export const workspaces = mysqlTable('workspaces', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	defaultDialect: varchar('default_dialect', { length: 32 }).default('mysql'),
	createdAt: timestamp('created_at').defaultNow(),
});

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
}));

export const projects = mysqlTable('projects', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	workspaceId: bigint('workspace_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	defaultDialect: varchar('default_dialect', { length: 32 }).default('mysql'),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_ws_id: index('idx_proj_wsid').on(table.workspaceId),
	fk_ws: foreignKey({ name: 'fk_proj_wsid', columns: [table.workspaceId], foreignColumns: [workspaces.id] }),
}));

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
}));

export const userSessions = mysqlTable('user_sessions', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	sessionToken: varchar('session_token', { length: 255 }).notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_user_id: index('idx_us_uid').on(table.userId),
	fk_user: foreignKey({ name: 'fk_us_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

export const userCredentials = mysqlTable('user_credentials', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	credentialType: varchar('credential_type', { length: 255 }).notNull(),
	credentialValue: varchar('credential_value', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_user_id: index('idx_uc_uid').on(table.userId),
	fk_user: foreignKey({ name: 'fk_uc_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

// ---- META-DRIVEN DB DESIGN TABLES ----

// Logical database - the "app" DB
export const metaDatabases = mysqlTable('meta_databases', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	workspaceId: bigint('workspace_id', { unsigned: true, mode: 'number' }).notNull(),
	projectId: bigint('project_id', { unsigned: true, mode: 'number' }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	dialect: varchar('dialect', { length: 32 }).default('mysql'),
	description: text('description'),
	isDeployed: bigint('is_deployed', { unsigned: true, mode: 'number' }).default(0),
	deployedAt: timestamp('deployed_at'),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_ws: index('idx_mdb_ws').on(table.workspaceId),
	idx_proj: index('idx_mdb_proj').on(table.projectId),
}));

// Logical tables
export const metaTables = mysqlTable('meta_tables', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	databaseId: bigint('database_id', { unsigned: true, mode: 'number' }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	comment: text('comment'),
	metadata: json('metadata'),
	isDeployed: bigint('is_deployed', { unsigned: true, mode: 'number' }).default(0),
	deployedAt: timestamp('deployed_at'),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_dbid: index('idx_mtab_dbid').on(table.databaseId),
}));

// Columns in each logical table
export const metaColumns = mysqlTable('meta_columns', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	tableId: bigint('table_id', { unsigned: true, mode: 'number' }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	type: varchar('type', { length: 100 }).notNull(),
	length: bigint('length', { unsigned: true, mode: 'number' }),
	isNullable: bigint('is_nullable', { unsigned: true, mode: 'number' }).default(1),
	isPrimaryKey: bigint('is_primary_key', { unsigned: true, mode: 'number' }).default(0),
	isUnique: bigint('is_unique', { unsigned: true, mode: 'number' }).default(0),
	defaultValue: varchar('default_value', { length: 255 }),
	metadata: json('metadata'),
	comment: text('comment'),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_table_id: index('idx_mcol_tid').on(table.tableId),
}));

// Constraints (PK, FK, Unique, Check)
export const metaConstraints = mysqlTable('meta_constraints', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	tableId: bigint('table_id', { unsigned: true, mode: 'number' }).notNull(),
	type: varchar('type', { length: 50 }).notNull(),
	name: varchar('name', { length: 255 }),
	columns: varchar('columns', { length: 255 }),
	referenceTable: varchar('reference_table', { length: 255 }),
	referenceColumns: varchar('reference_columns', { length: 255 }),
	onDelete: varchar('on_delete', { length: 32 }),
	onUpdate: varchar('on_update', { length: 32 }),
	expression: varchar('expression', { length: 255 }),
	metadata: json('metadata'),
}, (table) => ({
	idx_table_id: index('idx_mconst_tid').on(table.tableId),
}));

// Indexes
export const metaIndexes = mysqlTable('meta_indexes', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	tableId: bigint('table_id', { unsigned: true, mode: 'number' }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	columns: varchar('columns', { length: 255 }).notNull(),
	isUnique: bigint('is_unique', { unsigned: true, mode: 'number' }).default(0),
	type: varchar('type', { length: 32 }),
	metadata: json('metadata'),
}, (table) => ({
	idx_table_id: index('idx_midx_tid').on(table.tableId),
}));

// Views
export const metaViews = mysqlTable('meta_views', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	databaseId: bigint('database_id', { unsigned: true, mode: 'number' }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	definition: text('definition').notNull(),
	metadata: json('metadata'),
}, (table) => ({
	idx_dbid: index('idx_mview_dbid').on(table.databaseId),
}));

// Procedures
export const metaProcedures = mysqlTable('meta_procedures', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	databaseId: bigint('database_id', { unsigned: true, mode: 'number' }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	parameters: varchar('parameters', { length: 255 }),
	body: text('body').notNull(),
	metadata: json('metadata'),
}, (table) => ({
	idx_dbid: index('idx_mproc_dbid').on(table.databaseId),
}));

// Triggers
export const metaTriggers = mysqlTable('meta_triggers', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	databaseId: bigint('database_id', { unsigned: true, mode: 'number' }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	event: varchar('event', { length: 64 }).notNull(),
	timing: varchar('timing', { length: 32 }).notNull(),
	tableName: varchar('table_name', { length: 255 }).notNull(),
	body: text('body').notNull(),
	metadata: json('metadata'),
}, (table) => ({
	idx_dbid: index('idx_mtrg_dbid').on(table.databaseId),
}));

// ---- (Optional) UI Builder Meta Tables ----
export const metaPages = mysqlTable('meta_pages', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	projectId: bigint('project_id', { unsigned: true, mode: 'number' }).notNull(),
	name: varchar('name', { length: 255 }),
	layout: json('layout'), // e.g. JSON describing the layout/structure
	metadata: json('metadata'),
});

export const metaPageComponents = mysqlTable('meta_page_components', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	pageId: bigint('page_id', { unsigned: true, mode: 'number' }).notNull(),
	type: varchar('type', { length: 50 }), // form, table, chart, etc.
	config: json('config'),
	order: bigint('order', { unsigned: true, mode: 'number' }),
});

// ---- Deployment Tracking ----
export const metaDeployments = mysqlTable('meta_deployments', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	objectType: varchar('object_type', { length: 32 }),
	objectId: bigint('object_id', { unsigned: true, mode: 'number' }),
	status: varchar('status', { length: 32 }),
	deployedAt: timestamp('deployed_at').defaultNow(),
	deployedSql: text('deployed_sql'),
	error: text('error'),
});

