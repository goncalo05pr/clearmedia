"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Formation, FormationModule, ContentType, ContentItem } from "@/lib/formation-types";

interface ModuleFormData {
  title: string;
  type: 'video' | 'pdf' | 'link' | 'text';
  content: string;
}

interface FormationWithModules extends Formation {
  modules: FormationModule[];
}

interface ExtendedFormation extends Formation {
  coverImage?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // en heures
  formationType: 'videos' | 'pdf' | 'link' | 'text' | 'mixed';
}

export default function FormationsModule() {
  const [formations, setFormations] = useState<ExtendedFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModulesModal, setShowModulesModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<ExtendedFormation | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    isActive: true,
    coverImage: "",
    level: "beginner" as ExtendedFormation['level'],
    duration: 0,
    formationType: "mixed" as ExtendedFormation['formationType']
  });
  const [modules, setModules] = useState<ModuleFormData[]>([
    { title: "", type: "video", content: "" }
  ]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

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
        // Transformer les données en format ExtendedFormation
        const extendedFormations: ExtendedFormation[] = (formationsData || []).map((formation: any) => ({
          id: formation.id,
          title: formation.title,
          description: formation.description,
          price: formation.price,
          isActive: formation.is_active,
          createdAt: formation.created_at,
          updatedAt: formation.updated_at,
          coverImage: formation.cover_image_url,
          level: formation.level || 'beginner',
          duration: formation.duration || 0,
          formationType: formation.formation_type || 'mixed',
          modules: [] // Les modules seront chargés séparément si nécessaire
        }));

        setFormations(extendedFormations);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading formations:', error);
      setLoading(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addModule = () => {
    setModules([...modules, { title: "", type: "video", content: "" }]);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const updateModule = (index: number, field: keyof ModuleFormData, value: any) => {
    const updatedModules = [...modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setModules(updatedModules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      // Upload de l'image de couverture si fournie
      let coverImageUrl = "";
      if (coverImageFile) {
        const fileExt = coverImageFile.name.split('.').pop();
        const fileName = `formation-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('formation-covers')
          .upload(fileName, coverImageFile);

        if (uploadError) {
          console.error('Error uploading cover image:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('formation-covers')
            .getPublicUrl(fileName);
          coverImageUrl = publicUrl;
        }
      }

      // Créer la formation
      const { data: formationData, error: formationError } = await supabase
        .from('formations')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          is_active: formData.isActive,
          cover_image_url: coverImageUrl,
          level: formData.level,
          duration: formData.duration,
          formation_type: formData.formationType,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (formationError) {
        console.error('Error creating formation:', formationError);
        return;
      }

      // Créer les modules
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        if (module.title && module.content) {
          // Déterminer le type de contenu
          let contentType: ContentType = 'video';
          let contentItems: ContentItem[] = [];

          switch (module.type) {
            case 'video':
              contentType = 'video';
              contentItems = [{
                id: `item-${Date.now()}-${i}`,
                type: 'video',
                title: module.title,
                content: module.content,
                order: 0
              }];
              break;
            case 'pdf':
              contentType = 'pdf';
              contentItems = [{
                id: `item-${Date.now()}-${i}`,
                type: 'pdf',
                title: module.title,
                content: module.content,
                order: 0
              }];
              break;
            case 'link':
              contentType = 'link';
              contentItems = [{
                id: `item-${Date.now()}-${i}`,
                type: 'link',
                title: module.title,
                content: module.content,
                order: 0
              }];
              break;
            case 'text':
              contentType = 'text';
              contentItems = [{
                id: `item-${Date.now()}-${i}`,
                type: 'text',
                title: module.title,
                content: module.content,
                order: 0
              }];
              break;
          }

          await supabase
            .from('formation_modules')
            .insert({
              formation_id: formationData.id,
              title: module.title,
              description: `Module ${i + 1}: ${module.title}`,
              content_type: contentType,
              content: JSON.stringify(contentItems),
              order_index: i,
              created_at: new Date().toISOString()
            });
        }
      }

      console.log('Formation and modules created successfully');
      await loadFormations();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving formation:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      isActive: true,
      coverImage: "",
      level: "beginner",
      duration: 0,
      formationType: "mixed"
    });
    setModules([{ title: "", type: "video", content: "" }]);
    setCoverImageFile(null);
    setPreviewUrl("");
  };

  const handleEdit = (formation: ExtendedFormation) => {
    setSelectedFormation(formation);
    setFormData({
      title: formation.title,
      description: formation.description,
      price: formation.price.toString(),
      isActive: formation.isActive,
      coverImage: formation.coverImage || "",
      level: formation.level,
      duration: formation.duration,
      formationType: formation.formationType
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return level;
    }
  };

  const getFormationTypeColor = (type: string) => {
    switch (type) {
      case 'videos': return 'bg-blue-100 text-blue-800';
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'link': return 'bg-purple-100 text-purple-800';
      case 'text': return 'bg-green-100 text-green-800';
      case 'mixed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormationTypeLabel = (type: string) => {
    switch (type) {
      case 'videos': return 'Vidéos';
      case 'pdf': return 'PDF';
      case 'link': return 'Lien externe';
      case 'text': return 'Texte/Article';
      case 'mixed': return 'Mixte';
      default: return type;
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
            >
              <div className="p-6">
                {/* Cover Image */}
                {formation.coverImage ? (
                  <div className="mb-4">
                    <img 
                      src={formation.coverImage} 
                      alt={formation.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="mb-4 w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">📚</span>
                  </div>
                )}

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

                {/* Level and Type */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(formation.level)}`}>
                    {getLevelLabel(formation.level)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFormationTypeColor(formation.formationType)}`}>
                    {getFormationTypeLabel(formation.formationType)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ⏱️ {formation.duration}h
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(formation);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Modifier
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
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-900">Ajouter une formation</h4>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-dark"
                    placeholder="Titre de la formation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-dark"
                    placeholder="99.99"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-dark"
                  placeholder="Description détaillée de la formation"
                />
              </div>

              {/* Image de couverture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image de couverture</label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">📷</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                      id="coverImage"
                    />
                    <label
                      htmlFor="coverImage"
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Choisir une image
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                  </div>
                </div>
              </div>

              {/* Type, niveau et durée */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de formation *</label>
                  <select
                    value={formData.formationType}
                    onChange={(e) => setFormData({...formData, formationType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-dark"
                  >
                    <option value="videos">Vidéos</option>
                    <option value="pdf">PDF</option>
                    <option value="link">Lien externe</option>
                    <option value="text">Texte/Article</option>
                    <option value="mixed">Mixte</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niveau *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-dark"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée estimée (heures) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-dark"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Modules */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Modules</label>
                  <button
                    type="button"
                    onClick={addModule}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    + Ajouter un module
                  </button>
                </div>
                
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900">Module {index + 1}</h5>
                        {modules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeModule(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titre du module *</label>
                          <input
                            type="text"
                            required
                            value={module.title}
                            onChange={(e) => updateModule(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-dark"
                            placeholder="Titre du module"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                          <select
                            value={module.type}
                            onChange={(e) => updateModule(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-dark"
                          >
                            <option value="video">Vidéo (YouTube/Vimeo)</option>
                            <option value="pdf">PDF</option>
                            <option value="link">Lien externe</option>
                            <option value="text">Texte</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
                          <input
                            type="text"
                            required
                            value={module.content}
                            onChange={(e) => updateModule(index, 'content', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 form-input-dark"
                            placeholder={
                              module.type === 'video' ? 'URL YouTube/Vimeo' :
                              module.type === 'pdf' ? 'URL du PDF' :
                              module.type === 'link' ? 'URL (WhatsApp/Telegram/Discord/Notion)' :
                              'Texte de l\'article'
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center mb-6">
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
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700"
                >
                  Créer la formation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
