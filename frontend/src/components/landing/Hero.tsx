'use client';

import Link from 'next/link';
import { ArrowRight, Smartphone, Layers, Zap, Star, Users, Shield, Award } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-14 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-white">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-indigo-700 text-sm font-medium">{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
              {t.hero.titleLine1}{' '}
              <span className="text-indigo-600">{t.hero.titleLine2}</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/register"
                className="group bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                {t.hero.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg text-base font-medium border border-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t.hero.secondary}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <span className="text-3xl font-bold text-gray-900">10K+</span>
                </div>
                <p className="text-gray-500 text-sm">{t.hero.stats.users}</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-indigo-500" />
                  <span className="text-3xl font-bold text-gray-900">500+</span>
                </div>
                <p className="text-gray-500 text-sm">{t.hero.stats.apps}</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Star className="w-5 h-5 text-indigo-500" />
                  <span className="text-3xl font-bold text-gray-900">4.9</span>
                </div>
                <p className="text-gray-500 text-sm">{t.hero.stats.rating}</p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield className="w-4 h-4 text-green-500" />
                <span>{t.hero.trustBadges.security}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>{t.hero.trustBadges.compliance}</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="font-semibold text-gray-900">{t.hero.dashboard.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">{t.hero.dashboard.live}</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Smartphone className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-600">{t.hero.dashboard.projects}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-600">{t.hero.dashboard.templates}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">{t.hero.dashboard.builds}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>

                {/* Project List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">E-Commerce App</p>
                        <p className="text-xs text-gray-500">Business • iOS & Android</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">{t.hero.dashboard.active}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Restaurant App</p>
                        <p className="text-xs text-gray-500">Food • iOS & Android</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Building</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Fitness Tracker</p>
                        <p className="text-xs text-gray-500">Health • iOS Only</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">Draft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur-2xl opacity-50 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}