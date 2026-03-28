"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
    role?: string;
  };
}

interface Purchase {
  id: string;
  user_id: string;
  formation_id: string;
  created_at: string;
  status: string;
  amount: number;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkAdminAndLoadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.user_metadata?.role !== 'admin') {
        window.location.href = '/';
        return;
      }

      setUser(user);
      await loadUsers();
      await loadPurchases();
      setLoading(false);
    }

    checkAdminAndLoadData();
  }, []);

  async function loadUsers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && !error) {
      setUsers(data);
    } else {
      console.error('Error loading users:', error);
    }
  }

  async function loadPurchases() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && !error) {
      setPurchases(data);
    } else {
      console.error('Error loading purchases:', error);
    }
  }

  async function changeRole(userId: string, newRole: string) {
    setUpdatingRole(userId);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        user_metadata: { role: newRole }
      })
      .eq('id', userId);

    if (!error) {
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, user_metadata: { ...u.user_metadata, role: newRole } }
          : u
      ));
      setMessage(`Rôle changé avec succès pour ${users.find(u => u.id === userId)?.email}`);
    } else {
      setMessage(`Erreur: ${error.message}`);
    }
    setUpdatingRole(null);
  }

  function getUserPurchases(userId: string) {
    return purchases.filter(p => p.user_id === userId);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">🚀 Panneau d'Administration</h1>
            <p className="text-gray-300">Gestion des utilisateurs et des rôles</p>
          </header>

          {message && (
            <div className={`mb-6 p-4 rounded-2xl text-sm ${
              message.includes("Erreur") 
                ? "bg-red-500/10 border border-red-500/30 text-red-300" 
                : "bg-green-500/10 border border-green-500/30 text-green-300"
            }`}>
              {message}
            </div>
          )}

          {/* Users Table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">👥 Utilisateurs inscrits</h2>
            <div className="overflow-x-auto">
              <table className="w-full glass-strong rounded-xl overflow-hidden">
                <thead className="bg-purple-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nom</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rôle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Inscription</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Achats</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const userPurchases = getUserPurchases(user.id);
                    return (
                      <tr key={user.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {user.user_metadata?.name || 'Non défini'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            user.user_metadata?.role === 'admin' 
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            {user.user_metadata?.role || 'student'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          <span className="inline-flex px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                            {userPurchases.length} achat{userPurchases.length > 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => changeRole(user.id, user.user_metadata?.role === 'admin' ? 'student' : 'admin')}
                            disabled={updatingRole === user.id}
                            className="px-3 py-1 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              user.user_metadata?.role === 'admin'
                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }"
                          >
                            {updatingRole === user.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : user.user_metadata?.role === 'admin' ? (
                              'Rétrograder'
                            ) : (
                              'Promouvoir'
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Purchases Summary */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">💰 Aperçu des achats</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="glass-strong rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{users.length}</div>
                <div className="text-sm text-gray-300">Total utilisateurs</div>
              </div>
              <div className="glass-strong rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{purchases.length}</div>
                <div className="text-sm text-gray-300">Total achats</div>
              </div>
              <div className="glass-strong rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {purchases.reduce((sum, p) => sum + (p.amount || 0), 0)}€
                </div>
                <div className="text-sm text-gray-300">Revenu total</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
