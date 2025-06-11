/**
 * Enhanced Project Pages JavaScript
 * Provides modern interactions, animations, and accessibility features
 */

// Project Page Enhancement Class
class ProjectPageEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.initializeOnLoad();
        this.setupScrollAnimations();
        this.setupVideoEnhancements();
        this.setupCardInteractions();
        this.setupNavigationEnhancements();
        this.setupAccessibilityFeatures();
        this.setupProgressIndicator();
    }

    // Initialize when DOM is loaded
    initializeOnLoad() {
        document.addEventListener('DOMContentLoaded', () => {
            this.enhanceProjectCards();
            this.addLazyLoading();
            this.setupKeyboardNavigation();
            this.initializeTooltips();
        });
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const animatedElements = document.querySelectorAll(`
            .project-card-enhanced,
            .feature-item-enhanced,
            .result-item,
            .video-section-enhanced
        `);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // Enhanced video interactions
    setupVideoEnhancements() {
        const videoContainers = document.querySelectorAll('.video-container-enhanced');
        
        videoContainers.forEach(container => {
            const iframe = container.querySelector('iframe');
            
            if (iframe) {
                // Add loading indicator
                this.addVideoLoadingIndicator(container);
                
                // Add fullscreen capability
                this.addFullscreenToggle(container);
                
                // Add play/pause detection
                this.setupVideoPlaybackDetection(iframe);
            }
        });
    }

    addVideoLoadingIndicator(container) {
        const loader = document.createElement('div');
        loader.className = 'video-loader';
        loader.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading video...</span>
            </div>
        `;
        
        container.appendChild(loader);
        
        const iframe = container.querySelector('iframe');
        iframe.addEventListener('load', () => {
            loader.remove();
        });
    }

    addFullscreenToggle(container) {
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'video-fullscreen-btn';
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        fullscreenBtn.setAttribute('aria-label', 'Toggle fullscreen');
        
        fullscreenBtn.addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                container.requestFullscreen().catch(err => {
                    console.log('Fullscreen not supported:', err);
                });
            }
        });
        
        container.appendChild(fullscreenBtn);
    }

    setupVideoPlaybackDetection(iframe) {
        // This would require additional setup with YouTube API for full functionality
        // For now, we'll add basic interaction tracking
        iframe.addEventListener('click', () => {
            this.trackInteraction('video_interaction', {
                type: 'click',
                src: iframe.src
            });
        });
    }

    // Enhanced card interactions
    setupCardInteractions() {
        const cards = document.querySelectorAll('.project-card-enhanced, .feature-item-enhanced, .result-item');
        
        cards.forEach(card => {
            // Add ripple effect
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e, card);
            });
            
            // Add hover sound feedback (visual)
            card.addEventListener('mouseenter', () => {
                this.addHoverFeedback(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeHoverFeedback(card);
            });
        });
    }

    createRippleEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 600ms linear;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addHoverFeedback(element) {
        element.style.setProperty('--hover-intensity', '1.05');
        
        // Add subtle glow effect
        const glowElement = document.createElement('div');
        glowElement.className = 'hover-glow';
        glowElement.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2));
            border-radius: inherit;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(glowElement);
        
        requestAnimationFrame(() => {
            glowElement.style.opacity = '1';
        });
    }

    removeHoverFeedback(element) {
        element.style.setProperty('--hover-intensity', '1');
        
        const glowElement = element.querySelector('.hover-glow');
        if (glowElement) {
            glowElement.style.opacity = '0';
            setTimeout(() => {
                glowElement.remove();
            }, 300);
        }
    }

    // Navigation enhancements
    setupNavigationEnhancements() {
        const backButton = document.querySelector('.project-nav-back');
        
        if (backButton) {
            // Add smooth scroll to top when navigating back
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Smooth scroll to top first
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Then navigate after a brief delay
                setTimeout(() => {
                    window.location.href = backButton.href;
                }, 300);
            });
        }
        
        // Add breadcrumb functionality
        this.createBreadcrumbTrail();
    }

    createBreadcrumbTrail() {
        const breadcrumbContainer = document.querySelector('.project-nav-enhanced');
        if (!breadcrumbContainer) return;
        
        const currentPage = document.title;
        const breadcrumb = document.createElement('nav');
        breadcrumb.setAttribute('aria-label', 'Breadcrumb');
        breadcrumb.className = 'project-breadcrumb';
        breadcrumb.innerHTML = `
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                    <a href="../index.html" class="text-decoration-none">
                        <i class="fas fa-home me-1"></i>Home
                    </a>
                </li>
                <li class="breadcrumb-item">
                    <a href="../projects.html" class="text-decoration-none">Projects</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                    ${currentPage.split(' - ')[1] || 'Current Project'}
                </li>
            </ol>
        `;
        
        // Insert breadcrumb if not already present
        if (!breadcrumbContainer.querySelector('.project-breadcrumb')) {
            breadcrumbContainer.appendChild(breadcrumb);
        }
    }

    // Accessibility features
    setupAccessibilityFeatures() {
        // Add skip links
        this.addSkipLinks();
        
        // Enhance focus management
        this.enhanceFocusManagement();
        
        // Add ARIA live regions for dynamic content
        this.setupLiveRegions();
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#project-navigation" class="skip-link">Skip to project navigation</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    enhanceFocusManagement() {
        // Ensure focus is visible and logical
        const focusableElements = document.querySelectorAll(`
            a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
        `);
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focus-visible');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('focus-visible');
            });
        });
    }

    setupLiveRegions() {
        // Create live region for dynamic content announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        
        document.body.appendChild(liveRegion);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + B = Back to projects
            if (e.altKey && e.key === 'b') {
                e.preventDefault();
                const backButton = document.querySelector('.project-nav-back');
                if (backButton) {
                    backButton.click();
                }
            }
            
            // Alt + T = Back to top
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for project elements
        const navigationElements = document.querySelectorAll('.feature-item-enhanced, .result-item');
        
        navigationElements.forEach((element, index) => {
            element.setAttribute('tabindex', '0');
            element.setAttribute('role', 'article');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextElement = navigationElements[index + 1];
                    if (nextElement) {
                        nextElement.focus();
                    }
                }
                
                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevElement = navigationElements[index - 1];
                    if (prevElement) {
                        prevElement.focus();
                    }
                }
            });
        });
    }

    // Progress indicator
    setupProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            const progressBarFill = document.querySelector('.reading-progress-bar');
            if (progressBarFill) {
                progressBarFill.style.width = scrolled + '%';
            }
        });
    }

    // Enhanced project cards
    enhanceProjectCards() {
        const cards = document.querySelectorAll('.project-card-enhanced');
        
        cards.forEach(card => {
            // Add loading skeleton while content loads
            this.addCardLoadingSkeleton(card);
            
            // Add print-friendly styles
            this.makeCardPrintFriendly(card);
            
            // Add share functionality
            this.addShareFunctionality(card);
        });
    }

    addCardLoadingSkeleton(card) {
        // This would be useful for dynamically loaded content
        card.classList.add('content-loaded');
    }

    makeCardPrintFriendly(card) {
        card.classList.add('print-friendly');
    }

    addShareFunctionality(card) {
        if (navigator.share) {
            const shareButton = document.createElement('button');
            shareButton.className = 'btn btn-outline-secondary btn-sm share-btn';
            shareButton.innerHTML = '<i class="fas fa-share-alt me-1"></i>Share';
            shareButton.addEventListener('click', () => {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                });
            });
            
            const cardHeader = card.querySelector('.project-card-header');
            if (cardHeader) {
                cardHeader.appendChild(shareButton);
            }
        }
    }

    // Lazy loading for images and videos
    addLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src], iframe[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Initialize tooltips
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        if (tooltipElements.length > 0 && window.bootstrap) {
            tooltipElements.forEach(element => {
                new bootstrap.Tooltip(element);
            });
        }
    }

    // Analytics tracking
    trackInteraction(action, data = {}) {
        // This would integrate with your analytics service
        if (window.gtag) {
            window.gtag('event', action, {
                'custom_parameter': data,
                'page_title': document.title,
                'page_location': window.location.href
            });
        }
        
        console.log('Interaction tracked:', action, data);
    }

    // Utility method to announce to screen readers
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
}

// Additional CSS for JavaScript-enhanced features
const enhancedStyles = `
    .skip-links {
        position: absolute;
        top: -100px;
        left: 0;
        z-index: 9999;
    }
    
    .skip-link {
        position: absolute;
        top: 0;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        text-decoration: none;
        border-radius: 0 0 0.5rem 0;
        transition: top 0.3s ease;
    }
    
    .skip-link:focus {
        top: 100px;
        color: white;
    }
    
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        z-index: 9999;
        background: rgba(59, 130, 246, 0.1);
    }
    
    .reading-progress-bar {
        height: 100%;
        background: var(--gradient-primary);
        width: 0%;
        transition: width 0.1s ease;
    }
    
    .video-fullscreen-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 100;
    }
    
    .video-fullscreen-btn:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
    }
    
    .video-loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
    }
    
    .focus-visible {
        outline: 3px solid var(--secondary-color) !important;
        outline-offset: 2px !important;
    }
    
    .share-btn {
        margin-left: auto;
    }
    
    .project-breadcrumb {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(59, 130, 246, 0.1);
    }
    
    .breadcrumb {
        background: none;
        padding: 0;
        margin: 0;
        font-size: 0.9rem;
    }
    
    .breadcrumb-item + .breadcrumb-item::before {
        color: var(--text-medium);
        content: "→";
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @media print {
        .print-friendly {
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .reading-progress,
        .video-fullscreen-btn,
        .share-btn {
            display: none !important;
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .reading-progress-bar,
        .animate-in {
            animation: none !important;
            transition: none !important;
        }
    }
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);

// Initialize the enhanced project page
const projectEnhancer = new ProjectPageEnhancer();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectPageEnhancer;
}
