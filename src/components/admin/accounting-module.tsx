"use client";

import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  date: string;
  type: 'sale' | 'refund' | 'subscription';
  amount: number;
  description: string;
  client: string;
  status: 'completed' | 'pending' | 'failed';
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
    // Simuler des données - en production, ça viendrait de Supabase
    const loadAccountingData = async () => {
      try {
        const mockTransactions: Transaction[] = [
          {
            id: "1",
            date: "2024-03-15",
            type: "sale",
            amount: 497,
            description: "Social Ads Mastery",
            client: "sarah.martin@email.com",
            status: "completed"
          },
          {
            id: "2",
            date: "2024-03-14",
            type: "sale",
            amount: 997,
            description: "Funnel Premium",
            client: "marc.dubois@email.com",
            status: "completed"
          },
          {
            id: "3",
            date: "2024-03-13",
            type: "refund",
            amount: -497,
            description: "Remboursement Copy Closing",
            client: "julie.petit@email.com",
            status: "completed"
          },
          {
            id: "4",
            date: "2024-03-12",
            type: "sale",
            amount: 397,
            description: "Copy Closing",
            client: "pierre.bernard@email.com",
            status: "completed"
          }
        ];

        const mockMonthlyRevenue: MonthlyRevenue[] = [
          { month: "Janvier 2024", revenue: 12450, transactions: 28 },
          { month: "Février 2024", revenue: 15680, transactions: 35 },
          { month: "Mars 2024", revenue: 18920, transactions: 42 },
          { month: "Avril 2024", revenue: 22340, transactions: 48 },
          { month: "Mai 2024", revenue: 19870, transactions: 41 },
          { month: "Juin 2024", revenue: 24560, transactions: 52 }
        ];

        setTransactions(mockTransactions);
        setMonthlyRevenue(mockMonthlyRevenue);
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
        t.client,
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
              {transactions.map((transaction) => (
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
                      {transaction.type === 'sale' ? 'Vente' : transaction.type === 'refund' ? 'Remboursement' : 'Abonnement'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}€
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.client}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Complété' : transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
