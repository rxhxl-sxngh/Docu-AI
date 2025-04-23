// client/src/upload/UploadQueue.jsx
import React, { useState, useEffect } from 'react';
import documentService from '../services/documentService';
// import queueService from '../services/queueService';

function UploadQueue() {
    const [queueItems, setQueueItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch queue items on component mount
    useEffect(() => {
        fetchQueueItems();
        
        // Refresh queue every 5 seconds to see updates
        const intervalId = setInterval(fetchQueueItems, 5000);
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Function to fetch queue items
    const fetchQueueItems = async () => {
        try {
            setIsLoading(true);
            const documents = await documentService.getDocuments(0, 10);
            setQueueItems(documents);
            setError(null);
        } catch (err) {
            console.error('Error fetching queue items:', err);
            setError('Failed to load upload queue. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to process a document
    const handleProcess = async (docId) => {
        try {
            await documentService.processDocument(docId);
            // Refresh queue items after processing request
            fetchQueueItems();
        } catch (err) {
            console.error('Error processing document:', err);
            setError(`Failed to process document: ${err.message}`);
        }
    };

    // Function to delete a document
    const handleDelete = async (docId) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await documentService.deleteDocument(docId);
                // Refresh queue items after deletion
                fetchQueueItems();
            } catch (err) {
                console.error('Error deleting document:', err);
                setError(`Failed to delete document: ${err.message}`);
            }
        }
    };

    // Function to format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
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

    // Function to get status icon and color based on status
    const getStatusInfo = (status) => {
        switch (status) {
            case 'processed':
                return {
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-600',
                    icon: (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    ),
                    label: 'Processed'
                };
            case 'processing':
                return {
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-600',
                    icon: (
                        <svg className="w-6 h-6 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                    ),
                    label: 'Processing'
                };
            case 'failed':
                return {
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-600',
                    icon: (
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    ),
                    label: 'Failed'
                };
            default:
                return {
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-600',
                    icon: (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    ),
                    label: 'Pending'
                };
        }
    };

    // Function to process all pending documents
    const processAll = async () => {
        try {
            const pendingDocuments = queueItems.filter(item => item.status === 'pending');
            if (pendingDocuments.length === 0) {
                return alert('No pending documents to process.');
            }
            
            for (const doc of pendingDocuments) {
                await documentService.processDocument(doc.id);
            }
            
            fetchQueueItems();
        } catch (err) {
            console.error('Error processing all documents:', err);
            setError(`Failed to process documents: ${err.message}`);
        }
    };

    // Function to clear all documents
    const clearAll = async () => {
        if (window.confirm('Are you sure you want to delete all documents in the queue?')) {
            try {
                for (const doc of queueItems) {
                    await documentService.deleteDocument(doc.id);
                }
                
                fetchQueueItems();
            } catch (err) {
                console.error('Error clearing all documents:', err);
                setError(`Failed to clear all documents: ${err.message}`);
            }
        }
    };

    // Total size calculation
    const totalSize = queueItems.reduce((total, item) => total + (item.file_size || 0), 0);

    return (
        <div className="bg-white rounded-lg border border-neutral-200/30 p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Upload Queue</h2>
            
            {/* Error message if any */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && queueItems.length === 0 && (
                <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            )}
            
            {/* Queue Items */}
            <div className="space-y-4">
                {queueItems.length === 0 && !isLoading ? (
                    <div className="p-8 text-center text-neutral-500">
                        <p>No documents in the queue</p>
                        <p className="text-sm mt-2">Upload a document to get started</p>
                    </div>
                ) : (
                    queueItems.map(item => {
                        const statusInfo = getStatusInfo(item.status);
                        
                        return (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200/30">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 ${statusInfo.bgColor} rounded-lg`}>
                                        {statusInfo.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-800">{item.filename}</p>
                                        <p className="text-sm text-neutral-600">
                                            {formatFileSize(item.file_size)} - {formatTimestamp(item.uploaded_date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-2 py-1 text-xs font-medium ${statusInfo.textColor} ${statusInfo.bgColor} rounded-full`}>
                                        {statusInfo.label}
                                    </span>
                                    
                                    {/* Action buttons based on status */}
                                    <div className="flex space-x-2">
                                        {item.status === 'pending' && (
                                            <button 
                                                onClick={() => handleProcess(item.id)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
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
                                                onClick={() => handleProcess(item.id)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                title="Reprocess Document"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </button>
                                        )}
                                        
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            title="Delete Document"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Upload Actions */}
            {queueItems.length > 0 && (
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-neutral-600">
                        {queueItems.length} file{queueItems.length !== 1 ? 's' : ''} uploaded ({formatFileSize(totalSize)} total)
                    </div>
                    <div className="space-x-4">
                        <button 
                            onClick={clearAll}
                            className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
                        >
                            Clear All
                        </button>
                        <button 
                            onClick={processAll}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Process All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadQueue;