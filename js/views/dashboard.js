Views.dashboard = {
  html() {
    const role = App.state.role;
    const u = App.state.user;
    const docs = App.state.documents.filter((d) => d.estado === "Disponible").length;
    const rep = App.state.reports.length;
    const sancionesTotal = Object.values(DB.sanciones).flat().length;
    const audit = App.state.audit;
    const esgProm = (DB.empresas.reduce((a, e) => a + e.esg, 0) / DB.empresas.length).toFixed(1);

    let kpis = "";
    if (role === "superadmin") {
      const activos = App.state.users.filter((x) => x.estado === "Activo").length;
      kpis = [
        Cards.kpiCard({ titulo: "Usuarios activos", valor: activos, delta: "1 nuevo", icono: "group", pie: activos * 15 }),
        Cards.kpiCard({ titulo: "Eventos de auditoría", valor: audit.length, delta: "hoy", icono: "history", color: "secondary", pie: 80 }),
        Cards.kpiCard({ titulo: "Documentos indexados", valor: docs, icono: "folder_open", color: "tertiary", pie: docs * 8 }),
        Cards.kpiCard({ titulo: "Expiración de sesión", valor: App.state.config.minutos + " min", icono: "timer", pie: App.state.config.minutos * 2, extra: "Configurado por seguridad (RNF-01)" })
      ].join("");
    } else if (role === "administrador") {
      kpis = [
        Cards.kpiCard({ titulo: "Empresas monitoreadas", valor: DB.empresas.length, delta: "12%", icono: "domain", pie: 80 }),
        Cards.kpiCard({ titulo: "Reportes generados", valor: rep, delta: "2 este mes", icono: "description", color: "secondary", pie: rep * 20 }),
        Cards.kpiCard({ titulo: "Alertas de sanciones", valor: sancionesTotal, delta: "2 nuevas", deltaDir: "down", icono: "gavel", color: "tertiary", pie: sancionesTotal * 12 }),
        Cards.kpiCard({ titulo: "Consultas IA", valor: "3,492", delta: "28%", icono: "psychology", color: "secondary", pie: 90, extra: 'Promedio de respuesta: <strong class="text-on-background">1.2s</strong>' })
      ].join("");
    } else {
      kpis = [
        Cards.kpiCard({ titulo: "Empresas cotizadas", valor: DB.empresas.length, icono: "domain", pie: 60 }),
        Cards.kpiCard({ titulo: "Índice sostenibilidad prom.", valor: esgProm, delta: "+1.2 pts", icono: "trending_up", color: "secondary", pie: esgProm }),
        Cards.kpiCard({ titulo: "Reportes disponibles", valor: rep, icono: "picture_as_pdf", color: "tertiary", pie: rep * 20 }),
        Cards.kpiCard({ titulo: "Acceso", valor: "Solo lectura", icono: "visibility", pie: 100, extra: "Datos de la Bolsa de Valores (RF-03)" })
      ].join("");
    }

    const actividad = audit.slice(-5).reverse().map((a) => `
      <div class="flex gap-md items-start group">
        <div class="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 mt-1">
          <span class="material-symbols-outlined text-[16px]">${a.tipo.includes("Inicio") ? "login" : a.tipo.includes("Ingesta") || a.tipo.includes("Actualización") ? "upload_file" : a.tipo.includes("rol") ? "manage_accounts" : a.tipo.includes("reporte") || a.tipo.includes("Descarga") ? "description" : "settings"}</span>
        </div>
        <div class="flex-1 border-b border-surface-variant pb-3 group-last:border-0">
          <p class="text-body-md font-medium text-on-background">${Helpers.esc(a.accion)}</p>
          <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">${Helpers.esc(a.usuario)} · ${Helpers.esc(a.fecha)}</p>
        </div>
      </div>`).join("");

    const chart = Charts.lineChart(
      DB.empresas.map((e) => e.esg),
      DB.empresas.map((e) => e.ticker),
      "#006038", "#006a61",
      DB.empresas.map((e) => 100 - e.esg)
    );

    return `
      ${Cards.sectionHeader(`Hola, ${Helpers.esc(u.nombre.split(" ")[0])} 👋`, "Visión general de la plataforma Igualab.")}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">${kpis}</div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div class="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-surface-variant p-lg ambient-shadow flex flex-col min-h-[420px]">
          <div class="flex justify-between items-center mb-lg">
            <div>
              <h3 class="font-title-lg text-title-lg text-on-background">Tendencias ESG por empresa</h3>
              <p class="font-label-md text-label-md text-on-surface-variant">Puntaje promedio de sostenibilidad (0-100)</p>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md text-label-md border border-primary/20">Ambiental</button>
              <button class="px-3 py-1 rounded-full bg-surface text-on-surface-variant font-label-md text-label-md border border-outline-variant">Social</button>
              <button class="px-3 py-1 rounded-full bg-surface text-on-surface-variant font-label-md text-label-md border border-outline-variant">Gobernanza</button>
            </div>
          </div>
          ${chart}
        </div>
        <div class="bg-surface-container-lowest rounded-xl border border-surface-variant p-lg ambient-shadow flex flex-col">
          <div class="flex justify-between items-center mb-md">
            <h3 class="font-title-lg text-title-lg text-on-background">Últimas actividades</h3>
          </div>
          <div class="flex-1 overflow-y-auto pr-2 -mr-2">${actividad || '<p class="text-body-md text-on-surface-variant">Sin actividades registradas.</p>'}</div>
          <button data-action="go-auditoria" class="w-full mt-4 py-2 text-center text-primary text-label-md font-semibold hover:bg-primary/5 rounded-lg transition-colors ${role === "superadmin" ? "" : "hidden"}">Ver toda la auditoría</button>
        </div>
      </div>`;
  }
};
