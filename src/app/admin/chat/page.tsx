"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ChatModule from "@/components/admin/chat-module";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminChatPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
      
      if (!user || userRole !== 'admin') {
        window.location.href = '/';
        return;
      }

      setUser(user);
      setLoading(false);
    }

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#ff4d2e] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Accès non autorisé</h1>
          <p className="text-gray-300">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 lg:ml-64">
          <div className="p-8">
            <ChatModule />
          </div>
        </div>
      </div>
    </div>
  );
}
