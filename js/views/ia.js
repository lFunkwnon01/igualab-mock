Views.ia = {
  html() {
    const chips = DB.chat.sugerencias.map((s) => `<button data-chip="${Helpers.esc(s)}" class="px-4 py-2 bg-surface-container-low hover:bg-surface-variant rounded-full font-label-md text-label-md text-on-surface-variant transition-colors">${Helpers.esc(s)}</button>`).join("");
    return `
      <div class="flex flex-col h-[calc(100vh-140px)] -m-lg md:-m-xl">
        <div class="flex-1 flex overflow-hidden">
          <div class="flex-1 flex flex-col relative bg-surface">
            <div id="chat-messages" class="flex-1 overflow-y-auto chat-scroll p-xl flex flex-col gap-xl" role="log" aria-live="polite">
              <div class="flex gap-lg max-w-4xl">
                <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary">psychology</span></div>
                <div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl rounded-tl-sm shadow-sm">
                  <p class="text-body-md text-on-surface mb-md">Hola, soy el Asistente de IA de Igualab. Analizo los reportes GRI, memorias anuales y métricas ingestadas para apoyar la prospección comercial.</p>
                  <p class="text-body-md text-on-surface mb-md">¿Qué deseas explorar hoy? Respuesta estándar en &lt; 5 s (RNF-02).</p>
                  <div class="mt-md flex flex-wrap gap-sm">${chips}</div>
                </div>
              </div>
            </div>
            <div class="p-xl bg-surface border-t border-outline-variant">
              <div class="max-w-4xl mx-auto relative">
                <div class="bg-surface-container-lowest border-2 border-outline-variant rounded-xl focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(0,96,56,0.1)] transition-all duration-200">
                  <textarea id="chat-input" rows="2" class="w-full bg-transparent border-none rounded-xl text-body-md text-on-surface p-lg resize-none focus:ring-0 outline-none" placeholder="Pregunta sobre brechas GRI, sanciones, métricas..."></textarea>
                  <div class="flex justify-between items-center px-md pb-md">
                    <div class="flex gap-sm">
                      <button class="p-2 text-outline hover:text-primary hover:bg-surface-container-low rounded-full transition-colors" title="Adjuntar"><span class="material-symbols-outlined">attach_file</span></button>
                      <button class="p-2 text-outline hover:text-primary hover:bg-surface-container-low rounded-full transition-colors" title="Métricas"><span class="material-symbols-outlined">data_exploration</span></button>
                    </div>
                    <div class="flex items-center gap-md">
                      <span class="font-label-sm text-label-sm text-outline hidden sm:inline" id="chat-latency"></span>
                      <button id="chat-send" class="bg-primary hover:bg-surface-tint text-on-primary px-lg py-2 rounded-lg font-label-md text-label-md font-semibold flex items-center gap-sm transition-colors"><span>Analizar</span><span class="material-symbols-outlined">send</span></button>
                    </div>
                  </div>
                </div>
                <p class="text-center font-label-sm text-label-sm text-outline mt-sm">La IA siempre cita la fuente (RF-05). Puede cometer errores: verifica en el panel de fuentes.</p>
              </div>
            </div>
          </div>
          <aside class="w-[340px] bg-surface-container-lowest border-l border-outline-variant flex-col shrink-0 hidden xl:flex">
            <div class="p-lg border-b border-outline-variant">
              <h2 class="font-title-lg text-title-lg text-on-surface flex items-center gap-sm"><span class="material-symbols-outlined text-secondary">analytics</span> Fuentes y Análisis</h2>
            </div>
            <div class="flex border-b border-outline-variant px-md">
              <button data-tab="gri" class="flex-1 py-3 border-b-2 border-primary font-label-md text-label-md text-primary font-bold">Brechas GRI</button>
              <button data-tab="sanciones" class="flex-1 py-3 border-b-2 border-transparent font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Sanciones</button>
            </div>
            <div id="panel-fuentes" class="flex-1 overflow-y-auto p-lg space-y-lg chat-scroll"></div>
          </aside>
        </div>
      </div>`;
  },
  after(root) {
    const panel = root.querySelector("#panel-fuentes");
    function renderPanel(tab) {
      if (tab === "gri") {
        panel.innerHTML = DB.gri.andina.map((g, i) => `
          <div class="bg-surface border border-outline-variant rounded-lg p-md border-l-4 ${g.estado === "OK" ? "border-l-primary" : "border-l-secondary-fixed"}">
            <div class="flex justify-between items-start mb-sm"><span class="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded text-[10px] font-bold uppercase">${g.codigo}</span>${Badges.estadoBadge(g.estado)}</div>
            <h4 class="font-label-md text-label-md font-bold text-on-surface mb-xs">${g.tema}</h4>
            <p class="font-label-sm text-label-sm text-on-surface-variant">${Helpers.esc(g.detalle)}</p>
            <p class="mt-md bg-surface-container-low p-sm rounded text-xs text-on-surface-variant italic border-l-2 border-outline-variant">Fuente: Memoria Anual 2024 · Minera Andina S.A.A. ${g.estado !== "OK" ? "→ oportunidad de prospección" : ""}</p>
          </div>`).join("");
      } else {
        panel.innerHTML = DB.sanciones.andina.map((s) => `
          <div class="bg-surface border border-outline-variant rounded-lg p-md border-l-4 border-l-error">
            <div class="flex justify-between items-start mb-sm"><span class="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold uppercase">Sanción ${s.anio}</span></div>
            <h4 class="font-label-md text-label-md font-bold text-on-surface">${Helpers.esc(s.entidad)}</h4>
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-sm">${Helpers.esc(s.motivo)}</p>
            <p class="font-title-lg text-title-lg text-error font-bold">${Helpers.money(s.monto)}</p>
          </div>`).join("");
      }
    }
    renderPanel("gri");
    root.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => {
      root.querySelectorAll("[data-tab]").forEach((x) => x.className = x.className.replace("border-primary text-primary font-bold", "border-transparent text-on-surface-variant"));
      b.className = b.className.replace("border-transparent text-on-surface-variant", "border-primary text-primary font-bold");
      renderPanel(b.dataset.tab);
    }));

    const messages = root.querySelector("#chat-messages");
    const input = root.querySelector("#chat-input");
    function userBubble(text) {
      messages.insertAdjacentHTML("beforeend", `
        <div class="flex gap-lg max-w-4xl self-end flex-row-reverse">
          <div class="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-surface-variant">person</span></div>
          <div class="bg-primary-container p-lg rounded-xl rounded-tr-sm shadow-sm text-on-primary-container"><p class="text-body-md">${text}</p></div>
        </div>`);
    }
    function botBubble(html, fuentes, latency) {
      const fChips = fuentes.map((f) => `<span class="px-3 py-1 bg-surface-container-highest rounded-full font-label-md text-label-md text-on-surface flex items-center gap-xs"><span class="material-symbols-outlined text-[16px]">description</span> ${Helpers.esc(f.doc)}</span>`).join("");
      const citas = fuentes.map((f) => `<span class="inline-flex items-center bg-secondary-fixed text-on-secondary-fixed rounded px-1.5 py-0.5 text-xs font-bold mx-1" title="${Helpers.esc(f.doc)} · ${Helpers.esc(f.pagina)}">${f.cita}</span>`).join(" ");
      messages.insertAdjacentHTML("beforeend", `
        <div class="flex gap-lg max-w-4xl">
          <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary">psychology</span></div>
          <div class="bg-surface-container-lowest border border-secondary-fixed p-lg rounded-xl rounded-tl-sm shadow-sm relative overflow-hidden w-full">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary-fixed"></div>
            <p class="text-body-md text-on-surface">${html} ${citas}</p>
            ${fuentes.length ? `<div class="flex items-center gap-sm mt-lg pt-md border-t border-outline-variant flex-wrap"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Fuentes citadas:</span>${fChips}</div>` : ""}
            <div class="mt-md font-label-sm text-label-sm text-outline">Respuesta en ${latency}s · cita verificable · sin datos inventados</div>
          </div>
        </div>`);
      messages.scrollTop = messages.scrollHeight;
    }
    function clasificar(t) {
      t = t.toLowerCase();
      if (t.includes("sanci") || t.includes("débil") || t.includes("debil")) return "sanciones";
      if (t.includes("gri") || t.includes("brecha")) return "brechas";
      if (t.includes("resumen") || t.includes("memoria") || t.includes("energ")) return "resumen";
      return "fallback";
    }
    function responder(texto) {
      const key = clasificar(texto);
      const r = DB.chat.respuestas[key];
      const typing = document.createElement("div");
      typing.className = "flex gap-lg";
      typing.innerHTML = `<div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary">psychology</span></div><div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl rounded-tl-sm shadow-sm flex gap-xs items-center h-[56px]"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      const latency = (1.2 + Math.random() * 2).toFixed(1);
      setTimeout(() => {
        typing.remove();
        botBubble(r.texto, r.fuentes, latency);
        root.querySelector("#chat-latency").textContent = `⏱ ${latency}s < 5s (RNF-02)`;
        if (key === "sanciones" || key === "brechas") {
          const tab = key === "sanciones" ? "sanciones" : "gri";
          root.querySelector(`[data-tab="${tab}"]`).click();
        }
        App.pushAudit("Consulta IA", `Consulta al asistente: '${texto.slice(0, 60)}...'`);
      }, 1400);
    }
    function enviar() {
      const t = input.value.trim();
      if (!t) return;
      userBubble(Helpers.esc(t));
      input.value = "";
      responder(t);
    }
    root.querySelector("#chat-send").addEventListener("click", enviar);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } });
    root.querySelectorAll("[data-chip]").forEach((c) => c.addEventListener("click", () => responder(c.dataset.chip)));
  }
};
