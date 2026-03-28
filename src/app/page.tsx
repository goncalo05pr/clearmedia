"use client";

import HeroSection from "@/components/hero-section";
import ScrollingBanner from "@/components/scrolling-banner";
import StatsSection from "@/components/stats-section";
import ServicesSection from "@/components/services-section";
import HowItWorksSection from "@/components/how-it-works-section";
import TestimonialsSection from "@/components/testimonials-section";
import FinalCTASection from "@/components/final-cta-section";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Scrolling Banner */}
      <ScrollingBanner />

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <ServicesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Final CTA Section */}
      <FinalCTASection />

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-[#ff4d2e]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-[#ff4d2e] mb-4">KLIQZ</h3>
              <p className="text-gray-400">
                Performance marketing agency spécialisée dans l'acquisition client et le ROI optimisation.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#services" className="hover:text-[#ff4d2e] transition-colors">SEO Optimisation</Link></li>
                <li><Link href="#services" className="hover:text-[#ff4d2e] transition-colors">Paid Ads</Link></li>
                <li><Link href="#services" className="hover:text-[#ff4d2e] transition-colors">Social Media</Link></li>
                <li><Link href="#services" className="hover:text-[#ff4d2e] transition-colors">Content Creation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Ressources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/formations" className="hover:text-[#ff4d2e] transition-colors">Formations</Link></li>
                <li><Link href="/blog" className="hover:text-[#ff4d2e] transition-colors">Blog</Link></li>
                <li><Link href="/cas-clients" className="hover:text-[#ff4d2e] transition-colors">Cas clients</Link></li>
                <li><Link href="/contact" className="hover:text-[#ff4d2e] transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 contact@kliqz.com</p>
                <p>📱 +33 6 12 34 56 78</p>
                <p>📍 Paris, France</p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#ff4d2e]/10 text-center text-gray-400">
            <p>&copy; 2024 KLIQZ. Tous droits réservés. | 
              <Link href="/mentions" className="hover:text-[#ff4d2e] transition-colors ml-1">Mentions légales</Link> | 
              <Link href="/confidentialite" className="hover:text-[#ff4d2e] transition-colors ml-1">Confidentialité</Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Syne', sans-serif;
        }

        html {
          scroll-behavior: smooth;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
