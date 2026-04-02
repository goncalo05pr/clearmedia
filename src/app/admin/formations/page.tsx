"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import FormationsModule from "@/components/admin/formations-module";
import { useRouter } from "next/navigation";

export default function AdminFormationsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
      
      if (!user || userRole !== 'admin') {
        router.push('/');
        return;
      }

      setUser(user);
      setLoading(false);
    }

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-12 h-12 border-4 border-[#ff4d2e] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Accès non autorisé</h1>
          <p className="text-gray-300">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <FormationsModule />;
}
