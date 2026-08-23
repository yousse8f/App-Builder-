import { Zap, FolderKanban, LayoutTemplate, Settings } from 'lucide-react';

export default function TrustSection() {
  const benefits = [
    {
      icon: Zap,
      title: 'Build Faster',
      description: 'Accelerate your app development with streamlined workflows',
    },
    {
      icon: FolderKanban,
      title: 'Manage Projects',
      description: 'Keep all your applications organized in one place',
    },
    {
      icon: LayoutTemplate,
      title: 'Ready-to-use Templates',
      description: 'Start with professionally designed templates',
    },
    {
      icon: Settings,
      title: 'Centralized Management',
      description: 'Control builds, licenses, and deployments from a single dashboard',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Everything you need to manage your app journey in one place
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                <benefit.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}