// Mobile Navigation Handler
class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMobileNavigation();
        this.bindEvents();
        this.handleResize();
    }

    createMobileNavigation() {
        // Add mobile toggle button to existing navbar
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Create mobile toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-nav-toggle';
        mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
        mobileToggle.innerHTML = `
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        // Insert toggle button before nav-links
        const navLinks = navbar.querySelector('.nav-links');
        if (navLinks) {
            navbar.insertBefore(mobileToggle, navLinks);
        }

        // Create mobile overlay
        this.createMobileOverlay();
    }

    createMobileOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        overlay.innerHTML = this.generateMobileMenu();
        document.body.appendChild(overlay);
    }

    generateMobileMenu() {
        const navLinks = document.querySelectorAll('.nav-link');
        const userInfo = document.querySelector('.user-info');
        
        let menuHTML = '<div class="mobile-nav-menu">';
        
        // Add navigation links
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            const isActive = window.location.pathname === href ? 'active' : '';
            
            menuHTML += `
                <a href="${href}" class="mobile-nav-link ${isActive}">
                    ${text}
                </a>
            `;
        });

        // Add user info if present
        if (userInfo) {
            const username = userInfo.querySelector('span')?.textContent || '';
            const logoutBtn = userInfo.querySelector('.btn-danger');
            
            menuHTML += `
                <div class="mobile-user-info">
                    <span>${username}</span>
                    ${logoutBtn ? `<a href="/logout" class="btn btn-danger">Logout</a>` : ''}
                </div>
            `;
        } else {
            // Add login/register links for non-authenticated users
            menuHTML += `
                <div class="mobile-user-info">
                    <a href="/login" class="mobile-nav-link">Login</a>
                    <a href="/register" class="mobile-nav-link">Register</a>
                </div>
            `;
        }

        menuHTML += '</div>';
        return menuHTML;
    }

    bindEvents() {
        // Mobile toggle button
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleMobileNav());
        }

        // Close on overlay click
        const overlay = document.querySelector('.mobile-nav-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeMobileNav();
                }
            });
        }

        // Close on mobile link click
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileNav();
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMobileNav();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleMobileNav() {
        if (this.isOpen) {
            this.closeMobileNav();
        } else {
            this.openMobileNav();
        }
    }

    openMobileNav() {
        this.isOpen = true;
        const overlay = document.querySelector('.mobile-nav-overlay');
        const hamburger = document.querySelector('.hamburger');
        
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
        
        if (hamburger) {
            hamburger.classList.add('active');
        }

        // Add staggered animation to menu items
        const menuItems = document.querySelectorAll('.mobile-nav-link');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-slide-in');
        });
    }

    closeMobileNav() {
        this.isOpen = false;
        const overlay = document.querySelector('.mobile-nav-overlay');
        const hamburger = document.querySelector('.hamburger');
        
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
        
        if (hamburger) {
            hamburger.classList.remove('active');
        }

        // Remove animation classes
        const menuItems = document.querySelectorAll('.mobile-nav-link');
        menuItems.forEach(item => {
            item.style.animationDelay = '';
            item.classList.remove('animate-slide-in');
        });
    }

    handleResize() {
        // Close mobile nav if window becomes large
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMobileNav();
        }
    }

    // Update active navigation state
    updateActiveNav() {
        const currentPath = window.location.pathname;
        
        // Update desktop nav
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });

        // Update mobile nav
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
}

// Enhanced Navigation Features
class NavigationEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addScrollEffect();
        this.addActiveStates();
        this.addKeyboardNavigation();
    }

    addScrollEffect() {
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Hide navbar on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.3s ease';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            // Add background blur effect on scroll
            if (currentScrollY > 50) {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                navbar.style.backdropFilter = 'blur(30px)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.85)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    addActiveStates() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath.startsWith(href) && href !== '/')) {
                link.classList.add('active');
            }
        });
    }

    addKeyboardNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % navLinks.length;
                    navLinks[nextIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                    navLinks[prevIndex].focus();
                }
            });
        });
    }
}

// Responsive Utilities
class ResponsiveUtils {
    constructor() {
        this.breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024,
            large: 1200
        };
        this.init();
    }

    init() {
        this.handleViewportChanges();
        this.optimizeForTouch();
    }

    handleViewportChanges() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateViewportClass();
                this.adjustChatbotPosition();
            }, 250);
        });
        
        // Initial call
        this.updateViewportClass();
    }

    updateViewportClass() {
        const width = window.innerWidth;
        const body = document.body;
        
        // Remove existing classes
        body.classList.remove('mobile', 'tablet', 'desktop', 'large');
        
        // Add appropriate class
        if (width <= this.breakpoints.mobile) {
            body.classList.add('mobile');
        } else if (width <= this.breakpoints.tablet) {
            body.classList.add('tablet');
        } else if (width <= this.breakpoints.desktop) {
            body.classList.add('desktop');
        } else {
            body.classList.add('large');
        }
    }

    adjustChatbotPosition() {
        const chatbot = document.querySelector('.chatbot-container');
        if (!chatbot) return;
        
        const width = window.innerWidth;
        
        if (width <= this.breakpoints.mobile) {
            chatbot.style.bottom = '10px';
            chatbot.style.right = '10px';
        } else {
            chatbot.style.bottom = 'var(--space-lg)';
            chatbot.style.right = 'var(--space-lg)';
        }
    }

    optimizeForTouch() {
        // Detect touch device
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouch) {
            document.body.classList.add('touch-device');
            
            // Add touch feedback
            const interactiveElements = document.querySelectorAll('.btn, .nav-link, .card, .workout-card');
            
            interactiveElements.forEach(element => {
                element.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                });
                
                element.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('touch-active');
                    }, 150);
                });
            });
        }
    }

    // Utility methods
    isMobile() {
        return window.innerWidth <= this.breakpoints.mobile;
    }

    isTablet() {
        return window.innerWidth <= this.breakpoints.tablet && window.innerWidth > this.breakpoints.mobile;
    }

    isDesktop() {
        return window.innerWidth > this.breakpoints.tablet;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile navigation
    const mobileNav = new MobileNavigation();
    
    // Initialize navigation enhancements
    const navEnhancements = new NavigationEnhancements();
    
    // Initialize responsive utilities
    const responsiveUtils = new ResponsiveUtils();
    
    // Make instances globally available for debugging
    window.mobileNav = mobileNav;
    window.responsiveUtils = responsiveUtils;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileNavigation, NavigationEnhancements, ResponsiveUtils };
}