// validator.js - Validaciones robustas
export const Validator = {
  usuario: v => /^[A-Za-z0-9]{4,}$/.test(v),
  email: v => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
  password: v => /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v),
  nombre: v => v && v.length > 0,
  precio: v => !isNaN(v) && Number(v) > 0,
  stock: v => Number.isInteger(Number(v)) && Number(v) >= 0,
  imagen: v => /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v)
};
