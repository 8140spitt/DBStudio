import { db } from "$lib/server/db";
import { workspaces, workspaceMembers } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkspaces(userId: string) {
    const workspacesList = await db
        .select()
        .from(workspaces)
        .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
        .where(eq(workspaceMembers.userId, userId))
        .execute();

    return workspacesList;
}