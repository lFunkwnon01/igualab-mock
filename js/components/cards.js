const Cards = (() => {
  function kpiCard({ titulo, valor, delta, deltaDir = "up", color = "primary", icono, pie = 75, extra = "" }) {
    const deltaColor = deltaDir === "up" ? "text-primary" : "text-error";
    const arrow = deltaDir === "up" ? "arrow_upward" : "arrow_downward";
    return `
      <div class="bg-surface-container-lowest rounded-xl border border-surface-variant p-lg ambient-shadow ambient-shadow-hover relative overflow-hidden">
        <div class="flex justify-between items-start mb-md">
          <h3 class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">${titulo}</h3>
          <span class="material-symbols-outlined text-${color} bg-${color}/10 p-1 rounded text-[20px]">${icono}</span>
        </div>
        <div class="flex items-baseline gap-sm">
          <span class="font-display-lg text-display-lg text-on-background">${valor}</span>
          ${delta ? `<span class="font-label-sm text-label-sm ${deltaColor} flex items-center"><span class="material-symbols-outlined text-[14px]">${arrow}</span> ${delta}</span>` : ""}
        </div>
        ${extra ? `<div class="mt-sm text-xs text-on-surface-variant">${extra}</div>` : ""}
        <div class="absolute bottom-0 left-0 w-full h-1 bg-surface-variant"><div class="h-full bg-${color}" style="width:${pie}%"></div></div>
      </div>`;
  }

  function sectionHeader(titulo, sub, acciones = "") {
    return `
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 class="font-headline-lg text-headline-lg text-on-background">${titulo}</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-1">${sub}</p>
        </div>
        ${acciones}
      </div>`;
  }

  return { kpiCard, sectionHeader };
})();
