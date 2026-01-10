import { useEffect, useRef } from 'react';
import { API_URL } from '../../api/api';

/**
 * ChatbotWidget Component
 * 
 * Reusable component to embed Promptly chatbot in React applications.
 * The widget will fetch chatbot config (including profile picture) from the backend
 * and display it in an embedded chat interface.
 * 
 * Usage:
 * <ChatbotWidget chatbotId="YOUR_CHATBOT_ID" />
 * 
 * Props:
 * - chatbotId: string (required) - The ID of your chatbot
 * - apiUrl: string (optional) - Backend API URL (default: from env VITE_API_URL)
 * - widgetScript: string (optional) - Widget script URL (default: production CDN)
 * 
 * Features:
 * - Profile pictures stored in MongoDB (served via /chat/picture/:id)
 * - Automatic widget initialization
 * - Proper error handling and logging
 * - Multiple widget support on same page
 */
const ChatbotWidget = ({ 
  chatbotId,
  apiUrl = API_URL,
  widgetScript = 'http://52.21.46.81.nip.io/promptly-widget.js'
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!chatbotId) {
      console.error('❌ ChatbotWidget: chatbotId is required');
      return;
    }

    // Set global API URL
    window.PROMPTLY_API_URL = apiUrl;

    // Create the chatbot div if it doesn't exist
    if (containerRef.current && !containerRef.current.querySelector('[data-promptly-chatbot-id]')) {
      const chatbotDiv = document.createElement('div');
      chatbotDiv.setAttribute('data-promptly-chatbot-id', chatbotId);
      containerRef.current.appendChild(chatbotDiv);
    }

    // Load widget script if not already loaded
    if (!window.promptlyWidgetLoaded && !window.PromptlyWidget) {
      const script = document.createElement('script');
      script.src = widgetScript;
      script.async = true;
      script.onload = () => {
        window.promptlyWidgetLoaded = true;
        console.log('✅ Promptly widget loaded successfully');
        
        // Manually initialize the widget since DOMContentLoaded already fired
        if (window.PromptlyWidget) {
          const chatbotElement = document.querySelector('[data-promptly-chatbot-id]');
          if (chatbotElement) {
            const id = chatbotElement.getAttribute('data-promptly-chatbot-id');
            if (!window.promptlyWidgetInstance) {
              window.promptlyWidgetInstance = new window.PromptlyWidget({ chatbotId: id });
              console.log('✅ Widget initialized with chatbot ID:', id);
            }
          }
        }
      };
      script.onerror = () => {
        console.error('❌ Failed to load Promptly widget:', widgetScript);
      };
      document.body.appendChild(script);
    } else if (window.PromptlyWidget && !window.promptlyWidgetInstance) {
      // Script already loaded, manually initialize
      const chatbotElement = document.querySelector('[data-promptly-chatbot-id]');
      if (chatbotElement) {
        const id = chatbotElement.getAttribute('data-promptly-chatbot-id');
        if (!window.promptlyWidgetInstance) {
          window.promptlyWidgetInstance = new window.PromptlyWidget({ chatbotId: id });
          console.log('✅ Widget initialized with chatbot ID:', id);
        }
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, [chatbotId, apiUrl, widgetScript]);

  return <div ref={containerRef} />;
};

export default ChatbotWidget;
