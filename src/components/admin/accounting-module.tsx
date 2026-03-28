"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Transaction {
  id: string;
  date: string;
  type: 'sale' | 'refund' | 'subscription';
  amount: number;
  description: string;
  client_email: string;
  status: 'completed' | 'pending' | 'failed';
  formation_id?: string;
  formations?: {
    title: string;
  };
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  transactions: number;
}

export default function AccountingModule() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const loadAccountingData = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer toutes les transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('purchases')
          .select(`
            *,
            profiles!inner(email),
            formations!inner(title)
          `)
          .eq('status', 'paid')
          .order('created_at', { ascending: false });

        // Récupérer les profils séparément
        const userIds = [...new Set(transactionsData?.map(t => t.user_id) || [])];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);

        // Récupérer les formations séparément
        const formationIds = [...new Set(transactionsData?.map(t => t.formation_id) || [])];
        const { data: formationsData } = await supabase
          .from('formations')
          .select('id, title')
          .in('id', formationIds);

        // Combiner les données
        const transactionsWithDetails = transactionsData?.map(transaction => ({
          ...transaction,
          profiles: profilesData?.find(p => p.id === transaction.user_id),
          formations: formationsData?.find(f => f.id === transaction.formation_id)
        })) || [];

        // Récupérer les revenus mensuels
        const { data: monthlyData } = await supabase
          .from('purchases')
          .select('amount, created_at')
          .eq('status', 'paid')
          .order('created_at', { ascending: false });

        // Grouper par mois
        const monthlyMap = new Map<string, { revenue: number; transactions: number }>();
        monthlyData?.forEach((purchase: any) => {
          const month = new Date(purchase.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
          const current = monthlyMap.get(month) || { revenue: 0, transactions: 0 };
          monthlyMap.set(month, {
            revenue: current.revenue + (purchase.amount || 0),
            transactions: current.transactions + 1
          });
        });

        const monthlyRevenue = Array.from(monthlyMap.entries())
          .map(([month, data]) => ({ month, ...data }))
          .slice(0, 6);

        if (transactionsError) {
          console.error('Error loading accounting data:', transactionsError);
        } else {
          setTransactions(transactionsWithDetails || []);
          setMonthlyRevenue(monthlyRevenue);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading accounting data:', error);
        setLoading(false);
      }
    };

    loadAccountingData();
  }, []);

  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
  const totalTransactions = monthlyRevenue.reduce((sum, month) => sum + month.transactions, 0);
  const averageRevenue = monthlyRevenue.length > 0 ? totalRevenue / monthlyRevenue.length : 0;

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Montant', 'Description', 'Client', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        t.type,
        t.amount,
        `"${t.description}"`,
        t.client_email,
        t.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMonthlyToCSV = () => {
    const headers = ['Mois', 'Revenu', 'Transactions'];
    const csvContent = [
      headers.join(','),
      ...monthlyRevenue.map(m => [
        `"${m.month}"`,
        m.revenue,
        m.transactions
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `revenus_mensuels_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <h3 className="text-xl font-semibold text-white mb-4">💰 Comptabilité</h3>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Revenu Total</div>
          <div className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()}€</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Transactions Totales</div>
          <div className="text-2xl font-bold text-gray-900">{totalTransactions}</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Revenu Moyen/Mois</div>
          <div className="text-2xl font-bold text-gray-900">{Math.round(averageRevenue).toLocaleString()}€</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Croissance</div>
          <div className="text-2xl font-bold text-green-600">+12.5%</div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Revenus Mensuels</h4>
          <button
            onClick={exportMonthlyToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
          >
            📊 Exporter CSV
          </button>
        </div>
        
        {monthlyRevenue.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💰</div>
            <p className="text-gray-500 text-lg">Aucune transaction pour l'instant</p>
            <p className="text-gray-400 text-sm mt-2">Les transactions apparaîtront ici une fois que les clients commenceront à acheter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthlyRevenue.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{month.month}</div>
                  <div className="text-sm text-gray-600">{month.transactions} transactions</div>
                </div>
                <div className="text-lg font-bold text-green-600">{month.revenue.toLocaleString()}€</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Transactions Récentes</h4>
          <button
            onClick={exportToCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
          >
            📄 Exporter CSV
          </button>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-gray-500 text-lg">Aucune transaction pour l'instant</p>
            <p className="text-gray-400 text-sm mt-2">Les transactions apparaîtront ici une fois que les clients commenceront à acheter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'sale' ? 'bg-green-100 text-green-800' :
                        transaction.type === 'refund' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.type === 'sale' ? 'Vente' : 
                         transaction.type === 'refund' ? 'Remboursement' : 'Abonnement'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}€
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.client_email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'completed' ? 'Complété' : 
                         transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
