import type { PageServerLoad } from './$types';

  async function checkIfFavorite() {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("clip_slug", slug)
    if (error) {
      console.log("error", error)
    } else {
      isFavorite = data.length > 0
    }
  }
export const load: PageServerLoad = async ({ params, locals: {supabase} }) => {

	let clip;

	let { data, error } = await supabase
	.from("playlist")
	.select("*")
	.eq('slug', params.slug)
	if (error) {
		console.log("error", error);
	} else {
		clip = data[0];
	}

	return {
		clip
	};
};


