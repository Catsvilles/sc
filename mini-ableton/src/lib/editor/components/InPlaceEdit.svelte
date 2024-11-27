<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
    export let value: string;
    export let required: boolean = true;
    export let shrinklimit: number = 0.8;
    let available: number = 1;
    let original_width: number = 1;
    let editing: boolean = false;
	  let original: string;
    const clamp = (x: number, min: number, max: number) => {
    return Math.min(Math.max(x, min), max);
    };
    $: scale_x = clamp(available / original_width, shrinklimit, 1);
	  const dispatch = createEventDispatcher<{ submit: string, df : string }>();
    onMount(() => {
      original = value;
    });
    function edit() {
      editing = true;
    }
    function submit() {
      if (value !== original) {
        dispatch('submit', value);
      }
      editing = false;
    }
    function keydown(event: KeyboardEvent) {
      if (event.key == 'Escape') {
        event.preventDefault();
        value = original;
        editing = false;
      } else {
        //Killing all other key events so we can type
        event.stopImmediatePropagation();
        event.stopPropagation();
        return false;
      }
    }
    function focus(element: HTMLElement) {
      element.focus();
    }
    function df(){
        dispatch('df');
    }
</script>

<div class="p-1 text-xs text-color">
  {#if editing}
	<form on:submit|preventDefault={submit} on:focus|preventDefault={df} on:keydown={keydown} on:click|preventDefault={df}>
		<input class="px-1.5 first-bg-color" bind:value on:blur={submit} on:focus|preventDefault={df} {required} use:focus />
	</form>
{:else}
    <div class="root" bind:clientWidth={available} on:dblclick={edit}>
        <div class="original opacity-0 overflow-hidden whitespace-nowrap absolute" bind:clientWidth={original_width}>
          {value}
        </div>
        <div
          class="shrinked"
          class:scrolling={original_width * shrinklimit > available}
          style={`
            --scale-x: ${scale_x};
            --scroll-time: ${(original_width - available) / 20}s;
          `}
        >
          {value}
        </div>
      </div>
{/if}
</div>