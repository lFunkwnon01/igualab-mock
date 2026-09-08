Views.reportes = {
  html() {
    const misReportes = App.state.reports.map((r) => `
      <tr class="border-b border-surface-variant hover:bg-surface/50 transition-colors">
        <td class="py-md px-md font-medium">${Helpers.esc(r.nombre)}</td>
        <td class="py-md px-md">${Helpers.esc(r.empresa)}</td>
        <td class="py-md px-md text-on-surface-variant">${Helpers.esc(r.periodo)}</td>
        <td class="py-md px-md text-on-surface-variant">${r.secciones.join(", ")}</td>
        <td class="py-md px-md text-on-surface-variant">${Helpers.esc(r.fecha)}</td>
        <td class="py-md px-md text-right"><button data-ver-reporte="${r.id}" class="p-1.5 rounded-lg text-primary hover:bg-primary/5" title="Ver / descargar"><span class="material-symbols-outlined text-[18px]">picture_as_pdf</span></button></td>
      </tr>`).join("");
    return `
      ${Cards.sectionHeader("Generar reporte de prospección (PDF)", "Compila brechas GRI, sanciones y métricas de una empresa en un PDF automatizado (RF-07).")}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <div class="lg:col-span-4 space-y-lg">
          <div class="bg-surface-container-lowest rounded-xl border border-surface-variant p-lg ambient-shadow">
            <h3 class="font-title-lg text-title-lg text-on-background mb-md">Parámetros</h3>
            <div class="space-y-md">
              <div class="flex flex-col gap-xs"><label class="font-label-md text-label-md text-on-surface-variant">Empresa objetivo</label>
                <select id="rep-empresa" class="rounded-lg border-outline-variant bg-surface-container-low py-sm px-md text-body-md focus:border-primary focus:ring-primary">${DB.empresas.map((e) => `<option>${Helpers.esc(e.nombre)}</option>`).join("")}</select></div>
              <div class="grid grid-cols-2 gap-sm">
                <div class="flex flex-col gap-xs"><label class="font-label-md text-label-md text-on-surface-variant">Desde</label><input id="rep-desde" type="number" value="2023" class="rounded-lg border-outline-variant bg-surface-container-low py-sm px-md text-body-md focus:border-primary focus:ring-primary"/></div>
                <div class="flex flex-col gap-xs"><label class="font-label-md text-label-md text-on-surface-variant">Hasta</label><input id="rep-hasta" type="number" value="2025" class="rounded-lg border-outline-variant bg-surface-container-low py-sm px-md text-body-md focus:border-primary focus:ring-primary"/></div>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-lowest rounded-xl border border-surface-variant p-lg ambient-shadow">
            <h3 class="font-title-lg text-title-lg text-on-background mb-md">Secciones a incluir</h3>
            <div class="space-y-sm">
              ${["Resumen Ejecutivo", "Brechas GRI", "Sanciones", "Análisis Financiero Detallado", "Fuentes y Referencias"].map((s, i) => `
                <label class="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors border border-transparent hover:border-outline-variant">
                  <input type="checkbox" data-seccion="${s}" ${i !== 3 ? "checked" : ""} class="text-primary focus:ring-primary rounded border-outline-variant w-4 h-4"/>
                  <span class="text-body-md text-on-surface flex-1">${s}</span>
                </label>`).join("")}
            </div>
          </div>
          <button data-action="generar-reporte" class="w-full bg-primary text-on-primary py-md px-lg rounded-lg flex items-center justify-center gap-sm shadow-md hover:bg-surface-tint hover:-translate-y-0.5 transition-all text-body-lg font-semibold">
            <span class="material-symbols-outlined">download</span> Generar y descargar PDF
          </button>
        </div>
        <div class="lg:col-span-8 space-y-lg">
          <div class="bg-surface-container-low rounded-xl border border-surface-variant p-lg flex flex-col min-h-[420px]">
            <div class="flex justify-between items-center mb-sm">
              <h3 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Vista previa del documento</h3>
              <span class="font-label-sm text-label-sm text-outline">A4 · 85%</span>
            </div>
            <div class="flex-1 overflow-y-auto chat-scroll py-lg">
              <div class="scale-[0.7] lg:scale-[0.82] origin-top">${Report.renderA4(DB.empresas[0].nombre, "2023 - 2025", ["Resumen Ejecutivo", "Brechas GRI", "Sanciones"])}</div>
            </div>
          </div>
          <div class="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden">
            <div class="p-lg border-b border-outline-variant bg-surface-bright"><h3 class="font-title-lg text-title-lg text-on-surface">Reportes generados</h3></div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead><tr class="bg-surface-container-low border-b border-outline-variant">${["Reporte", "Empresa", "Periodo", "Secciones", "Fecha", ""].map((h) => `<th class="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase">${h}</th>`).join("")}</tr></thead>
                <tbody class="text-body-md">${misReportes || '<tr><td colspan="6" class="py-lg text-center text-body-md text-on-surface-variant">Aún no has generado reportes.</td></tr>'}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;
  },
  after(root) {
    root.querySelector("#rep-empresa").addEventListener("change", (e) => {
      root.querySelector("#rep-preview").innerHTML = Report.renderA4(e.target.value, "2023 - 2025", ["Resumen Ejecutivo", "Brechas GRI", "Sanciones"]);
    });
    root.querySelectorAll("[data-ver-reporte]").forEach((b) => b.addEventListener("click", () => {
      const r = App.state.reports.find((x) => x.id === b.dataset.verReporte);
      Report.openModal(r.empresa, r.periodo, r.secciones, r);
    }));
    root.querySelector("[data-action='generar-reporte']").addEventListener("click", () => {
      const empresa = root.querySelector("#rep-empresa").value;
      const desde = root.querySelector("#rep-desde").value;
      const hasta = root.querySelector("#rep-hasta").value;
      const secciones = Array.from(root.querySelectorAll("[data-seccion]:checked")).map((c) => c.dataset.seccion);
      const tieneDatos = App.state.documents.some((d) => d.empresa === empresa || d.empresa === "Varias");
      if (!tieneDatos) { Toast.show("Datos insuficientes de la empresa: no hay documentos ingestados. El reporte puede estar incompleto.", "warn"); }
      Report.openModal(empresa, `${desde} - ${hasta}`, secciones, null);
    });
  }
};
