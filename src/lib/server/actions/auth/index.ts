import { db } from '$lib/server/db/';
import { users, credentials, userSessions, userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserProfile(userId: number) {
    const person = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .execute();
    return person;
}

export async function getUserById(userId: number) {
    const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .execute();

    return user;
}
export async function getUserByUsername(username: string) {
    const user = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .execute();

    return user;
}


export async function getUserBySessionToken(sessionToken: string) {
    const user = await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.sessionToken, sessionToken))
        .innerJoin(users, eq(userSessions.userId, users.id))
        .execute();

    return user;
}

export async function getSession(sessionToken: string) {
    const session = await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.sessionToken, sessionToken))
        .execute();

    return session;
}
export async function getUserBySession(sessionToken: string) {
    const user = await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.sessionToken, sessionToken))
        .innerJoin(users, eq(userSessions.userId, users.id))
        .execute();

    return user;
}

