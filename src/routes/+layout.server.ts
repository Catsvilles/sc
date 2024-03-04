import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	return {
		session: getSession()
	};
};

// /** @type {import('./$types').LayoutServerLoad} */
// export function load({ locals }) {

// 	const user = locals.user ? JSON.parse(locals.user) : undefined; // locals.user set by hooks.server.ts/handle(), undefined if not logged in
	
// 	return {
// 		user: locals.user && {
// 			fullname: user.fullname,
// 			email: user.email
// 		}
// 	};
// }
