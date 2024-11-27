import type { PageServerLoad } from '../$types';
import { supabase } from "$lib/supabase";

let favorites: Track[] | null;

export const load: PageServerLoad = async () => {
    let { data, error} = await supabase
    .from("playlist")
    .select("*")
    if (error) {
        console.log("error", error);
    } else {
        favorites = data; 
    }

    return {
        favorites
	};
}