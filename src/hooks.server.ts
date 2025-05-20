import { getSession, getUserBySessionToken } from '$lib/server/actions/auth/index';
import type { Handle } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {


    const sessionToken = event.cookies.get('db_studio_session');

    if (sessionToken) {
        // Check if the session token is valid
        const session = await getSession(sessionToken);

        if (!session) {
            // Session token is invalid, redirect to login
            event.cookies.delete('db_studio_session', { path: '/' });
            throw redirect(302, '/auth/login');
        }

        // Session token is valid, set the user in the even
        event.locals.user = await getUserBySessionToken(sessionToken);

    }

    const response = await resolve(event);
    return response;
};
