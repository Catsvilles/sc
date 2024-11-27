<script lang="ts">
	import { onMount } from "svelte";
	import type { Clip } from "@api/timeline";
	import SVGBox from './SVGBox.svelte';
	import { automationVol } from "@app/stores/effects";

	export let clip: Clip;

	let wrapper
	let isSVGVisible = false
	export let width = 0;
	export let height = 0;
	export let secWidth: number;
	export let linePoints = clip.controlPoints;
	export let controlPoints = clip.controlPoints;
	let lineEndPoints = [];

	function normalize(value, min, max){
		return (value - min) / (max - min);
	}

	function pointsToLinearRamp(points){
		const linearPoints = [];
		points.forEach((point) => {				  
			linearPoints.push({
					time: (point[0] / secWidth) + clip.start,
					value: normalize(height - point[1], 0, height) > 0.02 ? normalize(height - point[1], 0, height) * 2 : 0
				});
		});	
		return linearPoints;
	}

	$:  {
		if(linePoints.length > 0) {
			controlPoints = linePoints.slice(1, linePoints.length - 1);
			clip.controlPoints = linePoints;
			
			clip.linearPoints = pointsToLinearRamp(controlPoints);
		}
		automationVol.set(controlPoints);
	}

	onMount(() => {
		lineEndPoints = [
			[0, Math.round(height / 2)],
			[width, Math.round(height / 2)]
		]
		linePoints = clip.controlPoints.length > 0 ? linePoints = clip.controlPoints : linePoints = lineEndPoints
		isSVGVisible = true
	})
</script>
<div class='svg-wrapper' bind:this={wrapper}>
	{#if isSVGVisible}
		<SVGBox 
			{width} 
			{height}
			{lineEndPoints} 
			bind:linePoints 
			bind:controlPoints 
		/>
	{/if}
</div>

<style>
.svg-wrapper {
	width: 100%;
	height: 100%;
}
</style>