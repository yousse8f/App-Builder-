'use client';

import { UserPlus, Smartphone, LayoutTemplate, Settings, Rocket } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: t.howItWorks.steps[0].title,
      description: t.howItWorks.steps[0].description,
    },
    {
      number: '02',
      icon: Smartphone,
      title: t.howItWorks.steps[1].title,
      description: t.howItWorks.steps[1].description,
    },
    {
      number: '03',
      icon: Settings,
      title: t.howItWorks.steps[2].title,
      description: t.howItWorks.steps[2].description,
    },
    {
      number: '04',
      icon: Rocket,
      title: t.howItWorks.steps[3].title,
      description: t.howItWorks.steps[3].description,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-6 h-full border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
                {/* Step Number */}
                <div className="text-4xl font-bold text-gray-200 mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                  <step.icon className="w-6 h-6 text-indigo-600" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gray-300 relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}