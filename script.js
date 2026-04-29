let currentUser = "";
let data = JSON.parse(localStorage.getItem("data")) || {};

// SET USER (FIXED)
function setUser() {
    let name = document.getElementById("username").value.trim();

    if (!name) {
        alert("Please enter name");
        return;
    }

    currentUser = name;

    document.getElementById("activeUser").innerText =
        "Active User: " + currentUser;

    if (!data[currentUser]) {
        data[currentUser] = [];
    }

    renderExpenses();
}

// GET USER DATA
function getExpenses() {
    return data[currentUser] || [];
}

// SAVE
function saveData() {
    localStorage.setItem("data", JSON.stringify(data));
}

// ADD EXPENSE
function addExpense() {
    if (!currentUser) {
        alert("Set user first");
        return;
    }

    let desc = document.getElementById("desc").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    if (!desc || !amount) {
        alert("Fill all fields");
        return;
    }

    let arr = getExpenses();

    arr.push({
        desc,
        amount,
        category,
        date: new Date().toLocaleString()
    });

    data[currentUser] = arr;

    saveData();
    renderExpenses();
}

// RENDER + SEARCH + TOTAL FIXED
function renderExpenses() {
    let list = document.getElementById("list");
    let totalEl = document.getElementById("total");
    let search = document.getElementById("search").value.toLowerCase();

    let arr = getExpenses();

    list.innerHTML = "";

    let total = 0;
    let chartData = {};

    arr.forEach(exp => {

        if (search && !exp.desc.toLowerCase().includes(search)) return;

        total += exp.amount;

        chartData[exp.category] =
            (chartData[exp.category] || 0) + exp.amount;

        list.innerHTML += `
            <li>
                ${exp.desc} - ₹${exp.amount}
                <br><small>${exp.date}</small>
            </li>
        `;
    });

    totalEl.innerText = total;

    drawChart(chartData);
}

// CHART FIXED
function drawChart(dataObj) {
    let ctx = document.getElementById("chart").getContext("2d");

    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(dataObj),
            datasets: [{
                data: Object.values(dataObj)
            }]
        }
    });
}
