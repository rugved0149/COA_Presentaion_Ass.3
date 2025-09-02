// Presentation JavaScript functionality
class PresentationController {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.currentSlideIndex = 0;
        
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideElement = document.getElementById('currentSlide');
        this.totalSlidesElement = document.getElementById('totalSlides');
        
        this.init();
    }
    
    init() {
        // Set initial slide counter
        this.updateSlideCounter();
        this.updateButtonStates();
        
        // Add event listeners with proper binding
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.previousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextSlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        // Ensure first slide is active and others are hidden
        this.initializeSlides();
        
        console.log(`Presentation initialized with ${this.totalSlides} slides`);
    }
    
    initializeSlides() {
        // Hide all slides first
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            slide.style.display = 'flex'; // Ensure slides are available
            if (index !== 0) {
                slide.style.opacity = '0';
                slide.style.transform = 'translateX(100%)';
            }
        });
        
        // Show first slide
        if (this.slides[0]) {
            this.slides[0].classList.add('active');
            this.slides[0].style.opacity = '1';
            this.slides[0].style.transform = 'translateX(0)';
        }
    }
    
    showSlide(index) {
        if (index < 0 || index >= this.totalSlides) {
            return;
        }
        
        console.log(`Showing slide ${index + 1}`);
        
        // Hide current slide
        if (this.slides[this.currentSlideIndex]) {
            this.slides[this.currentSlideIndex].classList.remove('active');
            this.slides[this.currentSlideIndex].style.opacity = '0';
            
            if (index > this.currentSlideIndex) {
                this.slides[this.currentSlideIndex].style.transform = 'translateX(-100%)';
            } else {
                this.slides[this.currentSlideIndex].style.transform = 'translateX(100%)';
            }
        }
        
        // Show new slide
        setTimeout(() => {
            if (this.slides[index]) {
                this.slides[index].classList.add('active');
                this.slides[index].style.opacity = '1';
                this.slides[index].style.transform = 'translateX(0)';
                
                // Scroll to top of slide content
                const slideContent = this.slides[index].querySelector('.slide-content');
                if (slideContent) {
                    slideContent.scrollTop = 0;
                }
            }
            
            this.currentSlideIndex = index;
            this.updateSlideCounter();
            this.updateButtonStates();
            
            // Dispatch slide change event
            this.dispatchSlideChangeEvent();
            
        }, 100);
    }
    
    nextSlide() {
        console.log('Next slide clicked, current:', this.currentSlideIndex);
        if (this.currentSlideIndex < this.totalSlides - 1) {
            this.showSlide(this.currentSlideIndex + 1);
        }
    }
    
    previousSlide() {
        console.log('Previous slide clicked, current:', this.currentSlideIndex);
        if (this.currentSlideIndex > 0) {
            this.showSlide(this.currentSlideIndex - 1);
        }
    }
    
    updateSlideCounter() {
        if (this.currentSlideElement && this.totalSlidesElement) {
            this.currentSlideElement.textContent = this.currentSlideIndex + 1;
            this.totalSlidesElement.textContent = this.totalSlides;
        }
    }
    
    updateButtonStates() {
        // Update previous button
        if (this.prevBtn) {
            if (this.currentSlideIndex === 0) {
                this.prevBtn.disabled = true;
                this.prevBtn.style.opacity = '0.5';
                this.prevBtn.style.cursor = 'not-allowed';
            } else {
                this.prevBtn.disabled = false;
                this.prevBtn.style.opacity = '1';
                this.prevBtn.style.cursor = 'pointer';
            }
        }
        
        // Update next button
        if (this.nextBtn) {
            if (this.currentSlideIndex === this.totalSlides - 1) {
                this.nextBtn.disabled = true;
                this.nextBtn.style.opacity = '0.5';
                this.nextBtn.style.cursor = 'not-allowed';
            } else {
                this.nextBtn.disabled = false;
                this.nextBtn.style.opacity = '1';
                this.nextBtn.style.cursor = 'pointer';
            }
        }
    }
    
    dispatchSlideChangeEvent() {
        const slideTitle = this.slides[this.currentSlideIndex]?.querySelector('.slide-title')?.textContent || '';
        const slideChangeEvent = new CustomEvent('slideChange', {
            detail: {
                slideNumber: this.currentSlideIndex + 1,
                totalSlides: this.totalSlides,
                slideTitle: slideTitle
            }
        });
        document.dispatchEvent(slideChangeEvent);
    }
    
    handleKeydown(event) {
        switch(event.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
            case 'PageDown':
                event.preventDefault();
                this.nextSlide();
                break;
                
            case 'ArrowLeft':
            case 'PageUp':
                event.preventDefault();
                this.previousSlide();
                break;
                
            case 'Home':
                event.preventDefault();
                this.showSlide(0);
                break;
                
            case 'End':
                event.preventDefault();
                this.showSlide(this.totalSlides - 1);
                break;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX, minSwipeDistance);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX, minDistance) {
        const distance = Math.abs(startX - endX);
        
        if (distance >= minDistance) {
            if (startX > endX) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide  
                this.previousSlide();
            }
        }
    }
    
    // Public methods
    goToSlide(slideNumber) {
        const index = slideNumber - 1;
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }
    
    getCurrentSlideNumber() {
        return this.currentSlideIndex + 1;
    }
    
    isFirstSlide() {
        return this.currentSlideIndex === 0;
    }
    
    isLastSlide() {
        return this.currentSlideIndex === this.totalSlides - 1;
    }
}

// Enhanced code syntax highlighting for assembly language
class AssemblyHighlighter {
    constructor() {
        this.init();
    }
    
    init() {
        // Add syntax highlighting to all code blocks
        setTimeout(() => {
            const codeBlocks = document.querySelectorAll('.code-block pre code, .code-block pre');
            codeBlocks.forEach(block => this.highlightAssembly(block));
        }, 500); // Delay to ensure DOM is ready
    }
    
    highlightAssembly(element) {
        if (!element || !element.textContent) return;
        
        let content = element.textContent;
        
        // Assembly language patterns
        const patterns = [
            // Comments first (to avoid highlighting keywords in comments)
            { 
                regex: /;.*$/gm, 
                className: 'asm-comment',
                color: '#9CA3AF'
            },
            // Instructions
            { 
                regex: /\b(mov|add|sub|mul|div|cmp|je|jmp|jb|jbe|ja|jae|int|xor|shl|rol|inc|loop|call|ret|push|pop)\b/g, 
                className: 'asm-instruction',
                color: '#60A5FA'
            },
            // Registers
            { 
                regex: /\b(eax|ebx|ecx|edx|esi|edi|esp|ebp|ax|bx|cx|dx|al|bl|cl|dl|ah|bh|ch|dh)\b/g, 
                className: 'asm-register',
                color: '#34D399'
            },
            // Numbers and hex values
            { 
                regex: /\b(0x[0-9A-Fa-f]+|\d+)\b/g, 
                className: 'asm-number',
                color: '#FBBF24'
            },
            // Memory references
            { 
                regex: /\[[^\]]+\]/g, 
                className: 'asm-memory',
                color: '#F87171'
            },
            // Labels and symbols
            { 
                regex: /^[a-zA-Z_][a-zA-Z0-9_]*:/gm, 
                className: 'asm-label',
                color: '#A78BFA'
            },
            // Directives
            { 
                regex: /\b(section|global|db|dw|dd|dq|resb|resw|resd|resq|equ|macro|endmacro|BITS)\b/g, 
                className: 'asm-directive',
                color: '#FB7185'
            },
            // Macro parameters
            { 
                regex: /%[0-9]/g, 
                className: 'asm-macro-param',
                color: '#10B981'
            }
        ];
        
        // Apply highlighting
        patterns.forEach(pattern => {
            content = content.replace(pattern.regex, (match) => {
                return `<span class="${pattern.className}" style="color: ${pattern.color}; font-weight: 500;">${match}</span>`;
            });
        });
        
        element.innerHTML = content;
    }
}

// Animation controller for smooth transitions
class AnimationController {
    constructor() {
        this.init();
    }
    
    init() {
        // Add hover animations to interactive elements
        this.addHoverAnimations();
    }
    
    addHoverAnimations() {
        // Add subtle animations to cards and interactive elements
        const animatedElements = document.querySelectorAll(
            '.feature, .feature-card, .arch-section, .operation, .summary-section, .build-step, .menu-option'
        );
        
        animatedElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px) scale(1.02)';
                element.style.transition = 'transform 0.2s ease-out';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Accessibility controller
class AccessibilityController {
    constructor() {
        this.init();
    }
    
    init() {
        // Add ARIA labels and roles
        this.addAriaLabels();
        
        // Add screen reader announcements
        this.addScreenReaderAnnouncements();
        
        // Listen for slide changes
        document.addEventListener('slideChange', (event) => {
            this.announceSlideChange(
                event.detail.slideNumber, 
                event.detail.totalSlides, 
                event.detail.slideTitle
            );
        });
    }
    
    addAriaLabels() {
        // Add ARIA labels to navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', 'Go to previous slide');
            prevBtn.setAttribute('role', 'button');
        }
        
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', 'Go to next slide');
            nextBtn.setAttribute('role', 'button');
        }
        
        // Add ARIA roles to slides
        document.querySelectorAll('.slide').forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1}`);
        });
        
        // Add main content landmark
        const presentationContainer = document.querySelector('.presentation-container');
        if (presentationContainer) {
            presentationContainer.setAttribute('role', 'main');
            presentationContainer.setAttribute('aria-label', 'Presentation slides');
        }
    }
    
    addScreenReaderAnnouncements() {
        // Create live region for screen reader announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'slide-announcements';
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-9999px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
    
    announceSlideChange(slideNumber, totalSlides, slideTitle) {
        const liveRegion = document.getElementById('slide-announcements');
        if (liveRegion) {
            liveRegion.textContent = `Slide ${slideNumber} of ${totalSlides}: ${slideTitle}`;
        }
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    // Wait a moment for styles to load
    setTimeout(() => {
        // Initialize main presentation controller
        window.presentation = new PresentationController();
        
        // Initialize syntax highlighting
        const highlighter = new AssemblyHighlighter();
        
        // Initialize animations
        const animations = new AnimationController();
        
        // Initialize accessibility features
        const accessibility = new AccessibilityController();
        
        console.log('32-bit NASM Hex Calculator Presentation loaded successfully!');
        
        // Debug information
        console.log('Total slides found:', document.querySelectorAll('.slide').length);
        console.log('Navigation buttons found:', {
            prev: !!document.getElementById('prevBtn'),
            next: !!document.getElementById('nextBtn')
        });
        
    }, 100);
});