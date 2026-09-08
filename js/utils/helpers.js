const Helpers = (() => {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function money(n) {
    return "S/ " + Number(n).toLocaleString("es-PE", { maximumFractionDigits: 0 });
  }

  return { esc, money };
})();
