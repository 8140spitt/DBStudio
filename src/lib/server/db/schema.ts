import { mysqlTable, mysqlSchema, index, foreignKey, primaryKey, bigint, varchar, timestamp, int } from "drizzle-orm/mysql-core"
import type { AnyMySqlColumn } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const credentials = mysqlTable("credentials", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
	credentialType: varchar("credential_type", { length: 255 }).notNull(),
	credentialValue: varchar("credential_value", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
}, (table) => [
	index("idx_credentials_user_id").on(table.userId),
	primaryKey({ columns: [table.id], name: "credentials_id" }),
]);


export const databases = mysqlTable("databases", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	workspaceId: bigint("workspace_id", { mode: "number", unsigned: true }).notNull().references(() => workspaces.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		index("idx_databases_workspace_id").on(table.workspaceId),
		primaryKey({ columns: [table.id], name: "databases_id" }),
	]);

export const dbConfigs = mysqlTable("db_configs", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	databaseId: bigint("database_id", { mode: "number", unsigned: true }).notNull().references(() => databases.id),
	host: varchar({ length: 255 }).notNull(),
	port: int().notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	database: varchar({ length: 255 }).notNull(),
	ssl: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		index("idx_db_configs_database_id").on(table.databaseId),
		primaryKey({ columns: [table.id], name: "db_configs_id" }),
	]);

export const people = mysqlTable("people", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	prefix: varchar({ length: 10 }).default(''),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	middleName: varchar("middle_name", { length: 255 }).default(''),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "people_id" }),
	]);

export const projectMembers = mysqlTable("project_members", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	projectId: bigint("project_id", { mode: "number", unsigned: true }).notNull().references(() => projects.id),
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		index("idx_project_members_project_id").on(table.projectId),
		index("idx_project_members_user_id").on(table.userId),
		primaryKey({ columns: [table.id], name: "project_members_id" }),
	]);

export const projects = mysqlTable("projects", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	workspaceId: bigint("workspace_id", { mode: "number", unsigned: true }).notNull().references(() => workspaces.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		index("idx_projects_workspace_id").on(table.workspaceId),
		primaryKey({ columns: [table.id], name: "projects_id" }),
	]);

export const userSessions = mysqlTable("user_sessions", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
	sessionToken: varchar("session_token", { length: 255 }).notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		index("idx_user_sessions_user_id").on(table.userId),
		primaryKey({ columns: [table.id], name: "user_sessions_id" }),
	]);

export const userVerifications = mysqlTable("user_verifications", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
	identifier: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		index("idx_user_verifications_user_id").on(table.userId),
		primaryKey({ columns: [table.id], name: "user_verifications_id" }),
	]);

export const users = mysqlTable("users", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	personId: bigint("person_id", { mode: "number", unsigned: true }).notNull().references(() => people.id),
	email: varchar({ length: 255 }).notNull(),
},
	(table) => [
		index("idx_users_person_id").on(table.personId),
		primaryKey({ columns: [table.id], name: "users_id" }),
	]);

export const workspaceMembers = mysqlTable("workspace_members", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	workspaceId: bigint("workspace_id", { mode: "number", unsigned: true }).notNull().references(() => workspaces.id),
	userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().references(() => users.id),
	role: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		index("idx_workspace_members_workspace_id").on(table.workspaceId),
		index("idx_workspace_members_user_id").on(table.userId),
		primaryKey({ columns: [table.id], name: "workspace_members_id" }),
	]);

export const workspaces = mysqlTable("workspaces", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "workspaces_id" }),
	]);


export type Credentials = typeof credentials
export type Databases = typeof databases
export type DbConfigs = typeof dbConfigs
export type People = typeof people
export type ProjectMembers = typeof projectMembers
export type Projects = typeof projects
export type UserSessions = typeof userSessions
export type UserVerifications = typeof userVerifications
export type Users = typeof users
export type WorkspaceMembers = typeof workspaceMembers
export type Workspaces = typeof workspaces