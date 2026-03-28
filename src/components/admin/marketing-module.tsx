"use client";

import { useState, useEffect } from "react";

interface Analytics {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  topPages: Array<{ path: string; views: number; title: string }>;
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>;
  dailyStats: Array<{ date: string; visits: number; conversions: number }>;
}

export default function MarketingModule() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalVisits: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    conversionRate: 0,
    topPages: [],
    trafficSources: [],
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  useEffect(() => {
    // Simuler des données - en production, ça viendrait de Supabase
    const loadAnalytics = async () => {
      try {
        const mockAnalytics: Analytics = {
          totalVisits: 45678,
          uniqueVisitors: 12456,
          pageViews: 89234,
          bounceRate: 32.5,
          avgSessionDuration: 245, // en secondes
          conversionRate: 3.2,
          topPages: [
            { path: "/", views: 12456, title: "Accueil" },
            { path: "/formations", views: 8234, title: "Formations" },
            { path: "/connexion", views: 3456, title: "Connexion" },
            { path: "/social-ads-mastery", views: 2890, title: "Social Ads Mastery" },
            { path: "/funnel-premium", views: 2156, title: "Funnel Premium" }
          ],
          trafficSources: [
            { source: "Google", visitors: 4567, percentage: 36.7 },
            { source: "Facebook", visitors: 2345, percentage: 18.8 },
            { source: "LinkedIn", visitors: 1234, percentage: 9.9 },
            { source: "Direct", visitors: 1890, percentage: 15.2 },
            { source: "Autres", visitors: 2420, percentage: 19.4 }
          ],
          dailyStats: [
            { date: "2024-03-15", visits: 1234, conversions: 42 },
            { date: "2024-03-14", visits: 1456, conversions: 38 },
            { date: "2024-03-13", visits: 987, conversions: 31 },
            { date: "2024-03-12", visits: 1678, conversions: 56 },
            { date: "2024-03-11", visits: 1234, conversions: 29 },
            { date: "2024-03-10", visits: 1567, conversions: 48 },
            { date: "2024-03-09", visits: 1890, conversions: 61 }
          ]
        };

        setAnalytics(mockAnalytics);
        setLoading(false);
      } catch (error) {
        console.error('Error loading analytics:', error);
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">📈 Marketing & Analytics</h3>
      
      {/* Period Selector */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Période:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="90days">90 derniers jours</option>
            <option value="1year">Dernière année</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Visites Totales</div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalVisits.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">+12.5% vs période précédente</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Visiteurs Uniques</div>
          <div className="text-2xl font-bold text-gray-900">{analytics.uniqueVisitors.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">+8.3% vs période précédente</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Pages Vues</div>
          <div className="text-2xl font-bold text-gray-900">{analytics.pageViews.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">+15.2% vs période précédente</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Taux de Rebond</div>
          <div className="text-2xl font-bold text-gray-900">{analytics.bounceRate}%</div>
          <div className="text-xs text-red-600 mt-1">+2.1% vs période précédente</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Durée Moyenne</div>
          <div className="text-2xl font-bold text-gray-900">{formatDuration(analytics.avgSessionDuration)}</div>
          <div className="text-xs text-green-600 mt-1">+18s vs période précédente</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Taux de Conversion</div>
          <div className="text-2xl font-bold text-green-600">{analytics.conversionRate}%</div>
          <div className="text-xs text-green-600 mt-1">+0.8% vs période précédente</div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Sources de Trafic</h4>
        <div className="space-y-3">
          {analytics.trafficSources.map((source) => (
            <div key={source.source} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">{source.source}</div>
                  <div className="text-sm text-gray-600">{source.visitors.toLocaleString()} visiteurs</div>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">{source.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Pages les Plus Visitées</h4>
          <div className="space-y-3">
            {analytics.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-lg font-bold text-gray-500 mr-3">#{index + 1}</div>
                  <div>
                    <div className="font-medium text-gray-900">{page.title}</div>
                    <div className="text-sm text-gray-600">{page.path}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600">{page.views.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Stats Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Quotidiennes</h4>
          <div className="space-y-3">
            {analytics.dailyStats.slice(0, 7).map((day) => (
              <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long' })}</div>
                  <div className="text-sm text-gray-600">{day.visits.toLocaleString()} visites</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{day.conversions} conversions</div>
                  <div className="text-lg font-bold text-green-600">
                    {((day.conversions / day.visits) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
