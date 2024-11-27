<script>
	import { onMount } from "svelte";
	import { automationVol } from "@app/stores/effects";

	export let width, height, linePoints, controlPoints, lineEndPoints

	let SVGBox
	let SVGBoxX, SVGBoxY
	let isPointSelected = false
	let isPointMoved = false
	let selectedPoint = null
	let highlightX, highlightY

	const addPoint = ({ x, y }) => {
		if(controlPoints.length !== 0) {
			controlPoints.some((point, i, arr) => {
				if(x < point[0]) {
					if(i !== 0) {
						controlPoints = [
							...controlPoints.slice(0, i), 
							[x, y], 
							...controlPoints.slice(i)
						]
						setLinePoints()
						return true
					} else {
						controlPoints = [
							[x, y], 
							...controlPoints
						]
						linePoints = [
							[0, y], 
							...controlPoints, 
							linePoints[linePoints.length - 1]
						]
						return true
					}
				} else {
					if(i === arr.length - 1) {
						controlPoints = [
							...controlPoints, 
							[x, y]
						]
						linePoints = [
							linePoints[0], 
							...controlPoints, 
							[width, y]
						]
						return true
					}
				}
			})
		} else {
			controlPoints = [[x, y]]
			linePoints = [[0, y], ...controlPoints, [width, y]]
		}
	}

	const removePoint = (i) => {
		controlPoints = [
			...controlPoints.slice(0, i), 
			...controlPoints.slice(i + 1)
		]
		if((i !== 0) && (i !== controlPoints.length)) {
			setLinePoints()
		} else if(controlPoints.length === 0) {
			linePoints = lineEndPoints
		} else if(i === 0) {
			moveLeftAnchor(controlPoints[0][1])
		} else {
			moveRightAnchor(controlPoints[controlPoints.length - 1][1])
		}
	}

	const movePointInBetween = (i, point) => {
		controlPoints = [
			...controlPoints.slice(0, i), 
			point, 
			...controlPoints.slice(i + 1)
		]
		setLinePoints()
	}

	const shiftPointLeft = (i, point) => {
		controlPoints = [
			...controlPoints.slice(0, i - 1),
			point,
			controlPoints[i - 1],
			...controlPoints.slice(i + 1)
		]
		selectedPoint = controlPoints.indexOf(point)
	}

	const shiftPointRight = (i, point) => {
		controlPoints = [
			...controlPoints.slice(0, i),
			controlPoints[i + 1],
			point,
			...controlPoints.slice(i + 2)
		]
		selectedPoint = controlPoints.indexOf(point)
	}

	const setLinePoints = () => {
		linePoints = [
			linePoints[0], 
			...controlPoints, 
			linePoints[linePoints.length - 1]
		]
	}

	const moveRightAnchor = (y) => {
		linePoints = [
			linePoints[0],
			...controlPoints,
			[width, y]
		]
	}

	const moveLeftAnchor = (y) => {
		linePoints = [
			[0, y],
			...controlPoints,
			linePoints[linePoints.length - 1]
		]
	}

	const onMouseDown = (e) => {
		if(e.target.tagName === 'circle') {
			isPointSelected = true
			selectedPoint = Number(e.target.dataset.index)

			highlightX = controlPoints[selectedPoint][0]
			highlightY = controlPoints[selectedPoint][1]
		}
	}

	const onMouseMove = (e) => {
		if(isPointSelected) {
			isPointMoved = true
			const x = e.clientX - SVGBoxX
			const y = e.clientY - SVGBoxY

			if((selectedPoint !== 0) && (selectedPoint !== controlPoints.length - 1)) {
				// moving controlPoints in the middle
				if((controlPoints[selectedPoint - 1][0] < x) && (x < controlPoints[selectedPoint + 1][0])) {
					movePointInBetween(selectedPoint, [x, y])
				} else if(x <= controlPoints[selectedPoint - 1][0]) {
					shiftPointLeft(selectedPoint, [x, y])
				} else {
					shiftPointRight(selectedPoint, [x, y])
				}
			} else if(controlPoints.length === 1) {
				controlPoints = [[x, y]]
				linePoints = [[0, y], ...controlPoints, [width, y]]
			} else {
				if(selectedPoint === 0) {
					// moving first point
					if(x < controlPoints[1][0]) {
						controlPoints = [[x, y], ...controlPoints.slice(1)]
						moveLeftAnchor(y)
					} else {
						shiftPointRight(0, [x, y])
						moveLeftAnchor(controlPoints[0][1])
					}
				} else {
					// moving last point
					if(x > controlPoints[controlPoints.length - 2][0]) {
						controlPoints = [...controlPoints.slice(0, controlPoints.length - 1), [x, y]]
						moveRightAnchor(y)
					} else {
						shiftPointLeft(controlPoints.length - 1, [x, y])
						moveRightAnchor(controlPoints[controlPoints.length - 1][1])
					}
				}
			}

			highlightX = x
			highlightY = y
			automationVol.set(controlPoints);
		}
	}

	const onMouseUp = (e) => {
		if(isPointSelected) {
			if(!isPointMoved) {
				removePoint(selectedPoint)
			} else {
				isPointMoved = false
			}

			isPointSelected = false
		} else {
			//NOTE: Have to recalculate this since we are changing the visibleRange often
			const { x , y } = SVGBox.getBoundingClientRect()
			SVGBoxX = Math.round(x)
			SVGBoxY = Math.round(y)
		
			addPoint({ x: e.clientX - SVGBoxX, y: e.clientY - SVGBoxY })			
		}
		automationVol.set(controlPoints);
	}

	const onMouseLeave = () => {
			isPointSelected = false
			isPointMoved = false
			selectedPoint = null
    }

	onMount(() => {
		const { x , y } = SVGBox.getBoundingClientRect()
		SVGBoxX = Math.round(x)
		SVGBoxY = Math.round(y)
	})
</script>
<svg 
	version="1.1" 
	xmlns="http://www.w3.org/2000/svg" 
	bind:this={SVGBox}
	on:mousedown={onMouseDown}
	on:mousemove={onMouseMove}
	on:mouseup={onMouseUp}
	on:mouseleave={onMouseLeave}
>
  <text class="text-xs" x='2' y={(height / 2) + 12} fill='white' opacity='0.6'>0 dB</text>
	<line x1='0' y1={height / 2} x2={width} y2={height / 2} stroke="var(--color-accent)" stroke-width="1"  opacity='0.7'/>
	<polyline 
		points={linePoints.join(' ')}
		stroke="var(--color-red)"
		fill="transparent" 
		stroke-width="2"
	/>

	{#each controlPoints as controlPoint, i}
		<circle cx={controlPoint[0]} cy={controlPoint[1]} r={6} stroke="var(--color-red)" fill='none' data-index={i} />
		<circle cx={controlPoint[0]} cy={controlPoint[1]} r={4} fill="var(--color-accent)" opacity="1" style="transition: r var(--anim-short), opacity var(--anim-short);" data-index={i} />
	{/each}
	
	{#if isPointSelected}
		<circle cx={highlightX} cy={highlightY} r={12} fill="var(--color-red)" opacity='0.6' />
	{/if}
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
	}

	text {
		user-select: none;
	}

	circle {
		cursor: pointer;
	}
</style>