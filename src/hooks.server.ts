import { getSession } from '$lib/server/actions/auth/index';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {

    const sessionToken = event.cookies.get('dbstudio-session');

    if (event.url.pathname.startsWith('/auth')) {
        const response = await resolve(event);
        return response;
    }

    if (!sessionToken) {
        event.locals.user = null;
        event.locals.session = null;
        redirect(302, '/auth/login');
    }
    const { session, user } = await getSession(sessionToken);

    if (session) {
        event.locals.user = user;
        event.locals.session = session;
    } else {
        event.locals.user = null;
        event.locals.session = null;
        redirect(302, '/auth/login');
    }

    const response = await resolve(event);
    return response;
};
