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
      import('./../../../lib/modals/EditorHelpModal.svelte').then(res => Modal = res.default);
      modalProps = {hideModal: hideModal};
  };

</script>
<svelte:component this={Modal} bind:hideModal {...modalProps}/>

<Button 
on:click={helpModal}>
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-help" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="gray" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="17" x2="12" y2="17.01" />
    <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" />
</svg>
</Button>