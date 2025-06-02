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
            // Don't prevent default - let the browser handle it naturally
        }, { passive: true });
        
        // Handle touch end for mobile devices
        card.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            
            // Only proceed if it's a quick tap (not a scroll or long press)
            if (touchDuration < 500 && isTouchDevice) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle flip state
                isFlipped = !isFlipped;
                
                if (isFlipped) {
                    this.classList.add('flipped');
                } else {
                    this.classList.remove('flipped');
                }
                
                // Optional: Add haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        });
        
        // Handle click for desktop or as fallback
        card.addEventListener('click', function(e) {
            // Only handle click if not a touch device or if touch events failed
            if (!isTouchDevice) {
                // For desktop with mouse, do nothing - let CSS hover handle it
                return;
            }
            
            // Fallback for touch devices where touchend didn't work
            const timeSinceTouch = Date.now() - touchStartTime;
            if (timeSinceTouch > 500) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle flip state
                isFlipped = !isFlipped;
                
                if (isFlipped) {
                    this.classList.add('flipped');
                } else {
                    this.classList.remove('flipped');
                }
            }
        });
        
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
