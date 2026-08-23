import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import TrustSection from '@/components/landing/TrustSection';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import ProductPreview from '@/components/landing/ProductPreview';
import Templates from '@/components/landing/Templates';
import Benefits from '@/components/landing/Benefits';
import Security from '@/components/landing/Security';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustSection />
      <Features />
      <HowItWorks />
      <ProductPreview />
      <Templates />
      <Benefits />
      <Security />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}