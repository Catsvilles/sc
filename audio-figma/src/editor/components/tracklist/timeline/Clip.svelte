<script lang="ts">
  import type { Clip, Track } from "@api/timeline";
  import { AudioClip } from "@api/audio";
  import AudioWaveform from "./AudioWaveform.svelte";
  import MicWaveform from "./MicWaveform.svelte";
  import project from "@app/stores/project";
  import player from "@app/stores/player";
  import stack from "@app/stores/undoredo";
  import Lanes from "./../graph/Lanes.svelte";

  export let clip: Clip;
  export let selected: boolean = false;
  export let viewRegion: [number, number];
  export let snap: number;
  export let secWidth: number;
  export let recordingStream : MediaStream;
  export let color = "#f97316";
  export let currentTrack : Track<any>;

  let showFades : boolean = clip.showFades;
  enum ResizeSide {
    Start = "start",
    End = "end",
  }

  let visibleRange: [number, number];
  $: visibleRange = [
    Math.max(viewRegion[0] - clip.start - clip.extentPast, 0) + clip.extentPast,
    clip.extent + Math.min(viewRegion[1] - clip.start - clip.extent, 0),
  ];

  function resizer(node: HTMLElement, side: ResizeSide) {   
    function handlePointerDown(this: HTMLElement, e: PointerEvent) {
      if (showFades) {
        return;
      }

      if (e.button !== 0) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      const start = {
        x: e.clientX,
        timePoint: side === ResizeSide.Start ? clip.extentPast : clip.extent,
        extent: clip.extent,
      };

      const pointermove = (e: PointerEvent) => {
        const dt = (e.clientX - start.x) / secWidth;
        let t = start.timePoint + dt;

        if (!e.altKey) {
          t = Math.round(t / snap) * snap;
        }

        if (side === ResizeSide.Start) {
          clip.extentPast = Math.max(
            Math.min(t, clip.extent - $project.quantum),
            -clip.start
          );
        } else {
          clip.extent = Math.max(t, clip.extentPast + $project.quantum);
        }
      };

      const pointerup = (e: PointerEvent) => {
        this.removeEventListener("pointermove", pointermove);
        this.removeEventListener("pointerup", pointerup);
        this.releasePointerCapture(e.pointerId);       
      };
      this.addEventListener("pointermove", pointermove);
      this.addEventListener("pointerup", pointerup);
      this.setPointerCapture(e.pointerId);
      const np = window.structuredClone($project);
      $stack.push(np);
    }

    node.addEventListener("pointerdown", handlePointerDown);

    return {
      update(newSide: ResizeSide) {
        side = newSide;
      },

      destroy() {
        node.removeEventListener("pointerdown", handlePointerDown);
      },
    };
  }

  function slice(this: HTMLElement, e: MouseEvent) {    
    if(e.altKey && !showFades) {
      let selectedClips: Set<Clip> = new Set();
      selectedClips = selectedClips.add(clip);
      const rect = this.getBoundingClientRect();
      const aimedTime =
          (e.clientX - rect.left) / secWidth;

      //NOTE quick fix for clearing the points to avoid unwanted behaviors and bugs
      //TODO dynamically redraw instead
      clearLanes();

      const clipLeft = clip.duplicate();
      clipLeft.extent = aimedTime + clip.extentPast;
      const clipRight = clip.duplicate();
      clipRight.extentPast = aimedTime + clip.extentPast;

      project.update((project) => {                      
      currentTrack.clips.push(clipRight);            
      currentTrack.clips.push(clipLeft); 
                 
      //Delete Clip     
      currentTrack.clips = currentTrack.clips.filter((clip) => !selectedClips.has(clip));
      const np = structuredClone(project);
      $stack.push(np);
      return project;
      });

      selectedClips.clear();
      selectedClips = selectedClips;              
    }     
  }

  $: w = Math.round(Math.max(clip.totalExtent * secWidth, 1))
  let h : number = 148;
  function stopEvent(ev : PointerEvent) {
        //NOTE we are forcing the Track always to be 164px in case user will decide to drag it change the height
        if (showFades) {
            ev.stopImmediatePropagation();
        }
    }
    if (showFades) {
        currentTrack.height = 164;
      }
  function toggleFades() {   
      showFades = showFades !== true;

      const unsubscribe = project.subscribe((value) => {
        // Don't allow changing the track height while we show fades
        if (showFades) {
          currentTrack.height = 164;
        }
      });

      if (showFades) {
        currentTrack.height = 164;
      } else {        
        unsubscribe();
        currentTrack.height = 84;
      }

      //NOTE forcing to update the frontend with new height
      project.update((project) => {
        console.log(clip.linearPoints);
        
        project.tempo = $project.tempo;
        return project;
      });      
  }

  function clearLanes() {
      clip.controlPoints = [];
      clip.linearPoints = [];
  }
</script>
<div
  on:pointerdown={stopEvent}
  on:pointerdown
  on:click={slice}
  class="clip"
  class:selected
  style={`
    --clip-color: ${color};
    transform: translateX(${Math.round(
      (clip.start + clip.extentPast) * secWidth
    )}px);
  `}
>
 <div class="resize-handle" use:resizer={ResizeSide.Start} />
  <div
    class="content"
    style={`width: ${Math.round(Math.max(clip.totalExtent * secWidth, 1))}px`}
  >
    <header class="flex">
      <button class="z-20 text-xs mr-1" on:click={toggleFades}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>      
      </button>
      {#if showFades}
      <button class="z-20 text-xs inline-flex my-auto" title="Clear and Reset" on:click={clearLanes}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
        </svg>       
      </button>
      {/if}
    </header>
    {#if showFades}
    <div class="flex z-50 w-full absolute top-4" style="width: {w}px;height: {h}px;background-color: rgba(0, 0, 0, 0.5)">
      <Lanes secWidth={secWidth} width={w} height={h} {clip} linePoints={clip.controlPoints} controlPoints={clip.controlPoints} />
    </div>
    {/if}
    <div
      class="data"
      style={`
        transform: translateX(${-clip.extentPast * secWidth}px);
        width: ${clip.length * secWidth}px;
      `}
    >
    {#if clip instanceof AudioClip}
    <AudioWaveform blob={clip.blob} {visibleRange} />
    {/if}
    {#if $player.isRecording}
      <MicWaveform stream={recordingStream} />
    {/if}
    </div>
  </div>
  <div class="resize-handle" use:resizer={ResizeSide.End} />
</div>

<style lang="scss">
  .clip {
    display: flex;

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    color: var(--color-foreground-0);

    --header-background-opacity: 0.6;
    --header-background-color: var(--clip-color);
    --header-foreground-color: var(--color-foreground-0);
    --background-opacity: 0.05;
    --background-tint: 0;

    &.selected {
      --background-tint: 0.15;
      --header-background-opacity: 0.8;
    }

    &::before {
      content: "";

      display: inline-block;
      border-radius: var(--corner-radius);

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-color: var(--color-accent);
      opacity: var(--background-tint);

      transition: opacity var(--anim-short);
    }

    .content {
      display: flex;
      flex-direction: column;

      border-radius: var(--corner-radius);
      overflow: hidden;

      position: relative;

      header {
        flex-shrink: 0;

        position: relative;
        color: var(--header-foreground-color);

        &::before {
          content: "";

          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          background: var(--header-background-color);
          opacity: var(--header-background-opacity);

          transition: opacity var(--anim-short);
        }

        h3 {
          position: sticky;
          font-size: 11px;
          padding: 2px 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      &::before {
        content: "";

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        border-radius: inherit;
        background: var(--color-foreground-0);
        opacity: var(--background-opacity);

        transition: opacity var(--anim-short);
      }

      .data {
        flex-shrink: 0;
        flex-grow: 1;
      }
    }

    .resize-handle {
      flex-basis: 0;

      position: relative;
      width: 0px;

      cursor: ew-resize;

      &::after {
        content: "";

        position: absolute;
        top: 0;
        left: -4px;
        bottom: 0;
        width: 8px;

        z-index: 1;
      }
    }
  }
</style>
