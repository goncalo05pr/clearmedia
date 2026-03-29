"use client";

import { useState, useEffect } from "react";
import CMSHomepageModule from "@/components/admin/cms-homepage-module";
import CMSFormationsModule from "@/components/admin/cms-formations-module";

export default function CMSModule() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'formations'>('homepage');

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">📝 Système CMS</h3>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'homepage', label: 'Page d\'accueil', icon: '🏠' },
              { id: 'formations', label: 'Formations', icon: '📚' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'homepage' && <CMSHomepageModule />}
          {activeTab === 'formations' && <CMSFormationsModule />}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-xl">ℹ️</div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Comment fonctionne le CMS ?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Modifiez le contenu directement depuis cette interface</li>
              <li>• Les modifications sont sauvegardées dans Supabase en temps réel</li>
              <li>• Le site public affiche automatiquement les dernières modifications</li>
              <li>• Aucun redéploiement nécessaire</li>
              <li>• Les stats clients et satisfaction sont calculées depuis les vraies données</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
