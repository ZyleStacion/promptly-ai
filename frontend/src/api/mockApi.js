// API module for frontend
// Automatically switches between mock and real API based on USE_MOCK_API flag

export const USE_MOCK_API = false; // Toggle this to switch between mock and real API

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ============= REAL API IMPLEMENTATION =============

const realApi = {
  // Get auth token from localStorage
  getAuthToken: () => localStorage.getItem("token"),

  // Set common headers with auth token
  getHeaders: () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${realApi.getAuthToken()}`,
  }),

  // Auth
  async registerUser(data) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("token", result.token);
    }
    return result;
  },

  async loginUser(data) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    }
    return result;
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "GET",
      headers: realApi.getHeaders(),
    });
    return response.json();
  },

  // Chatbots CRUD
  async getChatbots() {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: "GET",
      headers: realApi.getHeaders(),
    });
    const data = await response.json();
    // Ensure compatibility with frontend expectations
    return {
      success: response.ok,
      chatbots: data.chatbots || [],
    };
  },

  async getChatbot(id) {
    const response = await fetch(`${API_BASE_URL}/chatbot/${id}`, {
      method: "GET",
      headers: realApi.getHeaders(),
    });
    const data = await response.json();
    return {
      success: response.ok,
      chatbot: data.chatbot || null,
    };
  },

  async createChatbot(data) {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: "POST",
      headers: realApi.getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || "Chatbot created successfully",
      chatbot: result.chatbot,
    };
  },

  async updateChatbot(id, data) {
    const response = await fetch(`${API_BASE_URL}/chatbot/${id}`, {
      method: "PUT",
      headers: realApi.getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || "Chatbot updated successfully",
      chatbot: result.chatbot,
    };
  },

  async deleteChatbot(id) {
    const response = await fetch(`${API_BASE_URL}/chatbot/${id}`, {
      method: "DELETE",
      headers: realApi.getHeaders(),
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || "Chatbot deleted successfully",
    };
  },

  // Chat
  async sendMessage(chatbotId, message) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: realApi.getHeaders(),
      body: JSON.stringify({ message, chatbotId }),
    });
    return response.json();
  },

  async getChatHistory(chatbotId) {
    const response = await fetch(`${API_BASE_URL}/chat/history/${chatbotId}`, {
      method: "GET",
      headers: realApi.getHeaders(),
    });
    return response.json();
  },

  // User Account Management
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "GET",
      headers: realApi.getHeaders(),
    });
    return response.json();
  },

  async updateUserProfile(formData) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${realApi.getAuthToken()}`,
      },
      body: formData,
    });
    return response.json();
  },

  async changePassword(data) {
    const response = await fetch(`${API_BASE_URL}/user/password`, {
      method: "POST",
      headers: realApi.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteAccount() {
    const response = await fetch(`${API_BASE_URL}/user/account`, {
      method: "DELETE",
      headers: realApi.getHeaders(),
    });
    return response.json();
  },
};

// ============= MOCK API IMPLEMENTATION =============

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user data
let mockUser = {
  id: "mock-user-123",
  email: "developer@example.com",
  username: "John Developer",
  profileImage: null,
  createdAt: new Date().toISOString(),
};

// Mock chatbots data
const mockChatbots = [
  {
    _id: "chatbot-1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets",
    status: "active",
    createdAt: "2024-12-01T10:00:00Z",
  },
  {
    _id: "chatbot-2",
    name: "Sales Assistant",
    description: "Helps with product recommendations and sales",
    status: "active",
    createdAt: "2024-12-03T14:30:00Z",
  },
];

const mockApi = {
  async registerUser(data) {
    await delay();
    return {
      success: true,
      message: "User registered successfully",
      token: "mock-jwt-token-12345",
      user: { ...mockUser, email: data.email, username: data.username },
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
    return { success: true, user: mockUser };
  },

  async getChatbots() {
    await delay();
    return { success: true, chatbots: mockChatbots };
  },

  async getChatbot(id) {
    await delay();
    const chatbot = mockChatbots.find((bot) => bot._id === id);
    return { success: true, chatbot: chatbot || null };
  },

  async createChatbot(data) {
    await delay();
    const newChatbot = {
      _id: `chatbot-${Date.now()}`,
      ...data,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    mockChatbots.push(newChatbot);
    return {
      success: true,
      message: "Chatbot created successfully",
      chatbot: newChatbot,
    };
  },

  async updateChatbot(id, data) {
    await delay();
    const index = mockChatbots.findIndex((bot) => bot._id === id);
    if (index !== -1) {
      mockChatbots[index] = { ...mockChatbots[index], ...data };
      return {
        success: true,
        message: "Chatbot updated successfully",
        chatbot: mockChatbots[index],
      };
    }
    return { success: false, error: "Chatbot not found" };
  },

  async deleteChatbot(id) {
    await delay();
    const index = mockChatbots.findIndex((bot) => bot._id === id);
    if (index !== -1) {
      mockChatbots.splice(index, 1);
    }
    return { success: true, message: "Chatbot deleted successfully" };
  },

  async sendMessage(chatbotId, message) {
    await delay(500);
    return {
      success: true,
      response: "That's a great question! Let me help you with that.",
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

  async getUserProfile() {
    await delay();
    return { success: true, user: mockUser };
  },

  async updateUserProfile(formData) {
    await delay();
    const username = formData.get("username");
    const email = formData.get("email");
    const profileImage = formData.get("profileImage");

    if (username) mockUser.username = username;
    if (email) mockUser.email = email;
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
    if (!data.currentPassword || !data.newPassword) {
      return {
        success: false,
        message: "Both current and new password are required",
      };
    }
    return { success: true, message: "Password changed successfully" };
  },

  async deleteAccount() {
    await delay();
    mockUser = {
      id: "mock-user-123",
      email: "developer@example.com",
      username: "John Developer",
      profileImage: null,
      createdAt: new Date().toISOString(),
    };
    return { success: true, message: "Account deleted successfully" };
  },
};

// ============= EXPORT =============

// Use real API if token exists, otherwise use mock
export const api = USE_MOCK_API || !localStorage.getItem("token") ? mockApi : realApi;

// For backward compatibility, export mockApi separately
export { mockApi };

// Helper to get mock data directly (for development)
export const getMockData = () => ({
  user: mockUser,
  chatbots: mockChatbots,
});

