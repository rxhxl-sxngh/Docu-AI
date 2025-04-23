// client/src/queue/queue.jsx
import React from 'react';
import QueueTable from './QueueTable';

// Main Queue Component
const Queue = () => {
  return (
    <section id="queue" className="p-6">
      {/* Header Component */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Processing Queue</h1>
          <p className="text-neutral-600 mt-1">Monitor and manage document processing status</p>
        </div>
      </div>
      
      {/* QueueTable Component */}
      <QueueTable />
    </section>
  );
};

export default Queue;