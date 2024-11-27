<script>
export let items = [];
export let activeTabValue;

// Set default tab value Note: was onMount(() => {
if (Array.isArray(items) && items.length && items[0].value) {
  activeTabValue = items[0].value;
}
const handleClick = tabValue => () => (activeTabValue = tabValue);
</script>
<ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
  {#if Array.isArray(items)}
    {#each items as item}
      <li class="cursor-pointer -mb-px mr-2 last:mr-0 flex-auto text-center">
        <span on:click={handleClick(item.value)} class="{activeTabValue === item.value ? 'bg-gray-400 text-white' : 'bg-white text-pink-800'} text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal">
          <i class="{item.icon} text-base mr-1"></i>{item.label}
        </span>
      </li>
    {/each}
  {/if}
</ul>
