// File: client/src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Dashboard from './dashboard/dashboard'
import Queue from './queue/queue'
import Logs from './logs/logs'
import Results from './results/results'
import Upload from './upload/upload'
import Analytics from './analytics/analytics'
import Sidebar from './Sidebar/Sidebar'
import SystemSettings from './system_settings/sys_settings'
import UserManagement from './user_management/UserManagement'
import Login from './auth/Login'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function MainContent() {
  return (
    <div>
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 min-h-screen overflow-y-auto bg-[#E5E7EB]">
        <Dashboard />
        <Upload />
        <Queue />
        <Results />
        <Logs />
        <Analytics />
        <SystemSettings />
        <UserManagement />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App