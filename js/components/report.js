const Report = (() => {
  function renderA4(nombreEmpresa, periodo, secciones) {
    const e = DB.empresas.find((x) => x.nombre === nombreEmpresa) || DB.empresas[0];
    const gri = DB.gri[e.id] || [];
    const sanciones = DB.sanciones[e.id] || [];
    const totalSan = sanciones.reduce((a, s) => a + s.monto, 0);
    const brechas = gri.filter((g) => g.estado !== "OK");
    return `
      <div class="w-[800px] max-w-full bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)] rounded-sm flex flex-col mx-auto">
        <div class="h-28 border-b border-surface-variant flex items-center justify-between px-12 py-6">
          <div class="flex items-center gap-sm">
            <img src="assets/Logo.webp" alt="Igualab" class="h-8 object-contain"/>
            <div class="font-title-lg text-title-lg font-bold text-primary">Igualab Intelligence</div>
          </div>
          <div class="text-right">
            <div class="font-label-sm text-label-sm text-outline uppercase">Reporte de Prospección</div>
            <div class="text-body-md text-on-surface-variant">Generado: ${new Date().toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
        </div>
        <div class="p-12 flex flex-col gap-8">
          <div>
            <h1 class="font-headline-lg text-headline-lg text-on-background font-black leading-tight mb-2">${Helpers.esc(e.nombre)}</h1>
            <div class="font-title-lg text-title-lg text-secondary border-b-2 border-secondary inline-block pb-1">Periodo: ${Helpers.esc(periodo)} · Sector: ${Helpers.esc(e.sector)}</div>
          </div>
          ${secciones.includes("Resumen Ejecutivo") ? `
          <div>
            <h2 class="font-headline-md text-headline-md text-primary mb-3 flex items-center gap-2"><span class="material-symbols-outlined text-primary">summarize</span> Resumen Ejecutivo</h2>
            <p class="text-body-md text-on-surface leading-relaxed">${Helpers.esc(e.nombre)} presenta un puntaje ESG de <strong>${e.esg}/100</strong> y un nivel de riesgo operativo <strong>${Helpers.esc(e.riesgo)}</strong>. Se identificaron <strong>${brechas.length} brechas GRI</strong> sub-reportadas y sanciones económicas acumuladas por <strong>${Helpers.money(totalSan)}</strong>, lo que configura una oportunidad de acercamiento comercial como aliado estratégico en gestión de impacto.</p>
          </div>` : ""}
          <div class="grid grid-cols-3 gap-4">
            <div class="border border-surface-variant rounded p-4 border-t-4 border-t-primary"><div class="font-label-sm text-label-sm text-outline mb-1 uppercase">Puntaje ESG</div><div class="font-headline-lg text-headline-lg text-on-surface">${e.esg}<span class="text-title-lg text-outline">/100</span></div></div>
            <div class="border border-surface-variant rounded p-4 border-t-4 border-t-tertiary"><div class="font-label-sm text-label-sm text-outline mb-1 uppercase">Riesgo de operación</div><div class="font-headline-lg text-headline-lg text-on-surface">${Helpers.esc(e.riesgo)}</div></div>
            <div class="border border-surface-variant rounded p-4 border-t-4 border-t-secondary"><div class="font-label-sm text-label-sm text-outline mb-1 uppercase">Brechas GRI</div><div class="font-headline-lg text-headline-lg text-on-surface">${brechas.length}</div></div>
          </div>
          ${secciones.includes("Brechas GRI") ? `
          <div>
            <h2 class="font-headline-md text-headline-md text-primary mb-3 flex items-center gap-2"><span class="material-symbols-outlined text-primary">rule</span> Brechas GRI detectadas (RF-12)</h2>
            <table class="w-full text-left border-collapse">
              <thead><tr class="bg-surface-container-low">${["Código", "Tema", "Estado", "Detalle"].map((h) => `<th class="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase">${h}</th>`).join("")}</tr></thead>
              <tbody>${gri.map((g) => `<tr class="border-b border-surface-variant"><td class="py-2 px-3 font-medium">${g.codigo}</td><td class="py-2 px-3">${Helpers.esc(g.tema)}</td><td class="py-2 px-3">${Badges.estadoBadge(g.estado)}</td><td class="py-2 px-3 text-on-surface-variant text-body-md">${Helpers.esc(g.detalle)}</td></tr>`).join("")}</tbody>
            </table>
          </div>` : ""}
          ${secciones.includes("Sanciones") ? `
          <div>
            <h2 class="font-headline-md text-headline-md text-primary mb-3 flex items-center gap-2"><span class="material-symbols-outlined text-primary">gavel</span> Sanciones económicas (RF-13)</h2>
            ${sanciones.length ? sanciones.map((s) => `
              <div class="flex justify-between items-center border border-surface-variant rounded-lg p-3 mb-2">
                <div><p class="text-body-md font-medium text-on-surface">${Helpers.esc(s.entidad)} · ${s.anio}</p><p class="font-label-sm text-label-sm text-on-surface-variant">${Helpers.esc(s.motivo)}</p></div>
                <p class="font-title-lg text-title-lg text-error font-bold">${Helpers.money(s.monto)}</p>
              </div>`).join("") + `<p class="text-body-md text-right font-bold text-on-surface mt-2">Total: ${Helpers.money(totalSan)}</p>`
            : '<p class="text-body-md text-on-surface-variant">Sin sanciones registradas en el periodo analizado.</p>'}
          </div>` : ""}
          <div class="mt-auto border-t border-surface-variant pt-4 flex justify-between items-center text-outline font-label-md text-label-md">
            <span>Confidencial · Uso interno de Igualab (prospección)</span>
            <span>Página 1 de 4</span>
          </div>
        </div>
      </div>`;
  }

  function openModal(empresa, periodo, secciones, existente) {
    const overlay = Modal.open(`
      <div class="flex justify-between items-center p-lg border-b border-outline-variant">
        <h3 class="font-title-lg text-title-lg text-on-surface flex items-center gap-sm"><span class="material-symbols-outlined text-primary">picture_as_pdf</span> Reporte de prospección · ${Helpers.esc(empresa)}</h3>
        <button data-modal-close class="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="overflow-y-auto p-lg bg-surface-container-low" id="print-area">${renderA4(empresa, periodo, secciones)}</div>
      <div class="p-md border-t border-outline-variant flex justify-end gap-sm">
        <button data-modal-close class="px-lg py-sm rounded-lg border border-outline-variant text-body-md text-on-surface-variant hover:bg-surface-container-low">Cerrar</button>
        <button id="btn-pdf" class="px-lg py-sm rounded-lg bg-primary text-on-primary text-label-md font-semibold flex items-center gap-sm hover:bg-surface-tint"><span class="material-symbols-outlined text-[18px]">download</span> Descargar PDF</button>
      </div>`, { width: "max-w-4xl" });
    overlay.querySelector("#btn-pdf").addEventListener("click", () => {
      if (!existente) {
        const r = { id: "r" + Date.now(), nombre: `Prospección - ${empresa}`, empresa, periodo, secciones, generadoPor: App.state.user.nombre, fecha: new Date().toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" }) };
        App.state.reports.unshift(r);
        App.pushAudit("Generación de reporte", `Generó '${r.nombre}'`);
      } else {
        App.pushAudit("Descarga", `Descargó '${existente.nombre}'`);
      }
      Toast.show(existente ? "Reporte descargado (simulado con impresión)." : "Reporte generado y registrado en auditoría.", "success");
      setTimeout(() => window.print(), 400);
      App.rerender();
    });
  }

  return { renderA4, openModal };
})();
