import API from "./api";

export const leaguesAPI = {
  // Get all leagues
  getAllLeagues: async (queryParams = {}) => {
    try {
      const response = await API.get("/leagues", { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get league by ID
  getLeagueById: async (leagueId) => {
    try {
      const response = await API.get(`/leagues/${leagueId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new league (admin only)
  createLeague: async (leagueData) => {
    try {
      const response = await API.post("/leagues", leagueData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update league (admin only)
  updateLeague: async (leagueId, leagueData) => {
    try {
      const response = await API.put(`/leagues/${leagueId}`, leagueData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete league (admin only)
  deleteLeague: async (leagueId) => {
    try {
      const response = await API.delete(`/leagues/${leagueId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get teams in a league
  getLeagueTeams: async (leagueId) => {
    try {
      const response = await API.get(`/leagues/${leagueId}/teams`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get matches in a league
  getLeagueMatches: async (leagueId, queryParams = {}) => {
    try {
      const response = await API.get(`/leagues/${leagueId}/matches`, { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get league standings
  getLeagueStandings: async (leagueId) => {
    try {
      const response = await API.get(`/leagues/${leagueId}/standings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get league statistics
  getLeagueStats: async (leagueId) => {
    try {
      const response = await API.get(`/leagues/${leagueId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Subscribe to league updates
  subscribeToLeague: async (leagueId) => {
    try {
      const response = await API.post(`/leagues/${leagueId}/subscribe`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Unsubscribe from league updates
  unsubscribeFromLeague: async (leagueId) => {
    try {
      const response = await API.post(`/leagues/${leagueId}/unsubscribe`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get league news
  getLeagueNews: async (leagueId, queryParams = {}) => {
    try {
      const response = await API.get(`/leagues/${leagueId}/news`, { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get league videos
  getLeagueVideos: async (leagueId, queryParams = {}) => {
    try {
      const response = await API.get(`/leagues/${leagueId}/videos`, { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get league photos
  getLeaguePhotos: async (leagueId, queryParams = {}) => {
    try {
      const response = await API.get(`/leagues/${leagueId}/photos`, { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
