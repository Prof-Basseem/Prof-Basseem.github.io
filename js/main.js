// Main JavaScript for Dr. Mahmoud Basseem Academic Website

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize navbar functionality
    initializeNavbar();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize research paper downloads
    initializePaperDownloads();
    
    // Initialize flip cards for mobile devices
    // initializeFlipCards(); // Now handled by flip-cards.js
});

// Navbar functionality
function initializeNavbar() {
    // Highlight active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (href === 'index.html' && currentPage === '')) {
            link.classList.add('active');
        }
    });
    
    // Close mobile navbar when link is clicked
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
}

// Form validation and submission
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Reset previous validation states
        contactForm.classList.remove('was-validated');
        
        // Validate form
        if (validateContactForm()) {
            handleFormSubmission();
        } else {
            contactForm.classList.add('was-validated');
        }
    });
}

// Validate contact form with new field structure
function validateContactForm() {
    const fields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message'),
        consent: document.getElementById('consent')
    };
    
    let isValid = true;
    
    // Validate first name
    if (!validateField(fields.firstName, 'text', 'First name is required')) {
        isValid = false;
    }
    
    // Validate last name
    if (!validateField(fields.lastName, 'text', 'Last name is required')) {
        isValid = false;
    }
    
    // Validate email
    if (!validateField(fields.email, 'email', 'Valid email is required')) {
        isValid = false;
    }
    
    // Validate subject
    if (!validateField(fields.subject, 'select', 'Please select a subject')) {
        isValid = false;
    }
    
    // Validate message
    if (!validateField(fields.message, 'textarea', 'Message is required')) {
        isValid = false;
    }
    
    // Validate consent checkbox
    if (!fields.consent.checked) {
        fields.consent.classList.add('is-invalid');
        isValid = false;
    } else {
        fields.consent.classList.remove('is-invalid');
        fields.consent.classList.add('is-valid');
    }
    
    return isValid;
}

// Validate individual field
function validateField(field, type, errorMessage) {
    if (!field) return true;
    
    let isValid = false;
    const value = field.value.trim();
    
    switch (type) {
        case 'text':
        case 'textarea':
            isValid = value.length >= 2;
            break;
        case 'email':
            isValid = value.length > 0 && isValidEmail(value);
            break;
        case 'select':
            isValid = value !== '';
            break;
        default:
            isValid = value.length > 0;
    }
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

// Check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle form submission
function handleFormSubmission() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Show success message
        showSuccessMessage('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        form.reset();
        form.classList.remove('was-validated');
        
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Clear validation classes
        const fields = form.querySelectorAll('.form-control, .form-select, .form-check-input');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        
    }, 2000);
}

// Show success message
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success-custom alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.getElementById('contactForm');
    const container = form.parentElement;
    container.insertBefore(alertDiv, form);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.getElementById('contactForm');
    const container = form.parentElement;
    container.insertBefore(alertDiv, form);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => { link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.custom-card, .research-item, .publication-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Initialize counter animations
    initializeCounterAnimations();
}

// Counter animation functionality
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stats-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateCounter(entry.target);
                entry.target.classList.add('animated');
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate individual counter
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Initialize research paper downloads
function initializePaperDownloads() {
    const downloadLinks = document.querySelectorAll('.download-paper');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const paperTitle = this.getAttribute('data-paper');
            const paperUrl = this.getAttribute('href');
            
            // Show download notification
            showDownloadNotification(paperTitle);
            
            // Simulate download (replace with actual download logic)
            setTimeout(() => {
                // You can implement actual download logic here
                console.log(`Downloading: ${paperTitle} from ${paperUrl}`);
            }, 1000);
        });
    });
}

// Show download notification
function showDownloadNotification(paperTitle) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-info alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 1055; max-width: 350px;';
    alertDiv.innerHTML = `
        <i class="fas fa-download me-2"></i>Preparing download: "${paperTitle}"
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 3000);
}

// Flip cards are now handled by flip-cards.js to avoid conflicts

// Utility functions
const Utils = {
    // Scroll to top
    scrollToTop: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    // Copy text to clipboard
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!');
        });
    },
    
    // Show toast notification
    showToast: function(message) {
        const toast = document.createElement('div');
        toast.className = 'toast position-fixed';
        toast.style.cssText = 'top: 100px; right: 20px; z-index: 1055;';
        toast.innerHTML = `
            <div class="toast-body bg-success text-white">
                ${message}
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

// Add scroll to top functionality
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// Global error handler for development
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        isValidEmail,
        showSuccessMessage,
        showErrorMessage,
        Utils
    };
}

// Form validation and submission
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Reset previous validation states
        contactForm.classList.remove('was-validated');
        
        // Validate form
        if (validateContactForm()) {
            handleFormSubmission();
        } else {
            contactForm.classList.add('was-validated');
        }
    });
}

// Validate contact form with new field structure
function validateContactForm() {
    const form = document.getElementById('contactForm');
    const fields = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message'),
        consent: document.getElementById('consent')
    };
    
    let isValid = true;
    
    // Validate first name
    if (!validateField(fields.firstName, 'text', 'First name is required')) {
        isValid = false;
    }
    
    // Validate last name
    if (!validateField(fields.lastName, 'text', 'Last name is required')) {
        isValid = false;
    }
    
    // Validate email
    if (!validateField(fields.email, 'email', 'Valid email is required')) {
        isValid = false;
    }
    
    // Validate subject
    if (!validateField(fields.subject, 'select', 'Please select a subject')) {
        isValid = false;
    }
    
    // Validate message
    if (!validateField(fields.message, 'textarea', 'Message is required')) {
        isValid = false;
    }
    
    // Validate consent checkbox
    if (!fields.consent.checked) {
        fields.consent.classList.add('is-invalid');
        isValid = false;
    } else {
        fields.consent.classList.remove('is-invalid');
        fields.consent.classList.add('is-valid');
    }    
    return isValid;
}

// Handle form submission
function handleFormSubmission() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Show success message
        showSuccessMessage('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        form.reset();
        form.classList.remove('was-validated');
        
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Clear validation classes
        const fields = form.querySelectorAll('.form-control, .form-select, .form-check-input');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        
    }, 2000);
}
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        const consent = document.getElementById('consent');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const formStatus = document.getElementById('form-status');
        
        // Reset previous validation states
        contactForm.classList.remove('was-validated');
        formStatus.innerHTML = '';
        
        let isValid = true;
        
        // Validate first name
        if (!firstName.value.trim()) {
            firstName.classList.add('is-invalid');
            isValid = false;
        } else {
            firstName.classList.remove('is-invalid');
            firstName.classList.add('is-valid');
        }
        
        // Validate last name
        if (!lastName.value.trim()) {
            lastName.classList.add('is-invalid');
            isValid = false;
        } else {
            lastName.classList.remove('is-invalid');
            lastName.classList.add('is-valid');
        }
        
        // Validate email
        if (!email.value.trim()) {
            email.classList.add('is-invalid');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
        }
        
        // Validate subject
        if (!subject.value) {
            subject.classList.add('is-invalid');
            isValid = false;
        } else {
            subject.classList.remove('is-invalid');
            subject.classList.add('is-valid');
        }
        
        // Validate message
        if (!message.value.trim()) {
            message.classList.add('is-invalid');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            message.classList.add('is-invalid');
            isValid = false;
        } else {
            message.classList.remove('is-invalid');
            message.classList.add('is-valid');
        }
        
        // Validate consent
        if (!consent.checked) {
            consent.classList.add('is-invalid');
            isValid = false;
        } else {
            consent.classList.remove('is-invalid');
            consent.classList.add('is-valid');
        }
        
        if (isValid) {
            // Show loading state
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form submission logic)
            setTimeout(() => {
                formStatus.innerHTML = `
                    <div class="alert alert-success d-flex align-items-center" role="alert">
                        <i class="fas fa-check-circle me-2"></i>
                        <div>Thank you for your message! I'll get back to you soon.</div>
                    </div>
                `;
                contactForm.reset();
                contactForm.querySelectorAll('.is-valid').forEach(field => {
                    field.classList.remove('is-valid');
                });
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
                submitBtn.disabled = false;
                
                // Scroll to success message
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 2000);
        } else {
            formStatus.innerHTML = `
                <div class="alert alert-danger d-flex align-items-center" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <div>Please correct the errors above and try again.</div>
                </div>
            `;
        }
    });
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateContactField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateContactField(this);
            }
        });
        
        input.addEventListener('change', function() {
            if (this.classList.contains('is-invalid')) {
                validateContactField(this);
            }
        });
    });
}

// Individual field validation function for contact form
function validateContactField(field) {
    const value = field.value.trim();
    
    switch(field.id) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else if (value.length < 2) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
            break;
            
        case 'email':
            if (!value) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else if (!isValidEmail(value)) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
            break;
            
        case 'subject':
            if (!field.value) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
            break;
            
        case 'message':
            if (!value) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else if (value.length < 10) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
            break;
            
        case 'consent':
            if (!field.checked) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
            break;
    }
}

// Field validation functions (legacy)
function validateField(field) {
    const value = field.value.trim();
    
    switch(field.id) {
        case 'name':
            if (!value) {
                showFieldError(field, 'Name is required');
            } else if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError(field, 'Email is required');
            } else if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
            }
            break;
            
        case 'message':
            if (!value) {
                showFieldError(field, 'Message is required');
            } else if (value.length < 10) {
                showFieldError(field, 'Message must be at least 10 characters');
            }
            break;
    }
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    let errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function resetFormValidation() {
    const invalidFields = document.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
        field.classList.remove('is-invalid');
    });
    
    const errorMessages = document.querySelectorAll('.invalid-feedback');
    errorMessages.forEach(error => {
        error.remove();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage() {
    const alertHtml = `
        <div class="alert alert-success-custom alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>
            Thank you for your message! I'll get back to you soon.
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const contactForm = document.getElementById('contactForm');
    contactForm.insertAdjacentHTML('beforebegin', alertHtml);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert-success-custom');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Smooth scrolling for anchor links (for single-page sections if any)
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Research paper download functionality
function initializePaperDownloads() {
    const downloadBtns = document.querySelectorAll('.download-paper');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const paperTitle = this.getAttribute('data-paper-title');
            const paperUrl = this.getAttribute('href');
            
            // Show download confirmation
            if (confirm(`Download "${paperTitle}"?`)) {
                // Track download (you can implement analytics here)
                console.log(`Downloading: ${paperTitle}`);
                
                // Create temporary download link
                const downloadLink = document.createElement('a');
                downloadLink.href = paperUrl;
                downloadLink.download = paperTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
                downloadLink.style.display = 'none';
                
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                // Show success message
                showDownloadMessage(paperTitle);
            }
        });
    });
}

function showDownloadMessage(paperTitle) {
    const message = document.createElement('div');
    message.className = 'alert alert-info position-fixed';
    message.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
    message.innerHTML = `
        <i class="fas fa-download me-2"></i>
        Downloading: ${paperTitle}
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Dark mode toggle (optional feature)
function initializeDarkMode() {
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (!darkModeBtn) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateDarkModeBtn(savedTheme === 'dark');
    }
    
    darkModeBtn.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateDarkModeBtn(newTheme === 'dark');
    });
}

function updateDarkModeBtn(isDark) {
    const darkModeBtn = document.getElementById('darkModeToggle');
    const icon = darkModeBtn.querySelector('i');
    
    if (isDark) {
        icon.className = 'fas fa-sun';
        darkModeBtn.title = 'Switch to Light Mode';
    } else {
        icon.className = 'fas fa-moon';
        darkModeBtn.title = 'Switch to Dark Mode';
    }
}

// Add loading states for navigation
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href*=".html"]');
    if (link && !link.hasAttribute('download')) {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            // Add loading state to clicked link
            link.classList.add('loading');
            
            // Remove loading state after page load or timeout
            setTimeout(() => {
                link.classList.remove('loading');
            }, 1000);
        }
    }
});

// Print functionality for CV/Resume
function printPage() {
    window.print();
}

// Copy email to clipboard
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        const toast = document.createElement('div');
        toast.className = 'alert alert-success-custom position-fixed';
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
        toast.innerHTML = '<i class="fas fa-check me-2"></i>Email copied to clipboard!';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('Email copied to clipboard!');
    });
}
