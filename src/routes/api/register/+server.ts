// src/routes/api/register/+server.ts
import { json } from '@sveltejs/kit';
import { users, userProfiles } from '$lib/server/db/schema'; // your drizzle schema
import { db } from '$lib/server/db/index'; // your drizzle connection
import { hashPassword } from '$lib/utilities/auth.js'; // use crypto
import { eq } from 'drizzle-orm'; // import the eq function for querying

export async function POST({ request }) {
    const { username, password, email } = await request.json();

    // Check for existing user/email
    const existing = await db.select().from(users)
        .where(eq(users.username, username));
    if (existing.length > 0) {
        return json({ error: 'Username already exists' }, { status: 409 });
    }
    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user into users table
    const [user] = await db.insert(users).values({
        username,
        hashedPassword,
        status: 'pending' // default status
    }).$returningId();

    if (!user) {
        return json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Insert user profile into userProfiles table
    const profile = await db.insert(userProfiles).values({
        userId: user,
        email,
        firstName: '', // Optional, can be set later
        lastName: '', // Optional, can be set later
        avatar: '', // Optional, can be set later
        bio: '' // Optional, can be set later
    }).$returningId();

    // You can add auto-login here, or redirect to login.
    return json({ success: true, userId: user.id });
}
