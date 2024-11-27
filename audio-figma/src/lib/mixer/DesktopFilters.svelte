<script lang="ts">
  import Checkbox from '$lib/ui/Checkbox.svelte'
  import { constructURL2 } from '../../helpers'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  import { mapTrackData } from '../../helpers';
  export let facets = {};
  export let fl = {};
  export let query;

  let searchField = '';

  export let tracks

  let searchQuery = '';
  let filteredData = [];

  async function search() {
    const foundTacks = await get(`tracks?limit=100`);  
    filteredData = tracks.filter(item => {
      let track = mapTrackData(item)
      return track.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

// onMount(() => {
// 	var searchParams = new URLSearchParams(query)
// 	searchParams.forEach(function (value, key) {
// 		fl[key] = value
// 	})
//   searchField = fl.search;
// })

// function remove(k, i) {
//   let ix = query[k].indexOf(i)
//   query[k].splice(ix, 1)
//   let url = constructURL('/search', query)
//   goto(url)
// }

// function goCheckbox(e) {
// 	fl[e.detail.type] = e.detail.selectedItems
// 	let url = constructURL2('/mixer', fl)
// 	goto(`${url}`)
// }

// function search() {
//   if(searchField != undefined){
//     fl.search = searchField.replace(/\s/g, '+')
//     let url = constructURL2('/mixer', fl)
// 	  goto(`${url}`)
//   }
// }

// function clearSearch() {
//   searchField = '';
//   fl.search = '';
//   let url = constructURL2('/mixer', fl)
// 	goto(`${url}`)
// }

// function clearFilters() {
//   searchField = '';
//   fl.search = '';
// 	let url = '/mixer'
// 	goto(url)
// }
</script>
<div class="flex flex-col gap-4 items-center justify-center w-full">
  <div class="flex items-center justify-center w-11/12 gap-2 py-2 px-1 border-2 border-[#232834] rounded-full">
    <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 cursor-pointer" on:click={search} fill="none" viewBox="0 0 24 24" stroke="white">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg> -->
    <!-- <input bind:value={searchField} on:keypress={event => { if ((event.keyCode || event.which) == 13) search(); }} class="lg:bg-[#333333] bg-[#333333] text-sm focus:outline-none text-white w-full" type="text" placeholder="Title, Mood, Genre" /> -->
  </div>
</div>
<input type="text" bind:value={searchQuery} on:input={search} />

{#if filteredData.length > 0}
  <ul class="text-white">
    {#each filteredData as item}
      <li class="text-white">{item.data.title}</li>
    {/each}
  </ul>
{:else}
  <p>No results found.</p>
{/if}

<div class="flex flex-col text-white font w-full my-2">
  <!-- <button class="text-xs uppercase" on:click="{clearFilters}">
    Clear all
  </button> -->
    <!-- <Checkbox
    items={facets.genres}
    type="genre"
    title="Genre"
    selectedItems={fl.genre || []}
    on:go="{goCheckbox}"/>
  <Checkbox
    items={facets.moods}
    title="Mood"
    type="mood"
    selectedItems={fl.mood || []}
    on:go="{goCheckbox}"/>
  <Checkbox
    items={facets.other}
    type="other"
    title="Other"
    selectedItems={fl.other || []}
    on:go="{goCheckbox}"/> -->
</div>






     


  
      
