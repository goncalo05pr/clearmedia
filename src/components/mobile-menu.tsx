"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileMenuProps {
  children: React.ReactNode;
  showMemberArea: boolean;
  isAdmin: boolean;
}

export function MobileMenu({ children, showMemberArea, isAdmin }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
        aria-label="Menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block h-0.5 w-6 bg-current transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-current transition-all my-1 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </div>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed right-0 top-0 h-full w-80 bg-black border-l border-white/10 shadow-2xl">
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                aria-label="Fermer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Logo */}
              <div className="mb-8">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="font-heading text-2xl font-bold tracking-tight text-white"
                >
                  KLIQZ
                </Link>
              </div>

              {/* Navigation links */}
              <nav className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                >
                  Accueil
                </Link>
                <Link
                  href="/formations"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                >
                  Formations
                </Link>
                <Link
                  href="/rendez-vous"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                >
                  Rendez-vous
                </Link>
                
                {showMemberArea && (
                  <>
                    <Link
                      href="/profil"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                    >
                      👤 Mon profil
                    </Link>
                    <Link
                      href="/espace-membre"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                    >
                      Espace membre
                    </Link>
                  </>
                )}
                
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-neutral-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
                  >
                    🚀 Admin
                  </Link>
                )}
                
                {/* Auth component */}
                <div className="pt-4 border-t border-white/10">
                  {children}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
