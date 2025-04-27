document.addEventListener('DOMContentLoaded', function() {
    const data = getAssessmentData();
    const riskCategory = getRiskCategory(data.totalScore);
    
    // Display scores
    document.getElementById('total-score').textContent = data.totalScore;
    document.getElementById('physical-score').textContent = `${data.physicalScore}/500`;
    document.getElementById('mental-score').textContent = `${data.mentalScore}/500`;
    
    // Animate score bar
    const scoreFill = document.getElementById('score-fill');
    setTimeout(() => {
        scoreFill.style.width = `${(data.totalScore / 1000) * 100}%`;
        scoreFill.style.backgroundColor = `var(--${riskCategory.color})`;
    }, 500);
    
    // Display risk category
    const riskElement = document.getElementById('risk-category');
    riskElement.textContent = riskCategory.name;
    riskElement.classList.add(`risk-${riskCategory.color.replace('-', '')}`);
    
    // Generate recommendations
    generateRecommendations(data);
    
    // Display AI analyses if available
    if (data.feelingsAnalysis) {
        document.getElementById('feelings-recommendation').innerHTML = 
            `<p>${data.feelingsAnalysis.recommendations}</p>`;
    }
    
    if (data.environmentAnalysis) {
        document.getElementById('environment-recommendation').innerHTML = 
            `<p>${data.environmentAnalysis.recommendation}</p>`;
    }
    
    // PDF generation button
    document.querySelector('.download-btn').addEventListener('click', generatePDF);
    
    function generateRecommendations(data) {
        const physicalRecs = [];
        const mentalRecs = [];
        
        // Physical recommendations
        if (data.physicalScore < 250) {
            physicalRecs.push("Consider increasing your exercise to 3+ times per week");
            physicalRecs.push("Aim for 7-8 hours of sleep nightly");
        }
        
        // Mental recommendations
        if (data.mentalScore < 250) {
            mentalRecs.push("Practice mindfulness or meditation daily");
            mentalRecs.push("Consider talking to a counselor about stress management");
        }
        
        // Add to DOM
        const physicalRecElement = document.getElementById('physical-recommendations');
        const mentalRecElement = document.getElementById('mental-recommendations');
        
        physicalRecs.forEach(rec => {
            physicalRecElement.innerHTML += `<li>${rec}</li>`;
        });
        
        mentalRecs.forEach(rec => {
            mentalRecElement.innerHTML += `<li>${rec}</li>`;
        });
        
        // Save recommendations
        data.recommendations = [...physicalRecs, ...mentalRecs];
        saveAssessmentData(data);
    }
});
