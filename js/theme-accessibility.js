/**
 * Theme Toggle and Accessibility Manager
 * Handles dark/light mode switching and accessibility features
 */

class ThemeManager {    constructor() {
        // Default to light theme since toggle is removed
        this.currentTheme = 'light';
        this.init();
    }init() {
        // Theme toggle removed - no longer creating theme toggle button
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.initAccessibilityFeatures();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getPreferredTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }    applyTheme(theme) {
        // Force light theme since dark toggle is removed
        const forcedTheme = 'light';
        document.documentElement.setAttribute('data-theme', forcedTheme);
        this.currentTheme = forcedTheme;
        
        // No longer storing theme preference since toggle is removed
        // localStorage.setItem('theme', forcedTheme);
        
        // Announce theme to screen readers
        this.announceToScreenReader(`Theme set to ${forcedTheme} mode`);
    }// Theme toggle button creation removed - no longer needed
    /*
    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark/light mode');
        toggle.setAttribute('title', 'Toggle theme');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
        
        document.body.appendChild(toggle);
        this.themeToggle = toggle;
    }
    */    // Theme toggle icon update removed - no longer needed
    /*
    updateThemeToggleIcon() {
        const icon = this.themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-moon';
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-sun';
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    */    // Theme toggle functionality removed - no longer needed
    /*
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }
    */    setupEventListeners() {
        // Theme toggle event listeners removed - no longer needed
        // System theme change listener removed - sticking to light mode
        
        // Handle reduced motion preference
        this.handleReducedMotion();
    }

    initAccessibilityFeatures() {
        this.createAriaLiveRegion();
        this.enhanceKeyboardNavigation();
        this.setupFocusManagement();
        this.initImageLazyLoading();
        this.setupIntersectionObserver();
    }

    createAriaLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'aria-live-polite sr-only';
        liveRegion.id = 'aria-live-region';
        document.body.appendChild(liveRegion);
        this.ariaLiveRegion = liveRegion;
    }

    announceToScreenReader(message) {
        if (this.ariaLiveRegion) {
            this.ariaLiveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                this.ariaLiveRegion.textContent = '';
            }, 1000);
        }
    }

    enhanceKeyboardNavigation() {
        // Add keyboard support for dropdown menus
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dropdown.click();
                }
            });
        });

        // Skip link functionality
        const skipLink = document.querySelector('.skip-nav');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector('#main-content');
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    setupFocusManagement() {
        // Enhanced focus indicator
        let focusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            focusedElement = e.target;
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Trap focus in modals when opened
        this.setupModalFocusTrap();
    }

    setupModalFocusTrap() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('shown.bs.modal', () => {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            });
        });
    }

    initImageLazyLoading() {
        // Enhanced lazy loading with intersection observer
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.classList.add('loaded');
            });
        }
    }

    setupIntersectionObserver() {
        // Animate elements when they come into view
        const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => observer.observe(el));
        } else {
            // Fallback: make all elements visible immediately
            animatedElements.forEach(el => el.classList.add('visible'));
        }
    }

    handleReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
                // Disable animations
                document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
                    el.classList.add('visible');
                });
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        mediaQuery.addEventListener('change', handleReducedMotion);
        handleReducedMotion(mediaQuery);
    }
}

/**
 * Performance Monitor
 * Monitors and optimizes performance
 */
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.preloadCriticalResources();
        this.optimizeImages();
        this.setupServiceWorker();
        this.monitorWebVitals();
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    optimizeImages() {
        // Convert images to WebP format where supported
        if (this.supportsWebP()) {
            this.convertImagesToWebP();
        }

        // Implement progressive image loading
        this.setupProgressiveLoading();
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    }

    convertImagesToWebP() {
        const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]');
        
        images.forEach(img => {
            const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/, '.webp');
            
            // Check if WebP version exists
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
            };
            testImg.onerror = () => {
                // Keep original if WebP doesn't exist
                console.log(`WebP version not found for: ${img.src}`);
            };
            testImg.src = webpSrc;
        });
    }    setupProgressiveLoading() {
        // Implement progressive loading without blur effect
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            const placeholder = this.createPlaceholder(img);
            
            if (placeholder) {
                // img.style.filter = 'blur(5px)'; // Blur effect removed
                img.style.opacity = '0.7'; // Use opacity instead of blur
                img.addEventListener('load', () => {
                    img.style.filter = 'none'; // Ensure no filter remains
                    img.style.opacity = '1'; // Restore full opacity
                    img.style.transition = 'opacity 0.3s ease';
                });
            }
        });
    }    createPlaceholder(img) {
        // Create a placeholder (no longer blurred)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 10;
        canvas.height = 10;
        
        // This would typically be a very small version of the image
        return canvas.toDataURL();
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered successfully');
                })
                .catch(error => {
                    console.log('SW registration failed');
                });
        }
    }

    monitorWebVitals() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            this.observeLCP();
            this.observeFID();
            this.observeCLS();
        }
    }

    observeLCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    observeFID() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
    }

    observeCLS() {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    console.log('CLS:', clsValue);
                }
            });
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new PerformanceMonitor();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, PerformanceMonitor };
}
