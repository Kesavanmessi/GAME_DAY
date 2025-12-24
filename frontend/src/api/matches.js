import API from "./api";

export const matchesAPI = {
  // Get all matches with optional filters
  getMatches: async (filters = {}) => {
    try {
      const response = await API.get("/matches", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get match by ID
  getMatchById: async (matchId) => {
    try {
      const response = await API.get(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get live matches
  getLiveMatches: async () => {
    try {
      const response = await API.get("/matches/live");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get upcoming matches
  getUpcomingMatches: async (limit = 10) => {
    try {
      const response = await API.get("/matches/upcoming", { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get match statistics
  getMatchStats: async (matchId) => {
    try {
      const response = await API.get(`/matches/${matchId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get match events (goals, cards, substitutions, etc.)
  getMatchEvents: async (matchId) => {
    try {
      const response = await API.get(`/matches/${matchId}/events`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get match lineups
  getMatchLineups: async (matchId) => {
    try {
      const response = await API.get(`/matches/${matchId}/lineups`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get head-to-head statistics between two teams
  getHeadToHead: async (team1Id, team2Id) => {
    try {
      const response = await API.get(`/matches/head-to-head/${team1Id}/${team2Id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get match predictions
  getMatchPredictions: async (matchId) => {
    try {
      const response = await API.get(`/matches/${matchId}/predictions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get match comments
  getMatchComments: async (matchId, queryParams = {}) => {
    try {
      const response = await API.get(`/matches/${matchId}/comments`, { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Post a comment on a match
  postMatchComment: async (matchId, comment) => {
    try {
      const response = await API.post(`/matches/${matchId}/comments`, { comment });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Like/Unlike a match
  toggleMatchLike: async (matchId) => {
    try {
      const response = await API.post(`/matches/${matchId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get users who liked a match
  getMatchLikes: async (matchId) => {
    try {
      const response = await API.get(`/matches/${matchId}/likes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get match highlights
  getMatchHighlights: async (matchId) => {
    try {
      const response = await API.get(`/matches/${matchId}/highlights`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default matchesAPI;
