<script lang="ts">
  export let pressed: undefined | string | boolean = undefined;
  export let disabled: boolean = false;
</script>

<button disabled={disabled} on:click aria-pressed={pressed && `${pressed}`}>
  <slot />
</button>