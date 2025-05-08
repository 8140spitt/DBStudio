import { relations } from "drizzle-orm/relations";
import { people, credentials, workspaces, databases, dbConfigs, projects, projectMembers, users, userSessions, userVerifications, workspaceMembers } from "./schema";

export const credentialsRelations = relations(credentials, ({one}) => ({
	person: one(people, {
		fields: [credentials.peopleId],
		references: [people.id]
	}),
}));

export const peopleRelations = relations(people, ({many}) => ({
	credentials: many(credentials),
	users: many(users),
}));

export const databasesRelations = relations(databases, ({one, many}) => ({
	workspace: one(workspaces, {
		fields: [databases.workspaceId],
		references: [workspaces.id]
	}),
	dbConfigs: many(dbConfigs),
}));

export const workspacesRelations = relations(workspaces, ({many}) => ({
	databases: many(databases),
	projects: many(projects),
	workspaceMembers: many(workspaceMembers),
}));

export const dbConfigsRelations = relations(dbConfigs, ({one}) => ({
	database: one(databases, {
		fields: [dbConfigs.databaseId],
		references: [databases.id]
	}),
}));

export const projectMembersRelations = relations(projectMembers, ({one}) => ({
	project: one(projects, {
		fields: [projectMembers.projectId],
		references: [projects.id]
	}),
	user: one(users, {
		fields: [projectMembers.userId],
		references: [users.id]
	}),
}));

export const projectsRelations = relations(projects, ({one, many}) => ({
	projectMembers: many(projectMembers),
	workspace: one(workspaces, {
		fields: [projects.workspaceId],
		references: [workspaces.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	projectMembers: many(projectMembers),
	userSessions: many(userSessions),
	userVerifications: many(userVerifications),
	person: one(people, {
		fields: [users.personId],
		references: [people.id]
	}),
	workspaceMembers: many(workspaceMembers),
}));

export const userSessionsRelations = relations(userSessions, ({one}) => ({
	user: one(users, {
		fields: [userSessions.userId],
		references: [users.id]
	}),
}));

export const userVerificationsRelations = relations(userVerifications, ({one}) => ({
	user: one(users, {
		fields: [userVerifications.userId],
		references: [users.id]
	}),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({one}) => ({
	user: one(users, {
		fields: [workspaceMembers.userId],
		references: [users.id]
	}),
	workspace: one(workspaces, {
		fields: [workspaceMembers.workspaceId],
		references: [workspaces.id]
	}),
}));