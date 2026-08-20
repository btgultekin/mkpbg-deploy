window.MokaAdmin = {
  basePath() {
    const fromDom = document.body?.getAttribute("data-admin-base");
    return fromDom && fromDom.trim() ? fromDom.replace(/\/+$/, "") : "";
  },
  url(segment) {
    const base = this.basePath();
    if (!base) return "";
    const path = String(segment || "").replace(/^\/+/, "");
    return path ? `${base}/${path}` : base;
  }
};

(() => {
  const sidebar = document.getElementById("admin-sidebar");
  const toggle = document.getElementById("sidebar-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");

  const setOpen = (open) => {
    sidebar?.classList.toggle("-translate-x-full", !open);
    backdrop?.classList.toggle("hidden", !open);
  };

  toggle?.addEventListener("click", () => {
    const open = sidebar?.classList.contains("-translate-x-full");
    setOpen(Boolean(open));
  });

  backdrop?.addEventListener("click", () => setOpen(false));

  const menu = document.getElementById("user-menu");
  const menuToggle = document.getElementById("user-menu-toggle");
  const dropdown = document.getElementById("user-menu-dropdown");
  if (!menu || !menuToggle || !dropdown) return;

  const setMenuOpen = (open) => {
    dropdown.classList.toggle("hidden", !open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(dropdown.classList.contains("hidden"));
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
})();
