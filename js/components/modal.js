const Modal = (() => {
  function open(html, { width = "max-w-lg" } = {}) {
    const root = document.getElementById("modal-root");
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-50 flex items-center justify-center p-4";
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-inverse-surface/50 backdrop-blur-[2px]" data-modal-close></div>
      <div class="modal-enter relative bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-[0_12px_32px_rgba(0,0,0,0.12)] w-full ${width} max-h-[92vh] flex flex-col">
        ${html}
      </div>`;
    overlay.querySelectorAll("[data-modal-close]").forEach((b) => b.addEventListener("click", () => overlay.remove()));
    root.appendChild(overlay);
    return overlay;
  }

  function close() {
    const root = document.getElementById("modal-root");
    if (root.lastElementChild) root.lastElementChild.remove();
  }

  return { open, close };
})();
