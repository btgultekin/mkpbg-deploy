(() => {
  const tabs = document.querySelectorAll(".settings-tab");
  const panels = document.querySelectorAll("[data-tab-panel]");
  const activeTabInput = document.getElementById("active-tab");
  const provider = document.getElementById("pos-provider");
  const warning = document.getElementById("provider-warning");
  const liveMode = document.getElementById("live-mode");
  const baseUrl = document.getElementById("base-url");
  const modeHint = document.getElementById("mode-hint");
  const overlayRange = document.getElementById("overlay-range");
  const overlayValue = document.getElementById("overlay-value");
  const panelFile = document.getElementById("panel-media-file");
  const panelHint = document.getElementById("panel-media-hint");
  const mediaTypeRadios = document.querySelectorAll('input[name="CheckoutPanelMediaType"]');

  const testUrl = "https://service.refmokaunited.com";
  const liveUrl = "https://service.mokaunited.com";

  const activateTab = (key) => {
    if (!key) return;
    tabs.forEach((item) => {
      const active = item.getAttribute("data-tab") === key;
      item.classList.toggle("border-slate-900", active);
      item.classList.toggle("text-slate-900", active);
      item.classList.toggle("font-semibold", active);
      item.classList.toggle("border-transparent", !active);
      item.classList.toggle("text-slate-500", !active);
      item.classList.toggle("font-medium", !active);
    });
    panels.forEach((panel) => {
      panel.classList.toggle("hidden", panel.getAttribute("data-tab-panel") !== key);
    });
    if (activeTabInput) activeTabInput.value = key;
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab.getAttribute("data-tab"));
    });
  });

  const params = new URLSearchParams(window.location.search);
  activateTab(activeTabInput?.value || params.get("tab") || "pos");

  const syncProvider = () => {
    if (!provider || !warning) return;
    const isMoka = (provider.value || "Moka").toLowerCase() === "moka";
    warning.classList.toggle("hidden", isMoka);
  };

  const syncMode = () => {
    if (!liveMode || !baseUrl) return;
    const live = liveMode.checked;
    if (baseUrl.value === testUrl || baseUrl.value === liveUrl || !baseUrl.value) {
      baseUrl.value = live ? liveUrl : testUrl;
    }
    if (modeHint) {
      modeHint.textContent = live ? "Canlı ortam aktif." : "Test ortamı aktif.";
    }
  };

  const syncMediaType = () => {
    const selected = document.querySelector('input[name="CheckoutPanelMediaType"]:checked');
    const isVideo = (selected?.value || "Image") === "Video";
    if (panelFile) {
      panelFile.accept = isVideo ? "video/mp4,video/webm" : "image/png,image/jpeg,image/webp";
    }
    if (panelHint) {
      panelHint.textContent = isVideo
        ? "MP4 veya WEBM, en fazla 40 MB."
        : "PNG, JPG veya WEBP, en fazla 5 MB.";
    }
  };

  provider?.addEventListener("change", syncProvider);
  liveMode?.addEventListener("change", () => {
    if (baseUrl) {
      baseUrl.value = liveMode.checked ? liveUrl : testUrl;
    }
    syncMode();
  });

  overlayRange?.addEventListener("input", () => {
    if (overlayValue) overlayValue.textContent = `${overlayRange.value}%`;
  });

  mediaTypeRadios.forEach((radio) => radio.addEventListener("change", syncMediaType));

  syncProvider();
  syncMode();
  syncMediaType();
})();
