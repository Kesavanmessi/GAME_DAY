import API from "./api";

export const authAPI = {
  // Google Login
  googleLogin: async (token) => {
    try {
      const response = await API.post("/auth/google", { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await API.get("/auth/me");
      return response.data.user;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await API.put("/auth/update-profile", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await API.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
