// Universal Monastery Chatbot Component
// This can be included on any page to add the chatbot functionality

(function() {
  'use strict';

  // Add chatbot CSS styles
  function addChatbotStyles() {
    if (document.getElementById('chatbot-styles')) return; // Already added
    
    const style = document.createElement('style');
    style.id = 'chatbot-styles';
    style.textContent = `
      /* Universal Monastery Chatbot Styles */
      .monastery-chatbot {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 10000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .chatbot-toggle {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, #ea580c, #f97316, #fb923c);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(234, 88, 12, 0.4), 0 0 20px rgba(249, 115, 22, 0.3);
        transition: all 0.3s ease;
        position: relative;
        animation: pulse 3s infinite;
        border: 3px solid rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
      }

      .chatbot-toggle:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 15px 40px rgba(234, 88, 12, 0.5), 0 0 25px rgba(249, 115, 22, 0.4);
        border-color: rgba(255, 255, 255, 1);
      }

      .chatbot-toggle i {
        color: white;
        font-size: 1.8rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .toggle-tooltip {
        position: absolute;
        right: 80px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .chatbot-toggle:hover .toggle-tooltip {
        opacity: 1;
        visibility: visible;
      }

      @keyframes pulse {
        0% { 
          box-shadow: 0 10px 30px rgba(234, 88, 12, 0.4), 0 0 20px rgba(249, 115, 22, 0.3);
          transform: scale(1);
        }
        50% { 
          box-shadow: 0 15px 35px rgba(234, 88, 12, 0.6), 0 0 0 15px rgba(249, 115, 22, 0.1), 0 0 25px rgba(249, 115, 22, 0.4);
          transform: scale(1.02);
        }
        100% { 
          box-shadow: 0 10px 30px rgba(234, 88, 12, 0.4), 0 0 20px rgba(249, 115, 22, 0.3);
          transform: scale(1);
        }
      }

      .chatbot-window {
        position: absolute;
        bottom: 90px;
        right: 0;
        width: 380px;
        height: 600px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid rgba(234, 88, 12, 0.1);
      }

      .chatbot-window.active {
        transform: translateY(0) scale(1);
        opacity: 1;
        visibility: visible;
      }

      .chatbot-header {
        background: linear-gradient(135deg, #ea580c, #f97316);
        padding: 1.5rem;
        color: white;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .bot-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }

      .header-text h4 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .header-text p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.9;
      }

      .close-btn {
        margin-left: auto;
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background 0.3s ease;
      }

      .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .message {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
      }

      .message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        flex-shrink: 0;
      }

      .bot-message .message-avatar {
        background: linear-gradient(135deg, #ea580c, #f97316);
        color: white;
      }

      .user-message {
        flex-direction: row-reverse;
      }

      .user-message .message-avatar {
        background: #f3f4f6;
        color: #6b7280;
      }

      .message-content {
        background: #f8fafc;
        padding: 0.75rem 1rem;
        border-radius: 18px;
        max-width: 75%;
        word-wrap: break-word;
      }

      .user-message .message-content {
        background: linear-gradient(135deg, #ea580c, #f97316);
        color: white;
      }

      .message-content p {
        margin: 0;
        line-height: 1.5;
      }

      .quick-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }

      .suggestion-btn {
        background: rgba(234, 88, 12, 0.1);
        border: 1px solid rgba(234, 88, 12, 0.2);
        color: #ea580c;
        padding: 0.5rem 0.75rem;
        border-radius: 16px;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .suggestion-btn:hover {
        background: rgba(234, 88, 12, 0.2);
        transform: translateY(-1px);
      }

      .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
      }

      .typing-dots span {
        width: 8px;
        height: 8px;
        background: #ea580c;
        border-radius: 50%;
        animation: typing 1.4s infinite;
      }

      .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% { opacity: 0.3; }
        30% { opacity: 1; }
      }

      .chatbot-input {
        border-top: 1px solid #e5e7eb;
        background: white;
      }

      .input-container {
        display: flex;
        padding: 1rem;
        gap: 0.75rem;
        align-items: center;
      }

      .chatbot-input input {
        flex: 1;
        border: 2px solid #e5e7eb;
        border-radius: 25px;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        outline: none;
        transition: border-color 0.3s ease;
      }

      .chatbot-input input:focus {
        border-color: #ea580c;
        box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
      }

      .send-btn {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #ea580c, #f97316);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .send-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
      }

      .send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .input-footer {
        padding: 0.5rem 1rem;
        text-align: center;
        border-top: 1px solid #f3f4f6;
      }

      .input-footer small {
        color: #9ca3af;
        font-size: 0.75rem;
      }

      @media (max-width: 768px) {
        .monastery-chatbot {
          bottom: 1rem;
          right: 1rem;
        }
        
        .chatbot-window {
          width: calc(100vw - 2rem);
          height: 70vh;
          max-width: 350px;
        }
        
        .toggle-tooltip {
          display: none;
        }
      }

      .chatbot-messages::-webkit-scrollbar {
        width: 4px;
      }

      .chatbot-messages::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .chatbot-messages::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 2px;
      }

      .chatbot-messages::-webkit-scrollbar-thumb:hover {
        background: #999;
      }
    `;
    document.head.appendChild(style);
  }

  // Create chatbot HTML
  function createChatbotHTML() {
    return `
      <div id="monasteryBot" class="monastery-chatbot">
        <div class="chatbot-toggle" id="chatbotToggle">
          <i class="fas fa-temple-buddhist"></i>
          <div class="toggle-tooltip">Ask about monasteries</div>
        </div>

        <div class="chatbot-window" id="chatbotWindow">
          <div class="chatbot-header">
            <div class="header-content">
              <div class="bot-avatar">
                <i class="fas fa-temple-buddhist"></i>
              </div>
              <div class="header-text">
                <h4>Monastery Guide</h4>
                <p>Ask me about Sikkim's sacred monasteries</p>
              </div>
              <button class="close-btn" id="closeChatbot">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div class="chatbot-messages" id="chatbotMessages">
            <div class="message bot-message welcome-message">
              <div class="message-avatar">
                <i class="fas fa-temple-buddhist"></i>
              </div>
              <div class="message-content">
                <p>🙏 Namaste! I'm your monastery guide. Ask me about any monastery in Sikkim - their history, location, festivals, or visiting tips!</p>
                <div class="quick-suggestions">
                  <button class="suggestion-btn" onclick="sendSuggestion('Tell me about Rumtek Monastery')">Rumtek Monastery</button>
                  <button class="suggestion-btn" onclick="sendSuggestion('What are the major festivals?')">Festival Info</button>
                  <button class="suggestion-btn" onclick="sendSuggestion('Best time to visit monasteries')">Best Time</button>
                </div>
              </div>
            </div>
          </div>

          <div class="typing-indicator" id="typingIndicator" style="display: none;">
            <div class="message bot-message">
              <div class="message-avatar">
                <i class="fas fa-temple-buddhist"></i>
              </div>
              <div class="message-content">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="chatbot-input">
            <div class="input-container">
              <input type="text" id="chatbotInput" placeholder="Ask about monasteries..." maxlength="500">
              <button id="sendMessage" class="send-btn">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
            <div class="input-footer">
              <small>Powered by AI • Monastery360</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Chatbot functionality class
  class MonasteryChatbot {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.apiEndpoint = 'http://127.0.0.1:5000/predict';
      
      this.initializeElements();
      this.attachEventListeners();
      this.initializeChat();
    }

    initializeElements() {
      this.toggle = document.getElementById('chatbotToggle');
      this.window = document.getElementById('chatbotWindow');
      this.closeBtn = document.getElementById('closeChatbot');
      this.messagesContainer = document.getElementById('chatbotMessages');
      this.input = document.getElementById('chatbotInput');
      this.sendBtn = document.getElementById('sendMessage');
      this.typingIndicator = document.getElementById('typingIndicator');
    }

    attachEventListeners() {
      this.toggle.addEventListener('click', () => this.toggleChat());
      this.closeBtn.addEventListener('click', () => this.closeChat());
      this.sendBtn.addEventListener('click', () => this.handleSend());
      
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSend();
        }
      });

      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.window.contains(e.target) && !this.toggle.contains(e.target)) {
          this.closeChat();
        }
      });
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      this.window.classList.add('active');
      this.input.focus();
    }

    closeChat() {
      this.isOpen = false;
      this.window.classList.remove('active');
    }

    async handleSend() {
      const message = this.input.value.trim();
      if (!message) return;

      this.addMessage(message, 'user');
      this.input.value = '';
      this.sendBtn.disabled = true;

      this.showTyping();

      try {
        const response = await this.sendToAPI(message);
        this.hideTyping();
        this.addMessage(response, 'bot');
      } catch (error) {
        this.hideTyping();
        this.addMessage('Sorry, I\'m having trouble connecting. Please try again later or visit our monastery pages directly.', 'bot');
        console.error('Chatbot API Error:', error);
      }

      this.sendBtn.disabled = false;
    }

    async sendToAPI(message) {
      try {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        return data.answer;
      } catch (error) {
        return this.getFallbackResponse(message);
      }
    }

    getFallbackResponse(message) {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('rumtek')) {
        return '🏛️ Rumtek Monastery is one of the most important monasteries in Sikkim! It serves as the seat of the Karmapa and houses precious Buddhist artifacts. Visit our Rumtek page for virtual tours and detailed information.';
      } else if (lowerMessage.includes('enchey')) {
        return '🙏 Enchey Monastery is a beautiful 200-year-old monastery above Gangtok, famous for its annual Cham dance festival. Check out our Enchey page for more details!';
      } else if (lowerMessage.includes('festival') || lowerMessage.includes('cham')) {
        return '🎭 Sikkim monasteries host amazing festivals like Losar (New Year), Saga Dawa, and spectacular Cham masked dances. Each monastery page has a cultural calendar with festival dates!';
      } else if (lowerMessage.includes('visit') || lowerMessage.includes('time')) {
        return '🌸 The best time to visit monasteries is March-May (spring flowers) and October-December (clear mountain views & festivals). Each monastery page has specific visiting information!';
      } else {
        return '🙏 I can help you learn about Sikkim\'s monasteries! Try asking about specific monasteries like Rumtek, Enchey, or Pemayangtse, or ask about festivals, visiting times, and locations.';
      }
    }

    addMessage(content, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}-message`;
      
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.innerHTML = type === 'bot' ? '<i class="fas fa-temple-buddhist"></i>' : '<i class="fas fa-user"></i>';
      
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.innerHTML = `<p>${content}</p>`;
      
      messageDiv.appendChild(avatar);
      messageDiv.appendChild(messageContent);
      
      if (this.typingIndicator.style.display === 'none') {
        this.messagesContainer.appendChild(messageDiv);
      } else {
        this.messagesContainer.insertBefore(messageDiv, this.typingIndicator);
      }
      
      this.scrollToBottom();
    }

    showTyping() {
      this.typingIndicator.style.display = 'block';
      this.scrollToBottom();
    }

    hideTyping() {
      this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
      setTimeout(() => {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }, 100);
    }

    initializeChat() {
      this.scrollToBottom();
    }
  }

  // Global function for suggestion buttons
  window.sendSuggestion = function(text) {
    const chatbot = window.monasteryChatbot;
    if (chatbot) {
      chatbot.input.value = text;
      chatbot.handleSend();
    }
  };

  // Initialize chatbot
  function initChatbot() {
    if (document.getElementById('monasteryBot')) return; // Already exists
    
    addChatbotStyles();
    document.body.insertAdjacentHTML('beforeend', createChatbotHTML());
    window.monasteryChatbot = new MonasteryChatbot();
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }

  // Export for manual initialization
  window.initMonasteryChatbot = initChatbot;
})();