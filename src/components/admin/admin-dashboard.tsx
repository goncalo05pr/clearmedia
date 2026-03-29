"use client";

import { useState, useEffect } from "react";
import DashboardModule from "@/components/admin/dashboard-module";
import CRMModule from "@/components/admin/crm-module";
import FormationsModule from "@/components/admin/formations-module";
import AccountingModule from "@/components/admin/accounting-module";
import HRModule from "@/components/admin/hr-module";
import MarketingModule from "@/components/admin/marketing-module";
import SupportModule from "@/components/admin/support-module";
import SettingsModule from "@/components/admin/settings-module";
import ChatModule from "@/components/admin/chat-module";
import CalendarModule from "@/components/admin/calendar-module";
import AutomationModule from "@/components/admin/automation-module";
import EmployeesModule from "@/components/admin/employees-module";
import InvoicingModule from "@/components/admin/invoicing-module";
import FormationModulesManager from "@/components/admin/formation-modules-manager";
import CMSModule from "@/components/admin/cms-module";

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        // Vérifier si l'utilisateur est admin
        // En production: const { data: { user } } = await supabase.auth.getUser();
        // if (!user || user.user_metadata?.role !== 'admin') {
        //   window.location.href = '/';
        // }
        
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

  const modules = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: '📊', component: DashboardModule },
    { id: 'cms', name: 'CMS', icon: '📝', component: CMSModule },
    { id: 'crm', name: 'CRM', icon: '🤝', component: CRMModule },
    { id: 'formations', name: 'Formations', icon: '📚', component: FormationsModule },
    { id: 'formation-modules', name: 'Modules Formation', icon: '📝', component: FormationModulesManager },
    { id: 'accounting', name: 'Comptabilité', icon: '💰', component: AccountingModule },
    { id: 'hr', name: 'RH', icon: '👥', component: HRModule },
    { id: 'marketing', name: 'Marketing', icon: '📈', component: MarketingModule },
    { id: 'support', name: 'Support', icon: '🎧', component: SupportModule },
    { id: 'settings', name: 'Paramètres', icon: '⚙️', component: SettingsModule },
    { id: 'chat', name: 'Chat Interne', icon: '💬', component: ChatModule },
    { id: 'calendar', name: 'Calendrier', icon: '📅', component: CalendarModule },
    { id: 'automation', name: 'Automatisation', icon: '🤖', component: AutomationModule },
    { id: 'employees', name: 'Employés', icon: '👥', component: EmployeesModule },
    { id: 'invoicing', name: 'Facturation', icon: '🧾', component: InvoicingModule }
  ];

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

  const ActiveComponent = modules.find(m => m.id === activeModule)?.component || DashboardModule;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg mr-3">
              K
            </div>
            <div>
              <div className="font-bold text-lg">KLIQZ</div>
              <div className="text-xs text-gray-400">Administration</div>
            </div>
          </div>
          
          <nav className="space-y-2">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeModule === module.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl mr-3">{module.icon}</span>
                <span className="font-medium">{module.name}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">
              Connecté en tant que:
            </div>
            <div className="text-sm font-medium text-white">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {modules.find(m => m.id === activeModule)?.name}
              </h1>
              <p className="text-sm text-gray-600">
                Gestion de la plateforme KLIQZ
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                🔔
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                👤
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
