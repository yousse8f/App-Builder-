import { UserPlus, LayoutTemplate, Settings, Rocket } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create your account',
      description: 'Sign up and set up your App Builder workspace in minutes.',
    },
    {
      number: '02',
      icon: LayoutTemplate,
      title: 'Choose a template',
      description: 'Select from professionally designed templates to get started fast.',
    },
    {
      number: '03',
      icon: Settings,
      title: 'Customize your application',
      description: 'Tailor the app to your needs with intuitive customization tools.',
    },
    {
      number: '04',
      icon: Rocket,
      title: 'Build and manage your app',
      description: 'Prepare builds and manage your application lifecycle.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            From idea to application in four simple steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamlined workflow to take you from concept to deployed application
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-50 rounded-xl p-6 h-full">
                <div className="text-indigo-600 font-bold text-sm mb-4">{step.number}</div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                  <step.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-indigo-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}