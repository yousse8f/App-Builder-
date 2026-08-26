'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6">
          {t.finalCta.title}
        </h2>

        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t.finalCta.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="group bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            {t.finalCta.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg text-base font-medium border border-gray-200 transition-all duration-200"
          >
            {t.finalCta.secondary}
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-gray-500 text-sm">
          {t.finalCta.trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}