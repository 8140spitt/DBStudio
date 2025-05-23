import { mysqlTable, bigint, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const metaDeployments = mysqlTable('meta_deployments', {
    id: bigint('id', { mode: 'number', unsigned: true }).notNull().autoincrement().primaryKey(),
    objectType: varchar('object_type', { length: 32 }),
    objectId: bigint('object_id', { unsigned: true, mode: 'number' }),
    status: varchar('status', { length: 32 }),
    deployedAt: timestamp('deployed_at').defaultNow(),
    deployedSql: text('deployed_sql'),
    error: text('error'),
    // FK not included as objectType/objectId is polymorphic (could be table, column, etc.)
});
