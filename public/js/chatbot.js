// AI Fitness Chatbot
class FitnessChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chatbot-toggle pulse-effect" id="chatbot-toggle">
                    <span class="chatbot-icon">🤖</span>
                </button>
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <span>💪 Fitness AI Coach</span>
                        <button class="chatbot-close" id="chatbot-close">×</button>
                    </div>
                    <div class="chatbot-messages" id="chatbot-messages"></div>
                    <div class="chatbot-input-container">
                        <input type="text" class="chatbot-input" id="chatbot-input" 
                               placeholder="Ask about exercises, nutrition, or training tips...">
                        <button class="chatbot-send" id="chatbot-send">
                            <span>➤</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');

        toggle.addEventListener('click', () => this.toggleChatbot());
        close.addEventListener('click', () => this.closeChatbot());
        send.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Add click events for quick actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                this.handleQuickAction(e.target.textContent);
            }
        });
    }

    toggleChatbot() {
        const window = document.getElementById('chatbot-window');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            window.classList.add('active');
            document.getElementById('chatbot-input').focus();
        } else {
            window.classList.remove('active');
        }
    }

    closeChatbot() {
        const window = document.getElementById('chatbot-window');
        window.classList.remove('active');
        this.isOpen = false;
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            text: "Hi! I'm your AI Fitness Coach! 💪 I can help you with:",
            timestamp: new Date()
        };
        
        this.messages.push(welcomeMessage);
        this.renderMessage(welcomeMessage);
        
        // Add quick action buttons
        setTimeout(() => {
            this.addQuickActions();
        }, 500);
    }

    addQuickActions() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const quickActionsHTML = `
            <div class="quick-actions">
                <button class="quick-action-btn">Exercise Repetitions</button>
                <button class="quick-action-btn">Post-Workout Tips</button>
                <button class="quick-action-btn">Protein Intake</button>
                <button class="quick-action-btn">Workout Plan</button>
                <button class="quick-action-btn">Nutrition Advice</button>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', quickActionsHTML);
        this.scrollToBottom();
    }

    handleQuickAction(action) {
        // Send the quick action as a user message
        this.addMessage('user', action);
        
        // Generate appropriate response
        setTimeout(() => {
            this.generateResponse(action);
        }, 1000);
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        this.addMessage('user', message);
        input.value = '';
        
        // Generate AI response
        setTimeout(() => {
            this.generateResponse(message);
        }, 1000);
    }

    addMessage(type, text) {
        const message = {
            type,
            text,
            timestamp: new Date()
        };
        
        this.messages.push(message);
        this.renderMessage(message);
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageHTML = `
            <div class="chatbot-message ${message.type}">
                ${message.text}
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingHTML = `
            <div class="typing-indicator" id="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    generateResponse(userMessage) {
        this.showTypingIndicator();
        
        // Simulate AI thinking time
        setTimeout(() => {
            this.hideTypingIndicator();
            
            const response = this.getAIResponse(userMessage.toLowerCase());
            this.addMessage('bot', response);
        }, 1500);
    }

    getAIResponse(message) {
        // Exercise repetitions responses
        if (message.includes('repetition') || message.includes('reps') || message.includes('exercise repetitions')) {
            const exercises = [
                "🏋️ **Push-ups**: Start with 3 sets of 8-12 reps. Focus on proper form - keep your body straight and lower until your chest nearly touches the ground.",
                "🏃 **Squats**: Begin with 3 sets of 10-15 reps. Keep your feet shoulder-width apart and lower until your thighs are parallel to the ground.",
                "💪 **Planks**: Hold for 30-60 seconds, 3 sets. Keep your core tight and body in a straight line from head to heels.",
                "🤸 **Burpees**: Start with 2 sets of 5-8 reps. This full-body exercise will boost your cardio and strength!"
            ];
            return exercises[Math.floor(Math.random() * exercises.length)];
        }

        // Post-workout tips
        if (message.includes('post-workout') || message.includes('after workout') || message.includes('post-training') || message.includes('post workout tips')) {
            const tips = [
                "🧘 **Cool Down**: Spend 5-10 minutes stretching to prevent muscle stiffness and improve flexibility.",
                "💧 **Hydrate**: Drink water within 30 minutes post-workout to replenish fluids lost through sweat.",
                "🛁 **Recovery**: Take a warm shower or bath to relax muscles and improve circulation.",
                "😴 **Rest**: Ensure 7-9 hours of quality sleep for optimal muscle recovery and growth.",
                "🍎 **Refuel**: Eat a balanced meal with protein and carbs within 2 hours to aid muscle recovery."
            ];
            return tips[Math.floor(Math.random() * tips.length)];
        }

        // Protein intake advice
        if (message.includes('protein') || message.includes('nutrition') || message.includes('protein intake')) {
            const proteinAdvice = [
                "🥩 **Daily Protein**: Aim for 0.8-1.2g per kg of body weight for general fitness, or 1.6-2.2g per kg for muscle building.",
                "🥚 **Protein Sources**: Include lean meats, fish, eggs, dairy, legumes, nuts, and protein powders in your diet.",
                "⏰ **Timing**: Consume 20-30g of protein within 30 minutes post-workout for optimal muscle protein synthesis.",
                "🥤 **Protein Shakes**: Great for convenience! Mix with fruits and oats for a complete post-workout meal.",
                "🐟 **Quality Matters**: Choose complete proteins that contain all essential amino acids for best results."
            ];
            return proteinAdvice[Math.floor(Math.random() * proteinAdvice.length)];
        }

        // Workout plan advice
        if (message.includes('workout plan') || message.includes('training plan') || message.includes('exercise plan')) {
            const workoutPlans = [
                "📅 **Beginner Plan**: 3 days/week - Day 1: Upper body, Day 2: Lower body, Day 3: Full body cardio",
                "🏋️ **Intermediate Plan**: 4 days/week - Push/Pull/Legs/Cardio split for balanced muscle development",
                "💪 **Advanced Plan**: 5-6 days/week - Body part splits with dedicated cardio and recovery days",
                "🏃 **Cardio Focus**: 30 minutes moderate cardio 4-5x/week + 2 strength training sessions",
                "⚡ **HIIT Plan**: 20-minute high-intensity intervals 3x/week + 2 strength training days"
            ];
            return workoutPlans[Math.floor(Math.random() * workoutPlans.length)];
        }

        // Nutrition advice
        if (message.includes('nutrition') || message.includes('diet') || message.includes('eating') || message.includes('nutrition advice')) {
            const nutritionTips = [
                "🥗 **Balanced Meals**: Include protein, complex carbs, healthy fats, and vegetables in every meal",
                "💧 **Hydration**: Drink at least 8-10 glasses of water daily, more if you're active",
                "🍌 **Pre-Workout**: Eat a banana or light snack 30-60 minutes before exercising for energy",
                "🥑 **Healthy Fats**: Include avocados, nuts, olive oil, and fatty fish for hormone production",
                "🍎 **Meal Timing**: Eat every 3-4 hours to maintain stable blood sugar and energy levels"
            ];
            return nutritionTips[Math.floor(Math.random() * nutritionTips.length)];
        }

        // General fitness questions
        if (message.includes('motivation') || message.includes('tips') || message.includes('help')) {
            const motivationalTips = [
                "🎯 **Set SMART Goals**: Specific, Measurable, Achievable, Relevant, and Time-bound fitness goals keep you focused!",
                "📈 **Track Progress**: Log your workouts, measurements, and how you feel - progress isn't always visible on the scale!",
                "👥 **Find a Buddy**: Working out with a friend increases accountability and makes exercise more fun!",
                "🎵 **Create Playlists**: Upbeat music can increase your workout intensity by up to 15%!",
                "🏆 **Celebrate Wins**: Acknowledge every achievement, no matter how small - consistency is key!"
            ];
            return motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
        }

        // Default responses
        const defaultResponses = [
            "I'm here to help with your fitness journey! Ask me about exercise repetitions, post-workout care, nutrition, or workout plans. 💪",
            "Great question! I can provide advice on training techniques, protein intake, recovery tips, and more. What specific area interests you? 🏋️",
            "Let me help you achieve your fitness goals! I have knowledge about exercises, nutrition, and training strategies. What would you like to know? 🎯",
            "I'm your AI fitness coach! Whether you need workout advice, nutrition tips, or motivation, I'm here to support you. How can I help today? 🚀"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FitnessChatbot();
});

// Add interactive effects to existing elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .col, .workout-card, .stat-card');
    cards.forEach(card => {
        card.classList.add('interactive-card');
    });

    // Add glow effect to titles
    const titles = document.querySelectorAll('.card-title, .nav-brand');
    titles.forEach(title => {
        title.classList.add('glow-text');
    });

    // Add floating effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.classList.add('hover-lift');
    });

    // Add neon border effect to important elements
    const importantElements = document.querySelectorAll('.navbar, .card');
    importantElements.forEach(element => {
        element.classList.add('neon-border');
    });
});