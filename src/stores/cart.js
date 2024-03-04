import { writable, derived } from "svelte/store";
import { browser } from '$app/environment';

const cart = writable(getStorageCart());

export const cartTotalItems = derived(cart, ($items) => {
  return $items.length;
});

export const cartTotal = derived(cart, ($items) => {
  let total = $items.reduce((acc, curr) => (acc += curr.license.price), 0)
  return parseFloat(total.toFixed(2))
})

// local functions
const remove = (id, items) => {
  return items.filter((item) => item.id !== id);
};

const toggleAmount = (id, items, action) => {
  return items.map((item) => {
    let newAmount;

    if (action === "inc") newAmount = item.amount + 1;
    else if (action === "dec") newAmount = item.amount - 1;
    else newAmount = item.amount;

    return item.id === id ? { ...item, amount: newAmount } : { ...item };
  });
};

// global functions
export const removeItem = (id) => {
  cart.update((cartItems) => remove(id, cartItems));
};

export const increaseAmount = (id) => {
  cart.update((cartItems) => {
    return toggleAmount(id, cartItems, "inc");
  });
};

export const changeLicense = (id, items, newLicense) => {
  items.map((item) => {
    if (item.id === id) {
        item.license = newLicense;
    }
  });
  return [ ...items ];
};

export const decreaseAmount = (id, amount) => {
  cart.update((cartItems) => {
    let cart;

    if (amount <= 1) cart = remove(id, cartItems);
    else cart = toggleAmount(id, cartItems, "dec");

    return cart;
  });
};

export const addToCart = (product) => {
  cart.update((cartItems) => {
    const { id } = product;
    const item = cartItems.find((item) => item.id === id);
    let cart;
    if (item) {
      cart = changeLicense(item.id, cartItems, product.license);
    } else {
      let newItem = { ...product };
      cart = [newItem, ...cartItems];
    }
    return cart;
  });
};

function getStorageCart() {
    if (browser) {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    } else {
        return [];
    }
}

export function setStorageCart(cartValues) {
    if (browser) {
        localStorage.setItem('cart',JSON.stringify(cartValues));
    }
}

export default cart;
