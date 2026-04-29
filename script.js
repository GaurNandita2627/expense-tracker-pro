let currentUser = "";
let dataStore = JSON.parse(localStorage.getItem("data")) || {};

// =====================
// LOAD
// =====================
window.onload = function () {
    currentUser = localStorage.getItem("currentUser") || "";

    if (currentUser) {
        document.getElementById("activeUser").innerText =
            "Active User: " + currentUser;
    }

    renderExpenses();
};

// =====================
// USER FUNCTION
// =====================
function setUser() {
    let name = document.getElementById("username").value.trim();

    if (!name) return alert("Enter name");

    currentUser = name;

    if (!dataStore[currentUser]) {
        dataStore[currentUser] = [];
    }

    localStorage.setItem("currentUser", currentUser);

    saveData();
    renderExpenses();
}

// =====================
// ⭐ STEP 4 HERE (GET DATA)
// =====================
function getData() {
    if (!currentUser) return [];
    return dataStore[currentUser] || [];
}

// =====================
// ADD EXPENSE
// =====================
function addExpense() {
    let desc = document.getElementById("desc").value;
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    let arr = getData();

    arr.push({
        desc,
        amount,
        category,
        date: new Date().toLocaleString()
    });

    dataStore[currentUser] = arr;

    saveData();
    renderExpenses();
}
