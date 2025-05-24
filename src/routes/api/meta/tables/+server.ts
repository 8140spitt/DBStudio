import { json } from '@sveltejs/kit';
import * as meta from '$lib/utilities/metaTables';

export async function GET({ url, params }) {
    const dbId = Number(url.searchParams.get('dbId'));
    const tables = await meta.getMetaTables(dbId);
    return json(tables);
}

export async function POST({ request }) {
    const { databaseId, name, comment } = await request.json();
    const table = await meta.createMetaTable(databaseId, name, comment);
    return json(table);
}
