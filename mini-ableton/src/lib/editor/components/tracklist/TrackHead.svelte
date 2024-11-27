<script lang="ts">
  import type { Source } from "$lib/editor/api/graph";
  import type { Track } from "$lib/editor/api/timeline";
  import project from "$lib/editor/stores/project";
  import Knob from "$lib/editor/components/control/Knob.svelte";
	import InPlaceEdit from "$lib/editor/components/InPlaceEdit.svelte";
  import player from "$lib/editor/stores/player";

  export let selected: boolean = false;
  export let track: Track<Source<any>>;
   
  let selectedTracks = new Set<Track<any>>();
  let volumeParam = track.mod.parameters[0];

  $: isSolo = $project.tracks.every((t) => t.enabled === (t === track));

  function muteTrack() {
    for (let i = 0; i < $project.tracks.length; i++) {
      $project.tracks[i].enabled = isSolo || $project.tracks[i] === track;
    }
    //Resetting the playback
    if ($player.playing) {
      const startFrom = $player.currentTime;
      $player.stop();
      $player.start($project, startFrom);
    }
  }

  function disableTrack(){
    track.enabled = !track.enabled
    //Resetting the playback
    if ($player.playing) {
      const startFrom = $player.currentTime;
      $player.stop();
      $player.start($project, startFrom);
    }
  }

  function deleteTrack(){
    selectedTracks = selectedTracks.add(track);
    $project.tracks = $project.tracks.filter(
      (track) => !selectedTracks.delete(track)
    );
  }
</script>

<div   
  class="{track.enabled ? '' : 'opacity-35'} track-head flex flex-col items-center justify-center p-2 gap-1 h-[var(--track-height)] overflow-hidden shrink-0 shadow-md w-full rounded-md first-bg-color"
  class:disabled={!track.enabled}
  class:selected
  on:pointerdown
  style={`--track-height: ${track.height}px`}
>
  <div class="w-full items-start">
      <InPlaceEdit
      value={track.name}
      on:submit={({ detail: value }) => {
        track.name = value;
      }}
      on:df={() => {
        selected = false;
      }}
    />
  </div>
  <div class="flex justify-between flex-row items-center w-full gap-4">
    <Knob
      name={volumeParam.name}
      type={volumeParam.type}
      min={volumeParam.min}
      max={volumeParam.max}
      bind:value={volumeParam.value}
      disabled={!track.enabled}
    />
    <div class="flex items-center justify-center gap-2">
      <!-- <Checkbox
        bind:checked={track.enabled}
        on:contextmenu={handleMuteContextMenu}
      /> -->
      <button class="p-1 second-bg-color rounded-lg text-color text-xs" on:pointerdown={disableTrack}>
        {#if !track.enabled}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="icon-fill-active w-4 h-4">
            <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="icon-fill-active w-4 h-4">
            <path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/>
          </svg>
        {/if}
      </button>

      <button class="p-1.5 second-bg-color rounded-lg" on:pointerdown={muteTrack}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="{isSolo ? 'icon-fill-active' : 'icon-fill-inactive' }  w-3 h-3">
          <path d="M99.1 105.4C79 114 68.2 127.2 65.2 144.8c-2.4 14.1-.7 23.2 2 29.4c2.8 6.3 7.9 12.4 16.7 18.6c19.2 13.4 48.3 22.1 84.9 32.5c1 .3 1.9 .6 2.9 .8c32.7 9.3 72 20.6 100.9 40.7c15.7 10.9 29.9 25.5 38.6 45.1c8.8 19.8 10.8 42 6.6 66.3c-7.3 42.5-35.3 71.7-71.8 87.3c-35.4 15.2-79.1 17.9-123.7 10.9l-.2 0 0 0c-24-3.9-62.7-17.1-87.6-25.6c-4.8-1.7-9.2-3.1-12.8-4.3C5.1 440.8-3.9 422.7 1.6 405.9s23.7-25.8 40.5-20.3c4.9 1.6 10.2 3.4 15.9 5.4c25.4 8.6 56.4 19.2 74.4 22.1c36.8 5.7 67.5 2.5 88.5-6.5c20.1-8.6 30.8-21.8 33.9-39.4c2.4-14.1 .7-23.2-2-29.4c-2.8-6.3-7.9-12.4-16.7-18.6c-19.2-13.4-48.3-22.1-84.9-32.5c-1-.3-1.9-.6-2.9-.8c-32.7-9.3-72-20.6-100.9-40.7c-15.7-10.9-29.9-25.5-38.6-45.1c-8.8-19.8-10.8-42-6.6-66.3l31.5 5.5L2.1 133.9C9.4 91.4 37.4 62.2 73.9 46.6c35.4-15.2 79.1-17.9 123.7-10.9c13 2 52.4 9.6 66.6 13.4c17.1 4.5 27.2 22.1 22.7 39.2s-22.1 27.2-39.2 22.7c-11.2-3-48.1-10.2-60.1-12l4.9-31.5-4.9 31.5c-36.9-5.8-67.5-2.5-88.6 6.5z"/>
        </svg>
      </button>
      <!-- <button on:pointerdown={deleteTrack} class="p-1.5 second-bg-color rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon-fill-active w-3 h-3">
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
        </svg>
      </button> -->
    </div>
  </div>
</div>
