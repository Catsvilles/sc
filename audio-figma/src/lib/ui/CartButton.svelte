<script lang="ts">
  import CircleButton from './CircleButton.svelte';
  export let item;
  //Bug when adding to cart from footer player
  if (item.seekTo) {
    delete item.seekTo;
  }
  export const buttonProps = {};

  let Modal;
  let modalProps = {};
  let hideModal = false;
  $: if (hideModal) {
      Modal = null;
  }

  const cartToggle = () => {
      hideModal = false;
      import('./../modals/CartModal.svelte').then(res => Modal = res.default);
      modalProps = {td: item, hideModal: hideModal};
  };

</script>
<svelte:component this={Modal} bind:hideModal {...modalProps}/>
<div on:click={cartToggle} class="block cursor-pointer bg-[#333333] shadow-lg border border-transparent	hover:border-gray-500 p-1.5 rounded-full transform transition hover:scale-110 duration-300">
  <svg class="h-6 w-6 fill-black" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none"><path d="M6.01 16.136L4.141 4H3a1 1 0 0 1 0-2h1.985a.993.993 0 0 1 .66.235a.997.997 0 0 1 .346.627L6.319 5H14v2H6.627l1.23 8h9.399l1.5-5h2.088l-1.886 6.287A1 1 0 0 1 18 17H7.016a.993.993 0 0 1-.675-.248a.999.999 0 0 1-.332-.616zM10 20a2 2 0 1 1-4 0a2 2 0 0 1 4 0zm9 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0zm0-18a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1z" fill="#e5e7eb"/></g></svg>
</div>
