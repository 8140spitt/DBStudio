import type { Actions } from './$types';
import { loginUser, createSession } from '$lib/server/actions/auth/index';
import { fail, redirect } from '@sveltejs/kit';
export const actions: Actions = {
    login: async ({ request, locals, cookies }) => {
        const formData = await request.formData();
        const username: string | undefined = formData.get('username')?.toString();
        const password: string | undefined = formData.get('password')?.toString();

        if (!username || !password) {
            return fail(400, { success: false, message: 'Username and password are required' });
        }

        const { user } = await loginUser({ username, password });

        if (!user) {
            return fail(401, { success: false, user: { username }, message: 'Invalid username or password' });
        }

        let { success, sessionToken, expires, message } = await createSession(user.id);
        if (!sessionToken) {
            return fail(500, { success: false, user: { id: user.id, username }, message: 'Failed to create session' });
        }

        locals.user = { id: user.id, username };
        cookies.set('dbstudio-session', sessionToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            expires // 1 hour expiration
        });

        throw redirect(302, '/dashboard');
    }
};