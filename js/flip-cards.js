// Flip Cards Touch Support for Mobile Devices
// Handles touch interactions for flip cards on mobile devices

// Detect low-end device for performance optimizations
function detectLowEndDevice() {
    // Check for specific device patterns and performance indicators
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const deviceMemory = navigator.deviceMemory || 2;
    
    // Samsung Galaxy A series and other budget devices
    const isBudgetDevice = userAgent.includes('sm-a') || // Samsung A series
                          userAgent.includes('sm-j') || // Samsung J series
                          userAgent.includes('sm-g532') || // Samsung Grand Prime
                          userAgent.includes('redmi') || // Xiaomi Redmi
                          deviceMemory <= 2 || // 2GB RAM or less
                          hardwareConcurrency <= 2; // 2 cores or less
    
    // Additional checks for low-end characteristics
    const screenWidth = window.screen.width;
    const isLowResolution = screenWidth <= 720;
    
    return isAndroid && (isBudgetDevice || isLowResolution);
}

// Initialize flip cards for mobile touch support
function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    // Detect device performance level for optimizations
    const isLowEndDevice = detectLowEndDevice();
    
    flipCards.forEach(card => {
        let isFlipped = false;
        let touchStartTime = 0;
        let touchStartY = 0;
        let touchStartX = 0;
        let isTouchDevice = false;
        let touchMoved = false;
        
        // Detect if device supports touch
        function isTouchDeviceCheck() {
            return (
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0 ||
                window.matchMedia('(hover: none)').matches ||
                window.matchMedia('(pointer: coarse)').matches
            );
        }
        
        isTouchDevice = isTouchDeviceCheck();
        
        // Optimize for low-end devices
        if (isLowEndDevice) {
            card.style.willChange = 'auto'; // Reduce memory usage
        }
        
        // Handle touch start - improved for faster response
        card.addEventListener('touchstart', function(e) {
            touchStartTime = performance.now(); // More precise timing
            const touch = e.touches[0];
            touchStartY = touch.clientY;
            touchStartX = touch.clientX;
            touchMoved = false;
            
            // Add immediate visual feedback for low-end devices
            if (isLowEndDevice && !isFlipped) {
                this.style.transform = 'scale(0.98)';
            }
        }, { passive: true });
        
        // Handle touch move to detect scrolling
        card.addEventListener('touchmove', function(e) {
            const touch = e.touches[0];
            const deltaY = Math.abs(touch.clientY - touchStartY);
            const deltaX = Math.abs(touch.clientX - touchStartX);
            
            // Mark as moved if user is scrolling
            if (deltaY > 8 || deltaX > 8) {
                touchMoved = true;
                // Reset visual feedback
                if (isLowEndDevice) {
                    this.style.transform = '';
                }
            }
        }, { passive: true });
        
        // Handle touch end for mobile devices - optimized for speed
        card.addEventListener('touchend', function(e) {
            const touchDuration = performance.now() - touchStartTime;
            
            // Reset visual feedback
            if (isLowEndDevice) {
                this.style.transform = '';
            }
            
            // Check if it's a quick tap and user didn't scroll
            const maxDuration = isLowEndDevice ? 200 : 250; // Faster for low-end devices
            
            if (touchDuration < maxDuration && isTouchDevice && !touchMoved) {
                // Don't interfere with link clicks in flipped state
                const clickedElement = e.target;
                if (isFlipped && (clickedElement.tagName === 'A' || clickedElement.closest('a'))) {
                    return; // Let the link handle the click
                }
                
                e.preventDefault();
                e.stopPropagation();
                
                // Use immediate flip for low-end devices, requestAnimationFrame for others
                const flipAction = () => {
                    isFlipped = !isFlipped;
                    
                    if (isFlipped) {
                        this.classList.add('flipped');
                    } else {
                        this.classList.remove('flipped');
                    }
                };
                
                if (isLowEndDevice) {
                    flipAction(); // Immediate execution
                } else {
                    requestAnimationFrame(flipAction); // Smooth animation
                }
                
                // Optional: Add haptic feedback if available (reduced for low-end)
                if (navigator.vibrate && !isLowEndDevice) {
                    navigator.vibrate(20);
                }
            }
        }, { passive: false });        
        // Improved click handler for better performance and link support
        card.addEventListener('click', function(e) {
            // Only handle click if not a touch device
            if (!isTouchDevice) {
                return; // Let CSS hover handle desktop
            }
            
            // For touch devices, ensure links work properly when card is flipped
            const clickedElement = e.target;
            if (isFlipped && (clickedElement.tagName === 'A' || clickedElement.closest('a'))) {
                // Allow link to work normally - don't prevent default
                return;
            }
        }, { passive: true });
        
        // For desktop, remove the flipped class when mouse leaves
        card.addEventListener('mouseleave', function() {
            if (!isTouchDevice) {
                this.classList.remove('flipped');
                isFlipped = false;
            }
        });
        
        // Improve link clicking in flipped state
        const backSideLinks = card.querySelectorAll('.flip-card-back a');
        backSideLinks.forEach(link => {
            // Ensure links work with a separate event handler
            link.addEventListener('touchstart', function(e) {
                e.stopPropagation(); // Prevent card flip
            }, { passive: true });
            
            link.addEventListener('click', function(e) {
                if (isFlipped) {
                    e.stopPropagation(); // Prevent card flip
                    // Let the link work normally
                }
            }, { passive: true });
        });
    });
    
    // Handle orientation changes on mobile with debouncing
    let orientationTimeout;
    window.addEventListener('orientationchange', function() {
        clearTimeout(orientationTimeout);
        orientationTimeout = setTimeout(() => {
            // Reset flip state on orientation change to prevent stuck cards
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(flipCard => {
                flipCard.classList.remove('flipped');
            });
        }, 100);
    });
    
    // Handle resize events with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset flip state on significant resize to prevent layout issues
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(flipCard => {
                flipCard.classList.remove('flipped');
            });
        }, 150);
    });
}

// Apply device-specific optimizations after DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Detect and apply optimizations for very low-end devices
    if (detectLowEndDevice()) {
        // Add a class to body for CSS targeting
        document.body.classList.add('low-end-device');
        
        // Disable will-change on all flip cards to save memory
        const flipCards = document.querySelectorAll('.flip-card');
        flipCards.forEach(card => {
            card.style.willChange = 'auto';
            const inner = card.querySelector('.flip-card-inner');
            if (inner) {
                inner.style.willChange = 'auto';
            }
        });
    }
    
    // Initialize the main functionality
    initializeFlipCards();
});
