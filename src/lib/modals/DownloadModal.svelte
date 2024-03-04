<style>
.modal-content {
  border-radius: 0px;
}
.modal-header {
  color: #8a005e;
}
.modal-header .close {
  font-size: 40px;
}
.input-group-addon {
  color: #333;
  border-color: #333;
  background-color: #FFF;
  border-radius: 0;
}
.select-form-control {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  border: 1px solid #333;
  border-radius: 0;
  background: transparent;
  color: #333;
  font-size: 16px;
  font-weight: 400;
  outline: none;
  -webkit-transition: all 300ms ease-in-out;
  -moz-transition: all 300ms ease-in-out;
  transition: all 300ms ease-in-out;
}
.select-form-control::-webkit-input-placeholder {
  color: #333;
}
.select-form-control:-moz-placeholder {
  color: #333;
}
.select-form-control::-moz-placeholder {
  color: #333;
}
.select-form-control:-ms-input-placeholder {
  color: #333;
}
.select-form-control-sibling {
  border-top: 1px solid transparent;
}
.select-form-control.active .select-form-control:hover,
.select-form-control:focus,
.select-form-control:active {
  border-color: #8a005e;
}
select {
  /* styling */
  background-color: white;
  border: thin solid blue;
  border-radius: 4px;
  display: inline-block;
  font: inherit;
  line-height: 1.5em;
  padding: 0.5em 3.5em 0.5em 1em;
  /* reset */
  margin: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
}
select.round {
  background-image:
    linear-gradient(45deg, transparent 50%, white 50%),
    linear-gradient(135deg, white 50%, transparent 50%),
    radial-gradient(#8a005e 70%, transparent 72%);
  background-position:
    calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px),
    calc(100% - .5em) .5em;
  background-size:
    5px 5px,
    5px 5px,
    1.5em 1.5em;
  background-repeat: no-repeat;
}
select.round:focus {
  background-image:
    linear-gradient(45deg, white 50%, transparent 50%),
    linear-gradient(135deg, transparent 50%, white 50%),
    radial-gradient(#8a005e 70%, transparent 72%);
  background-position:
    calc(100% - 15px) 1em,
    calc(100% - 20px) 1em,
    calc(100% - .5em) .5em;
  background-size:
    5px 5px,
    5px 5px,
    1.5em 1.5em;
  background-repeat: no-repeat;
  border-color: green;
  outline: 0;
}
</style>

<script>
  import { get } from "svelte/store";
  import cart, { addToCart, setStorageCart } from "../../stores/cart";

  export let td;
  export let hideModal;
  export let actionTitle = 'Download Preview';

	let licenses = [
		{ price: 15, text: `Standart` },
		{ price: 35, text: `Streaming` },
		{ price: 150, text: `Unlimited/Multiple Projects` },
    { price: 500, text: `Exclusive (BuyOut)` }
	];
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
<!-- License MODAL -->
	<div id="modal" class="modal fade in show">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
        <button type="button" class="close" on:click={closeModal} aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
					<div class="row">
						<h2 class="white text-center">{actionTitle}</h2>
						<p data-modal-id class="text-center white"></p>
					</div>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-8 col-md-offset-2 col-sm-12">
							  <div class="form-group">
									<p class="text-center">Downloaded item fall under license</p>
								</div>
								<div class="form-group">
									<button class="btn btn-primary btn-block" on:click={add}>Download <i class="fas fa-download"></i></button>
									<br>
									<button type="reset" class="btn btn-default btn-block" on:click={closeModal} id="cancel">Cancel</button>
								</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
<div id="backdrop" class="modal-backdrop fade in"></div>
