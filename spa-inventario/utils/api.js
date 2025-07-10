// api.js - Abstracción de fetch para JSON Server
const API_URL = 'http://localhost:3000';
export const API = {
  async getProductos() {
    const r = await fetch(`${API_URL}/productos`);
    return r.json();
  },
  async getProducto(id) {
    const r = await fetch(`${API_URL}/productos/${id}`);
    return r.json();
  },
  async addProducto(data) {
    const r = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async updateProducto(id, data) {
    const r = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async deleteProducto(id) {
    await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
  },
  async loginUser(correo, password) {
    const r = await fetch(`${API_URL}/usuarios?correo=${encodeURIComponent(correo)}&password=${encodeURIComponent(password)}`);
    const users = await r.json();
    return users[0];
  },
  async registerUser(data) {
    const r = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async getPedidos(userId) {
    const r = await fetch(`${API_URL}/pedidos?usuarioId=${userId}`);
    return r.json();
  },
  async addPedido(data) {
    const r = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async updatePedido(id, data) {
    const r = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async getEstadisticas() {
    const r = await fetch(`${API_URL}/pedidos`);
    const pedidos = await r.json();
    // Procesar estadísticas aquí si es necesario
    return pedidos;
  }
};
