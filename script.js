let currentUser = localStorage.getItem("currentUser") || "";
let allData = JSON.parse(localStorage.getItem("allExpenses")) || {};

function setUser() {
    let name = document.getElementById("username").value.trim();

    if (!name) {
        alert("Enter username");
        return;
    }

    currentUser = name;
    localStorage.setItem("currentUser", name);

    if (!allData[currentUser]) {
        allData[currentUser] = [];
    }

    renderExpenses();
}

// GET USER EXPENSES
function getExpenses() {
    return allData[currentUser] || [];
}

// SAVE
function saveAll() {
    localStorage.setItem("allExpenses", JSON.stringify(allData));
}

// MODIFY ADD FUNCTION
function addExpense() {
    if (!currentUser) {
        alert("Select user first");
        return;
    }

    let desc = document.getElementById("desc").value;
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    let expenses = getExpenses();

    expenses.push({
        id: Date.now(),
        desc,
        amount,
        category,
        date: new Date().toLocaleString()
    });

    allData[currentUser] = expenses;

    saveAll();
    renderExpenses();
}

// DELETE
function deleteExpense(id) {
    let expenses = getExpenses().filter(e => e.id !== id);

    allData[currentUser] = expenses;
    saveAll();

    renderExpenses();
}

// RENDER
function renderExpenses() {
    let list = document.getElementById("list");
    let totalEl = document.getElementById("total");

    let expenses = getExpenses();

    list.innerHTML = "";

    let total = 0;

    expenses.forEach(exp => {
        total += exp.amount;

        list.innerHTML += `
            <li>
                ${exp.desc} - ₹${exp.amount}
                <button onclick="deleteExpense(${exp.id})">Delete</button>
            </li>
        `;
    });

    totalEl.innerText = total;
}
