import React, {useEffect, useState} from 'react'

function Logs() {
    return(
        <section id="logs" class="p-6">
            <LogHeadder/>
            <DatabaseStats/>
            <LogViewer/>
        </section>
    )
}

function LogHeadder(){
    return(
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-neutral-800">Database Logs</h1>
            <p class="text-neutral-600 mt-1">Monitor database operations and data logging activities</p>
        </div>
    )
}

function DatabaseStats() {
    return(
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Total Records</p>
                        <h3 class="text-2xl font-bold text-neutral-800">15,423</h3>
                    </div>
                    <div class="p-3 bg-blue-100 rounded-full">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-8"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17v-4"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17v-6"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Today's Inserts</p>
                        <h3 class="text-2xl font-bold text-neutral-800">245</h3>
                    </div>
                    <div class="p-3 bg-green-100 rounded-full">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Failed Writes</p>
                        <h3 class="text-2xl font-bold text-neutral-800">3</h3>
                    </div>
                    <div class="p-3 bg-red-100 rounded-full">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LogViewer() {
    return(
        <div class="bg-white rounded-lg border border-neutral-200/30">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg font-semibold text-neutral-800">Recent Database Operations</h2>
                    <div class="flex space-x-3">
                        <select class="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>All Operations</option>
                            <option>INSERT</option>
                            <option>UPDATE</option>
                            <option>DELETE</option>
                        </select>
                        <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                            Export Logs
                        </button>
                    </div>
                </div>

                <div class="bg-neutral-50 rounded-lg border border-neutral-200/30 p-4 font-mono text-sm">
                    <div class="space-y-2">
                        <div class="flex items-start space-x-3">
                            <span class="text-green-600">[SUCCESS]</span>
                            <span class="text-neutral-400">2023-10-15 14:30:45</span>
                            <span class="text-neutral-800">INSERT INTO invoices (invoice_id, vendor, amount) VALUES ('INV-2023-001', 'Tech Solutions Inc', 2450.00)</span>
                        </div>
                        <div class="flex items-start space-x-3">
                            <span class="text-blue-600">[INFO]</span>
                            <span class="text-neutral-400">2023-10-15 14:30:44</span>
                            <span class="text-neutral-800">Running data validation checks for invoice INV-2023-001</span>
                        </div>
                        <div class="flex items-start space-x-3">
                            <span class="text-red-600">[ERROR]</span>
                            <span class="text-neutral-400">2023-10-15 14:29:55</span>
                            <span class="text-neutral-800">Failed to parse date format in invoice INV-2023-000: Invalid date string</span>
                        </div>
                        <div class="flex items-start space-x-3">
                            <span class="text-green-600">[SUCCESS]</span>
                            <span class="text-neutral-400">2023-10-15 14:28:30</span>
                            <span class="text-neutral-800">UPDATE invoices SET status = 'processed' WHERE invoice_id = 'INV-2023-999'</span>
                        </div>
                    </div>
                </div>

                {/*<!-- Log Filters -->*/}
                <div class="mt-6 flex items-center space-x-4">
                    <div class="flex items-center">
                        <input type="checkbox" id="success" class="rounded text-indigo-600" checked/>
                        <label for="success" class="ml-2 text-sm text-neutral-600">Success</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="info" class="rounded text-indigo-600" checked/>
                        <label for="info" class="ml-2 text-sm text-neutral-600">Info</label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="error" class="rounded text-indigo-600" checked/>
                        <label for="error" class="ml-2 text-sm text-neutral-600">Error</label>
                    </div>
                    <button class="ml-auto text-sm text-indigo-600 hover:text-indigo-700">Clear Logs</button>
                </div>
            </div>

            {/*<!-- Pagination -->*/}
            <div class="border-t border-neutral-200/30 p-4">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-neutral-600">Showing 50 of 1,234 logs</span>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">Previous</button>
                        <button class="px-3 py-1 bg-indigo-600 text-white rounded-lg">1</button>
                        <button class="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">2</button>
                        <button class="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">3</button>
                        <button class="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Logs