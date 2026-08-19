(() => {
  const modal = document.getElementById("refund-modal");
  const form = document.getElementById("refund-form");
  if (!modal || !form) return;

  const trxEl = document.getElementById("refund-modal-trx");
  const companyEl = document.getElementById("refund-modal-company");
  const amountEl = document.getElementById("refund-modal-amount");

  const isOpen = () => modal.classList.contains("is-open");

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
  };

  const close = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
  };

  document.querySelectorAll("[data-refund-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-refund-action");
      if (!action) return;

      form.setAttribute("action", action);
      if (trxEl) trxEl.textContent = btn.getAttribute("data-refund-trx") || "—";
      if (companyEl) companyEl.textContent = btn.getAttribute("data-refund-company") || "—";
      if (amountEl) amountEl.textContent = btn.getAttribute("data-refund-amount") || "—";
      open();
    });
  });

  modal.querySelectorAll("[data-refund-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close(e);
  });
})();
