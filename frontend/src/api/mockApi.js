// Mock API for frontend development without backend
// Set USE_MOCK_API to true to use mock data instead of real API calls

export const USE_MOCK_API = true; // Toggle this to switch between mock and real API

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user data - stored in memory to persist changes during session
let mockUser = {
  id: "mock-user-123",
  email: "developer@example.com",
  username: "John Developer",
  profileImage: null, // Can be updated via settings
  createdAt: new Date().toISOString(),
};

// Mock chatbots data
const mockChatbots = [
  {
    id: "chatbot-1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets",
    createdAt: "2024-12-01T10:00:00Z",
    status: "active",
    conversations: 142,
  },
  {
    id: "chatbot-2",
    name: "Sales Assistant",
    description: "Helps with product recommendations and sales",
    createdAt: "2024-12-03T14:30:00Z",
    status: "active",
    conversations: 87,
  },
  {
    id: "chatbot-3",
    name: "FAQ Bot",
    description: "Answers frequently asked questions",
    createdAt: "2024-12-04T09:15:00Z",
    status: "inactive",
    conversations: 23,
  },
];

// Mock API functions
export const mockApi = {
  // Auth
  async registerUser(data) {
    await delay();
    return {
      success: true,
      message: "User registered successfully",
      token: "mock-jwt-token-12345",
      user: { ...mockUser, email: data.email, name: data.name },
    };
  },

  async loginUser(data) {
    await delay();
    return {
      success: true,
      message: "Login successful",
      token: "mock-jwt-token-12345",
      user: mockUser,
    };
  },

  async getCurrentUser() {
    await delay();
    return {
      success: true,
      user: mockUser,
    };
  },

  // Chatbots
  async getChatbots() {
    await delay();
    return {
      success: true,
      chatbots: mockChatbots,
    };
  },

  async getChatbot(id) {
    await delay();
    const chatbot = mockChatbots.find((bot) => bot.id === id);
    return {
      success: true,
      chatbot: chatbot || null,
    };
  },

  async createChatbot(data) {
    await delay();
    const newChatbot = {
      id: `chatbot-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: "active",
      conversations: 0,
    };
    return {
      success: true,
      message: "Chatbot created successfully",
      chatbot: newChatbot,
    };
  },

  async updateChatbot(id, data) {
    await delay();
    const chatbot = mockChatbots.find((bot) => bot.id === id);
    return {
      success: true,
      message: "Chatbot updated successfully",
      chatbot: { ...chatbot, ...data },
    };
  },

  async deleteChatbot(id) {
    await delay();
    return {
      success: true,
      message: "Chatbot deleted successfully",
    };
  },

  // Chat
  async sendMessage(chatbotId, message) {
    await delay(500);
    const responses = [
      "That's a great question! Let me help you with that.",
      "I understand. Here's what I can tell you...",
      "Thank you for reaching out. The answer is...",
      "Based on your question, I'd recommend...",
      "Let me provide you with more information about that.",
    ];
    return {
      success: true,
      response: responses[Math.floor(Math.random() * responses.length)],
    };
  },

  async getChatHistory(chatbotId) {
    await delay();
    return {
      success: true,
      messages: [
        {
          id: "1",
          role: "user",
          content: "Hello!",
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          role: "assistant",
          content: "Hi! How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  },

  // User Account Management
  async getUserProfile() {
    await delay();
    return {
      success: true,
      user: mockUser,
    };
  },

  async updateUserProfile(formData) {
    await delay();

    // Extract data from FormData
    const username = formData.get("username");
    const email = formData.get("email");
    const profileImage = formData.get("profileImage");

    // Update mock user
    if (username) mockUser.username = username;
    if (email) mockUser.email = email;

    // Simulate file upload
    if (profileImage && profileImage.name) {
      mockUser.profileImage = `/uploads/${Date.now()}-${profileImage.name}`;
    }

    return {
      success: true,
      message: "Profile updated successfully",
      user: mockUser,
    };
  },

  async changePassword(data) {
    await delay();

    // Simple validation
    if (!data.currentPassword || !data.newPassword) {
      return {
        success: false,
        message: "Both current and new password are required",
      };
    }

    return {
      success: true,
      message: "Password changed successfully",
    };
  },

  async deleteAccount() {
    await delay();

    // Reset mock user to default
    mockUser = {
      id: "mock-user-123",
      email: "developer@example.com",
      username: "John Developer",
      profileImage: null,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: "Account deleted successfully",
    };
  },
};

// Helper to get mock data directly (for development)
export const getMockData = () => ({
  user: mockUser,
  chatbots: mockChatbots,
});
