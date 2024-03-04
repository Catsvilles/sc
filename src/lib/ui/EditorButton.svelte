<script lang="ts">
  import CircleButton from './CircleButton.svelte';
  import { onMount } from 'svelte';
  import { editor } from './../../stores/player';
  import loader from "@app/stores/mixerloaderstore"
  import project from "@app/stores/project";
  import player from "@app/stores/player";
  import Icon from "@components/Icon.svelte";
  import { AudioClip, AudioTrack } from "@api/audio";
  export let item;
  onMount(async () => {
    if (localStorage.getItem('soundgrapeEditor')) {
        editor.set(JSON.parse(localStorage.getItem('soundgrapeEditor')));
    }
  });
  // export let buttonProps = {};

  // $: isInEditor = !!$editor.find(t => t.id === item.id);

  const addToEditor = async () => {
    // if (isInEditor) {
    //   return;
    // }

    //Animate side-button
    // const x = document.getElementsByClassName("side-btn");
    // x[0].style.margin = "10px";
    // setTimeout(function(){
    //   x[0].style.margin = "0px";
    // }, 200);

    const res = await fetch(item.url, {
          method: "GET",
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin':'*'
          }
      });
      
    loader.set(true);
    const blob = await res.blob();
    const buffer = await $player.decodeBlob(blob);
    const clip = new AudioClip(item.title, blob, 0, buffer.duration);
    loader.set(false);

    project.update((project) => {   
      project.tracks.push(new AudioTrack());
      project.tracks[project.tracks.length - 1].clips.push(
      clip
    );
      return project;
    });

    $editor = [ ...$editor, item];
  };

  // const removeFromEditor = () => {
  //   for (const track of $project.tracks) {
  //     const bla = track.clips.filter(function (clip) {
  //     return clip.name !== item.title;
  //   });

  //   console.log(bla);
    
  //     track.clips = track.clips.filter((clip) => !selectedClips.has(clip));
  //   }
    
  //   //selectedClips.clear();
  //   selectedClips = selectedClips;
  //   console.log(selectedClips);
    
  // };

  const setCurrentData = () => { // TODO: tests
    if (!$editor.length) {
      localStorage.removeItem('soundgrapeEditor');
      return;
    }
    localStorage.setItem('soundgrapeEditor', JSON.stringify($editor));
  };
</script>
<!-- {#if isInEditor}
<div on:pointerdown={removeFromEditor} title="Remove From Editor" class="flex items-center justify-center cursor-pointer p-1 bg-[#333333] border border-transparent hover:border-gray-500 rounded-full transform transition hover:scale-110 duration-300">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="#e5e7eb" viewBox="0 0 24 24" stroke="black">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
</div>
{:else} -->
<div on:pointerdown={addToEditor} title="Add to Editor" class="flex items-center justify-center transform transition hover:scale-110 duration-300 cursor-pointer">
  <Icon
    name="edit/plus_circle_outline"
    size="1.5em"
    color="gray"
  />
</div>
<!-- {/if} -->
<!-- <svelte:window on:beforeunload={setCurrentData}/> -->