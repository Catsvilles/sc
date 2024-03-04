<script lang="ts">
  import { ui } from "@app/stores/settings";
  import Pane from "@components/Pane.svelte";
  import SplitPane from "@components/layout/SplitPane.svelte";
  import Toolbar from "@components/toolbar/Toolbar.svelte";
  import Tracklist from "@components/tracklist/Tracklist.svelte";
  import { AudioClip, AudioTrack } from "@api/audio";
  import { Project } from "@api/project";
  import { writable } from "svelte/store";
  import player from "@app/stores/player";
  import project from "@app/stores/project";
  import stack from "@app/stores/undoredo";
  import Button from "@components/control/Button.svelte";
  import { onDestroy } from 'svelte';
  import Browser from "@components/browser/Browser.svelte";
  import VimePlayer from "@components/vimeplayer/Player.svelte";
  import Draggable from "$lib/Draggable.svelte";
	import PreviewPlayer from "$lib/players/PreviewPlayer.svelte";
  import MixerLoader from "$lib/MixerLoader.svelte";
  import { get } from "svelte/store";
  import loader from "@app/stores/mixerloaderstore"

  let reset = {};
  let fixedPlayerPosition: boolean = true;
  let releasedSpacebar: boolean = true;

  $: timeToPush = false;

  export function shallowEqual<T extends Record<string, any>>(
    a: T = {} as T,
    b: T = {} as T,
    ignore: Set<string> = new Set()
  ): boolean {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    return (
      a === b ||
      (aKeys.length === bKeys.length &&
        aKeys.filter((k) => !ignore.has(k)).every((key) => a[key] === b[key]))
    );
  }


  function isPointerDown(e: PointerEvent) {
    if (e.buttons === 0) {
      timeToPush = true;
    } else {
      timeToPush = false;
    }
    
  }

  (async () => {
  const sampleName1 = "1.mp3";
  const sampleName2 = "2.mp3";
  const sampleName3 = "3.mp3";
  const sampleName4 = "4.mp3";
  const sampleName5 = "5.mp3";
  loader.set(true);

  const sample1 = await fetch(`/${sampleName1}`);
  const sample2 = await fetch(`/${sampleName2}`);
  const sample3 = await fetch(`/${sampleName3}`);
  const sample4 = await fetch(`/${sampleName4}`);
  const sample5 = await fetch(`/${sampleName5}`);

  const blob1 = await sample1.blob();
  const blob2 = await sample2.blob();
  const blob3 = await sample3.blob();
  const blob4 = await sample4.blob();
  const blob5 = await sample5.blob();

  const audioBuffer1 = await get(player).decodeBlob(blob1);
  const audioBuffer2 = await get(player).decodeBlob(blob2);
  const audioBuffer3 = await get(player).decodeBlob(blob3);
  const audioBuffer4 = await get(player).decodeBlob(blob4);
  const audioBuffer5 = await get(player).decodeBlob(blob5);

  project.update((project) => {   
    project.tempo = 120;
    const track = new AudioTrack();
    track.selected = true;
    project.tracks.push(track);
    project.tracks.push(new AudioTrack());
    project.tracks.push(new AudioTrack());
    project.tracks.push(new AudioTrack());
    project.tracks.push(new AudioTrack());
    project.tracks.push(new AudioTrack());
    project.tracks.push(new AudioTrack());
    project.tracks.push(new AudioTrack());
    project.tracks.push(new AudioTrack());


    project.tracks[0].clips.push(
      new AudioClip(sampleName5, blob5, 0, audioBuffer5.duration),
    );

    project.tracks[2].clips.push(
      new AudioClip(sampleName1, blob1, 0, audioBuffer1.duration, audioBuffer1.duration * 2),
    );

    project.tracks[2].clips[0].linearPoints = [
    {
        "time": 0.3806228373702422,
        "value": 0.32432432432432434
    },
    {
        "time": 1.5570934256055364,
        "value": 0.972972972972973
    },
    {
        "time": 2.975778546712803,
        "value": 1.0135135135135136
    },
    {
        "time": 4.290657439446367,
        "value": 1.2432432432432432
    }
];

project.tracks[2].clips[0].controlPoints = [
    [
        0,
        124
    ],
    [
        11,
        124
    ],
    [
        45,
        76
    ],
    [
        86,
        73
    ],
    [
        124,
        56
    ],
    [
        638,
        56
    ],
    [
        838,
        126
    ],
    [
        1038,
        126
    ],
    [
        1138,
        50
    ],
    [
        1638,
        50
    ]
];
project.tracks[2].clips[0].showFades = true;

project.tracks[4].clips.push(
      new AudioClip(sampleName1, blob3, audioBuffer3.duration, audioBuffer3.duration),
    );

    project.tracks[5].clips.push(
      new AudioClip(sampleName4, blob4, audioBuffer4.duration + 15, audioBuffer4.duration),
    );

    project.tracks[6].clips.push(
      new AudioClip(sampleName2, blob2, 5, audioBuffer2.duration),
    );

    const np = structuredClone(project);
    $stack.push(np);
    return project;
  });
 
  loader.set(false);
})();


  
  const paneSnaps = [200];

  onDestroy(() => {
		project.set(new Project())
	});
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key === " " && releasedSpacebar) {
      releasedSpacebar = false;
      e.preventDefault();
      $player.startCursor = $player.currentTime;
      if ($player.loop && !$player.playing) {
          $player = $player.start($project, $player.loopingPoints[0], $player.loopingPoints[1]);
      } else {
          $player = $player.toggle($project);
      }
    }
  }}
  on:keyup={(e) => {
    if (e.key === " ") {
      releasedSpacebar = true;
    }
  }}
/>

<div class="editor-wrapper bg-[#262626] p-1">
  <!-- <div class="relative m-0 p-1 flex flex-col gap-1 box-border w-full h-[100hv] justify-stretch bg-[#262626] text-white"> -->
  <MixerLoader />
  <PreviewPlayer />
  <Toolbar />  
  <Tracklist /> 
    <!-- <Browser /> -->
    <!-- <Pane /> -->
    <!-- <div class="absolute bottom-0 p-5 w-full bg-orange-900">
    </div> -->
</div>

<Draggable>
  {#key reset}
    <div class="{fixedPlayerPosition ? 'fixed z-40 lg:right-14 right-0 lg:bottom-0 bottom-14': 'cursor-move'}">
      <VimePlayer reloadPlayer={()=>{ reset = {}}}  movePlayer={()=>{ fixedPlayerPosition = !fixedPlayerPosition }} />
    </div>
  {/key}
</Draggable>

<style lang="scss">
  .editor-wrapper {
    position: relative;
    margin: 0;
    // padding: 4px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    // gap: 4px;
    width: 100%;
    height: 100vh;
    // background: var(--color-background-0);
    // color: var(--color-foreground-0);
    justify-content: stretch;

    // & > :global(*) {
    //   flex-grow: 1;
    // }
  }
</style>
