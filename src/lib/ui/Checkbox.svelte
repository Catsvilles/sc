<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let type,
    items = [],
    selectedItems = [],
    color = 'none',
    name = '',
    required = false,
    disabled = false,
    title = ''
  
  let show = false
  let showit = true

  function goto(url) {}
  function toggle() {
    show = !show
  }

  function Showit() {
     showit
  }

  function changed() {
    dispatch('change', type)
  }

  function clearFilters() {
    let url = '/search'
    goto(url)
  }

</script>

<div on:click="{toggle}" on:mouseenter="{Showit}" class="flex items-center justify-between p-4 shadow rounded bg-[#1f2430] text-sm font-medium text-white cursor-pointer w-full my-1">
  {#if show}
    <svg clip-rule="evenodd" class="w-5 h-5" fill="white" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
    </svg>
  {:else}
    <svg clip-rule="evenodd" fill="white" class="w-5 h-5" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="m16.843 13.789c.108.141.157.3.157.456 0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291 1.002 1.299 3.044 3.945 4.243 5.498z"/>
    </svg>
  {/if}
  <h5 class="text-sm ml-1 font-semibold ">
    {title}
  </h5>
</div>
  {#if showit}
    <div>
          <!-- <h5 class="text-xs flex items-center space-x-2">
            <button
              on:click={selectallFilters}
              class="border-r pr-2 border-blue-500 hover:underli text-purple-500 cursor-pointer hover:underline focus:outline-none"
            >
              Select All
            </button>
            <button
              on:click={clearFilters}
              class="hover:underli text-purple-500 cursor-pointer hover:underline focus:outline-none"
            >
              Clear All
            </button>
          </h5> -->
    </div>
  {/if}
    <!-- </div> -->
<ul>
  {#each items as i (i.slug)}
    {#if (i.slug, show)}
      <li>
        <label class="my-2 ml-4">
          <input
            type="checkbox"
            name="{name}"
            disabled="{disabled}"
            required="{required}"
            color="{color}"
            bind:group="{selectedItems}"
            value="{i.slug}"
            on:change="{() => dispatch('go', { type, selectedItems })}"
            class="focus:ring-0 focus:ring-offset-0 h-4 w-4" />
          {#if color}
            <!-- <span
              data-colorhex="black"
              class="colour-label colour-colorDisplay"
              style.background-color={color}
            /> -->
          {/if}
          <span class="ml-2 text-sm text-gray-100">{i.title}</span>
          <!-- <span class="text-xs ml-1 text-gray-500">{length}</span> -->
        </label>
      </li>
    {/if}
  {/each}
</ul>
