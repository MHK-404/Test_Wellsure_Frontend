document.addEventListener('DOMContentLoaded', function() {
    console.log("Results page loaded - initializing...");

    // ======================
    // 1. SAFETY CHECKS
    // ======================
    const requiredElements = [
        'score-fill', 'total-score', 'risk-category',
        'physical-score', 'mental-score',
        'physical-recommendations', 'mental-recommendations',
        'download-pdf', 'restart-assessment'
    ];

    const elements = {};
    requiredElements.forEach(id => {
        elements[id] = document.getElementById(id);
        if (!elements[id]) {
            console.error(`CRITICAL: Missing element #${id}`);
            alert("System error. Please refresh the page.");
            return;
        }
    });

    // ======================
    // 2. LOAD ASSESSMENT DATA
    // ======================
    const storedData = sessionStorage.getItem('wellsureAssessment');
    if (!storedData) {
        alert("No assessment data found. Please complete the assessment first.");
        window.location.href = "assessment.html";
        return;
    }

    const data = JSON.parse(storedData);
    console.log("Loaded assessment data:", data);

    // ======================
    // 3. DISPLAY RESULTS
    // ======================
    // Calculate scores if not already in data
    data.totalScore = data.totalScore || calculateTotalScore(data);
    data.physicalScore = data.physicalScore || calculatePhysicalScore(data.physical);
    data.mentalScore = data.mentalScore || calculateMentalScore(data.mental);

    // Update UI
    elements['total-score'].textContent = data.totalScore;
    elements['physical-score'].textContent = `${data.physicalScore}/500`;
    elements['mental-score'].textContent = `${data.mentalScore}/500`;

    // Animate score bar
    setTimeout(() => {
        elements['score-fill'].style.width = `${(data.totalScore / 1000) * 100}%`;
        elements['score-fill'].style.backgroundColor = getRiskColor(data.totalScore);
        elements['risk-category'].textContent = getRiskCategory(data.totalScore).name;
        elements['risk-category'].style.color = getRiskColor(data.totalScore);
    }, 500);

    // Generate recommendations
    generateRecommendations(data, elements);

    // ======================
    // 4. SET UP EVENT HANDLERS
    // ======================
    elements['download-pdf'].addEventListener('click', () => generatePDF(data));
    elements['restart-assessment'].addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = "assessment.html";
    });

    // ======================
    // HELPER FUNCTIONS
    // ======================
    function calculateTotalScore(data) {
        return (data.physicalScore || 0) + (data.mentalScore || 0);
    }

    function calculatePhysicalScore(physicalData) {
        // Your scoring logic here
        return Math.min(500, Object.values(physicalData).reduce((sum, val) => sum + (parseInt(val) || 0, 0));
    }

    function calculateMentalScore(mentalData) {
        // Your scoring logic here
        return Math.min(500, 500 - (Object.values(mentalData).reduce((sum, val) => sum + (parseInt(val) || 0, 0) * 20));
    }

    function getRiskCategory(score) {
        if (score <= 199) return { name: 'Excellent', color: '#27ae60' };
        if (score <= 399) return { name: 'Good', color: '#2ecc71' };
        if (score <= 599) return { name: 'Moderate', color: '#f1c40f' };
        if (score <= 799) return { name: 'High', color: '#e67e22' };
        return { name: 'Very High', color: '#e74c3c' };
    }

    function getRiskColor(score) {
        return getRiskCategory(score).color;
    }

    function generateRecommendations(data, elements) {
        const physicalRecs = [];
        const mentalRecs = [];

        // Physical recommendations
        if (data.physicalScore < 250) {
            physicalRecs.push("Increase weekly exercise to 3+ times");
            physicalRecs.push("Aim for 7-8 hours of sleep nightly");
        }

        // Mental recommendations
        if (data.mentalScore < 250) {
            mentalRecs.push("Practice mindfulness for 10 minutes daily");
            mentalRecs.push("Consider talking to a counselor");
        }

        // Update DOM
        physicalRecs.forEach(rec => {
            elements['physical-recommendations'].innerHTML += `<li>${rec}</li>`;
        });

        mentalRecs.forEach(rec => {
            elements['mental-recommendations'].innerHTML += `<li>${rec}</li>`;
        });
    }

    function generatePDF(data) {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(20);
            doc.setTextColor(39, 174, 96);
            doc.text('WellSure Assessment Report', 105, 20, { align: 'center' });
            
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
            
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text(`Your WellSure Score: ${data.totalScore}/1000`, 20, 50);
            
            const risk = getRiskCategory(data.totalScore);
            doc.setTextColor(risk.color);
            doc.text(`Risk Category: ${risk.name}`, 20, 60);
            
            doc.save(`WellSure_Report_${Date.now()}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Could not generate PDF. Please try again.");
        }
    }
});
