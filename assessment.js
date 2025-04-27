document.addEventListener('DOMContentLoaded', function() {
    const physicalSection = document.getElementById('physical-health');
    const mentalSection = document.getElementById('mental-health');
    const nextPhysicalBtn = document.querySelector('.next-section');
    
    // Initialize form data
    const formData = {
        physical: {},
        mental: {}
    };
    
    // Physical health inputs
    physicalSection.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', function() {
            formData.physical[this.id || this.name] = this.value;
            
            // Calculate BMI if weight and height are provided
            if (formData.physical.weight && formData.physical.height) {
                const bmi = calculateBMI(
                    parseFloat(formData.physical.weight), 
                    parseFloat(formData.physical.height)
                );
                document.getElementById('bmi-value').textContent = bmi;
            }
        });
    });
    
    // Mental health inputs
    mentalSection.querySelectorAll('.scale-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionId = this.closest('.question').getAttribute('data-question');
            formData.mental[questionId] = parseInt(this.value);
            this.classList.add('selected');
            
            // Remove selection from other buttons in same question
            this.parentNode.querySelectorAll('.scale-option').forEach(b => {
                if (b !== this) b.classList.remove('selected');
            });
        });
    });
    
    // Next section button
    nextPhysicalBtn.addEventListener('click', function() {
        physicalSection.classList.remove('active');
        mentalSection.classList.add('active');
    });
    
    // Save assessment and proceed to feelings page
    window.saveAssessment = function() {
        // Calculate scores (simplified for school project)
        const physicalScore = calculatePhysicalScore(formData.physical);
        const mentalScore = calculateMentalScore(formData.mental);
        const totalScore = physicalScore + mentalScore;
        
        // Save to session storage
        saveAssessmentData({
            ...formData,
            physicalScore,
            mentalScore,
            totalScore,
            riskCategory: getRiskCategory(totalScore).name
        });
        
        // Proceed to feelings page
        window.location.href = 'feelings.html';
    };
    
    // Simplified scoring functions
    function calculatePhysicalScore(answers) {
        let score = 0;
        
        // Exercise (0-60 points)
        score += (parseInt(answers.exercise) || 0) * 20;
        
        // Diet (simplified)
        if (answers.diet === 'healthy') score += 100;
        else if (answers.diet === 'average') score += 50;
        
        // BMI calculation
        if (answers.weight && answers.height) {
            const bmi = calculateBMI(answers.weight, answers.height);
            if (bmi >= 18.5 && bmi <= 24.9) score += 100;
            else if (bmi >= 17 && bmi <= 29.9) score += 50;
        }
        
        return Math.min(500, score);
    }
    
    function calculateMentalScore(answers) {
        let score = 500; // Start with max and deduct
        
        // Deduct based on responses
        Object.values(answers).forEach(value => {
            score -= value * 20; // Each point reduces score by 20
        });
        
        return Math.max(0, score);
    }
});
