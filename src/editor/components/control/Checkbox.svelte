<script lang="ts">
  export let checked: boolean = false;
  export let size: number = 12;
  export let color: string = "var(--color-accent)";
</script>

<label class="checkbox" on:contextmenu on:pointerdown|stopPropagation>
  <input type="checkbox" hidden bind:checked />

  <!-- <svg width={size} height={size}>
    <circle
      cx="50%"
      cy="50%"
      r={size / 2 - 0.5}
      stroke={color}
      stroke-width="1px"
      fill="none"
    />

    <g transform={`translate(${size / 2} ${size / 2})`}>
      <circle
        cx="0%"
        cy="0%"
        fill={color}
        r={checked ? size / 4 : 0}
        opacity={checked ? 1 : 0}
        style="transition: r var(--anim-short), opacity var(--anim-short);"
      />
    </g>
  </svg> -->

  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke={color} class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
  </svg>
</label>

<style lang="scss">
  .checkbox {
    line-height: 0;

    svg {
      overflow: visible;
    }
  }
</style>
