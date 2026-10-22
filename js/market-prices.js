const MANDI_API_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

// For a quick local educational demo only.
// Replace this placeholder with your own valid API key.
// A key in frontend JavaScript is visible to website visitors.
const MANDI_API_KEY = "579b464db66ec23bdd000001b3725f1012164c9645f692fe67a21fce";


let marketChart = null;

const commoditySelect = document.getElementById("marketCommodity");
const stateSelect = document.getElementById("marketState");
const loadButton = document.getElementById("loadMarketPrices");
const statusBox = document.getElementById("marketStatus");
const tableBody = document.getElementById("marketTableBody");

function setMarketStatus(message) {
  statusBox.textContent = message;
}

function formatRupees(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return "₹" + number.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  });
}

function clearMarketSummary() {
  document.getElementById("marketMin").textContent = "—";
  document.getElementById("marketModal").textContent = "—";
  document.getElementById("marketMax").textContent = "—";
}

function clearMarketChart() {
  if (marketChart) {
    marketChart.destroy();
    marketChart = null;
  }
}

function showEmptyTable(message) {
  tableBody.replaceChildren();

  const row = document.createElement("tr");
  const cell = document.createElement("td");

  cell.colSpan = 6;
  cell.className = "empty-message";
  cell.textContent = message;

  row.appendChild(cell);
  tableBody.appendChild(row);
}

function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "—";
  row.appendChild(cell);
}

async function loadMarketPrices() {
  const commodity = commoditySelect.value;
  const state = stateSelect.value;

  if (!MANDI_API_KEY ||
      MANDI_API_KEY === "PASTE_YOUR_API_KEY_HERE") {
    setMarketStatus("Please configure your Mandi API key first.");
    return;
  }

  loadButton.disabled = true;
  loadButton.textContent = "Loading...";
  setMarketStatus("Fetching government mandi prices...");
  clearMarketSummary();
  clearMarketChart();
  showEmptyTable("Loading market records...");

  try {
    const params = new URLSearchParams({
      "api-key": MANDI_API_KEY,
      format: "json",
      limit: "100",
      "filters[state]": state,
      "filters[commodity]": commodity
    });

    const response = await fetch(`${MANDI_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Request failed (HTTP ${response.status}).`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const records = Array.isArray(data.records)
      ? data.records
      : [];

    // Keep only matching records and valid prices.
    const matchingRecords = records.filter(record => {
      const correctState =
        String(record.state || "").toLowerCase() === state.toLowerCase();

      const correctCommodity =
        String(record.commodity || "").toLowerCase() === commodity.toLowerCase();

      return correctState &&
        correctCommodity &&
        Number.isFinite(Number(record.min_price)) &&
        Number.isFinite(Number(record.max_price)) &&
        Number.isFinite(Number(record.modal_price));
    });

    if (matchingRecords.length === 0) {
      setMarketStatus(
        `No matching ${commodity} records were returned for ${state}. ` +
        "Try another vegetable or state."
      );
      showEmptyTable("No matching mandi records found.");
      return;
    }

    // Summarize the available records.
    const minPrice = Math.min(
      ...matchingRecords.map(record => Number(record.min_price))
    );

    const maxPrice = Math.max(
      ...matchingRecords.map(record => Number(record.max_price))
    );

    const modalPrice = matchingRecords.reduce(
      (sum, record) => sum + Number(record.modal_price), 0
    ) / matchingRecords.length;

    document.getElementById("marketMin").textContent =
      formatRupees(minPrice);

    document.getElementById("marketModal").textContent =
      formatRupees(modalPrice);

    document.getElementById("marketMax").textContent =
      formatRupees(maxPrice);

    // Draw the graph using actual returned market data.
    const chartLabels = matchingRecords.map(record =>
      `${record.market || "Market"} (${record.district || "District"})`
    );

    marketChart = new Chart(
      document.getElementById("marketPriceChart"),
      {
        type: "bar",
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: "Minimum Price",
              data: matchingRecords.map(r => Number(r.min_price)),
              backgroundColor: "#81c784"
            },
            {
              label: "Modal Price",
              data: matchingRecords.map(r => Number(r.modal_price)),
              backgroundColor: "#2e7d32"
            },
            {
              label: "Maximum Price",
              data: matchingRecords.map(r => Number(r.max_price)),
              backgroundColor: "#ffb74d"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false
          },
          plugins: {
            legend: {
              position: "bottom"
            },
            tooltip: {
              callbacks: {
                label: context =>
                  `${context.dataset.label}: ₹${Number(context.raw).toLocaleString("en-IN")}/quintal`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Price (₹ per quintal)"
              }
            },
            x: {
              ticks: {
                autoSkip: true,
                maxRotation: 45,
                minRotation: 0
              }
            }
          }
        }
      }
    );

    // Populate the market table.
    tableBody.replaceChildren();

    matchingRecords.forEach(record => {
      const row = document.createElement("tr");

      addCell(row, record.market);
      addCell(row, record.district);
      addCell(row, formatRupees(record.min_price));
      addCell(row, formatRupees(record.modal_price));
      addCell(row, formatRupees(record.max_price));
      addCell(row, record.arrival_date);

      tableBody.appendChild(row);
    });

    setMarketStatus(
      `Showing ${matchingRecords.length} returned record(s) for ` +
      `${commodity} in ${state}.`
    );
  } catch (error) {
    console.error("Mandi API error:", error);

    setMarketStatus(
      "Could not load mandi prices. Check your API key, internet " +
      "connection, API access and browser console."
    );

    showEmptyTable("Unable to load market records.");
  } finally {
    loadButton.disabled = false;
    loadButton.textContent = "Show Prices";
  }
}

loadButton.addEventListener("click", loadMarketPrices);

// Load prices when the farmer changes a selection.
commoditySelect.addEventListener("change", loadMarketPrices);
stateSelect.addEventListener("change", loadMarketPrices);

// Load the default selection when the page opens.
loadMarketPrices();