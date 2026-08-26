'use client';

import { Smartphone, LayoutTemplate, FolderKanban, Hammer, Key, LayoutDashboard, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Smartphone,
      title: t.features.items[0].title,
      description: t.features.items[0].description,
      status: t.features.available,
    },
    {
      icon: LayoutTemplate,
      title: t.features.items[1].title,
      description: t.features.items[1].description,
      status: t.features.available,
    },
    {
      icon: FolderKanban,
      title: t.features.items[2].title,
      description: t.features.items[2].description,
      status: t.features.available,
    },
    {
      icon: Hammer,
      title: t.features.items[3].title,
      description: t.features.items[3].description,
      status: t.features.comingSoon,
    },
    {
      icon: Key,
      title: t.features.items[4].title,
      description: t.features.items[4].description,
      status: t.features.comingSoon,
    },
    {
      icon: LayoutDashboard,
      title: t.features.items[5].title,
      description: t.features.items[5].description,
      status: t.features.available,
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            {t.features.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                {feature.status === t.features.comingSoon && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t.features.comingSoon}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}