import { mysqlTable, bigint, varchar, text, timestamp, index, foreignKey, unique } from 'drizzle-orm/mysql-core';
import { workspaces } from '../platform/workspaces';
import { projects } from '../platform/projects';
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
    fk_ws: foreignKey({ name: 'fk_mdb_ws', columns: [table.workspaceId], foreignColumns: [workspaces.id] }),
    fk_proj: foreignKey({ name: 'fk_mdb_proj', columns: [table.projectId], foreignColumns: [projects.id] }),
    unique_name: unique('uq_mdb_name').on(table.name, table.workspaceId),
    unique_name_proj: unique('uq_mdb_name_proj').on(table.name, table.projectId),
    unique_name_ws: unique('uq_mdb_name_ws').on(table.name, table.workspaceId, table.projectId),
}));
