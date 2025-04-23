// client/src/services/documentService.js
import apiClient from './apiClient';

/**
 * Service for document-related API operations
 */
const documentService = {
  /**
   * Upload a document
   * @param {File} file - The file to upload
   * @returns {Promise<any>} - Response data
   */
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.uploadFile('/api/v1/documents', formData);
  },

  /**
   * Get all documents
   * @param {number} skip - Number of items to skip
   * @param {number} limit - Number of items to return
   * @returns {Promise<any>} - Response data
   */
  async getDocuments(skip = 0, limit = 100000) {
    return apiClient.get(`/api/v1/documents?skip=${skip}&limit=${limit}`);
  },

  /**
   * Get document by ID
   * @param {number} id - Document ID
   * @returns {Promise<any>} - Response data
   */
  async getDocumentById(id) {
    return apiClient.get(`/api/v1/documents/${id}`);
  },

  /**
   * Download document
   * @param {number} id - Document ID
   * @returns {Promise<any>} - Binary file data
   */
  async downloadDocument(id) {
    // For download, we need to handle the response differently
    const response = await fetch(`${apiClient.getBaseUrl()}/api/v1/documents/${id}/download`, {
      method: 'GET',
      headers: apiClient.getAuthHeader(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error downloading document: ${response.statusText}`);
    }

    return response.blob();
  },

  /**
   * Delete document
   * @param {number} id - Document ID
   * @returns {Promise<any>} - Response data
   */
  async deleteDocument(id) {
    return apiClient.delete(`/api/v1/documents/${id}`);
  },

  /**
   * Process document
   * @param {number} id - Document ID
   * @param {number} priority - Processing priority (1-5)
   * @returns {Promise<any>} - Response data
   */
  async processDocument(id, priority = 1) {
    return apiClient.post(`/api/v1/documents/${id}/process`, { priority });
  },

  /**
   * Reprocess document
   * @param {number} id - Document ID
   * @param {number} priority - Processing priority (1-5)
   * @returns {Promise<any>} - Response data
   */
  async reprocessDocument(id, priority = 1) {
    return apiClient.post(`/api/v1/documents/${id}/reprocess`, { priority });
  },

  /**
   * Get document status
   * @param {number} id - Document ID
   * @returns {Promise<any>} - Response data
   */
  async getDocumentStatus(id) {
    return apiClient.get(`/api/v1/status/document/${id}`);
  },

  /**
   * Get results for a document
   * @param {number} documentId - Document ID
   * @returns {Promise<any>} - Response data
   */
  async getDocumentResults(documentId) {
    return apiClient.get(`/api/v1/results/document/${documentId}`);
  }
};

export default documentService;