'use client';

import { Zap, Shield, Scale, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function TrustSection() {
  const { t } = useLanguage();

  const benefits = [
    { icon: Zap, title: t.trust.benefits[0].title, description: t.trust.benefits[0].description },
    { icon: Shield, title: t.trust.benefits[1].title, description: t.trust.benefits[1].description },
    { icon: Scale, title: t.trust.benefits[2].title, description: t.trust.benefits[2].description },
    { icon: LayoutGrid, title: t.trust.benefits[3].title, description: t.trust.benefits[3].description },
  ];

  return (
    <section className="py-16 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
            {t.trust.title}
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