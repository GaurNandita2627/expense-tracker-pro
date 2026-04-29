let currentUser = "";
let dataStore = JSON.parse(localStorage.getItem("data")) || {};

function setUser() {
    let name = document.getElementById("username").value.trim();
    if (!name) return alert("Enter name");

    currentUser = name;

    if (!dataStore[currentUser]) {
        dataStore[currentUser] = [];
    }

    renderExpenses();
}

function getData() {
    return dataStore[currentUser] || [];
}

function save() {
    localStorage.setItem("data", JSON.stringify(dataStore));
}

function addExpense() {
    if (!currentUser) return alert("Set user first");

    let desc = document.getElementById("desc").value;
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    let arr = getData();

    arr.push({
        id: Date.now(),
        desc,
        amount,
        category,
        date: new Date().toLocaleString()
    });

    dataStore[currentUser] = arr;

    save();
    renderExpenses();
}

// 🔍 SEARCH LOGIC (MAIN FEATURE)
function renderExpenses() {
    let list = document.getElementById("list");
    let totalEl = document.getElementById("total");
    let search = document.getElementById("search").value.toLowerCase();

    let arr = getData();

    list.innerHTML = "";

    let total = 0;
    let chartData = {};

    arr.forEach(exp => {

        // FILTER BY NAME
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

// 📊 CHART
function drawChart(data) {
    let ctx = document.getElementById("chart").getContext("2d");

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
