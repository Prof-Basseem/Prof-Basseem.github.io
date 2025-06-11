// Modern Contact Form Enhancement
document.addEventListener('DOMContentLoaded', function() {
    initializeModernContactForm();
});

// Initialize all enhancements
function initializeModernContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Initialize all form enhancements
    initializeFloatingLabels();
    initializeCharacterCounter();
    initializeFormValidation();
    initializeSubmitButton();
    initializeTypingIndicator();
    
    // Add form completion checking
    const formFields = contactForm.querySelectorAll('.form-control-modern, .form-check-input-modern');
    formFields.forEach(field => {
        field.addEventListener('input', checkFormCompletion);
        field.addEventListener('change', checkFormCompletion);
    });
}

// Floating Labels Enhancement
function initializeFloatingLabels() {
    const inputs = document.querySelectorAll('.form-control-modern');
    
    inputs.forEach(input => {
        // Check if input has value on load
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        
        // Handle input events
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
            
            // Real-time validation
            if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                validateField(this);
            }
        });
        
        // Handle focus events
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Handle blur events
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            validateField(this);
        });
        
        // Handle select change
        if (input.tagName.toLowerCase() === 'select') {
            input.addEventListener('change', function() {
                if (this.value !== '') {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
                validateField(this);
            });
        }
    });
}

// Character Counter for Message Field
function initializeCharacterCounter() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const maxLength = 500;
    
    if (messageField && charCount) {
        messageField.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            // Change color based on character count
            if (currentLength > maxLength * 0.8) {
                charCount.style.color = '#ef4444';
            } else if (currentLength > maxLength * 0.6) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '#6b7280';
            }
            
            // Limit characters
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCount.textContent = maxLength;
            }
        });
    }
}

// Add typing indicator for character counter
function initializeTypingIndicator() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    let typingTimer;
    
    if (messageField && charCount) {
        messageField.addEventListener('input', function() {
            charCount.classList.add('typing');
            
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                charCount.classList.remove('typing');
            }, 1000);
        });
    }
}

// Enhanced Form Validation
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (validateForm()) {
            handleFormSubmission();
        }
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const fields = [
        { id: 'firstName', type: 'text', minLength: 2 },
        { id: 'lastName', type: 'text', minLength: 2 },
        { id: 'email', type: 'email' },
        { id: 'subject', type: 'select' },
        { id: 'message', type: 'textarea', minLength: 10 },
        { id: 'consent', type: 'checkbox' }
    ];
    
    let isValid = true;
    
    fields.forEach(fieldConfig => {
        const field = document.getElementById(fieldConfig.id);
        if (field && !validateField(field, fieldConfig)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field, config = null) {
    const value = field.value.trim();
    const fieldType = config ? config.type : field.type;
    
    // Remove previous validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldType) {
        case 'text':
            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (config && config.minLength && value.length < config.minLength) {
                isValid = false;
                errorMessage = `Must be at least ${config.minLength} characters`;
            }
            break;
            
        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email address is required';
            } else if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'select':
            if (!value || value === '') {
                isValid = false;
                errorMessage = 'Please select an option';
            }
            break;
            
        case 'textarea':
            if (!value) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (config && config.minLength && value.length < config.minLength) {
                isValid = false;
                errorMessage = `Message must be at least ${config.minLength} characters`;
            }
            break;
            
        case 'checkbox':
            if (!field.checked) {
                isValid = false;
                errorMessage = 'You must agree to continue';
            }
            break;
    }
    
    // Apply validation classes
    if (isValid) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
        updateErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

function updateErrorMessage(field, message) {
    const feedback = field.parentElement.querySelector('.invalid-feedback');
    if (feedback) {
        const messageElement = feedback.querySelector('span') || feedback;
        messageElement.textContent = message;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit Button Enhancement
function initializeSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;
    
    // Add ripple effect
    submitBtn.addEventListener('click', function(e) {
        if (!this.disabled) {
            createRipple(e, this);
        }
    });
}

function createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    const rect = element.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-effect');
    
    const ripple = element.querySelector('.ripple-effect');
    if (ripple) {
        ripple.remove();
    }
    
    element.appendChild(circle);
    
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Form Submission Handler
function handleFormSubmission() {
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('form-status');
    
    if (!validateForm()) {
        showValidationSummary();
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.classList.remove('pulse');
    submitBtn.disabled = true;
    
    // Clear previous status
    formStatus.innerHTML = '';
    
    // Simulate form submission with progress indicator
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Simulate random success/failure for demo
            const isSuccess = Math.random() > 0.1; // 90% success rate
            
            if (isSuccess) {
                handleSuccessfulSubmission();
            } else {
                handleFailedSubmission();
            }
        }
    }, 150);
}

function handleSuccessfulSubmission() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('form-status');
    
    // Reset form
    form.reset();
    
    // Remove validation classes and has-value classes
    const inputs = form.querySelectorAll('.form-control-modern');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid', 'has-value');
    });
    
    // Reset character counter
    const charCount = document.getElementById('charCount');
    if (charCount) {
        charCount.textContent = '0';
        charCount.style.color = '#6b7280';
        charCount.classList.remove('typing');
    }
    
    // Show enhanced success message
    showEnhancedSuccessMessage();
    
    // Reset button
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    // Scroll to message with smooth animation
    formStatus.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

function handleFailedSubmission() {
    const submitBtn = document.getElementById('submitBtn');
    
    showErrorMessage('There was an error sending your message. Please try again or contact me directly via email.');
    
    // Reset button
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
}

function showEnhancedSuccessMessage() {
    const formStatus = document.getElementById('form-status');
    formStatus.innerHTML = `
        <div class="alert alert-success d-flex align-items-start" role="alert">
            <div class="success-icon me-3">
                <i class="fas fa-check-circle" style="font-size: 2rem; color: #10b981;"></i>
            </div>
            <div class="flex-grow-1">
                <h5 class="alert-heading mb-2">
                    <i class="fas fa-paper-plane me-2"></i>
                    Message Sent Successfully!
                </h5>
                <p class="mb-2">Thank you for reaching out! Your message has been received and I'll get back to you within 24-48 hours.</p>
                <hr>
                <div class="next-steps">
                    <h6 class="mb-2">What's next?</h6>
                    <ul class="mb-0 ps-3">
                        <li>I'll review your message carefully</li>
                        <li>You'll receive a personalized response</li>
                        <li>Feel free to follow me on social media for updates</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// Enhanced error handling with better user feedback
function showValidationSummary() {
    const form = document.getElementById('contactForm');
    const invalidFields = form.querySelectorAll('.is-invalid');
    
    if (invalidFields.length > 0) {
        const firstInvalidField = invalidFields[0];
        firstInvalidField.focus();
        
        // Show a summary of errors
        const errorSummary = document.createElement('div');
        errorSummary.className = 'error-summary alert alert-warning';
        errorSummary.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            Please correct ${invalidFields.length} field(s) before submitting.
        `;
        
        const formStatus = document.getElementById('form-status');
        formStatus.innerHTML = '';
        formStatus.appendChild(errorSummary);
        
        // Remove summary after 5 seconds
        setTimeout(() => {
            if (errorSummary.parentNode) {
                errorSummary.remove();
            }
        }, 5000);
    }
}

// Enhanced form completion detection
function checkFormCompletion() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const fields = form.querySelectorAll('.form-control-modern, .form-check-input-modern');
    
    let completedFields = 0;
    let totalFields = fields.length;
    
    fields.forEach(field => {
        if (field.type === 'checkbox') {
            if (field.checked) completedFields++;
        } else {
            if (field.value.trim() !== '' && !field.classList.contains('is-invalid')) {
                completedFields++;
            }
        }
    });
    
    // Add pulse animation when form is nearly complete
    if (completedFields === totalFields) {
        submitBtn.classList.add('pulse');
    } else {
        submitBtn.classList.remove('pulse');
    }
}

// Add smooth scrolling for the entire page
function initializeSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeModernContactForm();
    initializeSmoothScrolling();
    
    // Add intersection observer for animations
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.contact-card-modern, .social-link-modern');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }
});

// Add ripple effect styles
const rippleStyles = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 600ms linear;
        background-color: rgba(255, 255, 255, 0.6);
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Inject ripple styles
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Enhanced Contact Information Interactions
function initializeContactInfoEnhancements() {
    initializeContactCardAnimations();
    initializeSocialLinksEffects();
    initializeProfileItemsInteraction();
    initializeContactIconAnimations();
}

// Contact Card Animations
function initializeContactCardAnimations() {
    const contactCards = document.querySelectorAll('.contact-card-modern');
    
    contactCards.forEach((card, index) => {
        // Add entrance animation delay
        card.style.animationDelay = `${(index + 1) * 0.15}s`;
        
        // Add hover sound effect (visual feedback)
        card.addEventListener('mouseenter', function() {
            this.style.setProperty('--hover-scale', '1.02');
            
            // Add subtle bounce effect to icon
            const icon = this.querySelector('.contact-icon-modern');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(8deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.setProperty('--hover-scale', '1');
            
            // Reset icon transform
            const icon = this.querySelector('.contact-icon-modern');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const link = this.querySelector('.contact-link-modern');
            if (link && !e.target.closest('.contact-link-modern')) {
                link.click();
            }
            
            // Create ripple effect
            createContactRipple(e, this);
        });
    });
}

// Social Links Enhanced Effects
function initializeSocialLinksEffects() {
    const socialLinks = document.querySelectorAll('.social-link-modern');
    
    socialLinks.forEach((link, index) => {
        // Add staggered entrance animation
        link.style.animationDelay = `${(index + 1) * 0.1}s`;
        
        // Add platform-specific hover enhancements
        const platform = link.classList[1]; // Gets the platform class (email, linkedin, etc.)
        
        link.addEventListener('mouseenter', function() {
            // Add platform-specific glow effect
            addPlatformGlow(this, platform);
            
            // Animate icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(15deg)';
            }
            
            // Animate text
            const span = this.querySelector('span');
            if (span) {
                span.style.transform = 'translateY(-2px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            // Reset transforms
            const icon = this.querySelector('i');
            const span = this.querySelector('span');
            
            if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
            if (span) span.style.transform = 'translateY(0)';
        });
        
        // Add click analytics (placeholder for actual implementation)
        link.addEventListener('click', function() {
            console.log(`Social link clicked: ${platform}`);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Profile Items Interaction
function initializeProfileItemsInteraction() {
    const profileItems = document.querySelectorAll('.profile-item');
    
    profileItems.forEach((item, index) => {
        // Add entrance animation delay
        item.style.animationDelay = `${(index + 1) * 0.1}s`;
        
        // Add copy to clipboard functionality
        item.addEventListener('click', function() {
            const idValue = this.querySelector('span').textContent.trim();
            copyToClipboard(idValue, this);
        });
        
        // Add hover effect for profile ID
        item.addEventListener('mouseenter', function() {
            const span = this.querySelector('span');
            if (span) {
                span.style.background = 'rgba(59, 130, 246, 0.1)';
                span.style.transform = 'scale(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const span = this.querySelector('span');
            if (span) {
                span.style.background = 'rgba(59, 130, 246, 0.05)';
                span.style.transform = 'scale(1)';
            }
        });
    });
}

// Contact Icon Animations
function initializeContactIconAnimations() {
    const contactIcons = document.querySelectorAll('.contact-icon-modern');
    
    contactIcons.forEach(icon => {
        // Add subtle breathing animation
        icon.style.animation = 'iconBreathe 3s ease-in-out infinite';
        
        // Add interaction feedback
        icon.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'scale(1.15) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Platform-specific glow effects
function addPlatformGlow(element, platform) {
    const glowColors = {
        'email': 'rgba(102, 126, 234, 0.3)',
        'linkedin': 'rgba(0, 119, 181, 0.3)',
        'researchgate': 'rgba(0, 212, 170, 0.3)',
        'orcid': 'rgba(166, 206, 57, 0.3)',
        'scholar': 'rgba(66, 133, 244, 0.3)',
        'youtube': 'rgba(255, 0, 0, 0.3)'
    };
    
    const glowColor = glowColors[platform] || 'rgba(59, 130, 246, 0.3)';
    element.style.boxShadow = `0 0 25px ${glowColor}, 0 20px 40px rgba(0, 0, 0, 0.1)`;
}

// Copy to clipboard with feedback
function copyToClipboard(text, element) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(element, 'Copied!');
        }).catch(() => {
            fallbackCopyToClipboard(text, element);
        });
    } else {
        fallbackCopyToClipboard(text, element);
    }
}

function fallbackCopyToClipboard(text, element) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(element, 'Copied!');
    } catch (err) {
        showCopyFeedback(element, 'Copy failed');
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback(element, message) {
    // Create feedback tooltip
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(feedback);
    
    // Show feedback
    setTimeout(() => feedback.style.opacity = '1', 10);
    
    // Hide and remove feedback
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

// Create contact ripple effect
function createContactRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.3);
        transform: scale(0);
        animation: contactRipple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Intersection Observer for contact info animations
function initializeContactInfoObserver() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger child animations
                    const cards = entry.target.querySelectorAll('.contact-card-modern');
                    const socialLinks = entry.target.querySelectorAll('.social-link-modern');
                    const profileItems = entry.target.querySelectorAll('.profile-item');
                    
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 150);
                    });
                    
                    socialLinks.forEach((link, index) => {
                        setTimeout(() => {
                            link.classList.add('visible');
                        }, index * 100);
                    });
                    
                    profileItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 80);
                    });
                }
            });
        }, { threshold: 0.1 });
        
        const contactInfoSection = document.querySelector('.contact-info-modern');
        if (contactInfoSection) {
            observer.observe(contactInfoSection);
        }
    }
}

// Enhanced accessibility features
function initializeContactAccessibility() {
    // Add keyboard navigation for contact cards
    const contactCards = document.querySelectorAll('.contact-card-modern');
    contactCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('.contact-link-modern');
                if (link) link.click();
            }
        });
    });
    
    // Add keyboard navigation for social links
    const socialLinks = document.querySelectorAll('.social-link-modern');
    socialLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add keyboard navigation for profile items
    const profileItems = document.querySelectorAll('.profile-item');
    profileItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Click to copy profile ID');
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Add CSS animations for contact enhancements
const contactEnhancementStyles = `
    @keyframes iconBreathe {
        0%, 100% { 
            transform: scale(1);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }
        50% { 
            transform: scale(1.05);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }
    }
    
    @keyframes contactRipple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .contact-card-modern.visible {
        animation-play-state: running;
    }
    
    .social-link-modern.visible {
        animation-play-state: running;
    }
    
    .profile-item.visible {
        animation-play-state: running;
    }
    
    /* Enhanced focus states */
    .contact-card-modern:focus,
    .profile-item:focus {
        outline: 3px solid var(--secondary-color);
        outline-offset: 2px;
        box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2);
    }
    
    /* Touch feedback for mobile */
    @media (hover: none) and (pointer: coarse) {
        .contact-card-modern:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
        }
        
        .social-link-modern:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
        }
        
        .profile-item:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
        }
    }
`;

// Inject contact enhancement styles
const contactStyleSheet = document.createElement('style');
contactStyleSheet.textContent = contactEnhancementStyles;
document.head.appendChild(contactStyleSheet);

// Initialize contact enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeContactInfoEnhancements();
    initializeContactInfoObserver();
    initializeContactAccessibility();
});
