const SHEET1_ID = "1HThstl4ESUMHIuP2DL00Sx4HIJj9ilweKs7D--enXO8";
const EXPENSES_ID = "1PXfkSO8c9jLfz4DJlDkvh3tD-Z5b-mmg5-HSrJqZlJA";
const API_KEY = "AIzaSyDOn6t5nNrfKB_9MLCTVnJV4DVF_ip0IPg";

// Fetch Sheet1
async function fetchSheet1() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET1_ID}/values/Sheet1?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const rows = data.values;

    let totalSum = 0;
    let totalFinalSum = 0;

    for (let i = 1; i < rows.length; i++) {
        totalSum += Number(rows[i][5] || 0);        // Column F = Total
        totalFinalSum += Number(rows[i][9] || 0);   // Column J = TotalFinal
    }

    return { totalSum, totalFinalSum };
}

// Fetch Expenses
async function fetchExpenses() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${EXPENSES_ID}/values/Expenses?key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
        console.error("Expenses sheet not accessible", data);
        return 0;
    }

    const rows = data.values;
    let expenseSum = 0;

    for (let i = 1; i < rows.length; i++) {
        expenseSum += Number(rows[i][2] || 0); // Column C = Amount
    }

    return expenseSum;
}

async function loadData() {
    try {
        const sheet1 = await fetchSheet1();
        const expenses = await fetchExpenses();

        const profit = sheet1.totalFinalSum - expenses;

        document.getElementById("kuttipiriv").innerText = "₹ " + sheet1.totalSum;
        document.getElementById("expenses").innerText = "₹ " + expenses;
        document.getElementById("profit").innerText = "₹ " + profit;

    } catch (error) {
        console.error("Error:", error);
    }
}

loadData();