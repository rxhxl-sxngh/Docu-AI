import React from 'react';

// Header Component
const QueueHeader = () => {
  return (
    
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Processing Queue</h1>
        <p className="text-neutral-600 mt-1">Monitor and manage document processing status</p>
      </div>
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Processing
        </button>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, count, statusText, statusColor, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
      <div className="text-sm text-neutral-600">{title}</div>
      <div className="text-2xl font-bold text-neutral-800 mt-1">{count}</div>
      <div className={`mt-2 text-${statusColor}-600 text-sm flex items-center`}>
        {icon}
        {statusText}
      </div>
    </div>
  );
};

// Stats Grid Component
const QueueStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatCard 
        title="Pending"
        count={12}
        statusText="Awaiting Processing"
        statusColor="yellow"
        icon={
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      
      <StatCard 
        title="Processing"
        count={5}
        statusText="In Progress"
        statusColor="blue"
        icon={
          <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        }
      />
      
      <StatCard 
        title="Completed"
        count={45}
        statusText="Successfully Processed"
        statusColor="green"
        icon={
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      
      <StatCard 
        title="Failed"
        count={3}
        statusText="Requires Attention"
        statusColor="red"
        icon={
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
};

// Table Filter Component
const TableFilter = () => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-neutral-800">Queue Items</h2>
      <div className="flex space-x-2">
        <input 
          type="text" 
          placeholder="Search documents..." 
          className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        <select className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>All Status</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Completed</option>
          <option>Failed</option>
        </select>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Processing': { color: 'blue', bg: 'blue' },
    'Pending': { color: 'yellow', bg: 'yellow' },
    'Completed': { color: 'green', bg: 'green' }
  };
  
  const config = statusConfig[status] || { color: 'gray', bg: 'gray' };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium text-${config.color}-700 bg-${config.bg}-100 rounded-full`}>
      {status}
    </span>
  );
};

// Progress Bar Component
const ProgressBar = ({ percentage, status }) => {
  const colorMap = {
    'Processing': 'blue',
    'Pending': 'yellow',
    'Completed': 'green'
  };
  
  const color = colorMap[status] || 'gray';
  const animation = status === 'Processing' ? 'animate-pulse' : '';
  
  return (
    <div className="w-full bg-neutral-200 rounded-full h-2">
      <div 
        className={`bg-${color}-600 h-2 rounded-full ${animation}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// Action Button Component
const ActionButton = () => {
  return (
    <button className="text-neutral-400 hover:text-neutral-600">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    </button>
  );
};

// Queue Table Row Component
const QueueTableRow = ({ docId, fileName, status, progress, submitted }) => {
  return (
    <tr className="border-b border-neutral-200">
      <td className="py-4 text-sm text-neutral-800">{docId}</td>
      <td className="py-4 text-sm text-neutral-800">{fileName}</td>
      <td className="py-4">
        <StatusBadge status={status} />
      </td>
      <td className="py-4 w-48">
        <ProgressBar percentage={progress} status={status} />
      </td>
      <td className="py-4 text-sm text-neutral-600">{submitted}</td>
      <td className="py-4">
        <ActionButton />
      </td>
    </tr>
  );
};

// Pagination Component
const Pagination = ({ totalItems, currentPage, itemsPerPage }) => {
  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-neutral-600">
        Showing 1-3 of {totalItems} documents
      </div>
      <div className="flex space-x-2">
        <button className="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">Previous</button>
        <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">1</button>
        <button className="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">2</button>
        <button className="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">3</button>
        <button className="px-3 py-1 border border-neutral-200 rounded-lg hover:bg-neutral-50">Next</button>
      </div>
    </div>
  );
};

// Queue Table Component
const QueueTable = () => {
  // Sample data
  const queueItems = [
    { docId: 'DOC-001', fileName: 'invoice-2023-001.pdf', status: 'Processing', progress: 45, submitted: '2 min ago' },
    { docId: 'DOC-002', fileName: 'invoice-2023-002.pdf', status: 'Pending', progress: 0, submitted: '5 min ago' },
    { docId: 'DOC-003', fileName: 'invoice-2023-003.pdf', status: 'Completed', progress: 100, submitted: '10 min ago' }
  ];
  
  return (
    <div className="bg-white rounded-lg border border-neutral-200/30">
      <div className="p-6">
        <TableFilter />
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-neutral-200">
                <th className="pb-3 text-sm font-semibold text-neutral-600">Document ID</th>
                <th className="pb-3 text-sm font-semibold text-neutral-600">File Name</th>
                <th className="pb-3 text-sm font-semibold text-neutral-600">Status</th>
                <th className="pb-3 text-sm font-semibold text-neutral-600">Progress</th>
                <th className="pb-3 text-sm font-semibold text-neutral-600">Submitted</th>
                <th className="pb-3 text-sm font-semibold text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queueItems.map((item) => (
                <QueueTableRow 
                  key={item.docId}
                  docId={item.docId}
                  fileName={item.fileName}
                  status={item.status}
                  progress={item.progress}
                  submitted={item.submitted}
                />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination totalItems={20} currentPage={1} itemsPerPage={3} />
      </div>
    </div>
  );
};

// Main Queue Component
const Queue = () => {
  return (
    <section id="queue" className="p-6">
      <QueueHeader />
      <QueueStats />
      <QueueTable />
    </section>
  );
};

export default Queue;