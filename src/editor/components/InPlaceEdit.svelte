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

{#if editing}
	<form on:submit|preventDefault={submit} on:focus|preventDefault={df} on:keydown={keydown} on:click|preventDefault={df}>
		<input class="px-1.5 w-20 h-4 bg-[#262626] text-[gray]" bind:value on:blur={submit} on:focus|preventDefault={df} required use:focus />
	</form>
{:else}
    <div class="root" bind:clientWidth={available} on:dblclick={edit}>
        <div class="original text-xs text-[gray] w-24 truncate" bind:clientWidth={original_width}>
          {value}
        </div>
      </div>
      <!-- <div
      class="shrinked "
      class:scrolling={original_width * shrinklimit > available}
      style={`
        --scale-x: ${scale_x};
        --scroll-time: ${(original_width - available) / 20}s;
      `}
    >
      {value}
    </div> -->
{/if}
<style lang="scss">
  // input {
  //     border: none;
  //     background: none;
  //     font-size: inherit;
  //     color: inherit;
  //     font-weight: inherit;
  //     text-align: inherit;
  //     box-shadow: none;
  // }
    
  // .root {
  //   display: block;
  //   position: relative;
  //   height: 1.2em;
  //   overflow: hidden;
  // }

//   .original {
//     opacity: 0;
//     overflow: hidden;
//     white-space: nowrap;
//     position: absolute;
//   }

//   .shrinked {
//     white-space: nowrap;
//     position: absolute;
//     left: 0;

//     transform-origin: left;
//     transform: scaleX(var(--scale-x));

//     &.scrolling {
//       @keyframes scrolltext {
//         from,
//         20%,
//         to {
//           left: 0%;
//           transform: scaleX(var(--scale-x)) translateX(0%);
//         }

//         75%,
//         90% {
//           left: 100%;
//           transform: scaleX(var(--scale-x)) translateX(-100%);
//         }
//       }

//       animation: scrolltext var(--scroll-time) linear;
//       animation-iteration-count: infinite;
//       animation-direction: repeat;
//     }
//   }
// </style>

