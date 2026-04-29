let currentUser = "";
let dataStore = JSON.parse(localStorage.getItem("data")) || {};

// SET USER
function setUser() {
    let name = document.getElementById("username").value.trim();

    if (!name) {
        alert("Enter user name");
        return;
    }

    currentUser = name;

    document.getElementById("activeUser").innerText =
        "Active User: " + currentUser;

    if (!dataStore[currentUser]) {
        dataStore[currentUser] = [];
    }

    renderExpenses();
}

// GET DATA
function getData() {
    return dataStore[currentUser] || [];
}

// SAVE
function saveData() {
    localStorage.setItem("data", JSON.stringify(dataStore));
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

// RENDER + SEARCH + TOTAL
function renderExpenses() {

    let list = document.getElementById("list");
    let totalEl = document.getElementById("total");
    let search = document.getElementById("search").value.toLowerCase();

    let arr = getData();

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

// CHART
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

// ======================
// OCR FUNCTION
// ======================

function scanImage() {

    if (!currentUser) {
        alert("Set user first");
        return;
    }

    let file = document.getElementById("imageInput").files[0];

    if (!file) {
        alert("Select image");
        return;
    }

    Tesseract.recognize(file, 'eng')
    .then(({ data: { text } }) => {

        processOCR(text);
    });
}

// PROCESS OCR TEXT
function processOCR(text) {

    let lines = text.split("\n");
    let arr = getData();

    lines.forEach(line => {

        let nums = line.match(/\d+/g);
        if (!nums) return;

        let amount = Number(nums[nums.length - 1]);
        let name = line.replace(/\d+/g, "").trim();

        if (!name) name = "Unknown";

        arr.push({
            desc: name,
            amount,
            category: "OCR",
            date: new Date().toLocaleString()
        });
    });

    dataStore[currentUser] = arr;

    saveData();
    renderExpenses();

    alert("OCR Done ✅");
}
