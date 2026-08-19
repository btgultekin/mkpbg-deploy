(() => {
  const host = document.getElementById("three-d-host");
  if (!host) return;

  const origin = window.location.origin;
  const orderId = host.getAttribute("data-order-id") || "";
  const acsUrl = host.getAttribute("data-acs-url") || "";
  const ticket = new URLSearchParams(window.location.search).get("t") || "";
  const fallback = document.getElementById("three-d-fallback");
  const openBtn = document.getElementById("three-d-open-acs");
  const emptyGuid = "00000000-0000-0000-0000-000000000000";
  let finished = false;
  let acsWindow = null;

  const goToResult = (id, otherTrx) => {
    if (finished) return;
    finished = true;
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)
        && id !== emptyGuid) {
      window.location.replace(`${origin}/payment/result/${id}`);
      return;
    }
    if (otherTrx && otherTrx.length <= 64) {
      window.location.replace(
        `${origin}/payment/result?otherTrxCode=${encodeURIComponent(otherTrx)}`);
    }
  };

  window.addEventListener("message", (event) => {
    if (event.origin !== origin) return;
    const data = event.data;
    if (!data || data.type !== "moka-3d-complete") return;
    goToResult(
      typeof data.orderId === "string" ? data.orderId : "",
      typeof data.otherTrxCode === "string" ? data.otherTrxCode : "");
  });

  const pollStatus = async () => {
    if (finished || !ticket || !orderId) return;
    try {
      const response = await fetch(
        `${origin}/payment/three-d/${orderId}/status?t=${encodeURIComponent(ticket)}`,
        { credentials: "same-origin", headers: { Accept: "application/json" } });
      if (!response.ok) return;
      const body = await response.json();
      if (body && body.done) {
        if (acsWindow && !acsWindow.closed) acsWindow.close();
        goToResult(orderId, "");
      }
    } catch {
      // Keep polling; a single failed probe must not stop 3D completion.
    }
  };

  window.setInterval(pollStatus, 2500);
  window.setTimeout(() => {
    if (!finished && fallback) fallback.classList.remove("hidden");
  }, 4000);

  openBtn?.addEventListener("click", () => {
    if (!acsUrl) return;
    acsWindow = window.open(acsUrl, "moka-3d-acs", "width=480,height=720");
  });
})();
