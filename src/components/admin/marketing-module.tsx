"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      const supabase = createClient();
      
      // Récupérer les analytics depuis Supabase
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error loading analytics:', error);
      } else {
        // Transformer les données brutes en analytics formatées
        const analyticsData: Analytics = {
          totalVisits: data?.reduce((sum, item) => sum + (item.visits || 0), 0) || 0,
          uniqueVisitors: data?.reduce((sum, item) => sum + (item.unique_visitors || 0), 0) || 0,
          pageViews: data?.reduce((sum, item) => sum + (item.page_views || 0), 0) || 0,
          bounceRate: data?.reduce((sum, item) => sum + (item.bounce_rate || 0), 0) / (data?.length || 1) || 0,
          avgSessionDuration: data?.reduce((sum, item) => sum + (item.avg_session_duration || 0), 0) / (data?.length || 1) || 0,
          conversionRate: data?.reduce((sum, item) => sum + (item.conversion_rate || 0), 0) / (data?.length || 1) || 0,
          topPages: data?.map(item => ({
            path: item.page_path || '/',
            views: item.views || 0,
            title: item.page_title || 'Page'
          })) || [],
          trafficSources: data?.map(item => ({
            source: item.traffic_source || 'Direct',
            visitors: item.visitors || 0,
            percentage: item.percentage || 0
          })) || [],
          dailyStats: data?.map(item => ({
            date: item.date || new Date().toISOString().split('T')[0],
            visits: item.visits || 0,
            conversions: item.conversions || 0
          })) || []
        };

        setAnalytics(analyticsData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
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
      <h3 className="text-xl font-semibold text-white mb-4">📈 Marketing Analytics</h3>
      
      {/* Period Selector */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Période d'analyse</h4>
          <div className="flex space-x-2">
            {['7days', '30days', '90days'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === '7days' ? '7 jours' : period === '30days' ? '30 jours' : '90 jours'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Visites totales</div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalVisits.toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Visiteurs uniques</div>
          <div className="text-2xl font-bold text-gray-900">{analytics.uniqueVisitors.toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Pages vues</div>
          <div className="text-2xl font-bold text-gray-900">{analytics.pageViews.toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Taux de conversion</div>
          <div className="text-2xl font-bold text-green-600">{analytics.conversionRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Pages les plus visitées</h4>
          </div>
          <div className="p-6">
            {analytics.topPages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-500 text-lg">Aucune donnée pour l'instant</p>
                <p className="text-gray-400 text-sm mt-2">Les données analytics apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.topPages.slice(0, 5).map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-600">{page.path}</div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{page.views.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Sources de trafic</h4>
          </div>
          <div className="p-6">
            {analytics.trafficSources.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">Aucune donnée pour l'instant</p>
                <p className="text-gray-400 text-sm mt-2">Les sources de trafic apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{source.source}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{source.visitors.toLocaleString()}</span>
                      <span className="text-sm text-gray-600">({source.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Métriques de performance</h4>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {analytics.bounceRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Taux de rebond</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {Math.round(analytics.avgSessionDuration / 60)}min
              </div>
              <div className="text-sm text-gray-600">Durée moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analytics.conversionRate > 0 ? 'Bon' : 'À améliorer'}
              </div>
              <div className="text-sm text-gray-600">Performance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
