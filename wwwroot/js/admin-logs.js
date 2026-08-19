(() => {
  const modal = document.getElementById("log-modal");
  if (!modal) return;

  const titleEl = document.getElementById("log-modal-title-text");
  const metaEl = document.getElementById("log-modal-meta");
  const companyEl = document.getElementById("log-modal-company");
  const taxEl = document.getElementById("log-modal-tax");
  const amountEl = document.getElementById("log-modal-amount");
  const trxEl = document.getElementById("log-modal-trx");
  const codeEl = document.getElementById("log-modal-code");
  const codeDescEl = document.getElementById("log-modal-code-desc");
  const detailEl = document.getElementById("log-modal-detail");

  const catalog = {
    "000": "Genel Hata",
    "001": "Kart Sahibi Onayı Alınamadı",
    "002": "Limit Yetersiz",
    "003": "Kredi Kartı Numarası Geçerli Formatta Değil",
    "004": "Genel Red",
    "005": "Kart Sahibine Açık Olmayan İşlem",
    "006": "Kartın Son Kullanma Tarihi Hatali",
    "007": "Geçersiz İşlem",
    "008": "Bankaya Bağlanılamadı",
    "009": "Tanımsız Hata Kodu",
    "010": "Banka SSL Hatası",
    "011": "Manual Onay İçin Bankayı Arayınız",
    "012": "Kart Bilgileri Hatalı - Kart No veya CVV2",
    "013": "Visa MC Dışındaki Kartlar 3D Secure Desteklemiyor",
    "014": "Geçersiz Hesap Numarası",
    "015": "Geçersiz CVV",
    "016": "Onay Mekanizması Mevcut Değil",
    "017": "Sistem Hatası",
    "018": "Çalıntı Kart",
    "019": "Kayıp Kart",
    "020": "Kısıtlı Kart",
    "021": "Zaman Aşımı",
    "022": "Geçersiz İşyeri",
    "023": "Sahte Onay",
    "024": "3D Onayı Alındı Ancak Para Karttan Çekilemedi",
    "025": "3D Onay Alma Hatası",
    "026": "Kart Sahibi Banka veya Kart 3D-Secure Üyesi Değil",
    "027": "Kullanıcı Bu İşlemi Yapmaya Yetkili Değil",
    "028": "Fraud Olasılığı",
    "029": "Kartınız e-ticaret İşlemlerine Kapalıdır"
  };

  const resolveCode = (raw) => {
    if (!raw) return null;
    const text = String(raw).trim();
    if (catalog[text]) return text;
    if (/^\d{1,3}$/.test(text)) {
      const n = Number(text);
      if (n >= 0 && n <= 29) return String(n).padStart(3, "0");
    }
    const m = text.match(/(?:^|[^0-9])(\d{3})(?:[^0-9]|$)/);
    if (m && catalog[m[1]]) return m[1];
    return null;
  };

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

  const setText = (el, value) => {
    if (!el) return;
    el.textContent = value && String(value).trim() ? String(value) : "—";
  };

  document.querySelectorAll("[data-log-detail]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-log-id");
      if (!id) return;

      btn.disabled = true;
      try {
        const res = await fetch(`${window.__adminBase || "/admin"}/logs/${id}`, {
          headers: { Accept: "application/json" }
        });
        if (!res.ok) throw new Error("Log okunamadı");
        const data = await res.json();

        setText(titleEl, data.title || "Log detayı");
        setText(metaEl, [data.createdAt, data.level, data.category].filter(Boolean).join(" · "));
        setText(companyEl, data.companyTitle);
        setText(taxEl, data.taxNumber);
        setText(
          amountEl,
          data.amount != null
            ? `${Number(data.amount).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${data.currency || ""}`.trim()
            : null
        );
        setText(trxEl, data.otherTrxCode);
        setText(codeEl, data.resultCode);
        const normalized = resolveCode(data.resultCode);
        if (codeDescEl) {
          codeDescEl.textContent = normalized && catalog[normalized]
            ? `Moka açıklaması: ${catalog[normalized]} (Hata Kodu: ${normalized})`
            : "";
        }
        setText(detailEl, data.detail);
        open();
      } catch {
        alert("Log detayı yüklenemedi.");
      } finally {
        btn.disabled = false;
      }
    });
  });

  modal.querySelectorAll("[data-log-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close(e);
  });
})();
