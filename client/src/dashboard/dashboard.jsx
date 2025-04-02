import React, {useEffect, useState} from 'react'

function Dashboard() {
    //TODO: add code to allow pdf upload
    const uploadClick = () => { 
        console.log("upload button clicked") 
    };
    return(
        <section id="dashboard" class="p-6">
            {/*<!-- Header -->*/}
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-neutral-800">Invoice Processing Dashboard</h1>
                <div class="flex items-center space-x-4">
                    <button onClick={uploadClick} class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
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
    const [totalProc, settotalProc] = useState(1);
    const [procInc, setprocInc] = useState(10);
    const [succRate, setsuccRate] = useState(50);
    const [succInc, setsuccInc] = useState(2.4);
    const [q, setq] = useState(100);
    const [newQ, setnewQ] = useState(10);
    const [fail, setfail] = useState(3);
    const [failInc, setfailInc] = useState(5.5);

    useEffect(() => {
        const interval = setInterval(() => {
            //TODO: Remove timer updater to on render and set vars to db function calls
            settotalProc(prev => prev + 1);
            setprocInc(prev => prev + 1);
            setsuccRate(prev => prev + 1);
            setsuccInc(prev => prev + 1);
            setq(prev => prev + 1);
            setnewQ(prev => prev + 1);
            setfail(prev => prev + 1);
            setfailInc(prev => prev + 1);
        }, 1000); // Runs every 1000ms (1 second)
        // Cleanup function that runs when the component unmounts
        return () => {
          clearInterval(interval); // Stops the timer when the component unmounts
        };
      }, []); 

    return(
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/*<!-- Stats Grid -->*/}
            {/*<!-- Total Processed -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Total Processed</p>
                        <h3 class="text-2xl font-bold text-neutral-800">{totalProc}</h3>
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
                    <span class="text-sm">{procInc}% increase</span>
                </div>
            </div>

            {/*<!-- Success Rate -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Success Rate</p>
                        <h3 class="text-2xl font-bold text-neutral-800">{succRate}%</h3>
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
                    <span class="text-sm">{succInc}% increase</span>
                </div>
            </div>

            {/*<!-- In Queue -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">In Queue</p>
                        <h3 class="text-2xl font-bold text-neutral-800">{q}</h3>
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
                    <span class="text-sm">{newQ} new today</span>
                </div>
            </div>

            {/*<!-- Failed -->*/}
            <div class="bg-white p-6 rounded-lg border border-neutral-200/30">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-neutral-600">Failed</p>
                        <h3 class="text-2xl font-bold text-neutral-800">{fail}</h3>
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
                    <span class="text-sm">-{failInc}% decrease</span>
                </div>
            </div>
        </div>
    )
}

function RecentActivity(){
    const [ID1, setID1] = useState("INV-2023-001-VAR");
    const [ID2, setID2] = useState("INV-2023-002-VAR");
    const [ID3, setID3] = useState("INV-2023-003-VAR");

    const [ID1vendor, setID1vendor] = useState("Tech Corp Ltd-VAR");
    const [ID2vendor, setID2vendor] = useState("Global Services Inc-VAR");
    const [ID3vendor, setID3vendor] = useState("Supply Chain Co-VAR");
    //add comma to numbers
    const [ID1total, setID1total] = useState(1234.56);
    const [ID2total, setID2total] = useState(2567.00);
    const [ID3total, setID3total] = useState(876.50);

    const [ID1time, setID1time] = useState(1);
    const [ID2time, setID2time] = useState(2);
    const [ID3time, setID3time] = useState(3);

    const [ID1status, setID1status] = useState("Processed");
    const [ID2status, setID2status] = useState("Processing");
    const [ID3status, setID3status] = useState("Failed");

    const statusTag = (status) => { 
        if (status === "Processed") {
          return <span class="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Processed</span>;
        } else if (status === "Processing") {
          return <span class="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">Processing</span>;
        } else if (status === "Failed") {
          return <span class="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Failed</span>;
        }
        return null; // Return null if the status doesn't match any of the conditions
      };
      

      
  useEffect(() => {
    const statusCycle = (currentStatus) => {
      switch (currentStatus) {
        case "Processed":
          return "Processing";
        case "Processing":
          return "Failed";
        case "Failed":
          return "Processed";
        default:
          return currentStatus;
      }
    };
    //TODO: ADD COMMA FOR NUMBER OVER 1K
    const interval = setInterval(() => {
      setID1time(prev => prev+1);
      setID2time(prev => prev+1);
      setID3time(prev => prev+1);
      setID1total(prev => prev+1);
      setID2total(prev => prev+1);
      setID3total(prev => prev+1);
      setID1status((prevStatus) => statusCycle(prevStatus));
      setID2status((prevStatus) => statusCycle(prevStatus));
      setID3status((prevStatus) => statusCycle(prevStatus));
    }, 1000); // Runs every second (1000ms)

    return () => {
      clearInterval(interval);
    };
  }, []); 
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
                                <td class="py-4 text-sm text-neutral-800">{ID1}</td>
                                <td class="py-4 text-sm text-neutral-800">{ID1vendor}</td>
                                <td class="py-4 text-sm text-neutral-800">${ID1total}</td>
                                <td class="py-4">
                                {statusTag(ID1status)} 
                                </td>
                                <td class="py-4 text-sm text-neutral-600">{ID1time} min ago</td>
                            </tr>
                            <tr class="border-b border-neutral-200/30">
                                <td class="py-4 text-sm text-neutral-800">{ID2}</td>
                                <td class="py-4 text-sm text-neutral-800">{ID2vendor}</td>
                                <td class="py-4 text-sm text-neutral-800">${ID2total}</td>
                                <td class="py-4">
                                {statusTag(ID2status)} 
                                </td>
                                <td class="py-4 text-sm text-neutral-600">{ID2time} min ago</td>
                            </tr>
                            <tr class="border-b border-neutral-200/30">
                                <td class="py-4 text-sm text-neutral-800">{ID3}</td>
                                <td class="py-4 text-sm text-neutral-800">{ID3vendor}</td>
                                <td class="py-4 text-sm text-neutral-800">${ID3total}</td>
                                <td class="py-4">
                                {statusTag(ID3status)} 
                                </td>
                                <td class="py-4 text-sm text-neutral-600">{ID3time} min ago</td>
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