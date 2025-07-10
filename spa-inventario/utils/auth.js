// auth.js - Autenticación y gestión de sesión
export const Auth = (() => {
  const SESSION_KEY = 'ecommerce_spa_session';
  let user = null;

  function saveSession(u) {
    user = u;
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  }
  function loadSession() {
    const u = localStorage.getItem(SESSION_KEY);
    if (u) user = JSON.parse(u);
    return user;
  }
  function clearSession() {
    user = null;
    localStorage.removeItem(SESSION_KEY);
  }
  function isLogged() {
    return !!user;
  }
  function getUser() {
    return user;
  }
  return { saveSession, loadSession, clearSession, isLogged, getUser };
})();
