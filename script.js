let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

window.onload = function () {
    renderExpenses();
};

// ➕ ADD EXPENSE
function addExpense() {
    let desc = document.getElementById("desc").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    if (!desc || !amount) {
        alert("Please fill all fields");
        return;
    }

    expenses.push({
        id: Date.now(),
        desc,
        amount,
        category,
        date: new Date().toLocaleString()
    });

    saveData();
    renderExpenses();

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
}

// ❌ DELETE
function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveData();
    renderExpenses();
}

// 💾 SAVE
function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// 📊 RENDER
function renderExpenses() {
    let list = document.getElementById("list");
    let totalEl = document.getElementById("total");

    list.innerHTML = "";

    let total = 0;
    let categoryData = {};

    expenses.forEach(exp => {
        total += exp.amount;

        categoryData[exp.category] =
            (categoryData[exp.category] || 0) + exp.amount;

        list.innerHTML += `
            <li>
                <b>${exp.desc}</b> (${exp.category}) - ₹${exp.amount}
                <br><small>${exp.date}</small>
                <button onclick="deleteExpense(${exp.id})">Delete</button>
            </li>
        `;
    });

    totalEl.innerText = total;

    updateChart(categoryData);
}

// 📊 CHART
function updateChart(data) {
    const ctx = document.getElementById("expenseChart").getContext("2d");

    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data)
            }]
        }
    });
}

// 🌙 DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// 📸 OCR SCANNER
function scanImage() {
    let file = document.getElementById("imageInput").files[0];

    if (!file) {
        alert("Select image first");
        return;
    }

    Tesseract.recognize(file, 'eng')
    .then(({ data: { text } }) => {

        alert("Detected Text:\n" + text);

        let numbers = text.match(/\d+/g);

        if (numbers) {
            let amount = Number(numbers[numbers.length - 1]);

            document.getElementById("amount").value = amount;
            document.getElementById("desc").value = "Scanned Expense";
        }
    });
}
