<script lang="ts">
  import Toolbar from "$lib/editor/components/toolbar/Toolbar.svelte";
  import Tracklist from "$lib/editor/components/tracklist/Tracklist.svelte";
  import { AudioClip, AudioTrack } from "$lib/editor/api/audio";
  import { Project } from "$lib/editor/api/project";
  import player from "$lib/editor/stores/player";
  import project from "$lib/editor/stores/project";
  import Effects from "$lib/editor/Effects.svelte";

  import { onDestroy } from 'svelte';

  let releasedSpacebar: boolean = true;

  async function sampleToBlob(sampleName : string) {
    const sample = await fetch(`audio/${sampleName}`);
    const blob = await sample.blob();
    return blob;
  }


  (async () => {
    const sample1 = "Bass.mp3"
    const blob1 = await sampleToBlob(sample1);
    const audioBuffer1 = await $player.decodeBlob(blob1);
    const sample2 = "FX.mp3"
    const blob2 = await sampleToBlob(sample2);
    const audioBuffer2 = await $player.decodeBlob(blob2);
    const sample3 = "Kick.mp3"
    const blob3 = await sampleToBlob(sample3);
    const audioBuffer3 = await $player.decodeBlob(blob3);
    const sample4 = "Top Loop.mp3"
    const blob4 = await sampleToBlob(sample4);
    const audioBuffer4 = await $player.decodeBlob(blob4);

    project.update((project) => {   
      project.tempo = 125;
      const track = new AudioTrack();
      track.selected = true;
      project.tracks.push(track);
      project.tracks.push(new AudioTrack());
      project.tracks.push(new AudioTrack());
      project.tracks.push(new AudioTrack());

      project.tracks[0].name = sample1;
      project.tracks[0].clips.push(
        new AudioClip(sample1, blob1, 0, audioBuffer1.duration),
      );

      project.tracks[1].name = sample2;
      project.tracks[1].clips.push(
        new AudioClip(sample2, blob2, 0, audioBuffer2.duration),
      );

      project.tracks[2].name = sample3;
      project.tracks[2].clips.push(
        new AudioClip(sample3, blob3, 0, audioBuffer3.duration),
      );

      project.tracks[3].name = sample4;
      project.tracks[3 ].clips.push(
        new AudioClip(sample4, blob4, 0, audioBuffer4.duration),
      );
      return project;
    });
  })();
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
      $player = $player.toggle($project);
    }
  }}
  on:keyup={(e) => {
    if (e.key === " ") {
      releasedSpacebar = true;
    }
  }}
/>

<div class="relative flex flex-col gap-1 w-full h-screen justify-stretch second-bg-color m-0 p-2">
  <Toolbar />
  <Tracklist />
  <div class="h-96">
    <Effects />
  </div>
</div>

