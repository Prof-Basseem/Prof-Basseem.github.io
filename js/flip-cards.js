// Flip Cards Touch Support for Mobile Devices
// Handles touch interactions for flip cards on mobile devices

document.addEventListener('DOMContentLoaded', function() {
    initializeFlipCards();
});

// Initialize flip cards for mobile touch support
function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        let isFlipped = false;
        let touchStartTime = 0;
        let touchStartY = 0;
        let touchStartX = 0;
        let isTouchDevice = false;
        
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
        
        // Handle touch start
        card.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            const touch = e.touches[0];
            touchStartY = touch.clientY;
            touchStartX = touch.clientX;
        }, { passive: true });
        
        // Handle touch end for mobile devices - optimized for speed
        card.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            
            // Check if it's a quick tap and not a scroll gesture
            if (touchDuration < 300 && isTouchDevice) { // Reduced from 500ms to 300ms
                const touch = e.changedTouches[0];
                const deltaY = Math.abs(touch.clientY - touchStartY);
                const deltaX = Math.abs(touch.clientX - touchStartX);
                
                // Only flip if it's a tap, not a scroll (movement < 10px)
                if (deltaY < 10 && deltaX < 10) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Use requestAnimationFrame for smoother animation
                    requestAnimationFrame(() => {
                        // Toggle flip state
                        isFlipped = !isFlipped;
                        
                        if (isFlipped) {
                            this.classList.add('flipped');
                        } else {
                            this.classList.remove('flipped');
                        }
                    });
                    
                    // Optional: Add haptic feedback if available
                    if (navigator.vibrate) {
                        navigator.vibrate(30); // Reduced vibration duration
                    }
                }
            }
        }, { passive: false });
        
        // Simplified click handler for better performance
        card.addEventListener('click', function(e) {
            // Only handle click if not a touch device
            if (!isTouchDevice) {
                return; // Let CSS hover handle desktop
            }
        }, { passive: true });
        
        // For desktop, remove the flipped class when mouse leaves
        card.addEventListener('mouseleave', function() {
            if (!isTouchDevice) {
                this.classList.remove('flipped');
                isFlipped = false;
            }
        });
    });
    
    // Handle orientation changes on mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Reset flip state on orientation change to prevent stuck cards
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(flipCard => {
                flipCard.classList.remove('flipped');
            });
        }, 100);
    });
    
    // Handle resize events
    window.addEventListener('resize', function() {
        // Reset flip state on significant resize to prevent layout issues
        setTimeout(() => {
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(flipCard => {
                flipCard.classList.remove('flipped');
            });
        }, 150);
    });
}
