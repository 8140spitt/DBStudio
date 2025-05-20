// src/routes/api/ddl/[dialect]/[objectType]/[objectName]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateDDL } from '$lib/adapters/DDL'; // The module you just made!

export const POST: RequestHandler = async ({ params, request }) => {
    // Create new object (table, index, etc)
    const body = await request.json();
    const { dialect, objectType, objectName } = params;
    // body.details should be the correct DDL object details
    const ddlCommand = {
        type: 'CREATE',
        objectType: objectType.toUpperCase(),
        objectName,
        dialect,
        ...body
    };
    // Run SQL using your DB connection (or return the SQL if only preview)
    // Example:
    // await db.execute(generateDDL(ddlCommand));
    return json({ sql: generateDDL(ddlCommand) });
};

export const GET: RequestHandler = async ({ params }) => {
    // Fetch and return the current object definition (from your DB metadata)
    // ...
    return json({ definition: {/* ... */ } });
};

export const PUT: RequestHandler = async ({ params, request }) => {
    // Update object (e.g., ALTER TABLE)
    // ...
    return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ params }) => {
    // Drop object (e.g., DROP TABLE)
    // ...
    return json({ ok: true });
};
