//Personal JavaScript by Ernesto Duany
// Helped to clean up by ChatGPT
'use strict';

const products = [
  { name: 'Cherry',     price: 3, quantity: 0, productId: 1, image: "./images/cherry.jpg" },
  { name: 'Orange',     price: 5, quantity: 0, productId: 2, image: "./images/orange.jpg" },
  { name: 'Strawberry', price: 2, quantity: 0, productId: 3, image: "./images/strawberry.jpg" }
];

// Image pathing B.
//const products = [
//  { name: 'Cherry',     price: 3,  quantity: 0, productId: 1, image: '/starter/src/images/cherry.jpg' },  
//  { name: 'Orange',     price: 5,  quantity: 0, productId: 2, image: '/starter/src/images/orange.jpg' },
//  { name: 'Strawberry', price: 2,  quantity: 0, productId: 3, image: '/starter/src/images/strawberry.jpg' }
//];


const cart = [];

let totalPaid = 0;  
let balance   = 0;  

// Helpers (avoid repetition)
function getProductById(productId) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].productId === productId) return products[i];
  }
  return null;
}

function getCartItemIndex(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].productId === productId) return i;
  }
  return -1;
}

// Cart API (function declarations as required)
function addProductToCart(productId) {
  const product = getProductById(productId);
  if (!product) return cart;
  const idx = getCartItemIndex(productId);
  if (idx === -1) cart.push(product);    // first click adds to cart
  product.quantity += 1;                  // subsequent clicks increase quantity
  return cart;
}

function increaseQuantity(productId) {
  const product = getProductById(productId);
  if (!product) return cart;
  if (getCartItemIndex(productId) === -1) cart.push(product);
  product.quantity += 1;
  return cart;
}

function decreaseQuantity(productId) {
  const product = getProductById(productId);
  if (!product) return cart;
  if (product.quantity <= 1) {            // at 1 → remove from cart
    product.quantity = 0;
    removeProductFromCart(productId);
  } else {
    product.quantity -= 1;
  }
  return cart;
}

function removeProductFromCart(productId) {
  const idx = getCartItemIndex(productId);
  if (idx > -1) {
    cart[idx].quantity = 0;
    cart.splice(idx, 1);
  }
  return cart;
}

// Checkout API
function cartTotal() {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum += cart[i].price * cart[i].quantity;
  }
  return sum;
}

function emptyCart() {
  for (let i = 0; i < cart.length; i++) {
    cart[i].quantity = 0;
  }
  cart.length = 0;
  totalPaid = 0;   // reset payment cycle
  balance   = 0;
  return cart;
}

function pay(amount) {
  const payment = Math.max(0, Number(amount) || 0); // ignore NaN/negatives
  totalPaid += payment;
  balance = totalPaid - cartTotal();
  if (balance >= 0) totalPaid = 0;                  // fully paid → reset accumulator
  return balance;
}

// Safe export: works in both browser (front.js) and Node tests
if (typeof module !== 'undefined') {
  module.exports = {
    products,
    cart,
    addProductToCart,
    increaseQuantity,
    decreaseQuantity,
    removeProductFromCart,
    cartTotal,
    pay,
    emptyCart,
    balance,
    totalPaid,
  };
}
