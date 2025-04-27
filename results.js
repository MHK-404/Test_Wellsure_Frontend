document.addEventListener('DOMContentLoaded', function() {
    // Safely retrieve data
    const storedData = sessionStorage.getItem('wellsureAssessment');
    if (!storedData) {
        window.location.href = 'assessment.html'; // Redirect if no data
        return;
    }

    const data = JSON.parse(storedData);
    if (!data.totalScore) {
        console.error('Invalid score data');
        return;
    }

    // Display scores (with fallbacks)
    document.getElementById('total-score').textContent = data.totalScore || 0;
    document.getElementById('physical-score').textContent = `${data.physicalScore || 0}/500`;
    document.getElementById('mental-score').textContent = `${data.mentalScore || 0}/500`;

    // Animate score bar
    const scoreFill = document.getElementById('score-fill');
    if (scoreFill) {
        setTimeout(() => {
            scoreFill.style.width = `${(data.totalScore / 1000) * 100}%`;
        }, 500);
    }

    // PDF Generation (with error handling)
    document.querySelector('.download-btn')?.addEventListener('click', async function() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.text('WellSure Report', 105, 20, { align: 'center' });
            doc.text(`Score: ${data.totalScore}/1000`, 20, 40);
            
            // Save PDF
            doc.save('wellsure-report.pdf');
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    });
});
