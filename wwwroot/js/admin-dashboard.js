(() => {
  const source = document.getElementById("dashboard-chart-data");
  if (!source || typeof Chart === "undefined") return;

  const data = JSON.parse(source.textContent || "{}");
  const slate = "#0f172a";
  const grid = "#e2e8f0";
  const muted = "#64748b";
  const emerald = "#059669";
  const rose = "#e11d48";

  const trendCanvas = document.getElementById("trend-chart");
  const successCanvas = document.getElementById("success-chart");
  if (!trendCanvas || !successCanvas) return;

  const emptyWeekly = !data.weekly?.values?.some((v) => v > 0);
  const emptyMonthly = !data.monthly?.values?.some((v) => v > 0);

  const trendChart = new Chart(trendCanvas, {
    type: "line",
    data: {
      labels: data.weekly?.labels || [],
      datasets: [{
        label: "Tahsilat (TL)",
        data: data.weekly?.values || [],
        borderColor: slate,
        backgroundColor: "rgba(15, 23, 42, 0.08)",
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: slate,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: muted } },
        y: { grid: { color: grid }, ticks: { color: muted }, beginAtZero: true }
      }
    }
  });

  const applyRange = (range) => {
    const pack = range === "monthly" ? data.monthly : data.weekly;
    trendChart.data.labels = pack?.labels || [];
    trendChart.data.datasets[0].data = pack?.values || [];
    trendChart.update();
  };

  document.querySelectorAll(".trend-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".trend-toggle").forEach((item) => {
        item.classList.remove("bg-slate-900", "text-white");
        item.classList.add("text-slate-600");
      });
      button.classList.add("bg-slate-900", "text-white");
      button.classList.remove("text-slate-600");
      applyRange(button.getAttribute("data-range"));
    });
  });

  const success = data.daily?.success || 0;
  const failed = data.daily?.failed || 0;
  const hasDaily = success + failed > 0;

  new Chart(successCanvas, {
    type: "doughnut",
    data: {
      labels: hasDaily ? ["Başarılı", "Başarısız / iptal"] : ["Veri yok"],
      datasets: [{
        data: hasDaily ? [success, failed] : [1],
        backgroundColor: hasDaily ? [emerald, rose] : ["#e2e8f0"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: muted, boxWidth: 10, font: { size: 12 } }
        }
      }
    }
  });

  if (emptyWeekly && emptyMonthly) {
    trendCanvas.insertAdjacentHTML("afterend", "");
  }
})();
