'use client';

export default function ClientProjects() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Projects</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 opacity-50 cursor-not-allowed"
          disabled
        >
          Create Project (Coming Soon)
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Project Management</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Project management will be available in Part 3. This section will allow you to create and manage your app projects.
        </p>
      </div>
    </div>
  );
}