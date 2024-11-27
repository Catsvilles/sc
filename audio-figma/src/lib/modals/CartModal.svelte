<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>
<script>
  import cart, { addToCart, setStorageCart } from "../../stores/cart";
  import { licenses } from "../../util/licenses";

  export let td;
  export let hideModal;
  export let actionTitle = 'Select Your License';

  let selected;

  function add() {
      let cartItem = {
        ...td,
        license: selected
      }
      addToCart(cartItem);
      setStorageCart($cart);
      hideModal = true;
  }

  function closeModal() {
      hideModal = true;
  }
</script>
  <!--Modal-->
  <div class="z-50 modal fixed w-full h-full top-0 left-0 flex items-center justify-center ">
    <div on:click={closeModal} class="modal-overlay absolute w-full h-full bg-gray-400 bg-opacity-75"></div>
    <div class="modal-container bg-[#333333] w-11/12 md:max-w-md mx-auto shadow-lg z-50 overflow-y-auto pb-4 rounded-lg">
      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="modal-content py-4 text-center px-6 text-neutral-300 font-semibold font ">
        <!--Title-->
        <div class="flex justify-end items-center pb-3">
          <div on:click={closeModal} class="cursor-pointer z-50">
            <svg class="fill-current text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </div>
        </div>
        <div class="flex justify-center text-2xl text-center mb-4 uppercase">{actionTitle}</div>
        <!--Body-->
        <div class="mb-2">
          <div class="relative">
            <select bind:value={selected} class="block appearance-none w-full bg-neutral-900
             border-2 border-orange-700 text-grey-800
              py-3 px-4 pr-8 rounded leading-tight
               focus:outline-none focus:bg-[#5c6773] focus:border-orange-700">
              {#each licenses as l}
                <option value={l}>
                  {l.text} (${l.price})
                </option>
              {/each}
              </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <p class="text-xs mt-4 text-neutral-300">Details about all our license plans <a href="license" class="text-orange-800" target="_blank">here.</a></p>
        <!--Footer-->
        <div class=" pt-2">
          <button on:click={add} class=" m-2 w-40  uppercase rounded-full border-2 border-orange-500 px-5 py-3 text-center text-sm font-medium text-white shadow-md shadow-orange-900 hover:bg-orange-700 ">Add to Cart  <i class="fas fa-cart-plus"></i></button>
        </div>
      </div>
    </div>
  </div>
