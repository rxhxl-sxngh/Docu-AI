import React, {useEffect, useState} from 'react'

function Analytics() {
    return(
        <section id="analytics" class="p-6">
            <AnalyticsHeader/>
            <KeyMetrics/>
            <ChartsGrid/>
            <DetailedAnalytics/>
        </section>
    )
}

function AnalyticsHeader() {
    return(
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-neutral-800">Analytics Dashboard</h1>
            <p class="text-neutral-600 mt-1">Performance metrics and system analytics</p>
        </div>
    )
}

function KeyMetrics() {
    return(
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Classification Accuracy</p>
                        <h3 class="text-2xl font-bold text-neutral-800">92.5%</h3>
                    </div>
                    <div class="p-3 bg-green-100 rounded-full">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-2 text-sm text-green-600">↑ 2.3% from last month</div>
            </div>

            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Data Recall Rate</p>
                        <h3 class="text-2xl font-bold text-neutral-800">94.8%</h3>
                    </div>
                    <div class="p-3 bg-blue-100 rounded-full">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-2 text-sm text-blue-600">↑ 1.5% from last month</div>
            </div>

            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Processing Speed</p>
                        <h3 class="text-2xl font-bold text-neutral-800">3.2s</h3>
                    </div>
                    <div class="p-3 bg-yellow-100 rounded-full">
                        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-2 text-sm text-yellow-600">↓ 0.3s improvement</div>
            </div>

            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Error Rate</p>
                        <h3 class="text-2xl font-bold text-neutral-800">1.2%</h3>
                    </div>
                    <div class="p-3 bg-red-100 rounded-full">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-2 text-sm text-green-600">↓ 0.5% improvement</div>
            </div>
        </div>
    )
}

function ChartsGrid(){
    return(
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/*<!-- Performance Trend -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <h2 class="text-lg font-semibold text-neutral-800 mb-4">Performance Trends</h2>
                <div class="h-80 flex items-center justify-center text-neutral-400">
                    [Performance Trend Chart]
                </div>
            </div>

            {/*<!-- Accuracy Distribution -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <h2 class="text-lg font-semibold text-neutral-800 mb-4">Accuracy Distribution</h2>
                <div class="h-80 flex items-center justify-center text-neutral-400">
                    [Accuracy Distribution Chart]
                </div>
            </div>
        </div>
    )
}

function DetailedAnalytics(){
    return(
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProcessingTimeAnalysis/>
            <ErrorAnalysis/>
            <ModelPerformance/>
        </div>
    )
}

function ProcessingTimeAnalysis(){
    return(
        <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
            <h2 class="text-lg font-semibold text-neutral-800 mb-4">Processing Time Analysis</h2>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-neutral-600">Document Classification</span>
                    <span class="text-sm font-medium text-neutral-800">0.8s</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-neutral-600">Data Extraction</span>
                    <span class="text-sm font-medium text-neutral-800">1.5s</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-neutral-600">Validation</span>
                    <span class="text-sm font-medium text-neutral-800">0.6s</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-neutral-600">Database Operations</span>
                    <span class="text-sm font-medium text-neutral-800">0.3s</span>
                </div>
            </div>
        </div>
    )
}

function ErrorAnalysis() {
    return(
        <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
            <h2 class="text-lg font-semibold text-neutral-800 mb-4">Error Analysis</h2>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        <span class="text-sm text-neutral-600">Format Errors</span>
                    </div>
                    <span class="text-sm font-medium text-neutral-800">0.5%</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span class="text-sm text-neutral-600">OCR Issues</span>
                    </div>
                    <span class="text-sm font-medium text-neutral-800">0.4%</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span class="text-sm text-neutral-600">Classification Errors</span>
                    </div>
                    <span class="text-sm font-medium text-neutral-800">0.2%</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span class="text-sm text-neutral-600">Other</span>
                    </div>
                    <span class="text-sm font-medium text-neutral-800">0.1%</span>
                </div>
            </div>
        </div>
    )
}

function ModelPerformance() {
    return(
        <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
            <h2 class="text-lg font-semibold text-neutral-800 mb-4">Model Performance</h2>
            <div class="space-y-4">
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm text-neutral-600">BERT Model</span>
                        <span class="text-sm font-medium text-neutral-800">95%</span>
                    </div>
                    <div class="w-full bg-neutral-200 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style={{"width": "95%"}}></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm text-neutral-600">RoBERTa Model</span>
                        <span class="text-sm font-medium text-neutral-800">93%</span>
                    </div>
                    <div class="w-full bg-neutral-200 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style={{"width": "93%"}}></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm text-neutral-600">PaddleOCR</span>
                        <span class="text-sm font-medium text-neutral-800">91%</span>
                    </div>
                    <div class="w-full bg-neutral-200 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style={{"width": "91%"}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Analytics