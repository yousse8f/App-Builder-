import { Lock, ShieldCheck, Key, Database } from 'lucide-react';

export default function Security() {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Token-based authentication system with access and refresh tokens for secure sessions.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access Control',
      description: 'Admin and client roles ensure proper access permissions and data separation.',
    },
    {
      icon: Key,
      title: 'Protected Client Data',
      description: 'Your application data and project information are protected with proper access controls.',
    },
    {
      icon: Database,
      title: 'Structured Project Management',
      description: 'Organized data structure with proper relationships between projects, builds, and licenses.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Built with security in mind
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your data and projects are protected with enterprise-grade security measures
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-xl mb-4">
                <feature.icon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            We continuously improve our security measures to protect your data
          </p>
        </div>
      </div>
    </section>
  );
}