/**
 * Quantum Travel AI - Frontend Application
 * Real-time AI communication interface
 */

class QuantumTravelAI {
    constructor() {
        this.websocket = null;
        this.clientId = this.generateClientId();
        this.conversationId = null;
        this.currentModel = 'quantum-ai';
        this.isConnected = false;
        this.messageHistory = [];
        
        this.initializeElements();
        this.attachEventListeners();
        this.connectWebSocket();
        this.checkHealth();
    }

    initializeElements() {
        // Get DOM elements
        this.elements = {
            welcomeScreen: document.getElementById('welcomeScreen'),
            messagesContainer: document.getElementById('messagesContainer'),
            messageInput: document.getElementById('messageInput'),
            sendBtn: document.getElementById('sendBtn'),
            attachBtn: document.getElementById('attachBtn'),
            newChatBtn: document.getElementById('newChatBtn'),
            modelSelect: document.getElementById('modelSelect'),
            connectionStatus: document.getElementById('connectionStatus'),
            activeUsers: document.getElementById('activeUsers'),
            currentModel: document.getElementById('currentModel')
        };
    }

    attachEventListeners() {
        // Send button click
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enter key in input (without shift)
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.elements.messageInput.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
        });

        // Model selection
        this.elements.modelSelect.addEventListener('change', (e) => {
            this.currentModel = e.target.value;
            this.elements.currentModel.textContent = e.target.options[e.target.selectedIndex].text;
            this.showNotification(`Switched to ${e.target.options[e.target.selectedIndex].text}`);
        });

        // New chat
        this.elements.newChatBtn.addEventListener('click', () => this.startNewChat());

        // Attach file (placeholder)
        this.elements.attachBtn.addEventListener('click', () => {
            this.showNotification('File upload feature coming soon!');
        });
    }

    generateClientId() {
        return 'client_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    }

    connectWebSocket() {
        try {
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsHost = window.location.hostname;
            const wsPort = window.location.port || '8000';
            const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}/ws/${this.clientId}`;

            this.websocket = new WebSocket(wsUrl);

            this.websocket.onopen = () => {
                console.log('WebSocket connected');
                this.isConnected = true;
                this.updateConnectionStatus(true);
            };

            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };

            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus(false);
            };

            this.websocket.onclose = () => {
                console.log('WebSocket disconnected');
                this.isConnected = false;
                this.updateConnectionStatus(false);
                
                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    this.connectWebSocket();
                }, 5000);
            };
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            this.updateConnectionStatus(false);
            // Fall back to REST API mode
            this.showNotification('Using REST API mode');
        }
    }

    handleWebSocketMessage(data) {
        console.log('Received:', data);
        
        if (data.type === 'connection') {
            this.showNotification('Connected to Quantum Travel AI');
        } else if (data.type === 'message') {
            this.addMessage(data.message, 'assistant', data.model);
        }
    }

    updateConnectionStatus(connected) {
        const statusDot = this.elements.connectionStatus.querySelector('.status-dot');
        const statusText = this.elements.connectionStatus.querySelector('.status-text');
        
        if (connected) {
            statusDot.classList.remove('disconnected');
            statusText.textContent = 'Connected';
        } else {
            statusDot.classList.add('disconnected');
            statusText.textContent = 'Disconnected';
        }
    }

    async checkHealth() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            console.log('Health check:', data);
            
            if (data.active_connections !== undefined) {
                this.elements.activeUsers.textContent = data.active_connections;
            }
        } catch (error) {
            console.error('Health check failed:', error);
        }
    }

    async sendMessage() {
        const message = this.elements.messageInput.value.trim();
        
        if (!message) {
            return;
        }

        // Hide welcome screen if visible
        if (this.elements.welcomeScreen.style.display !== 'none') {
            this.elements.welcomeScreen.style.display = 'none';
            this.elements.messagesContainer.classList.add('active');
        }

        // Add user message to UI
        this.addMessage(message, 'user');
        
        // Clear input
        this.elements.messageInput.value = '';
        this.elements.messageInput.style.height = 'auto';

        // Show typing indicator
        const typingId = this.showTypingIndicator();

        // Send message via WebSocket or REST API
        if (this.isConnected && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({
                message: message,
                model: this.currentModel,
                conversation_id: this.conversationId
            }));
        } else {
            // Fallback to REST API
            await this.sendMessageViaREST(message);
        }

        // Remove typing indicator after response
        setTimeout(() => this.removeTypingIndicator(typingId), 500);
    }

    async sendMessageViaREST(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    model: this.currentModel,
                    conversation_id: this.conversationId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            this.conversationId = data.conversation_id;
            this.addMessage(data.response, 'assistant', data.model);
        } catch (error) {
            console.error('Error sending message:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        }
    }

    addMessage(content, role, model = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const avatar = role === 'user' ? '👤' : '🤖';
        const author = role === 'user' ? 'You' : 'Quantum Travel AI';

        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${avatar}</div>
                <span class="message-author">${author}</span>
                <span class="message-time">${timeString}</span>
            </div>
            <div class="message-content">${this.formatMessage(content)}</div>
        `;

        this.elements.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Store in history
        this.messageHistory.push({
            content,
            role,
            timestamp: now.toISOString(),
            model
        });
    }

    formatMessage(content) {
        // Convert markdown-style code blocks
        content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'plaintext'}">${this.escapeHtml(code.trim())}</code></pre>`;
        });

        // Convert inline code
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Convert bold text
        content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Convert italic text
        content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Convert line breaks
        content = content.replace(/\n/g, '<br>');

        return content;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        const typingId = 'typing_' + Date.now();
        typingDiv.id = typingId;
        typingDiv.className = 'message assistant';
        
        typingDiv.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">🤖</div>
                <span class="message-author">Quantum Travel AI</span>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        this.elements.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        
        return typingId;
    }

    removeTypingIndicator(typingId) {
        const typingElement = document.getElementById(typingId);
        if (typingElement) {
            typingElement.remove();
        }
    }

    scrollToBottom() {
        this.elements.messagesContainer.scrollTop = 
            this.elements.messagesContainer.scrollHeight;
    }

    startNewChat() {
        if (confirm('Start a new chat? Current conversation will be cleared.')) {
            this.conversationId = null;
            this.messageHistory = [];
            this.elements.messagesContainer.innerHTML = '';
            this.elements.messagesContainer.classList.remove('active');
            this.elements.welcomeScreen.style.display = 'flex';
            this.showNotification('Started new chat');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Example prompt function
function sendExamplePrompt(prompt) {
    const app = window.quantumAI;
    if (app) {
        app.elements.messageInput.value = prompt;
        app.sendMessage();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Quantum Travel AI...');
    window.quantumAI = new QuantumTravelAI();
});

// Add CSS animations
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
`;
document.head.appendChild(style);
