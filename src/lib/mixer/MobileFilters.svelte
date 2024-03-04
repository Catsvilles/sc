<script lang="ts">
  import Checkbox from '$lib/ui/Checkbox.svelte'
  import { createEventDispatcher } from 'svelte';
  import { constructURL2 } from '../../helpers'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  const dispatch = createEventDispatcher()

  export let facets = {},
	fl = {},
	query
  let selected = 'genre';
  let searchField = '';

  onMount(() => {
    var searchParams = new URLSearchParams(query)
    searchParams.forEach(function (value, key) {
      fl[key] = value
    })
  })
  function hide() {
    dispatch('hide')
  }

  function clearFilters() {
    searchField = '';
    fl.search = '';
    dispatch('hide')
    let url = constructURL2('/studio', {})
    goto(url)
  }

  function goCheckbox(e) {
    fl[e.detail.type] = e.detail.selectedItems
    let url = constructURL2('/studio', fl)
    goto(`${url}page=1`)
  }

  function search() {
  if(searchField != undefined){
    fl.search = searchField.replace(/\s/g, '+')
    let url = constructURL2('/studio', fl)
	  goto(`${url}`)
  }
}

  function clearSearch() {
    searchField = '';
    fl.search = '';
    let url = constructURL2('/mixer', fl)
    goto(`${url}`)
  }
</script>

<style>
  .selected {
    color: #da1c5f;
    background-color: white;
    border-left: 4px solid #da1c5f;
  }
  ul > li {
    font: bold;
    color: gray;
    padding: 10px;
    font-size: 1.1rem;
  }
  ul > li {
    font: bold;
    color: gray;
    padding: 10px;
    font-size: 1.1rem;
  }
</style>

{#if facets}
<div class="fixed z-50 top-0 left-0 py-2 bg-white-800 shadow bg-white w-screen h-screen">
    <!-- Mobile version starts here -->
    <div class="block h-full md:hidden">
      <div class="flex mt-4 p-2 w-full border space-x-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-30 hover:opacity-60 cursor-pointer" on:click={search} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input bind:value={searchField} on:keypress={event => {
          if ((event.keyCode || event.which) == 13) search();
        }} class="flex-1 text-sm focus:outline-none" type="text" placeholder="Title, Mood, Genre" />
        <svg xmlns="http://www.w3.org/2000/svg" on:click={clearSearch} class="ml-auto {searchField != undefined && searchField.length > 0 ? 'block' : 'hidden'} h-5 w-5 opacity-30 " viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="flex w-full py-4 bg-white shadow-md">
        <div class="flex-1 text-left text-gray-700" on:click={hide}>
          <i class="ml-2 fa fa-times" aria-hidden="true" />
        </div>
        <div class="flex-1 font-bold text-center text-gray-700">FILTER</div>
        <div
          class="flex-1 mr-2 text-right text-gray-700"
          on:click={clearFilters}>
          Clear all
        </div>
      </div>
      <div class="flex w-full h-full mt-1">
        <div class="w-2/5 overflow-y-scroll">
          <ul class="h-full bg-gray-200">
            <li
              on:click={() => (selected = 'genre')}
              class:selected={selected == 'genre'}>
              Genre
            </li>
            <li
              on:click="{()=>selected='mood'}"
              class:selected={selected=='mood'}
            >
              Mood
            </li>
            <li
              on:click={() => (selected = 'other')}
              class:selected={selected == 'other'}>
              Other
            </li>
          </ul>
        </div>
        <div class="w-full overflow-y-scroll">
        {#if selected == 'genre'}
          <Checkbox
            items={facets.genres}
            title="Genre"
            type="genre"
            selectedItems={fl.genre || []}
            on:go="{goCheckbox}"/>
        {/if}
        {#if selected == 'mood'}
          <Checkbox
            items={facets.moods}
            title="Mood"
            type="mood"
            selectedItems={fl.mood || []}
            on:go="{goCheckbox}"/>
        {/if}
        {#if selected == 'other'}
          <Checkbox
            items={facets.other}
            title="Other"
            type="playlist"
            selectedItems={fl.other || []}
            on:go="{goCheckbox}"/>
        {/if}
        </div>
      </div>
      <div class="absolute bottom-0 w-full text-center primary">
        <button
          class="w-full p-4 uppercase font-bold cursor-pointer focus:outline-none"
          on:click={hide}>
          Apply
        </button>
      </div>
    </div>
  </div>
{/if}
