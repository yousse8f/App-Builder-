'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is App Builder?',
      answer: 'App Builder is a SaaS platform that allows clients to create and manage mobile applications through a centralized platform. It provides tools for project management, template selection, application customization, and build preparation.',
    },
    {
      question: 'Do I need programming experience?',
      answer: 'App Builder is designed to be accessible to users with varying levels of technical expertise. While some features may benefit from technical knowledge, many aspects of the platform are designed to be user-friendly and intuitive.',
    },
    {
      question: 'Can I create mobile applications?',
      answer: 'Yes, App Builder supports mobile application development for iOS and Android platforms. You can create, customize, and manage your mobile applications through our platform.',
    },
    {
      question: 'Can I use templates?',
      answer: 'Template support is part of our platform roadmap. We are working on providing professionally designed templates that you can use as a starting point for your applications. This feature will be available soon.',
    },
    {
      question: 'Can I manage multiple projects?',
      answer: 'Yes, App Builder allows you to manage multiple projects from a single dashboard. You can organize, track, and manage all your applications in one place.',
    },
    {
      question: 'How does the build process work?',
      answer: 'The build process is designed to streamline application preparation. Our platform provides centralized workflows for managing and preparing your application builds. This feature is part of our ongoing development.',
    },
    {
      question: 'Can I manage licenses?',
      answer: 'License management capabilities are planned for the platform. This will allow you to manage application licenses and activation from one central location. This feature is coming soon.',
    },
    {
      question: 'Is there a free plan?',
      answer: 'We are working on defining our pricing structure. Our goal is to provide flexible options that suit different needs, from individual developers to businesses. Pricing details will be announced soon.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about App Builder
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}