"use client";

export default function ScrollingBanner() {
  const services = [
    "🚀 KLIQZ • Performance Marketing Agency",
    "🎯 Media Buying Expert • ROI Optimization",
    "📊 Data-Driven Strategy • Analytics & Reporting",
    "🎨 Creative Ads • A/B Testing • Conversion",
    "⚡ Rapid Scaling • Growth Hacking",
    "💰 Revenue Maximization • CPA Reduction",
    "📱 Multi-Channel Strategy • Social Media Marketing",
    "🔍 SEO Optimization • Content Marketing",
    "🎯 Targeted Acquisition • Customer Journey",
    "📈 Performance Tracking • Real-Time Analytics"
  ];

  return (
    <section className="relative overflow-hidden bg-black border-y border-[#ff4d2e]/10">
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
        
        {/* Scrolling content */}
        <div className="flex animate-scroll">
          {/* First set */}
          <div className="flex whitespace-nowrap">
            {services.map((service, index) => (
              <div key={`first-${index}`} className="inline-flex items-center px-8 py-4">
                <span className="text-lg font-semibold text-[#ff4d2e]">
                  {service}
                </span>
                <span className="mx-4 text-[#ff4d2e]/50">•</span>
              </div>
            ))}
          </div>
          
          {/* Duplicate set for seamless loop */}
          <div className="flex whitespace-nowrap">
            {services.map((service, index) => (
              <div key={`second-${index}`} className="inline-flex items-center px-8 py-4">
                <span className="text-lg font-semibold text-[#ff4d2e]">
                  {service}
                </span>
                <span className="mx-4 text-[#ff4d2e]/50">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
