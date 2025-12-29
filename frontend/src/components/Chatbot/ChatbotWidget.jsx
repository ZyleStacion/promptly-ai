import { useEffect, useRef } from 'react';

/**
 * ChatbotWidget Component
 * 
 * Reusable component to embed Promptly chatbot in React applications
 * 
 * Usage:
 * <ChatbotWidget chatbotId="YOUR_CHATBOT_ID" />
 * 
 * Props:
 * - chatbotId: string (required) - The ID of your chatbot
 * - apiUrl: string (optional) - Backend API URL (default: http://localhost:3000)
 * - widgetScript: string (optional) - Widget script URL (default: http://localhost:5173/promptly-widget.js)
 */
const ChatbotWidget = ({ 
  chatbotId = '6951ca5594649fca1064b26e',
  apiUrl = 'http://localhost:3000',
  widgetScript = 'http://localhost:5173/promptly-widget.js'
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
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
