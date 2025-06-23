// Blog Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Blog category filtering
    const categoryButtons = document.querySelectorAll('[data-category]');
    const blogPosts = document.querySelectorAll('#blog-posts .col-lg-4');
    const loadMoreBtn = document.getElementById('load-more-btn');

    // Category filtering functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            filterPosts(category);
        });
    });

    function filterPosts(category) {
        blogPosts.forEach(post => {
            const postCategory = post.getAttribute('data-category');
            
            if (category === 'all' || postCategory === category) {
                post.style.display = 'block';
                // Add fade-in animation
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, 50);
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Load more functionality (placeholder)
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // This would typically load more posts via AJAX
            // For now, we'll just show a message
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check me-2"></i>All posts loaded';
                this.disabled = true;
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
            }, 1500);
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (emailInput.value && emailInput.checkValidity()) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Subscribing...';
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Subscribed!';
                    submitBtn.classList.remove('btn-light');
                    submitBtn.classList.add('btn-success');
                    emailInput.value = '';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Subscribe';
                        submitBtn.classList.remove('btn-success');
                        submitBtn.classList.add('btn-light');
                    }, 3000);
                }, 1500);
            }
        });
    }

    // Blog card hover effects
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    // Search functionality (placeholder for future implementation)
    function addSearchFunctionality() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'col-lg-12 mb-4';
        searchContainer.innerHTML = `
            <div class="search-box">
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="fas fa-search"></i>
                    </span>
                    <input type="text" class="form-control" placeholder="Search blog posts..." id="blog-search">
                </div>
            </div>
        `;
        
        // You can uncomment this to add search functionality
        // const blogSection = document.querySelector('#blog-posts').parentNode;
        // blogSection.insertBefore(searchContainer, document.querySelector('#blog-posts'));
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe blog cards for scroll animations
    blogCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Function to format dates (utility)
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to calculate reading time (utility)
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
}
