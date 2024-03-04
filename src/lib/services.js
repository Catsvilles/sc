import { session } from '$app/stores'

export function getUser() {
	return session.user;
}
