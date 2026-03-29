"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Formation, FormationModule, ContentType, ContentItem } from "@/lib/formation-types";

interface FormationWithModules extends Formation {
  modules: FormationModule[];
}

export default function FormationsModule() {
  const [formations, setFormations] = useState<FormationWithModules[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModulesModal, setShowModulesModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<FormationWithModules | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    isActive: true
  });

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    try {
      const supabase = createClient();
      
      // Récupérer les formations depuis Supabase
      const { data: formationsData, error: formationsError } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false });

      if (formationsError) {
        console.error('Error loading formations:', formationsError);
      } else {
        // Pour chaque formation, récupérer ses modules
        const formationsWithModules: FormationWithModules[] = [];
        
        for (const formation of formationsData || []) {
          const { data: modulesData, error: modulesError } = await supabase
            .from('formation_modules')
            .select('*')
            .eq('formation_id', formation.id)
            .order('order_index', { ascending: true });

          if (modulesError) {
            console.error('Error loading modules for formation:', formation.id, modulesError);
          }

          const formationWithModules: FormationWithModules = {
            id: formation.id,
            title: formation.title,
            description: formation.description,
            price: formation.price,
            isActive: formation.is_active,
            createdAt: formation.created_at,
            updatedAt: formation.updated_at,
            modules: (modulesData || []).map((module: any) => ({
              id: module.id,
              title: module.title,
              description: module.description,
              orderIndex: module.order_index,
              formationId: module.formation_id,
              contentType: 'mixed' as ContentType,
              content: module.content || '',
              order: module.order_index || 0,
              contentItems: [] // Les items de contenu seront chargés séparément si nécessaire
            }))
          };

          formationsWithModules.push(formationWithModules);
        }

        setFormations(formationsWithModules);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading formations:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      if (selectedFormation) {
        // Modifier une formation existante
        const { error } = await supabase
          .from('formations')
          .update({
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            is_active: formData.isActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedFormation.id);
          
        if (error) {
          console.error('Error updating formation:', error);
        } else {
          console.log('Formation updated successfully');
          await loadFormations();
          setShowEditModal(false);
          setSelectedFormation(null);
        }
      } else {
        // Ajouter une nouvelle formation
        const { error } = await supabase
          .from('formations')
          .insert({
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            is_active: formData.isActive,
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error adding formation:', error);
        } else {
          console.log('Formation added successfully');
          await loadFormations();
          setShowAddModal(false);
        }
      }
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        isActive: true
      });
    } catch (error) {
      console.error('Error saving formation:', error);
    }
  };

  const handleEdit = (formation: FormationWithModules) => {
    setSelectedFormation(formation);
    setFormData({
      title: formation.title,
      description: formation.description,
      price: formation.price.toString(),
      isActive: formation.isActive
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        const supabase = createClient();
        
        // Supprimer d'abord les modules de la formation
        await supabase
          .from('formation_modules')
          .delete()
          .eq('formation_id', id);
        
        // Puis supprimer la formation
        const { error } = await supabase
          .from('formations')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting formation:', error);
        } else {
          console.log('Formation deleted successfully');
          await loadFormations();
        }
      } catch (error) {
        console.error('Error deleting formation:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('formations')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error toggling formation status:', error);
      } else {
        console.log('Formation status updated successfully');
        await loadFormations();
      }
    } catch (error) {
      console.error('Error toggling formation status:', error);
    }
  };

  const handleManageModules = (formation: FormationWithModules) => {
    setSelectedFormation(formation);
    setShowModulesModal(true);
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
      <h3 className="text-xl font-semibold text-white mb-4">📚 Formations</h3>
      
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Ajouter une formation
        </button>
      </div>

      {/* Formations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">Aucune formation pour l'instant</p>
            <p className="text-gray-400 text-sm mt-2">Commencez par ajouter votre première formation</p>
          </div>
        ) : (
          formations.map((formation) => (
            <div
              key={formation.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                formation.isActive 
                  ? 'border-green-200 hover:border-green-300' 
                  : 'border-gray-200 hover:border-gray-300 opacity-75'
              }`}
              onClick={() => handleManageModules(formation)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {formation.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {formation.description}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    formation.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {formation.price.toLocaleString()}€
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    formation.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formation.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>📖 {formation.modules.length} module{formation.modules.length !== 1 ? 's' : ''}</span>
                  <span>📅 {new Date(formation.createdAt || '').toLocaleDateString('fr-FR')}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManageModules(formation);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Gérer les modules
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(formation);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(formation.id, formation.isActive);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {formation.isActive ? '⏸️' : '▶️'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(formation.id);
                    }}
                    className="px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Formation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Ajouter une formation</h4>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Titre de la formation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description de la formation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="99.99"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Formation active
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Formation Modal */}
      {showEditModal && selectedFormation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Modifier la formation</h4>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedFormation(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="editIsActive" className="ml-2 text-sm text-gray-700">
                  Formation active
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFormation(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modules Management Modal */}
      {showModulesModal && selectedFormation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Modules de "{selectedFormation.title}"
              </h4>
              <button 
                onClick={() => {
                  setShowModulesModal(false);
                  setSelectedFormation(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {selectedFormation.modules.length} module{selectedFormation.modules.length !== 1 ? 's' : ''}
                </span>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
                >
                  + Ajouter un module
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {selectedFormation.modules.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">📖</div>
                  <p className="text-gray-500">Aucun module pour cette formation</p>
                  <p className="text-gray-400 text-sm mt-1">Ajoutez des modules pour structurer votre formation</p>
                </div>
              ) : (
                selectedFormation.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Module {index + 1}
                          </span>
                          <span className="text-lg font-semibold text-gray-900">
                            {module.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {typeof module.content === 'string' ? module.content : 'Pas de description'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Modifier
                        </button>
                        <button className="px-3 py-1 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowModulesModal(false);
                  setSelectedFormation(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
