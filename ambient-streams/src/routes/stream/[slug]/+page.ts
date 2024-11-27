import type { PageLoad } from './$types';
import { supabase } from "$lib/supabase";

export const load: PageLoad = async ({ params }) => {

	const id = params.slug;
	let clip

	let { data, error } = await supabase
	.from("playlist")
	.select("*")
	.eq('id', id)
	if (error) {
		console.log("error", error);
	} else {
		clip = data[0];
	}

	return {
		clip
	};
};

export const prerender = false;