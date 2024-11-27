<script lang="ts">
  import player from "@app/stores/player";
  import { onMount } from 'svelte';

  export let stream : MediaStream;
  let waveCanvas: HTMLCanvasElement;

  onMount(async () => {   
     // Canvas variables
    const barWidth = 1;
    const barGutter = 2;
    const barColor = "#818cf8";
    let bars = [];
    let width = 0;
    let height = 0;
    let halfHeight = 0;
    let drawing = false;
    let isRecording = true;
    let canvasContext = waveCanvas.getContext('2d');


    // Setup the canvas to draw the waveform
  const setupWaveform = () => {   
    width = waveCanvas.offsetWidth;
    height = waveCanvas.offsetHeight;
    halfHeight = waveCanvas.offsetHeight / 2;

    canvasContext.canvas.width = width;
    canvasContext.canvas.height = height;
    }

    const getAverageVolume = array => {
      const length = array.length;
      let values = 0;
      let i = 0;
      for (; i < length; i++) {
          values += array[i];
      }
      return values / length;
    }

      // Render the bars
  const renderBars = bars => {
    if (!drawing) {
      drawing = true;

      window.requestAnimationFrame(() => {
        canvasContext.clearRect(0, 0, width, height);
        bars.forEach((bar, index) => {
          canvasContext.fillStyle = barColor;
          canvasContext.fillRect((index * (barWidth + barGutter)), halfHeight, barWidth, (halfHeight * (bar / 100)));
          canvasContext.fillRect((index * (barWidth + barGutter)), (halfHeight - (halfHeight * (bar / 100))), barWidth, (halfHeight * (bar / 100)));
        });

         drawing = false;
      });
    }
  }

  async function connectMic() {
    const ctx = $player.context;
    const analyser = ctx.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;    
    if(stream){        
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);        
    }
    setupWaveform();
    // Process the microphone input
    const processInput = () => {
      if (isRecording) {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        bars.push(getAverageVolume(array));       
        if (bars.length <= Math.floor(width / (barWidth + barGutter))) {       
            renderBars(bars);
        } else {
            renderBars(bars.slice(bars.length - Math.floor(width / (barWidth + barGutter))), bars.length);
        }

      } else {
        bars = [];
      }
    }
      let step = () => {
          processInput();          
          window.requestAnimationFrame(step)
      }
      step();
    }

  if ($player.isRecording) {
    connectMic();
  } else {
    console.log("NO START MIC");
  }

	});
</script>
<div class="">
    <canvas bind:this={waveCanvas} class="waveform__canvas" width="480" height="64"></canvas>
</div>