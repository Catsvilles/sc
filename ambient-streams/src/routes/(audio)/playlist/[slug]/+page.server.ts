import type { PageServerLoad } from '../../$types';
import type { SupabaseClient } from "@supabase/supabase-js";
let playlist: Clip[] | null;
let categories: Category[] | null;

async function fetchPlaylist(slug: string, supabase: SupabaseClient){
    let { data, error } = await supabase
    .from("playlist")
    .select("*")
    .eq('category', slug)
    if (error) {
        console.log("error", error);
    } else {
        playlist = data;
    }
};

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

export const load: PageServerLoad = async ({ params, locals: {supabase} }) => {
    const slug = params.slug;

    await fetchAllCategories(supabase);
    await fetchPlaylist(slug, supabase);

    return {
		categories, 
        playlist, 
        slug
	};
}

