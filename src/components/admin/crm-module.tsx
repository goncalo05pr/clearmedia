"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Client {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  created_at: string;
  suspended?: boolean;
  user_metadata?: {
    name?: string;
    phone?: string;
  };
}

interface Purchase {
  id: string;
  user_id: string;
  formation_id: string;
  amount: number;
  created_at: string;
  status: string;
  formations?: {
    title: string;
  };
}

export default function CRMModule() {
  const [clients, setClients] = useState<Client[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const loadClientsAndPurchases = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer tous les utilisateurs depuis l'API admin
        const response = await fetch('/api/admin/users');
        const { users, error: authError } = await response.json();
        
        if (authError || !response.ok) {
          console.error('Erreur récupération utilisateurs auth:', authError);
        }
        
        // Récupérer les profils depuis profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        // Combiner les données auth.users et profiles
        const clients = users?.map((authUser: any) => {
          const profile = profilesData?.find(p => p.user_id === authUser.id);
          return {
            id: authUser.id,
            email: authUser.email,
            name: profile?.full_name || authUser.user_metadata?.name,
            phone: profile?.phone || authUser.user_metadata?.phone,
            created_at: authUser.created_at,
            suspended: profile?.suspended || false,
            user_metadata: authUser.user_metadata
          };
        }) || [];
        
        // Récupérer tous les achats
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('purchases')
          .select(`
            *,
            formations!inner(title)
          `);

        // Récupérer les formations séparément pour les joindre
        const formationIds = [...new Set(purchasesData?.map(p => p.formation_id) || [])];
        const { data: formationsData } = await supabase
          .from('formations')
          .select('id, title')
          .in('id', formationIds);

        // Combiner les données
        const purchasesWithFormations = purchasesData?.map(purchase => {
          const formation = formationsData?.find(f => f.id === purchase.formation_id);
          return {
            ...purchase,
            formations: formation ? { title: formation.title } : undefined
          };
        }) || [];

        if (profilesError || purchasesError) {
          console.error('Error loading CRM data:', { profilesError, purchasesError });
        } else {
          setClients(clients || []);
          setPurchases(purchasesWithFormations || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading CRM data:', error);
        setLoading(false);
      }
    };

    loadClientsAndPurchases();
  }, []);

  const filteredClients = clients.filter(client => 
    (client.name || client.user_metadata?.name || client.email || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getClientPurchases = (clientId: string) => {
    return purchases.filter(p => p.user_id === clientId);
  };

  const handleSuspendUser = async (userId: string, suspended: boolean) => {
    setActionLoading(userId);
    try {
      const response = await fetch('/api/admin/suspend-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, suspended })
      });

      if (response.ok) {
        // Mettre à jour l'état local
        setClients(prev => prev.map(client => 
          client.id === userId ? { ...client, suspended } : client
        ));
        
        // Mettre à jour le client sélectionné si nécessaire
        if (selectedClient?.id === userId) {
          setSelectedClient(prev => prev ? { ...prev, suspended } : null);
        }
      } else {
        alert('Erreur lors de la suspension/réactivation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suspension/réactivation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeFormation = async (userId: string, formationId: string, status: string) => {
    setActionLoading(`${userId}-${formationId}`);
    try {
      const response = await fetch('/api/admin/revoke-formation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, formationId, status })
      });

      if (response.ok) {
        // Mettre à jour l'état local
        setPurchases(prev => prev.map(purchase => 
          purchase.user_id === userId && purchase.formation_id === formationId 
            ? { ...purchase, status }
            : purchase
        ));
      } else {
        alert('Erreur lors de la révocation/réactivation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la révocation/réactivation');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#ff4d2e] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">🤝 CRM - Gestion des Clients</h3>
      
      {/* Search Bar */}
      <div className="bg-[#0a0a0a] rounded-lg p-4 shadow-sm border border-white/10 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff4d2e]/50"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-[#0a0a0a] rounded-lg shadow-sm border border-white/10 overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">Aucun client pour l'instant</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchTerm ? 'Aucun résultat trouvé pour cette recherche' : 'Commencez par ajouter des clients via la page d\'inscription'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Inscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Achats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total dépensé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredClients.map((client) => {
                  const clientPurchases = getClientPurchases(client.id);
                  const totalSpent = clientPurchases.reduce((sum, p) => sum + (p.amount || 0), 0);
                  
                  return (
                    <tr 
                      key={client.id} 
                      className="hover:bg-black/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedClient(client)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">
                          {client.name || client.user_metadata?.name || 'Non défini'}
                        </div>
                        <div className="text-sm text-gray-400">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {client.user_metadata?.phone || client.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(client.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.suspended 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {client.suspended ? 'Suspendu' : 'Actif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{clientPurchases.length}</td>
                      <td className="px-6 py-4 font-medium text-white">{totalSpent}€</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client);
                            }}
                            className="text-[#ff4d2e] hover:text-[#ff6b3d] text-sm font-medium transition-colors"
                          >
                            Voir détails
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSuspendUser(client.id, !client.suspended);
                            }}
                            disabled={actionLoading === client.id}
                            className={`text-sm font-medium transition-colors ${
                              client.suspended
                                ? 'text-green-400 hover:text-green-300'
                                : 'text-red-400 hover:text-red-300'
                            } ${actionLoading === client.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {actionLoading === client.id 
                              ? 'Chargement...' 
                              : client.suspended 
                                ? 'Réactiver' 
                                : 'Suspendre'
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0a0a0a] rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-white">Détails du Client</h4>
              <button 
                onClick={() => setSelectedClient(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-white mb-2">Informations personnelles</h5>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-gray-400">Nom:</span> {selectedClient.name || selectedClient.user_metadata?.name || 'Non défini'}</div>
                  <div><span className="font-medium text-gray-400">Email:</span> {selectedClient.email}</div>
                  <div><span className="font-medium text-gray-400">Téléphone:</span> {selectedClient.user_metadata?.phone || selectedClient.phone || 'Non renseigné'}</div>
                  <div><span className="font-medium text-gray-400">Inscription:</span> {new Date(selectedClient.created_at).toLocaleDateString('fr-FR')}</div>
                  <div><span className="font-medium text-gray-400">Statut:</span> 
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedClient.suspended 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {selectedClient.suspended ? 'Suspendu' : 'Actif'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-white mb-2">Formations achetées</h5>
                <div className="space-y-2">
                  {getClientPurchases(selectedClient.id).length === 0 ? (
                    <p className="text-gray-400">Aucune formation achetée</p>
                  ) : (
                    getClientPurchases(selectedClient.id).map((purchase) => (
                      <div key={purchase.id} className="p-3 bg-black/50 rounded-lg text-sm border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-white">{purchase.formations?.title || 'Formation inconnue'}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            purchase.status === 'revoked' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {purchase.status === 'revoked' ? 'Révoqué' : 'Actif'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">{new Date(purchase.created_at).toLocaleDateString('fr-FR')}</span>
                          <span className="font-semibold text-[#ff4d2e]">{purchase.amount}€</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRevokeFormation(
                              selectedClient.id, 
                              purchase.formation_id, 
                              purchase.status === 'revoked' ? 'paid' : 'revoked'
                            )}
                            disabled={actionLoading === `${selectedClient.id}-${purchase.formation_id}`}
                            className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
                              purchase.status === 'revoked'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            } ${actionLoading === `${selectedClient.id}-${purchase.formation_id}` ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {actionLoading === `${selectedClient.id}-${purchase.formation_id}`
                              ? 'Chargement...'
                              : purchase.status === 'revoked'
                                ? 'Réactiver'
                                : 'Révoquer'
                            }
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
