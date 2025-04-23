// client/src/results/results.jsx
import React, { useState, useEffect } from 'react';
import documentService from '../services/documentService';
import resultService from '../services/resultService';
import apiClient from '../services/apiClient';
import { useLocation } from 'react-router-dom';

// Header Component
const ResultsHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-neutral-800">Extraction Results</h1>
      <p className="text-neutral-600 mt-1">View and verify extracted information from processed invoices</p>
    </div>
  );
};

// Document Preview Header Component
const DocumentPreviewHeader = ({ onDownload }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-neutral-800">Document Preview</h2>
      <div className="flex space-x-2">
        <button 
          className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
          title="View Full Screen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        </button>
        <button 
          className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
          onClick={onDownload}
          title="Download Document"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Document Preview Component
const DocumentPreview = ({ documentId, documentUrl }) => {
  const [pdfData, setPdfData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId) {
        setPdfData(null);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get auth token
        const token = localStorage.getItem('token');
        
        // Fetch the document directly with proper auth headers
        const response = await fetch(`${apiClient.getBaseUrl()}/api/v1/documents/${documentId}/download`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
        }
        
        // Get the blob data
        const blob = await response.blob();
        // Create a data URL from the blob
        const dataUrl = URL.createObjectURL(blob);
        setPdfData(dataUrl);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocument();
    
    // Clean up any object URLs when component unmounts or document changes
    return () => {
      if (pdfData && pdfData.startsWith('blob:')) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [documentId]);

  const handleDownload = async () => {
    if (!documentId) return;
    
    try {
      const blob = await documentService.downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg border border-neutral-200/30 p-6">
        <DocumentPreviewHeader onDownload={handleDownload} />
        <div className="bg-neutral-50 rounded-lg border border-neutral-200/30 h-[600px] flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-neutral-600">Loading document...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 flex flex-col items-center p-4 text-center">
              <svg className="w-16 h-16 mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span className="font-medium mb-2">Failed to load document preview</span>
              <span className="text-sm">{error}</span>
              <button 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={handleDownload}
              >
                Download Instead
              </button>
            </div>
          ) : pdfData ? (
            <object
              data={pdfData}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="text-center p-4">
                <p className="mb-4">Unable to display PDF in browser. Please download the document to view it.</p>
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={handleDownload}
                >
                  Download PDF
                </button>
              </div>
            </object>
          ) : (
            <div className="text-neutral-400 flex flex-col items-center">
              <svg className="w-16 h-16 mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>PDF Preview</span>
              <span className="text-sm mt-2">Select a document to preview</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Confidence Score Component
const ConfidenceScore = ({ score }) => {
  // Convert decimal to percentage and round to nearest integer
  const percentage = Math.round((score * 100) || 0);
  
  // Determine color based on percentage
  let colorClass = "green";
  if (percentage < 70) colorClass = "red";
  else if (percentage < 90) colorClass = "yellow";

  return (
    <div className={`p-3 bg-${colorClass}-50 rounded-lg border border-${colorClass}-200`}>
      <div className="flex items-center">
        <svg className={`w-5 h-5 text-${colorClass}-500 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span className={`text-sm font-medium text-${colorClass}-700`}>{percentage}% Confidence Score</span>
      </div>
    </div>
  );
};

// Edit Button Component
const EditButton = ({ onClick }) => {
  return (
    <button 
      className="ml-2 p-2 text-neutral-400 hover:text-neutral-600"
      onClick={onClick}
      title="Edit Field"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
      </svg>
    </button>
  );
};

// Extracted Field Component
const ExtractedField = ({ label, value, onChange, editable = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  const handleEdit = () => {
    if (!editable) return;
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onChange) onChange(fieldValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="border-b border-neutral-200/30 pb-3">
      <label className="block text-sm font-medium text-neutral-600">{label}</label>
      <div className="mt-1 flex items-center">
        {isEditing ? (
          <input 
            type="text" 
            value={fieldValue} 
            onChange={(e) => setFieldValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="block w-full px-3 py-2 bg-white border border-indigo-300 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            autoFocus
          />
        ) : (
          <input 
            type="text" 
            value={fieldValue} 
            className="block w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800" 
            readOnly
          />
        )}
        {editable && <EditButton onClick={handleEdit} />}
      </div>
    </div>
  );
};

// Action Buttons Component
const ActionButtons = ({ onApprove, onRequestReview, isLoading }) => {
  return (
    <div className="flex space-x-3 mt-6">
      <button 
        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onApprove}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : "Approve"}
      </button>
      <button 
        className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onRequestReview}
        disabled={isLoading}
      >
        Request Review
      </button>
    </div>
  );
};

// Success Toast Component
const SuccessToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md max-w-md">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-auto p-1 hover:bg-green-200 rounded"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Extracted Information Component
const ExtractedInformation = ({ 
  documentId, 
  extractedData, 
  isLoading, 
  onDataChange,
  onApprove,
  onRequestReview
}) => {
  const [updatedData, setUpdatedData] = useState(extractedData);

  useEffect(() => {
    setUpdatedData(extractedData);
  }, [extractedData]);

  const handleFieldChange = (field, value) => {
    const newData = {
      ...updatedData,
      [field]: value
    };
    setUpdatedData(newData);
    if (onDataChange) onDataChange(newData);
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg border border-neutral-200/30 p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Extracted Information</h2>
        
        <div className="space-y-4">
          {/* Confidence Score */}
          <ConfidenceScore score={updatedData?.confidence_score || 0} />
          
          {/* Document ID */}
          <div className="text-sm text-neutral-600 mb-4">
            Document ID: <span className="font-medium">DOC-{documentId}</span>
          </div>

          {/* Extracted Fields */}
          <div className="space-y-3">
            <ExtractedField 
              label="Invoice Number" 
              value={updatedData?.invoice_number || ''} 
              onChange={(value) => handleFieldChange('invoice_number', value)}
            />
            <ExtractedField 
              label="Vendor Name" 
              value={updatedData?.vendor_name || ''} 
              onChange={(value) => handleFieldChange('vendor_name', value)}
            />
            <ExtractedField 
              label="Issue Date" 
              value={updatedData?.invoice_date ? new Date(updatedData.invoice_date).toLocaleDateString() : ''} 
              onChange={(value) => handleFieldChange('invoice_date', value)}
            />
            <ExtractedField 
              label="Due Date" 
              value={updatedData?.due_date ? new Date(updatedData.due_date).toLocaleDateString() : ''} 
              onChange={(value) => handleFieldChange('due_date', value)}
            />
            <ExtractedField 
              label="Total Amount" 
              value={updatedData?.total_amount ? `$${updatedData.total_amount.toFixed(2)}` : ''} 
              onChange={(value) => {
                // Strip currency symbol and convert to number
                const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
                handleFieldChange('total_amount', isNaN(numValue) ? 0 : numValue);
              }}
            />
          </div>

          {/* Processing Status */}
          <div className="mt-4 py-2 px-3 bg-neutral-100 rounded-lg text-sm text-neutral-700">
            <span className="font-medium">Status: </span>
            {extractedData?.status === 'validated' ? 'Approved' : 
             extractedData?.status === 'rejected' ? 'Rejected' : 
             'Pending Validation'}
            
            {extractedData?.validated_by && (
              <div className="mt-2">
                <span className="font-medium">Validated by: </span>
                User ID: {extractedData.validated_by}
              </div>
            )}
            
            {extractedData?.validated_date && (
              <div className="mt-1">
                <span className="font-medium">Validated on: </span>
                {new Date(extractedData.validated_date).toLocaleString()}
              </div>
            )}
            
            {extractedData?.validation_notes && (
              <div className="mt-1">
                <span className="font-medium">Notes: </span>
                {extractedData.validation_notes}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <ActionButtons 
            onApprove={() => onApprove && onApprove(updatedData)}
            onRequestReview={() => onRequestReview && onRequestReview(updatedData)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

// Document Selector Component
const DocumentSelector = ({ documents, selectedId, onSelect }) => {
  return (
    <div className="mb-6 bg-white rounded-lg border border-neutral-200/30 p-4">
      <div className="flex items-center">
        <label className="text-sm font-medium text-neutral-700 mr-4">Select Document:</label>
        <select 
          className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedId || ''}
          onChange={(e) => onSelect(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">-- Select a document --</option>
          {documents.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.filename} (ID: {doc.id})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// NoDocuments Component
const NoDocuments = () => {
  const navigateToUpload = () => {
    window.location.href = '#upload';
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200/30 p-8 text-center">
      <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 className="text-lg font-medium text-neutral-800 mb-2">No Documents Found</h3>
      <p className="text-neutral-600 mb-6">You don't have any processed documents to view results for.</p>
      <button 
        onClick={navigateToUpload}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
      >
        Upload Documents
      </button>
    </div>
  );
};

// Main Results Component
const Results = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const location = useLocation();

  // Get document ID from hash fragment if any
  useEffect(() => {
    const hash = location.hash;
    const match = hash.match(/#results\/(\d+)/);
    if (match && match[1]) {
      const docId = parseInt(match[1]);
      setSelectedDocumentId(docId);
    }
  }, [location]);

  // Fetch processed documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await documentService.getDocuments();
        // Filter for processed documents
        const processedDocs = docs.filter(doc => doc.status === 'processed');
        setDocuments(processedDocs);
        
        // If no document is selected but we have documents, select the first one
        if (!selectedDocumentId && processedDocs.length > 0) {
          setSelectedDocumentId(processedDocs[0].id);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    
    fetchDocuments();
  }, [selectedDocumentId]);

  // Fetch extraction results when document is selected
  useEffect(() => {
    const fetchResults = async () => {
      if (!selectedDocumentId) return;
      
      setIsLoading(true);
      try {
        const result = await documentService.getDocumentResults(selectedDocumentId);
        setExtractedData(result);
      } catch (error) {
        console.error('Error fetching results:', error);
        setExtractedData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [selectedDocumentId]);

  // Helper to get API base URL
  const getBaseUrl = () => {
    if (typeof apiClient !== 'undefined' && apiClient.getBaseUrl) {
      return apiClient.getBaseUrl();
    }
    // Fallback to a default or environment variable
    return process.env.REACT_APP_API_URL || 'http://localhost:8000';
  };

  // Handle document selection
  const handleDocumentSelect = (docId) => {
    setSelectedDocumentId(docId);
    // Update URL hash without page reload
    window.history.replaceState(null, null, `#results/${docId}`);
  };

  // Handle data changes
  const handleDataChange = (newData) => {
    setExtractedData(newData);
  };

  // Handle approve button
  const handleApprove = async (data) => {
    if (!selectedDocumentId || !extractedData) return;
    
    setIsLoading(true);
    try {
      // Call the API to validate the result
      const validatedResult = await resultService.validateResult(extractedData.id, 'validated');
      
      // Update the local state with the validated result
      setExtractedData(validatedResult);
      
      setToastMessage('Document extraction results approved successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Error approving results:', error);
      setToastMessage('Failed to approve results. Please try again.');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle request review button
  const handleRequestReview = async (data) => {
    if (!selectedDocumentId || !extractedData) return;
    
    setIsLoading(true);
    try {
      // Call the API to request review
      const reviewResult = await resultService.validateResult(extractedData.id, 'rejected', 'Review requested');
      
      // Update the local state with the updated result
      setExtractedData(reviewResult);
      
      setToastMessage('Review requested successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Error requesting review:', error);
      setToastMessage('Failed to request review. Please try again.');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="results" className="p-6">
      <ResultsHeader />
      
      {/* Document Selector */}
      {documents.length > 0 && (
        <DocumentSelector 
          documents={documents}
          selectedId={selectedDocumentId}
          onSelect={handleDocumentSelect}
        />
      )}
      
      {/* Main Content */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DocumentPreview 
            documentId={selectedDocumentId}
          />
          <ExtractedInformation 
            documentId={selectedDocumentId}
            extractedData={extractedData}
            isLoading={isLoading}
            onDataChange={handleDataChange}
            onApprove={handleApprove}
            onRequestReview={handleRequestReview}
          />
        </div>
      ) : (
        <NoDocuments />
      )}
      
      {/* Success Toast */}
      {showToast && (
        <SuccessToast 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </section>
  );
};

export default Results;