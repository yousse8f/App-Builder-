import { Zap, Layers, FolderTree, TrendingUp, Shield, Workflow } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: Zap,
      title: 'Save development time',
      description: 'Reduce development time with streamlined workflows and ready-to-use components.',
    },
    {
      icon: Layers,
      title: 'Centralize app management',
      description: 'Control all aspects of your app development from a single platform.',
    },
    {
      icon: FolderTree,
      title: 'Start from reusable templates',
      description: 'Leverage professional templates to accelerate project initialization.',
    },
    {
      icon: TrendingUp,
      title: 'Scale as your business grows',
      description: 'Build applications that can grow with your business needs.',
    },
    {
      icon: Shield,
      title: 'Manage clients and projects',
      description: 'Follow industry-standard practices for app development and deployment.',
    },
    {
      icon: Workflow,
      title: 'Easy project organization',
      description: 'Keep track of multiple projects with intuitive organization tools.',
    },
  ];

  const stats = [
    {
      value: '10x',
      label: 'Faster Development',
    },
    {
      value: '50+',
      label: 'Templates',
    },
    {
      value: '99%',
      label: 'Uptime',
    },
    {
      value: '24/7',
      label: 'Support',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
              Why choose App Builder?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Build professional mobile applications without the complexity of traditional development. Our platform provides the tools and structure you need to succeed.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                      <benefit.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-white rounded-lg border border-gray-100">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}