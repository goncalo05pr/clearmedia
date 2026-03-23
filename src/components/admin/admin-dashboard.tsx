"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CRMModule } from "./crm-module";
import { FormationsModule } from "./formations-module";
import { MarketingModule } from "./marketing-module";
import { AccountingModule } from "./accounting-module";

interface Stats {
  totalUsers: number;
  totalSales: number;
  totalRevenue: number;
  activeUsers: number;
  monthlyRevenue: number;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
}

interface Sale {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  user_email?: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeUsers: 0,
    monthlyRevenue: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "sales" | "crm" | "formations" | "marketing" | "accounting" | "settings">("dashboard");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient();
      
      // Fetch stats
      const { data: users } = await supabase.from("profiles").select("*");
      const { data: salesData } = await supabase.from("purchases").select("*");
      
      if (users && salesData) {
        const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.amount || 0), 0);
        const monthlyRevenue = salesData
          .filter(sale => {
            const saleDate = new Date(sale.created_at);
            const now = new Date();
            return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum, sale) => sum + (sale.amount || 0), 0);

        setStats({
          totalUsers: users.length,
          totalSales: salesData.length,
          totalRevenue,
          activeUsers: users.filter(u => u.last_seen && new Date(u.last_seen) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
          monthlyRevenue,
        });

        setUsers(users);
        setSales(salesData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, gradient }: { title: string; value: string | number; icon: string; gradient: string }) => (
    <div className={`card-gradient rounded-2xl p-6 hover:scale-105 transition-all`}>
      <div className={`text-3xl mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {icon}
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-neutral-300">{title}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 glass-strong rounded-2xl p-2">
        {[
          { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
          { id: "users", label: "👥 Utilisateurs", icon: "👥" },
          { id: "sales", label: "💰 Ventes", icon: "💰" },
          { id: "crm", label: "🤝 CRM", icon: "🤝" },
          { id: "formations", label: "📚 Formations", icon: "📚" },
          { id: "marketing", label: "📧 Marketing", icon: "📧" },
          { id: "accounting", label: "💰 Comptabilité", icon: "💰" },
          { id: "settings", label: "⚙️ Settings", icon: "⚙️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === tab.id
                ? "btn-gradient text-white"
                : "text-neutral-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
              title="Utilisateurs totaux"
              value={stats.totalUsers}
              icon="👥"
              gradient="from-[#8B5CF6] to-[#6366F1]"
            />
            <StatCard
              title="Ventes totales"
              value={stats.totalSales}
              icon="💰"
              gradient="from-[#EC4899] to-[#FF4D2E]"
            />
            <StatCard
              title="Revenu total"
              value={`${stats.totalRevenue.toLocaleString()}€`}
              icon="💵"
              gradient="from-[#FF4D2E] to-[#F97316]"
            />
            <StatCard
              title="Utilisateurs actifs"
              value={stats.activeUsers}
              icon="⚡"
              gradient="from-[#F97316] to-[#8B5CF6]"
            />
            <StatCard
              title="Revenu mensuel"
              value={`${stats.monthlyRevenue.toLocaleString()}€`}
              icon="📈"
              gradient="from-[#6366F1] to-[#EC4899]"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">📈 Dernières ventes</h3>
              <div className="space-y-3">
                {sales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                    <div>
                      <div className="font-semibold text-white">{sale.user_email || 'Utilisateur'}</div>
                      <div className="text-sm text-neutral-400">{new Date(sale.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-lg font-bold text-[#8B5CF6]">{sale.amount}€</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">👥 Nouveaux utilisateurs</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                    <div>
                      <div className="font-semibold text-white">{user.email}</div>
                      <div className="text-sm text-neutral-400">{new Date(user.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {user.role || 'user'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6">👥 Gestion des utilisateurs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white font-bold">Email</th>
                  <th className="text-left py-3 px-4 text-white font-bold">Rôle</th>
                  <th className="text-left py-3 px-4 text-white font-bold">Date d'inscription</th>
                  <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button className="btn-gradient px-3 py-1 rounded-lg text-sm font-bold">
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6">💰 Gestion des ventes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white font-bold">ID</th>
                  <th className="text-left py-3 px-4 text-white font-bold">Client</th>
                  <th className="text-left py-3 px-4 text-white font-bold">Montant</th>
                  <th className="text-left py-3 px-4 text-white font-bold">Statut</th>
                  <th className="text-left py-3 px-4 text-white font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">{sale.id.slice(0, 8)}...</td>
                    <td className="py-3 px-4 text-white">{sale.user_email || 'N/A'}</td>
                    <td className="py-3 px-4 text-lg font-bold text-[#8B5CF6]">{sale.amount}€</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        sale.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {sale.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">{new Date(sale.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRM Tab */}
      {activeTab === "crm" && <CRMModule />}

      {/* Formations Tab */}
      {activeTab === "formations" && <FormationsModule />}

      {/* Marketing Tab */}
      {activeTab === "marketing" && <MarketingModule />}

      {/* Accounting Tab */}
      {activeTab === "accounting" && <AccountingModule />}
    </div>
  );
}
