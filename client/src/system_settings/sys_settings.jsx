function SystemSettings() {
    return(
        <section id="settings" class="p-6">
            <SettingsHeader></SettingsHeader>
            <SettingsGrid></SettingsGrid>
        </section>
    )
}
function SettingsHeader() {
    return(
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-neutral-800">System Settings</h1>
            <p class="text-neutral-600 mt-1">Configure application settings and parameters</p>
        </div>
    )
}
function SettingsGrid() {
    return(
        <><div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AIModelConfiguration></AIModelConfiguration>
            <OCRSettings></OCRSettings>
            <DatabaseConfiguration></DatabaseConfiguration>
            <SystemPreferences></SystemPreferences>
            <APIConfiguration></APIConfiguration>

        </div><div class="mt-6 flex justify-end">
                <button class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    Save Changes
                </button>
            </div></>
    )
}
function AIModelConfiguration() {
    return(
            <div class="bg-white rounded-lg border border-neutral-200/30 p-6">
                <div class="mb-6">
                    <h2 class="text-lg font-semibold text-neutral-800">AI Model Configuration</h2>
                    <p class="text-sm text-neutral-600 mt-1">Configure AI model parameters and thresholds</p>
                </div>
    
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-neutral-700 mb-1">Active Model</label>
                        <select class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>BERT Base Model</option>
                            <option>RoBERTa Large</option>
                            <option>Custom Fine-tuned Model</option>
                        </select>
                    </div>
    
                    <div>
                        <label class="block text-sm font-medium text-neutral-700 mb-1">Confidence Threshold</label>
                        <div class="flex items-center space-x-2">
                            <input type="range" min="0" max="100" value="85" class="w-full"></input>
                            <span class="text-sm text-neutral-600">85%</span>
                        </div>
                    </div>
    
                    <div>
                        <label class="block text-sm font-medium text-neutral-700 mb-1">Max Processing Time</label>
                        <input type="number" value="5" class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Seconds"></input>
                    </div>
                </div>
            </div>
    )
}
function OCRSettings() {
    return(
<div class="bg-white rounded-lg border border-neutral-200/30 p-6">
                <div class="mb-6">
                    <h2 class="text-lg font-semibold text-neutral-800">OCR Settings</h2>
                    <p class="text-sm text-neutral-600 mt-1">Configure OCR engine parameters</p>
                </div>
    
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-neutral-700 mb-1">OCR Engine</label>
                        <select class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>PaddleOCR</option>
                            <option>Tesseract</option>
                        </select>
                    </div>
    
                    <div>
                        <label class="block text-sm font-medium text-neutral-700 mb-1">Language</label>
                        <select class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>English</option>
                            <option>Multi-language</option>
                        </select>
                    </div>
    
                    <div class="flex items-center justify-between">
                        <label class="text-sm font-medium text-neutral-700">Enable Image Preprocessing</label>
                        <button class="relative inline-flex items-center h-6 rounded-full w-11 bg-indigo-600">
                            <span class="translate-x-6 inline-block w-4 h-4 transform bg-white rounded-full"></span>
                        </button>
                    </div>
                </div>
            </div>
    )
}
function DatabaseConfiguration() {
    return(
        <div class="bg-white rounded-lg border border-neutral-200/30 p-6">
        <div class="mb-6">
            <h2 class="text-lg font-semibold text-neutral-800">Database Settings</h2>
            <p class="text-sm text-neutral-600 mt-1">Configure database connection and logging</p>
        </div>

        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Database Host</label>
                <input type="text" value="localhost" class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
            </div>

            <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Port</label>
                <input type="number" value="5432" class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
            </div>

            <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Database Name</label>
                <input type="text" value="invoice_processing" class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
            </div>
        </div>
    </div>
    )
}
function SystemPreferences() {
    return(
<div class="bg-white rounded-lg border border-neutral-200/30 p-6">
                <div class="mb-6">
                    <h2 class="text-lg font-semibold text-neutral-800">System Preferences</h2>
                    <p class="text-sm text-neutral-600 mt-1">General system settings and preferences</p>
                </div>
    
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <label class="text-sm font-medium text-neutral-700">Enable Auto-Processing</label>
                        <button class="relative inline-flex items-center h-6 rounded-full w-11 bg-indigo-600">
                            <span class="translate-x-6 inline-block w-4 h-4 transform bg-white rounded-full"></span>
                        </button>
                    </div>
    
                    <div class="flex items-center justify-between">
                        <label class="text-sm font-medium text-neutral-700">Email Notifications</label>
                        <button class="relative inline-flex items-center h-6 rounded-full w-11 bg-neutral-200">
                            <span class="translate-x-1 inline-block w-4 h-4 transform bg-white rounded-full"></span>
                        </button>
                    </div>
    
                    <div>
                        <label class="block text-sm font-medium text-neutral-700 mb-1">Error Handling</label>
                        <select class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Stop Processing</option>
                            <option>Continue with Warnings</option>
                            <option>Skip and Log</option>
                        </select>
                    </div>
                </div>
            </div>
    )
}

function APIConfiguration(){
    return(
        <div class="bg-white rounded-lg border border-neutral-200/30 p-6">
                <div class="mb-6">
                    <h2 class="text-lg font-semibold text-neutral-800">API Configuration</h2>
                    <p class="text-sm text-neutral-600 mt-1">Configure API endpoints and authentication</p>
                </div>
    
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-neutral-700 mb-1">API Key</label>
                        <div class="flex space-x-2">
                            <input type="password" value="••••••••••••••••" class="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
                            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                Regenerate
                            </button>
                        </div>
                    </div>
    
                    <div>
                        <label class="block text-sm font-medium text-neutral-700 mb-1">Webhook URL</label>
                        <input type="url" placeholder="https://" class="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
                    </div>
    
                    <div class="flex items-center justify-between">
                        <label class="text-sm font-medium text-neutral-700">Enable API Access</label>
                        <button class="relative inline-flex items-center h-6 rounded-full w-11 bg-indigo-600">
                            <span class="translate-x-6 inline-block w-4 h-4 transform bg-white rounded-full"></span>
                        </button>
                    </div>
                </div>
            </div>
    )
}

export default SystemSettings