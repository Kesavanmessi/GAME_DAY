import API from "./api";

export const usersAPI = {
  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await API.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    try {
      const response = await API.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user account
  deleteUser: async (userId) => {
    try {
      const response = await API.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await API.post(`/users/${userId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's favorite teams
  getFavoriteTeams: async (userId) => {
    try {
      const response = await API.get(`/users/${userId}/favorites/teams`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add team to favorites
  addFavoriteTeam: async (userId, teamId) => {
    try {
      const response = await API.post(`/users/${userId}/favorites/teams`, { teamId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove team from favorites
  removeFavoriteTeam: async (userId, teamId) => {
    try {
      const response = await API.delete(`/users/${userId}/favorites/teams/${teamId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's favorite leagues
  getFavoriteLeagues: async (userId) => {
    try {
      const response = await API.get(`/users/${userId}/favorites/leagues`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add league to favorites
  addFavoriteLeague: async (userId, leagueId) => {
    try {
      const response = await API.post(`/users/${userId}/favorites/leagues`, { leagueId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove league from favorites
  removeFavoriteLeague: async (userId, leagueId) => {
    try {
      const response = await API.delete(`/users/${userId}/favorites/leagues/${leagueId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's notifications
  getNotifications: async (userId) => {
    try {
      const response = await API.get(`/users/${userId}/notifications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (userId, notificationId) => {
    try {
      const response = await API.patch(`/users/${userId}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete notification
  deleteNotification: async (userId, notificationId) => {
    try {
      const response = await API.delete(`/users/${userId}/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (userId, preferences) => {
    try {
      const response = await API.put(`/users/${userId}/notification-preferences`, preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
