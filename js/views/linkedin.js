Views.linkedin = {
  html() {
    return `
      ${Cards.sectionHeader("Buscar contactos vía LinkedIn", "Encuentra al gerente de sostenibilidad o financiero de la empresa objetivo (RF-17 · Exploratorio).",
      '<span class="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase">Exploratorio</span>')}
      <div class="max-w-xl">
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-[12px] text-outline-variant">search</span>
          <input id="li-search" class="w-full h-[48px] pl-[44px] pr-[12px] rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Buscar por empresa o cargo..."/>
        </div>
        <p class="font-label-sm text-label-sm text-outline mt-sm flex items-center gap-xs"><span class="material-symbols-outlined text-[14px]">privacy_tip</span> Uso sujeto a privacidad y términos de servicio de LinkedIn.</p>
      </div>
      <div id="li-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg"></div>`;
  },
  after(root) {
    const grid = root.querySelector("#li-grid");
    function render(q = "") {
      q = q.toLowerCase();
      const contacts = Object.values(DB.contacts).flat().filter((c) => !q || c.empresa.toLowerCase().includes(q) || c.cargo.toLowerCase().includes(q) || c.nombre.toLowerCase().includes(q));
      grid.innerHTML = contacts.length ? contacts.map((c) => `
        <div class="bg-surface-container-lowest rounded-xl border border-surface-variant p-lg ambient-shadow ambient-shadow-hover">
          <div class="flex items-center gap-md mb-md">
            <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-title-lg">${c.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
            <div><p class="text-body-lg font-semibold text-on-background">${Helpers.esc(c.nombre)}</p><p class="font-label-sm text-label-sm text-on-surface-variant">${Helpers.esc(c.cargo)}</p></div>
          </div>
          <p class="font-label-md text-label-md text-on-surface-variant mb-md flex items-center gap-xs"><span class="material-symbols-outlined text-[16px]">domain</span> ${Helpers.esc(c.empresa)}</p>
          <a href="#" class="flex items-center justify-center gap-sm w-full py-sm rounded-lg border border-primary text-primary text-label-md font-semibold hover:bg-primary/5 transition-colors" onclick="return false"><span class="material-symbols-outlined text-[16px]">open_in_new</span> Ver en LinkedIn</a>
        </div>`).join("") : '<p class="text-body-md text-on-surface-variant">Sin contactos para la búsqueda.</p>';
    }
    root.querySelector("#li-search").addEventListener("input", (e) => render(e.target.value));
    render();
  }
};
