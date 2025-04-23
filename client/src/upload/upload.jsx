// client/src/upload/upload.jsx
import React from 'react'
import UploadArea from './UploadArea'
import UploadQueue from './UploadQueue'

function Upload() {
    return(
        <section id="upload" className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-neutral-800 mb-2">Document Upload</h1>
                    <p className="text-neutral-600">Upload invoice documents for automated processing and data extraction</p>
                </div>

                {/* Upload Area */}
                <UploadArea/>

                {/* Upload Queue */}
                <UploadQueue/>
            </div>
        </section>
    )
}

export default Upload