'use client';

import { Smartphone, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

export default function ProductPreview() {
  const { t } = useLanguage();

  const projects = [
    {
      name: t.productPreview.projects[0].name,
      platform: t.productPreview.projects[0].platform,
      template: t.productPreview.projects[0].template,
      status: t.productPreview.projects[0].status,
      statusIcon: CheckCircle,
      statusColor: 'green',
      license: t.productPreview.projects[0].license,
    },
    {
      name: t.productPreview.projects[1].name,
      platform: t.productPreview.projects[1].platform,
      template: t.productPreview.projects[1].template,
      status: t.productPreview.projects[1].status,
      statusIcon: Clock,
      statusColor: 'yellow',
      license: t.productPreview.projects[1].license,
    },
    {
      name: t.productPreview.projects[2].name,
      platform: t.productPreview.projects[2].platform,
      template: t.productPreview.projects[2].template,
      status: t.productPreview.projects[2].status,
      statusIcon: AlertCircle,
      statusColor: 'blue',
      license: t.productPreview.projects[2].license,
    },
    {
      name: t.productPreview.projects[3].name,
      platform: t.productPreview.projects[3].platform,
      template: t.productPreview.projects[3].template,
      status: t.productPreview.projects[3].status,
      statusIcon: CheckCircle,
      statusColor: 'green',
      license: t.productPreview.projects[3].license,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            {t.productPreview.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.productPreview.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-semibold text-gray-900">{t.hero.dashboard.title}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">iOS</span>
                  <span className="text-xs text-gray-500">Android</span>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs text-gray-600">{t.productPreview.stats.totalProjects}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">{t.productPreview.stats.active}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-gray-600">{t.productPreview.stats.building}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">{t.productPreview.stats.drafts}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="pb-4 font-medium">{t.productPreview.table.project}</th>
                    <th className="pb-4 font-medium">{t.productPreview.table.platform}</th>
                    <th className="pb-4 font-medium">{t.productPreview.table.template}</th>
                    <th className="pb-4 font-medium">{t.productPreview.table.status}</th>
                    <th className="pb-4 font-medium">{t.productPreview.table.license}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.map((project, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-indigo-600" />
                          </div>
                          <span className="font-medium text-gray-900">{project.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">{project.platform}</td>
                      <td className="py-4 text-gray-600">{project.template}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                          ${project.statusColor === 'green' ? 'bg-green-100 text-green-700' : ''}
                          ${project.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${project.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                        `}>
                          <project.statusIcon className="w-3 h-3" />
                          <span>{project.status}</span>
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${project.license === 'Active' || project.license === 'Activo' || project.license === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                        `}>
                          {project.license}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}