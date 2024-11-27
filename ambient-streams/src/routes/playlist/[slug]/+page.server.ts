import type { PageServerLoad } from '../$types';
import { supabase } from "$lib/supabase";

let playlist: Track[] | null;
let categories: Category[] | null;

async function fetchPlaylist(slug: string){
    if(slug === 'all'){
		let { data, error} = await supabase
        .from("playlist")
        .select("*")
		if (error) {
            console.log("error", error);
        } else {
           playlist = data; 
        }
    } else {
        let { data, error } = await supabase
        .from("playlist")
        .select("*")
        .eq('category', slug)
        if (error) {
            console.log("error", error);
        } else {
            playlist = data;
        }
    }
};

async function fetchAllCategories(){
    let { data, error} = await supabase
    .from("categories")
    .select("*")
    if (error) {
        console.log("error", error);
    } else {
        categories = data;
    }
};

export const load: PageServerLoad = async ({ params }) => {
    const slug = params.slug;

    await fetchAllCategories();
    await fetchPlaylist(slug);

    return {
		categories, 
        playlist, 
        slug
	};
}
