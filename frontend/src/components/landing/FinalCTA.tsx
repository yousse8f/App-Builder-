import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-indigo-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to build your next app?
        </h2>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
          Create your account and start building your application journey with App Builder.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="bg-indigo-700 text-white px-8 py-4 rounded-lg text-base font-medium border border-indigo-500 hover:bg-indigo-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}