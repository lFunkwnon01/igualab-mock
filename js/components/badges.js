const Badges = (() => {
  function estadoBadge(estado) {
    const map = {
      "Activo": "bg-primary-container text-on-primary-container",
      "Inactivo": "bg-surface-variant text-on-surface-variant",
      "Disponible": "bg-primary-container text-on-primary-container",
      "Procesando": "bg-tertiary-fixed text-on-tertiary-fixed",
      "Alto": "bg-error-container text-on-error-container",
      "Medio": "bg-surface-variant text-on-surface-variant",
      "Bajo": "bg-primary-container text-on-primary-container",
      "OK": "bg-primary-container text-on-primary-container",
      "Sub-reportado": "bg-error-container text-on-error-container",
      "Baja sustancia": "bg-tertiary-fixed text-on-tertiary-fixed"
    };
    return `<span class="inline-flex items-center px-2 py-1 rounded-full font-label-sm text-label-sm ${map[estado] || "bg-surface-variant text-on-surface-variant"}">${Helpers.esc(estado)}</span>`;
  }

  return { estadoBadge };
})();
