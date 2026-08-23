'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    blockedClients: 0,
    totalProjects: 0,
    activeLicenses: 0,
    totalBuilds: 0,
    failedBuilds: 0,
  });

  // In a real implementation, these would come from API calls
  useEffect(() => {
    // Placeholder data - will be replaced with real API calls
    setStats({
      totalClients: 0,
      activeClients: 0,
      blockedClients: 0,
      totalProjects: 0,
      activeLicenses: 0,
      totalBuilds: 0,
      failedBuilds: 0,
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Clients</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalClients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Active Clients</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeClients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Blocked Clients</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.blockedClients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProjects}</p>
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
          <h3 className="text-gray-500 text-sm font-medium">Failed Builds</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.failedBuilds}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Clients</h3>
          <p className="text-gray-500 text-sm">No recent clients</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
          <p className="text-gray-500 text-sm">No recent projects</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Builds</h3>
          <p className="text-gray-500 text-sm">No recent builds</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">License Activity</h3>
          <p className="text-gray-500 text-sm">No recent license activity</p>
        </div>
      </div>
    </div>
  );
}