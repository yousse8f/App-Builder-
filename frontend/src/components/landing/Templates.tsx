import { Briefcase, Utensils, ShoppingBag, GraduationCap, Users, Wrench } from 'lucide-react';

export default function Templates() {
  const templates = [
    {
      icon: Briefcase,
      name: 'Business',
      category: 'Professional',
      description: 'Corporate and business applications with professional features.',
      color: 'blue',
    },
    {
      icon: Utensils,
      name: 'Restaurant',
      category: 'Food & Beverage',
      description: 'Complete restaurant management and ordering system.',
      color: 'orange',
    },
    {
      icon: ShoppingBag,
      name: 'E-commerce',
      category: 'Retail',
      description: 'Full-featured online store with payment integration.',
      color: 'purple',
    },
    {
      icon: GraduationCap,
      name: 'Education',
      category: 'Learning',
      description: 'Educational platforms and learning management systems.',
      color: 'green',
    },
    {
      icon: Users,
      name: 'Community',
      category: 'Social',
      description: 'Community building and social networking features.',
      color: 'pink',
    },
    {
      icon: Wrench,
      name: 'Services',
      category: 'Business',
      description: 'Service booking and management applications.',
      color: 'teal',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    pink: 'bg-pink-100 text-pink-600',
    teal: 'bg-teal-100 text-teal-600',
  };

  return (
    <section id="templates" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Start with a template. Make it yours.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from professionally designed templates to accelerate your development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${colorClasses[template.color as keyof typeof colorClasses]}`}>
                <template.icon className="w-7 h-7" />
              </div>
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {template.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              <button className="text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors flex items-center gap-1 group-hover:gap-2">
                Preview
                <span className="transition-all">→</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            Template system coming soon
          </span>
        </div>
      </div>
    </section>
  );
}