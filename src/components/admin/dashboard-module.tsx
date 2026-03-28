"use client";

import { useState, useEffect } from "react";

interface Stats {
  totalUsers: number;
  totalSales: number;
  totalRevenue: number;
  activeUsers: number;
  monthlyRevenue: number;
  popularFormations: Array<{ id: string; title: string; purchases: number }>;
}

export default function DashboardModule() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeUsers: 0,
    monthlyRevenue: 0,
    popularFormations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler des données en temps réel
    const loadStats = async () => {
      try {
        // Simuler des données - en production, ça viendrait de Supabase
        const mockStats: Stats = {
          totalUsers: 1247,
          totalSales: 892,
          totalRevenue: 45680,
          activeUsers: 324,
          monthlyRevenue: 12450,
          popularFormations: [
            { id: "1", title: "Social Ads Mastery", purchases: 156 },
            { id: "2", title: "Funnel Premium", purchases: 142 },
            { id: "3", title: "Copy Closing", purchases: 98 }
          ]
        };
        
        setStats(mockStats);
        setLoading(false);
      } catch (error) {
        console.error('Error loading stats:', error);
        setLoading(false);
      }
    };

    loadStats();
    
    // Simuler des mises à jour en temps réel
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: Math.max(300, Math.floor(Math.random() * 400)),
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">📊 Tableau de Bord</h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Utilisateurs</span>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">+12%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Ventes Totales</span>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">+8%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalSales.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Revenu Total</span>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">+15%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}€</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Utilisateurs Actifs</span>
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Live</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
        </div>
      </div>

      {/* Popular Formations */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📚 Formations Populaires</h4>
        <div className="space-y-3">
          {stats.popularFormations.map((formation, index) => (
            <div key={formation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{formation.title}</div>
                <div className="text-sm text-gray-600">{formation.purchases} achats</div>
              </div>
              <div className="text-lg font-bold text-blue-600">#{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">💰 Revenu Mensuel</h4>
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900">{stats.monthlyRevenue.toLocaleString()}€</div>
          <div className="text-sm text-green-600">+15% vs mois dernier</div>
        </div>
        <div className="h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded flex items-end justify-center">
          <div className="text-xs text-gray-600">Graphique en temps réel</div>
        </div>
      </div>
    </div>
  );
}
