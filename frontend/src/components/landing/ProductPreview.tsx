import { Smartphone, Apple, Smartphone as AndroidIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function ProductPreview() {
  const projects = [
    {
      name: 'E-Commerce App',
      platform: 'iOS & Android',
      template: 'Business',
      status: 'Active',
      statusIcon: CheckCircle,
      statusColor: 'green',
      license: 'Active',
    },
    {
      name: 'Restaurant App',
      platform: 'iOS & Android',
      template: 'Restaurant',
      status: 'Building',
      statusIcon: Clock,
      statusColor: 'yellow',
      license: 'Active',
    },
    {
      name: 'Fitness Tracker',
      platform: 'iOS Only',
      template: 'Health',
      status: 'Draft',
      statusIcon: AlertCircle,
      statusColor: 'blue',
      license: 'Pending',
    },
    {
      name: 'Community Portal',
      platform: 'iOS & Android',
      template: 'Community',
      status: 'Active',
      statusIcon: CheckCircle,
      statusColor: 'green',
      license: 'Active',
    },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything in one workspace
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Manage your entire app development pipeline from a single dashboard
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
          {/* Dashboard Header */}
          <div className="bg-gray-750 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-semibold text-white">App Builder Dashboard</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Apple className="w-4 h-4 text-gray-400" />
                  <AndroidIcon className="w-4 h-4 text-gray-400" />
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-gray-400">Total Projects</span>
                </div>
                <p className="text-2xl font-bold text-white">4</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Active</span>
                </div>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Building</span>
                </div>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Drafts</span>
                </div>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
            </div>

            {/* Project Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                    <th className="pb-4">Project</th>
                    <th className="pb-4">Platform</th>
                    <th className="pb-4">Template</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">License</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {projects.map((project, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-900/50 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-indigo-400" />
                          </div>
                          <span className="font-medium text-white">{project.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-300">{project.platform}</td>
                      <td className="py-4 text-gray-300">{project.template}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                          ${project.statusColor === 'green' ? 'bg-green-900/30 text-green-400' : ''}
                          ${project.statusColor === 'yellow' ? 'bg-yellow-900/30 text-yellow-400' : ''}
                          ${project.statusColor === 'blue' ? 'bg-blue-900/30 text-blue-400' : ''}
                        `}>
                          <project.statusIcon className="w-3 h-3" />
                          <span>{project.status}</span>
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${project.license === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400'}
                        `}>
                          {project.license}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}