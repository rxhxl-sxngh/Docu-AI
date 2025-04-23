// File: client/src/upload/UploadArea.jsx
import React, { useState, useRef } from 'react';
import documentService from '../services/documentService';
import eventBus from '../services/eventService';

function UploadArea() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Handle file selection from input
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files).filter(file => file.type === 'application/pdf');
        
        if (files.length === 0) {
            setUploadError('Only PDF files are allowed');
            return;
        }
        
        setSelectedFiles(files);
        setUploadError(null);
    };

    // Handle click on the select files button
    const handleSelectClick = () => {
        fileInputRef.current.click();
    };

    // Handle drag events
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
        
        if (files.length === 0) {
            setUploadError('Only PDF files are allowed');
            return;
        }
        
        setSelectedFiles(files);
        setUploadError(null);
    };

    // Handle upload to server
    const uploadFiles = async () => {
        if (selectedFiles.length === 0) {
            setUploadError('Please select at least one PDF file');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            // Upload each file
            const uploadPromises = selectedFiles.map(async (file) => {
                try {
                    const result = await documentService.uploadDocument(file);
                    return { file, result, success: true };
                } catch (error) {
                    return { file, error, success: false };
                }
            });

            const results = await Promise.all(uploadPromises);
            
            // Check for errors
            const failures = results.filter(r => !r.success);
            if (failures.length > 0) {
                if (failures.length === selectedFiles.length) {
                    setUploadError('Failed to upload all files. Please try again.');
                } else {
                    setUploadError(`Failed to upload ${failures.length} of ${selectedFiles.length} files.`);
                }
            }
            
            // Clear selected files on success
            if (failures.length < selectedFiles.length) {
                setSelectedFiles([]);
                
                // Notify user of success
                if (failures.length === 0) {
                    alert(`Successfully uploaded ${selectedFiles.length} file(s)`);
                    
                    // Publish document-uploaded event to notify dashboard
                    eventBus.publish('document-uploaded', {
                        count: selectedFiles.length,
                        timestamp: new Date()
                    });
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError(`Upload failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-neutral-200/30 p-8 mb-8">
            <div 
                className={`border-2 border-dashed ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-neutral-200'} rounded-lg p-8`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="text-center">
                    <input 
                        type="file" 
                        className="hidden" 
                        id="fileInput" 
                        accept=".pdf" 
                        multiple
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                    <label htmlFor="fileInput" className="cursor-pointer block">
                        <div className="mx-auto h-24 w-24 mb-4 flex items-center justify-center rounded-full bg-indigo-50">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-neutral-800">Drag and drop your files here</p>
                            <p className="text-sm text-neutral-600">or click to browse (PDF only)</p>
                            {selectedFiles.length > 0 && (
                                <p className="text-sm text-indigo-600">
                                    {selectedFiles.length} file(s) selected
                                </p>
                            )}
                            {uploadError && (
                                <p className="text-sm text-red-600">{uploadError}</p>
                            )}
                            <button 
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                onClick={handleSelectClick}
                                disabled={isUploading}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                Select Files
                            </button>
                            {selectedFiles.length > 0 && (
                                <button 
                                    className="ml-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                    onClick={uploadFiles}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                                            </svg>
                                            Upload Files
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default UploadArea;