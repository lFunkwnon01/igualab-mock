Views.usuarios = {
  html() {
    const rows = App.state.users.map((u) => `
      <tr class="border-b border-surface-variant hover:bg-surface/50 transition-colors">
        <td class="py-md px-md font-medium">${Helpers.esc(u.nombre)}</td>
        <td class="py-md px-md text-on-surface-variant">${Helpers.esc(u.correo)}</td>
        <td class="py-md px-md">${Badges.estadoBadge(u.estado)}</td>
        <td class="py-md px-md"><span class="font-label-md text-label-md ${u.rol === "superadmin" ? "text-tertiary font-bold" : u.rol === "administrador" ? "text-secondary font-bold" : "text-primary"}">${DB.roleLabels[u.rol]}</span></td>
        <td class="py-md px-md text-right">
          <div class="flex justify-end gap-xs">
            <button data-editar="${u.id}" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5" title="Editar"><span class="material-symbols-outlined text-[18px]">edit</span></button>
            <button data-baja="${u.id}" class="p-1.5 rounded-lg text-on-surface-variant hover:text-tertiary hover:bg-tertiary-fixed/20" title="Dar de baja"><span class="material-symbols-outlined text-[18px]">person_off</span></button>
            <button data-revocar="${u.id}" class="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30" title="Revocar rol"><span class="material-symbols-outlined text-[18px]">no_accounts</span></button>
          </div>
        </td>
      </tr>`).join("");
    return `
      ${Cards.sectionHeader("Gestión de usuarios, roles y permisos", "Ciclo de vida de cuentas. Únicamente el Superadmin administra usuarios (RF-02).",
      `<button data-action="crear-usuario" class="flex items-center gap-sm px-md py-sm bg-primary text-on-primary rounded-lg text-label-md font-semibold hover:bg-surface-tint transition-colors shadow-sm"><span class="material-symbols-outlined text-[18px]">person_add</span> Crear usuario</button>`)}
      <div class="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead><tr class="bg-surface-container-low border-b border-outline-variant">
              ${["Usuario", "Correo", "Estado", "Rol", "Acciones"].map((h) => `<th class="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider ${h === "Acciones" ? "text-right" : ""}">${h}</th>`).join("")}
            </tr></thead>
            <tbody class="text-body-md">${rows}</tbody>
          </table>
        </div>
        <div class="p-sm border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <span class="font-label-sm text-label-sm text-on-surface-variant">${App.state.users.length} usuarios registrados · Baja lógica preserva historial</span>
        </div>
      </div>`;
  }
};
