/**
 * Enhanced Image Loader for Google Drive Images
 * Provides robust fallback mechanisms for loading images from Google Drive
 */

class EnhancedImageLoader {
    constructor() {
        this.cache = new Map();
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    // Extract Google Drive file ID from various URL formats
    extractGoogleDriveFileId(shareUrl) {
        if (!shareUrl || !shareUrl.includes('drive.google.com')) {
            return null;
        }
        
        const patterns = [
            /\/file\/d\/([a-zA-Z0-9_-]+)/,  // /file/d/FILE_ID
            /open\?id=([a-zA-Z0-9_-]+)/,   // open?id=FILE_ID
            /id=([a-zA-Z0-9_-]+)/,         // id=FILE_ID
            /\/d\/([a-zA-Z0-9_-]+)/        // /d/FILE_ID
        ];
        
        for (const pattern of patterns) {
            const match = shareUrl.match(pattern);
            if (match) {
                return match[1];
            }
        }
        
        return null;
    }

    // Generate multiple Google Drive URL formats for fallback
    getGoogleDriveUrls(fileId) {
        if (!fileId) return [];
        
        return [
            `https://drive.google.com/uc?export=view&id=${fileId}`,
            `https://drive.google.com/uc?id=${fileId}`,
            `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`,
            `https://lh3.googleusercontent.com/d/${fileId}=w400-h400-c`,
            `https://drive.google.com/file/d/${fileId}/view?usp=sharing`
        ];
    }

    // Test if an image URL is accessible
    async testImageUrl(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            const timeout = setTimeout(() => {
                resolve(false);
            }, 5000);
            
            img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };
            
            img.src = url;
        });
    }

    // Load image with enhanced fallback system
    async loadImageWithFallback(imgElement, originalUrl, fallbackUrl, studentName) {
        const fileId = this.extractGoogleDriveFileId(originalUrl);
        
        // If cached, use cached result
        if (this.cache.has(originalUrl)) {
            const cachedUrl = this.cache.get(originalUrl);
            imgElement.src = cachedUrl;
            this.removeLoadingState(imgElement);
            return;
        }
        
        // Add loading state
        this.addLoadingState(imgElement, studentName);
        
        if (!fileId) {
            console.warn(`No Google Drive file ID found for ${studentName}:`, originalUrl);
            this.setFallbackImage(imgElement, fallbackUrl, originalUrl);
            return;
        }
        
        console.log(`Loading image for ${studentName} with file ID:`, fileId);
        
        const driveUrls = this.getGoogleDriveUrls(fileId);
        
        // Try each URL sequentially
        for (let i = 0; i < driveUrls.length; i++) {
            const currentUrl = driveUrls[i];
            console.log(`Trying URL ${i + 1}/${driveUrls.length} for ${studentName}:`, currentUrl);
            
            const isAccessible = await this.testImageUrl(currentUrl);
            
            if (isAccessible) {
                console.log(`Successfully loaded image for ${studentName} using URL:`, currentUrl);
                imgElement.src = currentUrl;
                this.cache.set(originalUrl, currentUrl);
                this.removeLoadingState(imgElement);
                return;
            }
            
            console.warn(`Failed to load image ${i + 1} for ${studentName}:`, currentUrl);
        }
        
        // All URLs failed, use fallback
        console.warn(`All Google Drive URLs failed for ${studentName}, using fallback`);
        this.setFallbackImage(imgElement, fallbackUrl, originalUrl);
    }

    // Add loading visual state
    addLoadingState(imgElement, studentName) {
        imgElement.style.opacity = '0.6';
        imgElement.style.filter = 'blur(1px)';
        imgElement.setAttribute('data-loading', 'true');
        
        // Add loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'image-loading-overlay';
        loadingOverlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        const container = imgElement.parentElement;
        if (container && !container.querySelector('.image-loading-overlay')) {
            container.style.position = 'relative';
            container.appendChild(loadingOverlay);
        }
    }

    // Remove loading visual state
    removeLoadingState(imgElement) {
        imgElement.style.opacity = '1';
        imgElement.style.filter = 'none';
        imgElement.removeAttribute('data-loading');
        
        const container = imgElement.parentElement;
        const overlay = container?.querySelector('.image-loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Set fallback image with error handling
    setFallbackImage(imgElement, fallbackUrl, originalUrl) {
        imgElement.src = fallbackUrl;
        this.cache.set(originalUrl, fallbackUrl);
        this.removeLoadingState(imgElement);
        
        // Add error indicator
        imgElement.setAttribute('data-image-error', 'true');
        imgElement.title = 'Image could not be loaded from Google Drive. Showing fallback avatar.';
    }

    // Initialize enhanced image loading for all Google Drive images
    initializeGoogleDriveImages() {
        const googleDriveImages = document.querySelectorAll('img[src*="drive.google.com"]');
        
        googleDriveImages.forEach(img => {
            const originalSrc = img.src;
            const studentName = img.alt || 'Unknown Student';
            const fallbackUrl = img.getAttribute('data-fallback') || 
                               img.getAttribute('onerror')?.match(/this\.src='([^']+)'/)?.[1] ||
                               `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=667eea&color=ffffff&size=200&bold=true`;
            
            // Clear the original onerror to prevent conflicts
            img.removeAttribute('onerror');
            
            // Load with enhanced fallback
            this.loadImageWithFallback(img, originalSrc, fallbackUrl, studentName);
        });
    }

    // Check Google Drive permissions and provide feedback
    async diagnoseGoogleDriveIssues(fileId) {
        const testUrls = this.getGoogleDriveUrls(fileId);
        const results = [];
        
        for (const url of testUrls) {
            const accessible = await this.testImageUrl(url);
            results.push({ url, accessible });
        }
        
        return results;
    }
}

// Global instance
const imageLoader = new EnhancedImageLoader();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Image Loader initialized');
    
    // Wait a bit for images to be rendered, then initialize
    setTimeout(() => {
        imageLoader.initializeGoogleDriveImages();
    }, 500);
    
    // Debug function for troubleshooting
    window.debugGoogleDriveImage = async function(fileId) {
        console.log('Debugging Google Drive image:', fileId);
        const results = await imageLoader.diagnoseGoogleDriveIssues(fileId);
        console.table(results);
        return results;
    };
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.EnhancedImageLoader = EnhancedImageLoader;
    window.imageLoader = imageLoader;
}
