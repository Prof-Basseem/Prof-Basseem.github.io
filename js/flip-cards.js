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
        
        // Add touch event support for mobile devices
        card.addEventListener('touchstart', function(e) {
            // Prevent scrolling when touching the card on mobile
            if (window.matchMedia('(hover: none)').matches) {
                e.preventDefault();
            }
        });
        
        card.addEventListener('click', function(e) {
            // Only handle click on touch devices or when hover is not supported
            if (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches) {
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
        
        // For desktop, remove the flipped class when mouse leaves
        card.addEventListener('mouseleave', function() {
            if (window.matchMedia('(hover: hover)').matches && window.matchMedia('(pointer: fine)').matches) {
                this.classList.remove('flipped');
                isFlipped = false;
            }
        });
        
        // Handle touch end to provide better mobile experience
        card.addEventListener('touchend', function(e) {
            if (window.matchMedia('(hover: none)').matches) {
                e.preventDefault();
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
