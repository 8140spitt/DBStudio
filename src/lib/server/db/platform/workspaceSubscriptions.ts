import {
    mysqlTable,
    bigint,
    varchar,
    timestamp,
    decimal,
    boolean,
    index,
    foreignKey
} from 'drizzle-orm/mysql-core';
import { workspaces } from './workspaces';
import { plans } from './plans';

// Subscriptions are always 1:1 with workspaces (billing is per workspace)
export const workspaceSubscriptions = mysqlTable('workspace_subscriptions', {
    id: bigint('id', { unsigned: true, mode: 'number' }).notNull().autoincrement().primaryKey(),
    workspaceId: bigint('workspace_id', { unsigned: true, mode: 'number' }).notNull(),
    planId: bigint('plan_id', { unsigned: true, mode: 'number' }).notNull(),

    // Billing & payment integration (Stripe)
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 128 }),
    stripeCustomerId: varchar('stripe_customer_id', { length: 128 }),

    // Current status
    status: varchar('status', { length: 32 }).default('active'), // active, trialing, past_due, cancelled, paused, etc.

    // Dates and renewal
    startedAt: timestamp('started_at').defaultNow(),
    renewsAt: timestamp('renews_at'),
    cancelledAt: timestamp('cancelled_at'),
    endedAt: timestamp('ended_at'),

    // Billing details (denormalized for quick access; update from Stripe webhook)
    amount: decimal('amount', { precision: 10, scale: 2 }),    // latest billed amount
    currency: varchar('currency', { length: 16 }),             // e.g., "usd", "gbp"
    interval: varchar('interval', { length: 16 }),             // "month" or "year"

    // Audit
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    unique_ws: index('idx_ws_subscription').on(table.workspaceId), // 1 subscription per workspace
    fk_workspace: foreignKey({ name: 'fk_ws_subscription_ws', columns: [table.workspaceId], foreignColumns: [workspaces.id] }),
    fk_plan: foreignKey({ name: 'fk_ws_subscription_plan', columns: [table.planId], foreignColumns: [plans.id] }),
}));
