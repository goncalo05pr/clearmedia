"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminDashboard from "@/components/admin/admin-dashboard";

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
    role?: string;
  };
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('🔍 DEBUG - User from Supabase:', user);
      console.log('🔍 DEBUG - User metadata:', user?.user_metadata);
      console.log('🔍 DEBUG - Raw app metadata:', user?.app_metadata);
      console.log('🔍 DEBUG - Role from user_metadata:', user?.user_metadata?.role);
      console.log('🔍 DEBUG - Role from app_metadata:', user?.app_metadata?.role);
      
      // Vérifier le rôle dans user_metadata ET app_metadata
      const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
      console.log('🔍 DEBUG - Final detected role:', userRole);
      
      if (!user || userRole !== 'admin') {
        console.log('❌ DEBUG - Access denied: user not found or not admin');
        window.location.href = '/';
        return;
      }

      console.log('✅ DEBUG - Access granted for admin:', user.email);
      setUser(user);
      setLoading(false);
    }

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#ff4d2e] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-syne font-bold text-white mb-4">Accès non autorisé</h1>
          <p className="text-gray-300">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}
