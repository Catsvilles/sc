<script lang="ts">
  import type { Source } from "@api/graph";
  import type { Clip, Track } from "@api/timeline";
  import type { Point } from "@app/utils/geom";
  import type { Player } from "@api/player";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import project from "@app/stores/project";
  import player from "@app/stores/player";
  import commands from "@components/actions/commands";
  import VStack from "@components/layout/VStack.svelte";
  import TimelineTrack from "./Track.svelte";
  import stack from "@app/stores/undoredo";  
  import TimelineLanes from "./TimelineLanes.svelte";
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';


  interface MovedClip<C extends Clip> {
    clip: C;
    start: number;
    track: Track<Source<Player>>;
  }

  let selectedClips: Set<Clip> = new Set();
  let cursorPos = 0;
  let isOverClip = false;
  let timelineWidth = 300;
  let viewRegion: [number, number] = [0, 60];
  let secWidth: number;
  let snap: number;
  let movedClip: MovedClip<Clip> = null;
  let pointerStart: Point;
  let timelineElement: HTMLElement;
  let animatedViewRegion = tweened(viewRegion, {
    duration: 100,
    easing: cubicOut,
  });

  const divWidth = writable(0);

  onMount(() => {
    // Update the store with the initial clientWidth
    divWidth.set(timelineElement.clientWidth);

    // Listen for resize events and update the store
    const resizeHandler = () => {
      divWidth.set(timelineElement.clientWidth);
    };

    window.addEventListener('resize', resizeHandler);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  });


  export function scrollBy(xdelta: number) {
    const span = viewRegion[1] - viewRegion[0];

    viewRegion[0] = Math.max(0, viewRegion[0] + xdelta / secWidth);
    viewRegion[1] = viewRegion[0] + span;
  }

  export function selectAllClips(track: Track<any>) {
    for (const clip of track.clips) {
      selectedClips.add(clip);
    }

    selectedClips = selectedClips;
  }

  export function deselectAllClips(track?: Track<any>) {
    if (track) {
      for (const clip of track.clips) {
        selectedClips.delete(clip);
      }
    } else {
      selectedClips.clear();
    }

    selectedClips = selectedClips;
  }

  $: animatedViewRegion.set([viewRegion[0], viewRegion[1]]);

  $: secWidth =
    (timelineWidth / ($animatedViewRegion[1] - $animatedViewRegion[0])) * $project.timeToBeats(1);

  $: {
    // snap is 1 bar by default
    snap = $project.barsToTime(1);

    for (let i = 0; i < 8 && (snap / 2) * secWidth >= 15; i++) {
      snap /= 2;
    }

    if ((snap / 2) * secWidth >= 20) {
      snap = $project.quantum;
    }
  }

  //$: animatedTime = 0;
  $: if ($player.playing) {
    const update = () => {
      if ($player.playing) {
        if ($player.loop && $player.currentTime >= $player.loopingPoints[1]) {
          $player.stop();
          $player.start($project, $player.loopingPoints[0], $player.loopingPoints[1]);
        }

        //animatedTime = $player.currentTime;
        cursorPos = ($player.currentTime - $animatedViewRegion[0]) * secWidth;
        
        requestAnimationFrame(update);
      }
    };

    update(); 
  } else {
    cursorPos = ($player.startCursor - $animatedViewRegion[0]) * secWidth;
  }

  function initTimelineWidth(node: HTMLElement) {
    timelineWidth = node.getBoundingClientRect().width;
  }

  function handleWheel(this: HTMLElement, e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();

      const rect = this.getBoundingClientRect();
      const wheelDelta = Math.sign(e.deltaY);

      const scalingFactor = 1.0 + wheelDelta * 0.1;

      // Define scaling limits
      const minScalingFactor = 0.5;
      const maxScalingFactor = 8.0;

      const aimedTime = $animatedViewRegion[0] + (e.clientX - rect.left) / secWidth;

      for (let i = 0; i < 2; i++) {
        const t = viewRegion[i];
        const d = t - aimedTime;

        // Apply scaling only if within limits
        const scaledTime = aimedTime + d * Math.min(scalingFactor, maxScalingFactor);
        viewRegion[i] = Math.max(0, Math.min(scaledTime, secWidth));
      }
    }    
  }

  function scale(e: InputEvent) {
    const inputValue = parseFloat((e.target as HTMLInputElement).value);
    viewRegion[0] = Math.max(0, viewRegion[0] + 40 / secWidth);
    viewRegion[1] = viewRegion[0] + inputValue;
  }

  function resetScale(e: InputEvent) {
    e.preventDefault();
    e.target.value = 60;
    viewRegion[0] = 0;
    viewRegion[1] = 60;    
  }

  function handleGlobalKeyDown(this: HTMLElement, e: KeyboardEvent) {
    if (e.key === "Alt") {
      e.preventDefault();
      document.body.style.cursor = "url('icons/slicer.svg'), auto";      
    }
  }

  function handleGlobalKeyUp(this: HTMLElement, e: KeyboardEvent) {
    if (e.key === "Alt") {
      e.preventDefault();
      document.body.style.cursor = 'default';   
    }
  }

  function placeCursor(this: HTMLElement, e: PointerEvent) {   
    if(selectedClips.size === 0){
      isOverClip = false;
    }
    
    if (!isOverClip) {
      const rect = this.getBoundingClientRect();
      const aimedTime =
          $animatedViewRegion[0] + (e.clientX - rect.left) / secWidth;
      
      if ($player.loop) {
        //Allowing scrolling only inside the loop points
        if (aimedTime > $player.loopingPoints[0] && aimedTime < $player.loopingPoints[1]) {
          $player.startCursor = aimedTime;
        } else {
          $player.startCursor = $player.loopingPoints[0];
        }
      } else {
        $player.startCursor = aimedTime;
      }

      if ($player.playing) {
        $player.stop();
        $player.start($project, $player.startCursor, $player.endCursor);
      }
    }
  }`ww`
</script>

<svelte:window
  on:keydown={handleGlobalKeyDown}
  on:keyup={handleGlobalKeyUp}
  on:pointerdown|capture={(e) => {
    if (e.button === 0 && !e.shiftKey && !e.ctrlKey) {
      selectedClips.clear();
      selectedClips = selectedClips;
    }
  }}
  on:pointerup={(e) => {
    if (e.button !== 0) {
      return;
    }

    movedClip = null;
  }}
/>
<div class="flex flex-row-reverse items-center bg-[#333333] absolute top-5 right-20" on:contextmenu={resetScale}>
  <div class="flex items-center w-48 text-white">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
    </svg>&nbsp;
    <input
    type="range"
    on:change={scale}
    min="0.1"
    max="120"
    step="0.01"
    value="60"
    class="transparent h-[4px] w-64 cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
    id="customRange1" />
    &nbsp;<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>    
  </div>
</div>
<div
  class="timeline"
  use:initTimelineWidth
  bind:this={timelineElement}
  bind:clientWidth={timelineWidth}
  on:pointerdown={placeCursor}
  use:commands={(e) => {
    switch (e.detail) {
      case "timeline.track.delete":    
        if (selectedClips.size < 1) {
          $project.tracks = $project.tracks.filter(
            (track) => !track.selected
          );
          $project.tracks[0].selected = true;
          const np = structuredClone($project);
          $stack.push(np);
        }        
        break;
      case "timeline.clip.delete":      
        for (const track of $project.tracks) {
          track.clips = track.clips.filter((clip) => !selectedClips.has(clip));
        }
        //selectedClips.clear();
        selectedClips = selectedClips;
        const np = structuredClone($project);
        $stack.push(np);
        break;
      case "timeline.clip.duplicate":
        for (const track of $project.tracks) {
          const duplicatedClips = track.clips.filter((clip) =>
            selectedClips.has(clip)
          );

          for (const clip of duplicatedClips) {
            // create a clone and leave it here
            track.clips.push(clip.duplicate());

            // move the selected clip forward
            clip.start += clip.totalExtent;
          }
        }

        selectedClips = selectedClips;
        const npd = structuredClone($project);
        $stack.push(npd);
        break;
    }
  }}
  on:pointerdown|capture={(e) => {   
    if (e.button === 0) {
      pointerStart = { x: e.clientX, y: e.clientY };
    }
  }}
  on:pointermove={(e) => {
    if (movedClip) {
      const delta = e.clientX - pointerStart.x;
      let start = movedClip.start + delta / secWidth;
      

      if (!e.altKey) {
        start = Math.round(start / snap) * snap;
      }

      start = Math.max(-movedClip.clip.extentPast, start);
      movedClip.clip.start = start;
      $project.tracks = $project.tracks;     
    }
  }}
  on:pointerup={(e) => {   
    if (movedClip) {     
      const np = structuredClone($project);
      $stack.push(np);
    }
  }}
>
<TimelineLanes {animatedViewRegion} {secWidth} {divWidth} />
 <VStack spacing={4}>
    {#each $project.tracks as track}
      <TimelineTrack
        bind:track
        viewRegion={$animatedViewRegion}
        {secWidth}
        {snap}
        {selectedClips}
        on:pointerenter={() => {
          isOverClip = false;          
          if (movedClip && track.mod.canPlay(movedClip.clip)) {
            movedClip.track.clips = movedClip.track.clips.filter(
              (clip) => clip !== movedClip.clip
            );
            track.clips = [...track.clips, movedClip.clip];           
            movedClip.track = track;         
          }
        }}
        on:pointerdownclip={(e) => {        
          isOverClip = true;
          
          if (e.detail.e.button !== 0) {
            return;
          }

          selectedClips = selectedClips.add(e.detail.clip);
          movedClip = {
              clip: e.detail.clip,
              start: e.detail.clip.start,
              track,
            };
        }}
      />
    {/each}
  </VStack>
  <div class="cursor" style={`--x: ${cursorPos}px`} />
  <!-- {$player.currentTime}
  {$project.timeToBars($player.currentTime)} -->
  <!-- {convertMinsToHrsMins(Math.round(animatedTime))}
  {convertMinsToHrsMins(Math.round(animatedTime))} -->


</div>
<style lang="scss">
  input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: #f97316;
  cursor: ew-resize;
  box-shadow: 0 0 2px 0 #555;
  transition: background .3s ease-in-out;
}
input[type='range']::-moz-focus-outer { border: 0; }

.timeline {
  position: relative;
  // width: 200vh;
  overflow: hidden;

  .cursor {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 1px;

    background: var(--color-accent);

    opacity: 0.5;

    transform: translateX(var(--x));
  }
}
</style>
