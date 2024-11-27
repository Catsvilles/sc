<script lang="ts">
  import type { Track } from "$lib/editor/api/timeline";

  import { writable } from "svelte/store";
  import { tick } from "svelte";

  import drag from "$lib/editor/components/actions/drag";
  import project from "$lib/editor/stores/project";
  import { ui, TracklistMode } from "$lib/editor/stores/settings";
  import FlexSpace from "$lib/editor/components/layout/FlexSpace.svelte";
  import VStack from "$lib/editor/components/layout/VStack.svelte";
  import NewTrackHead from "./NewTrackHead.svelte";
  import TrackHead from "./TrackHead.svelte";
  import Timeline from "./timeline/Timeline.svelte";
  import commands from "$lib/editor/components/actions/commands";

  let selectedTracks = new Set<Track<any>>();
  let tracklist: HTMLElement | null = null;
  let timeline: Timeline | null = null;
  let scrollDelta = writable({ x: 0, y: 0 });

  $: if (tracklist) {
    tracklist.scrollTop += $scrollDelta.y;
  }

  $: switch ($ui.tracklistMode) {
    case TracklistMode.Timeline:
      timeline?.scrollBy($scrollDelta.x);
      break;
  }

  function deleteSelectedTracks() {
    $project.tracks = $project.tracks.filter(
      (track) => !selectedTracks.delete(track)
    );
  }

  function selectTrack(track: Track<any>) {
    for (let i = 0; i < $project.tracks.length; i++) {
      $project.tracks[i].selected = false;
    }
    track.selected = true;    
    timeline?.selectAllClips(track);
  }

  function deselectAllTracks() {
    selectedTracks.clear();
    timeline?.deselectAllClips();
    selectedTracks = selectedTracks;
  }

  function handleSolo(e: CustomEvent<Track<any>>) {
    const track = e.detail;

    const isSolo = $project.tracks.every((t) => t.enabled === (t === track));

    // enable all the tracks if this track was the only one enabled
    for (let i = 0; i < $project.tracks.length; i++) {
      $project.tracks[i].enabled = isSolo || $project.tracks[i] === track;
    }
  }

  async function handleNewTrack() {
    await tick();
    tracklist.scrollTop = tracklist.scrollHeight - tracklist.clientHeight;
  }

  function handleTrackClick(e: PointerEvent, track: Track<any>, i: number) {
    if (e.button === 0) {
      selectTrack(track);

      if (e.shiftKey && selectedTracks.size > 0) {
        let range: [number, number] = null;

        for (let j = 1; i + j < $project.tracks.length || i - j >= 0; j++) {
          if (
            i + j < $project.tracks.length &&
            selectedTracks.has($project.tracks[i + j])
          ) {
            range = [i, i + j];
            break;
          }

          if (i - j >= 0 && selectedTracks.has($project.tracks[i - j])) {
            range = [i - j, i];
            break;
          }
        }

        if (range) {
          for (let i = range[0]; i < range[1]; i++) {
            selectTrack($project.tracks[i]);
          }
        }
      }
    }
  }
</script>

<svelte:window
  on:pointerdown|capture={(e) => {
    if (e.button === 0 && !e.shiftKey && !e.ctrlKey) {
      deselectAllTracks();
    }
  }}
/>

<div
  bind:this={tracklist}
  class="tracklist"
   use:commands={(e) => {
    switch (e.detail) {
      case "timeline.track.delete":
        deleteSelectedTracks();
        break;
    }
  }}
  use:drag={{ button: 1, offset: scrollDelta, invert: true, relative: true }}
  on:wheel={async (e) => {
    e.preventDefault();

    scrollDelta.set({
      x: e.deltaX,
      y: e.deltaY,
    });

    await tick();

    scrollDelta.set({ x: 0, y: 0 });
  }}
>
  <div class="split-pane horizontal" style={`--split-pos: ${250}px`}>
    <VStack spacing={1}>
        <NewTrackHead on:newtrack={handleNewTrack} />
        <VStack spacing={2}>        
        {#each $project.tracks as track, i (track)}
          <TrackHead
            bind:track
            on:solo={handleSolo}
            on:pointerdown={(e) => handleTrackClick(e, track, i)}
            selected={track.selected}
          />
        {/each}
      </VStack>
      <FlexSpace />
    </VStack>
    <div class="content">
        <Timeline bind:this={timeline} />
    </div>
  </div>
</div>

<style lang="scss">
  .tracklist {
    display: grid;
    overflow: hidden;

    .content {
      flex-grow: 1;
      display: grid;
    }
  }

  .split-pane {
    display: inline-grid;
    gap: 1px;
    min-height: 0;
    min-width: 0;
    $pane-size: calc(var(--split-pos, 50%) - 2px);
    $alt-pane-size: calc(100% - var(--split-pos, 50%) - 2px);
    &.horizontal {
      grid-template-columns: $pane-size 0px $alt-pane-size;
      &.reverse {
        grid-template-columns: $alt-pane-size 0px $pane-size;
      }
      grid-template-areas: "first splitter second";
    }
    .splitter {
      grid-area: splitter;
      display: grid;
    }
    & > :global(*) {
      &:nth-child(1) {
        grid-area: first;
      }
      &:nth-child(2) {
        grid-area: second;
      }
    }
  }
</style>
