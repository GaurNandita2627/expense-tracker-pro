let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function addExpense() {
    let desc = document.getElementById("desc").value;
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    let expense = {
        id: Date.now(),
        desc,
        amount,
        category,
        date: new Date().toLocaleString()
    };

    expenses.push(expense);
    save();
    render();
}

function save() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function render() {
    let list = document.getElementById("list");
    let total = 0;

    list.innerHTML = "";

    expenses.forEach(e => {
        total += e.amount;

        list.innerHTML += `
            <li>
                <b>${e.desc}</b> (${e.category}) - ₹${e.amount}
                <br><small>${e.date}</small>
            </li>
        `;
    });

    document.getElementById("total").innerText = total;
}

window.onload = render;
