import { db } from '$lib/server/db'; // Your drizzle instance
import { users, userCredentials, userProfiles, userRoles } from '$lib/server/db/schema'; // Your schema
import { hashPassword, verifyPassword } from '$lib/utilities/auth'; // Your hashing function
import { eq } from 'drizzle-orm'; // Your ORM functions
import { userSessions } from '$lib/server/db/schema'; // Your session table
import crypto from 'crypto'; // For generating random session tokens

export async function registerUser({ username, password }: { username: string, password: string }) {
    // 1. Check for existing username
    const [existing] = await db.select().from(users).where(eq(users.username, username));

    if (existing) {
        return { success: false, message: 'Username already exists' };
    }

    // 2. Hash password
    const hashed = hashPassword(password);

    // 3. Insert user
    const [userResult] = await db.insert(users).values({ username }).$returningId();
    const userId = userResult.id;

    if (!userId) {
        return { success: false, message: 'Failed to create user' };
    }

    // 4. Insert credentials
    const [credentialResult] = await db.insert(userCredentials).values({
        userId,
        credentialType: 'password',
        credentialValue: hashed
    }).$returningId();
    const credentialId = credentialResult.id;

    if (!credentialId) {
        return { success: false, userId, message: 'Failed to create user credentials' };
    }

    const [roleResult] = await db.insert(userRoles).values({
        userId,
        role: 'user' // Default role
    }).$returningId();
    const roleId = roleResult.id;



    if (!userId || !credentialId || !roleId) {
        return { success: false, message: 'Failed to create user' };
    }

    return { success: true, userId, message: 'User created successfully' };
}

export async function createUserProfile(userId: number, profileData: any) {
    // Assuming you have a userProfiles table
    const { firstName, lastName, } = profileData;

    await db.insert(userProfiles).values({
        userId,
        ...profileData
    });

    return { success: true, };
}

export async function loginUser({ username, password }: { username: string, password: string }) {
    // 1. Check for existing user
    const [user] = await db.select().from(users).where(eq(users.username, username));

    if (!user) {
        return { success: false, message: 'Invalid username or password' };
    }

    // 2. Check credentials
    const [credential] = await db.select().from(userCredentials).where(eq(userCredentials.userId, user.id));

    if (!credential) {
        return { success: false, message: 'Invalid username or password' };
    }
    // 3. Verify password
    const isValid = verifyPassword(password, credential.credentialValue);
    if (!isValid) {
        return { success: false, message: 'Invalid username or password' };
    }
    return { success: true, user: { ...user }, message: 'Login successful' };
}

export async function createSession(userId: number) {
    // Create a session for the user
    const sessionToken = crypto.randomBytes(32).toString('hex'); // Generate a random session token
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    let [session] = await db.insert(userSessions).values({
        userId,
        sessionToken,
        expires
    });

    if (!session) {
        return { success: false, sessionToken: undefined, message: 'Failed to create session' };
    }

    return { success: true, sessionToken, expires, message: 'Session created successfully' };
}

export async function getSession(sessionToken: string) {
    // Get the session from the database
    const [session] = await db.select().from(userSessions).where(eq(userSessions.sessionToken, sessionToken));


    if (!session) {
        return { success: false, message: 'Session not found' };
    }

    // Check if the session has expired
    const now = new Date();
    if (session.expires < now) {
        // Session has expired, delete it
        await db.delete(userSessions).where(eq(userSessions.sessionToken, sessionToken));
        return { success: false, message: 'Session expired' };
    }
    // Session is valid
    // Get the user associated with the session
    const [user] = await db.select().from(users).where(eq(users.id, session.userId));
    if (!user) {
        return { success: false, message: 'User not found' };
    }


    return { success: true, session, user };
}
