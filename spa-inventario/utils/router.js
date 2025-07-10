// router.js - SPA Router simple
export const Router = (() => {
  let routes = {};
  function add(route, cb) { routes[route] = cb; }
  function navigate(route) {
    window.location.hash = route;
    render();
  }
  function render() {
    const hash = window.location.hash.replace('#', '') || 'catalogo';
    if (routes[hash]) routes[hash]();
  }
  window.addEventListener('hashchange', render);
  return { add, navigate, render };
})();
