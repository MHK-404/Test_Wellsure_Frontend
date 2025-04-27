document.addEventListener('DOMContentLoaded', function() {
    const feelingsText = document.getElementById('feelings-text');
    const analyzeBtn = document.getElementById('analyze-feelings');
    const resultDiv = document.getElementById('feelings-result');
    const nextBtn = document.getElementById('next-to-environment');
    
    analyzeBtn.addEventListener('click', async function() {
        const text = feelingsText.value.trim();
        
        if (text.length < 10) {
            resultDiv.innerHTML = '<p class="error">Please enter at least 10 characters</p>';
            return;
        }
        
        try {
            // Call backend for sentiment analysis
            const response = await fetch(`${API_BASE_URL}/api/analyze-feelings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            
            const data = await response.json();
            
            // Save analysis results
            const assessmentData = getAssessmentData();
            assessmentData.feelingsAnalysis = data;
            saveAssessmentData(assessmentData);
            
            // Display results
            resultDiv.innerHTML = `
                <h3>Feelings Analysis</h3>
                <p>Sentiment: <strong>${data.analysis.sentiment}</strong></p>
                <p>Positive words: ${data.analysis.positiveWords}</p>
                <p>Negative words: ${data.analysis.negativeWords}</p>
                <div class="recommendation">
                    <h4>Recommendation:</h4>
                    <p>${data.recommendations}</p>
                </div>
            `;
            
            nextBtn.disabled = false;
        } catch (error) {
            resultDiv.innerHTML = '<p class="error">Analysis failed. Please try again.</p>';
            console.error('Analysis error:', error);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        window.location.href = 'environment.html';
    });
});
