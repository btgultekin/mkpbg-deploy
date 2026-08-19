(() => {
  const visual = document.getElementById("card-visual");
  const numberInput = document.getElementById("card-number");
  const nameInput = document.getElementById("card-name");
  const monthInput = document.getElementById("card-month");
  const yearInput = document.getElementById("card-year");
  const cvcInput = document.getElementById("card-cvc");
  const form = document.getElementById("payment-form");

  const previewNumber = document.getElementById("preview-number");
  const previewName = document.getElementById("preview-name");
  const previewExpiry = document.getElementById("preview-expiry");
  const previewCvc = document.getElementById("preview-cvc");
  const previewBrand = document.getElementById("preview-brand");

  if (!visual || !numberInput || !form) return;

  const visaSvg =
    '<svg viewBox="0 0 48 16" class="h-4 w-10" aria-hidden="true"><text x="0" y="13" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="700" fill="#ffffff">VISA</text></svg>';
  const mastercardSvg =
    '<svg viewBox="0 0 36 22" class="h-5 w-8" aria-hidden="true"><circle cx="13" cy="11" r="8" fill="#eb001b"/><circle cx="23" cy="11" r="8" fill="#f79e1b"/><path d="M18 5.2a8 8 0 000 11.6 8 8 0 000-11.6z" fill="#ff5f00"/></svg>';
  const genericBrand = '<span class="text-[10px] font-semibold tracking-wider text-slate-300">BANKA</span>';

  const onlyDigits = (value) => (value || "").replace(/\D/g, "");

  const formatCardNumber = (value) =>
    onlyDigits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();

  const groupDisplay = (digits) => {
    const raw = (digits + "����������������").slice(0, 16);
    return `${raw.slice(0, 4)} ${raw.slice(4, 8)} ${raw.slice(8, 12)} ${raw.slice(12, 16)}`;
  };

  const detectBrand = (digits) => {
    if (/^4/.test(digits)) return "visa";
    const bin = parseInt(digits.slice(0, 4) || "0", 10);
    if (/^5[1-5]/.test(digits) || (bin >= 2221 && bin <= 2720)) return "mastercard";
    return "generic";
  };

  const updateBrand = (digits) => {
    if (!previewBrand) return;
    const brand = detectBrand(digits);
    if (brand === "visa") previewBrand.innerHTML = visaSvg;
    else if (brand === "mastercard") previewBrand.innerHTML = mastercardSvg;
    else previewBrand.innerHTML = genericBrand;
  };

  const updatePreview = () => {
    const digits = onlyDigits(numberInput.value).slice(0, 16);
    previewNumber.textContent = groupDisplay(digits);
    updateBrand(digits);

    const name = (nameInput?.value || "").trim();
    previewName.textContent = name ? name.toUpperCase() : "AD SOYAD";

    const month = monthInput?.value || "AA";
    const year = yearInput?.value || "YY";
    previewExpiry.textContent = `${month}/${year}`;

    const cvc = onlyDigits(cvcInput?.value || "").slice(0, 4);
    previewCvc.textContent = cvc || "���";
  };

  numberInput.addEventListener("input", () => {
    const start = numberInput.selectionStart;
    const before = numberInput.value;
    numberInput.value = formatCardNumber(numberInput.value);
    const diff = numberInput.value.length - before.length;
    if (start != null) {
      numberInput.setSelectionRange(start + diff, start + diff);
    }
    updatePreview();
  });

  nameInput?.addEventListener("input", updatePreview);
  monthInput?.addEventListener("change", updatePreview);
  yearInput?.addEventListener("change", updatePreview);

  cvcInput?.addEventListener("input", () => {
    cvcInput.value = onlyDigits(cvcInput.value).slice(0, 4);
    updatePreview();
  });

  const flip = (on) => visual.classList.toggle("is-flipped", on);
  cvcInput?.addEventListener("focus", () => flip(true));
  cvcInput?.addEventListener("blur", () => flip(false));

  form.addEventListener("submit", () => {
    numberInput.value = onlyDigits(numberInput.value);
    const btn = document.getElementById("pay-submit");
    if (!btn) return;
    btn.textContent = "İşleniyor...";
    // Disable after the browser queues the POST. Disabling the submit button
    // synchronously in this handler can cancel the request in some browsers.
    window.setTimeout(() => {
      btn.disabled = true;
    }, 0);
  });

  updatePreview();
})();
