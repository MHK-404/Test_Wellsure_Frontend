document.addEventListener('DOMContentLoaded', function() {
    const data = getAssessmentData();
    const currentScoreElement = document.getElementById('current-score');
    const simulatedScoreElement = document.getElementById('simulated-score');
    const riskChangeElement = document.getElementById('risk-change');
    
    // Display current score
    currentScoreElement.textContent = data.totalScore;
    simulatedScoreElement.textContent = data.totalScore;
    
    // Get all simulation options
    const options = document.querySelectorAll('.simulation-option input');
    
    // Update simulation when options change
    options.forEach(option => {
        option.addEventListener('change', updateSimulation);
    });
    
    function updateSimulation() {
        let simulatedScore = data.totalScore;
        
        // Apply each selected option
        if (document.getElementById('more-exercise').checked) {
            simulatedScore += 50;
        }
        if (document.getElementById('better-sleep').checked) {
            simulatedScore += 75;
        }
        // Add more options as needed
        
        // Ensure score stays within bounds
        simulatedScore = Math.max(0, Math.min(1000, simulatedScore));
        
        // Update display
        simulatedScoreElement.textContent = simulatedScore;
        
        // Calculate risk change
        const currentRisk = getRiskCategory(data.totalScore);
        const newRisk = getRiskCategory(simulatedScore);
        
        if (currentRisk.name !== newRisk.name) {
            riskChangeElement.textContent = 
                `Risk improved from ${currentRisk.name} to ${newRisk.name}`;
            riskChangeElement.style.color = `var(--${newRisk.color})`;
        } else {
            riskChangeElement.textContent = 'No risk category change';
            riskChangeElement.style.color = '#666';
        }
    }
});
