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
    <div className="min-h-screen bg-black">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header with menu button */}
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
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
