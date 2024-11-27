<script lang="ts">
  import type { PageData } from "./$types"
  import Playlist from "$lib/components/Playlist.svelte"
  export let data: PageData
</script>

<Playlist {data} />
