"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar - fixe à gauche */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main content - prend tout l'espace restant */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header avec menu button */}
        <div className="lg:hidden sticky top-0 z-30 bg-black/90 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
              aria-label="Menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="block h-0.5 w-6 bg-current"></span>
                <span className="block h-0.5 w-6 bg-current my-1"></span>
                <span className="block h-0.5 w-6 bg-current"></span>
              </div>
            </button>
            <h1 className="text-lg font-bold text-white">Admin</h1>
            <div className="w-10"></div> {/* Spacer pour centrer */}
          </div>
        </div>
        
        {/* Page content - occupe tout l'espace restant */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
