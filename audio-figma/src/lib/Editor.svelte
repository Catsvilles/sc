<svelte:head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js" integrity="sha512-xT0S/xXvkrfkRXGBPlzZPCAncnMK5c1N7slRkToUbv8Z901aUEuKO84tLy8dWU+3ew4InFEN7TebPaVMy2npZw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<style media="screen">
	/* .btn-footer {
		border-color: #111827;
		background: #515a63;
	} */

	.btn-footer:hover {
		background: #111827;
	}

	/* .neumorphism-shadow {
    box-shadow: inset 1px 1px 1px #fff, -9px -9px 9px #e6e6e6,
    9px 9px 20px rgba(199, 199, 199, 0.8);
  } */

	.dropdown:hover .dropdown-menu {
		display: block;
	}

	.cursor-btn-selected {
		background: #111827;
	}

	.custom-label input:checked + svg {
	display: block !important;
	}


	:root {
    --wp-controls-border-color: #000;
    --wp-controls-background-color: #f6f7f8;
    --wp-mute-solo-color: #b0b6bf;
    --wp-mute-solo-hover-color: #d1d5db;
    --wp-mute-solo-focus-color: rgba(52, 58, 64, 0.5);
    --wp-btn-danger-background-hover-color: #c82333;
    --wp-btn-danger-border-hover-color: #bd2130;
    --wp-btn-danger-background-color: #cd04188a;
    --wp-btn-danger-border-color: #dc3545;
    --wp-btn-danger-focus-color: rgba(225, 83, 97, 0.5);
    --wp-btn-danger-color: #fff;
    --wp-btn-info-background-hover-color: #111827;
    --wp-btn-info-border-hover-color: #c3c8d0;
    --wp-btn-info-background-color: #b0b6bf;
    --wp-btn-info-border-color: #111827;
    --wp-btn-info-focus-color: rgba(58, 176, 195, 0.5);
    --wp-btn-info-color: #fff;
    --wp-fade-background-color: rgba(0, 0, 0, 0.1);
    --wp-channel-color: #b0b6bf;
    --wp-channel-progress-color: #c3c8d0;
    --wp-cursor-color: black;
    --wp-selection-background-color: rgba(0, 0, 0, 0.1);
    --wp-selection-point-color: #d1d5db;
    --wp-tracks-container-background-color: #e0eff1;
    --wp-range-slider-label-color: black;
    --wp-range-slider-color: #b0b6bf;
    --wp-range-slider-focus-color: #b0b6bf;
    --wp-range-slider-background-color: #ddd;
    --wp-range-slider-background-focus-color: #bbb;
    --wp-annotation-box-border-color: grey;
    --wp-annotation-current-background-color: #ebf4f6;
    --wp-annotation-icon-hover-color: orange;
}

.playlist {
    margin: 2em 0;
}

.playlist *,
.playlist ::after,
.playlist ::before {
    box-sizing: border-box;
}

.playlist .btn:not(:disabled) {
    cursor: pointer;
}

.playlist .btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.playlist .btn-outline-dark {
    color: var(--wp-mute-solo-color);
    border-color: var(--wp-mute-solo-color);
}

.playlist .btn-outline-dark:hover {
    color: var(--wp-mute-solo-hover-color);
    background-color: var(--wp-mute-solo-color);
    border-color: var(--wp-mute-solo-color);
}

.playlist .btn-outline-dark:active:focus,
.playlist .btn-outline-dark:focus {
    box-shadow: 0 0 0 0.2rem var(--wp-mute-solo-focus-color);
}

.playlist .btn-danger {
    color: var(--wp-btn-danger-color);
    background-color: var(--wp-btn-danger-background-color);
    border-color: var(--wp-btn-danger-border-color);
    font-size: 12px!important;
}

.playlist .btn-danger:hover {
    color: var(--wp-btn-danger-color);
    background-color: var(--wp-btn-danger-background-hover-color);
    border-color: var(--wp-btn-danger-border-hover-color);
}

.playlist .btn-danger:active:focus,
.playlist .btn-danger:focus {
    box-shadow: 0 0 0 0.2rem var(--wp-btn-danger-focus-color);
}

.playlist .btn-info {
    color: var(--wp-btn-info-color);
    background-color: var(--wp-btn-info-background-color);
    border-color: var(--wp-btn-info-border-color);
}

.playlist .btn-info:hover {
    color: var(--wp-btn-info-color);
    background-color: var(--wp-btn-info-background-hover-color);
    border-color: var(--wp-btn-info-border-hover-color);
}

.playlist .btn-info:active:focus,
.playlist .btn-info:focus {
    box-shadow: 0 0 0 0.2rem var(--wp-btn-info-focus-color);
}

.playlist .btn-xs {
    padding: .25rem .4rem;
    font-size: .875rem;
    line-height: .5;
    border-radius: 9999px;
}

.playlist .btn-group {
    margin-bottom: 0.3rem;
}

.playlist .btn-group>.btn:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.playlist .btn-group>.btn:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.playlist .playlist-time-scale {
    height: 30px;
}

.playlist .playlist-tracks {
    background: var(--wp-tracks-container-background-color);
}

.playlist .channel {
    background: var(--wp-channel-color);
}

.playlist .channel-progress {
    background: var(--wp-channel-progress-color);
}

.playlist .cursor {
    background: var(--wp-cursor-color);
}

.playlist .wp-fade {
    background-color: var(--wp-fade-background-color);
}

.playlist .state-cursor,
.playlist .state-select {
    cursor: text;
}

.playlist .state-fadein {
    cursor: w-resize;
}

.playlist .state-fadeout {
    cursor: e-resize;
}

.playlist .state-shift {
    cursor: ew-resize;
}

.playlist .selection.point {
    background: var(--wp-selection-point-color);
}

.playlist .selection.segment {
    background: var(--wp-selection-background-color);
}

.playlist .channel-wrapper.silent .channel {
    opacity: 0.3;
}

.playlist .controls {
    background: var(--wp-controls-background-color);
    text-align: center;
    border-radius: 0.2rem;
    /* box-shadow: inset 1px 1px 1px #fff, -9px -9px 9px #e6e6e6, 0px 0px 20px rgb(199 199 199 / 80%); */



}

.playlist .controls .track-header {
    overflow: hidden;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.2rem;
    font-size: 0.75rem;
}

.playlist .controls .track-header button {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.playlist .controls label {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transform: translate(0, 0);
    padding: 0 1rem;
    margin-bottom: 0.2rem;
}

.playlist .controls label:before {
    color: var(--wp-range-slider-label-color);
    font-size: 18px;
    padding-right: 5px;
    -moz-osx-font-smoothing: grayscale;
}

.playlist .controls label:after {
    color: var(--wp-range-slider-label-color);
    font-size: 18px;
    padding-left: 5px;
}

.playlist .controls label.volume:before {
    font-family: "Font Awesome 5 Free";
    content: "\f027";
    font-weight: 600;
    color: #b0b6bf;
}

.playlist .controls label.volume:after {
    font-family: "Font Awesome 5 Free";
    content: "\f028";
    font-weight: 600;
    color: #b0b6bf;
}

.playlist .controls label.stereopan:before {
    content: "L";
    font-size: 12px;
}

.playlist .controls label.stereopan:after {
    content: "R";
    font-size: 12px;
}
.playlist .playlist-overlay { 
		border-bottom: 1px dashed gray;
	 }

	.playlist ::-webkit-scrollbar-track
		{
		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
		background-color: #F5F5F5;
		}

	.playlist ::-webkit-scrollbar
		{
		width: 10px;
		background-color: #F5F5F5;
		}

	.playlist ::-webkit-scrollbar-thumb
		{
		background-color: #c3c8d0;
		border: 2px solid #b0b6bf;
		}

		.btn-control {
		background-color: #384151;
		padding: 3px 6px;
		margin: 1px;
		font-size: 12px;
		line-height: 1.5;
		border-radius: 3px;
		cursor: pointer;
		}

		.btn-control:hover {
			background: #353739;
			color: #fff;
			border: 1px solid #fff;
		}
    .playlist .controls input[type="range"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: var(--wp-controls-background-color);
        display: inline-block;
        width: 75%;
    }

    .playlist .controls input[type="range"]::-webkit-slider-runnable-track {
        height: 5px;
        background: var(--wp-range-slider-background-color);
        border: none;
        border-radius: 3px;
    }

    .playlist .controls input[type="range"]::-moz-range-track {
        height: 5px;
        background: var(--wp-range-slider-background-color);
        border: none;
        border-radius: 3px;
    }

    .playlist .controls input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: none;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: var(--wp-range-slider-color);
        margin-top: -5px;
        cursor: ew-resize;
    }

    .playlist .controls input[type="range"]::-moz-range-thumb {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: none;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: var(--wp-range-slider-color);
        margin-top: -5px;
        cursor: ew-resize;
    }

    .playlist .controls input[type="range"]:focus {
        outline: none;
    }

    .playlist .controls input[type="range"]:focus::-webkit-slider-runnable-track {
        background: var(--wp-range-slider-background-focus-color);
    }

    .playlist .controls input[type="range"]:focus::-moz-range-track {
        background: var(--wp-range-slider-background-focus-color);
    }

    .playlist .controls input[type="range"]:focus::-webkit-slider-thumb {
        border: 2px solid var(--wp-range-slider-focus-color);
    }

    .playlist .controls input[type="range"]:focus::-moz-range-thumb {
        border: 2px solid var(--wp-range-slider-focus-color);
    }
    .track-drop { border: 1px dashed lightgray; }
    .track-drop.drag-enter { border: 1px solid gray; }
	/* .volume-slider, .stereopan-slider {
	-webkit-appearance: none;
	width: 95%;
	height: 6px;
	border-radius: 5px;
	background: #384151;
	outline: none;
	opacity: 0.7;
	-webkit-transition: .2s;
	transition: opacity .2s;
	}

	.volume-slider:hover, .stereopan-slider:hover {
	opacity: 1;
	}

	.volume-slider::-webkit-slider-thumb, .stereopan-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border-style: solid;
	border-color: #111827;
	background: #353739;
	cursor: pointer;
	}

	.volume-slider::-moz-range-thumb, .stereopan-slider::-moz-range-thumb {
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background: #353739;
	cursor: pointer;
	} */
</style>
</svelte:head>
<style>
.loader-dots div {
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.loader-dots div:nth-child(1) {
  left: 8px;
  animation: loader-dots1 0.6s infinite;
}
.loader-dots div:nth-child(2) {
  left: 8px;
  animation: loader-dots2 0.6s infinite;
}
.loader-dots div:nth-child(3) {
  left: 32px;
  animation: loader-dots2 0.6s infinite;
}
.loader-dots div:nth-child(4) {
  left: 56px;
  animation: loader-dots3 0.6s infinite;
}
@keyframes loader-dots1 {
  0% {
      transform: scale(0);
  }
  100% {
      transform: scale(1);
  }
}
@keyframes loader-dots3 {
  0% {
      transform: scale(1);
  }
  100% {
      transform: scale(0);
  }
}
@keyframes loader-dots2 {
  0% {
      transform: translate(0, 0);
  }
  100% {
      transform: translate(24px, 0);
  }
}
@media screen and (-webkit-min-device-pixel-ratio: 0) {
     
     input[type="range"]::-webkit-slider-thumb {
         width: 15px;
         -webkit-appearance: none;
     appearance: none;
         height: 15px;
         cursor: ew-resize;
         background: #FFF;
         box-shadow: -405px 0 0 400px #b0b6bf;
         border-radius: 50%;
     }
 }
</style>
<div class="relative mb-auto w-full rounded-lg text-gray-300 bg-gradient-to-r from-gray-600 to-gray-500 p-4">
  <!-- Loader -->
  <div id="editor_loader" class="hidden absolute z-50 w-full h-full flex items-center justify-center" style="background: rgba(0, 0, 0, 0.4);">
    <div class="bg-white border py-2 px-5 rounded-lg flex items-center flex-col">
      <div class="loader-dots block relative w-20 h-5 mt-2">
        <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-600"></div>
        <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-600"></div>
        <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-600"></div>
        <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-600"></div>
      </div>
      <div class="loading-text text-gray-800 text-xs font-light mt-2 text-center">
        Please wait...
      </div>
    </div>
  </div>
    <div class="flex md:-mx-2">
      <!-- Right Side -->
      <div class="w-full bg-cover bg-fixed p-2 md:mx-2 h-full">
        <!-- <div class="track-drop p-7 mt-4 bg-gray-200 bg-opacity-75 rounded-lg">
          Drop your files here.
         </div> -->
        <div class="flex flex-wrap justify-center items-center mb-2 editor-footer"> 
          <!-- Fade Controls -->
          <div class="inline-flex justify-items-end">
            <div title="Fade In" class="btn-fadein cursor-btn group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-l-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-14 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Fade In
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg class="h-5 w-5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" fill="white" enable-background="new 0 0 1000 1000" xml:space="preserve">
              <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
              <g><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M9458.3,5042.1c-38.5-19.3-89.9-66.4-113.4-104.9c-42.8-68.5-42.8-102.7-42.8-4826.6c0-4706.8,0-4758.2,42.8-4826.6c85.6-139.1,286.8-175.5,426-74.9c141.3,98.4,132.7-265.4,126.3,4944.4l-6.4,4719.6l-47.1,66.4C9753.7,5065.6,9593.1,5108.4,9458.3,5042.1z"/><path d="M8317.4,4033.9c-40.7-21.4-96.3-70.6-122-111.3l-49.2-72.8V-390.3c0-4165.2,0-4242.3,42.8-4308.7c119.9-196.9,378.8-201.2,507.3-8.5l49.2,72.8v4229.5c0,3983.3-2.1,4233.8-38.5,4302.3C8632.1,4046.8,8458.7,4106.7,8317.4,4033.9z"/><path d="M7163.7,2876c-40.6-19.3-94.2-64.2-117.7-96.3l-44.9-59.9l-6.4-3643c-4.3-2525.7,0-3666.5,17.1-3722.2c40.7-141.3,211.9-237.6,357.5-199.1c32.1,6.4,94.2,49.2,139.1,94.2l81.3,83.5v3685.8c0,4116,15,3758.6-149.8,3850.6C7341.4,2925.2,7260.1,2927.3,7163.7,2876z"/><path d="M5990.8,1737.3c-38.5-21.4-85.6-72.8-107-111.3c-36.4-66.3-38.5-226.9-38.5-3163.5v-3092.9l49.2-77c130.6-211.9,438.8-181.9,526.6,51.4c32.1,81.3,34.2,385.3,30,3161.4c-6.4,2921.7-8.5,3075.8-44.9,3131.4C6316.2,1773.6,6125.6,1820.7,5990.8,1737.3z"/><path d="M4905.6,645.6c-32.1-10.7-79.2-36.4-102.7-57.8c-107-96.3-102.7,21.4-102.7-2686.2c0-2472.2,2.1-2534.2,42.8-2600.6c119.9-196.9,378.9-201.2,507.3-8.5l49.2,72.8V-2107c0,2859.6,15,2632.7-171.2,2726.9C5027.6,671.3,5001.9,673.5,4905.6,645.6z"/><path d="M3717.7-505.9c-40.7-19.3-94.2-64.2-117.7-96.3c-45-59.9-45-77.1-51.4-2012c-4.3-1337.8,0-1977.8,17.1-2031.3c40.7-141.3,211.9-237.6,357.5-199.1c32.1,6.4,94.2,49.2,139.1,94.2l81.3,83.5V-2672c0,1964.9,0,1997-42.8,2065.5C4021.6-478.1,3856.8-433.1,3717.7-505.9z"/><path d="M2536.2-1651c-143.4-96.3-137-27.8-137-1577.5c0-1363.5,2.1-1404.1,42.8-1474.8c128.4-216.2,445.2-188.3,535.1,47.1c30,79.2,32.1,241.9,27.8,1470.5c-6.4,1290.7-8.6,1387-44.9,1440.5C2867.9-1601.8,2671-1559,2536.2-1651z"/><path d="M1453.1-2738.4c-72.8-21.4-171.2-122-188.4-196.9c-6.4-25.7-8.6-430.2-6.4-896.8l6.4-849.8l62.1-64.2c115.6-119.9,286.8-137,408.8-40.7c113.4,89.9,117.7,117.7,117.7,1006c0,937.5,0,931.1-171.2,1018.8C1579.4-2710.5,1555.9-2708.4,1453.1-2738.4z"/><path d="M271.6-3887.8c-137-68.5-162.7-126.3-169.1-404.6c-8.6-297.5,2.1-370.3,72.8-455.9c113.4-134.8,318.9-134.8,447.3,0c64.2,66.3,64.2,66.3,70.6,370.3c8.6,348.9-8.6,406.7-145.5,483.8C449.3-3838.5,367.9-3836.4,271.6-3887.8z"/></g></g>
              </svg>
            </div>
            <div title="Fade Out" class="btn-fadeout cursor-btn group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-16 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Fade Out
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg class="h-5 w-5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="white" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
              <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
              <g><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M264.9,5043.2c-38.6-19.3-92.1-64.3-117.8-100.7l-47.1-66.4V110v-4766.1l51.4-72.8c55.7-75,158.5-130.7,248.5-130.7c83.5,0,209.9,72.8,250.6,145.7c36.4,60,38.6,329.9,38.6,4824s-2.1,4764-36.4,4824c-45,75-171.4,145.7-257.1,145.7C363.5,5079.6,303.5,5062.5,264.9,5043.2z"/><path d="M1417.4,4036.4c-40.7-21.4-96.4-70.7-122.1-111.4l-49.3-72.8V-391.3c0-4168.5,0-4245.6,42.8-4312c120-197.1,379.2-201.3,507.7-8.6l49.3,72.8v4243.5c0,4168.5,0,4245.6-42.8,4312C1719.4,4055.7,1552.3,4107.1,1417.4,4036.4z"/><path d="M2550.5,2871.1c-160.7-96.4-147.8,259.2-147.8-3853.6v-3688.7l81.4-83.5c92.1-90,162.8-115.7,269.9-96.4c94.2,17.1,169.2,79.2,214.2,171.4c32.1,66.4,34.3,396.3,34.3,3712.2c0,3420.9-2.1,3641.5-38.6,3710.1C2884.7,2899,2696.2,2959,2550.5,2871.1z"/><path d="M3685.8,1731.6c-40.7-25.7-90-81.4-109.2-122.1c-36.4-70.7-38.6-263.5-38.6-3131.7c0-3371.6-8.6-3176.7,130.7-3275.2c139.2-98.5,340.6-62.1,426.3,77.1c42.8,68.5,42.8,115.7,42.8,3183.1c0,3050.3,0,3116.7-42.8,3183.1C4013.6,1783,3820.8,1823.7,3685.8,1731.6z"/><path d="M4866.1,619.8c-186.4-94.2-171.4,132.8-171.4-2726.9c0-2467.7,2.1-2529.8,42.8-2596.2c120-197.1,379.2-201.3,507.7-8.6l49.3,72.8v2540.5c0,2480.5-2.1,2542.6-42.8,2609C5166,654.1,5016.1,696.9,4866.1,619.8z"/><path d="M6007.8-502.6c-38.6-19.3-90-66.4-113.5-105c-42.8-68.5-42.8-105-42.8-2067.1v-1996.4l81.4-83.5c45-45,107.1-87.8,139.2-94.3c81.4-21.4,192.8,4.3,261.3,57.8c122.1,96.4,117.8,21.4,117.8,2131.4c0,1810-2.1,1949.3-38.5,2017.8c-19.3,40.7-62.1,92.1-92.1,115.7C6241.3-468.4,6093.5-457.6,6007.8-502.6z"/><path d="M7168.8-1625.1c-57.8-23.6-130.7-105-158.5-177.8c-15-40.7-23.6-509.8-23.6-1418.1c0-1201.7,4.3-1368.8,34.3-1445.9c90-224.9,398.4-254.9,524.8-51.4c42.8,70.7,42.8,90,45,1484.5c0,1561.6,4.3,1499.4-139.2,1587.3C7380.9-1601.5,7246-1592.9,7168.8-1625.1z"/><path d="M8368.4-2732.5c-77.1-21.4-165-96.4-194.9-169.2c-23.6-57.8-30-242.1-30-901.8c0-786.2,2.1-835.4,42.8-899.7c120-197.1,379.2-201.3,507.7-8.6c49.3,72.8,49.3,75,49.3,921.1c0,803.3-2.1,852.5-42.8,916.8c-21.4,38.6-62.1,83.5-90,100.7C8552.6-2736.8,8430.5-2715.4,8368.4-2732.5z"/><path d="M9456.6-3887.1c-134.9-68.5-156.4-137.1-156.4-479.8v-304.2l81.4-83.5c45-45,107.1-87.8,139.2-94.3c81.4-21.4,192.8,4.3,261.3,57.8c94.3,75,117.8,160.7,117.8,439.1s-25.7,364.2-130.7,441.3C9690.1-3852.8,9542.3-3842.1,9456.6-3887.1z"/></g></g>
              </svg>
            </div>
            <div class="dropdown mr-2 inline-block cursor-pointer relative">
              <div class="btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-r-full px-4 py-1 inline-flex items-center">
                <span class="mr-1">Envelope</span>
                <svg class="fill-current h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/> </svg>
              </div>
              <ul class="dropdown-menu hidden absolute z-50 ml-0 pt-1 bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75">
                <span class="btn-logarithmic rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-gray-600">Logarithmic </span>
                <span class="btn-linear rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-gray-600">Linear</span>
                <span class="btn-exponential rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-gray-600">Exponential </span>
                <span class="btn-scurve rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-gray-600">S-Curve </span>
              </ul>
            </div>
          </div>
          <div class="inline-flex mr-2">
            <div title="Trim" class="btn-trim-audio cursor-btn group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-l-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-10 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Trim
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              Trim
            </div>
            <div class="btn-loop group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-r-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-11 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Loop
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat h-6 w-6" viewBox="0 0 24 24" stroke-width="1.5" stroke="#d1d5db" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
                <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" />
              </svg>
            </div>
          </div>
          <div class="inline-flex">
            <div title="Switch to Cursor" class="btn-cursor cursor-btn group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-l-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-28 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Switch to Cursor
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div title="Switch to Select" class="btn-select cursor-btn cursor-btn-selected group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 px-4 py-2 active">
              <div style="background:#111827;" class="whitespace-nowrap	w-28 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Switch to Select
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#d1d5db" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line x1="11" y1="5" x2="17" y2="5" />
                <line x1="7" y1="19" x2="13" y2="19" />
                <line x1="14" y1="5" x2="10" y2="19" />
              </svg>
            </div>
            <div title="Shift Audio Tracks" class="btn-shift cursor-btn group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-20 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Shift Tracks
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#d1d5db" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <polyline points="7 8 3 12 7 16" />
                <polyline points="17 8 21 12 17 16" />
                <line x1="3" y1="12" x2="21" y2="12" />
              </svg>
            </div>
            <div title="Copy" class="btn-copy-audio group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-11 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Copy
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div title="Cut" class="btn-cut-audio group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-9 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Cut
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
              </svg>
            </div>
            <div title="Paste" class="btn-paste-audio group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-r-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-12 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Paste
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div on:click="{toggleComments}" class="flex ml-auto group relative mr-1 btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-full px-4 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <div style="background:#111827;" class="whitespace-nowrap	w-20 opacity-0 text-xs rounded py-1 right-0
             absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
              Comments
              <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </div>            
          </div>
        </div>
        <div id="playlist"></div>
        <div class="flex flex-wrap md:flex-nowrap">
          <div class="flex items-start justify-start mt-2 w-full editor-footer">
            <div class="btn-pause group mr-1 btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-12 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Pause
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#d1d5db" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            </div>
            <div class="btn-play group relative mr-1 btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-10 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Play
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#d1d5db" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M7 4v16l13 -8z" />
              </svg>
            </div>
            <div class="btn-stop mr-1 group relative btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-10 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Stop
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#d1d5db" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            </div>
            <div class="btn-record group relative mr-4 btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-13 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Record
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <div class="items-center justify-center">
            <div class="ml-8 absolute text-md">
              <span class="relative audio-pos" aria-label="Audio position"></span>
            </div>
            <div class="flex items-center mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <input type="range" min="0" max="100" value="100" class="master-gain rounded-lg overflow-hidden appearance-none bg-gray-300 h-3 w-128" id="master-gain">
            </div>
          </div>
          <div class="flex items-end justify-end mt-2 w-full editor-footer">
            <!-- Scale controls -->
            <div class="btn-zoom-in group relative mr-1 btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-16 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Zoom In
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
            </div>
            <div class="btn-zoom-out group relative mr-1 btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-full px-4 py-2">
              <div style="background:#111827;" class="whitespace-nowrap	w-20 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                Zoom Out
                <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </div>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path></svg>
            </div>
            <label class="custom-label mb-0.5 group relative flex rounded">
                <div style="background:#111827;" class="whitespace-nowrap	w-24 opacity-0 text-xs rounded py-1 right-0 absolute z-10 group-hover:opacity-100 bottom-10 -left-full ml-12 px-2 pointer-events-none">
                  Auto Scrolling
                  <svg style="color:#111827;"class="absolute h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                </div>
                <div class="bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 btn-footer cursor-pointer shadow w-8 h-8 flex justify-center items-center mr-1">
                  <input type="checkbox" class="automatic-scroll hidden" checked>
                  <svg class="hidden w-6 h-6 pointer-events-none" viewBox="0 0 172 172"><g fill="none" stroke-width="none" stroke-miterlimit="10" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode:normal"><path d="M0 172V0h172v172z"/><path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z" fill="currentColor" stroke-width="1"/></g></svg>
                </div>
            </label>
            <div class="dropdown mr-2 inline-block cursor-pointer relative">
              <div class="btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-full px-4 py-1.5 inline-flex items-center">
                <span class="mr-1">Export</span>
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </div>
              <ul class="dropdown-menu hidden absolute z-50 ml-1 pt-1 w-11/12	rounded- bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75">
                <span class="btn-download rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-gray-600">WAV</span>
                <span class="btn-export-mp3 rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-gray-600">MP3</span>
                <span class="btn-export-stems rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-gray-600">Stems</span>
              </ul>
            </div>
          </div>
        </div>
        <div class="w-full mx-auto mt-4">
          <textarea class="bg-gradient-to-r from-gray-800 to-gray-700 h-20 w-full shadow-xl rounded-xl overflow-hidden resize-none focus:border-gray-500 ring-1 ring-transparent focus:ring-gray-500 focus:outline-none p-2 transition ease-in-out duration-300" placeholder="Type your comment here. . ."></textarea>
          <div class="flex justify-end">
            <div class="flex ml-auto group relative mr-1 btn-footer cursor-pointer shadow bg-gradient-to-r from-gray-800 to-gray-700 bg-opacity-75 rounded-full px-4 py-1">
              Post            
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
<script>
  import { editor } from './../stores/player';
  import { onMount } from 'svelte';
  // import * as WaveformPlaylist from 'waveform-playlist';
  import toWav from 'audiobuffer-to-wav';
  import JSZip from "jszip";
  function toggleComments(){
    const cms = document.querySelector('.comments');
    cms.classList.toggle("hidden");
  }


  const removeAllSongs = () => {
    $editor = [];
  };

  export const rem = () => {
      // console.log(ee.emit("play"));
  }

  const removeSong = songUrl => {
    $editor = $editor.filter(song => song.url !== songUrl);
  };

  onMount(async () => {
    var userMediaStream;
    var constraints = { audio: true };

    function logError(err) {
      //alert("Please allow access to your microphone for recording!");
    }

    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    function gotStream(stream) {
      userMediaStream = stream;
      playlist.initRecorder(userMediaStream);
      jQuery(".btn-record").removeClass("disabled");
    }

    const playlist = window.WaveformPlaylist.init({
      samplesPerPixel: 3000,
      waveHeight: 100,
      container: document.getElementById("playlist"),
      state: 'select',
      colors: {
        waveOutlineColor: '#eceef1',
        timeColor: '#333',
        fadeColor: 'black'
      },
      timescale: true,
      controls: {
        show: true, //whether or not to include the track controls
        width: 150, //width of controls in pixels,
        // whether to render the widget or not in the controls panel.
        widgets: {
          // Stereo pan slider
          stereoPan: true,
        },
      },
      seekStyle : 'line',
      zoomLevels: [500, 1000, 3000, 5000]
    });

    playlist.initExporter();

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia(constraints)
      .then(gotStream)
      .catch(logError);
    } else if (navigator.getUserMedia && 'MediaRecorder' in window) {
      navigator.getUserMedia(
        constraints,
        gotStream,
        logError
      );
    }

    editor.subscribe(value => {
      let isInEditor;
      value.forEach(function(entry) {
        isInEditor = !!playlist.tracks.find(t => t.src === entry.url);

        if (value.length !== 0 && !isInEditor) {
          playlist.load([{
            src: entry.url,
            name: entry.title
          }]);
        }  
      });
      //Remove track from EditorButton.svelte click      
      const trackToRemove  = playlist.tracks.filter(function(array_el){
          return $editor.filter(function(anotherOne_el){
              return anotherOne_el.url == array_el.src;
          }).length == 0
      });

      //Notee removing only S3 tracks, since local files user selected dare nt in $editor store 
      if (trackToRemove.length) {
          if (typeof trackToRemove[0].src == 'string') {
            ee.emit("removeTrack", trackToRemove[0]);
          }
       }
    });
    jQuery( document ).ready(function() {
      jQuery('.editor-footer').on('click', '.cursor-btn', function() {
        jQuery(this).addClass('cursor-btn-selected').siblings().removeClass('cursor-btn-selected');
      });
    });
    /*
     * This script is provided to give an example how the playlist can be controlled using the event emitter.
     * This enables projects to create/control the useability of the project.
    */
    var ee = playlist.getEventEmitter();
    var jQuerycontainer = jQuery("body");
    var jQuerytimeFormat = jQuerycontainer.find('.time-format');
    var jQueryaudioStart = jQuerycontainer.find('.audio-start');
    var jQueryaudioEnd = jQuerycontainer.find('.audio-end');
    var jQuerytime = jQuerycontainer.find('.audio-pos');
    var format = "hh:mm:ss.uuu";
    var startTime = 0;
    var endTime = 0;
    var audioPos = 0;
    var downloadUrl = undefined;
    var isLooping = false;
    var playoutPromises;

    function toggleActive(node) {
      var active = node.parentNode.querySelectorAll('.active');
      var i = 0, len = active.length;

      for (; i < len; i++) {
        active[i].classList.remove('active');
      }

      node.classList.toggle('active');
    }

    function cueFormatters(format) {

      function clockFormat(seconds, decimals) {
        var hours,
            minutes,
            secs,
            result;

        hours = parseInt(seconds / 3600, 10) % 24;
        minutes = parseInt(seconds / 60, 10) % 60;
        secs = seconds % 60;
        secs = secs.toFixed(decimals);

        result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (secs < 10 ? "0" + secs : secs);

        return result;
      }

      var formats = {
        "seconds": function (seconds) {
            return seconds.toFixed(0);
        },
        "thousandths": function (seconds) {
            return seconds.toFixed(3);
        },
        "hh:mm:ss": function (seconds) {
            return clockFormat(seconds, 0);
        },
        "hh:mm:ss.u": function (seconds) {
            return clockFormat(seconds, 1);
        },
        "hh:mm:ss.uu": function (seconds) {
            return clockFormat(seconds, 2);
        },
        "hh:mm:ss.uuu": function (seconds) {
            return clockFormat(seconds, 3);
        }
      };

      return formats[format];
    }

    function updateSelect(start, end) {
      if (start < end) {
        jQuery('.btn-trim-audio').removeClass('disabled');
        jQuery('.btn-loop').removeClass('disabled');
      }
      else {
        jQuery('.btn-trim-audio').addClass('disabled');
        jQuery('.btn-loop').addClass('disabled');
      }

      jQueryaudioStart.val(cueFormatters(format)(start));
      jQueryaudioEnd.val(cueFormatters(format)(end));

      startTime = start;
      endTime = end;
    }

    function updateTime(time) {
      jQuerytime.html(cueFormatters(format)(time));

      audioPos = time;
    }

    updateSelect(startTime, endTime);
    updateTime(audioPos);



    /*
    * Code below sets up events to send messages to the playlist.
    */
    // jQuerycontainer.on("click", ".btn-playlist-state-group", function() {
    //   //reset these for now.
    //   jQuery('.btn-fade-state-group').addClass('hidden');
    //   jQuery('.btn-select-state-group').addClass('hidden');

    //   if (jQuery('.btn-select').hasClass('active')) {
    //     jQuery('.btn-select-state-group').removeClass('hidden');
    //   }

    //   if (jQuery('.btn-fadein').hasClass('active') || jQuery('.btn-fadeout').hasClass('active')) {
    //     jQuery('.btn-fade-state-group').removeClass('hidden');
    //   }
    // });

      jQuery('.library-nav :checkbox').change(function() {
        if (this.checked) {
          var name = jQuery(this).data("name") || "Library Track";
          var xhr = new XMLHttpRequest();
          xhr.open('GET', jQuery(this).data("src"), true);
          xhr.responseType = 'arraybuffer';

          xhr.onload = function(e) {
            if (this.status == 200) {
              var audioData = xhr.response;
              playlist.load([{
                src: new Blob([audioData], { type: 'audio/ogg; codecs=opus' }),
                name: name,
              }]);
            }
          };

          xhr.send();
        } else {
          var track = playlist.tracks.find(obj => {
          	return obj.name === jQuery(this).data("name")
          });
          if (track.name === jQuery(this).data("name")) {
            ee.emit("removeTrack", track)
          }
        }
      });

    jQuerycontainer.on("click", ".btn-loop", function() {
      isLooping = true;
      playoutPromises = playlist.play(startTime, endTime);
    });

    jQuerycontainer.on("click", ".btn-play", function() {
      ee.emit("play");
    });
    jQuery(window).keypress(function(e) {
        if (e.which === 32) {
          if (playlist.isPlaying()) {
            isLooping = false;
            ee.emit("pause");
          } else {
            ee.emit("play");
          }
        }
    });
    ee.on("removeTrack", function(track) {
      removeSong(track.src);
    });

    jQuerycontainer.on("click", ".btn-pause", function() {
      isLooping = false;
      ee.emit("pause");
    });

    jQuerycontainer.on("click", ".btn-stop", function() {
      isLooping = false;
      ee.emit("stop");
    });

    jQuerycontainer.on("click", ".btn-rewind", function() {
      isLooping = false;
      ee.emit("rewind");
    });

    jQuerycontainer.on("click", ".btn-fast-forward", function() {
      isLooping = false;
      ee.emit("fastforward");
    });

    jQuerycontainer.on("click", ".btn-clear", function() {
      isLooping = false;
      ee.emit("clear");
    });

    jQuerycontainer.on("click", ".btn-record", function() {
      ee.emit("record");
    });

    //track interaction states
    jQuerycontainer.on("click", ".btn-cursor", function() {
      ee.emit("statechange", "cursor");
      toggleActive(this);
    });

    jQuerycontainer.on("click", ".btn-select", function() {
      ee.emit("statechange", "select");
      toggleActive(this);
    });

    jQuerycontainer.on("click", ".btn-shift", function() {
      ee.emit("statechange", "shift");
      toggleActive(this);
    });

    jQuerycontainer.on("click", ".btn-fadein", function() {
      ee.emit("statechange", "fadein");
      toggleActive(this);
    });

    jQuerycontainer.on("click", ".btn-fadeout", function() {
      ee.emit("statechange", "fadeout");
      toggleActive(this);
    });

    //fade types
    jQuerycontainer.on("click", ".btn-logarithmic", function() {
      ee.emit("fadetype", "logarithmic");
      toggleActive(this);
    });

    jQuerycontainer.on("click", ".btn-linear", function() {
      ee.emit("fadetype", "linear");
      toggleActive(this);
    });

    jQuerycontainer.on("click", ".btn-scurve", function() {
      ee.emit("fadetype", "sCurve");
      toggleActive(this);
    });

    jQuerycontainer.on("click", ".btn-exponential", function() {
      ee.emit("fadetype", "exponential");
      toggleActive(this);
    });

    //zoom buttons
    jQuerycontainer.on("click", ".btn-zoom-in", function() {
      ee.emit("zoomin");
    });

    jQuerycontainer.on("click", ".btn-zoom-out", function() {
      ee.emit("zoomout");
    });

    jQuerycontainer.on("click", ".btn-trim-audio", function() {
      ee.emit("trim");
    });

    jQuerycontainer.on("click", ".btn-copy-audio", function() {
      ee.emit("copy");
    });

    jQuerycontainer.on("click", ".btn-cut-audio", function() {
      ee.emit("cut");
    });

    jQuerycontainer.on("click", ".btn-paste-audio", function() {
      ee.emit("paste");
    });

    jQuerycontainer.on("click", ".btn-info", function() {
    });

    jQuerycontainer.on("click", ".btn-download", function () {
      ee.emit('startaudiorendering', 'wav');
    });

    async function toMp3(buff) {
      const mp3encoder = new lamejs.Mp3Encoder(buff.numberOfChannels, buff.sampleRate, 320);
      var mp3Data = [];

      var lo = buff.getChannelData(0); //the decoded data range: -1 +1
          var ro = buff.getChannelData(1);
          var left = new Float32Array(lo.length); //The transformed data, this is what you will pass to lame instead
          var right = new Float32Array(ro.length);

          //Convert to required format
          for(var i=0;i<lo.length;i++) {
              left[i] = lo[i]*32767.5;
              right[i] = ro[i]*32767.5;
          }
      const sampleBlockSize = 1152; //can be anything but make it a multiple of 576 to make encoders life easier
      for (var i = 0; i < lo.length; i += sampleBlockSize) {
      const leftChunk = left.subarray(i, i + sampleBlockSize);
      const rightChunk = right.subarray(i, i + sampleBlockSize);
      var mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
      }
      var mp3buf = mp3encoder.flush();   //finish writing mp3

      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
      var blob = new Blob(mp3Data, {type: 'audio/mp3'});
      return blob;
    }

    jQuerycontainer.on("click", ".btn-export-mp3", function () {
      jQuery("#editor_loader").removeClass("hidden");
      displayLoadingData("Exporting to MP3");
      ee.emit('startaudiorendering', 'buffer');
      ee.on('audiorenderingfinished', async function (type, data) {
        const mp3Blob = await toMp3(data);
        const url = window.URL.createObjectURL(mp3Blob)
        jQuery("#editor_loader").addClass("hidden")
        downloadLink(url, '.mp3');
      });
    });

    jQuerycontainer.on("click", ".btn-export-stems", async function () {
      jQuery("#editor_loader").removeClass("hidden");
      displayLoadingData("Rendering Your Stems");
      const renderedStems = [];
      const durations = [];
      for(let i = 0; playlist.tracks.length > i; i++) {
          durations.push(playlist.tracks[i].endTime)
      }
      const duration = Math.max(...durations);

      for(let i = 0; playlist.tracks.length > i; i++) {
          const offlineCtx = new OfflineAudioContext(
            2,
            44100 * duration,
            44100
          );

          const source = offlineCtx.createBufferSource();
          source.buffer = playlist.tracks[i].buffer;
          source.connect(offlineCtx.destination);
          source.start(playlist.tracks[i].startTime);         
          try {
            const renderedBuffer = await offlineCtx.startRendering();
            var wav = toWav(renderedBuffer)
            var blob = new window.Blob([ new DataView(wav) ], {
              type: 'audio/wav'
            })
            renderedStems.push(blob);
            // var url = window.URL.createObjectURL(blob)
            // playlist.load([{
            //     src: url,
            //     name: "lalal"
            // }]);
          } catch (error) {
        }
      }
      displayLoadingData("Creating a Zip");
      var zip = new JSZip();
      renderedStems.forEach(function(url, index){
        var filename = "stem_" + index + ".wav";
        zip.file(filename, url);
      });
      const content = await zip.generateAsync({type:'blob'});
      const downloadUrl = window.URL.createObjectURL(content);
      jQuery("#editor_loader").addClass("hidden");
      downloadLink(downloadUrl, '.zip');              
    });

    jQuerycontainer.on("click", ".btn-seektotime", function () {
      var time = parseInt(document.getElementById("seektime").value, 10);
      ee.emit("select", time, time);
    });

    jQuerycontainer.on("change", ".select-seek-style", function (node) {
      playlist.setSeekStyle(node.target.value);
    });

    //track drop
    jQuerycontainer.on("dragenter", ".track-drop", function(e) {
      e.preventDefault();
      e.target.classList.add("drag-enter");
    });

    jQuerycontainer.on("dragover", ".track-drop", function(e) {
      e.preventDefault();
    });

    jQuerycontainer.on("dragleave", ".track-drop", function(e) {
      e.preventDefault();
      e.target.classList.remove("drag-enter");
    });

    jQuerycontainer.on("drop", ".track-drop", function(e) {
      e.preventDefault();
      e.target.classList.remove("drag-enter");

      var dropEvent = e.originalEvent;

      for (var i = 0; i < dropEvent.dataTransfer.files.length; i++) {
        ee.emit("newtrack", dropEvent.dataTransfer.files[i]);
      }
    });

    jQuerycontainer.on("change", ".time-format", function(e) {
      format = jQuerytimeFormat.val();
      ee.emit("durationformat", format);

      updateSelect(startTime, endTime);
      updateTime(audioPos);
    });

    jQuerycontainer.on("input change", ".master-gain", function(e){
      ee.emit("mastervolumechange", e.target.value);
    });

    jQuerycontainer.on("change", ".continuous-play", function(e){
      ee.emit("continuousplay", jQuery(e.target).is(':checked'));
    });

    jQuerycontainer.on("change", ".link-endpoints", function(e){
      ee.emit("linkendpoints", jQuery(e.target).is(':checked'));
    });

    jQuerycontainer.on("change", ".automatic-scroll", function(e){
      ee.emit("automaticscroll", jQuery(e.target).is(':checked'));
    });

    function displaySoundStatus(status) {
      jQuery(".sound-status").html(status);
    }

    function displayLoadingData(data) {
      var info = jQuery(".loading-text").text(data);
      jQuery(".loading-text").append(info);
    }

    function downloadLink(link, format) {
      var dateString = (new Date()).toISOString();
      var anchor = document.createElement('a')
      document.body.appendChild(anchor)
      anchor.style = 'display: none'
      anchor.href = link
      anchor.download = dateString + format;
      anchor.click()
      window.URL.revokeObjectURL(link)
    }

    /*
    * Code below receives updates from the playlist.
    */
    ee.on("select", updateSelect);

    ee.on("timeupdate", updateTime);

    ee.on("mute", function(track) {
      displaySoundStatus("Mute button pressed for " + track.name);
    });

    ee.on("solo", function(track) {
      displaySoundStatus("Solo button pressed for " + track.name);
    });

    ee.on("volumechange", function(volume, track) {
      displaySoundStatus(track.name + " now has volume " + volume + ".");
    });

    ee.on("mastervolumechange", function(volume) {
      displaySoundStatus("Master volume now has volume " + volume + ".");
    });


    var audioStates = ["uninitialized", "loading", "decoding", "finished"];

    ee.on("audiorequeststatechange", function(state, src) {
      jQuery("#editor_loader").removeClass("hidden");
      let name; 
      if (src instanceof File) {
        name = src.name;
      } else {
        name = src.split("/").pop().replaceAll('-', ' ');
      }

      displayLoadingData("Track " + name + " is " + audioStates[state]);
    });

    ee.on("loadprogress", function(percent, src) {
      let name; 
      if (src instanceof File) {
        name = src.name;
      } else {
        name = src.split("/").pop().replaceAll('-', ' ');
      }

      displayLoadingData("Track " + name + " has loaded " + Math.round(percent) + "%");
    });

    ee.on("audiosourcesloaded", function() {
      displayLoadingData("Tracks have all finished decoding.");
      jQuery("#editor_loader").addClass("hidden");
    });

    ee.on("audiosourcesrendered", function() {
      displayLoadingData("Tracks have been rendered");
    });

    ee.on("audiosourceserror", function(e) {
      displayLoadingData(e.message);
    });

    ee.on('audiorenderingfinished', function (type, data) {
      if (type == 'wav'){
        if (downloadUrl) {
          window.URL.revokeObjectURL(downloadUrl);
        }

        downloadUrl = window.URL.createObjectURL(data);
        downloadLink(downloadUrl, '.wav');
      }
    });

    ee.on('finished', function () {
      if (isLooping) {
        playoutPromises.then(function() {
          playoutPromises = playlist.play(startTime, endTime);
        });
      }
    });

});
</script>