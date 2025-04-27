document.getElementById("healthForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);

    // Create an object with the form data
    const data = {
        weight: formData.get("weight"),
        height: formData.get("height"),
        exercise: formData.get("exercise"),
        diet: formData.get("diet"),
        hydration: formData.get("hydration"),
        smoking: formData.get("smoking"),
        sleep: formData.get("sleep"),
        stress: formData.get("stress"),
        mood: formData.get("mood"),
        anxiety: formData.get("anxiety"),
        anger: formData.get("anger"),
        social: formData.get("social"),
        workload: formData.get("workload"),
        sleepMental: formData.get("sleepMental"),
        support: formData.get("support"),
        feelings: formData.get("feelings"),
        environment: formData.get("environment")
    };

    // Send form data to the backend (Azure API)
    fetch('https://test-wellsure-back-ancbame0gwg5ccfu.uaenorth-01.azurewebsites.net/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Update the results with data received from backend
        document.getElementById("riskScore").textContent = `Risk Score: ${data.riskScore}/1000`;
        document.getElementById("physicalScore").textContent = `Physical Health Score: ${data.physicalScore}`;
        document.getElementById("mentalScore").textContent = `Mental Health Score: ${data.mentalScore}`;
        document.getElementById("textFeedback").textContent = `Feedback: ${data.textFeedback}`;

        // Display recommendations dynamically
        const recommendationsDiv = document.getElementById("recommendations");
        recommendationsDiv.innerHTML = ""; // Clear previous recommendations
        data.recommendations.forEach((rec, index) => {
            const recommendationDiv = document.createElement("div");
            recommendationDiv.classList.add("recommendation");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("recommendation-checkbox");
            checkbox.id = `recommendation${index+1}`;

            const label = document.createElement("label");
            label.setAttribute("for", `recommendation${index+1}`);
            label.textContent = rec;

            recommendationDiv.appendChild(checkbox);
            recommendationDiv.appendChild(label);

            recommendationsDiv.appendChild(recommendationDiv);
        });

        // Make the results section visible
        document.getElementById("results").style.display = 'block';
    })
    .catch(error => console.error("Error:", error));
});
