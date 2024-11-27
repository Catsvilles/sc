import type { PageServerLoad } from '../$types';
import type { SupabaseClient } from "@supabase/supabase-js";

async function getUserFavorites(userId: string, supabase: SupabaseClient){
    let { data, error} = await supabase
    .from("favorites")
    .select("*")
    .eq('user_id', userId)
    if (error) {
        console.log("error", error);
    } else {
        return fetchPlaylist(data, supabase);
    }
};

async function fetchPlaylist( clips, supabase: SupabaseClient) {
    let slugs = clips.map(clip => clip.clip_slug);
    let { data, error } = await supabase
    .from("playlist")
    .select("*")
    .in('slug', slugs)
    if (error) {
        console.log("error", error);
    } else {
        return data;
    }
};

export const load: PageServerLoad = async ({ locals: {supabase, safeGetSession} }) => {    
    let {session} = await safeGetSession()
   
    const favorites = await getUserFavorites(session.user.id, supabase);
   
    return {
        favorites
    };
}
