<script lang="ts">
  import { lazyload } from './../actions/lazyload';
  // import Carousel from '@beyonk/svelte-carousel';
  import PlayButton from '$lib/players/PlayButton.svelte';

  export let offers = [],
    title = '';
</script>
<div class="relative px-2 pt-2 mx-0 rounded lg:pt-5 lg:mx-5 lg:px-5">
  <h3 class="mb-5 uppercase text-center text-2xl font-bold text-gray-600">{title}</h3>
    {#if offers && offers.length}

        {#each offers as track}
        <div class="h-60 mr-4 slide-content relative py-12">
          <div class="absolute z-20 inset-0 w-full h-full bg-[#333333] opacity-50"></div>
          <div class="z-20 relative text-center text-white container mx-auto">
            <p class="uppercase text-2xl mb-2 md:truncate">
              <a class="px-4 py-2"
               rel=prefetch href="/track/{track.data.slug}">{track.data.title}</a>
            </p>
            <div class="flex justify-center items-center">
              <PlayButton
                widthHeight={68}
                fontSize={22}
                track={track} />
            </div>
          </div>
          <div class="h-60 w-full absolute top-0">
            <img
             use:lazyload
             src="images/covers/{track.data.category.slug}/{track.data.img.title}"
             data-src="images/covers/{track.data.category.slug}/{track.data.img.title}"
             alt="Royalty-free {track.data.title} music" title="Royalty-free {track.data.title} music"
             class="absolute top-1/2 left-1/2	w-auto h-auto min-h-full min-w-full transform -translate-x-2/4	-translate-y-2/4">
          </div>
        </div>
        {/each}

    {/if}
</div>
