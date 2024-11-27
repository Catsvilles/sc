<script lang="ts">
  import { WEQ8Runtime } from '$lib/editor/weq8/src/runtime'; // or from "https://cdn.skypack.dev/weq8"
  import '$lib/editor/weq8/src/ui'; // or "https://cdn.skypack.dev/weq8/ui"
  import player from "$lib/editor/stores/player";
  import eqState from "$lib/editor/stores/eq";
  import { onMount } from 'svelte';

  let weq8 = new WEQ8Runtime($player.context);
  $player.masterGain.connect(weq8.input);
  let showEQ = true;
  let eqIsOn = false;

  onMount(async () => {
    document.querySelector("weq8-ui").runtime = weq8;
    weq8.setFilterType(0, "lowshelf24");
    weq8.setFilterType(1, "peaking24");
    weq8.setFilterType(2, "peaking24");
    weq8.setFilterType(3, "peaking24");
    weq8.setFilterType(4, "peaking24");
    weq8.setFilterType(5, "peaking24");
    weq8.setFilterType(6, "highshelf24");
    eqState.set(weq8.spec);

    weq8.on("filtersChanged", (state) => {      
      eqState.set(state);
    });
});

function toggleEq() {
  eqIsOn = !eqIsOn
  if (eqIsOn) {
    weq8.connect($player.context.destination);
  } else {
    weq8.disconnect($player.context.destination);
  }
}
</script>

<div class="w-full h-full">
  <div class="w-full h-full rounded-md overflow-hidden">
    <div class="flex flex-col w-full h-full third-bg-color rounded-md">
      <div class="flex items-center justify-center w-full first-bg-color">
        <div class="flex items-center justify-center second-bg-color cursor-pointer p-1.5" on:click={toggleEq}>
          {#if eqIsOn}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-[#ecec0b]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 stroke-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
            </svg>
         {/if}      
        </div>
        <div class="flex items-center justify-center second-bg-color cursor-pointer p-1" on:click={() => {showEQ = !showEQ}}>
          <span class="uppercase text-lg text-color text-center">EQ</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 stroke-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>   
      </div>
      <div class:invisible={!showEQ} class:pointer-events-none={!showEQ} class="flex w-full h-full first-bg-color">
        <weq8-ui />
      </div>
    </div>
  </div>
</div>