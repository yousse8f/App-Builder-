import { Zap, Layers, FolderTree, TrendingUp, Shield, Workflow } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: Zap,
      title: 'Faster Development',
      description: 'Reduce development time with streamlined workflows and ready-to-use components.',
    },
    {
      icon: Layers,
      title: 'Centralized Management',
      description: 'Control all aspects of your app development from a single platform.',
    },
    {
      icon: FolderTree,
      title: 'Reusable Templates',
      description: 'Leverage professional templates to accelerate project initialization.',
    },
    {
      icon: TrendingUp,
      title: 'Scalable Architecture',
      description: 'Build applications that can grow with your business needs.',
    },
    {
      icon: Shield,
      title: 'Professional Workflow',
      description: 'Follow industry-standard practices for app development and deployment.',
    },
    {
      icon: Workflow,
      title: 'Easy Project Organization',
      description: 'Keep track of multiple projects with intuitive organization tools.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-indigo-50 rounded-xl">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">10x</div>
                  <p className="text-sm text-gray-600">Faster Development</p>
                </div>
                <div className="text-center p-6 bg-teal-50 rounded-xl">
                  <div className="text-4xl font-bold text-teal-600 mb-2">50+</div>
                  <p className="text-sm text-gray-600">Templates</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-xl">
                  <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                  <p className="text-sm text-gray-600">Support</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-indigo-100 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-teal-100 rounded-full opacity-30 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}