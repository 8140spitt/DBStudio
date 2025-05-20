import { create } from 'domain';
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



// users
export const users = mysqlTable('users', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),
	status: varchar('status', { length: 255 }).default('active'),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_email: index('idx_users_email').on(table.username),
	unique_email: unique('uq_users_email').on(table.username),
}));

// user_profiles
export const userProfiles = mysqlTable('user_profiles', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(), prefix: varchar('prefix', { length: 10 }).default(''),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	middleName: varchar('middle_name', { length: 255 }).default(''),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	bio: text('bio').default(''),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const userProfilesIndexes = mysqlTable('user_profiles_indexes', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	profileField: varchar('profile_field', { length: 255 }).notNull(),
	profileValue: varchar('profile_value', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_user_id: index('idx_up_uid').on(table.userId),
	fk_user_id: foreignKey({ name: 'fk_up_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

// user_roles
export const userRoles = mysqlTable('user_roles', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	role: varchar('role', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_user_id: index('idx_ur_uid').on(table.userId),
	fk_user_id: foreignKey({ name: 'fk_ur_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));


// credentials
export const credentials = mysqlTable('credentials', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	credentialType: varchar('credential_type', { length: 255 }).notNull(),
	credentialValue: varchar('credential_value', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_user_id: index('idx_cred_uid').on(table.userId),
	fk_user_id: foreignKey({ name: 'fk_cred_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

// user_sessions
export const userSessions = mysqlTable('user_sessions', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	sessionToken: varchar('session_token', { length: 255 }).notNull(),
	expires: timestamp('expires').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_user_id: index('idx_usess_uid').on(table.userId),
	fk_user_id: foreignKey({ name: 'fk_usess_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

// user_verifications
export const userVerifications = mysqlTable('user_verifications', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	identifier: varchar('identifier', { length: 255 }).notNull(),
	token: varchar('token', { length: 255 }).notNull(),
	expires: timestamp('expires').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_user_id: index('idx_usver_uid').on(table.userId),
	fk_user_id: foreignKey({ name: 'fk_usver_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

// workspaces
export const workspaces = mysqlTable('workspaces', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// workspace_members
export const workspaceMembers = mysqlTable('workspace_members', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	workspaceId: bigint('workspace_id', { mode: 'number', unsigned: true }).notNull(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	role: varchar('role', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_ws_id: index('idx_wsmem_wsid').on(table.workspaceId),
	idx_user_id: index('idx_wsmem_uid').on(table.userId),
	fk_ws_id: foreignKey({ name: 'fk_wsmem_wsid', columns: [table.workspaceId], foreignColumns: [workspaces.id] }),
	fk_user_id: foreignKey({ name: 'fk_wsmem_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

// projects
export const projects = mysqlTable('projects', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	workspaceId: bigint('workspace_id', { mode: 'number', unsigned: true }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_ws_id: index('idx_proj_wsid').on(table.workspaceId),
	fk_ws_id: foreignKey({ name: 'fk_proj_wsid', columns: [table.workspaceId], foreignColumns: [workspaces.id] }),
}));

// project_members
export const projectMembers = mysqlTable('project_members', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	projectId: bigint('project_id', { mode: 'number', unsigned: true }).notNull(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_proj_id: index('idx_pm_pid').on(table.projectId),
	idx_user_id: index('idx_pm_uid').on(table.userId),
	fk_proj_id: foreignKey({ name: 'fk_pm_pid', columns: [table.projectId], foreignColumns: [projects.id] }),
	fk_user_id: foreignKey({ name: 'fk_pm_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

// tasks
export const tasks = mysqlTable('tasks', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	projectId: bigint('project_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	description: varchar('description', { length: 255 }).default(''),
	assigneeId: bigint('assignee_id', { mode: 'number', unsigned: true }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
	dueDate: timestamp('due_date'),
	priority: varchar('priority', { length: 255 }).default('low'),
	status: varchar('status', { length: 255 }).default('todo'),
	parentId: bigint('parent_id', { mode: 'number', unsigned: true }),
}, (table) => ({
	idx_proj_id: index('idx_tasks_pid').on(table.projectId),
	idx_assignee_id: index('idx_tasks_aid').on(table.assigneeId),
	idx_parent_id: index('idx_tasks_parent').on(table.parentId),
	fk_proj_id: foreignKey({ name: 'fk_tasks_pid', columns: [table.projectId], foreignColumns: [projects.id] }),
	fk_assignee_id: foreignKey({ name: 'fk_tasks_aid', columns: [table.assigneeId], foreignColumns: [users.id] }),
	fk_parent_id: foreignKey({ name: 'fk_tasks_parent', columns: [table.parentId], foreignColumns: [table.id] }),
}));

// task_comments
export const taskComments = mysqlTable('task_comments', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	taskId: bigint('task_id', { mode: 'number', unsigned: true }).notNull(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	comment: varchar('comment', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_task_id: index('idx_tcom_tid').on(table.taskId),
	idx_user_id: index('idx_tcom_uid').on(table.userId),
	fk_task_id: foreignKey({ name: 'fk_tcom_tid', columns: [table.taskId], foreignColumns: [tasks.id] }),
	fk_user_id: foreignKey({ name: 'fk_tcom_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

// task_attachments
export const taskAttachments = mysqlTable('task_attachments', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	taskId: bigint('task_id', { mode: 'number', unsigned: true }).notNull(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
	filePath: varchar('file_path', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_task_id: index('idx_tatt_tid').on(table.taskId),
	idx_user_id: index('idx_tatt_uid').on(table.userId),
	fk_task_id: foreignKey({ name: 'fk_tatt_tid', columns: [table.taskId], foreignColumns: [tasks.id] }),
	fk_user_id: foreignKey({ name: 'fk_tatt_uid', columns: [table.userId], foreignColumns: [users.id] }),
}));

// db_connections
export const dbConnections = mysqlTable('db_connections', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	host: varchar('host', { length: 255 }).notNull(),
	port: bigint('port', { mode: 'number', unsigned: true }).notNull(),
	username: varchar('username', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	database: varchar('database', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_name: index('idx_dbc_name').on(table.name),
	idx_host: index('idx_dbc_host').on(table.host),
	idx_port: index('idx_dbc_port').on(table.port),
	idx_username: index('idx_dbc_uname').on(table.username),
	idx_password: index('idx_dbc_pwd').on(table.password),
	idx_database: index('idx_dbc_db').on(table.database),
	idx_created_at: index('idx_dbc_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbc_uat').on(table.updatedAt),
}));

// db_connection_logs
export const dbConnectionLogs = mysqlTable('db_connection_logs', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbConnectionId: bigint('db_connection_id', { mode: 'number', unsigned: true }).notNull(),
	query: varchar('query', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_conn_id: index('idx_dbcl_cid').on(table.dbConnectionId),
	idx_query: index('idx_dbcl_qry').on(table.query),
	idx_created_at: index('idx_dbcl_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbcl_uat').on(table.updatedAt),
}));

// db_connection_errors
export const dbConnectionErrors = mysqlTable('db_connection_errors', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbConnectionId: bigint('db_connection_id', { mode: 'number', unsigned: true }).notNull(),
	error: varchar('error', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_conn_id: index('idx_dbce_cid').on(table.dbConnectionId),
	idx_error: index('idx_dbce_err').on(table.error),
	idx_created_at: index('idx_dbce_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbce_uat').on(table.updatedAt),
	fk_conn_id: foreignKey({ name: 'fk_dbce_cid', columns: [table.dbConnectionId], foreignColumns: [dbConnections.id] }),
}));

// db_users
export const dbUsers = mysqlTable('db_users', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbConnectionId: bigint('db_connection_id', { mode: 'number', unsigned: true }).notNull(),
	username: varchar('username', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_conn_id: index('idx_dbu_cid').on(table.dbConnectionId),
	idx_username: index('idx_dbu_uname').on(table.username),
	idx_password: index('idx_dbu_pwd').on(table.password),
	idx_created_at: index('idx_dbu_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbu_uat').on(table.updatedAt),
	fk_conn_id: foreignKey({ name: 'fk_dbu_cid', columns: [table.dbConnectionId], foreignColumns: [dbConnections.id] }),
}));

// db_user_permissions
export const dbUserPermissions = mysqlTable('db_user_permissions', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbUserId: bigint('db_user_id', { mode: 'number', unsigned: true }).notNull(),
	dbConnectionId: bigint('db_connection_id', { mode: 'number', unsigned: true }).notNull(),
	permission: varchar('permission', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_user_id: index('idx_dbup_uid').on(table.dbUserId),
	idx_conn_id: index('idx_dbup_cid').on(table.dbConnectionId),
	idx_perm: index('idx_dbup_perm').on(table.permission),
	idx_created_at: index('idx_dbup_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbup_uat').on(table.updatedAt),
	fk_user_id: foreignKey({ name: 'fk_dbup_uid', columns: [table.dbUserId], foreignColumns: [dbUsers.id] }),
	fk_conn_id: foreignKey({ name: 'fk_dbup_cid', columns: [table.dbConnectionId], foreignColumns: [dbConnections.id] }),
}));

// db_schemas
export const dbSchemas = mysqlTable('db_schemas', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbConnectionId: bigint('db_connection_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_conn_id: index('idx_dbsch_cid').on(table.dbConnectionId),
	idx_name: index('idx_dbsch_name').on(table.name),
	idx_created_at: index('idx_dbsch_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbsch_uat').on(table.updatedAt),
	fk_conn_id: foreignKey({ name: 'fk_dbsch_cid', columns: [table.dbConnectionId], foreignColumns: [dbConnections.id] }),
}));

// db_schema_tables
export const dbSchemaTables = mysqlTable('db_schema_tables', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaId: bigint('db_schema_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_schema_id: index('idx_dbtab_sid').on(table.dbSchemaId),
	idx_name: index('idx_dbtab_name').on(table.name),
	idx_created_at: index('idx_dbtab_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbtab_uat').on(table.updatedAt),
	fk_schema_id: foreignKey({ name: 'fk_dbtab_sid', columns: [table.dbSchemaId], foreignColumns: [dbSchemas.id] }),
}));

// db_schema_table_columns
export const dbTableColumns = mysqlTable('db_schema_table_columns', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaTableId: bigint('db_schema_table_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	type: varchar('type', { length: 255 }).notNull(),
	length: bigint('length', { mode: 'number', unsigned: true }),
	precision: bigint('precision', { mode: 'number', unsigned: true }),
	scale: bigint('scale', { mode: 'number', unsigned: true }),
	default: varchar('default', { length: 255 }),
	notNull: bigint('not_null', { mode: 'number', unsigned: true }),
	autoIncrement: bigint('auto_increment', { mode: 'number', unsigned: true }),
	primaryKey: bigint('primary_key', { mode: 'number', unsigned: true }),
	unique: bigint('unique', { mode: 'number', unsigned: true }),
	unsigned: bigint('unsigned', { mode: 'number', unsigned: true }),
	references: varchar('references', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_table_id: index('idx_dbcol_tid').on(table.dbSchemaTableId),
	idx_name: index('idx_dbcol_name').on(table.name),
	idx_type: index('idx_dbcol_type').on(table.type),
	idx_length: index('idx_dbcol_len').on(table.length),
	idx_precision: index('idx_dbcol_prec').on(table.precision),
	idx_scale: index('idx_dbcol_scale').on(table.scale),
	idx_default: index('idx_dbcol_def').on(table.default),
	idx_not_null: index('idx_dbcol_nn').on(table.notNull),
	idx_auto_inc: index('idx_dbcol_ai').on(table.autoIncrement),
	idx_pk: index('idx_dbcol_pk').on(table.primaryKey),
	idx_unique: index('idx_dbcol_uniq').on(table.unique),
	idx_unsigned: index('idx_dbcol_uns').on(table.unsigned),
	idx_references: index('idx_dbcol_ref').on(table.references),
	idx_created_at: index('idx_dbcol_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbcol_uat').on(table.updatedAt),
	fk_table_id: foreignKey({ name: 'fk_dbcol_tid', columns: [table.dbSchemaTableId], foreignColumns: [dbSchemaTables.id] }),
}));

//db_table_rows
export const dbTableRows = mysqlTable('db_table_rows', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaTableId: bigint('db_schema_table_id', { mode: 'number', unsigned: true }).notNull(),
	data: json('data').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_table_id: index('idx_dbrow_tid').on(table.dbSchemaTableId),
	idx_created_at: index('idx_dbrow_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbrow_uat').on(table.updatedAt),
	fk_table_id: foreignKey({ name: 'fk_dbrow_tid', columns: [table.dbSchemaTableId], foreignColumns: [dbSchemaTables.id] }),
}));

// db_schema_table_indexes
export const dbTableIndexes = mysqlTable('db_schema_table_indexes', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaTableId: bigint('db_schema_table_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	columns: varchar('columns', { length: 255 }).notNull(),
	unique: bigint('unique', { mode: 'number', unsigned: true }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_table_id: index('idx_dbidx_tid').on(table.dbSchemaTableId),
	idx_name: index('idx_dbidx_name').on(table.name),
	idx_columns: index('idx_dbidx_cols').on(table.columns),
	idx_unique: index('idx_dbidx_uniq').on(table.unique),
	idx_created_at: index('idx_dbidx_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbidx_uat').on(table.updatedAt),
	fk_table_id: foreignKey({ name: 'fk_dbidx_tid', columns: [table.dbSchemaTableId], foreignColumns: [dbSchemaTables.id] }),
}));

// db_schema_table_foreign_keys
export const dbTableForeignKeys = mysqlTable('db_schema_table_foreign_keys', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaTableId: bigint('db_schema_table_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	columns: varchar('columns', { length: 255 }).notNull(),
	references: varchar('references', { length: 255 }).notNull(),
	onDelete: varchar('on_delete', { length: 255 }).notNull(),
	onUpdate: varchar('on_update', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_table_id: index('idx_dbfk_tid').on(table.dbSchemaTableId),
	idx_name: index('idx_dbfk_name').on(table.name),
	idx_columns: index('idx_dbfk_cols').on(table.columns),
	idx_references: index('idx_dbfk_ref').on(table.references),
	idx_on_delete: index('idx_dbfk_del').on(table.onDelete),
	idx_on_update: index('idx_dbfk_upd').on(table.onUpdate),
	idx_created_at: index('idx_dbfk_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbfk_uat').on(table.updatedAt),
	fk_table_id: foreignKey({ name: 'fk_dbfk_tid', columns: [table.dbSchemaTableId], foreignColumns: [dbSchemaTables.id] }),
}));

// db_schema_table_triggers
export const dbTableTriggers = mysqlTable('db_schema_table_triggers', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaTableId: bigint('db_schema_table_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	event: varchar('event', { length: 255 }).notNull(),
	timing: varchar('timing', { length: 255 }).notNull(),
	statement: varchar('statement', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_table_id: index('idx_dbtrg_tid').on(table.dbSchemaTableId),
	idx_name: index('idx_dbtrg_name').on(table.name),
	idx_event: index('idx_dbtrg_evt').on(table.event),
	idx_timing: index('idx_dbtrg_tim').on(table.timing),
	idx_statement: index('idx_dbtrg_stmt').on(table.statement),
	idx_created_at: index('idx_dbtrg_cat').on(table.createdAt),
	idx_updated_at: index('idx_dbtrg_uat').on(table.updatedAt),
	fk_table_id: foreignKey({ name: 'fk_dbtrg_tid', columns: [table.dbSchemaTableId], foreignColumns: [dbSchemaTables.id] }),
}));
// db_schema_views
export const dbSchemaViews = mysqlTable('db_schema_views', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaId: bigint('db_schema_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	definition: text('definition').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_schema_id: index('idx_dbview_sid').on(table.dbSchemaId),
	idx_name: index('idx_dbview_name').on(table.name),
	fk_schema_id: foreignKey({ name: 'fk_dbview_sid', columns: [table.dbSchemaId], foreignColumns: [dbSchemas.id] }),
}));

// db_schema_procedures
export const dbSchemaProcedures = mysqlTable('db_schema_procedures', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaId: bigint('db_schema_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	definition: text('definition').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_schema_id: index('idx_dbproc_sid').on(table.dbSchemaId),
	idx_name: index('idx_dbproc_name').on(table.name),
	fk_schema_id: foreignKey({ name: 'fk_dbproc_sid', columns: [table.dbSchemaId], foreignColumns: [dbSchemas.id] }),
}));

// db_schema_table_checks
export const dbSchemaTableChecks = mysqlTable('db_schema_table_checks', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaTableId: bigint('db_schema_table_id', { mode: 'number', unsigned: true }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	expression: varchar('expression', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_table_id: index('idx_dbchk_tid').on(table.dbSchemaTableId),
	idx_name: index('idx_dbchk_name').on(table.name),
	fk_table_id: foreignKey({ name: 'fk_dbchk_tid', columns: [table.dbSchemaTableId], foreignColumns: [dbSchemaTables.id] }),
}));

// db_roles
export const dbRoles = mysqlTable('db_roles', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
});
// db_role_assignments
export const dbRoleAssignments = mysqlTable('db_role_assignments', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbUserId: bigint('db_user_id', { mode: 'number', unsigned: true }).notNull(),
	dbRoleId: bigint('db_role_id', { mode: 'number', unsigned: true }).notNull(),
	grantedAt: timestamp('granted_at').defaultNow(),
}, (table) => ({
	idx_user: index('idx_dbra_user').on(table.dbUserId),
	idx_role: index('idx_dbra_role').on(table.dbRoleId),
	fk_user: foreignKey({ name: 'fk_dbra_user', columns: [table.dbUserId], foreignColumns: [dbUsers.id] }),
	fk_role: foreignKey({ name: 'fk_dbra_role', columns: [table.dbRoleId], foreignColumns: [dbRoles.id] }),
}));

// db_migrations
export const dbMigrations = mysqlTable('db_migrations', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	version: varchar('version', { length: 255 }).notNull(),
	upSql: text('up_sql').notNull(),
	downSql: text('down_sql').notNull(),
	appliedAt: timestamp('applied_at').defaultNow(),
}, (table) => ({
	idx_version: index('idx_dbmig_ver').on(table.version),
}));

// db_query_logs
export const dbQueryLogs = mysqlTable('db_query_logs', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbConnectionId: bigint('db_connection_id', { mode: 'number', unsigned: true }).notNull(),
	query: varchar('query', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_conn: index('idx_dbql_conn').on(table.dbConnectionId),
	idx_query: index('idx_dbql_query').on(table.query),
	idx_created: index('idx_dbql_cr').on(table.createdAt),
	fk_conn: foreignKey({ name: 'fk_dbql_conn', columns: [table.dbConnectionId], foreignColumns: [dbConnections.id] }),
}));

// db_query_errors
export const dbQueryErrors = mysqlTable('db_query_errors', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbConnectionId: bigint('db_connection_id', { mode: 'number', unsigned: true }).notNull(),
	error: varchar('error', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_conn: index('idx_dbqe_conn').on(table.dbConnectionId),
	idx_error: index('idx_dbqe_err').on(table.error),
	idx_created: index('idx_dbqe_cr').on(table.createdAt),
	fk_conn: foreignKey({ name: 'fk_dbqe_conn', columns: [table.dbConnectionId], foreignColumns: [dbConnections.id] }),
}));

// db_query_results
export const dbQueryResults = mysqlTable('db_query_results', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbConnectionId: bigint('db_connection_id', { mode: 'number', unsigned: true }).notNull(),
	query: text('query').notNull(),
	result: text('result').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_conn: index('idx_dbqr_conn').on(table.dbConnectionId),
	idx_created: index('idx_dbqr_cr').on(table.createdAt),
	fk_conn: foreignKey({ name: 'fk_dbqr_conn', columns: [table.dbConnectionId], foreignColumns: [dbConnections.id] }),
}));

// db_user_activity
export const dbUserActivity = mysqlTable('db_user_activity', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbUserId: bigint('db_user_id', { mode: 'number', unsigned: true }).notNull(),
	dbConnectionId: bigint('db_connection_id', { mode: 'number', unsigned: true }).notNull(),
	activityType: varchar('activity_type', { length: 255 }).notNull(),
	activityDetails: text('activity_details').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
	idx_user: index('idx_dbuact_user').on(table.dbUserId),
	idx_conn: index('idx_dbuact_conn').on(table.dbConnectionId),
	idx_type: index('idx_dbuact_type').on(table.activityType),
	idx_created: index('idx_dbuact_cr').on(table.createdAt),
	idx_updated: index('idx_dbuact_up').on(table.updatedAt),
	fk_user: foreignKey({ name: 'fk_dbuact_user', columns: [table.dbUserId], foreignColumns: [dbUsers.id] }),
	fk_conn: foreignKey({ name: 'fk_dbuact_conn', columns: [table.dbConnectionId], foreignColumns: [dbConnections.id] }),
}));


// db_schema_exports
export const dbSchemaExports = mysqlTable('db_schema_exports', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	dbSchemaId: bigint('db_schema_id', { mode: 'number', unsigned: true }).notNull(),
	format: varchar('format', { length: 20 }).notNull(), // 'sql' | 'json'
	exportedAt: timestamp('exported_at').defaultNow(),
	filename: varchar('filename', { length: 255 }).default(''),
	userId: bigint('user_id', { mode: 'number', unsigned: true }),
}, (table) => ({
	idx_schema: index('idx_dbsex_schema').on(table.dbSchemaId),
	idx_format: index('idx_dbsex_format').on(table.format),
	fk_schema: foreignKey({ name: 'fk_dbsex_schema', columns: [table.dbSchemaId], foreignColumns: [dbSchemas.id] }),
}));

// db_privileges
export const dbPrivileges = mysqlTable('db_privileges', {
	id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
	user: varchar('user', { length: 255 }).notNull(),
	privilege: varchar('privilege', { length: 255 }).notNull(),
	tableName: varchar('table_name', { length: 255 }),
	grantedAt: timestamp('granted_at').defaultNow(),
}, (table) => ({
	idx_user: index('idx_dbp_user').on(table.user),
	idx_priv: index('idx_dbp_priv').on(table.privilege),
	idx_table: index('idx_dbp_table').on(table.tableName),
	idx_granted: index('idx_dbp_granted').on(table.grantedAt),
}));

export const metaRegistry = mysqlTable('meta_registry', {
	id: bigint('id', { unsigned: true, mode: 'number' }).notNull().autoincrement().primaryKey(),
	workspaceId: bigint('workspace_id', { unsigned: true, mode: 'number' }).notNull(),
	objectType: varchar('object_type', { length: 40 }).notNull(), // TABLE, VIEW, INDEX, etc.
	objectId: bigint('object_id', { unsigned: true, mode: 'number' }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	idx_ws: index('idx_mr_ws').on(table.workspaceId),
	idx_type: index('idx_mr_type').on(table.objectType),
	fk_ws: foreignKey({ name: 'fk_mr_ws', columns: [table.workspaceId], foreignColumns: [workspaces.id] }),
}));

export type DbSchema = typeof dbSchemas;
export type DbSchemaTable = typeof dbSchemaTables;
export type DbSchemaTableColumn = typeof dbTableColumns;
export type DbSchemaTableIndex = typeof dbTableIndexes;
export type DbSchemaTableForeignKey = typeof dbTableForeignKeys;
export type DbSchemaTableTrigger = typeof dbTableTriggers;
export type DbSchemaView = typeof dbSchemaViews;
export type DbSchemaProcedure = typeof dbSchemaProcedures;
export type DbSchemaTableCheck = typeof dbSchemaTableChecks;
export type DbRole = typeof dbRoles;
export type DbRoleAssignment = typeof dbRoleAssignments;
export type DbMigration = typeof dbMigrations;
export type DbQueryLog = typeof dbQueryLogs;
export type DbQueryError = typeof dbQueryErrors;
export type DbQueryResult = typeof dbQueryResults;
export type DbUserActivity = typeof dbUserActivity;
export type DbSchemaExport = typeof dbSchemaExports;
export type DbPrivilege = typeof dbPrivileges;
export type userProfiles = typeof userProfiles;
export type userSessions = typeof userSessions;
export type userVerifications = typeof userVerifications;
export type Users = typeof users;
export type Credentials = typeof credentials;
export type UserSessions = typeof userSessions;
export type UserVerifications = typeof userVerifications;
export type Workspaces = typeof workspaces;
export type WorkspaceMembers = typeof workspaceMembers;
export type Projects = typeof projects;
export type ProjectMembers = typeof projectMembers;
export type Tasks = typeof tasks;
export type TaskComments = typeof taskComments;
export type TaskAttachments = typeof taskAttachments;
export type DbConnections = typeof dbConnections;
export type DbConnectionLogs = typeof dbConnectionLogs;
export type DbConnectionErrors = typeof dbConnectionErrors;
export type DbUsers = typeof dbUsers;
export type DbUserPermissions = typeof dbUserPermissions;
export type DbSchemas = typeof dbSchemas;
export type DbSchemaTables = typeof dbSchemaTables;
export type DbTableColumns = typeof dbTableColumns;
export type DbTableIndexes = typeof dbTableIndexes;
export type DbTableForeignKeys = typeof dbTableForeignKeys;
export type DbTableTriggers = typeof dbTableTriggers;
export type DbSchemaViews = typeof dbSchemaViews;
export type DbSchemaProcedures = typeof dbSchemaProcedures;
export type MetaRegistry = typeof metaRegistry;