<script lang="ts">
  import { ui } from "$lib/editor/stores/settings";
  import {volume, pan} from "$lib/editor/stores/effects";

  export let id: undefined | string = undefined;
  export let color: string = "var(--color-accent)";
  export let disabledColor: string = "var(--color-foreground-1)";
  export let size: number = 20;
  export let type: "absolute" | "relative" = "absolute";
  export let value: number = 0;
  export let name : string = "";
  export let disabled: boolean = false;
  export let min: number = { absolute: 0, relative: -1 }[type];
  export let max: number = { absolute: 1, relative: 1 }[type];
  export let step: undefined | number = 0.1;
  export let clamp: boolean = true;

  $: normalized = (value - min) / (max - min);
  $: valueArcStart = (type === "absolute" ? 90 : 225) * (Math.PI / 180);
  $: valueArcEnd = (90 + normalized * 270) * (Math.PI / 180);
  $: valueArcLarge = valueArcEnd - valueArcStart > Math.PI;
  $: valueArcSide = valueArcEnd > valueArcStart;
  $: neutral = value === 0;
  let hideValue = true;

  $: if (clamp) {
    value = Math.min(max, Math.max(min, value));
  }

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) {
      return;
    }
    hideValue = false;
    const usedPointerLock = $ui.usePointerLock;

    this.onpointermove = (e: PointerEvent) => {
      value -= (e.movementY / 50) * (max - min) * 0.5;
      
      if (name === "Volume") {
        volume.set(value);
      } else if(name === "Pan") {
        pan.set(value);
      }
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
</script>
<div class="flex relative">
<div class:hidden={hideValue} class="absolute bg-transparent px-2 py-1 text-[var(--yellowc)] text-xs rounded-lg" style="bottom: 100%; left: {Math.round(value * 100)}%;">{Math.round(value * 100)}%</div>
<input
  class="w-24"
  type="range"
  bind:value
  {id}
  {step}
  {disabled}
  min={clamp && min}
  max={clamp && max}
  on:pointerdown|stopPropagation={handlePointerDown}
  on:pointerup={()=>{hideValue = true}}     
/>
</div>