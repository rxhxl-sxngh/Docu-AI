// File: client/src/upload/upload.jsx
import React, { useEffect, useState } from 'react'
import UploadArea from './UploadArea' // Import the separated component

function Upload() {
    return(
        <section id="upload" className="p-6">
            <div className="max-w-4xl mx-auto">
                {/*<!-- Header -->*/}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-neutral-800 mb-2">Document Upload</h1>
                    <p className="text-neutral-600">Upload invoice documents for automated processing and data extraction</p>
                </div>

                {/*<!-- Upload Area -->*/}
                <UploadArea/>

                {/*<!-- Upload Queue -->*/}
                <UploadQueue/>
            </div>
        </section>
    )
}

// Keep the existing UploadQueue component unmodified
function UploadQueue(){
    return(
        <div className="bg-white rounded-lg border border-neutral-200/30 p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Upload Queue</h2>
            
            {/*<!-- Queue Items -->*/}
            <div className="space-y-4">
                {/*<!-- Queue Item 1 -->*/}
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200/30">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-neutral-800">Invoice-2023-001.pdf</p>
                            <p className="text-sm text-neutral-600">2.4 MB</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-48 bg-neutral-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{width: "75%"}}></div>
                        </div>
                        <span className="text-sm text-neutral-600">75%</span>
                        <button className="text-neutral-400 hover:text-neutral-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/*<!-- Queue Item 2 -->*/}
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200/30">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-neutral-800">Invoice-2023-002.pdf</p>
                            <p className="text-sm text-neutral-600">1.8 MB - Completed</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-48 bg-neutral-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full w-full"></div>
                        </div>
                        <span className="text-sm text-green-600">Done</span>
                        <button className="text-neutral-400 hover:text-neutral-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/*<!-- Upload Actions -->*/}
            <UploadActions/>
            
        </div>
    )
}

function UploadActions(){
    return(
        <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-neutral-600">
                2 files uploaded (4.2 MB total)
            </div>
            <div className="space-x-4">
                <button className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors duration-200">
                    Clear All
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    Process All
                </button>
            </div>
        </div>
    )
}

export default Upload