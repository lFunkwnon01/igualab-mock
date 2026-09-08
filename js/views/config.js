Views.config = {
  html() {
    const c = App.state.config;
    return `
      ${Cards.sectionHeader("Configuración del sistema", "Parámetros globales de seguridad y operación. Los cambios se registran en auditoría (CU003).")}
      <div class="max-w-2xl space-y-lg">
        <div class="bg-surface-container-lowest rounded-xl border border-surface-variant p-lg ambient-shadow">
          <h3 class="font-title-lg text-title-lg text-on-background mb-lg flex items-center gap-sm"><span class="material-symbols-outlined text-primary">security</span> Seguridad</h3>
          <div class="space-y-lg">
            <div>
              <div class="flex justify-between items-baseline mb-xs">
                <label class="font-label-md text-label-md text-on-surface-variant" for="cfg-min">Minutos de inactividad para expirar sesión (RNF-01)</label>
                <span id="cfg-min-val" class="font-title-lg text-title-lg text-primary font-bold">${c.minutos}</span>
              </div>
              <input id="cfg-min" type="range" min="5" max="60" step="5" value="${c.minutos}" class="w-full accent-primary"/>
              <div class="flex justify-between font-label-sm text-label-sm text-outline mt-xs"><span>5</span><span>60</span></div>
            </div>
            <label class="flex items-center justify-between p-md rounded-lg border border-surface-variant hover:bg-surface-container-low cursor-pointer transition-colors">
              <div><p class="text-body-md font-medium text-on-background">Bloquear cuenta tras 5 intentos fallidos</p><p class="font-label-sm text-label-sm text-on-surface-variant">Protección contra fuerza bruta</p></div>
              <input id="cfg-bloqueo" type="checkbox" ${c.bloqueo ? "checked" : ""} class="w-5 h-5 text-primary focus:ring-primary rounded border-outline-variant"/>
            </label>
            <label class="flex items-center justify-between p-md rounded-lg border border-surface-variant hover:bg-surface-container-low cursor-pointer transition-colors">
              <div><p class="text-body-md font-medium text-on-background">Notificar accesos sospechosos</p><p class="font-label-sm text-label-sm text-on-surface-variant">Alerta por correo al Superadmin</p></div>
              <input id="cfg-notif" type="checkbox" ${c.notif ? "checked" : ""} class="w-5 h-5 text-primary focus:ring-primary rounded border-outline-variant"/>
            </label>
          </div>
        </div>
        <div class="flex justify-end gap-sm">
          <button data-action="cfg-cancel" class="px-lg py-sm rounded-lg border border-outline-variant text-body-md text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancelar</button>
          <button data-action="cfg-save" class="px-lg py-sm rounded-lg bg-primary text-on-primary text-label-md font-semibold hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-sm"><span class="material-symbols-outlined text-[18px]">save</span> Guardar configuración</button>
        </div>
      </div>`;
  },
  after(root) {
    const slider = root.querySelector("#cfg-min");
    slider.addEventListener("input", () => { root.querySelector("#cfg-min-val").textContent = slider.value; });
  }
};
