"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_amount?: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipient_count: number;
  sent_count: number;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  scheduled_at?: string;
  created_at: string;
}

export function MarketingModule() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [activeTab, setActiveTab] = useState<"promo" | "email">("promo");

  const [newPromo, setNewPromo] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_amount: 0,
    max_uses: null as number | null,
    expires_at: '',
    is_active: true
  });

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    scheduled_at: ''
  });

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const fetchMarketingData = async () => {
    try {
      const supabase = createClient();
      
      const { data: promoData } = await supabase.from("promo_codes").select("*");
      const { data: campaignData } = await supabase.from("email_campaigns").select("*");
      
      if (promoData) setPromoCodes(promoData);
      if (campaignData) setEmailCampaigns(campaignData);
    } catch (error) {
      console.error("Error fetching marketing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPromoCode = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("promo_codes").insert([newPromo]).select();
      if (data) {
        setPromoCodes([...promoCodes, data[0]]);
        setShowAddPromo(false);
        setNewPromo({
          code: '',
          discount_type: 'percentage',
          discount_value: 0,
          min_amount: 0,
          max_uses: null,
          expires_at: '',
          is_active: true
        });
      }
    } catch (error) {
      console.error("Error adding promo code:", error);
    }
  };

  const addEmailCampaign = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("email_campaigns").insert([{
        ...newCampaign,
        recipient_count: 0,
        sent_count: 0,
        status: 'draft'
      }]).select();
      if (data) {
        setEmailCampaigns([...emailCampaigns, data[0]]);
        setShowAddCampaign(false);
        setNewCampaign({
          name: '',
          subject: '',
          content: '',
          scheduled_at: ''
        });
      }
    } catch (error) {
      console.error("Error adding email campaign:", error);
    }
  };

  const togglePromoStatus = async (promoId: string, isActive: boolean) => {
    try {
      const supabase = createClient();
      await supabase.from("promo_codes").update({ is_active: isActive }).eq("id", promoId);
      setPromoCodes(promoCodes.map(p => p.id === promoId ? { ...p, is_active: isActive } : p));
    } catch (error) {
      console.error("Error updating promo code:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'inactive': return 'bg-gray-500/20 text-gray-300';
      case 'draft': return 'bg-yellow-500/20 text-yellow-300';
      case 'scheduled': return 'bg-blue-500/20 text-blue-300';
      case 'sent': return 'bg-green-500/20 text-green-300';
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex gap-2 glass-strong rounded-2xl p-2">
        <button
          onClick={() => setActiveTab("promo")}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === "promo"
              ? "btn-gradient text-white"
              : "text-neutral-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          🎫 Codes Promo
        </button>
        <button
          onClick={() => setActiveTab("email")}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === "email"
              ? "btn-gradient text-white"
              : "text-neutral-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          📧 Email Marketing
        </button>
      </div>

      {/* Promo Codes Tab */}
      {activeTab === "promo" && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                🎫
              </div>
              <div className="text-2xl font-black text-white">{promoCodes.length}</div>
              <div className="text-sm text-neutral-300">Total Codes</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent">
                ✅
              </div>
              <div className="text-2xl font-black text-white">{promoCodes.filter(p => p.is_active).length}</div>
              <div className="text-sm text-neutral-300">Codes Actifs</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#FF4D2E] to-[#F97316] bg-clip-text text-transparent">
                📊
              </div>
              <div className="text-2xl font-black text-white">
                {promoCodes.reduce((sum, p) => sum + p.used_count, 0)}
              </div>
              <div className="text-sm text-neutral-300">Utilisations Totales</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#F97316] to-[#8B5CF6] bg-clip-text text-transparent">
                💰
              </div>
              <div className="text-2xl font-black text-white">
                {promoCodes.filter(p => p.expires_at && new Date(p.expires_at) > new Date()).length}
              </div>
              <div className="text-sm text-neutral-300">Non Expirés</div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowAddPromo(true)}
            className="btn-gradient px-6 py-3 rounded-xl font-bold text-white hover:scale-105"
          >
            ➕ Ajouter un code promo
          </button>

          {/* Promo Codes Table */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">🎫 Codes Promo</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white font-bold">Code</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Type</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Valeur</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Utilisations</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Expiration</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Statut</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map((promo) => (
                    <tr key={promo.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-white text-lg">{promo.code}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          promo.discount_type === 'percentage' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {promo.discount_type === 'percentage' ? '%' : '€'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-lg font-bold text-[#8B5CF6]">
                        {promo.discount_type === 'percentage' 
                          ? `${promo.discount_value}%` 
                          : `${promo.discount_value}€`
                        }
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {promo.used_count} / {promo.max_uses || '∞'}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : '∞'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => togglePromoStatus(promo.id, !promo.is_active)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            promo.is_active 
                              ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
                              : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                          }`}
                        >
                          {promo.is_active ? '✅ Actif' : '💤 Inactif'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button className="glass-strong px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/20">
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Email Marketing Tab */}
      {activeTab === "email" && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                📧
              </div>
              <div className="text-2xl font-black text-white">{emailCampaigns.length}</div>
              <div className="text-sm text-neutral-300">Total Campagnes</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent">
                📤
              </div>
              <div className="text-2xl font-black text-white">{emailCampaigns.filter(c => c.status === 'sent').length}</div>
              <div className="text-sm text-neutral-300">Envoyées</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#FF4D2E] to-[#F97316] bg-clip-text text-transparent">
                ⏰
              </div>
              <div className="text-2xl font-black text-white">{emailCampaigns.filter(c => c.status === 'scheduled').length}</div>
              <div className="text-sm text-neutral-300">Planifiées</div>
            </div>
            <div className="card-gradient rounded-2xl p-6">
              <div className="text-3xl mb-3 bg-gradient-to-r from-[#F97316] to-[#8B5CF6] bg-clip-text text-transparent">
                👥
              </div>
              <div className="text-2xl font-black text-white">
                {emailCampaigns.reduce((sum, c) => sum + c.sent_count, 0)}
              </div>
              <div className="text-sm text-neutral-300">Emails Envoyés</div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowAddCampaign(true)}
            className="btn-gradient px-6 py-3 rounded-xl font-bold text-white hover:scale-105"
          >
            ➕ Créer une campagne
          </button>

          {/* Email Campaigns Table */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">📧 Campagnes Email</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white font-bold">Nom</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Sujet</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Statut</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Envoyés</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Planifié</th>
                    <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emailCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{campaign.name}</div>
                        <div className="text-sm text-neutral-400">
                          Créée le {new Date(campaign.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">{campaign.subject}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(campaign.status)}`}>
                          {campaign.status === 'draft' ? '📝 Brouillon' :
                           campaign.status === 'scheduled' ? '⏰ Planifiée' :
                           campaign.status === 'sent' ? '✅ Envoyée' :
                           campaign.status === 'cancelled' ? '❌ Annulée' : campaign.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {campaign.sent_count} / {campaign.recipient_count}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {campaign.scheduled_at ? new Date(campaign.scheduled_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="glass-strong px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/20">
                            👁️
                          </button>
                          <button className="glass-strong px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/20">
                            ✏️
                          </button>
                          <button className="glass-strong px-3 py-1 rounded-lg text-sm font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add Promo Code Modal */}
      {showAddPromo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">🎫 Ajouter un Code Promo</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Code promo"
                value={newPromo.code}
                onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500 font-mono"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newPromo.discount_type}
                  onChange={(e) => setNewPromo({...newPromo, discount_type: e.target.value as PromoCode['discount_type']})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white"
                >
                  <option value="percentage">Pourcentage (%)</option>
                  <option value="fixed">Montant fixe (€)</option>
                </select>
                <input
                  type="number"
                  placeholder="Valeur"
                  value={newPromo.discount_value}
                  onChange={(e) => setNewPromo({...newPromo, discount_value: parseInt(e.target.value) || 0})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Montant minimum (€)"
                  value={newPromo.min_amount}
                  onChange={(e) => setNewPromo({...newPromo, min_amount: parseInt(e.target.value) || 0})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
                />
                <input
                  type="number"
                  placeholder="Max utilisations"
                  value={newPromo.max_uses || ''}
                  onChange={(e) => setNewPromo({...newPromo, max_uses: parseInt(e.target.value) || null})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
                />
              </div>
              <input
                type="datetime-local"
                value={newPromo.expires_at}
                onChange={(e) => setNewPromo({...newPromo, expires_at: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="promo_active"
                  checked={newPromo.is_active}
                  onChange={(e) => setNewPromo({...newPromo, is_active: e.target.checked})}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="promo_active" className="text-white">Activer immédiatement</label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addPromoCode}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Ajouter
              </button>
              <button
                onClick={() => setShowAddPromo(false)}
                className="glass-strong flex-1 py-3 rounded-xl font-bold text-white hover:bg-white/20"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Email Campaign Modal */}
      {showAddCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">📧 Créer une Campagne Email</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom de la campagne"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="text"
                placeholder="Sujet de l'email"
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <textarea
                placeholder="Contenu de l'email (HTML ou texte)"
                value={newCampaign.content}
                onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500 h-48"
              />
              <input
                type="datetime-local"
                value={newCampaign.scheduled_at}
                onChange={(e) => setNewCampaign({...newCampaign, scheduled_at: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addEmailCampaign}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Créer
              </button>
              <button
                onClick={() => setShowAddCampaign(false)}
                className="glass-strong flex-1 py-3 rounded-xl font-bold text-white hover:bg-white/20"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
