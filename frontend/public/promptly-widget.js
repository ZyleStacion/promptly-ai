// Promptly AI Embeddable Chatbot Widget
// Add this script to any website to embed your chatbot

(function() {
  'use strict';

  const API_BASE = globalThis.PROMPTLY_API_URL || 'http://localhost:3000';

  // Widget styles
  const styles = `
    .promptly-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .promptly-chat-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: transform 0.2s;
    }

    .promptly-chat-button:hover {
      transform: scale(1.1);
    }

    .promptly-chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      height: 550px;
      background: #1f2937;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
    }

    .promptly-chat-window.open {
      transform: scale(1);
      opacity: 1;
    }

    .promptly-chat-header {
      padding: 16px;
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .promptly-chat-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
    }

    .promptly-chat-info {
      flex: 1;
    }

    .promptly-chat-name {
      font-weight: 600;
      font-size: 16px;
    }

    .promptly-chat-status {
      font-size: 12px;
      opacity: 0.7;
    }

    .promptly-chat-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }

    .promptly-chat-close:hover {
      background: rgba(255,255,255,0.1);
    }

    .promptly-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #111827;
    }

    .promptly-message {
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
    }

    .promptly-message.user {
      align-items: flex-end;
    }

    .promptly-message.bot {
      align-items: flex-start;
    }

    .promptly-message-bubble {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 16px;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.6;
    }

    .promptly-message.user .promptly-message-bubble {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      border-radius: 16px 16px 4px 16px;
    }

    .promptly-message.bot .promptly-message-bubble {
      background: #374151;
      color: #F3F4F6;
      border: 1px solid rgba(59, 130, 246, 0.25);
      border-radius: 16px 16px 16px 4px;
    }

    .promptly-chat-input-container {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      gap: 8px;
    }

    .promptly-chat-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #4b5563;
      border-radius: 8px;
      background: #374151;
      color: white;
      font-size: 14px;
      outline: none;
    }

    .promptly-chat-input:focus {
      border-color: #3b82f6;
    }

    .promptly-chat-send {
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .promptly-chat-send:hover:not(:disabled) {
      opacity: 0.9;
    }

    .promptly-chat-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .promptly-typing {
      display: flex;
      gap: 4px;
      padding: 8px 12px;
    }

    .promptly-typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #9ca3af;
      animation: promptly-typing-anim 1.4s infinite;
    }

    .promptly-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .promptly-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes promptly-typing-anim {
      0%, 60%, 100% { opacity: 0.3; }
      30% { opacity: 1; }
    }

    @media (max-width: 480px) {
      .promptly-chat-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 140px);
        right: 20px;
        left: 20px;
      }
    }
  `;

  class PromptlyWidget {
    constructor(config) {
      this.chatbotId = config.chatbotId;
      this.chatbot = null;
      this.messages = [];
      this.isOpen = false;
      this.isLoading = false;
      
      this.init();
    }

    async init() {
      // Inject styles
      if (!document.getElementById('promptly-widget-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'promptly-widget-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
      }

      // Fetch chatbot config
      await this.fetchChatbotConfig();

      // Create widget elements
      this.createWidget();
      
      // Add welcome message
      const welcomeMsg = this.chatbot?.welcomeMessage 
        || `Hi! I'm ${this.chatbot?.name || 'Assistant'}. How can I help you today?`;
      
      this.addMessage('bot', welcomeMsg);
    }

    async fetchChatbotConfig() {
      try {
        const response = await fetch(`${API_BASE}/chat/config/${this.chatbotId}`);
        const data = await response.json();
        if (data.success) {
          this.chatbot = data.chatbot;
        }
      } catch (err) {
        console.error('Failed to fetch chatbot config:', err);
        this.chatbot = {
          name: 'Assistant',
          primaryColor: '#3B82F6',
          welcomeMessage: 'Hi! How can I help you today?'
        };
      }
    }

    createWidget() {
      const container = document.createElement('div');
      container.className = 'promptly-widget-container';
      container.innerHTML = `
        <button class="promptly-chat-button" id="promptly-toggle-btn" style="background: ${this.chatbot?.primaryColor || '#3B82F6'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11a8.38 8.38 0 0 0-.9-3.8 8.5 8.5 0 1 0-7.6 12.5 8.38 8.38 0 0 0 3.8-.9l4.5 1-1-4.5Z"></path>
          </svg>
        </button>
        <div class="promptly-chat-window" id="promptly-chat-window">
          <div class="promptly-chat-header" style="background: ${this.chatbot?.primaryColor || '#3B82F6'}">
            <div class="promptly-chat-avatar" style="background: rgba(255,255,255,0.2); overflow: hidden;">
              ${this.chatbot?.profilePicture 
                ? `<img src="${this.chatbot.profilePicture}" alt="${this.chatbot.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
                : (this.chatbot?.name?.charAt(0) || '🤖')}
            </div>
            <div class="promptly-chat-info">
              <div class="promptly-chat-name">${this.chatbot?.name || 'Assistant'}</div>
              <div class="promptly-chat-status">Online</div>
            </div>
            <button class="promptly-chat-close" id="promptly-close-btn">×</button>
          </div>
          <div class="promptly-chat-messages" id="promptly-messages"></div>
          <div class="promptly-chat-input-container">
            <input type="text" class="promptly-chat-input" id="promptly-input" placeholder="Type a message..." />
            <button class="promptly-chat-send" id="promptly-send-btn" style="background: ${this.chatbot?.primaryColor || '#3B82F6'}">Send</button>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      // Add event listeners
      document.getElementById('promptly-toggle-btn').addEventListener('click', () => this.toggle());
      document.getElementById('promptly-close-btn').addEventListener('click', () => this.close());
      document.getElementById('promptly-send-btn').addEventListener('click', () => this.sendMessage());
      document.getElementById('promptly-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    toggle() {
      this.isOpen = !this.isOpen;
      const window = document.getElementById('promptly-chat-window');
      if (this.isOpen) {
        window.classList.add('open');
      } else {
        window.classList.remove('open');
      }
    }

    close() {
      this.isOpen = false;
      document.getElementById('promptly-chat-window').classList.remove('open');
    }

    addMessage(role, content) {
      this.messages.push({ role, content });
      this.renderMessages();
    }

    renderMessages() {
      const container = document.getElementById('promptly-messages');
      container.innerHTML = this.messages.map((msg, i) => {
        if (msg.role === 'user') {
          return `
            <div class="promptly-message user">
              <div class="promptly-message-bubble" style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white;">
                ${this.formatMessage(msg.content)}
              </div>
            </div>
          `;
        } else {
          const profilePicture = this.chatbot?.profilePicture;
          const avatarContent = profilePicture
            ? `<img src="${profilePicture}" alt="${this.chatbot?.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
            : `${this.chatbot?.name?.charAt(0) || '🤖'}`;
          
          return `
            <div class="promptly-message bot">
              <div class="promptly-message-bubble" style="background: #374151; color: #F3F4F6; border: 1px solid ${this.chatbot?.primaryColor}40;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: ${this.chatbot?.primaryColor || '#3B82F6'}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white; overflow: hidden;">
                    ${avatarContent}
                  </div>
                  <span style="font-size: 12px; font-weight: 600; color: #9CA3AF;">${this.chatbot?.name || 'Assistant'}</span>
                </div>
                ${this.formatMessage(msg.content)}
              </div>
            </div>
          `;
        }
      }).join('');
      container.scrollTop = container.scrollHeight;
    }

    formatMessage(content) {
      const text = String(content || "");
      // Basic escape
      const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

      // Parse block-level markdown (headings, lists, code blocks)
      const lines = esc(text).split(/\r?\n/);
      let out = '';
      let inUl = false;
      let inOl = false;
      let inCode = false;

      const closeLists = () => {
        if (inUl) { out += '</ul>'; inUl = false; }
        if (inOl) { out += '</ol>'; inOl = false; }
      };

      for (let line of lines) {
        // Fenced code block
        if (line.trim().startsWith('```')) {
          if (!inCode) {
            closeLists();
            inCode = true;
            out += '<pre style="background:#1F2937;border:1px solid #374151;border-radius:8px;padding:10px;overflow:auto"><code>';
          } else {
            inCode = false;
            out += '</code></pre>';
          }
          continue;
        }
        if (inCode) {
          out += line + '\n';
          continue;
        }

        // Headings
        if (/^###\s+/.test(line)) { closeLists(); out += `<h3 style="font-weight:700;margin:8px 0 6px 0">${line.replace(/^###\s+/, '')}</h3>`; continue; }
        if (/^##\s+/.test(line)) { closeLists(); out += `<h2 style="font-weight:700;margin:10px 0 6px 0">${line.replace(/^##\s+/, '')}</h2>`; continue; }
        if (/^#\s+/.test(line))  { closeLists(); out += `<h1 style="font-weight:700;margin:12px 0 6px 0">${line.replace(/^#\s+/, '')}</h1>`;  continue; }

        // Unordered list
        if (/^\s*[-*]\s+/.test(line)) {
          if (!inUl) { closeLists(); inUl = true; out += '<ul style="padding-left:18px;margin:6px 0">'; }
          const item = line.replace(/^\s*[-*]\s+/, '');
          out += `<li>${item}</li>`;
          continue;
        } else if (inUl) {
          out += '</ul>'; inUl = false;
        }

        // Ordered list
        if (/^\s*\d+\.\s+/.test(line)) {
          if (!inOl) { closeLists(); inOl = true; out += '<ol style="padding-left:18px;margin:6px 0">'; }
          const item = line.replace(/^\s*\d+\.\s+/, '');
          out += `<li>${item}</li>`;
          continue;
        } else if (inOl) {
          out += '</ol>'; inOl = false;
        }

        // Paragraphs / line breaks
        if (line.trim() === '') {
          closeLists();
          out += '<br/>';
          continue;
        }

        // Inline bold/italic/code
        line = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`([^`]+)`/g, '<code style="background:#1F2937;padding:2px 6px;border-radius:4px">$1</code>');

        out += `<p>${line}</p>`;
      }
      closeLists();
      return out;
    }

    async sendMessage() {
      const input = document.getElementById('promptly-input');
      const message = input.value.trim();
      
      if (!message || this.isLoading) return;

      input.value = '';
      this.addMessage('user', message);
      this.isLoading = true;
      document.getElementById('promptly-send-btn').disabled = true;

      // Add typing indicator with chatbot name
      const container = document.getElementById('promptly-messages');
      container.innerHTML += `
        <div class="promptly-message bot" id="promptly-typing-indicator">
          <div class="promptly-message-bubble" style="background: #374151; color: #F3F4F6; border: 1px solid ${this.chatbot?.primaryColor}40; display: flex; align-items: center; gap: 8px;">
            <div class="promptly-typing">
              <div class="promptly-typing-dot"></div>
              <div class="promptly-typing-dot"></div>
              <div class="promptly-typing-dot"></div>
            </div>
            <span style="font-size: 13px; color: #9CA3AF;">${this.chatbot?.name || 'Assistant'} is typing...</span>
          </div>
        </div>
      `;
      container.scrollTop = container.scrollHeight;

      try {
        const response = await fetch(`${API_BASE}/chat/public`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message,
            chatbotId: this.chatbotId 
          })
        });

        // Remove typing indicator
        const typingIndicator = document.getElementById('promptly-typing-indicator');
        if (typingIndicator) typingIndicator.remove();

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botResponse = '';

        // Add empty bot message
        this.messages.push({ role: 'bot', content: '' });
        const botMsgIndex = this.messages.length - 1;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.trim().split('\n');

          for (const line of lines) {
            if (line.startsWith('{')) {
              try {
                const json = JSON.parse(line);
                if (json.response) {
                  botResponse += json.response;
                  this.messages[botMsgIndex].content = botResponse;
                  this.renderMessages();
                }
              // eslint-disable-next-line no-unused-vars
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (err) {
        console.error('Chat error:', err);
        this.addMessage('bot', '⚠️ Sorry, something went wrong. Please try again.');
      } finally {
        this.isLoading = false;
        document.getElementById('promptly-send-btn').disabled = false;
      }
    }
  }

  // Auto-initialize if data-promptly-chatbot-id attribute exists
  globalThis.addEventListener('DOMContentLoaded', () => {
    const chatbotElement = document.querySelector('[data-promptly-chatbot-id]');
    if (chatbotElement) {
      const chatbotId = chatbotElement.getAttribute('data-promptly-chatbot-id');
      globalThis.promptlyWidget = new PromptlyWidget({ chatbotId });
    }
  });

  // Expose for manual initialization
  globalThis.PromptlyWidget = PromptlyWidget;
})();
