import type { Actions } from './$types';
import { registerUser, createUserProfile } from '$lib/server/actions/auth/index';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db'; // Your drizzle instance
import { users, userCredentials, userProfiles, userRoles } from '$lib/server/db/schema'; // Your schema

export const actions: Actions = {
    register: async ({ request, locals }) => {
        const formData = await request.formData();
        const username = formData.get('username')?.toString();
        const password = formData.get('password')?.toString();
        const confirmPassword = formData.get('confirm_password')?.toString();

        let user: { id: number | undefined; username: string | undefined; password: string | undefined } = {
            id: undefined,
            username,
            password
        }

        if (!username || !password) {
            return fail(400, { fail: true, user, message: 'Username and password are required' });
        }

        if (password !== confirmPassword) {
            return fail(400, { fail: true, user, message: 'Passwords do not match' });
        }

        const { success, userId, message } = await registerUser({ username, password });

        user = {

            ...user, id: userId, password: undefined
        }

        // Check if the user was created successfully
        if (!success) {
            return fail(400, { fail: true, user, message });
        }

        // User was created successfully
        locals.user = { id: userId, username };
        locals.session = { userId, expires: new Date(Date.now() + 60 * 60 * 1000) }; // 1 hour expiration

        // redirect to the profile creation page
        throw redirect(302, '/auth/register/onboarding?userId=' + userId);
    }
}