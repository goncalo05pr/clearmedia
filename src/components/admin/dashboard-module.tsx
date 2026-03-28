"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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
    const loadStats = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer le nombre total d'utilisateurs
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        // Récupérer le total des ventes
        const { count: totalSales, error: salesError } = await supabase
          .from('purchases')
          .select('*', { count: 'exact', head: true });
        
        // Récupérer le revenu total
        const { data: purchases, error: revenueError } = await supabase
          .from('purchases')
          .select('amount');
        
        const totalRevenue = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        
        // Récupérer les utilisateurs actifs (dernière connexion < 30 jours)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { count: activeUsers, error: activeError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_sign_in_at', thirtyDaysAgo);
        
        // Récupérer le revenu mensuel
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const { data: monthlyPurchases, error: monthlyError } = await supabase
          .from('purchases')
          .select('amount')
          .gte('created_at', `${currentMonth}-01`)
          .lte('created_at', `${currentMonth}-31`);
        
        const monthlyRevenue = monthlyPurchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        
        // Récupérer les formations populaires (simplifié)
        const { data: allPurchases } = await supabase
          .from('purchases')
          .select('formation_id')
          .eq('status', 'paid');
        
        // Compter les achats par formation
        const formationCounts: { [key: string]: number } = {};
        allPurchases?.forEach((purchase: any) => {
          const formationId = purchase.formation_id;
          formationCounts[formationId] = (formationCounts[formationId] || 0) + 1;
        });
        
        // Récupérer les noms des formations
        const formationIds = Object.keys(formationCounts);
        const { data: formationsData } = await supabase
          .from('formations')
          .select('id, title')
          .in('id', formationIds);
        
        const popularFormations = formationIds.map(id => ({
          id,
          title: formationsData?.find((f: any) => f.id === id)?.title || 'Formation inconnue',
          purchases: formationCounts[id] || 0
        })).sort((a, b) => b.purchases - a.purchases).slice(0, 5);

        if (usersError || salesError || revenueError || activeError || monthlyError) {
          console.error('Error loading dashboard stats:', { usersError, salesError, revenueError, activeError, monthlyError });
        } else {
          setStats({
            totalUsers: totalUsers || 0,
            totalSales: totalSales || 0,
            totalRevenue,
            activeUsers: activeUsers || 0,
            monthlyRevenue,
            popularFormations
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        setLoading(false);
      }
    };

    loadStats();
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
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Utilisateurs Totals</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Ventes Totals</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalSales}</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Revenu Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}€</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Utilisateurs Actifs</div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Revenu Mensuel</div>
          <div className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue.toLocaleString()}€</div>
        </div>
      </div>

      {/* Popular Formations */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📚 Formations Populaires</h4>
        
        {stats.popularFormations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">Aucune formation pour l'instant</p>
            <p className="text-gray-400 text-sm mt-2">Les formations apparaîtront ici une fois que les clients commenceront à acheter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.popularFormations.map((formation, index) => (
              <div key={formation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{formation.title}</div>
                  <div className="text-sm text-gray-600">{formation.purchases} achat{formation.purchases > 1 ? 's' : ''}</div>
                </div>
                <div className="text-lg font-bold text-blue-600">#{index + 1}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
