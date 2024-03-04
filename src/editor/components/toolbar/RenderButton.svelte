<script lang="ts">
  import Button from "@components/control/Button.svelte";

  let Modal;
  let modalProps = {};
  let hideModal = false;
  $: if (hideModal) {
      Modal = null;
  }

  const helpModal = () => {
      hideModal = false;
      import('./RenderModal.svelte').then(res => Modal = res.default);
      modalProps = {hideModal: hideModal};
  };
</script>
<svelte:component this={Modal} bind:hideModal {...modalProps}/>

<Button on:click={helpModal}>
  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="gray" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <polyline points="7 11 12 16 17 11" />
      <line x1="12" y1="4" x2="12" y2="16" />
    </svg>
</Button>
