<script>
  export let title = "";
  
  function splitText(text, charLimit) {
    const words = text.split(" ");
    let lines = [""];
    let currentLine = 0;

    words.forEach(word => {
      if (lines[currentLine].length + word.length + 1 <= charLimit) {
        lines[currentLine] += word + " ";
      } else {
        lines.push(word + " ");
        currentLine++;
      }
    });

    return lines;
  }

  let textLines = splitText(title, 20); // Adjust char limit based on width of the container
</script>
<div class="crt-screen"><svg viewBox="0 0 300 200" xmlns='http://www.w3.org/2000/svg'>
  <defs>
    <filter id='screen-noise'>
      <feTurbulence type='turbulence' result='noise' baseFrequency='0.2' numOctaves='1' seed='2' stitchTiles='noStitch' />
      <feOffset dy="0" dx="0">
        <animate attributeName="dy" values="0;-20" dur=".1s" repeatCount="indefinite" />
        <animate attributeName="dx" values="0;20" dur=".3s" repeatCount="indefinite" />
      </feOffset>
      <feComponentTransfer>
        <feFuncR type="linear" slope="1" intercept="-0.4" />
        <feFuncG type="linear" slope="1" intercept="-0.4" />
        <feFuncB type="linear" slope="1" intercept="-0.4" />
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="noiseElement" mode="multiply" result="screen-content" />
      <feTurbulence baseFrequency="0.01 1" result="waves" numOctaves="2" />
      <feDisplacementMap in="screen-content" in2="waves" scale="2" xChannelSelector="R" yChannelSelector="R">
        <animate attributeName="scale" values="0;{Math.random() * 20};0;{Math.random() * 60};{Math.random() * 10}" dur="9s" repeatCount="indefinite" />
      </feDisplacementMap>
    </filter>
    <filter id="Glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6 2" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <pattern id="Grid" x="0" y="0" width="0.2" height="0.2">
      <rect x="0" y="0" width="100px" height="100px" stroke='blue' fill='transparent' stroke-width='2' />
      <rect x="2" y="0" width="100px" height="100px" stroke='green' fill='transparent' stroke-width='2' />
      <animateTransform attributeType="xml" attributeName="patternTransform" type="translate" values="0,0;60,40" dur="5s" repeatCount="indefinite" />
    </pattern>
  </defs>
  <rect height="100%" width="100%" fill="url(#Grid)" filter="url(#Glow)" />
  <text x="50%" y="40%" text-anchor="middle">
    {#each textLines as line, i}
      <tspan x="50%" dy="{i === 0 ? 0 : 1.2}em">{line}</tspan>
    {/each}
  </text>
  <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0,0;0,3;0,-2;0,0;0,5;0,0;0,-3" dur="2s" repeatCount="indefinite" />
</svg>
</div>
<style>
@import url("https://fonts.googleapis.com/css2?family=Audiowide&display=swap");

svg {
	font-family: "Audiowide", cursive;
	position: absolute;
	width: 100%;
	height: 100%;
	filter: url(#screen-noise);
}

svg text {
	text-transform: uppercase;
	fill: rgb(154 52 18);
	font-size: 22px;
	filter: url(#Glow);
  word-break: break-word;
}
</style>