import Link from 'next/link';
import { Check, X } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small projects',
      price: 'Coming Soon',
      features: [
        { name: 'Up to 3 projects', included: true },
        { name: 'Basic templates', included: true },
        { name: 'Community support', included: true },
        { name: 'Build management', included: true },
        { name: 'License management', included: false },
        { name: 'Priority support', included: false },
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      description: 'For growing businesses and teams',
      price: 'Coming Soon',
      features: [
        { name: 'Unlimited projects', included: true },
        { name: 'All templates', included: true },
        { name: 'Priority support', included: true },
        { name: 'Build management', included: true },
        { name: 'License management', included: true },
        { name: 'Team collaboration', included: false },
      ],
      highlighted: true,
    },
    {
      name: 'Business',
      description: 'For large organizations and enterprises',
      price: 'Coming Soon',
      features: [
        { name: 'Unlimited projects', included: true },
        { name: 'All templates', included: true },
        { name: '24/7 dedicated support', included: true },
        { name: 'Build management', included: true },
        { name: 'License management', included: true },
        { name: 'Team collaboration', included: true },
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include core features.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              Plans coming soon
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 border-2 ${
                plan.highlighted
                  ? 'border-indigo-600 shadow-xl relative'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}