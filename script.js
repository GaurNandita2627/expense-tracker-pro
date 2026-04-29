let currentUser = localStorage.getItem("currentUser") || "";
let allData = JSON.parse(localStorage.getItem("allExpenses")) || {};

window.onload = function () {
    renderExpenses();
};

// USER SET
function setUser() {
    let name = document.getElementById("username").value.trim();
    if (!name) return alert("Enter name");

    currentUser = name;
    localStorage.setItem("currentUser", name);

    if (!allData[currentUser]) {
        allData[currentUser] = [];
    }

    renderExpenses();
}

// GET DATA
function getExpenses() {
    return allData[currentUser] || [];
}

// SAVE
function saveAll() {
    localStorage.setItem("allExpenses", JSON.stringify(allData));
}

// ADD
function addExpense() {
    if (!currentUser) return alert("Set user first");

    let desc = document.getElementById("desc").value;
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    let data = getExpenses();

    data.push({
        id: Date.now(),
        desc,
        amount,
        category,
        date: new Date().toLocaleString()
    });

    allData[currentUser] = data;

    saveAll();
    renderExpenses();
}

// DELETE
function deleteExpense(id) {
    let data = getExpenses().filter(e => e.id !== id);
    allData[currentUser] = data;

    saveAll();
    renderExpenses();
}

// NAME EXTRACT
function getPersonName(desc) {
    return desc.split(" ")[0];
}

// RENDER
function renderExpenses() {
    let list = document.getElementById("list");
    let totalEl = document.getElementById("total");
    let dropdown = document.getElementById("personFilter");

    let expenses = getExpenses();

    list.innerHTML = "";

    let total = 0;
    let categoryData = {};
    let persons = new Set();

    let selected = dropdown.value;

    expenses.forEach(exp => {

        let person = getPersonName(exp.desc);
        persons.add(person);

        if (selected && person !== selected) return;

        total += exp.amount;

        categoryData[exp.category] =
            (categoryData[exp.category] || 0) + exp.amount;

        list.innerHTML += `
            <li>
                ${exp.desc} - ₹${exp.amount}
                <br><small>${exp.date}</small>
                <button onclick="deleteExpense(${exp.id})">Delete</button>
            </li>
        `;
    });

    totalEl.innerText = total;

    dropdown.innerHTML = `<option value="">All</option>`;
    persons.forEach(p => {
        dropdown.innerHTML += `<option value="${p}">${p}</option>`;
    });

    updateChart(categoryData);
}

// CHART
function updateChart(data) {
    let ctx = document.getElementById("expenseChart").getContext("2d");

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

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// OCR
function scanImage() {
    let file = document.getElementById("imageInput").files[0];

    Tesseract.recognize(file, 'eng')
    .then(({ data: { text } }) => {

        let lines = text.split("\n");
        let data = getExpenses();

        lines.forEach(line => {
            let nums = line.match(/\d+/g);
            if (!nums) return;

            let amount = Number(nums[nums.length - 1]);
            let name = line.replace(/\d+/g, "").trim();

            data.push({
                id: Date.now() + Math.random(),
                desc: name,
                amount,
                category: "OCR",
                date: new Date().toLocaleString()
            });
        });

        allData[currentUser] = data;

        saveAll();
        renderExpenses();
    });
}
