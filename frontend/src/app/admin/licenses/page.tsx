'use client';

export default function AdminLicenses() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Licenses</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">License Management</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          License management will be available in Part 7. This section will allow you to manage app licenses and keys.
        </p>
      </div>
    </div>
  );
}