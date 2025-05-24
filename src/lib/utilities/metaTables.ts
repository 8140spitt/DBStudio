import { db } from '$lib/server/db'; // Your drizzle db instance
import { metaTables } from '$lib/server/db/schema'; // Your metaTables schema
import { eq } from 'drizzle-orm';

export async function getMetaTables(databaseId: number) {
    return db.select().from(metaTables).where(eq(metaTables.databaseId, databaseId)).execute();
}

export async function createMetaTable(databaseId: number, name: string, comment?: string) {
    return db.insert(metaTables).values({ databaseId, name, comment }).execute();
}

export async function updateMetaTable(id: number, updates: { name?: string; comment?: string }) {
    return db.update(metaTables).set(updates).where(eq(metaTables.id, id)).execute();
}

export async function deleteMetaTable(id: number) {
    return db.delete(metaTables).where(eq(metaTables.id, id)).execute();
}
