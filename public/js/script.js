// 全局工具函數和事件處理

// Modern notification system with design system integration
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification animate-slide-up';
    
    const colors = {
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        info: 'var(--color-primary)',
        warning: 'var(--color-accent)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: var(--space-lg);
        right: var(--space-lg);
        padding: var(--space-md) var(--space-lg);
        border-radius: var(--radius-lg);
        color: white;
        font-weight: var(--font-weight-medium);
        font-family: var(--font-primary);
        z-index: 1000;
        backdrop-filter: blur(20px);
        border: 1px solid ${colors[type] || colors.info};
        box-shadow: var(--shadow-lg), 0 8px 25px ${colors[type] || colors.info}33;
        background: linear-gradient(135deg, ${colors[type] || colors.info}, ${colors[type] || colors.info}dd);
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut var(--duration-moderate) var(--ease-acceleration)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 350);
    }, 4000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOut var(--duration-fast) var(--ease-acceleration)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 250);
    });
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// 格式化時間
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 計算持續時間
function calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end - start) / (1000 * 60)); // 返回分鐘數
}

// 檢查用戶認證狀態
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/current-user');
        const data = await response.json();
        return data.success ? data.user : null;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return null;
    }
}

// 頁面載入時檢查認證
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuthStatus();
    
    // 如果用戶未登入且當前頁面需要認證，重定向到登入頁面
    const protectedPages = ['/create', '/read', '/update', '/delete'];
    const currentPath = window.location.pathname;
    
    if (!user && protectedPages.includes(currentPath)) {
        window.location.href = '/login';
        return;
    }
    
    // 如果用戶已登入且當前在登入/註冊頁面，重定向到首頁
    if (user && (currentPath === '/login' || currentPath === '/register')) {
        window.location.href = '/';
        return;
    }
});

// 自動完成功能增強
function enhanceAutocomplete(inputId, suggestions) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(inputId + 'Suggestions') || 
                     document.createElement('div');
    
    if (!container.id) {
        container.id = inputId + 'Suggestions';
        container.className = 'autocomplete-items';
        input.parentNode.appendChild(container);
    }
    
    input.addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase();
        container.innerHTML = '';
        
        if (value.length > 0) {
            const filtered = suggestions.filter(item => 
                item.toLowerCase().includes(value)
            ).slice(0, 5);
            
            filtered.forEach(item => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.textContent = item;
                div.addEventListener('click', () => {
                    input.value = item;
                    container.innerHTML = '';
                    // 觸發輸入事件以便其他監聽器可以響應
                    input.dispatchEvent(new Event('input'));
                });
                container.appendChild(div);
            });
        }
    });
    
    // 點擊外部時隱藏建議
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !container.contains(e.target)) {
            container.innerHTML = '';
        }
    });
}

// 運動類型建議
const exerciseTypes = [
    'cardio', 'strength', 'flexibility', 'balance', 
    'high-intensity-interval-training', 'sports', 'other'
];

// 運動名稱建議
const exerciseNames = [
    'Running', 'Walking', 'Cycling', 'Swimming', 'Yoga', 'Pilates',
    'Weightlifting', 'Bodyweight Training', 'Dancing', 'Hiking',
    'Basketball', 'Football', 'Tennis', 'Boxing', 'Martial Arts',
    'Rowing', 'Elliptical', 'Stair Climbing', 'Jump Rope', 'Burpees',
    'Push-ups', 'Pull-ups', 'Squats', 'Deadlifts', 'Bench Press',
    'Meditation', 'Stretching', 'CrossFit', 'Zumba', 'Spinning'
];

// 初始化自動完成
document.addEventListener('DOMContentLoaded', () => {
    // 為運動名稱輸入框添加自動完成
    const exerciseNameInput = document.getElementById('exerciseName');
    if (exerciseNameInput) {
        enhanceAutocomplete('exerciseName', exerciseNames);
    }
    
    // 為搜索框添加自動完成
    const searchInput = document.getElementById('searchExercise');
    if (searchInput) {
        // 搜索框的自動完成將在數據載入後動態更新
    }
});

// 錯誤處理
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showNotification('An unexpected error occurred', 'error');
});

// 網絡狀態監聽
window.addEventListener('online', () => {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', () => {
    showNotification('You are offline. Some features may not work.', 'warning');
});

// 添加 CSS 動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
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
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        25% {
            transform: translateY(-20px) rotate(90deg);
        }
        50% {
            transform: translateY(-10px) rotate(180deg);
        }
        75% {
            transform: translateY(-30px) rotate(270deg);
        }
    }
    
    @keyframes trailFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.5);
        }
    }
    
    @keyframes glow {
        0%, 100% {
            text-shadow: 0 0 5px rgba(0, 255, 127, 0.5);
        }
        50% {
            text-shadow: 0 0 20px rgba(0, 255, 127, 0.8), 0 0 30px rgba(0, 255, 127, 0.6);
        }
    }
    
    @keyframes borderGlow {
        0%, 100% {
            border-color: rgba(0, 255, 127, 0.3);
            box-shadow: 0 0 5px rgba(0, 255, 127, 0.2);
        }
        50% {
            border-color: rgba(0, 255, 127, 0.8);
            box-shadow: 0 0 20px rgba(0, 255, 127, 0.4);
        }
    }
    
    .glow-text {
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    .border-glow {
        animation: borderGlow 2s ease-in-out infinite alternate;
    }
    
    .cyber-button {
        position: relative;
        overflow: hidden;
    }
    
    .cyber-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 127, 0.4), transparent);
        transition: left 0.5s;
    }
    
    .cyber-button:hover::before {
        left: 100%;
    }
`;
document.head.appendChild(style);
// Enhanced Interactive Effects for Modern Design System
document.addEventListener('DOMContentLoaded', () => {
    // Initialize design system enhancements
    initializeDesignSystem();
    
    // Add staggered animations for cards
    addStaggeredAnimations();
    
    // Add enhanced form interactions
    enhanceFormInteractions();
    
    // Add button ripple effects
    addRippleEffects();
    
    // Add intersection observer for animations
    initializeScrollAnimations();
});

// Initialize design system enhancements
function initializeDesignSystem() {
    // Add CSS custom properties support check
    if (!CSS.supports('color', 'var(--color-primary)')) {
        console.warn('CSS custom properties not supported');
        return;
    }
    
    // Add reduced motion class if preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduce-motion');
    }
    
    // Add high contrast support
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.documentElement.classList.add('high-contrast');
    }
}

// Staggered animations for card elements
function addStaggeredAnimations() {
    const cards = document.querySelectorAll('.card, .workout-card, .stat-card, .course-card');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
        card.classList.add('animate-slide-up');
    });
}

// Enhanced form interactions
function enhanceFormInteractions() {
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(input => {
        // Add focus ring animation
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.style.willChange = 'transform, box-shadow';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.style.willChange = 'auto';
        });
        
        // Add validation state animations
        input.addEventListener('invalid', function() {
            this.classList.add('animate-shake');
            setTimeout(() => {
                this.classList.remove('animate-shake');
            }, 500);
        });
        
        // Add success state for valid inputs
        input.addEventListener('input', function() {
            if (this.validity.valid && this.value.length > 0) {
                this.classList.add('valid');
            } else {
                this.classList.remove('valid');
            }
        });
    });
}

// Modern ripple effect system
function addRippleEffects() {
    const buttons = document.querySelectorAll('.btn, .filter-btn, .enroll-btn, .enroll-btn-small');
    
    buttons.forEach(button => {
        button.addEventListener('click', createModernRipple);
    });
}

function createModernRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple var(--duration-slow) var(--ease-emphasized);
        pointer-events: none;
        z-index: 1;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (button.contains(ripple)) {
            button.removeChild(ripple);
        }
    }, 500);
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add entrance animation based on element type
                if (element.classList.contains('stat-card')) {
                    element.style.animation = 'slideUp var(--duration-moderate) var(--ease-deceleration)';
                } else if (element.classList.contains('workout-card')) {
                    element.style.animation = 'slideIn var(--duration-moderate) var(--ease-deceleration)';
                } else {
                    element.style.animation = 'fadeIn var(--duration-fast) var(--ease-standard)';
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.card, .workout-card, .stat-card, .course-card').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced loading states
function showLoadingState(element) {
    element.classList.add('btn-loading');
    element.disabled = true;
    element.style.cursor = 'not-allowed';
}

function hideLoadingState(element) {
    element.classList.remove('btn-loading');
    element.disabled = false;
    element.style.cursor = 'pointer';
}

// Smooth page transitions
function initializePageTransitions() {
    const links = document.querySelectorAll('a[href^="/"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hostname === window.location.hostname) {
                e.preventDefault();
                
                // Add page exit animation
                document.body.style.animation = 'fadeOut var(--duration-moderate) var(--ease-acceleration)';
                
                setTimeout(() => {
                    window.location.href = this.href;
                }, 350);
            }
        });
    });
}

// Enhanced card interactions
function enhanceCardInteractions() {
    const cards = document.querySelectorAll('.card, .workout-card, .stat-card, .course-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.willChange = 'transform, box-shadow';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.willChange = 'auto';
        });
        
        // Add keyboard navigation support
        if (card.querySelector('button, a')) {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    const actionElement = this.querySelector('button, a');
                    if (actionElement) {
                        actionElement.click();
                    }
                }
            });
        }
    });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
    enhanceCardInteractions();
    initializePageTransitions();
});