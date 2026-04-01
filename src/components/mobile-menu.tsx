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
        className="md:hidden p-2 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all relative z-[9999] bg-black"
        style={{ background: "#0a0a0a !important", backgroundColor: "#0a0a0a !important", opacity: "1 !important" }}
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
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black"
            style={{ backgroundColor: "#0a0a0a" }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed right-0 top-0 h-full w-80 bg-black border-l border-white/10 shadow-2xl z-[9999]" style={{ backgroundColor: "#0a0a0a" }}>
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
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    window.location.href = '/';
                  }}
                  className="font-heading text-2xl font-bold tracking-tight text-white"
                >
                  KLIQZ
                </Link>
              </div>

              {/* Navigation links */}
              <nav className="space-y-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    window.location.href = '/';
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                >
                  Accueil
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    window.location.href = '/formations';
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                >
                  Formations
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    window.location.href = '/rendez-vous';
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                >
                  Rendez-vous
                </button>
                
                {showMemberArea && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        window.location.href = '/profil';
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                    >
                      👤 Mon profil
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        window.location.href = '/espace-membre';
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg text-neutral-300 hover:bg-white/[0.1] hover:text-white transition-all"
                    >
                      Espace membre
                    </button>
                  </>
                )}
                
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      window.location.href = '/admin';
                    }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-neutral-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
                  >
                    🚀 Admin
                  </button>
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
