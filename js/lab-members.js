/**
 * Lab Members Data Management
 * This file contains functions to update lab member information from survey data
 */

// Survey Data Structure Template
const surveyDataTemplate = {
    timestamp: "",
    fullName: "",
    position: "",
    workplace: "",
    profileImage: "",
    phone: "",
    email: "",
    linkedin: "",
    degree: "",
    department: "",
    researchTitleArabic: "",
    researchTitleEnglish: "",
    researchProgress: "",
    experimentStatus: "",
    challenges: "",
    supervisorContact: "",
    contactMethod: "",
    supervisionQuality: "",
    suggestions: "",
    additionalComments: ""
};

// Function to create a member card from survey data
function createMemberCard(memberData, degree) {
    const degreeClass = degree === 'Ph.D.' ? 'primary' : 'success';
    const avatarBg = degree === 'Ph.D.' ? '667eea' : '28a745';
    
    return `
    <div class="col-lg-${degree === 'Ph.D.' ? '6' : '4'} col-md-${degree === 'Ph.D.' ? '12' : '6'} mb-4">
        <div class="card custom-card h-100">
            <div class="card-body text-center">
                <div class="member-photo mb-3">
                    <img src="${memberData.profileImage || 'assets/img/default-avatar.jpg'}" 
                         alt="${memberData.fullName}" 
                         class="member-img"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(memberData.fullName)}&background=${avatarBg}&color=ffffff&size=150&bold=true'">
                </div>
                <h5 class="card-title mb-3">${memberData.fullName}</h5>
                <div class="degree-badge">
                    <span class="badge bg-${degreeClass} mb-3">${degree} Student</span>
                </div>
                
                ${memberData.position ? `
                <div class="contact-info mb-3">
                    ${memberData.position ? `<p class="small mb-1"><i class="fas fa-briefcase me-2"></i>${memberData.position}</p>` : ''}
                    ${memberData.workplace ? `<p class="small mb-1"><i class="fas fa-building me-2"></i>${memberData.workplace}</p>` : ''}
                    ${memberData.email ? `<p class="small mb-1"><i class="fas fa-envelope me-2"></i>${memberData.email}</p>` : ''}
                    ${memberData.phone ? `<p class="small mb-1"><i class="fas fa-phone me-2"></i>${memberData.phone}</p>` : ''}
                </div>
                ` : ''}
                
                <div class="thesis-info text-start">
                    ${memberData.researchTitleArabic ? `
                    <h6 class="fw-bold mb-2">عنوان البحث (باللغة العربية):</h6>
                    <p class="text-muted mb-3" style="font-size: 0.9rem; direction: rtl;">
                        ${memberData.researchTitleArabic}
                    </p>
                    ` : ''}
                    
                    ${memberData.researchTitleEnglish ? `
                    <h6 class="fw-bold mb-2">Research Title (English):</h6>
                    <p class="text-muted" style="font-size: 0.9rem; font-style: italic;">
                        ${memberData.researchTitleEnglish}
                    </p>
                    ` : ''}
                </div>
            </div>
        </div>
    </div>
    `;
}

// Function to update survey statistics
function updateSurveyStats(totalStudents, responseCount) {
    const completionRate = ((responseCount / totalStudents) * 100).toFixed(1);
    const pendingCount = totalStudents - responseCount;
    
    document.querySelector('.survey-stats').innerHTML = `
        <div class="col-md-4 mb-3">
            <div class="stat-item">
                <h4 class="text-success mb-2">${responseCount}</h4>
                <p class="small text-muted">Responses Received</p>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="stat-item">
                <h4 class="text-warning mb-2">${pendingCount}</h4>
                <p class="small text-muted">Pending Responses</p>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="stat-item">
                <h4 class="text-info mb-2">${totalStudents}</h4>
                <p class="small text-muted">Total Students</p>
            </div>
        </div>
    `;
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${completionRate}%`;
        progressBar.setAttribute('aria-valuenow', completionRate);
    }
    
    // Update completion rate text
    const lastUpdated = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const statusText = document.querySelector('.survey-status-text');
    if (statusText) {
        statusText.innerHTML = `
            <strong>Last Updated:</strong> ${lastUpdated} | 
            <strong>Survey Completion Rate:</strong> ${completionRate}%
        `;
    }
}

// Function to convert Google Drive sharing URL to direct image URL
function convertGoogleDriveUrl(shareUrl) {
    if (!shareUrl || !shareUrl.includes('drive.google.com')) {
        return shareUrl;
    }
    
    // Handle different Google Drive URL formats
    const fileIdMatch = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
        return `https://drive.google.com/open?id=${fileIdMatch[1]}`;
    }
    
    // Handle open?id= format (like the one from survey)
    const openIdMatch = shareUrl.match(/open\?id=([a-zA-Z0-9_-]+)/);
    if (openIdMatch) {
        return `https://drive.google.com/open?id=${openIdMatch[1]}`;
    }
    
    // Handle uc?id= format
    const idMatch = shareUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
        return `https://drive.google.com/open?id=${idMatch[1]}`;
    }
    
    return shareUrl;
}

// Sample data structure for easy updates
const sampleMemberData = {
    "محمد عطية عبدالمنعم": {
        fullName: "محمد عطية عبدالمنعم",
        englishName: "Mohamed Attia Abdel-Monem",
        position: "R&D Chemist (Lab Supervisor)",
        workplace: "Jazeera Paints Company",
        profileImage: "https://drive.google.com/open?id=1d0P2PJE6MprUJkO3B_ygy57dWnLR1lXo",
        phone: "01201965469",
        email: "mohamedattya6666@gmail.com",
        linkedin: "",
        degree: "Ph.D.",
        department: "كيمياء",
        researchTitleArabic: "تصميم وتحضير بوليمر أكريليت يحتوي على الفوسفور لتحسين مقاومة التآكل في الطلاءات المعالجة بالأشعة فوق البنفسجية",
        researchTitleEnglish: "Design and synthesis of a phosphorus-containing acrylic polymer for improving corrosion resistance in UV-cured coatings"
    }
};

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lab Members page loaded');
    
    // Handle member image loading
    const memberImages = document.querySelectorAll('.member-img');
    memberImages.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.remove('loading');
        });
        
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            // The onerror attribute will handle the fallback
        });
        
        // Add loading class initially if src is set
        if (img.src && !img.complete) {
            img.classList.add('loading');
        }
    });
    
    // Test Google Drive image accessibility
    testGoogleDriveImages();
});

// Function to test if Google Drive images are accessible
function testGoogleDriveImages() {
    const googleDriveImages = document.querySelectorAll('img[src*="drive.google.com"]');
    
    googleDriveImages.forEach(img => {
        const testImg = new Image();
        testImg.onload = function() {
            console.log('Google Drive image loaded successfully:', img.alt);
        };
        testImg.onerror = function() {
            console.warn('Google Drive image failed to load, using fallback:', img.alt);
            // Trigger the onerror fallback
            if (img.onerror) {
                img.onerror();
            }
        };
        testImg.src = img.src;
    });
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createMemberCard,
        updateSurveyStats,
        convertGoogleDriveUrl,
        sampleMemberData
    };
}
