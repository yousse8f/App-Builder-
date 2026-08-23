'use client';

export default function ClientTemplates() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Templates</h2>

      <div className="bg-white shadow rounded-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Template Gallery</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          The template gallery will be available in Part 4. This section will allow you to browse and select app templates for your projects.
        </p>
      </div>
    </div>
  );
}