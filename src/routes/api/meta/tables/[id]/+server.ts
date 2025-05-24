import { json } from '@sveltejs/kit';
import * as meta from '$lib/utilities/metaTables';

export async function PATCH({ params, request }) {
    const id = Number(params.id);
    const updates = await request.json();
    const updated = await meta.updateMetaTable(id, updates);
    return json(updated);
}

export async function DELETE({ params }) {
    const id = Number(params.id);
    await meta.deleteMetaTable(id);
    return new Response(null, { status: 204 });
}
