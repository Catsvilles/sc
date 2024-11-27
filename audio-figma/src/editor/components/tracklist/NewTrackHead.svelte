<script lang="ts">
  import { AudioTrack } from "@api/audio";
  import project from "@app/stores/project";
  import Icon from "@components/Icon.svelte";
  import { createEventDispatcher } from "svelte";
  import stack from "@app/stores/undoredo";

  const dispatch = createEventDispatcher();

  function handleClick() {
    for (let i = 0; i < $project.tracks.length; i++) {
      $project.tracks[i].selected = false;
    }
    const track = new AudioTrack();
    track.selected = true;
    $project.tracks = [...$project.tracks, track];
    dispatch("newtrack", track);
    const np = structuredClone($project);
    $stack.push(np);
  }
</script>

<button class="new-track-head h-[40px] w-full bg-[#333333] p-1 mb-1" on:click={handleClick}>
  <Icon 
    color="gray"
    size="1.5em"
    name="edit/plus_circle_outline"
  />
</button>
