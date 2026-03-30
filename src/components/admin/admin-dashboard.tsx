"use client";

import { useState, useEffect } from "react";
import DashboardModule from "@/components/admin/dashboard-module";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        // Simuler un utilisateur admin pour le développement
        setUser({ email: 'admin@kliqz.com', user_metadata: { role: 'admin' } });
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Accès non autorisé</h1>
          <p className="text-gray-300">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <DashboardModule />;
}
