"use client";

import { useEffect, useState } from "react";

export default function StatsSection() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    clients: 0,
    roi: 0,
    experience: 0,
    revenue: 0
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setStats({
          clients: 247,
          roi: 320,
          experience: 8,
          revenue: 2.3
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  const statItems = [
    {
      value: `${stats.clients}+`,
      label: "Clients satisfaits",
      icon: "👥",
      color: "from-[#ff4d2e] to-[#ff6b3d]"
    },
    {
      value: `+${stats.roi}%`,
      label: "ROI moyen",
      icon: "📈",
      color: "from-[#ff6b3d] to-[#ff8a65]"
    },
    {
      value: `${stats.experience} ans`,
      label: "Expérience",
      icon: "⚡",
      color: "from-[#ff8a65] to-[#ffa500]"
    },
    {
      value: `${stats.revenue}M€`,
      label: "Revenus générés",
      icon: "💰",
      color: "from-[#ffa500] to-[#ff4d2e]"
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Des résultats qui
            <span className="block bg-gradient-to-r from-[#ff4d2e] to-[#ff6b3d] bg-clip-text text-transparent">
              parlent d'eux-mêmes
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Chiffres réels de nos clients transformés par nos stratégies data-driven
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#ff4d2e]/10 p-8 transition-all duration-300 hover:scale-105 hover:border-[#ff4d2e]/30"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 transition-all duration-500">
                  {mounted ? stat.value : "0"}
                </div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#ff4d2e] rounded-full opacity-50"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#ff4d2e] rounded-full opacity-30"></div>
            </div>
          ))}
        </div>

        {/* Additional Stats Bar */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#ff4d2e]/5 to-[#ff6b3d]/5 border border-[#ff4d2e]/20 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-gray-400">Taux de satisfaction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">-45%</div>
              <div className="text-sm text-gray-400">Réduction CPA moyen</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-gray-400">Support disponible</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
