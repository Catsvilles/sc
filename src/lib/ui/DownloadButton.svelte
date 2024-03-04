<script lang="ts">
  import CircleButton from './CircleButton.svelte';
  export let item;
  export let buttonProps = {};

  let Modal;
  let modalProps = {};
  let hideModal = false;
  $: if (hideModal) {
      Modal = null;
  }

  const cartToggle = () => {
      hideModal = false;
      import('./../modals/DownloadModal.svelte').then(res => Modal = res.default);
      modalProps = {td: item, hideModal: hideModal};
  };

</script>
<svelte:component this={Modal} bind:hideModal {...modalProps}/>
<CircleButton {...buttonProps} on:click={cartToggle} icon='fas fa-download' tooltipText='Get Preview' />
