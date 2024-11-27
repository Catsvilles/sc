<script lang="ts">
    let Modal;
    let modalProps = {};
    let hideModal = false;
    $: if (hideModal) {
        Modal = null;
    }
  
    const cartToggle = () => {
        hideModal = false;
        import('../modals/NewProjectModal.svelte').then(res => Modal = res.default);
        modalProps = { hideModal: hideModal};
    };
</script>
<svelte:component this={Modal} bind:hideModal {...modalProps}/>
<button on:click={cartToggle} class="uppercase mx-2">
    New Project
</button>
  
