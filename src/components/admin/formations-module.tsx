"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Formation {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface Module {
  id: string;
  formation_id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  is_published: boolean;
}

export function FormationsModule() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFormation, setShowAddFormation] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const [newFormation, setNewFormation] = useState({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category: '',
    is_published: false
  });

  const [newModule, setNewModule] = useState({
    formation_id: '',
    title: '',
    description: '',
    duration: 0,
    order: 0,
    is_published: false
  });

  useEffect(() => {
    fetchFormationsData();
  }, []);

  const fetchFormationsData = async () => {
    try {
      const supabase = createClient();
      
      const { data: formationsData } = await supabase.from("formations").select("*");
      const { data: modulesData } = await supabase.from("formation_modules").select("*");
      
      if (formationsData) setFormations(formationsData);
      if (modulesData) setModules(modulesData);
    } catch (error) {
      console.error("Error fetching formations data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFormation = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("formations").insert([newFormation]).select();
      if (data) {
        setFormations([...formations, data[0]]);
        setShowAddFormation(false);
        setNewFormation({
          title: '',
          description: '',
          price: 0,
          duration: '',
          level: 'beginner',
          category: '',
          is_published: false
        });
      }
    } catch (error) {
      console.error("Error adding formation:", error);
    }
  };

  const addModule = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("formation_modules").insert([newModule]).select();
      if (data) {
        setModules([...modules, data[0]]);
        setNewModule({
          formation_id: '',
          title: '',
          description: '',
          duration: 0,
          order: 0,
          is_published: false
        });
      }
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  const toggleFormationStatus = async (formationId: string, isPublished: boolean) => {
    try {
      const supabase = createClient();
      await supabase.from("formations").update({ is_published: isPublished }).eq("id", formationId);
      setFormations(formations.map(f => f.id === formationId ? { ...f, is_published: isPublished } : f));
    } catch (error) {
      console.error("Error updating formation:", error);
    }
  };

  const deleteFormation = async (formationId: string) => {
    try {
      const supabase = createClient();
      await supabase.from("formations").delete().eq("id", formationId);
      setFormations(formations.filter(f => f.id !== formationId));
    } catch (error) {
      console.error("Error deleting formation:", error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-300';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'advanced': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return '🌱 Débutant';
      case 'intermediate': return '🌿 Intermédiaire';
      case 'advanced': return '🌳 Avancé';
      default: return level;
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
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="card-gradient rounded-2xl p-6">
          <div className="text-3xl mb-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
            📚
          </div>
          <div className="text-2xl font-black text-white">{formations.length}</div>
          <div className="text-sm text-neutral-300">Total Formations</div>
        </div>
        <div className="card-gradient rounded-2xl p-6">
          <div className="text-3xl mb-3 bg-gradient-to-r from-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent">
            📖
          </div>
          <div className="text-2xl font-black text-white">{modules.length}</div>
          <div className="text-sm text-neutral-300">Total Modules</div>
        </div>
        <div className="card-gradient rounded-2xl p-6">
          <div className="text-3xl mb-3 bg-gradient-to-r from-[#FF4D2E] to-[#F97316] bg-clip-text text-transparent">
            ✅
          </div>
          <div className="text-2xl font-black text-white">{formations.filter(f => f.is_published).length}</div>
          <div className="text-sm text-neutral-300">Publiées</div>
        </div>
        <div className="card-gradient rounded-2xl p-6">
          <div className="text-3xl mb-3 bg-gradient-to-r from-[#F97316] to-[#8B5CF6] bg-clip-text text-transparent">
            💰
          </div>
          <div className="text-2xl font-black text-white">
            {formations.reduce((sum, f) => sum + f.price, 0).toLocaleString()}€
          </div>
          <div className="text-sm text-neutral-300">Valeur Totale</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowAddFormation(true)}
          className="btn-gradient px-6 py-3 rounded-xl font-bold text-white hover:scale-105"
        >
          ➕ Ajouter une formation
        </button>
        <button
          onClick={() => setEditingModule({} as Module)}
          className="glass-strong px-6 py-3 rounded-xl font-bold text-white hover:bg-white/20 hover:scale-105"
        >
          📖 Ajouter un module
        </button>
      </div>

      {/* Formations Table */}
      <div className="glass-strong rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6">📚 Gestion des Formations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white font-bold">Titre</th>
                <th className="text-left py-3 px-4 text-white font-bold">Catégorie</th>
                <th className="text-left py-3 px-4 text-white font-bold">Niveau</th>
                <th className="text-left py-3 px-4 text-white font-bold">Prix</th>
                <th className="text-left py-3 px-4 text-white font-bold">Durée</th>
                <th className="text-left py-3 px-4 text-white font-bold">Statut</th>
                <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formations.map((formation) => (
                <tr key={formation.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold text-white">{formation.title}</div>
                      <div className="text-sm text-neutral-400">{formation.description.slice(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">{formation.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getLevelColor(formation.level)}`}>
                      {getLevelLabel(formation.level)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-lg font-bold text-[#8B5CF6]">{formation.price}€</td>
                  <td className="py-3 px-4 text-neutral-300">{formation.duration}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleFormationStatus(formation.id, !formation.is_published)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        formation.is_published 
                          ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
                          : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                      }`}
                    >
                      {formation.is_published ? '✅ Publiée' : '📝 Brouillon'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedFormation(formation)}
                        className="glass-strong px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/20"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => deleteFormation(formation.id)}
                        className="glass-strong px-3 py-1 rounded-lg text-sm font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300"
                      >
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

      {/* Modules Table */}
      <div className="glass-strong rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6">📖 Gestion des Modules</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white font-bold">Module</th>
                <th className="text-left py-3 px-4 text-white font-bold">Formation</th>
                <th className="text-left py-3 px-4 text-white font-bold">Durée</th>
                <th className="text-left py-3 px-4 text-white font-bold">Ordre</th>
                <th className="text-left py-3 px-4 text-white font-bold">Statut</th>
                <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold text-white">{module.title}</div>
                      <div className="text-sm text-neutral-400">{module.description.slice(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {formations.find(f => f.id === module.formation_id)?.title || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">{module.duration}min</td>
                  <td className="py-3 px-4 text-neutral-300">{module.order}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      module.is_published 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {module.is_published ? '✅ Publié' : '📝 Brouillon'}
                    </span>
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

      {/* Add Formation Modal */}
      {showAddFormation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">➕ Ajouter une Formation</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Titre de la formation"
                  value={newFormation.title}
                  onChange={(e) => setNewFormation({...newFormation, title: e.target.value})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
                />
                <input
                  type="text"
                  placeholder="Catégorie"
                  value={newFormation.category}
                  onChange={(e) => setNewFormation({...newFormation, category: e.target.value})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
                />
              </div>
              <textarea
                placeholder="Description"
                value={newFormation.description}
                onChange={(e) => setNewFormation({...newFormation, description: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500 h-24"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Prix (€)"
                  value={newFormation.price}
                  onChange={(e) => setNewFormation({...newFormation, price: parseInt(e.target.value) || 0})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
                />
                <input
                  type="text"
                  placeholder="Durée (ex: 2h30)"
                  value={newFormation.duration}
                  onChange={(e) => setNewFormation({...newFormation, duration: e.target.value})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
                />
                <select
                  value={newFormation.level}
                  onChange={(e) => setNewFormation({...newFormation, level: e.target.value as Formation['level']})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white"
                >
                  <option value="beginner">🌱 Débutant</option>
                  <option value="intermediate">🌿 Intermédiaire</option>
                  <option value="advanced">🌳 Avancé</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={newFormation.is_published}
                  onChange={(e) => setNewFormation({...newFormation, is_published: e.target.checked})}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="is_published" className="text-white">Publier immédiatement</label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addFormation}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Ajouter
              </button>
              <button
                onClick={() => setShowAddFormation(false)}
                className="glass-strong flex-1 py-3 rounded-xl font-bold text-white hover:bg-white/20"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {editingModule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">📖 Ajouter un Module</h3>
            <div className="space-y-4">
              <select
                value={newModule.formation_id}
                onChange={(e) => setNewModule({...newModule, formation_id: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              >
                <option value="">Sélectionner une formation</option>
                {formations.map(formation => (
                  <option key={formation.id} value={formation.id}>{formation.title}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Titre du module"
                value={newModule.title}
                onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <textarea
                placeholder="Description"
                value={newModule.description}
                onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500 h-24"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Durée (minutes)"
                  value={newModule.duration}
                  onChange={(e) => setNewModule({...newModule, duration: parseInt(e.target.value) || 0})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
                />
                <input
                  type="number"
                  placeholder="Ordre"
                  value={newModule.order}
                  onChange={(e) => setNewModule({...newModule, order: parseInt(e.target.value) || 0})}
                  className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="module_published"
                  checked={newModule.is_published}
                  onChange={(e) => setNewModule({...newModule, is_published: e.target.checked})}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="module_published" className="text-white">Publier immédiatement</label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addModule}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Ajouter
              </button>
              <button
                onClick={() => setEditingModule(null)}
                className="glass-strong flex-1 py-3 rounded-xl font-bold text-white hover:bg-white/20"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formation Detail Modal */}
      {selectedFormation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">📚 Détails de la Formation</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-400">Titre</label>
                  <div className="text-white font-semibold">{selectedFormation.title}</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Catégorie</label>
                  <div className="text-white">{selectedFormation.category}</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Niveau</label>
                  <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getLevelColor(selectedFormation.level)}`}>
                    {getLevelLabel(selectedFormation.level)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Prix</label>
                  <div className="text-lg font-bold text-[#8B5CF6]">{selectedFormation.price}€</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Durée</label>
                  <div className="text-white">{selectedFormation.duration}</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Statut</label>
                  <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                    selectedFormation.is_published 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {selectedFormation.is_published ? '✅ Publiée' : '📝 Brouillon'}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-400">Description</label>
                <div className="text-white bg-white/5 rounded-lg p-3">{selectedFormation.description}</div>
              </div>
              <div>
                <label className="text-sm text-neutral-400">Modules associés</label>
                <div className="space-y-2 mt-2">
                  {modules.filter(m => m.formation_id === selectedFormation.id).map(module => (
                    <div key={module.id} className="glass-strong rounded-lg p-3">
                      <div className="font-semibold text-white">{module.title}</div>
                      <div className="text-sm text-neutral-400">{module.duration}min - Ordre {module.order}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedFormation(null)}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
