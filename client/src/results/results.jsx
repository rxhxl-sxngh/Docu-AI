import React, {useEffect, useState} from 'react'

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
  const DocumentPreviewHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Document Preview</h2>
        <div className="flex space-x-2">
          <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>
          <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
        </div>
      </div>
    );
  };
  
  // Document Preview Component
  const DocumentPreview = () => {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-neutral-200/30 p-6">
          <DocumentPreviewHeader />
          <div className="bg-neutral-50 rounded-lg border border-neutral-200/30 h-[600px] flex items-center justify-center">
            <div className="text-neutral-400">PDF Preview</div>
          </div>
        </div>
      </div>
    );
  };
  
  // Confidence Score Component
  const ConfidenceScore = ({ score }) => {
    return (
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span className="text-sm font-medium text-green-700">{score}% Confidence Score</span>
        </div>
      </div>
    );
  };
  
  // Edit Button Component
  const EditButton = () => {
    return (
      <button className="ml-2 p-2 text-neutral-400 hover:text-neutral-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
        </svg>
      </button>
    );
  };
  
  // Extracted Field Component
  const ExtractedField = ({ label, value }) => {
    return (
      <div className="border-b border-neutral-200/30 pb-3">
        <label className="block text-sm font-medium text-neutral-600">{label}</label>
        <div className="mt-1 flex items-center">
          <input 
            type="text" 
            value={value} 
            className="block w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800" 
            readOnly
          />
          <EditButton />
        </div>
      </div>
    );
  };
  
  // Action Buttons Component
  const ActionButtons = () => {
    return (
      <div className="flex space-x-3 mt-6">
        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
          Approve
        </button>
        <button className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
          Request Review
        </button>
      </div>
    );
  };
  
  // Extracted Information Component
  const ExtractedInformation = () => {
    // Sample data for extracted fields
    const extractedFields = [
      { label: 'Invoice Number', value: 'INV-2023-001' },
      { label: 'Vendor Name', value: 'Tech Solutions Inc.' },
      { label: 'Issue Date', value: '2023-10-15' },
      { label: 'Due Date', value: '2023-11-14' },
      { label: 'Total Amount', value: '$2,450.00' }
    ];
  
    return (
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-neutral-200/30 p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Extracted Information</h2>
          
          <div className="space-y-4">
            {/* Confidence Score */}
            <ConfidenceScore score={96} />
  
            {/* Extracted Fields */}
            <div className="space-y-3">
              {extractedFields.map((field, index) => (
                <ExtractedField 
                  key={index} 
                  label={field.label} 
                  value={field.value} 
                />
              ))}
            </div>
  
            {/* Action Buttons */}
            <ActionButtons />
          </div>
        </div>
      </div>
    );
  };
  
  // Main Results Component
  const Results = () => {
    return (
      <section id="extraction-results" className="p-6">
        <ResultsHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DocumentPreview />
          <ExtractedInformation />
        </div>
      </section>
    );
  };
  
  export default Results;