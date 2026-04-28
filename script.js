let expenses = [];

function addExpense() {
    let desc = document.getElementById("desc").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    if (!desc || !amount) {
        alert("Please fill all fields");
        return;
    }

    expenses.push({
        desc,
        amount,
        category
    });

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";

    render();
}

function render() {
    let list = document.getElementById("list");
    let totalEl = document.getElementById("total");

    list.innerHTML = "";

    let total = 0;

    expenses.forEach((exp, index) => {
        total += exp.amount;

        list.innerHTML += `
            <li>
                ${exp.desc} (${exp.category}) - ₹${exp.amount}
                <button onclick="deleteExpense(${index})">X</button>
            </li>
        `;
    });

    totalEl.innerText = total;
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    render();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
