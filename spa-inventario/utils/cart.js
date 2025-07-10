// cart.js - Lógica de carrito de compras
export const Cart = (() => {
  const CART_KEY = 'ecommerce_spa_cart';
  let cart = [];
  function load() {
    const c = localStorage.getItem(CART_KEY);
    cart = c ? JSON.parse(c) : [];
    return cart;
  }
  function save() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  function add(product, cantidad = 1) {
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      cart[idx].cantidad += cantidad;
    } else {
      cart.push({ ...product, cantidad });
    }
    save();
  }
  function remove(id) {
    cart = cart.filter(i => i.id !== id);
    save();
  }
  function update(id, cantidad) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx >= 0) {
      cart[idx].cantidad = cantidad;
      save();
    }
  }
  function clear() {
    cart = [];
    save();
  }
  function get() {
    return cart;
  }
  function total() {
    return cart.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  }
  return { load, add, remove, update, clear, get, total };
})();
