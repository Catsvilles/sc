<script lang="ts">
  import type { Source } from "$lib/editor/api/graph";
  import type { Clip, Track } from "$lib/editor/api/timeline";
  import type { Point } from "$lib/editor/utils/geom";
  import type { Player } from "$lib/editor/api/player";
  import { Canvas, Layer, type Render } from 'svelte-canvas';

  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import project from "$lib/editor/stores/project";
  import player from "$lib/editor/stores/player";
  import commands from "$lib/editor/components/actions/commands";
  import VStack from "$lib/editor/components/layout/VStack.svelte";
  import TimelineTrack from "./Track.svelte";

  interface MovedClip<C extends Clip> {
    clip: C;
    start: number;
    track: Track<Source<Player>>;
  }

  let selectedClips: Set<Clip> = new Set();
  let cursorPos = 0;
  let isOverClip = false;
  let timelineWidth = 300;
  let viewRegion: [number, number] = [0, 20];
  let secWidth: number;
  let snap: number;
  let movedClip: MovedClip<Clip> = null;
  let pointerStart: Point;
  let animatedViewRegion = tweened(viewRegion, {
    duration: 100,
    easing: cubicOut,
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

  // $: secWidth =
  //   (timelineWidth / ($animatedViewRegion[1] - $animatedViewRegion[0])) * $project.timeToBeats(2);

  $: secWidth =
    timelineWidth / ($animatedViewRegion[1] - $animatedViewRegion[0]);

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

  function getMaxTime() {
    let finalDur: number;
    const durations = [];
    for (const track of $project.tracks) {
      for (let i = 0; i < track.clips.length; i++) {
        const clip = track.clips[i];
        const start = clip.extentPast + clip.start;
        const end = start + clip.extent - clip.extentPast;
        durations.push(end)
      }
    }
    finalDur = Math.max(...durations);
    return finalDur;
  }

  $: if ($player.playing) {
    const update = () => {
      if ($player.playing) {
        cursorPos = ($player.currentTime - $animatedViewRegion[0]) * secWidth;        
        //Play only until the last clip and then start from 0
        if ($player.currentTime > getMaxTime()) {
          $player.stop();
          $player.start($project, 0);          
        }
           
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

  function handleGlobalKeyDown(this: HTMLElement, e: KeyboardEvent) {
    if (e.key === "Alt") {
      e.preventDefault();
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

      $player.startCursor = aimedTime;      
      if ($player.playing) {
        $player.stop();
        $player.start($project, $player.startCursor, $player.endCursor);
      }
    }
  }

  function formatTime(time: number) {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(Math.floor(time % 60)).padStart(2, '0');

    return `${minutes}:${seconds}`;
  };

  function handleWheel(this: HTMLElement, e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();

      const rect = this.getBoundingClientRect();
      const wheelDelta = Math.sign(e.deltaY);
      const scaling = 1.0 + wheelDelta * 0.1;
      const aimedTime =
        $animatedViewRegion[0] + (e.clientX - rect.left) / secWidth;

      for (let i = 0; i < 2; i++) {
        const t = viewRegion[i];
        const d = t - aimedTime;

        viewRegion[i] = Math.max(0, aimedTime + d * scaling);
      }
    }
  }

  const configCanvas = {
    canvasFont: "10px Arial",
    //Scale
    canvasDpr: 1,
    canvasStrokeStyle: "lightgray",
    canvasFillStyle: "lightgray",
    canvasTexAlign: "center",
    canwasWidthCell: 2,
    //Same as style in canvas
    height: 48,
    x: 0,
    y: 0,
    //If you change this also chane offset minuteOffset 
    numberOfMarks: 120 * 8,
    minuteOffset: 8,
  };

  function drawDivisions(
    context: CanvasRenderingContext2D,
    width: number,
    divwidth: number,
    scroll: number,
    showTime: boolean
  ) {
    const xoffset = scroll % divwidth;
    context.beginPath();

    for (let i = 0; i * (snap * secWidth) - xoffset < width; i++) {
      context.moveTo(i * (snap * secWidth) - xoffset, 0);
      context.lineTo(i * (snap * secWidth) - xoffset, 10);
    }
   
    for (let i = 0; i * divwidth - xoffset < timelineWidth; i++) {      
      const bars = i + Math.floor(scroll / divwidth);
      context.moveTo(i * divwidth - xoffset, 0);
      context.lineTo(i * divwidth - xoffset, 20 + configCanvas.y);
      if (showTime) {
        context.fillText(`${formatTime(Math.floor($project.barsToTime(bars)))}`, i * divwidth - xoffset, 20 + 15 + configCanvas.y, 60)
      } else {
        context.fillText(`${Math.floor(bars + 1)}`, i * divwidth - xoffset, 20 + 15 + configCanvas.y, 60)
      }
    }
  }
let renderTime: Render;
$: renderTime = ({ context, width, height }) => {
  
      // redraw when any of these change
    // $project.tempo;
    // $project.signature;
    // $player.isRecording;
    // viewRegion;
    // secWidth;

    context.save();
      {
        context.strokeStyle = configCanvas.canvasStrokeStyle;
        context.fillStyle = configCanvas.canvasFillStyle;

        drawDivisions(
          context,
          timelineWidth,
          $project.barsToTime(1) * secWidth,
          viewRegion[0] * secWidth,
          true
        );
        context.stroke();
      }
      context.restore();
  };

  let renderBars: Render;
$: renderBars = ({ context, width, height }) => {
  
      // redraw when any of these change
    // $project.tempo;
    // $project.signature;
    // $player.isRecording;
    // viewRegion;
    // secWidth;

    context.save();
      {
        context.strokeStyle = configCanvas.canvasStrokeStyle;
        context.fillStyle = configCanvas.canvasFillStyle;

        drawDivisions(
          context,
          timelineWidth,
          $project.barsToTime(1) * secWidth,
          viewRegion[0] * secWidth,
          false
        );
        context.stroke();
      }
      context.restore();
  };
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
    //Resetting the playback
    if ($player.playing) {
      const startFrom = $player.currentTime;
      $player.stop();
      $player.start($project, startFrom);
    }
  }}
/>
<div
  class="timeline"
  use:initTimelineWidth
  on:wheel={handleWheel}
  bind:clientWidth={timelineWidth}
  on:pointerdown={placeCursor}
  use:commands={(e) => {
    switch (e.detail) {
      case "timeline.clip.delete":      
        for (const track of $project.tracks) {
          track.clips = track.clips.filter((clip) => !selectedClips.has(clip));
        }
        selectedClips.clear();
        selectedClips = selectedClips;
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
>
<div class="timeline_canvas-wrap">
  <Canvas width={timelineWidth} height={configCanvas.height}>
    <Layer render={renderBars} />
  </Canvas>
</div>
  <VStack spacing={2}>
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
  <div class="cursor" style={`--x: ${cursorPos}px`} >
    <svg clip-rule="evenodd" class="absolute -mt-[12px] -ml-[14px] w-[29px] h-[29px]" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ecec0b">
      <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
    </svg>
  </div>
  <div class="timeline_canvas-wrap">
    <Canvas width={timelineWidth} height={configCanvas.height}>
      <Layer render={renderTime} />
    </Canvas>
  </div>
</div>
<style lang="scss">
.timeline_canvas-wrap {
  width: fit-content;
	overflow: hidden;
  position: relative;
}

.vc-timeline_canvas {
	width: 100%;
}
  .timeline {
    position: relative;
    overflow: hidden;
    .cursor {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 1px;
      background: #ecec0b;
      transform: translateX(var(--x));
    }
  }
</style>
