'use client';

import Link from 'next/link';
import { Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              {t.pricing.badge}
            </span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t.pricing.comingSoonTitle}
            </h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              {t.pricing.comingSoonDescription}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              {t.pricing.notify}
              <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}