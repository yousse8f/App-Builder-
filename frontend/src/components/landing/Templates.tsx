'use client';

import { Briefcase, Utensils, ShoppingBag, GraduationCap, Users, Wrench, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function Templates() {
  const { t } = useLanguage();

  const templates = [
    {
      icon: Briefcase,
      name: t.templates.items[0].name,
      category: t.templates.items[0].category,
      description: t.templates.items[0].description,
      status: 'available',
    },
    {
      icon: Utensils,
      name: t.templates.items[1].name,
      category: t.templates.items[1].category,
      description: t.templates.items[1].description,
      status: 'available',
    },
    {
      icon: ShoppingBag,
      name: t.templates.items[2].name,
      category: t.templates.items[2].category,
      description: t.templates.items[2].description,
      status: 'available',
    },
    {
      icon: GraduationCap,
      name: t.templates.items[3].name,
      category: t.templates.items[3].category,
      description: t.templates.items[3].description,
      status: 'comingSoon',
    },
    {
      icon: Users,
      name: t.templates.items[4].name,
      category: t.templates.items[4].category,
      description: t.templates.items[4].description,
      status: 'comingSoon',
    },
    {
      icon: Wrench,
      name: t.templates.items[5].name,
      category: t.templates.items[5].category,
      description: t.templates.items[5].description,
      status: 'comingSoon',
    },
  ];

  return (
    <section id="templates" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            {t.templates.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.templates.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                  <template.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="mb-3">
                  <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
                    {template.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{template.description}</p>
                {template.status === 'comingSoon' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                    <Clock className="w-3 h-3" />
                    {t.features.comingSoon}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {t.templates.comingSoon}
          </span>
        </div>
      </div>
    </section>
  );
}