<script lang="ts">
	export let right: number = 24;
	export let top: number = 400;
	
	let moving: boolean = false;
	
	function onMouseDown() {
		moving = true;
	};
	
	function onMouseMove(e: { movementX: number; movementY: number; }) {
		if (moving) {
			right -= e.movementX;
			top += e.movementY;
		}
	};
	
	function onMouseUp() {
		moving = false;
	};
</script>

<section on:mousedown={onMouseDown} style="right: {right}px; top: {top}px;" class="fixed select-none z-50">
	<slot></slot>
</section>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />