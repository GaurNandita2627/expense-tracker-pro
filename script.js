let expenses = [];

function addExpense() {
    let desc = document.getElementById("desc").value;
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    expenses.push({ desc, amount, category });

    render();
}

function render() {
    let list = document.getElementById("list");
    let total = 0;

    list.innerHTML = "";

    let categoryData = {};

    expenses.forEach((e, i) => {
        total += e.amount;

        categoryData[e.category] = (categoryData[e.category] || 0) + e.amount;

        list.innerHTML += `
            <li>${e.desc} - ₹${e.amount}</li>
        `;
    });

    document.getElementById("total").innerText = total;

    drawChart(categoryData);
}

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
