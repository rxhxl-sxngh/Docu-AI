import React, {useEffect, useState} from 'react'
import Dashboard from './dashboard/dashboard'
import Queue from './queue/queue'
import Logs from './logs/logs'
import Results from './results/results'
import Upload from './upload/upload'



function App() {
    return(
        <div>
            <Dashboard/>
            <Queue/>
            <Logs/>
            <Results/>
            <Upload/>

        </div>
        
    )
}

export default App