document.addEventListener('DOMContentLoaded', function() {
    // Safely check if elements exist
    const physicalSection = document.getElementById('physical-health');
    const mentalSection = document.getElementById('mental-health');
    
    if (!physicalSection || !mentalSection) {
        console.error('Required sections not found!');
        return;
    }

    const formData = {
        physical: {},
        mental: {}
    };

    // Physical health inputs (with null checks)
    const physicalInputs = physicalSection.querySelectorAll('input, select');
    physicalInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (!this.id && !this.name) return;
            formData.physical[this.id || this.name] = this.value;
        });
    });

    // Mental health scale options (with error handling)
    const scaleOptions = mentalSection.querySelectorAll('.scale-option');
    scaleOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            try {
                const questionId = this.closest('.question')?.getAttribute('data-question');
                if (!questionId) throw new Error('Question ID not found');
                
                formData.mental[questionId] = parseInt(this.value);
                this.classList.add('selected');
                
                // Deselect others
                this.parentNode.querySelectorAll('.scale-option').forEach(b => {
                    if (b !== this) b.classList.remove('selected');
                });
            } catch (error) {
                console.error('Error handling scale option:', error);
            }
        });
    });

    // Save assessment (with validation)
    window.saveAssessment = function() {
        if (Object.keys(formData.physical).length === 0 || Object.keys(formData.mental).length === 0) {
            alert('Please complete all questions!');
            return;
        }

        // Proceed to feelings page
        sessionStorage.setItem('wellsureAssessment', JSON.stringify(formData));
        window.location.href = 'feelings.html';
    };
});
