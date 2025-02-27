import React, {useEffect, useState} from 'react'

function Upload() {
    return(
        <div class="max-w-4xl mx-auto">
            {/*<!-- Header -->*/}
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-neutral-800 mb-2">Document Upload</h1>
                <p class="text-neutral-600">Upload invoice documents for automated processing and data extraction</p>
            </div>

            {/*<!-- Upload Area -->*/}
            <UploadArea/>

            {/*<!-- Upload Queue -->*/}
            <UploadQueue/>
        </div>
    )
}

function UploadArea(){
    return(
        <div class="bg-white rounded-lg border border-neutral-200/30 p-8 mb-8">
            <div class="border-2 border-dashed border-neutral-200 rounded-lg p-8">
                <div class="text-center" x-data="{ isHovered: false }">
                    <input type="file" class="hidden" id="fileInput" accept=".pdf" multiple/>
                    <label for="fileInput" class="cursor-pointer block">
                        <div class="mx-auto h-24 w-24 mb-4 flex items-center justify-center rounded-full bg-indigo-50">
                            <svg class="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                        </div>
                        <div class="space-y-2">
                            <p class="text-lg font-medium text-neutral-800">Drag and drop your files here</p>
                            <p class="text-sm text-neutral-600">or click to browse (PDF only)</p>
                            <button class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                Select Files
                            </button>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    )
}

function UploadQueue(){
    return(
        <div class="bg-white rounded-lg border border-neutral-200/30 p-6">
            <h2 class="text-lg font-semibold text-neutral-800 mb-4">Upload Queue</h2>
            
            {/*<!-- Queue Items -->*/}
            <div class="space-y-4">
                {/*<!-- Queue Item 1 -->*/}
                <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200/30">
                    <div class="flex items-center space-x-4">
                        <div class="p-2 bg-indigo-100 rounded-lg">
                            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="font-medium text-neutral-800">Invoice-2023-001.pdf</p>
                            <p class="text-sm text-neutral-600">2.4 MB</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="w-48 bg-neutral-200 rounded-full h-2">
                            <div class="bg-indigo-600 h-2 rounded-full" style={{width: "75%"}}></div>
                        </div>
                        <span class="text-sm text-neutral-600">75%</span>
                        <button class="text-neutral-400 hover:text-neutral-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/*<!-- Queue Item 2 -->*/}
                <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200/30">
                    <div class="flex items-center space-x-4">
                        <div class="p-2 bg-green-100 rounded-lg">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="font-medium text-neutral-800">Invoice-2023-002.pdf</p>
                            <p class="text-sm text-neutral-600">1.8 MB - Completed</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="w-48 bg-neutral-200 rounded-full h-2">
                            <div class="bg-green-600 h-2 rounded-full w-full"></div>
                        </div>
                        <span class="text-sm text-green-600">Done</span>
                        <button class="text-neutral-400 hover:text-neutral-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
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
        <div class="mt-6 flex justify-between items-center">
            <div class="text-sm text-neutral-600">
                2 files uploaded (4.2 MB total)
            </div>
            <div class="space-x-4">
                <button class="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors duration-200">
                    Clear All
                </button>
                <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    Process All
                </button>
            </div>
        </div>
    )
}
export default Upload