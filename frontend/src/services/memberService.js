// frontend/src/services/memberService.js
import api from "./api";

export const memberService = {
  /**
   * Get all members with optional filters and pagination
   * @param {Object} params - Query parameters (page, limit, search, status, packageType)
   * @returns {Promise} - Members data with pagination info
   */
  getMembers: async (params = {}) => {
    try {
      const response = await api.get("/api/members", { params });
      return response.data;
    } catch (error) {
      console.error("Get members error:", error);
      throw error.response?.data || { message: "Failed to fetch members" };
    }
  },

  /**
   * Get member by ID
   * @param {string} id - Member ID
   * @returns {Promise} - Member data
   */
  getMemberById: async (id) => {
    try {
      const response = await api.get(`/api/members/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get member by ID error:", error);
      throw error.response?.data || { message: "Failed to fetch member details" };
    }
  },

  /**
   * Add new member
   * @param {Object} data - Member data (fullName, email, phone, address, packageType)
   * @returns {Promise} - Created member data
   */
  addMember: async (data) => {
    try {
      const response = await api.post("/api/members", data);
      return response.data;
    } catch (error) {
      console.error("Add member error:", error);
      throw error.response?.data || { message: "Failed to add member" };
    }
  },

  /**
   * Update member
   * @param {string} id - Member ID
   * @param {Object} data - Updated member data
   * @returns {Promise} - Updated member data
   */
  updateMember: async (id, data) => {
    try {
      const response = await api.put(`/api/members/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Update member error:", error);
      throw error.response?.data || { message: "Failed to update member" };
    }
  },

  /**
   * Delete member
   * @param {string} id - Member ID
   * @returns {Promise} - Deletion confirmation
   */
  deleteMember: async (id) => {
    try {
      const response = await api.delete(`/api/members/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete member error:", error);
      throw error.response?.data || { message: "Failed to delete member" };
    }
  },

  /**
   * Get member statistics
   * @returns {Promise} - Statistics data
   */
  getMemberStats: async () => {
    try {
      const response = await api.get("/api/members/stats");
      return response.data;
    } catch (error) {
      console.error("Get member stats error:", error);
      throw error.response?.data || { message: "Failed to fetch statistics" };
    }
  },

  /**
   * Renew member's membership
   * @param {string} id - Member ID
   * @param {Object} data - Renewal data (packageType, paymentAmount, paymentMethod, transactionId)
   * @returns {Promise} - Renewed member data
   */
  renewMembership: async (id, data) => {
    try {
      const response = await api.post(`/api/members/${id}/renew`, data);
      return response.data;
    } catch (error) {
      console.error("Renew membership error:", error);
      throw error.response?.data || { message: "Failed to renew membership" };
    }
  },

  /**
   * Search members by query
   * @param {string} query - Search query
   * @returns {Promise} - Search results
   */
  searchMembers: async (query) => {
    try {
      const response = await api.get("/api/members", {
        params: { search: query, limit: 20 }
      });
      return response.data;
    } catch (error) {
      console.error("Search members error:", error);
      throw error.response?.data || { message: "Failed to search members" };
    }
  },

  /**
   * Get members by status
   * @param {string} status - Member status (active, inactive, expired, suspended)
   * @returns {Promise} - Members with specified status
   */
  getMembersByStatus: async (status) => {
    try {
      const response = await api.get("/api/members", {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error("Get members by status error:", error);
      throw error.response?.data || { message: "Failed to fetch members by status" };
    }
  },

  /**
   * Get members by package type
   * @param {string} packageType - Package type (trial, basic, premium, elite)
   * @returns {Promise} - Members with specified package
   */
  getMembersByPackage: async (packageType) => {
    try {
      const response = await api.get("/api/members", {
        params: { packageType }
      });
      return response.data;
    } catch (error) {
      console.error("Get members by package error:", error);
      throw error.response?.data || { message: "Failed to fetch members by package" };
    }
  },

  /**
   * Get expiring memberships
   * @param {number} days - Number of days to check (default: 7)
   * @returns {Promise} - Members with expiring memberships
   */
  getExpiringMemberships: async (days = 7) => {
    try {
      // This would need a backend endpoint, for now using stats
      const response = await api.get("/api/members/stats");
      return {
        success: true,
        count: response.data.data.expiringSoon
      };
    } catch (error) {
      console.error("Get expiring memberships error:", error);
      throw error.response?.data || { message: "Failed to fetch expiring memberships" };
    }
  }
};