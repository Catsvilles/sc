<script lang="ts">
  import { onMount } from "svelte"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let data
  export let slug: string

  let { supabase } = data
  let { session } = data

  let isFavorite = false
  onMount(async () => {
    await checkIfFavorite()
  })

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

  async function removeFavorite() {
    const { data, error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", session.user.id)
      .eq("clip_slug", slug)
    if (error) {
      console.log("error", error)
    } else {
      console.log(data)
      isFavorite = false
      dispatch("remove")
    }
  }

  async function addFavorite() {
    const { data, error } = await supabase
      .from("favorites")
      .insert([{ user_id: session.user.id, clip_slug: slug }])
    if (error) {
      console.log("error", error)
    } else {
      console.log(data)
      isFavorite = true
    }
  }
</script>

<button on:click={isFavorite ? removeFavorite : addFavorite}>
  {#if isFavorite}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-8 h-8 stroke-[url(#gradient)]"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#2c3e50"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z"
        stroke-width="0"
        fill="currentColor"
      />
    </svg>
  {:else}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-8 h-8 stroke-[url(#gradient)]"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#2c3e50"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
      />
    </svg>
  {/if}
</button>
