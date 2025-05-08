// src/routes/api/connect/+server.ts
import { json } from '@sveltejs/kit';
import { createDBAdapter } from '$lib/adapters/Factory';
import type { RequestHandler } from '@sveltejs/kit';
import type { DBConfig } from '$lib/adapters/types';

export const POST: RequestHandler = async ({ request }) => {
    const config: DBConfig = await request.json();

    try {
        const adapter = createDBAdapter(config);
        await adapter.connect();
        const version = await adapter.getVersion();
        await adapter.disconnect();
        return json({ ok: true, version });
    } catch (err) {
        return json({ ok: false, error: (err as Error).message }, { status: 500 });
    }
};
