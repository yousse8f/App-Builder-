import { Smartphone, LayoutTemplate, FolderKanban, Hammer, Key, LayoutDashboard } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Smartphone,
      title: 'Visual App Building',
      description: 'Build application projects through a centralized platform with intuitive tools.',
      status: 'Available',
    },
    {
      icon: LayoutTemplate,
      title: 'Ready-made Templates',
      description: 'Start faster with professionally designed templates for various industries.',
      status: 'Available',
    },
    {
      icon: FolderKanban,
      title: 'Project Management',
      description: 'Keep all your applications and projects organized in one workspace.',
      status: 'Available',
    },
    {
      icon: Hammer,
      title: 'Automated Builds',
      description: 'Prepare application builds through a centralized workflow.',
      status: 'Coming Soon',
    },
    {
      icon: Key,
      title: 'License Management',
      description: 'Manage application licenses and activation from one place.',
      status: 'Coming Soon',
    },
    {
      icon: LayoutDashboard,
      title: 'Client Dashboard',
      description: 'Monitor projects, builds, templates, and account information.',
      status: 'Available',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to build and manage your apps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to streamline your mobile app development journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                {feature.status === 'Coming Soon' && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                    Coming Soon
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}