
export function drawFrequencyLines(context = {}, animateRAF) {
  const { canvas, audioContext, audioSourceNode } = context;
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 1024;

  audioSourceNode.connect(analyserNode);
  audioSourceNode.connect(audioContext.destination);

  const canvasCtx = canvas.getContext("2d");
  const cvsHeight = canvas.height;
  const cvsHalfHeight = cvsHeight / 2;
  const cvsWidth = canvas.width;

  canvasCtx.translate(0, cvsHeight / 2);
  canvasCtx.scale(1, -1);

  function animate() {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, -cvsHalfHeight, cvsWidth, cvsHeight);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "#84019a";

    canvasCtx.beginPath();

    const sliceWidth = (cvsWidth * 1.0) / dataArray.length;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128;
      const y = (v * cvsHalfHeight) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth + 1;
    }

    canvasCtx.stroke();

    // Set your requestAnimationFrame to animateRAF!

    animateRAF = requestAnimationFrame(animate);
  }

  animate(animateRAF);
}

export function drawFrequencyBall(context = {}, animateRAF) {
const { canvas, audioContext, audioSourceNode } = context;
const analyserNode = audioContext.createAnalyser();
analyserNode.fftSize = 1024;

audioSourceNode.connect(analyserNode);
audioSourceNode.connect(audioContext.destination);

const canvasCtx = canvas.getContext("2d");
const cvsWidth = canvas.width;
const cvsHeight = canvas.height;

let ballRadius = 20; // Initial radius of the ball

function animate() {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(dataArray);

    // Clear canvas
    canvasCtx.clearRect(0, 0, cvsWidth, cvsHeight);

    // Draw the ball with size based on frequency
    canvasCtx.beginPath();
    canvasCtx.arc(cvsWidth / 2, cvsHeight / 2, ballRadius + (dataArray[100] / 128 * 20), 0, Math.PI * 2);
    canvasCtx.fillStyle = '#84019a';
    canvasCtx.fill();
    canvasCtx.closePath();

    // Set your requestAnimationFrame to animateRAF!
    animateRAF = requestAnimationFrame(animate);
}

animate();
}

export function drawJumpingBall(context = {}, animateRAF) {
const { canvas, audioContext, audioSourceNode } = context;
const analyserNode = audioContext.createAnalyser();
analyserNode.fftSize = 1024;

audioSourceNode.connect(analyserNode);
audioSourceNode.connect(audioContext.destination);

const canvasCtx = canvas.getContext("2d");
const cvsWidth = canvas.width;
const cvsHeight = canvas.height;

let jumpHeight = 50; // Initial jump height of the ball
let y = cvsHeight / 2; // Initial y position of the ball

function animate() {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(dataArray);

    // Clear canvas
    canvasCtx.clearRect(0, 0, cvsWidth, cvsHeight);

    // Draw the ball at the current position
    canvasCtx.beginPath();
    canvasCtx.arc(cvsWidth / 2, y, 20, 0, Math.PI * 2);
    canvasCtx.fillStyle = '#84019a';
    canvasCtx.fill();
    canvasCtx.closePath();

    // Update the y position based on frequency data
    y = cvsHeight / 2 - (dataArray[100] / 128 * jumpHeight);

    // Set your requestAnimationFrame to animateRAF!
    animateRAF = requestAnimationFrame(animate);
}

animate();
}