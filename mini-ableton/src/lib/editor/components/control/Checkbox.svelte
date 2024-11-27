<script lang="ts">
  export let checked: boolean = false;
</script>

<label on:contextmenu on:pointerdown|stopPropagation>
  <input type="checkbox" hidden bind:checked />
  <span class:active="{checked == false}" class="flex items-center justify-center uppercase text-xs w-6 h-6 rounded-lg transition duration-700">M</span>
</label>



