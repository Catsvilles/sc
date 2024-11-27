<script lang="ts">
  import { AudioTrack } from "$lib/editor/api/audio";
  import project from "$lib/editor/stores/project";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function handleClick() {
    for (let i = 0; i < $project.tracks.length; i++) {
      $project.tracks[i].selected = false;
    }
    const track = new AudioTrack();
    track.selected = true;
    $project.tracks = [...$project.tracks, track];
    dispatch("newtrack", track);
  }
</script>

<div class="flex flex-row items-center justify-center text-xs gap-2 text-color rounded-md h-12">
</div>