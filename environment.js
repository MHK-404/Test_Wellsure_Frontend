document.addEventListener('DOMContentLoaded', function() {
    const environmentText = document.getElementById('environment-text');
    const analyzeBtn = document.getElementById('analyze-environment');
    const resultDiv = document.getElementById('environment-result');
    const nextBtn = document.getElementById('next-to-results');
    
    analyzeBtn.addEventListener('click', async function() {
        const text = environmentText.value.trim();
        
        if (text.length < 10) {
            resultDiv.innerHTML = '<p class="error">Please enter at least 10 characters</p>';
            return;
        }
        
        try {
            // For school project, we'll simulate environment analysis
            const keywords = extractKeywords(text);
            const recommendation = generateEnvironmentRecommendation(keywords);
            
            // Save analysis results
            const assessmentData = getAssessmentData();
            assessmentData.environmentAnalysis = {
                keywords,
                recommendation
            };
            saveAssessmentData(assessmentData);
            
            // Display results
            resultDiv.innerHTML = `
                <h3>Environment Analysis</h3>
                <p>Key factors: <strong>${keywords.join(', ')}</strong></p>
                <div class="recommendation">
                    <h4>Recommendation:</h4>
                    <p>${recommendation}</p>
                </div>
            `;
            
            nextBtn.disabled = false;
        } catch (error) {
            resultDiv.innerHTML = '<p class="error">Analysis failed. Please try again.</p>';
            console.error('Analysis error:', error);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        // Calculate final score before proceeding to results
        calculateFinalScore();
        window.location.href = 'results.html';
    });
    
    function extractKeywords(text) {
        const envKeywords = [
            'noisy', 'quiet', 'crowded', 'spacious', 'polluted', 'clean', 
            'stressful', 'calm', 'safe', 'dangerous', 'nature', 'urban'
        ];
        
        return envKeywords.filter(keyword => 
            text.toLowerCase().includes(keyword)
        ).slice(0, 5);
    }
    
    function generateEnvironmentRecommendation(keywords) {
        if (keywords.includes('noisy') || keywords.includes('crowded')) {
            return "Your environment seems busy. Consider noise-cancelling headphones or finding quiet spaces.";
        }
        if (keywords.includes('nature') || keywords.includes('clean')) {
            return "Your environment appears healthy. Spending time in nature is great for wellbeing.";
        }
        return "Consider evaluating your environment for factors that may affect your health.";
    }
    
    function calculateFinalScore() {
        // In a real app, this would call your backend
        const data = getAssessmentData();
        
        // Adjust score based on environment (simplified)
        if (data.environmentAnalysis) {
            const envScore = data.environmentAnalysis.keywords.includes('noisy') ||
                            data.environmentAnalysis.keywords.includes('polluted') ? -50 : 0;
            
            data.totalScore = Math.max(0, data.totalScore + envScore);
            saveAssessmentData(data);
        }
    }
});
