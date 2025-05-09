import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { hashPassword } from "$lib/utilities/auth/password";
import { users, people, credentials } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

type RegisterInput = {
    person: {
        firstName: string;
        lastName: string;
        prefix?: string;
        middleName?: string;
    };
    email: string;
    password: string;
};

export async function registerUser({ person, email, password }: RegisterInput) {
    // Check if user already exists
    const existing = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    if (existing) throw error(400, "User already exists");

    // Run inside a transaction
    const result = await db.transaction(async (tx) => {
        // 1. Create person
        const insertedPersonId = await tx
            .insert(people)
            .values({
                firstName: person.firstName,
                lastName: person.lastName,
                prefix: person.prefix ?? '',
                middleName: person.middleName ?? '',
            })
            .$returningId();

        if (!insertedPersonId) throw error(500, "Failed to create person");

        // 2. Create user
        const insertedUserId = await tx
            .insert(users)
            .values({
                email,
                personId: insertedPersonId,
            })
            .$returningId();

        if (!insertedUserId) throw error(500, "Failed to create user");

        // 3. Create credentials
        const hashed = await hashPassword(password);
        const insertedCredentialId = await tx
            .insert(credentials)
            .values({
                userId: insertedUserId,
                credentialType: "password",
                credentialValue: hashed,
            })
            .$returningId();

        if (!insertedCredentialId) throw error(500, "Failed to create credentials");

        return {
            userId: insertedUserId,
            personId: insertedPersonId,
            credentialId: insertedCredentialId,
        };
    });

    return result;
}
