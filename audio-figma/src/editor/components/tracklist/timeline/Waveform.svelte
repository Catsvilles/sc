<script lang="ts">
import { onMount } from 'svelte';
import WaveCanvas from "./WaveCanvas.svelte"
export let peaks;
export let percent;
export let color = 'grey';
export let progressColor = '#8a005e';
export let height = 40;
export let barWidth = undefined;
export let width = undefined;
let waveWidth;
let waveHeight;
let pixelRatio;
onMount(() => {
  //NOTE Will work faster if done using Svelte's magic window stuff
  pixelRatio = window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI;

});

</script>
<style>
.progress-wave-wrapper {
position: absolute;
z-index: 2;
left: 0;
top: 0;
bottom: 0;
overflow: hidden;
/* height: 200px; */
/* width: ({progressWidth})px; */
display: block;
transition: width 200ms ease-in-out;
box-sizing: border-box;
}
.progress-wave {
  color: #8a005e;
}

</style>
<div on:click on:mousemove id="wave-wrapper" style="position: relative;
          width: 100%;
          height: 100%;
          cursor: pointer;">
      <WaveCanvas peaks={peaks} barWidth={barWidth} color={color} canvasWidth={width * pixelRatio} canvasHeight={height * pixelRatio}></WaveCanvas>
  <div class="progress-wave-wrapper" style="width: {width * percent}px; height: {height}px;">
      <WaveCanvas peaks={peaks} barWidth={barWidth} color={progressColor} canvasWidth={width * pixelRatio} canvasHeight={height * pixelRatio}></WaveCanvas>
  </div>
</div>
