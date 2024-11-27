<script lang="ts">
  export let value: number;
  export let min: number = 0.01;
  export let max: number = 319.99;

  let hideModal: boolean;
  let actionTitle = 'Edit BPM';

  $: fieldValue = value.toFixed(0);
  $: value = Math.min(max, Math.max(min, value));

  async function handleBlur() {
    if (["number", "string"].includes(typeof fieldValue)) {
      const num = Number(fieldValue);
      if (Number.isFinite(num)) {
        value = num;
      }
    } else {
      value = value + 1;
      value = value - 1;
    }

  }

</script>

<div class="text-color text-sm py-1 px-2 second-bg-color rounded-lg">
  <span>{value}</span>
  <span>bpm</span> 
</div>

