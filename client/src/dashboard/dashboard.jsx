// client/src/dashboard/dashboard.jsx
import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import documentService from '../services/documentService';
import DashboardCharts from './DashboardCharts';
import { logout, getToken, setToken, isAuthenticated } from '../services/authService.js';

function Dashboard() {
    // State for dashboard data
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        documentCounts: {
            pending: 0,
            processing: 0,
            processed: 0,
            failed: 0,
            total: 0
        },
        queueCounts: {
            pending: 0,
            processing: 0,
            completed: 0,
            failed: 0,
            total: 0
        },
        processingMetrics: {
            avgConfidence: 0,
            avgProcessingTime: 0
        },
        recentActivity: {
            documents: [],
            results: []
        }
    });
    
    const [recentDocuments, setRecentDocuments] = useState([]);
    const [processingTimeData, setProcessingTimeData] = useState({
        documentClassification: 0.8,
        dataExtraction: 1.5,
        validation: 0.6,
        databaseOperations: 0.3
    });

    // Log the received data structure for debugging
    const logApiResponse = (data, name) => {
        console.log(`Received ${name} data:`, data);
        return data;
    };

    // Process the stats data to ensure it matches expected structure
    const processStatsData = (data) => {
        // Ensure we have the expected structure, with fallbacks to default values
        return {
            documentCounts: {
                pending: data?.document_counts?.pending || 0,
                processing: data?.document_counts?.processing || 0,
                processed: data?.document_counts?.processed || 0,
                failed: data?.document_counts?.failed || 0,
                total: data?.document_counts?.total || 0
            },
            queueCounts: {
                pending: data?.queue_counts?.pending || 0,
                processing: data?.queue_counts?.processing || 0,
                completed: data?.queue_counts?.completed || 0,
                failed: data?.queue_counts?.failed || 0,
                total: data?.queue_counts?.total || 0
            },
            processingMetrics: {
                avgConfidence: data?.processing_metrics?.avg_confidence || 0,
                avgProcessingTime: data?.processing_metrics?.avg_processing_time || 0
            },
            recentActivity: {
                documents: data?.recent_activity?.documents || [],
                results: data?.recent_activity?.results || []
            }
        };
    };

    // Fetch dashboard data from API
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                if(isAuthenticated()) {
                    setToken(getToken());
                } else {
                    throw new Error("User is not authenticated");
                }
                // Fetch processing stats
                const rawStatsData = await dashboardService.getProcessingStats();
                logApiResponse(rawStatsData, 'stats');
                
                // Process the stats to ensure expected structure
                const processedStats = processStatsData(rawStatsData);
                setStats(processedStats);
                
                // Fetch recent documents for the activity table
                const documents = await documentService.getDocuments(0, 5);
                logApiResponse(documents, 'documents');
                setRecentDocuments(documents || []);
                
                // Get processing metrics for charts
                const metricsData = await dashboardService.getProcessingMetrics();
                logApiResponse(metricsData, 'metrics');
                setProcessingTimeData(metricsData.processingTime || processingTimeData);
                
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(`Failed to load dashboard data: ${err.message}`);
                logout();
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDashboardData();
        
        // Refresh dashboard data every 30 seconds
        const intervalId = setInterval(fetchDashboardData, 30000);
        
        return () => clearInterval(intervalId);
    }, []);

    // Function to format timestamps
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };

    // Function to format currency
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    // Function to get a percentage safely
    const safePercentage = (part, total, fallback = 0) => {
        if (!total || total === 0) return fallback;
        return ((part / total) * 100).toFixed(1);
    };

    // Function to convert status to tag component
    const statusTag = (status) => { 
        if (!status) return <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">Unknown</span>;
        
        status = status.toLowerCase();
        if (status === "processed" || status === "completed") {
            return <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Processed</span>;
        } else if (status === "processing") {
            return <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">Processing</span>;
        } else if (status === "failed") {
            return <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Failed</span>;
        } else if (status === "pending") {
            return <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">Pending</span>;
        }
        return <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">{status}</span>;
    };

    // Handle new document upload
    const handleUploadClick = () => { 
        window.location.href = '#upload';
    };

    return(
        <section id="dashboard" className="p-6">
            {/* Error message if any */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            
            {/* Loading state */}
            {isLoading && !error && (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            )}
            
            {/* Dashboard content when data is loaded */}
            {!isLoading && !error && (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-neutral-800">Invoice Processing Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <button onClick={handleUploadClick} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                New Upload
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Total Processed */}
                        <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600">Total Processed</p>
                                    <h3 className="text-2xl font-bold text-neutral-800">{stats.documentCounts?.processed || 0}</h3>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-green-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                                </svg>
                                <span className="text-sm">
                                    {safePercentage(stats.documentCounts?.processed || 0, stats.documentCounts?.total || 1)}% of total
                                </span>
                            </div>
                        </div>

                        {/* Success Rate */}
                        <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600">Success Rate</p>
                                    <h3 className="text-2xl font-bold text-neutral-800">
                                        {safePercentage(stats.documentCounts?.processed || 0, stats.documentCounts?.total || 0, 0)}%
                                    </h3>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-blue-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                                </svg>
                                <span className="text-sm">
                                    Avg. confidence: {((stats.processingMetrics?.avgConfidence || 0) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        {/* In Queue */}
                        <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600">In Queue</p>
                                    <h3 className="text-2xl font-bold text-neutral-800">{stats.queueCounts?.pending || 0}</h3>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-yellow-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                                </svg>
                                <span className="text-sm">{stats.queueCounts?.processing || 0} currently processing</span>
                            </div>
                        </div>

                        {/* Failed */}
                        <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600">Failed</p>
                                    <h3 className="text-2xl font-bold text-neutral-800">{stats.documentCounts?.failed || 0}</h3>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-red-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                                </svg>
                                <span className="text-sm">
                                    {safePercentage(stats.documentCounts?.failed || 0, stats.documentCounts?.total || 0, 0)}% failure rate
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg border border-neutral-200/30 mb-6">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Recent Activity</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-neutral-200/30">
                                            <th className="pb-3 text-sm font-semibold text-neutral-600">Invoice ID</th>
                                            <th className="pb-3 text-sm font-semibold text-neutral-600">File Name</th>
                                            <th className="pb-3 text-sm font-semibold text-neutral-600">Status</th>
                                            <th className="pb-3 text-sm font-semibold text-neutral-600">Size</th>
                                            <th className="pb-3 text-sm font-semibold text-neutral-600">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentDocuments && recentDocuments.length > 0 ? (
                                            recentDocuments.map((doc) => (
                                                <tr key={doc.id} className="border-b border-neutral-200/30">
                                                    <td className="py-4 text-sm text-neutral-800">DOC-{doc.id.toString().padStart(3, '0')}</td>
                                                    <td className="py-4 text-sm text-neutral-800">{doc.filename}</td>
                                                    <td className="py-4">{statusTag(doc.status)}</td>
                                                    <td className="py-4 text-sm text-neutral-800">
                                                        {doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                                                    </td>
                                                    <td className="py-4 text-sm text-neutral-600">{formatTimestamp(doc.uploaded_date)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-4 text-center text-neutral-500">
                                                    No recent activity found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Charts */}
                    <DashboardCharts processingMetrics={processingTimeData} />
                </>
            )}
        </section>
    );
}

export default Dashboard;