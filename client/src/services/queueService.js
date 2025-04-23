// client/src/services/queueService.js
import apiClient from './apiClient';

/**
 * Service for queue-related API operations
 */
const queueService = {
    /**
     * Get all queue items
     * @param {number} skip - Number of items to skip
     * @param {number} limit - Number of items to return
     * @returns {Promise<any>} - Response data
     */
    async getQueueItems(skip = 0, limit = 100) {
        return apiClient.get(`/api/v1/queue?skip=${skip}&limit=${limit}`);
    },

    /**
     * Get queue item by ID
     * @param {number} id - Queue item ID
     * @returns {Promise<any>} - Response data
     */
    async getQueueItemById(id) {
        return apiClient.get(`/api/v1/queue/${id}`);
    },

    /**
     * Create a new queue item
     * @param {object} data - Queue item data
     * @returns {Promise<any>} - Response data
     */
    async createQueueItem(data) {
        return apiClient.post('/api/v1/queue', data);
    },

    /**
     * Process a queue item
     * @param {number} id - Queue item ID
     * @returns {Promise<any>} - Response data
     */
    async processQueueItem(id) {
        return apiClient.post(`/api/v1/queue/${id}/process`);
    },

    /**
     * Reprocess a queue item
     * @param {number} id - Queue item ID
     * @returns {Promise<any>} - Response data
     */
    async reprocessQueueItem(id) {
        return apiClient.post(`/api/v1/queue/${id}/reprocess`);
    },

    /**
     * Update a queue item
     * @param {number} id - Queue item ID
     * @param {object} data - Queue item data
     * @returns {Promise<any>} - Response data
     */
    async updateQueueItem(id, data) {
        return apiClient.put(`/api/v1/queue/${id}`, data);
    },

    /**
     * Delete a queue item
     * @param {number} id - Queue item ID
     * @returns {Promise<any>} - Response data
     */
    async deleteQueueItem(id) {
        return apiClient.delete(`/api/v1/queue/${id}`);
    }
};

export default queueService;