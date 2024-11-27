import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};


// import { parse } from 'cookie';
// /** @type {import('@sveltejs/kit').Handle} */
// export async function handle({ event, resolve }) {
// 	try {
// 		const user = event.cookies.get('user');
// 		event.locals.user = user		
// 	} catch (e) {
// 		event.locals.user = null		
// 	}
	
// 	return await resolve(event);
// }

// /** @type {import('@sveltejs/kit').GetSession} */
// export function getSession(event) {
// 	//IF statement to check if jwt token didnt expire from backend
// 	//TODO: make this nicer

// 	return event?.locals?.user?.email
// 		? {
// 				user: {
// 					email: event.locals.user.email,
// 					fullname: event.locals.user.fullname,
// 				},
// 		  }
// 		: {};
// }