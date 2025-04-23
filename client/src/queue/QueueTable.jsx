// client/src/queue/QueueTable.jsx
import React, { useState, useEffect } from 'react';
import documentService from '../services/documentService';
import queueService from '../services/queueService';

const QueueTable = () => {
  const [queueItems, setQueueItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch queue items on component mount
  useEffect(() => {
    fetchQueueItems();
    
    // Refresh queue every 5 seconds
    const intervalId = setInterval(fetchQueueItems, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to fetch queue items
  const fetchQueueItems = async () => {
    try {
      setIsLoading(true);
      const documents = await documentService.getDocuments(0, 100);
      setQueueItems(documents);
      setError(null);
    } catch (err) {
      console.error('Error fetching queue items:', err);
      setError('Failed to load processing queue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to start processing all pending documents
  const startProcessing = async () => {
    try {
      const pendingDocuments = queueItems.filter(doc => doc.status === 'pending');
      
      if (pendingDocuments.length === 0) {
        return alert('No pending documents to process.');
      }
      
      for (const doc of pendingDocuments) {
        await documentService.processDocument(doc.id);
      }
      
      fetchQueueItems();
    } catch (err) {
      console.error('Error processing documents:', err);
      setError(`Failed to process documents: ${err.message}`);
    }
  };

  // Function to process a single document
  const processDocument = async (docId) => {
    try {
      await documentService.processDocument(docId);
      fetchQueueItems();
    } catch (err) {
      console.error(`Error processing document ${docId}:`, err);
      setError(`Failed to process document: ${err.message}`);
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Function to create a status badge component
  const StatusBadge = ({ status }) => {
    let color, label;
    
    switch (status) {
      case 'processed':
        color = 'green';
        label = 'Completed';
        break;
      case 'processing':
        color = 'blue';
        label = 'Processing';
        break;
      case 'failed':
        color = 'red';
        label = 'Failed';
        break;
      default:
        color = 'yellow';
        label = 'Pending';
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium text-${color}-700 bg-${color}-100 rounded-full`}>
        {label}
      </span>
    );
  };

  // Filter and search queue items
  const filteredItems = queueItems.filter(item => 
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `DOC-${item.id.toString().padStart(3, '0')}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count documents by status
  const docCounts = {
    pending: queueItems.filter(item => item.status === 'pending').length,
    processing: queueItems.filter(item => item.status === 'processing').length,
    completed: queueItems.filter(item => item.status === 'processed').length,
    failed: queueItems.filter(item => item.status === 'failed').length
  };

  return (
    <>
      {/* Stats Grid Component */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
          <div className="text-sm text-neutral-600">Pending</div>
          <div className="text-2xl font-bold text-neutral-800 mt-1">{docCounts.pending}</div>
          <div className="mt-2 text-yellow-600 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Awaiting Processing
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
          <div className="text-sm text-neutral-600">Processing</div>
          <div className="text-2xl font-bold text-neutral-800 mt-1">{docCounts.processing}</div>
          <div className="mt-2 text-blue-600 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            In Progress
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
          <div className="text-sm text-neutral-600">Completed</div>
          <div className="text-2xl font-bold text-neutral-800 mt-1">{docCounts.completed}</div>
          <div className="mt-2 text-green-600 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Successfully Processed
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
          <div className="text-sm text-neutral-600">Failed</div>
          <div className="text-2xl font-bold text-neutral-800 mt-1">{docCounts.failed}</div>
          <div className="mt-2 text-red-600 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Requires Attention
          </div>
        </div>
      </div>

      {/* Queue Table Component */}
      <div className="bg-white rounded-lg border border-neutral-200/30">
        <div className="p-6">
          {/* Error message if any */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Table Filter with Start Processing Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">Queue Items</h2>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                onClick={startProcessing}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Processing
              </button>
            </div>
          </div>
          
          {/* Loading indicator */}
          {isLoading && queueItems.length === 0 && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-neutral-200">
                  <th className="pb-3 text-sm font-semibold text-neutral-600">Document ID</th>
                  <th className="pb-3 text-sm font-semibold text-neutral-600">File Name</th>
                  <th className="pb-3 text-sm font-semibold text-neutral-600">Status</th>
                  <th className="pb-3 text-sm font-semibold text-neutral-600">Submitted</th>
                  <th className="pb-3 text-sm font-semibold text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-neutral-500">
                      {searchTerm ? 'No matching documents found' : 'No documents in queue'}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="border-b border-neutral-200">
                      <td className="py-4 text-sm text-neutral-800">DOC-{item.id.toString().padStart(3, '0')}</td>
                      <td className="py-4 text-sm text-neutral-800">{item.filename}</td>
                      <td className="py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-4 text-sm text-neutral-600">{formatTimestamp(item.uploaded_date)}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          {item.status === 'pending' && (
                            <button 
                              onClick={() => processDocument(item.id)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="Process Document"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          
                          {(item.status === 'processed' || item.status === 'failed') && (
                            <button 
                              onClick={() => processDocument(item.id)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="Reprocess Document"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          )}
                          
                          <a 
                            href={`#results`}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="View Results"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component - Simplified */}
          {filteredItems.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-neutral-600">
                Showing {filteredItems.length} of {queueItems.length} documents
              </div>
              {queueItems.length > 10 && (
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">Previous</button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">1</button>
                  <button className="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">Next</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QueueTable;