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
            <Dashboard/>
            <Queue/>
            <Logs/>
            <Results/>
            <Upload/>
            <Analytics/>
        </div>
        
    )
}

export default App