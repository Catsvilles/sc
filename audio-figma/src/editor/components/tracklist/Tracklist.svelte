<script lang="ts">
  import type { Track } from "@api/timeline";

  import { writable } from "svelte/store";
  import { tick, xlink_attr } from "svelte/internal";

  import drag from "@components/actions/drag";
  import project from "@app/stores/project";
  import { ui, TracklistMode } from "@app/stores/settings";
  import FlexSpace from "@components/layout/FlexSpace.svelte";
  import SplitBar from "@components/layout/SplitBar.svelte";
  import SplitPane from "@components/layout/SplitPane.svelte";
  import VStack from "@components/layout/VStack.svelte";
  import NewTrackHead from "./NewTrackHead.svelte";
  import TrackHead from "./TrackHead.svelte";
  import Timeline from "./timeline/Timeline.svelte";
  import Graph from "./graph/Graph.svelte";
  import commands from "@components/actions/commands";
  import stack from "@app/stores/undoredo";

  let selectedTracks = new Set<Track<any>>();
  let tracklist: HTMLElement | null = null;
  let timeline: Timeline | null = null;
  let graph: Graph | null = null;
  let scrollDelta = writable({ x: 0, y: 0 });

  $: if (tracklist) {
    tracklist.scrollTop += $scrollDelta.y;
  }

  $: switch ($ui.tracklistMode) {
    case TracklistMode.Timeline:      
      timeline?.scrollBy($scrollDelta.x);
      break;
    case TracklistMode.Graph:
      graph?.scrollBy($scrollDelta.x);
      break;
  }


  function deleteSelectedTracks() {   
    $project.tracks = $project.tracks.filter(
      (track) => !track.selected
    );
    $project.tracks[0].selected = true;
    const np = structuredClone($project);
    $stack.push(np);
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
    const np = structuredClone($project);
    $stack.push(np);
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

//NOTE use with on:scroll
//   setInterval(function () {   
//   }, 4000);
//let scrollval = 0;
//async function slideXt(e){
//   if(scrollval < e.target.scrollLeft){
//     scrollDelta.set({
//       x: scrollval,
//       y: 0,
//     });    
//   } else {
//     scrollDelta.set({
//       x: -scrollval-scrollval,
//       y: 0,
//     });
//   }
//   scrollval = e.target.scrollLeft;  
// //   const val = -+(e.target.value);  
//     await tick();

//     scrollDelta.set({ x: 0, y: 0 });
  
//}
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
    // switch (e.detail) {
    //   case "timeline.track.delete":
    //     deleteSelectedTracks();
    //     break;
    // }
  }}
  use:drag={{ button: 1, offset: scrollDelta, invert: true, relative: true }}
  on:wheel={async (e) => {
    //e.preventDefault();
    scrollDelta.set({
      x: e.deltaX,
      y: e.deltaY,
    });

    await tick();

    scrollDelta.set({ x: 0, y: 0 });
  }}
>
  <SplitPane
    direction="row"
    min={150}
    snaps={[150, 200, 250]}
    bind:splitpos={$ui.trackHeadsWidth}
  >
    <VStack spacing={0}>
      <NewTrackHead on:newtrack={handleNewTrack} />
      <VStack spacing={2}>
        {#each $project.tracks as track, i (track)}
          <TrackHead
            bind:track
            on:solo={handleSolo}
            on:pointerdown={(e) => handleTrackClick(e, track, i)}
            selected={track.selected}
          />
          <SplitBar
            bind:position={track.height}
            snaps={[1, 2, 3, 4].map((x) => 64 * x)}
            min={84}
          />
        {/each}
      </VStack>
      <FlexSpace />
    </VStack>
    <div class="content">
      {#if $ui.tracklistMode === TracklistMode.Timeline}
        <Timeline bind:this={timeline}/>
      {:else if $ui.tracklistMode === TracklistMode.Graph}
        <Graph bind:this={graph} />
      {/if}
    </div>
  </SplitPane>
</div>

<style lang="scss">
  // :global(.timeline) {
  //   width: 400vh;
  // }
  .tracklist {
    display: grid;
    overflow: hidden;
    // overflow-y: scroll;

    .content {
      flex-grow: 1;
      display: grid;
      // overflow-x: scroll;

    }
  }
</style>
