'use client';

import { Lock, ShieldCheck, Key, Database } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function Security() {
  const { t } = useLanguage();

  const securityFeatures = [
    { icon: Lock, title: t.security.features[0].title, description: t.security.features[0].description },
    { icon: ShieldCheck, title: t.security.features[1].title, description: t.security.features[1].description },
    { icon: Key, title: t.security.features[2].title, description: t.security.features[2].description },
    { icon: Database, title: t.security.features[3].title, description: t.security.features[3].description },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            {t.security.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.security.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-200 hover:shadow-md transition-all duration-200 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">{t.security.footer}</p>
        </div>
      </div>
    </section>
  );
}