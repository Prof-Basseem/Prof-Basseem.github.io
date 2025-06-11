// Modern JavaScript for Dr. Mahmoud Basseem Academic Website

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize modern navbar functionality
    initializeModernNavbar();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize research paper downloads
    initializePaperDownloads();
    
    // Initialize performance optimizations
    initializePerformanceOptimizations();
    
    // Add new initializations
    initializeScrollProgress();
    initializeParallax();
    initializeButtonEffects();
    initializeImageLoading();    initializeAdvancedAnimations();
    initializeAllEnhancements();
});

// Modern Navbar functionality
function initializeModernNavbar() {
    const navbar = document.querySelector('.navbar-modern');
    
    // Navbar scroll effect
    function handleNavbarScroll() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    // Throttled scroll listener for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                handleNavbarScroll();
                scrollTimeout = null;
            }, 10);
        }
    });
    
    // Highlight active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    
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
        // Close on navigation link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
        
        // Close on dropdown item click
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (navbarCollapse.classList.contains('show') && 
                !navbarCollapse.contains(e.target) && 
                !navbarToggler.contains(e.target)) {
                navbarToggler.click();
            }
        });
    }
}

// Scroll effects for modern animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.modern-card, .stat-card-modern, .feature-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Preload critical images
    const criticalImages = [
        'assets/img/dr-mahmoud.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Lazy load non-critical images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (input.value.trim() !== '') {
                    validateField(input);
                }
            });
            
            input.addEventListener('input', function() {
                if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
                    validateField(input);
                }
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check if field is required and empty
    if (required && !value) {
        field.classList.add('is-invalid');
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            showFieldError(field, 'Please enter a valid email address.');
            return false;
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            field.classList.add('is-invalid');
            showFieldError(field, 'Please enter a valid phone number.');
            return false;
        }
    }
    
    // If we get here, the field is valid
    if (value) {
        field.classList.add('is-valid');
        hideFieldError(field);
        return true;
    }
    
    return true;
}

function showFieldError(field, message) {
    hideFieldError(field); // Remove existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

// Smooth scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animations
function initializeAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .fade-in {
            animation: fadeIn 0.8s ease-in;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Research paper downloads
function initializePaperDownloads() {
    const downloadLinks = document.querySelectorAll('.download-paper');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const button = this;
            const originalText = button.innerHTML;
            
            // Show loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Downloading...';
            button.disabled = true;
            
            // Simulate download delay (remove in production)
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check me-2"></i>Downloaded!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }, 1000);
        });
    });
}

// Scroll Progress Indicator
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (progressBar) {
        const updateProgress = throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        }, 10);
        
        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initialize
    }
}

// Parallax Effects
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length > 0) {
        const handleParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16);
        
        window.addEventListener('scroll', handleParallax);
    }
}

// Enhanced Button Interactions
function initializeButtonEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.classList.add('btn-ripple');
        
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add magnetic effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary-modern, .btn-cv-download');
    
    ctaButtons.forEach(button => {
        button.classList.add('btn-magnetic');
        
        button.addEventListener('mouseenter', function() {
            this.classList.add('pulse-cta');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('pulse-cta');
        });
    });
}

// Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast-modern toast-${type}`;
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getToastIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto-hide
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // Close button
    toast.querySelector('.btn-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function getToastIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || icons.info;
}

// Enhanced Image Loading
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('fade-in');
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            console.warn('Failed to load image:', this.src);
        });
    });
}

// Intersection Observer for Advanced Animations
function initializeAdvancedAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fade-in';
                
                element.classList.add(animationType);
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements with data-animation attribute
    document.querySelectorAll('[data-animation]').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced Interactive Elements and Micro-interactions

// Initialize enhanced hover effects
function initializeEnhancedHoverEffects() {
    // Card magnetic effect
    const magneticCards = document.querySelectorAll('.custom-card, .publication-card, .project-card');
    
    magneticCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle magnetic effect
            const moveX = x * 0.05;
            const moveY = y * 0.05;
            
            card.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${-moveY * 0.1}deg) rotateY(${moveX * 0.1}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Initialize enhanced button interactions
function initializeAdvancedButtonEffects() {
    // Ripple effect for buttons
    const buttons = document.querySelectorAll('.btn, .nav-link, .dropdown-item');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize enhanced scroll-triggered counters
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = prefix + Math.floor(current) + suffix;
        }, 16);
    }
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Initialize enhanced typing animation
function initializeTypingAnimation() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.dataset.typing;
        const speed = parseInt(element.dataset.typingSpeed) || 100;
        const delay = parseInt(element.dataset.typingDelay) || 0;
        
        setTimeout(() => {
            element.textContent = '';
            let i = 0;
            
            function typeWriter() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                }
            }
            
            typeWriter();
        }, delay);
    });
}

// Initialize enhanced scroll spy navigation
function initializeEnhancedScrollSpy() {
    const sections = document.querySelectorAll('section[id], main section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    
    function updateActiveNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation(); // Initial call
}

// Initialize enhanced image lazy loading with blur effect
function initializeEnhancedImageLoading() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    // Add blur effect for loading images
    images.forEach(img => {
        if (!img.complete) {
            img.style.filter = 'blur(10px)';
            img.style.transition = 'filter 0.5s ease';
            
            img.addEventListener('load', () => {
                img.style.filter = 'none';
            });
        }
    });
    
    // Enhanced intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize enhanced loading states
function initializeLoadingStates() {
    // Add loading skeleton for slow-loading content
    const contentSections = document.querySelectorAll('.custom-card, .publication-card');
    
    contentSections.forEach(section => {
        // Add subtle loading animation on page load
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, Math.random() * 300 + 100);
    });
}

// Initialize enhanced form interactions
function initializeEnhancedForms() {
    const formGroups = document.querySelectorAll('.form-group, .form-floating');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Enhanced focus states
            input.addEventListener('focus', () => {
                group.classList.add('focused');
                label.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    group.classList.remove('focused');
                    label.classList.remove('focused');
                } else {
                    group.classList.add('has-value');
                }
            });
            
            // Real-time validation feedback
            input.addEventListener('input', () => {
                if (input.validity.valid) {
                    group.classList.remove('invalid');
                    group.classList.add('valid');
                } else {
                    group.classList.remove('valid');
                    group.classList.add('invalid');
                }
            });
        }
    });
}

// Initialize enhanced dropdown interactions
function initializeEnhancedDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Enhanced hover effect with delay
            let hoverTimeout;
            
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    menu.classList.add('show');
                    toggle.setAttribute('aria-expanded', 'true');
                }, 150);
            });
            
            dropdown.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    menu.classList.remove('show');
                    toggle.setAttribute('aria-expanded', 'false');
                }, 300);
            });
        }
    });
}

// Initialize enhanced scroll animations with stagger
function initializeStaggeredAnimations() {
    const animationGroups = document.querySelectorAll('[data-stagger]');
    
    animationGroups.forEach(group => {
        const children = group.children;
        const staggerDelay = parseInt(group.dataset.stagger) || 100;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * staggerDelay);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(group);
    });
}

// Initialize parallax effects for modern devices
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * rate);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Use requestAnimationFrame for smooth parallax
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Initialize all enhanced interactions
function initializeAllEnhancements() {
    initializeEnhancedHoverEffects();
    initializeAdvancedButtonEffects();
    initializeCounterAnimations();
    initializeTypingAnimation();
    initializeEnhancedScrollSpy();
    initializeEnhancedImageLoading();
    initializeLoadingStates();
    initializeEnhancedForms();
    initializeEnhancedDropdowns();
    initializeStaggeredAnimations();
    initializeParallaxEffects();
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other scripts
window.academicWebsite = {
    initializeModernNavbar,
    initializeScrollEffects,
    initializeFormValidation,
    initializeSmoothScrolling,
    initializeAnimations,
    initializePaperDownloads,
    initializePerformanceOptimizations,
    initializeScrollProgress,
    initializeParallax,
    initializeButtonEffects,
    initializeImageLoading,
    initializeAdvancedAnimations,
    debounce,
    throttle,
    showToast
};
