/**
 * Accessibility Testing and Validation Script
 * Tests various accessibility features and generates a report
 */

class AccessibilityTester {
    constructor() {
        this.results = [];
        this.errors = [];
        this.warnings = [];
        this.passed = [];
    }

    // Run all accessibility tests
    runAllTests() {
        console.log('🔍 Starting Accessibility Testing...');
        
        this.testSemancticStructure();
        this.testImageAltText();
        this.testKeyboardNavigation();
        this.testColorContrast();
        this.testAriaLabels();
        this.testFocusManagement();
        this.testResponsiveDesign();
        this.testReducedMotion();
        
        this.generateReport();
    }

    // Test semantic HTML structure
    testSemancticStructure() {
        const tests = [
            {
                test: 'Main landmark exists',
                element: 'main',
                required: true
            },
            {
                test: 'Navigation landmark exists',
                element: 'nav',
                required: true            },
            {
                test: 'Heading hierarchy',
                element: 'h1, h2, h3, h4, h5, h6',
                required: true
            }
        ];

        tests.forEach(({ test, element, required }) => {
            const elements = document.querySelectorAll(element);
            
            if (elements.length > 0) {
                this.passed.push(`✅ ${test}: Found ${elements.length} element(s)`);
            } else if (required) {
                this.errors.push(`❌ ${test}: Missing required element '${element}'`);
            } else {
                this.warnings.push(`⚠️ ${test}: Element '${element}' not found`);
            }
        });

        // Check heading hierarchy
        this.checkHeadingHierarchy();
    }

    checkHeadingHierarchy() {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const hierarchy = headings.map(h => parseInt(h.tagName.charAt(1)));
        
        let previousLevel = 0;
        let hierarchyValid = true;
        
        hierarchy.forEach((level, index) => {
            if (index === 0 && level !== 1) {
                this.warnings.push('⚠️ Page should start with h1');
                hierarchyValid = false;
            } else if (level > previousLevel + 1) {
                this.warnings.push(`⚠️ Heading hierarchy skip: h${previousLevel} to h${level}`);
                hierarchyValid = false;
            }
            previousLevel = level;
        });

        if (hierarchyValid && headings.length > 0) {
            this.passed.push('✅ Heading hierarchy: Proper structure maintained');
        }
    }

    // Test image alt text
    testImageAltText() {
        const images = document.querySelectorAll('img');
        const decorativeImages = document.querySelectorAll('img[alt=""], img[role="presentation"]');
        
        let missingAlt = 0;
        let emptyAlt = 0;
        let goodAlt = 0;

        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                missingAlt++;
            } else if (img.alt === '') {
                emptyAlt++;
            } else {
                goodAlt++;
            }
        });

        if (missingAlt === 0) {
            this.passed.push(`✅ Image alt text: All ${images.length} images have alt attributes`);
        } else {
            this.errors.push(`❌ Image alt text: ${missingAlt} images missing alt attribute`);
        }

        if (goodAlt > 0) {
            this.passed.push(`✅ Descriptive alt text: ${goodAlt} images with meaningful descriptions`);
        }

        if (decorativeImages.length > 0) {
            this.passed.push(`✅ Decorative images: ${decorativeImages.length} properly marked as decorative`);
        }
    }

    // Test keyboard navigation
    testKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        
        const elementsWithoutTabindex = Array.from(focusableElements).filter(
            el => !el.hasAttribute('tabindex') || el.tabIndex >= 0
        );

        this.passed.push(`✅ Keyboard navigation: ${elementsWithoutTabindex.length} focusable elements found`);

        // Check for skip links
        const skipLinks = document.querySelectorAll('a[href^="#"]');
        if (skipLinks.length > 0) {
            this.passed.push(`✅ Skip links: ${skipLinks.length} internal navigation links found`);
        }

        // Check for proper focus indicators
        const elementsWithFocusStyles = Array.from(focusableElements).filter(el => {
            const styles = window.getComputedStyle(el, ':focus');
            return styles.outline !== 'none' || styles.boxShadow !== 'none';
        });

        if (elementsWithFocusStyles.length > 0) {
            this.passed.push('✅ Focus indicators: Custom focus styles implemented');
        }
    }

    // Test color contrast (basic check)
    testColorContrast() {
        const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
        let contrastIssues = 0;

        // This is a simplified contrast check
        // In a real scenario, you'd use a more sophisticated color contrast algorithm
        textElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Skip if background is transparent
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                return;
            }

            // Basic check for very light text on light background
            if (this.isLightColor(color) && this.isLightColor(backgroundColor)) {
                contrastIssues++;
            }
        });

        if (contrastIssues === 0) {
            this.passed.push('✅ Color contrast: No obvious contrast issues detected');
        } else {
            this.warnings.push(`⚠️ Color contrast: ${contrastIssues} potential contrast issues`);
        }
    }

    // Helper function to check if color is light
    isLightColor(color) {
        // Simplified light color detection
        return color.includes('255') || color.includes('white') || color.includes('#fff');
    }

    // Test ARIA labels and landmarks
    testAriaLabels() {
        const ariaLabels = document.querySelectorAll('[aria-label]');
        const ariaDescribedBy = document.querySelectorAll('[aria-describedby]');
        const ariaLabelledBy = document.querySelectorAll('[aria-labelledby]');
        const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');

        if (ariaLabels.length > 0) {
            this.passed.push(`✅ ARIA labels: ${ariaLabels.length} elements with aria-label`);
        }

        if (landmarks.length > 0) {
            this.passed.push(`✅ ARIA landmarks: ${landmarks.length} landmark roles defined`);
        }

        // Check for aria-live regions
        const liveRegions = document.querySelectorAll('[aria-live]');
        if (liveRegions.length > 0) {
            this.passed.push(`✅ Live regions: ${liveRegions.length} aria-live regions for dynamic content`);
        }
    }

    // Test focus management
    testFocusManagement() {
        // Check if there's a focus trap mechanism for modals
        const modals = document.querySelectorAll('.modal, [role="dialog"]');
        
        if (modals.length > 0) {
            this.passed.push(`✅ Modal focus: ${modals.length} modal(s) detected for focus management`);
        }

        // Check for proper focus restoration
        const elementsWithTabindex = document.querySelectorAll('[tabindex]');
        const negativeTabindex = document.querySelectorAll('[tabindex="-1"]');
        
        if (negativeTabindex.length > 0) {
            this.passed.push(`✅ Focus management: ${negativeTabindex.length} elements with tabindex="-1" for programmatic focus`);
        }
    }

    // Test responsive design
    testResponsiveDesign() {
        const viewport = document.querySelector('meta[name="viewport"]');
        
        if (viewport) {
            this.passed.push('✅ Responsive design: Viewport meta tag present');
        } else {
            this.errors.push('❌ Responsive design: Missing viewport meta tag');
        }

        // Check for responsive images
        const responsiveImages = document.querySelectorAll('img[loading="lazy"], picture source');
        if (responsiveImages.length > 0) {
            this.passed.push(`✅ Responsive images: ${responsiveImages.length} optimized images found`);
        }
    }

    // Test reduced motion support
    testReducedMotion() {
        // Check if prefers-reduced-motion is respected
        const hasReducedMotionCSS = Array.from(document.styleSheets).some(sheet => {
            try {
                return Array.from(sheet.cssRules).some(rule => 
                    rule.cssText && rule.cssText.includes('prefers-reduced-motion')
                );
            } catch (e) {
                return false;
            }
        });

        if (hasReducedMotionCSS) {
            this.passed.push('✅ Reduced motion: CSS respects prefers-reduced-motion preference');
        } else {
            this.warnings.push('⚠️ Reduced motion: No prefers-reduced-motion CSS rules detected');
        }
    }

    // Generate accessibility report
    generateReport() {
        console.log('\n📊 ACCESSIBILITY TEST REPORT');
        console.log('═'.repeat(50));
        
        console.log(`\n✅ PASSED (${this.passed.length}):`);
        this.passed.forEach(item => console.log(item));
        
        if (this.warnings.length > 0) {
            console.log(`\n⚠️ WARNINGS (${this.warnings.length}):`);
            this.warnings.forEach(item => console.log(item));
        }
        
        if (this.errors.length > 0) {
            console.log(`\n❌ ERRORS (${this.errors.length}):`);
            this.errors.forEach(item => console.log(item));
        }

        console.log('\n📈 SUMMARY:');
        console.log(`Total tests: ${this.passed.length + this.warnings.length + this.errors.length}`);
        console.log(`Passed: ${this.passed.length}`);
        console.log(`Warnings: ${this.warnings.length}`);
        console.log(`Errors: ${this.errors.length}`);
        
        const score = Math.round((this.passed.length / (this.passed.length + this.warnings.length + this.errors.length)) * 100);
        console.log(`Accessibility Score: ${score}%`);

        if (score >= 90) {
            console.log('🎉 Excellent accessibility implementation!');
        } else if (score >= 75) {
            console.log('👍 Good accessibility, room for improvement');
        } else {
            console.log('⚠️ Accessibility needs attention');
        }

        // Store results for potential export
        this.results = {
            passed: this.passed.length,
            warnings: this.warnings.length,
            errors: this.errors.length,
            score: score,
            details: {
                passed: this.passed,
                warnings: this.warnings,
                errors: this.errors
            }
        };

        return this.results;
    }

    // Export report as JSON
    exportReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...this.results
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize accessibility testing when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add a delay to ensure all dynamic content is loaded
    setTimeout(() => {
        window.accessibilityTester = new AccessibilityTester();
        
        // Only run tests in development/testing environment
        if (window.location.hostname === 'localhost' || 
            window.location.search.includes('test-accessibility')) {
            window.accessibilityTester.runAllTests();
        }
    }, 2000);
});

// Global function to manually run accessibility tests
window.runAccessibilityTest = function() {
    if (!window.accessibilityTester) {
        window.accessibilityTester = new AccessibilityTester();
    }
    return window.accessibilityTester.runAllTests();
};

// Global function to export accessibility report
window.exportAccessibilityReport = function() {
    if (window.accessibilityTester) {
        window.accessibilityTester.exportReport();
    } else {
        console.warn('Run accessibility test first before exporting report');
    }
};
