<script lang="ts">
  import { tick } from "svelte";
  import { ui } from "@app/stores/settings";
  import Icon from "@components/Icon.svelte";
  import Button from "@components/control/Button.svelte";

  export let value: number;
  export let min: number = 1.0;
  export let max: number = 319.99;

  let readonly = true;

  $: fieldValue = value.toFixed(0);
  $: value = Math.min(max, Math.max(min, value));

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      this.blur();
    }
  }

  async function handleDblClick() {
    readonly = false;

    await tick();
    this.focus();
    this.select();
  }

  async function handleBlur() {
    if (["number", "string"].includes(typeof fieldValue)) {
      const num = Number(fieldValue);

      // only update the value if it's valid
      if (Number.isFinite(num)) {
        value = num;
      }
    } else {
      // TODO: find a better way to update fieldValue ??
      value = value + 1;
      value = value - 1;
    }

    readonly = true;
  }

  function handleWheel(e: WheelEvent) {
    const side = Math.sign(e.deltaY);
    const factor = e.shiftKey ? 2 : 1;

    value -= side * factor;
  }

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) {
      return;
    }

    const usedPointerLock = $ui.usePointerLock;
    const startValue = value;
    let deltaY = 0;

    this.onpointermove = (e: PointerEvent) => {
      deltaY += e.movementY;

      value = startValue - Math.round(deltaY / 4);
    };

    this.onpointerup = (e: PointerEvent) => {
      this.onpointermove = null;
      this.onpointerup = null;

      if (usedPointerLock) {
        document.exitPointerLock();
      } else {
        this.releasePointerCapture(e.pointerId);
      }
    };

    if (usedPointerLock) {
      this.requestPointerLock();
    } else {
      this.setPointerCapture(e.pointerId);
    }
  }

  let lastTap: number;  
  const tap = () => {
    const currentTap = Date.now();
    if (lastTap) {
      const diff = (currentTap - lastTap) / 1000;
      value = Math.round(60 / diff)
    }
    lastTap = currentTap;
  };
</script>

<div
  class="tempo-root flex flex-row justify-center items-center"
  on:wheel={handleWheel}
  on:pointerdown={handlePointerDown}
>
  <input
    class="w-14 bg-[#262626] text-[gray] rounded-lg p-1 h-6"
    {min}
    {max}
    type="number"
    bind:value={fieldValue}
    {readonly}
    on:blur={handleBlur}
    on:dblclick={handleDblClick}
    on:keydown={handleKeyDown}
  />
  <div class="-ml-4">
    <Icon 
    color="gray"
    name="arrow/unfold_more" />
  </div>
</div>
<Button 
width={24}
height={24}
on:click={tap}>
  <!-- <Icon 
  color="gray"
  size="24"
  name="basic/click" /> -->
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 256 256" xml:space="preserve">
    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
      <path d="M 69.524 43.298 h -0.449 c -0.99 0 -1.93 0.218 -2.774 0.609 c -0.641 -2.99 -3.304 -5.238 -6.481 -5.238 H 59.37 c -1.135 0 -2.204 0.287 -3.139 0.792 c -1.002 -2.392 -3.367 -4.076 -6.118 -4.076 h -0.448 c -0.934 0 -1.822 0.194 -2.628 0.543 v -9.516 c 0 -3.655 -2.974 -6.628 -6.629 -6.628 h -0.449 c -3.655 0 -6.628 2.974 -6.628 6.628 v 24.376 l -3.022 2.294 c -2.403 1.824 -3.927 4.479 -4.29 7.475 c -0.363 2.994 0.482 5.935 2.379 8.279 l 9.423 11.649 v 4.633 c 0 2.799 2.277 5.076 5.076 5.076 h 23.518 c 2.799 0 5.076 -2.277 5.076 -5.076 l 0.001 -4.398 c 3.01 -3.782 4.659 -8.476 4.659 -13.3 V 49.927 C 76.152 46.271 73.179 43.298 69.524 43.298 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: gray; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
      <path d="M 28.5 33.873 c -0.668 0 -1.321 -0.334 -1.7 -0.943 c -1.517 -2.437 -2.319 -5.249 -2.319 -8.131 c 0 -8.495 6.911 -15.406 15.406 -15.406 c 8.495 0 15.406 6.911 15.406 15.406 c 0 1.483 -0.211 2.95 -0.626 4.361 c -0.313 1.061 -1.427 1.668 -2.484 1.354 c -1.06 -0.312 -1.665 -1.424 -1.354 -2.483 c 0.308 -1.044 0.464 -2.131 0.464 -3.231 c 0 -6.29 -5.116 -11.406 -11.406 -11.406 s -11.406 5.117 -11.406 11.406 c 0 2.135 0.593 4.216 1.714 6.017 c 0.584 0.938 0.297 2.171 -0.641 2.755 C 29.226 33.775 28.86 33.873 28.5 33.873 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: gray; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
      <path d="M 27.248 45.541 c -0.385 0 -0.774 -0.111 -1.118 -0.343 c -6.791 -4.588 -10.846 -12.214 -10.846 -20.4 c 0 -13.566 11.037 -24.603 24.603 -24.603 S 64.49 11.232 64.49 24.798 c 0 3.103 -0.571 6.13 -1.697 8.996 c -0.404 1.028 -1.563 1.537 -2.593 1.13 c -1.028 -0.404 -1.534 -1.564 -1.13 -2.593 c 0.942 -2.398 1.42 -4.933 1.42 -7.533 c 0 -11.36 -9.242 -20.603 -20.603 -20.603 c -11.36 0 -20.603 9.243 -20.603 20.603 c 0 6.855 3.396 13.242 9.085 17.085 c 0.916 0.618 1.156 1.862 0.538 2.777 C 28.521 45.232 27.89 45.541 27.248 45.541 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: gray; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
    </g>
</Button>
<style lang="scss">
  @use '@app/scss/normalize';

  .tempo-root {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    padding: 2px 4px;
    border-radius: 8px;
    background: var(--color-background-1);
    cursor: ns-resize;
    color: var(--color-foreground-2);

    input {
      @include normalize.input;

      width: 45px;
      cursor: inherit;
      user-select: none;
      border-radius: 6px;
      font-size: 16px;
      color: gray;

      &:not([readonly]) {
        background: var(--color-background-2);
        cursor: text;
      }
    }
  }
</style>