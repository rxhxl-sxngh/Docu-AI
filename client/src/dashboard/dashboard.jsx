import React, {useEffect, useState} from 'react'

function Dashboard() {
    /*return(
        <div>
            <p>Dashboard</p>
            <UserProfile/>
        </div>
    )*/
    return(
        <section id="dashboard" class="p-6">
            {/*<!-- Header -->*/}
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-neutral-800">Invoice Processing Dashboard</h1>
                <div class="flex items-center space-x-4">
                    <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        New Upload
                    </button>
                </div>
            </div>

            <StatsGrid/>
            <RecentActivity/>
            <PerformanceMetrics/>
        </section>
    )
}

function StatsGrid(){
    return(
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/*<!-- Stats Grid -->*/}
            {/*<!-- Total Processed -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Total Processed</p>
                        <h3 class="text-2xl font-bold text-neutral-800">1,234</h3>
                    </div>
                    <div class="p-3 bg-green-100 rounded-full">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-4 flex items-center text-green-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <span class="text-sm">12% increase</span>
                </div>
            </div>

            {/*<!-- Success Rate -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Success Rate</p>
                        <h3 class="text-2xl font-bold text-neutral-800">92%</h3>
                    </div>
                    <div class="p-3 bg-blue-100 rounded-full">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-4 flex items-center text-blue-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <span class="text-sm">3.2% increase</span>
                </div>
            </div>

            {/*<!-- In Queue -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">In Queue</p>
                        <h3 class="text-2xl font-bold text-neutral-800">45</h3>
                    </div>
                    <div class="p-3 bg-yellow-100 rounded-full">
                        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-4 flex items-center text-yellow-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                    </svg>
                    <span class="text-sm">8 new today</span>
                </div>
            </div>

            {/*<!-- Failed -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Failed</p>
                        <h3 class="text-2xl font-bold text-neutral-800">23</h3>
                    </div>
                    <div class="p-3 bg-red-100 rounded-full">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>
                <div class="mt-4 flex items-center text-red-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                    </svg>
                    <span class="text-sm">-2% decrease</span>
                </div>
            </div>
        </div>
    )
}

function RecentActivity(){
    return(
        <div class="bg-white rounded-lg border border-neutral-200/30 mb-6">
            <div class="p-6">
                <h2 class="text-lg font-semibold text-neutral-800 mb-4">Recent Activity</h2>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="text-left border-b border-neutral-200/30">
                                <th class="pb-3 text-sm font-semibold text-neutral-600">Invoice ID</th>
                                <th class="pb-3 text-sm font-semibold text-neutral-600">Vendor</th>
                                <th class="pb-3 text-sm font-semibold text-neutral-600">Amount</th>
                                <th class="pb-3 text-sm font-semibold text-neutral-600">Status</th>
                                <th class="pb-3 text-sm font-semibold text-neutral-600">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-neutral-200/30">
                                <td class="py-4 text-sm text-neutral-800">INV-2023-001</td>
                                <td class="py-4 text-sm text-neutral-800">Tech Corp Ltd</td>
                                <td class="py-4 text-sm text-neutral-800">$1,234.56</td>
                                <td class="py-4">
                                    <span class="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Processed</span>
                                </td>
                                <td class="py-4 text-sm text-neutral-600">2 min ago</td>
                            </tr>
                            <tr class="border-b border-neutral-200/30">
                                <td class="py-4 text-sm text-neutral-800">INV-2023-002</td>
                                <td class="py-4 text-sm text-neutral-800">Global Services Inc</td>
                                <td class="py-4 text-sm text-neutral-800">$2,567.00</td>
                                <td class="py-4">
                                    <span class="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">Processing</span>
                                </td>
                                <td class="py-4 text-sm text-neutral-600">5 min ago</td>
                            </tr>
                            <tr class="border-b border-neutral-200/30">
                                <td class="py-4 text-sm text-neutral-800">INV-2023-003</td>
                                <td class="py-4 text-sm text-neutral-800">Supply Chain Co</td>
                                <td class="py-4 text-sm text-neutral-800">$876.50</td>
                                <td class="py-4">
                                    <span class="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Failed</span>
                                </td>
                                <td class="py-4 text-sm text-neutral-600">15 min ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function PerformanceMetrics(){
    return(
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <h2 class="text-lg font-semibold text-neutral-800 mb-4">Processing Time</h2>
                <div class="h-64 flex items-center justify-center text-neutral-500">
                    [Processing Time Chart Placeholder]
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <h2 class="text-lg font-semibold text-neutral-800 mb-4">Accuracy Metrics</h2>
                <div class="h-64 flex items-center justify-center text-neutral-500">
                    [Accuracy Metrics Chart Placeholder]
                </div>
            </div>
        </div>
    )
}
export default Dashboard