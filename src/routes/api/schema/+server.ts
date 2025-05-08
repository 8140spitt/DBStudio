// src/routes/api/schema/+server.ts

import { json } from '@sveltejs/kit';
import { createDBAdapter } from '$lib/adapters/Factory';
import type { RequestHandler } from '@sveltejs/kit';
import type { DBConfig } from '$lib/adapters/types';

export const POST: RequestHandler = async ({ request }) => {
    const config: DBConfig = await request.json();

    try {
        const adapter = createDBAdapter(config);
        await adapter.connect();
        const schema = await adapter.getSchema();
        await adapter.disconnect();
        return json({ ok: true, schema });
    } catch (err) {
        return json({ ok: false, error: (err as Error).message }, { status: 500 });
    }
};
