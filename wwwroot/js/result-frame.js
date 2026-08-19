(() => {
  const el = document.getElementById("payment-result");
  if (!el) return;

  const payload = {
    type: "moka-3d-complete",
    orderId: el.getAttribute("data-order-id") || "",
    otherTrxCode: el.getAttribute("data-other-trx") || "",
    success: el.getAttribute("data-success") === "true"
  };
  const origin = window.location.origin;

  if (window.parent !== window) {
    window.parent.postMessage(payload, origin);
    document.body.classList.add("is-3d-framed");
    return;
  }

  if (window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage(payload, origin);
    } catch {
      // Opener may be unreachable; the parent page also polls order status.
    }
    window.close();
  }
})();
