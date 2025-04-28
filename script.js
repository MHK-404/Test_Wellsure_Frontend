document.getElementById('healthForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const response = await fetch('https://test-wellsure-back-ancbame0gwg5ccfu.uaenorth-01.azurewebsites.net/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    displayResults(result);
});

function displayResults(result) {
    document.getElementById('score').innerText = `Your health risk score is: ${result.score}`;
    const recommendationsList = document.getElementById('recommendations');
    recommendationsList.innerHTML = '';
    for (let rec in result.recommendations) {
        const li = document.createElement('li');
        li.innerText = result.recommendations[rec];
        recommendationsList.appendChild(li);
    }
    document.getElementById('results').style.display = 'block';
}

function calculateInsurance() {
    const income = document.getElementById('income').value;
    const riskScore = document.getElementById('score').innerText.split(': ')[1];
    const insuranceCost = (income * (parseInt(riskScore) / 1000));
    document.getElementById('insurance').innerText = `Your estimated annual insurance cost is: ${insuranceCost} AED`;
}
