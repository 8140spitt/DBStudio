import {
    mysqlTable,
    bigint,
    varchar,
    text,
    decimal,
    boolean,
    json,
    index,
    unique,
    timestamp
} from 'drizzle-orm/mysql-core';

export const plans = mysqlTable('plans', {
    id: bigint('id', { unsigned: true, mode: 'number' }).notNull().autoincrement().primaryKey(),
    // Plan identifiers
    name: varchar('name', { length: 64 }).notNull(),                // e.g., "Free", "Pro", "Team", "Enterprise"
    slug: varchar('slug', { length: 64 }).notNull(),                // e.g., "free", "pro", "team"
    description: text('description'),                               // e.g., "Best for small teams..."

    // Pricing (leave null for "contact us" on Enterprise)
    priceMonthly: decimal('price_monthly', { precision: 10, scale: 2 }), // e.g., 19.99
    priceYearly: decimal('price_yearly', { precision: 10, scale: 2 }),

    // Plan status
    active: boolean('active').default(true),

    // Stripe product/pricing IDs for integration
    stripeProductId: varchar('stripe_product_id', { length: 128 }),
    stripeMonthlyPriceId: varchar('stripe_monthly_price_id', { length: 128 }),
    stripeYearlyPriceId: varchar('stripe_yearly_price_id', { length: 128 }),

    // Plan limits/features (customize as needed)
    limits: json('limits'),   // JSON: { max_members: 3, max_projects: 5, ... }
    features: json('features'), // JSON: { can_deploy: true, audit_logs: true, ... }

    // UI and sorting
    displayOrder: bigint('display_order', { unsigned: true, mode: 'number' }).default(1),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
    unique_slug: unique('uq_plan_slug').on(table.slug),
    idx_active: index('idx_plan_active').on(table.active),
    idx_order: index('idx_plan_order').on(table.displayOrder),
}));
