import React, {useEffect, useState} from 'react'
import Dashboard from './dashboard/dashboard'
import Queue from './queue/queue'
import Logs from './logs/logs'
import Results from './results/results'
import Upload from './upload/upload'
import Analytics from './analytics/analytics'
import Sidebar from './Sidebar/Sidebar'

function App() {
    return(
        <div>
            <Sidebar/>
            <main class="flex-1 ml-0 lg:ml-64 min-h-screen overflow-y-auto bg-[#E5E7EB]">
                <Dashboard/>
                <Upload/>
                <Queue/>
                <Results/>
                <Logs/>
                <Analytics/>
            </main>
        </div>
        
    )
}

export default App