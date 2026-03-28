"use client";

import { useState, useEffect } from "react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  trigger: 'purchase' | 'welcome' | 'reminder' | 'followup' | 'abandoned_cart';
  isActive: boolean;
  variables: string[];
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  templateId: string;
  delay: number; // en heures
  isActive: boolean;
  conditions: {
    minDaysSinceLastPurchase?: number;
    specificFormation?: string;
    purchaseAmount?: number;
  };
}

interface Campaign {
  id: string;
  name: string;
  templateId: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  status: 'draft' | 'scheduled' | 'sending' | 'completed';
  scheduledAt?: string;
}

export default function AutomationModule() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'rules' | 'campaigns'>('templates');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
    trigger: "purchase" as EmailTemplate['trigger'],
    delay: 24
  });

  useEffect(() => {
    loadAutomationData();
  }, []);

  const loadAutomationData = async () => {
    try {
      const mockTemplates: EmailTemplate[] = [
        {
          id: "1",
          name: "Confirmation d'achat",
          subject: "Merci pour votre achat ! 🎉",
          content: `Bonjour {{firstName}},

Merci beaucoup pour votre achat de la formation "{{formationTitle}}" !

Vous pouvez maintenant accéder à votre espace membre et commencer votre apprentissage.

📚 Accéder à ma formation: {{formationLink}}

Si vous avez des questions, n'hésitez pas à nous contacter.

À très bientôt,
L'équipe KLIQZ`,
          trigger: "purchase",
          isActive: true,
          variables: ["firstName", "formationTitle", "formationLink"]
        },
        {
          id: "2",
          name: "Email de bienvenue",
          subject: "Bienvenue chez KLIQZ !",
          content: `Bonjour {{firstName}},

Bienvenue dans la communauté KLIQZ !

Nous sommes ravis de vous compter parmi nos étudiants.

🚀 Découvrir nos formations: {{siteUrl}}

L'équipe KLIQZ`,
          trigger: "welcome",
          isActive: true,
          variables: ["firstName", "siteUrl"]
        },
        {
          id: "3",
          name: "Relance panier abandonné",
          subject: "Vous avez laissé quelque chose dans votre panier",
          content: `Bonjour {{firstName}},

Nous avons remarqué que vous avez ajouté "{{formationTitle}}" à votre panier mais n'avez pas finalisé l'achat.

Est-ce que vous avez besoin d'aide ?

🛒 Finaliser mon achat: {{cartLink}}

L'équipe KLIQZ`,
          trigger: "abandoned_cart",
          isActive: true,
          variables: ["firstName", "formationTitle", "cartLink"]
        }
      ];

      const mockRules: AutomationRule[] = [
        {
          id: "1",
          name: "Relance 7 jours après achat",
          trigger: "purchase",
          templateId: "1",
          delay: 168, // 7 jours en heures
          isActive: true,
          conditions: {
            minDaysSinceLastPurchase: 7
          }
        },
        {
          id: "2",
          name: "Email de suivi formation",
          trigger: "purchase",
          templateId: "1",
          delay: 72, // 3 jours en heures
          isActive: true,
          conditions: {
            specificFormation: "social-ads-mastery"
          }
        }
      ];

      const mockCampaigns: Campaign[] = [
        {
          id: "1",
          name: "Promotion Printemps 2024",
          templateId: "1",
          recipients: 1250,
          sent: 1180,
          opened: 890,
          clicked: 234,
          status: "completed"
        },
        {
          id: "2",
          name: "Lancement nouvelle formation",
          templateId: "2",
          recipients: 2500,
          sent: 2500,
          opened: 1875,
          clicked: 450,
          status: "sending"
        }
      ];

      setTemplates(mockTemplates);
      setRules(mockRules);
      setCampaigns(mockCampaigns);
      setLoading(false);
    } catch (error) {
      console.error('Error loading automation data:', error);
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (selectedTemplate) {
        // Logique de modification
        console.log('Updating template:', selectedTemplate.id, formData);
        setTemplates(templates.map(t => 
          t.id === selectedTemplate.id 
            ? { ...t, ...formData }
            : t
        ));
      } else {
        // Logique d'ajout
        console.log('Adding template:', formData);
        const newTemplate: EmailTemplate = {
          id: Date.now().toString(),
          ...formData,
          isActive: true,
          variables: extractVariables(formData.content)
        };
        setTemplates([...templates, newTemplate]);
      }
      
      setFormData({ name: "", subject: "", content: "", trigger: "purchase", delay: 24 });
      setShowTemplateModal(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? matches.map(match => match.slice(2, -2)) : [];
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
      trigger: template.trigger,
      delay: 24
    });
    setShowTemplateModal(true);
  };

  const handleToggleTemplate = async (templateId: string) => {
    try {
      console.log('Toggling template:', templateId);
      setTemplates(templates.map(t => 
        t.id === templateId ? { ...t, isActive: !t.isActive } : t
      ));
    } catch (error) {
      console.error('Error toggling template:', error);
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    try {
      console.log('Toggling rule:', ruleId);
      setRules(rules.map(r => 
        r.id === ruleId ? { ...r, isActive: !r.isActive } : r
      ));
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'welcome': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'followup': return 'bg-purple-100 text-purple-800';
      case 'abandoned_cart': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">🤖 Automatisation Marketing</h3>
      
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {(['templates', 'rules', 'campaigns'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300'
              }`}
            >
              {tab === 'templates' ? 'Templates Email' :
               tab === 'rules' ? 'Règles Auto' : 'Campagnes'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-white">Templates d'Email</h4>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              + Nouveau Template
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Déclencheur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variables</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {templates.map((template) => (
                    <tr key={template.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{template.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTriggerColor(template.trigger)}`}>
                          {template.trigger === 'purchase' ? 'Achat' :
                           template.trigger === 'welcome' ? 'Bienvenue' :
                           template.trigger === 'reminder' ? 'Rappel' :
                           template.trigger === 'followup' ? 'Suivi' : 'Panier abandonné'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{template.subject}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map(variable => (
                            <span key={variable} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {variable}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {template.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleToggleTemplate(template.id)}
                            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                          >
                            {template.isActive ? 'Désactiver' : 'Activer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-white">Règles d'Automatisation</h4>
            <button
              onClick={() => setShowRuleModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              + Nouvelle Règle
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-4 p-6">
              {rules.map((rule) => (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <h5 className="font-medium text-gray-900 mr-3">{rule.name}</h5>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                    >
                      {rule.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Déclencheur:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTriggerColor(rule.trigger)}`}>
                        {rule.trigger === 'purchase' ? 'Achat' : 'Autre'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Délai:</span>
                      <span className="ml-2">{rule.delay} heures</span>
                    </div>
                  </div>
                  
                  {rule.conditions && (
                    <div className="mt-3 text-sm">
                      <span className="font-medium text-gray-700">Conditions:</span>
                      <div className="mt-2 space-y-1">
                        {rule.conditions.minDaysSinceLastPurchase && (
                          <div>• Minimum {rule.conditions.minDaysSinceLastPurchase} jours depuis le dernier achat</div>
                        )}
                        {rule.conditions.specificFormation && (
                          <div>• Formation spécifique: {rule.conditions.specificFormation}</div>
                        )}
                        {rule.conditions.purchaseAmount && (
                          <div>• Montant minimum: {rule.conditions.purchaseAmount}€</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Campagnes Email</h4>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinataires</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Envoyés</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ouverts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliqués</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{campaign.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{campaign.recipients.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{campaign.sent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {campaign.opened.toLocaleString()} ({campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : 0}%)
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {campaign.clicked.toLocaleString()} ({campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(1) : 0}%)
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status === 'draft' ? 'Brouillon' :
                           campaign.status === 'scheduled' ? 'Programmé' :
                           campaign.status === 'sending' ? 'Envoi en cours' : 'Terminé'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedTemplate ? 'Modifier le template' : 'Nouveau template'}
              </h4>
              <button 
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                  setFormData({ name: "", subject: "", content: "", trigger: "purchase" as EmailTemplate['trigger'], delay: 24 });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Déclencheur</label>
                  <select
                    value={formData.trigger}
                    onChange={(e) => setFormData({...formData, trigger: e.target.value as EmailTemplate['trigger']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="purchase">Achat</option>
                    <option value="welcome">Bienvenue</option>
                    <option value="reminder">Rappel</option>
                    <option value="followup">Suivi</option>
                    <option value="abandoned_cart">Panier abandonné</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Utilisez {{variableName}} pour insérer des variables dynamiques"
                />
                <div className="mt-2 text-sm text-gray-600">
                  Variables détectées: {extractVariables(formData.content).join(', ') || 'Aucune'}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700"
                >
                  {selectedTemplate ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
