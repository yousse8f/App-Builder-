'use client';

import { languages, useLanguage } from '@/lib/i18n/language-context';

type LanguageSwitcherVariant = 'floating' | 'navbar' | 'inline';

export default function LanguageSwitcher({ variant = 'floating' }: { variant?: LanguageSwitcherVariant }) {
  const { locale, setLocale } = useLanguage();

  const variantClasses = {
    floating: 'fixed right-3 top-3 z-[100] w-[110px] sm:right-4 sm:top-4 sm:w-[130px] md:w-[140px]',
    navbar: 'relative w-[86px] sm:w-[96px]',
    inline: 'relative w-[88px] sm:w-[96px]',
  };

  const selectClasses = {
    floating:
      'w-full rounded-full border border-gray-200 bg-white/95 px-2 py-2 text-[11px] font-semibold tracking-wide text-gray-700 shadow-sm outline-none ring-0 backdrop-blur-sm transition hover:border-indigo-300 focus:border-indigo-400 sm:text-xs',
    navbar:
      'w-full rounded-full border border-gray-200 bg-white px-2 py-1.5 text-[10px] font-semibold tracking-wide text-gray-700 shadow-sm outline-none ring-0 transition hover:border-indigo-300 focus:border-indigo-400 sm:text-[11px]',
    inline:
      'w-full rounded-full border border-gray-200 bg-white px-2 py-1.5 text-[10px] font-semibold tracking-wide text-gray-700 shadow-sm outline-none ring-0 transition hover:border-indigo-300 focus:border-indigo-400 sm:text-[11px]',
  };

  return (
    <div className={variantClasses[variant]}>
      <label className="sr-only" htmlFor={`language-switcher-${variant}`}>
        Select language
      </label>
      <select
        id={`language-switcher-${variant}`}
        value={locale}
        onChange={(event) => setLocale(event.target.value as 'en' | 'es' | 'fr')}
        className={selectClasses[variant]}
        aria-label="Select language"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}
