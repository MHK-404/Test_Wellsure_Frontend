// API base URL - update with your backend URL
const API_BASE_URL = 'https://test-wellsure-back-ancbame0gwg5ccfu.uaenorth-01.azurewebsites.net';

// Store assessment data in session storage
function saveAssessmentData(data) {
    sessionStorage.setItem('wellsureAssessment', JSON.stringify(data));
}

function getAssessmentData() {
    return JSON.parse(sessionStorage.getItem('wellsureAssessment')) || {};
}

// Calculate BMI
function calculateBMI(weight, height) {
    return (weight / ((height / 100) ** 2)).toFixed(1);
}

// Get risk category
function getRiskCategory(score) {
    if (score <= 199) return { name: 'Excellent', color: 'bright-green' };
    if (score <= 399) return { name: 'Good', color: 'green' };
    if (score <= 599) return { name: 'Moderate', color: 'yellow' };
    if (score <= 799) return { name: 'High', color: 'orange' };
    return { name: 'Very High', color: 'red' };
}

// Generate PDF - updated version of what you had before
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get current date
    const today = new Date().toLocaleDateString();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(46, 204, 113); // Green color
    doc.text('WellSure Assessment Report', 105, 20, { align: 'center' });
    
    // Add date
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${today}`, 105, 30, { align: 'center' });
    
    // Get assessment data
    const data = getAssessmentData();
    
    // Add score
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Your WellSure Score: ${data.totalScore}/1000`, 20, 50);
    
    // Add risk category
    const risk = getRiskCategory(data.totalScore);
    doc.setTextColor(risk.color === 'bright-green' ? 39, 174, 96 : 
                     risk.color === 'green' ? 46, 204, 113 :
                     risk.color === 'yellow' ? 241, 196, 15 :
                     risk.color === 'orange' ? 230, 126, 34 : 231, 76, 60);
    doc.text(`Risk Category: ${risk.name}`, 20, 60);
    
    // Add sections
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Physical Health', 20, 80);
    doc.text(`Score: ${data.physicalScore}/500`, 20, 90);
    
    doc.text('Mental Health', 20, 110);
    doc.text(`Score: ${data.mentalScore}/500`, 20, 120);
    
    // Add recommendations
    doc.setFontSize(12);
    doc.text('Recommendations:', 20, 140);
    let yPos = 150;
    
    if (data.recommendations) {
        data.recommendations.forEach(rec => {
            doc.text(`- ${rec}`, 25, yPos);
            yPos += 10;
        });
    }
    
    // Save the PDF
    doc.save(`WellSure_Report_${today.replace(/\//g, '-')}.pdf`);
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initTooltips();
});
