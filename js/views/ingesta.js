function ingestionView({ modo }) {
  const esUpdate = modo === "update";
  const titulo = esUpdate ? "Actualizar base de datos" : "Ingesta de datos";
  const sub = esUpdate
    ? "Carga de archivos fuente (memorias anuales y reportes de sostenibilidad) para mantener la base vigente (RF-16)."
    : "Carga de memorias anuales, reportes GRI y métricas. Se unifican en una base común (RF-11).";
  const rows = App.state.documents.map((d) => `
    <tr class="border-b border-surface-variant hover:bg-surface/50 transition-colors">
      <td class="py-md px-md"><div class="flex items-center gap-sm"><span class="material-symbols-outlined text-${d.tipo === "Métricas" ? "tertiary" : d.tipo === "Reporte GRI" ? "secondary" : "primary"}">description</span><div><p class="font-medium text-on-background">${Helpers.esc(d.nombre)}</p><p class="font-label-sm text-label-sm text-outline">${Helpers.esc(d.fuente)} · ${d.tamano}</p></div></div></td>
      <td class="py-md px-md">${Helpers.esc(d.empresa)}</td>
      <td class="py-md px-md text-on-surface-variant">${d.anio}</td>
      <td class="py-md px-md">${Helpers.esc(d.tipo)}</td>
      <td class="py-md px-md">${Badges.estadoBadge(d.estado)}</td>
      <td class="py-md px-md text-on-surface-variant whitespace-nowrap">${Helpers.esc(d.fecha)}</td>
    </tr>`).join("");
  return `
    ${Cards.sectionHeader(titulo, sub)}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <div class="lg:col-span-1 space-y-lg">
        <div class="bg-surface-container-lowest rounded-xl border border-surface-variant p-lg ambient-shadow">
          <h3 class="font-title-lg text-title-lg text-on-background mb-md">Nueva carga</h3>
          <label id="dropzone" class="dropzone flex flex-col items-center justify-center gap-sm border-2 border-dashed border-outline-variant rounded-xl p-xl text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
            <span class="material-symbols-outlined text-[40px] text-primary">cloud_upload</span>
            <span class="text-body-md text-on-background font-medium">Arrastra archivos aquí o haz clic</span>
            <span class="font-label-sm text-label-sm text-outline">PDF · DOCX · XLSX (memorias, reportes GRI, métricas)</span>
            <input id="file-input" type="file" multiple class="hidden" accept=".pdf,.docx,.xlsx"/>
          </label>
          <div class="space-y-md mt-lg">
            <div class="flex flex-col gap-xs"><label class="font-label-md text-label-md text-on-surface-variant">Empresa</label>
              <select id="ing-empresa" class="rounded-lg border-outline-variant bg-surface-container-low py-sm px-md text-body-md focus:border-primary focus:ring-primary"><option>Varias</option>${DB.empresas.map((e) => `<option>${Helpers.esc(e.nombre)}</option>`).join("")}</select></div>
            <div class="grid grid-cols-2 gap-sm">
              <div class="flex flex-col gap-xs"><label class="font-label-md text-label-md text-on-surface-variant">Año</label>
                <input id="ing-anio" type="number" value="2025" class="rounded-lg border-outline-variant bg-surface-container-low py-sm px-md text-body-md focus:border-primary focus:ring-primary"/></div>
              <div class="flex flex-col gap-xs"><label class="font-label-md text-label-md text-on-surface-variant">Fuente</label>
                <select id="ing-fuente" class="rounded-lg border-outline-variant bg-surface-container-low py-sm px-md text-body-md focus:border-primary focus:ring-primary"><option>Bolsa de Valores de Lima</option><option>Web corporativa</option><option>Base Igualab</option></select></div>
            </div>
            <p class="font-label-sm text-label-sm text-outline flex items-start gap-xs"><span class="material-symbols-outlined text-[14px]">info</span> El procesamiento es asíncrono: extraemos e indexamos el contenido para el asistente de IA.</p>
          </div>
        </div>
      </div>
      <div class="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden">
        <div class="p-lg border-b border-outline-variant bg-surface-bright flex justify-between items-center">
          <h3 class="font-title-lg text-title-lg text-on-surface">Documentos ${esUpdate ? "actualizados" : "ingestados"}</h3>
          <span class="font-label-sm text-label-sm text-on-surface-variant">Base común unificada (RF-11)</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead><tr class="bg-surface-container-low border-b border-outline-variant">
              ${["Documento", "Empresa", "Año", "Tipo", "Estado", "Fecha"].map((h) => `<th class="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">${h}</th>`).join("")}
            </tr></thead>
            <tbody id="ing-body" class="text-body-md">${rows}</tbody>
          </table>
        </div>
      </div>
    </div>`;
}

function bindIngesta(root, modo) {
  const dz = root.querySelector("#dropzone");
  const input = root.querySelector("#file-input");
  dz.addEventListener("click", () => input.click());
  ["dragover", "dragleave", "drop"].forEach((ev) => dz.addEventListener(ev, (e) => {
    e.preventDefault();
    dz.classList.toggle("dropzone-active", ev === "dragover");
    if (ev === "drop" && e.dataTransfer.files.length) procesar(Array.from(e.dataTransfer.files));
  }));
  input.addEventListener("change", () => { if (input.files.length) procesar(Array.from(input.files)); });

  function procesar(files) {
    const empresa = root.querySelector("#ing-empresa").value;
    const anio = root.querySelector("#ing-anio").value;
    const fuente = root.querySelector("#ing-fuente").value;
    const body = root.querySelector("#ing-body");
    files.forEach((f, i) => {
      const ok = /\.(pdf|docx|xlsx)$/i.test(f.name);
      if (!ok) { Toast.show(`Formato no soportado: ${f.name}. Se rechazó la carga.`, "error"); return; }
      const dup = App.state.documents.find((d) => d.nombre === f.name);
      if (dup && modo === "update") {
        Modal.open(`
          <div class="p-xl text-center">
            <span class="material-symbols-outlined text-[48px] text-tertiary">sync_problem</span>
            <h3 class="font-title-lg text-title-lg text-on-background mt-md">El archivo ya existe</h3>
            <p class="text-body-md text-on-surface-variant mt-sm">"${Helpers.esc(f.name)}" ya está en la base. ¿Deseas reemplazarlo con la versión más reciente?</p>
            <div class="flex justify-center gap-sm mt-lg">
              <button data-modal-close class="px-lg py-sm rounded-lg border border-outline-variant text-body-md text-on-surface-variant">Cancelar</button>
              <button id="btn-reemplazar" class="px-lg py-sm rounded-lg bg-tertiary text-on-tertiary text-label-md font-semibold">Reemplazar</button>
            </div>
          </div>`);
        document.getElementById("btn-reemplazar").addEventListener("click", () => { Modal.close(); cargar(f, empresa, anio, fuente, true); });
        return;
      }
      cargar(f, empresa, anio, fuente, false);
    });

    function cargar(f, empresa, anio, fuente, reemplazo) {
      const id = "d" + Date.now() + "-" + i;
      const doc = { id, nombre: f.name, tipo: /\.xlsx$/i.test(f.name) ? "Métricas" : /sostenibilidad|gri/i.test(f.name) ? "Reporte GRI" : "Memoria Anual", empresa, anio, sector: "—", fuente, estado: "Procesando", fecha: new Date().toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" }), tamano: (f.size / 1e6).toFixed(1) + " MB" };
      if (reemplazo) {
        const ix = App.state.documents.findIndex((d) => d.nombre === f.name);
        doc.id = App.state.documents[ix].id;
        App.state.documents[ix] = doc;
      } else {
        App.state.documents.unshift(doc);
      }
      renderFila(doc);
      App.pushAudit(modo === "update" ? "Actualización BD" : "Ingesta de datos", `${reemplazo ? "Reemplazó" : "Cargó"} '${f.name}'`);
      setTimeout(() => {
        doc.estado = "Disponible";
        const tr = body.querySelector(`[data-doc="${id}"]`);
        if (tr) tr.querySelector("[data-estado]").innerHTML = Badges.estadoBadge("Disponible");
        Toast.show(`'${f.name}' quedó disponible para consulta del asistente IA.`, "success");
      }, 2500);
      Toast.show(`Procesando '${f.name}'... extracción e indexado en segundo plano.`, "info");
    }

    function renderFila(d) {
      const tr = document.createElement("tr");
      tr.setAttribute("data-doc", d.id);
      tr.className = "border-b border-surface-variant";
      tr.innerHTML = `
        <td class="py-md px-md"><div class="flex items-center gap-sm"><span class="material-symbols-outlined text-${d.tipo === "Métricas" ? "tertiary" : d.tipo === "Reporte GRI" ? "secondary" : "primary"}">description</span><div><p class="font-medium text-on-background">${Helpers.esc(d.nombre)}</p><p class="font-label-sm text-label-sm text-outline">${Helpers.esc(d.fuente)} · ${d.tamano}</p></div></div></td>
        <td class="py-md px-md">${Helpers.esc(d.empresa)}</td>
        <td class="py-md px-md text-on-surface-variant">${d.anio}</td>
        <td class="py-md px-md">${Helpers.esc(d.tipo)}</td>
        <td class="py-md px-md" data-estado>${Badges.estadoBadge(d.estado)}</td>
        <td class="py-md px-md text-on-surface-variant whitespace-nowrap">${Helpers.esc(d.fecha)}</td>`;
      body.prepend(tr);
    }
  }
}

Views.ingesta = {
  html: () => ingestionView({ modo: "ingesta" }),
  after(root) { bindIngesta(root, "ingesta"); }
};

Views.actualizar = {
  html: () => ingestionView({ modo: "update" }),
  after(root) { bindIngesta(root, "update"); }
};
