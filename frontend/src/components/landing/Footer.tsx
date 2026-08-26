'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    product: [
      { name: t.nav.features, href: '#features' },
      { name: t.nav.templates, href: '#templates' },
      { name: t.nav.pricing, href: '#pricing' },
    ],
    company: [
      { name: t.footer.links.company[0], href: '#' },
      { name: t.footer.links.company[1], href: '#' },
      { name: t.nav.faq, href: '#faq' },
    ],
    resources: [
      { name: t.footer.links.resources[0], href: '#' },
      { name: t.footer.links.resources[1], href: '#' },
    ],
    legal: [
      { name: t.footer.links.legal[0], href: '#' },
      { name: t.footer.links.legal[1], href: '#' },
    ],
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-semibold text-white">App Builder</span>
            </div>
            <p className="text-sm text-white mb-4">{t.footer.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t.footer.product}</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white hover:text-indigo-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t.footer.company}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white hover:text-indigo-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t.footer.resources}</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white hover:text-indigo-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t.footer.legal}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white hover:text-indigo-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
          <p className="text-white">© 2026 App Builder. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}