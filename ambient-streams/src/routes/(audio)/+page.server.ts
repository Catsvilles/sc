import type { PageServerLoad } from '../$types';
import type { SupabaseClient } from "@supabase/supabase-js";
let playlist: Track[] | null;
let categories: Category[] | null;

async function fetchAllCategories(supabase: SupabaseClient){
    let { data, error} = await supabase
    .from("categories")
    .select("*")
    if (error) {
        console.log("error", error);
    } else {
        categories = data;
    }
};

async function fetchPlaylist(supabase: SupabaseClient){
    let { data, error} = await supabase
    .from("playlist")
    .select("*")
    if (error) {
        console.log("error", error);
    } else {
       playlist = data; 
    }
};

export const load: PageServerLoad = async ({ params, locals: {supabase} }) => {
    const slug = params.slug;
    fetchAllCategories(supabase);
    fetchPlaylist(supabase);
    return {
		categories, 
        playlist, 
        slug
	};
}
