"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "Tableau de bord", icon: "📊" },
    { href: "/admin/formations", label: "Formations", icon: "📚" },
    { href: "/admin/crm", label: "CRM", icon: "👥" },
    { href: "/admin/cms", label: "CMS", icon: "📝" },
    { href: "/admin/calendar", label: "Calendrier", icon: "📅" },
    { href: "/admin/hr", label: "RH", icon: "👔" },
    { href: "/admin/accounting", label: "Comptabilité", icon: "💰" },
    { href: "/admin/marketing", label: "Marketing", icon: "📢" },
    { href: "/admin/support", label: "Support", icon: "🎧" },
    { href: "/admin/automation", label: "Automatisation", icon: "🤖" },
    { href: "/admin/employees", label: "Équipe", icon: "�" },
    { href: "/admin/chat", label: "Chat", icon: "💬" },
    { href: "/admin/settings", label: "Paramètres", icon: "⚙️" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-black border-r border-white/10 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Admin</h2>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onToggle()}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? "bg-[#ff4d2e]/20 text-[#ff4d2e] border-l-2 border-[#ff4d2e]" 
                      : "text-neutral-300 hover:bg-white/[0.1] hover:text-white"
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
            >
              <span className="text-xl">🏠</span>
              <span className="font-medium">Retour au site</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
