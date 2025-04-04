import UserProfile from "./user_profile"
import React from "react"
import { useState } from "react"

function Sidebar() {
     const [activeLink, setactiveLink] = useState("#dashboard");
     function handleClick(link){
        setactiveLink(link);
     }
    return(
        <nav class="h-screen w-64 fixed bg-white border-r border-neutral-200/30 hidden lg:block">
            <div class="flex flex-col h-full">
                {/*<!-- Logo Section -->*/}
                <div class="p-6 border-b border-neutral-200/30">
                    <div class="text-2xl font-bold text-neutral-800">DocuAI</div>
                </div>

                {/*<!-- Navigation Links -->*/}
                <div class="flex-1 py-6">
                    <a href="#dashboard" onClick={() =>handleClick('#dashboard')} 
                    class={`flex items-center px-6 py-3 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200 ${activeLink === '#dashboard' ? 'bg-neutral-100 text-neutral-900 active' : ''}`}
                    >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        Dashboard
                    </a>
                    <a href="#upload" 
                    onClick={() => handleClick('#upload')}
                    class={`flex items-center px-6 py-3 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200 ${activeLink === '#upload' ? 'bg-neutral-100 text-neutral-900 active' : ''}`}                    >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                        Upload
                    </a>
                    <a href="#queue" onClick={() => handleClick("#queue")}
                    class={`flex items-center px-6 py-3 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200 ${activeLink === '#queue' ? 'bg-neutral-100 text-neutral-900 active' : ''}`}                    >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                        Queue
                    </a>
                    <a href="#results" onClick={() => handleClick("#results")}
                    class={`flex items-center px-6 py-3 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200 ${activeLink === '#results' ? 'bg-neutral-100 text-neutral-900 active' : ''}`}                    >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        Results
                    </a>
                    <a href="#logs" onClick={() => handleClick("#logs")}
                    class={`flex items-center px-6 py-3 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200 ${activeLink === '#logs' ? 'bg-neutral-100 text-neutral-900 active' : ''}`}                    >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        Logs
                    </a>
                    <a href="#analytics" onClick={() => handleClick("#analytics")}
                    class={`flex items-center px-6 py-3 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200 ${activeLink === '#analytics' ? 'bg-neutral-100 text-neutral-900 active' : ''}`}                    >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                        Analytics
                    </a>
                </div>

                {/*<!-- User Profile Section -->*/}
                <UserProfile/>
            </div>
        </nav>
    )
}

export default Sidebar
