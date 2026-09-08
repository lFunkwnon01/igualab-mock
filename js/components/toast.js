const Toast = (() => {
  function show(msg, type = "success") {
    const root = document.getElementById("toast-root");
    const colors = {
      success: "bg-primary text-on-primary",
      error: "bg-error text-on-error",
      info: "bg-secondary text-on-secondary",
      warn: "bg-tertiary text-on-tertiary"
    };
    const icons = { success: "check_circle", error: "error", info: "info", warn: "warning" };
    const el = document.createElement("div");
    el.className = `toast-enter ${colors[type]} rounded-xl px-lg py-md shadow-lg flex items-center gap-md text-body-md`;
    el.innerHTML = `<span class="material-symbols-outlined text-[20px]">${icons[type]}</span><span>${msg}</span>`;
    root.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity 0.3s";
      setTimeout(() => el.remove(), 300);
    }, 3500);
  }

  return { show };
})();
