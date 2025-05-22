import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
    const userId = url.searchParams.get('userId');
    if (!locals.user) {
        throw redirect(302, '/auth/register');
    }

    if (!userId) {
        throw redirect(302, '/auth/register');
    }
    return { userId, user: locals.user };
};