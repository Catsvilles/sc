<script lang="ts">
  export let pressed: undefined | string | boolean = undefined;
  export let disabled: boolean = false;
  export let width: number;
  export let height: number;
</script>

<button style="width: {width}px; height: {height}px" disabled={disabled} class="flex items-center justify-center rounded-lg p-1 bg-[#262626]" on:click aria-pressed={pressed && `${pressed}`}>
  <slot />
</button>
