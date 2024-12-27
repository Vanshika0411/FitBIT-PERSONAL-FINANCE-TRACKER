let transactions = [];
let balance = 0;

// Chart Instance
let chart;
function initializeChart() {
  const ctx = document.getElementById("incomeExpenseChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Amount",
          data: [0, 0],
          backgroundColor: ["#4caf50", "#f44336"],
          borderColor: ["#388e3c", "#d32f2f"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
}

// Update Chart
function updateChart() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  chart.data.datasets[0].data = [income, expense];
  chart.update();
}

// Add Transaction
function addTransaction() {
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!date || !description || isNaN(amount)) {
    alert("Please fill out all fields!");
    return;
  }

  const transaction = { date, description, amount, type };
  transactions.push(transaction);
  updateTable();
  updateBalance();
  updateChart();
}

// Update Table
function updateTable() {
  const table = document.getElementById("transaction-table");
  const rows = table.querySelectorAll("tr:not(:first-child)");
  rows.forEach((row) => row.remove());

  transactions.forEach((t, index) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.description}</td>
      <td>${t.amount}</td>
      <td>${t.type}</td>
      <td><button onclick="deleteTransaction(${index})">Delete</button></td>
    `;
  });
}

// Delete Transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateTable();
  updateBalance();
  updateChart();
}

// Update Balance
function updateBalance() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  balance = income - expense;

  document.getElementById("balance").textContent = balance.toFixed(2);
}

// Handle Export
function handleDownload() {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    ["Date,Description,Amount,Type"]
      .concat(
        transactions.map((t) => `${t.date},${t.description},${t.amount},${t.type}`)
      )
      .join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "transactions.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
  initializeChart();
});
