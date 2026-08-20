(() => {
  const bindModal = ({ modalId, formId, openAttr, closeAttr, fields }) => {
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    if (!modal || !form) return;

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

    document.querySelectorAll(`[${openAttr}]`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute(fields.action);
        if (!action) return;

        form.setAttribute("action", action);
        fields.fill(btn);
        open();
      });
    });

    modal.querySelectorAll(`[${closeAttr}]`).forEach((el) => {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) close(e);
    });
  };

  bindModal({
    modalId: "refund-modal",
    formId: "refund-form",
    openAttr: "data-refund-open",
    closeAttr: "data-refund-close",
    fields: {
      action: "data-refund-action",
      fill: (btn) => {
        const trxEl = document.getElementById("refund-modal-trx");
        const companyEl = document.getElementById("refund-modal-company");
        const amountEl = document.getElementById("refund-modal-amount");
        if (trxEl) trxEl.textContent = btn.getAttribute("data-refund-trx") || "—";
        if (companyEl) companyEl.textContent = btn.getAttribute("data-refund-company") || "—";
        if (amountEl) amountEl.textContent = btn.getAttribute("data-refund-amount") || "—";
      }
    }
  });

  bindModal({
    modalId: "status-modal",
    formId: "status-form",
    openAttr: "data-status-open",
    closeAttr: "data-status-close",
    fields: {
      action: "data-status-action",
      fill: (btn) => {
        const trxEl = document.getElementById("status-modal-trx");
        const companyEl = document.getElementById("status-modal-company");
        const amountEl = document.getElementById("status-modal-amount");
        const selectEl = document.getElementById("status-select");
        if (trxEl) trxEl.textContent = btn.getAttribute("data-status-trx") || "—";
        if (companyEl) companyEl.textContent = btn.getAttribute("data-status-company") || "—";
        if (amountEl) amountEl.textContent = btn.getAttribute("data-status-amount") || "—";
        if (selectEl) {
          const current = btn.getAttribute("data-status-current") || "Succeeded";
          const allowed = ["Succeeded", "Refunded", "Failed"];
          selectEl.value = allowed.includes(current) ? current : "Succeeded";
        }
      }
    }
  });

  const detailModal = document.getElementById("payment-detail-modal");
  if (detailModal) {
    const receiptLink = document.getElementById("payment-detail-receipt");
    const receiptHint = document.getElementById("payment-detail-receipt-hint");
    const resultWrap = document.getElementById("payment-detail-result-wrap");
    const resultEl = document.getElementById("payment-detail-result");
    const statusEl = document.getElementById("payment-detail-status");

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = value && String(value).trim() ? String(value) : "—";
    };

    const isOpen = () => detailModal.classList.contains("is-open");

    const open = () => {
      detailModal.classList.add("is-open");
      detailModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");
    };

    const close = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      detailModal.classList.remove("is-open");
      detailModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("overflow-hidden");
    };

    document.querySelectorAll("[data-payment-detail]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const url = btn.getAttribute("data-detail-url");
        if (!url) return;

        btn.disabled = true;
        try {
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
            credentials: "same-origin"
          });
          if (!res.ok) throw new Error("Detay okunamadı");
          const data = await res.json();

          setText("payment-detail-trx", data.transactionId);
          setText("payment-detail-date", data.createdAt);
          setText("payment-detail-completed", data.completedAt);
          setText("payment-detail-company", data.companyTitle);
          setText("payment-detail-tax", data.taxNumber);
          setText("payment-detail-amount", data.amountText);
          setText("payment-detail-installment", data.installmentLabel);
          setText("payment-detail-description", data.description);
          setText("payment-detail-moka", data.mokaTrxCode);
          setText("payment-detail-card", [data.cardHolderName, data.cardLastFour].filter(Boolean).join(" · "));

          if (statusEl) {
            statusEl.textContent = data.statusLabel || "—";
            statusEl.className = data.statusClass || "badge-muted";
          }

          const resultText = [data.resultCode, data.resultMessage].filter(Boolean).join(" · ");
          if (resultWrap && resultEl) {
            resultEl.textContent = resultText;
            resultWrap.classList.toggle("hidden", !resultText);
          }

          if (receiptLink) {
            const canDownload = Boolean(data.canDownloadReceipt && data.receiptUrl);
            receiptLink.classList.toggle("hidden", !canDownload);
            receiptLink.setAttribute("href", canDownload ? data.receiptUrl : "#");
          }
          if (receiptHint) {
            receiptHint.classList.toggle("hidden", Boolean(data.canDownloadReceipt));
          }

          open();
        } catch {
          alert("Ödeme detayı yüklenemedi.");
        } finally {
          btn.disabled = false;
        }
      });
    });

    detailModal.querySelectorAll("[data-payment-detail-close]").forEach((el) => {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) close(e);
    });
  }
})();
