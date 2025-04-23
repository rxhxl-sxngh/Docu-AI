// client/src/services/resultService.js
import apiClient from './apiClient';

/**
 * Service for result-related API operations
 */
const resultService = {
    /**
     * Get result by ID
     * @param {number} id - Result ID
     * @returns {Promise<any>} - Response data
     */
    async getResultById(id) {
        return apiClient.get(`/api/v1/results/${id}`);
    },

    /**
     * Get result by document ID
     * @param {number} documentId - Document ID
     * @returns {Promise<any>} - Response data
     */
    async getResultByDocumentId(documentId) {
        return apiClient.get(`/api/v1/results/document/${documentId}`);
    },

    /**
     * Validate a result (approve or reject)
     * @param {number} id - Result ID
     * @param {string} status - Validation status ('validated' or 'rejected')
     * @param {string} notes - Optional validation notes
     * @returns {Promise<any>} - Response data
     */
    async validateResult(id, status, notes = null) {
        // Create request data
        const data = {
            status: status
        };

        if (notes) {
            data.notes = notes;
        }

        // Use the apiClient to make the request
        return apiClient.put(`/api/v1/results/${id}/validate`, data);
    },

    /**
     * Update a result
     * @param {number} id - Result ID
     * @param {object} data - Result data to update
     * @returns {Promise<any>} - Response data
     */
    async updateResult(id, data) {
        return apiClient.put(`/api/v1/results/${id}`, data);
    }
};

export default resultService;