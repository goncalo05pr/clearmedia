"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormationModule, ContentType, ContentItem } from "@/lib/formation-types";

export default function FormationModulesManager() {
  const [formations, setFormations] = useState<any[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<any>(null);
  const [modules, setModules] = useState<FormationModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<FormationModule | null>(null);

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading formations:', error);
      } else {
        setFormations(data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading formations:', error);
      setLoading(false);
    }
  };

  const loadModules = async (formationId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('formation_modules')
        .select('*')
        .eq('formation_id', formationId)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error loading modules:', error);
      } else {
        setModules(data || []);
      }
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const handleSelectFormation = (formation: any) => {
    setSelectedFormation(formation);
    loadModules(formation.id);
  };

  const handleAddModule = async (moduleData: Partial<FormationModule>) => {
    try {
      const supabase = createClient();
      
      const newModule: any = {
        id: Date.now().toString(),
        title: moduleData.title || '',
        contentType: moduleData.contentType || 'text',
        content: moduleData.content || [],
        order: modules.length,
        formation_id: selectedFormation?.id || ''
      };

      const { error } = await supabase
        .from('formation_modules')
        .insert(newModule);

      if (error) {
        console.error('Error adding module:', error);
      } else {
        console.log('Module added successfully');
        await loadModules(selectedFormation?.id || '');
        setShowAddModuleModal(false);
      }
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const handleEditModule = async (moduleData: Partial<FormationModule>) => {
    if (!selectedModule) return;

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('formation_modules')
        .update({
          title: moduleData.title,
          contentType: moduleData.contentType,
          content: moduleData.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedModule.id);

      if (error) {
        console.error('Error updating module:', error);
      } else {
        console.log('Module updated successfully');
        await loadModules(selectedFormation?.id || '');
        setShowEditModuleModal(false);
        setSelectedModule(null);
      }
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('formation_modules')
          .delete()
          .eq('id', moduleId);

        if (error) {
          console.error('Error deleting module:', error);
        } else {
          console.log('Module deleted successfully');
          await loadModules(selectedFormation?.id || '');
        }
      } catch (error) {
        console.error('Error deleting module:', error);
      }
    }
  };

  const handleEditModuleClick = (module: FormationModule) => {
    setSelectedModule(module);
    setShowEditModuleModal(true);
  };

  const getContentTypeIcon = (contentType: ContentType) => {
    switch (contentType) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'link': return '🔗';
      case 'text': return '📝';
      case 'quiz': return '📋';
      default: return '📚';
    }
  };

  const getContentTypeLabel = (contentType: ContentType) => {
    switch (contentType) {
      case 'video': return 'Vidéo';
      case 'pdf': return 'PDF/Document';
      case 'link': return 'Lien externe';
      case 'text': return 'Texte/Article';
      case 'quiz': return 'Quiz/Exercice';
      default: return 'Contenu';
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
      <h3 className="text-xl font-semibold text-white mb-4">📚 Gestion des Formations</h3>
      
      {/* Formation Selector */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner une formation</label>
          <select
            value={selectedFormation?.id || ''}
            onChange={(e) => {
              const formation = formations.find(f => f.id === e.target.value);
              if (formation) {
                handleSelectFormation(formation);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choisir une formation...</option>
            {formations.map((formation) => (
              <option key={formation.id} value={formation.id}>
                {formation.title}
              </option>
            ))}
          </select>
        </div>

        {selectedFormation && (
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{selectedFormation.title}</h4>
              <p className="text-sm text-gray-600">{selectedFormation.description}</p>
            </div>
            <button
              onClick={() => setShowAddModuleModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              + Ajouter un module
            </button>
          </div>
        )}
      </div>

      {/* Modules List */}
      {selectedFormation && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Modules de contenu</h4>
          </div>
          
          {modules.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">Aucun module pour cette formation</p>
              <p className="text-gray-400 text-sm mt-2">Commencez par ajouter votre premier module</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {modules.map((module) => (
                <div key={module.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getContentTypeIcon(module.contentType)}</span>
                      <div>
                        <h5 className="font-medium text-gray-900">{module.title}</h5>
                        <p className="text-sm text-gray-600">
                          Type: {getContentTypeLabel(module.contentType)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditModuleClick(module)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Module Modal */}
      {showAddModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Ajouter un module</h4>
              <button 
                onClick={() => setShowAddModuleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <ModuleForm
              onSubmit={handleAddModule}
              onCancel={() => setShowAddModuleModal(false)}
              submitText="Ajouter"
            />
          </div>
        </div>
      )}

      {/* Edit Module Modal */}
      {showEditModuleModal && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Modifier le module</h4>
              <button 
                onClick={() => {
                  setShowEditModuleModal(false);
                  setSelectedModule(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <ModuleForm
              onSubmit={handleEditModule}
              onCancel={() => {
                setShowEditModuleModal(false);
                setSelectedModule(null);
              }}
              submitText="Mettre à jour"
              initialData={selectedModule}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ModuleFormProps {
  onSubmit: (data: Partial<FormationModule>) => void;
  onCancel: () => void;
  submitText: string;
  initialData?: FormationModule;
}

function ModuleForm({ onSubmit, onCancel, submitText, initialData }: ModuleFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    contentType: initialData?.contentType || 'text',
    content: initialData?.content || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addContentItem = () => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type: formData.contentType,
      title: '',
      content: '',
      order: formData.content.length
    };
    setFormData({...formData, content: [...formData.content, newItem]});
  };

  const updateContentItem = (id: string, field: keyof ContentItem, value: any) => {
    setFormData({
      ...formData,
      content: formData.content.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const removeContentItem = (id: string) => {
    setFormData({
      ...formData,
      content: formData.content.filter(item => item.id !== id)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre du module</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type de contenu</label>
        <select
          value={formData.contentType}
          onChange={(e) => setFormData({...formData, contentType: e.target.value as ContentType})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="text">📝 Texte/Article</option>
          <option value="video">🎥 Vidéo (YouTube/Vimeo)</option>
          <option value="pdf">📄 PDF/Document</option>
          <option value="link">🔗 Lien externe</option>
          <option value="quiz">📋 Quiz/Exercice</option>
        </select>
      </div>

      {/* Content Items */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Contenu du module</label>
          <button
            type="button"
            onClick={addContentItem}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
          >
            + Ajouter un élément
          </button>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {formData.content.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun contenu. Ajoutez des éléments pour commencer.
            </div>
          ) : (
            formData.content.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateContentItem(item.id, 'title', e.target.value)}
                      placeholder="Titre de l'élément"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    
                    {item.type === 'video' && (
                      <input
                        type="url"
                        value={item.url || ''}
                        onChange={(e) => updateContentItem(item.id, 'url', e.target.value)}
                        placeholder="URL embed YouTube/Vimeo"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    )}
                    
                    {item.type === 'pdf' && (
                      <input
                        type="url"
                        value={item.fileUrl || ''}
                        onChange={(e) => updateContentItem(item.id, 'fileUrl', e.target.value)}
                        placeholder="URL du fichier PDF"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    )}
                    
                    {item.type === 'link' && (
                      <input
                        type="url"
                        value={item.url || ''}
                        onChange={(e) => updateContentItem(item.id, 'url', e.target.value)}
                        placeholder="URL externe (WhatsApp, Discord, etc.)"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    )}
                    
                    {item.type === 'text' && (
                      <textarea
                        value={item.content || ''}
                        onChange={(e) => updateContentItem(item.id, 'content', e.target.value)}
                        placeholder="Contenu textuel"
                        rows={3}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    )}
                    
                    {item.type === 'quiz' && (
                      <textarea
                        value={item.content || ''}
                        onChange={(e) => updateContentItem(item.id, 'content', e.target.value)}
                        placeholder="Questions et réponses du quiz"
                        rows={3}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeContentItem(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
