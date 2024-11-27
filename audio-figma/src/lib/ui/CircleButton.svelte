<script lang="ts">
  export let widthHeight = 34;
  export let fontSize = 13;
  export let icon = '';
  export let tooltipText = undefined;
  export let transparentBackground = true;

  let styleBg;
  if (transparentBackground === true) {
    styleBg = 'background-color: transparent;'
  } else {
    styleBg = 'color: #fff;'
  }
</script>
<div class="right-button"
 style="{styleBg}width:{widthHeight}px;height:{widthHeight}px;font-size:{fontSize}px;"
 on:click>
    <div style={styleBg} class="circle-around"></div>
    <i class="center-icon {icon}"></i>
    {#if tooltipText}
      <span class="tooltip transition-slidein arrow-bottom align-right">{tooltipText}</span>
    {/if}
</div>
