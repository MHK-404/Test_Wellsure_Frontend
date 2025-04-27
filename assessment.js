document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded - initializing assessment...");

    // ======================
    // 1. SAFETY CHECKS
    // ======================
    const physicalSection = document.getElementById('physical-health');
    const mentalSection = document.getElementById('mental-health');
    
    if (!physicalSection || !mentalSection) {
        console.error("ERROR: Missing required sections. Check your HTML IDs.");
        alert("System error. Please refresh the page.");
        return;
    }

    // ======================
    // 2. DATA COLLECTION
    // ======================
    const formData = {
        physical: {},
        mental: {}
    };

    // Physical Health Inputs
    const physicalInputs = physicalSection.querySelectorAll('input, select');
    physicalInputs.forEach(input => {
        input.addEventListener('change', function() {
            formData.physical[this.name || this.id] = this.value;
        });
    });

    // Mental Health Scale Buttons
    document.querySelectorAll('.scale-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionId = this.closest('.question').getAttribute('data-question');
            formData.mental[questionId] = parseInt(this.value);
            
            // Visual feedback
            this.classList.add('selected');
            this.parentNode.querySelectorAll('.scale-option').forEach(b => {
                if (b !== this) b.classList.remove('selected');
            });
        });
    });

    // ======================
    // 3. NAVIGATION FUNCTIONS
    // ======================
    window.switchSection = function(sectionId) {
        document.querySelector('.question-section.active').classList.remove('active');
        document.getElementById(sectionId).classList.add('active');
    };

    window.saveAssessment = function() {
        // Validate required questions
        if (Object.keys(formData.mental).length === 0) {
            alert("Please answer all mental health questions!");
            return;
        }

        // Save to session storage
        sessionStorage.setItem('wellsureAssessment', JSON.stringify
