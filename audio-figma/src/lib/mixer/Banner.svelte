<script lang="ts">
export let title : string;
export let desc : string = '';
</script>
<!-- <div class="w-full px-2 flex items-center justify-center">
  <figure class="relative w-full">
  <div class="absolute z-20 inset-0 w-full h-full bg-[#333333] bg-opacity-75 rounded"></div>
    <div class="relative overflow-hidden pb-2/3">
      <img
      class="shadow-xl h-40 w-full object-cover object-center"
      use:lazyload
      data-src={img}
      src={img}
      alt="{title}">
    </div>
    <figcaption class="z-20 text-lg text-center absolute inset-0 text-white px-4">
      <h1 class="text-2xl uppercase font-bold font">{title}</h1>
      {#if desc}
      <h2 class="text-sm">{desc}</h2>
      {/if}
      </figcaption>
  </figure>
</div> -->

<div class="flex flex-col items-center justify-center text-center p-2 text-white">
  <h3 class="text-2xl uppercase font-bold font">{title}</h3>
  {#if desc}
  <h2 class="text-sm">{desc}</h2>
  {/if}
</div>