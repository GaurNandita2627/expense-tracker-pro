let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Load data on start
window.onload = function () {
    renderExpenses();
};

// ADD EXPENSE
function addExpense() {
    let desc = document.getElementById("desc").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    if (!desc || !amount) {
        alert("Please fill all fields");
        return;
    }

    let expense = {
        id: Date.now(),
        desc: desc,
        amount: amount,
        category: category,
        date: new Date().toLocaleString()
    };

    expenses.push(expense);

    saveData();
    renderExpenses();

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
}

// DELETE EXPENSE
function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    saveData();
    renderExpenses();
}

// SAVE TO LOCALSTORAGE
function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// RENDER UI (HISTORY + TOTAL)
function renderExpenses() {
    const list = document.getElementById("list");
    const totalEl = document.getElementById("total");

    list.innerHTML = "";

    let total = 0;

    expenses.forEach(exp => {
        total += exp.amount;

        list.innerHTML += `
            <li>
                <strong>${exp.desc}</strong> (${exp.category}) - ₹${exp.amount}
                <br><small>${exp.date}</small>
                <button onclick="deleteExpense(${exp.id})">Delete</button>
            </li>
        `;
    });

    totalEl.innerText = total;
}

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
