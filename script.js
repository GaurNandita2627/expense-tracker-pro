// ===============================
// MULTI USER STORAGE
// ===============================
let currentUser = localStorage.getItem("currentUser") || "";
let allData = JSON.parse(localStorage.getItem("allExpenses")) || {};

// LOAD
window.onload = function () {
    if (currentUser && !allData[currentUser]) {
        allData[currentUser] = [];
    }
    renderExpenses();
};

// ===============================
// USER SELECT
// ===============================
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

// GET USER DATA
function getExpenses() {
    return allData[currentUser] || [];
}

// SAVE
function saveAll() {
    localStorage.setItem("allExpenses", JSON.stringify(allData));
}

// ===============================
// ADD EXPENSE
// ===============================
function addExpense() {
    if (!currentUser) {
        alert("Select user first");
        return;
    }

    let desc = document.getElementById("desc").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    if (!desc || !amount) {
        alert("Fill all fields");
        return;
    }

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

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
}

// ===============================
// DELETE
// ===============================
function deleteExpense(id) {
    let updated = getExpenses().filter(e => e.id !== id);
    allData[currentUser] = updated;

    saveAll();
    renderExpenses();
}

// ===============================
// HELPER: PERSON NAME EXTRACT
// ===============================
function getPersonName(desc) {
    return desc.replace("(OCR)", "").trim().split(" ")[0];
}

// ===============================
// RENDER (PERSON FILTER)
// ===============================
function renderExpenses() {
    let list = document.getElementById("list");
    let totalEl = document.getElementById("total");
    let dropdown = document.getElementById("personFilter");

    if (!list || !totalEl || !dropdown) return;

    let expenses = getExpenses();

    list.innerHTML = "";

    let total = 0;
    let categoryData = {};
    let persons = new Set();

    let selectedPerson = dropdown.value;

    expenses.forEach(exp => {

        let person = getPersonName(exp.desc);
        persons.add(person);

        // FILTER BY PERSON
        if (selectedPerson && person !== selectedPerson) return;

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

    // UPDATE DROPDOWN
    dropdown.innerHTML = `<option value="">All</option>`;
    persons.forEach(p => {
        dropdown.innerHTML += `<option value="${p}">${p}</option>`;
    });

    updateChart(categoryData);
}

// ===============================
// CHART
// ===============================
function updateChart(data) {
    let canvas = document.getElementById("expenseChart");
    if (!canvas) return;

    let ctx = canvas.getContext("2d");

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

// ===============================
// DARK MODE
// ===============================
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// ===============================
// OCR SCAN
// ===============================
function scanImage() {
    if (!currentUser) {
        alert("Select user first");
        return;
    }

    let file = document.getElementById("imageInput").files[0];

    if (!file) {
        alert("Select image");
        return;
    }

    Tesseract.recognize(file, 'eng')
    .then(({ data: { text } }) => {
        processOCRText(text);
    });
}

// OCR PROCESS
function processOCRText(text) {
    let lines = text.split("\n");

    let grouped = {};
    let grandTotal = 0;

    let expenses = getExpenses();

    lines.forEach(line => {
        let numbers = line.match(/\d+/g);
        if (!numbers) return;

        let amount = Number(numbers[numbers.length - 1]);

        let name = line.replace(/\d+/g, "").trim();
        if (!name) name = "Unknown";

        grouped[name] = (grouped[name] || 0) + amount;
        grandTotal += amount;

        expenses.push({
            id: Date.now() + Math.random(),
            desc: name + " (OCR)",
            amount,
            category: "OCR",
            date: new Date().toLocaleString()
        });
    });

    allData[currentUser] = expenses;

    saveAll();
    renderExpenses();

    showSummary(grouped, grandTotal);
}

// SUMMARY
function showSummary(grouped, total) {
    let msg = "📊 OCR Summary\n\n";

    for (let key in grouped) {
        msg += `${key} = ₹${grouped[key]}\n`;
    }

    msg += `\nTOTAL = ₹${total}`;

    alert(msg);
}
