// client/src/dashboard/DashboardCharts.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
         LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Processing Time Chart Component
export const ProcessingTimeChart = ({ data }) => {
  // Format data for chart
  const chartData = [
    { name: 'Document Classification', time: data?.documentClassification || 0.8 },
    { name: 'Data Extraction', time: data?.dataExtraction || 1.5 },
    { name: 'Validation', time: data?.validation || 0.6 },
    { name: 'Database Operations', time: data?.databaseOperations || 0.3 }
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
          <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [`${value} sec`, 'Processing Time']} />
          <Bar dataKey="time" fill="#6366F1" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Accuracy Metrics Chart Component
export const AccuracyMetricsChart = ({ data }) => {
  // Format data for chart
  const chartData = [
    { name: 'BERT Model', accuracy: data?.bertModel || 95 },
    { name: 'RoBERTa Model', accuracy: data?.robertaModel || 93 },
    { name: 'PaddleOCR', accuracy: data?.paddleOcr || 91 }
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 50, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
          <Bar dataKey="accuracy" fill="#10B981" barSize={20} label={{ position: 'right', formatter: (value) => `${value}%` }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Error Distribution Pie Chart Component
export const ErrorDistributionChart = ({ data }) => {
  // Format data for chart
  const chartData = [
    { name: 'Format Errors', value: data?.formatErrors || 0.5 },
    { name: 'OCR Issues', value: data?.ocrIssues || 0.4 },
    { name: 'Classification Errors', value: data?.classificationErrors || 0.2 },
    { name: 'Other', value: data?.other || 0.1 }
  ];

  const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Error Rate']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Historical Processing Volume Chart
export const ProcessingVolumeChart = ({ data }) => {
  // Sample data - in a real application, this would come from API
  const chartData = data || [
    { name: 'Mon', volume: 45 },
    { name: 'Tue', volume: 52 },
    { name: 'Wed', volume: 49 },
    { name: 'Thu', volume: 60 },
    { name: 'Fri', volume: 72 },
    { name: 'Sat', volume: 58 },
    { name: 'Sun', volume: 50 }
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} documents`, 'Volume']} />
          <Legend />
          <Line type="monotone" dataKey="volume" stroke="#6366F1" activeDot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Dashboard Charts Container Component
const DashboardCharts = ({ processingMetrics }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Processing Time Distribution</h2>
        <ProcessingTimeChart data={processingMetrics} />
      </div>
      <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Accuracy Metrics</h2>
        <AccuracyMetricsChart data={processingMetrics} />
      </div>
    </div>
  );
};

export default DashboardCharts;