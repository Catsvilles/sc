<script lang="ts">
import PlaylistPlayer from '$lib/players/PlaylistPlayer.svelte';
import { mapTrackData } from '../../helpers';
import NoProduct from './NoProduct.svelte';
export let tracks;
</script>
{#each tracks as t}
  <PlaylistPlayer track={mapTrackData(t)}/>
{:else}
  <NoProduct />
{/each}
