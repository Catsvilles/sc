<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas, Layer, type Render } from 'svelte-canvas';
	import player from "@app/stores/player";

	export let animatedViewRegion;
	export let secWidth;
	export let divWidth;

    let step = 1;
    let offset = null;
    let scrollingAncestor = document.body;
    let onlyBigMeasures = true;
    let timelineEl : HTMLElement;
    let beatsPerMeasure = 4;
    let stepsPerBeat = 4;
    let pxPerBeat = 10;
    let pxPerMeasure = beatsPerMeasure * pxPerBeat;
	let renderLooper: Render;
	let startPointSecs : number;
	let endPointSecs : number;
	let mousedown : boolean = false;
	let mounted : boolean = false;
	let steps : HTMLElement;
	let beats : HTMLElement;

	export function updateOffset() {			
		const offBeats = Math.floor( ($animatedViewRegion[0] * secWidth) / pxPerMeasure );		
		const off = onlyBigMeasures
			? Math.floor( offBeats / beatsPerMeasure ) * beatsPerMeasure
			: offBeats;
		const diff = off !== offset;


		if ( diff ) {
			offset = off;
			timelineEl.style.setProperty( "--gsuiTimeline-beats-offset", off );
		}

		const measures = document.querySelector(".gsuiTimeline-measures");
		Array.prototype.forEach.call( measures.children, ( el, i ) => {
			el.classList.toggle( "gsuiTimeline-measureBig",
				onlyBigMeasures || ( offset + i ) % beatsPerMeasure === 0 );				
		} );

		return diff;
	}

	function updateNumberMeasures() {
		const elMeasures = document.querySelector(".gsuiTimeline-measures");
		const px = pxPerMeasure * ( onlyBigMeasures ? beatsPerMeasure : 1 );
		const nb = Math.ceil( scrollingAncestor.clientWidth / px ) + 1;

		if ( nb < 0 || nb > 500 ) {
			return console.warn( "gsuiTimeline: anormal number of nodes to create", nb );
		} else if ( elMeasures.children.length > nb ) {
			while ( elMeasures.children.length > nb ) {
				elMeasures.lastChild.remove();
			}
		} else {
			while ( elMeasures.children.length < nb ) {
				const el = document.createElement("span");
				el.setAttribute('class', "gsuiTimeline-measure");
				elMeasures.append(el);
			}
		}
	}
	function updateMeasures() {
		const measures = document.querySelector(".gsuiTimeline-measures");
		Array.prototype.forEach.call( measures.children, ( el, i ) => {
			el.classList.toggle( "gsuiTimeline-measureBig",
				onlyBigMeasures || ( offset + i ) % beatsPerMeasure === 0 );
		} );
	}

	function changePxPerBeat(ppb = 60) {		
		const stepsOpa = Math.max( 0, Math.min( ( ppb - 32 ) / 256, .5 ) );
		const beatsOpa = Math.max( 0, Math.min( ( ppb - 20 ) / 40, .6 ) );
		const measuresOpa = Math.max( 0, Math.min( ( ppb - 6 ) / 20, .7 ) );
		pxPerBeat = ppb;
		pxPerMeasure = beatsPerMeasure * ppb;
		onlyBigMeasures = ppb < 6;		
		timelineEl.style.fontSize = `${ ppb }px`;

		timelineEl.style.setProperty( "--gsuiTimeline-beats-incr", onlyBigMeasures ? beatsPerMeasure : 1 );
		timelineEl.style.setProperty( "--gsuiTimeline-measures-opacity", measuresOpa );

		steps.style.opacity = stepsOpa;
		beats.style.opacity = beatsOpa;
		//updateOffset();
		updateNumberMeasures();
		updateMeasures();
	}

	onMount(async () => {
	animatedViewRegion.subscribe(() => {				
		changePxPerBeat(+2 * secWidth);
		onscroll();
		// if (2 * secWidth < 60) {
		// 	changeTimedivision("4/4");
		// } else {
		// 	changeTimedivision("1/1");
		// }
		scrollingAncestor.scrollLeft = $animatedViewRegion[0] * secWidth;
	});

	divWidth.subscribe(() => {				
		updateNumberMeasures();
		updateMeasures();
		changePxPerBeat(+2 * secWidth);
	});

	// .........................................................................
	function setScrollingParent( el ) {
		unscrollEvent();
		scrollingAncestor = el;
		el.addEventListener( "scroll", onscroll );
		//GSUI.$observeSizeOf( el, this.#onresizeBind );
	}
	function unscrollEvent() {
		if (scrollingAncestor ) {
			scrollingAncestor.removeEventListener( "scroll", onscroll );
			//GSUI.$unobserveSizeOf( this.#scrollingAncestor, this.#onresizeBind );
		}
	}

	// .........................................................................
	function beatCeil( beat ) { return beatCalc( Math.ceil, beat ); }
	function beatRound( beat ) { return beatCalc( Math.round, beat ); }
	function beatFloor( beat ) { return beatCalc( Math.floor, beat ); }
	function beatCalc( mathFn, beat ) {
		const mod = 1 / stepsPerBeat * step;

		return mathFn( beat / mod ) * mod;
	}


	function changeTimedivision( timediv ) {
		const [ bPM, sPB ] = timediv.split( "/" );

		beatsPerMeasure = +bPM;
		stepsPerBeat = +sPB;
		pxPerMeasure = beatsPerMeasure * pxPerBeat;

		timelineEl.style.setProperty( "--gsuiTimeline-beats-per-measure", beatsPerMeasure );
		
		updateStepsBg();
		if ( scrollingAncestor ) {
			updateNumberMeasures();
			updateMeasures();
		}
	}

	function updateStepsBg() {
		const sPB = stepsPerBeat;
		const dots = [];

		for ( let i = 1; i < sPB; ++i ) {
			dots.push(
				`transparent calc( ${ i / sPB }em - 1px )`,
				`currentColor calc( ${ i / sPB }em - 1px )`,
				`currentColor calc( ${ i / sPB }em + 1px )`,
				`transparent calc( ${ i / sPB }em + 1px )` );
		}

		steps.style.backgroundImage = `
			repeating-linear-gradient(90deg, transparent 0em,
				${ dots.join( "," ) },
				transparent calc( ${ 1 }em )
			)
		`;
	}



	// .........................................................................
	function onscroll() {
		if ( updateOffset() && !onlyBigMeasures ) {
			updateMeasures();
		}
	}
	function onresize() {
		updateNumberMeasures();
		updateMeasures();
	}

	changePxPerBeat(+2 * secWidth);
	changeTimedivision("1/1");

	setScrollingParent( document.querySelector( "#wrapOut" ) );

	mounted = true;
	});


  $: renderLooper = ({ context }) => {
	secWidth;

	context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.beginPath();
    context.moveTo(startPointSecs * secWidth, 10);
    context.lineTo(endPointSecs * secWidth, 10);
    context.strokeStyle = '#f97316';
    context.lineWidth = 3;

    context.fillStyle = '#f97316';
    context.arc(startPointSecs * secWidth, 10, 4, 0, Math.PI*2);
    context.stroke();
    context.fill(); 
    context.arc(endPointSecs * secWidth, 10, 4, 0, Math.PI*2);
    context.stroke();
    context.fill();
    //context.translate(0, 0);
  };

    //Draw loop points on canvas timeline 
	const onCanvasMouseDown = (e: MouseEvent) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();

    if (e.button === 2) {
      // clearing the looping points
      startPointSecs = -5;
      endPointSecs = -5;
      $player.loop = false;
	  $player.loopingPoints = [];
    } else {
      if (e.ctrlKey) {
	  startPointSecs =
          (e.clientX - rect.left) / secWidth;
      mousedown = true;
      $player.loop = true;
      }
    }
  }

  const drawLoopLine = (e: MouseEvent) => {      
    if(mousedown) {
      const canvas = e.target;
      const rect = canvas.getBoundingClientRect();
      endPointSecs = (e.clientX - rect.left) / secWidth;      
      $player.loopingPoints = [Math.min(startPointSecs, endPointSecs), Math.max(startPointSecs, endPointSecs)];
    }
  }
</script>
<div id="wrapOut" class="mb-1">
	<div id="wrapIn">
		<div class="gsui-timeline gsuiTimeline-looping h-full mb-1 font-sans" bind:this={timelineEl}>
		<div
			class="gsuiTimeline-steps"
			bind:this={steps}
			style="
				opacity: 0.1875;
				background-image: repeating-linear-gradient(
					90deg,
					transparent 0em,
					transparent calc(0.25em - 1px),
					currentcolor calc(0.25em - 1px),
					currentcolor calc(0.25em + 1px),
					transparent calc(0.25em + 1px),
					transparent calc(0.5em - 1px),
					currentcolor calc(0.5em - 1px),
					currentcolor calc(0.5em + 1px),
					transparent calc(0.5em + 1px),
					transparent calc(0.75em - 1px),
					currentcolor calc(0.75em - 1px),
					currentcolor calc(0.75em + 1px),
					transparent calc(0.75em + 1px),
					transparent calc(1em)
				);
			"
		></div>
		<div class="gsuiTimeline-beats" style="opacity: 0.6;" bind:this={beats}></div>
		<div class="gsuiTimeline-measures"></div>
		<div class="gsuiTimeline-loopLine">
			<div class="timeline_canvas-wrap absolute inset-0 z-50" style="height: 40px;">
				<Canvas width={50000} height={40}
				on:mousedown={onCanvasMouseDown} 
				on:mousemove={drawLoopLine} 
				on:mouseup={()=>{mousedown = false}}
				on:mouseleave={()=>{mousedown = false}}
				on:contextmenu={(e)=>{e.preventDefault()}}>
				<Layer render={renderLooper} />
				</Canvas>
			</div>
		</div>
	</div>		
</div>
</div>
<style>
.timeline_canvas-wrap {
  width: fit-content;
	overflow: hidden;
}
#wrapOut {
	overflow: auto;
}
#wrapIn {
	width: 50000px;
	height: 40px;
}

:root {
	--gsuiTimeline-numbering: 1;
}

:global(.gsui-timeline) {
	position: relative;
	display: block;
	color: var( --gsuiTimeline-color );
	background-color: var( --gsuiTimeline-bg );
	--gsuiTimeline-beats-offset: 0;
	--gsuiTimeline-beats-incr: 1;
	--gsuiTimeline-beats-per-measure: 4;
}

.gsui-timeline {
	--gsuiTimeline-bg: #333333;
	--gsuiTimeline-color: #fff;
	--gsuiTimeline-loop-bg: #656586;
	--gsuiTimeline-lines-bg: #ffffff07;
	--gsuiTimeline-cursor-fill: #fff;
	--gsuiTimeline-loopBorder-bg: #fff;
	/* font-family: Arial, Helvetica, sans-serif; */
}

/* .......................................................................... */
:global(.gsuiTimeline-steps),
:global(.gsuiTimeline-beats) {
	position: absolute;
	inset: calc( 50% - 1px ) 0 auto;
	height: 2px;
	pointer-events: none;
	background-repeat: no-repeat;
}
:global(.gsuiTimeline-beats) {
	top: calc( 50% - 2px );
	height: 4px;
	margin-left: 1px;
	background-image: repeating-linear-gradient(
		90deg,
		transparent 0,
		transparent calc( 1em - 2px ),
		currentColor calc( 1em - 2px ),
		currentColor calc( 1em ),
		transparent calc( 1em )
	);
}
.gsuiTimeline-measures {
	display: flex;
	height: 100%;
	counter-reset: beat calc( var( --gsuiTimeline-beats-offset ) - var( --gsuiTimeline-beats-incr ) + var( --gsuiTimeline-numbering ) );
	pointer-events: none;
}
:global(.gsuiTimeline-measure) {
	counter-increment: beat var( --gsuiTimeline-beats-incr );
	display: inline-block;
	margin-left: calc( var( --gsuiTimeline-beats-incr ) * var( --gsuiTimeline-beats-per-measure ) * 1em );
}
:global(.gsuiTimeline-measure:first-child) {
	margin-left: calc( var( --gsuiTimeline-beats-offset ) * var( --gsuiTimeline-beats-per-measure ) * 1em );
}
:global(.gsuiTimeline-measure::before) {
	content: "";
	position: absolute;
	margin-left: -2px;
	width: 4px;
	height: 100%;
	background-color: var( --gsuiTimeline-bg );
}
:global(.gsuiTimeline-measure::after) {
	display: flex;
	content: counter( beat );
	position: absolute;
	inset: 0 auto;
	width: 52px;
	margin-left: -26px;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	font-family: var( --gsui-font-number );
	opacity: var( --gsuiTimeline-measures-opacity, 0 );
}
:global(.gsuiTimeline-measureBig::after) {
	/* font-weight: bold; */
	opacity: 1;
}

/* .......................................................................... */
.gsuiTimeline-loopLine,
.gsuiTimeline-timeLine {
	position: absolute;
	inset: 0 0 50%;
	transition: .2s background-color;
}

.gsuiTimeline-timeLine {
	top: 50%;
	bottom: 0;
}

/* .......................................................................... */
.gsuiTimeline-cursor,
.gsuiTimeline-cursorPreview {
	position: absolute;
	margin-left: -8px;
	bottom: 1px;
	fill: var( --gsuiTimeline-cursor-fill );
	stroke: var( --gsuiTimeline-cursor-fill );
	stroke-width: 2px;
	stroke-linejoin: round;
	pointer-events: none;
}
.gsuiTimeline-cursorPreview {
	opacity: .5;
}

/* .......................................................................... */
.gsuiTimeline-loop {
	position: absolute;
	height: 6px;
	transition: .1s;
	transition-property: opacity, visibility;
	opacity: 0;
	visibility: hidden;
}
.gsuiTimeline-looping .gsuiTimeline-loop {
	opacity: 1;
	visibility: visible;
}
.gsuiTimeline-loopBody {
	height: 100%;
	transition: filter .2s;
	background-color: var( --gsuiTimeline-loop-bg );
}

/* .......................................................................... */
.gsuiTimeline-loopHandle {
	position: absolute;
	inset: 0 auto -6px;
	width: 25%;
	min-width: 7px;
	max-width: 12px;
}
.gsuiTimeline-loopHandleA { left: -5px; }
.gsuiTimeline-loopHandleB { right: -5px; }

/* .......................................................................... */
.gsuiTimeline-loopBorder {
	position: absolute;
	inset: 0 auto;
	width: 2px;
	transition: .2s;
	transition-property: bottom, background-color;
	pointer-events: none;
}
.gsuiTimeline-loopBorderA { left: 0; }
.gsuiTimeline-loopBorderB { right: 0; }
</style>