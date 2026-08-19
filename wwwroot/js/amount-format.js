(() => {
  const display = document.getElementById("amount-display");
  const hidden = document.getElementById("Amount");
  if (!display || !hidden) return;

  const format = (raw) => {
    let value = (raw || "").replace(/[^\d,]/g, "");
    const comma = value.indexOf(",");
    let integer = comma === -1 ? value : value.slice(0, comma);
    let fraction = comma === -1 ? null : value.slice(comma + 1).replace(/,/g, "").slice(0, 2);
    integer = integer.replace(/^0+(?=\d)/, "");
    const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (fraction === null && comma === -1)
      return grouped;
    return `${grouped},${fraction ?? ""}`;
  };

  const toHidden = (formatted) => {
    if (!formatted)
      return "";
    let text = formatted.replace(/\./g, "");
    text = text.replace(",", ".");
    if (text.endsWith("."))
      text = text.slice(0, -1);
    return text;
  };

  const apply = () => {
    display.value = format(display.value);
    hidden.value = toHidden(display.value);
  };

  display.addEventListener("input", apply);
  display.addEventListener("blur", () => {
    apply();
    if (display.value.endsWith(",")) {
      display.value = display.value.slice(0, -1);
      hidden.value = toHidden(display.value);
    }
  });

  if (display.value)
    apply();
  else if (hidden.value)
    display.value = format(hidden.value.replace(".", ","));
})();
