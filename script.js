function addExpense() {
    let desc = document.getElementById("desc").value;
    let amount = document.getElementById("amount").value;
    let category = document.getElementById("category").value;

    if (!desc || !amount) {
        alert("Please fill all fields");
        return;
    }

    let list = document.getElementById("list");

    list.innerHTML += `
        <li>${desc} (${category}) - ₹${amount}
        <button onclick="this.parentElement.remove()">X</button>
        </li>
    `;

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}