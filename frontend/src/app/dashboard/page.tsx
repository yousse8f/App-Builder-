'use client';

import { useEffect, useState } from 'react';

export default function ClientDashboard() {
  const [stats, setStats] = useState({
    myProjects: 0,
    activeLicenses: 0,
    totalBuilds: 0,
    templates: 0,
  });

  // In a real implementation, these would come from API calls
  useEffect(() => {
    // Placeholder data - will be replaced with real API calls
    setStats({
      myProjects: 0,
      activeLicenses: 0,
      totalBuilds: 0,
      templates: 0,
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">My Projects</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.myProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Licenses</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeLicenses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Builds</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBuilds}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Available Templates</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.templates}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
          <p className="text-gray-500 text-sm">No recent projects</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Builds</h3>
          <p className="text-gray-500 text-sm">No recent builds</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">License Status</h3>
          <p className="text-gray-500 text-sm">No active licenses</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded hover:bg-gray-100">
              Create New Project
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded hover:bg-gray-100">
              Browse Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}