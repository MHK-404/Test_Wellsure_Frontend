document.addEventListener('DOMContentLoaded', function() {
    // Initialize form data
    const formData = {
        physical: {},
        mental: {}
    };

    // Section switching function
    window.switchSection = function(sectionId) {
        document.querySelector('.question-section.active').classList.remove('active');
        document.getElementById(sectionId).classList.add('active');
        
        // Update progress steps
        document.querySelectorAll('.progress-steps .step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.progress-steps .step:nth-child(${sectionId === 'physical-health' ? 1 : 2})`).classList.add('active');
    };

    // Physical health inputs
    document.querySelectorAll('#physical-health input, #physical-health select').forEach(input => {
        input.addEventListener('change', function() {
            formData.physical[this.name] = this.value;
        });
    });

    // Mental health scale buttons
    document.querySelectorAll('.scale-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionId = this.closest('.question').getAttribute('data-question');
            formData.mental[questionId] = parseInt(this.value);
            
            // Update UI
            this.classList.add('selected');
            this.parentNode.querySelectorAll('.scale-option').forEach(b => {
                if (b !== this) b.classList.remove('selected');
            });
        });
    });

    // Next button event delegation
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-target]')) {
            switchSection(e.target.getAttribute('data-target'));
        }
        
        if (e.target.id === 'complete-assessment') {
            if (Object.keys(formData.mental).length < 2) {
                alert('Please answer all mental health questions!');
                return;
            }
            
            // Calculate scores
            formData.physicalScore = calculatePhysicalScore(formData.physical);
            formData.mentalScore = calculateMentalScore(formData.mental);
            formData.totalScore = formData.physicalScore + formData.mentalScore;
            
            // Save and proceed
            sessionStorage.setItem('wellsureAssessment', JSON.stringify(formData));
            window.location.href = 'feelings.html';
        }
    });

    // Scoring functions
    function calculatePhysicalScore(physical) {
        let score = 0;
        score += parseInt(physical.exercise || 0) * 20;
        score += parseInt(physical.diet || 0) * 25;
        score += (parseInt(physical.sleep || 7) >= 7 ? 50 : 20;
        return Math.min(500, score);
    }

    function calculateMentalScore(mental) {
        let score = 500; // Start with max
        score -= (mental.stress || 0) * 40;
        score -= (mental.mood || 0) * 30;
        return Math.max(0, score);
    }
});
