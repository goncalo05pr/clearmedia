"use client";

import { useState, useEffect } from "react";

interface Client {
  id: string;
  email: string;
  name: string;
  phone?: string;
  registeredAt: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchase?: string;
  status: 'active' | 'inactive' | 'vip';
}

interface Purchase {
  id: string;
  clientId: string;
  formationTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
}

export default function CRMModule() {
  const [clients, setClients] = useState<Client[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simuler des données - en production, ça viendrait de Supabase
    const loadClientsAndPurchases = async () => {
      try {
        const mockClients: Client[] = [
          {
            id: "1",
            email: "sarah.martin@email.com",
            name: "Sarah Martin",
            phone: "06 12 34 56 78",
            registeredAt: "2024-01-15",
            totalPurchases: 3,
            totalSpent: 1497,
            lastPurchase: "2024-03-10",
            status: "vip"
          },
          {
            id: "2",
            email: "marc.dubois@email.com",
            name: "Marc Dubois",
            phone: "06 98 76 54 32",
            registeredAt: "2024-02-20",
            totalPurchases: 1,
            totalSpent: 497,
            lastPurchase: "2024-03-05",
            status: "active"
          },
          {
            id: "3",
            email: "julie.petit@email.com",
            name: "Julie Petit",
            registeredAt: "2024-01-28",
            totalPurchases: 2,
            totalSpent: 994,
            lastPurchase: "2024-02-15",
            status: "active"
          }
        ];

        const mockPurchases: Purchase[] = [
          {
            id: "1",
            clientId: "1",
            formationTitle: "Social Ads Mastery",
            amount: 497,
            date: "2024-03-10",
            status: "completed"
          },
          {
            id: "2",
            clientId: "1",
            formationTitle: "Funnel Premium",
            amount: 500,
            date: "2024-02-28",
            status: "completed"
          },
          {
            id: "3",
            clientId: "2",
            formationTitle: "Copy Closing",
            amount: 497,
            date: "2024-03-05",
            status: "completed"
          }
        ];

        setClients(mockClients);
        setPurchases(mockPurchases);
        setLoading(false);
      } catch (error) {
        console.error('Error loading CRM data:', error);
        setLoading(false);
      }
    };

    loadClientsAndPurchases();
  }, []);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientPurchases = (clientId: string) => {
    return purchases.filter(p => p.clientId === clientId);
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
      <h3 className="text-xl font-semibold text-white mb-4">🤝 CRM - Gestion des Clients</h3>
      
      {/* Search Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total dépensé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedClient(client)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(client.registeredAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.totalPurchases}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{client.totalSpent}€</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'vip' ? 'bg-purple-100 text-purple-800' :
                      client.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status === 'vip' ? 'VIP' : client.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Voir détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Détails du Client</h4>
              <button 
                onClick={() => setSelectedClient(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Informations personnelles</h5>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Nom:</span> {selectedClient.name}</div>
                  <div><span className="font-medium">Email:</span> {selectedClient.email}</div>
                  <div><span className="font-medium">Téléphone:</span> {selectedClient.phone || 'Non renseigné'}</div>
                  <div><span className="font-medium">Inscription:</span> {new Date(selectedClient.registeredAt).toLocaleDateString('fr-FR')}</div>
                  <div><span className="font-medium">Statut:</span> 
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedClient.status === 'vip' ? 'bg-purple-100 text-purple-800' :
                      selectedClient.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedClient.status === 'vip' ? 'VIP' : selectedClient.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Achats récents</h5>
                <div className="space-y-2">
                  {getClientPurchases(selectedClient.id).slice(0, 3).map((purchase) => (
                    <div key={purchase.id} className="p-3 bg-gray-50 rounded text-sm">
                      <div className="font-medium text-gray-900">{purchase.formationTitle}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{new Date(purchase.date).toLocaleDateString('fr-FR')}</span>
                        <span className={`font-semibold ${
                          purchase.status === 'completed' ? 'text-green-600' :
                          purchase.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {purchase.amount}€
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
