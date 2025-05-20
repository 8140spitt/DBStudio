import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateDDL } from '$lib/adapters/DDL';

export const POST: RequestHandler = async ({ params, request }) => {
    const { dialect, objectType, objectName } = params;
    const body = await request.json();

    const ddlCommand = {
        type: 'CREATE',
        objectType: objectType.toUpperCase(),
        objectName,
        dialect,
        ...body
    };

    const sql = generateDDL(ddlCommand);
    return json({ sql, preview: true });
};
