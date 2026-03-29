"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormationContent } from "@/lib/cms-types";

export default function CMSFormationsModule() {
  const [formations, setFormations] = useState<FormationContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFormation, setEditingFormation] = useState<FormationContent | null>(null);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<FormationContent | null>(null);

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    try {
      const supabase = createClient();
      
      // Load formations from Supabase
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading formations:', error);
      } else {
        const formationsContent: FormationContent[] = (data || []).map((formation: any) => ({
          id: formation.id,
          title: formation.title,
          description: formation.description,
          price: formation.price,
          coverImage: formation.cover_image_url,
          level: formation.level || 'beginner',
          duration: formation.duration || 0,
          formationType: formation.formation_type || 'mixed',
          isActive: formation.is_active,
          chapters: formation.chapters || [],
          createdAt: formation.created_at,
          updatedAt: formation.updated_at
        }));

        setFormations(formationsContent);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading formations:', error);
      setLoading(false);
    }
  };

  const saveFormation = async (formation: FormationContent) => {
    setSaving(true);
    try {
      const supabase = createClient();
      
      const formationData = {
        title: formation.title,
        description: formation.description,
        price: formation.price,
        cover_image_url: formation.coverImage,
        level: formation.level,
        duration: formation.duration,
        formation_type: formation.formationType,
        is_active: formation.isActive,
        chapters: formation.chapters,
        updated_at: new Date().toISOString()
      };

      if (editingFormation) {
        // Update existing formation
        const { error } = await supabase
          .from('formations')
          .update(formationData)
          .eq('id', formation.id);

        if (error) {
          console.error('Error updating formation:', error);
          alert('Erreur lors de la mise à jour');
        } else {
          alert('Formation mise à jour avec succès !');
        }
      } else {
        // Create new formation
        const { error } = await supabase
          .from('formations')
          .insert({
            ...formationData,
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error creating formation:', error);
          alert('Erreur lors de la création');
        } else {
          alert('Formation créée avec succès !');
        }
      }

      await loadFormations();
      setShowAddModal(false);
      setEditingFormation(null);
    } catch (error) {
      console.error('Error saving formation:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const deleteFormation = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('formations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting formation:', error);
        alert('Erreur lors de la suppression');
      } else {
        alert('Formation supprimée avec succès !');
        await loadFormations();
      }
    } catch (error) {
      console.error('Error deleting formation:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleFormationStatus = async (id: string, currentStatus: boolean) => {
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
        await loadFormations();
      }
    } catch (error) {
      console.error('Error toggling formation status:', error);
    }
  };

  const openAddModal = () => {
    setEditingFormation({
      id: '',
      title: '',
      description: '',
      price: 0,
      level: 'beginner',
      duration: 0,
      formationType: 'mixed',
      isActive: true,
      chapters: [],
      createdAt: '',
      updatedAt: ''
    });
    setShowAddModal(true);
  };

  const openEditModal = (formation: FormationContent) => {
    setEditingFormation(formation);
    setShowAddModal(true);
  };

  const openStructureModal = (formation: FormationContent) => {
    setSelectedFormation(formation);
    setShowStructureModal(true);
  };

  const addChapter = () => {
    if (!editingFormation) return;

    const newChapter = {
      id: `chapter-${Date.now()}`,
      title: '',
      description: '',
      modules: []
    };

    setEditingFormation({
      ...editingFormation,
      chapters: [...editingFormation.chapters, newChapter]
    });
  };

  const removeChapter = (index: number) => {
    if (!editingFormation) return;

    const updatedChapters = editingFormation.chapters.filter((_, i) => i !== index);
    setEditingFormation({
      ...editingFormation,
      chapters: updatedChapters
    });
  };

  const updateChapter = (index: number, field: string, value: any) => {
    if (!editingFormation) return;

    const updatedChapters = [...editingFormation.chapters];
    updatedChapters[index] = { ...updatedChapters[index], [field]: value };
    setEditingFormation({
      ...editingFormation,
      chapters: updatedChapters
    });
  };

  const addModule = (chapterIndex: number) => {
    if (!editingFormation) return;

    const newModule = {
      id: `module-${Date.now()}`,
      title: '',
      description: '',
      contentItems: []
    };

    const updatedChapters = [...editingFormation.chapters];
    updatedChapters[chapterIndex].modules.push(newModule);
    setEditingFormation({
      ...editingFormation,
      chapters: updatedChapters
    });
  };

  const removeModule = (chapterIndex: number, moduleIndex: number) => {
    if (!editingFormation) return;

    const updatedChapters = [...editingFormation.chapters];
    updatedChapters[chapterIndex].modules = updatedChapters[chapterIndex].modules.filter((_, i) => i !== moduleIndex);
    setEditingFormation({
      ...editingFormation,
      chapters: updatedChapters
    });
  };

  const updateModule = (chapterIndex: number, moduleIndex: number, field: string, value: any) => {
    if (!editingFormation) return;

    const updatedChapters = [...editingFormation.chapters];
    updatedChapters[chapterIndex].modules[moduleIndex] = { 
      ...updatedChapters[chapterIndex].modules[moduleIndex], 
      [field]: value 
    };
    setEditingFormation({
      ...editingFormation,
      chapters: updatedChapters
    });
  };

  const addContentItem = (chapterIndex: number, moduleIndex: number) => {
    if (!editingFormation) return;

    const newContentItem = {
      id: `content-${Date.now()}`,
      type: 'video' as const,
      title: '',
      content: ''
    };

    const updatedChapters = [...editingFormation.chapters];
    updatedChapters[chapterIndex].modules[moduleIndex].contentItems.push(newContentItem);
    setEditingFormation({
      ...editingFormation,
      chapters: updatedChapters
    });
  };

  const removeContentItem = (chapterIndex: number, moduleIndex: number, contentIndex: number) => {
    if (!editingFormation) return;

    const updatedChapters = [...editingFormation.chapters];
    updatedChapters[chapterIndex].modules[moduleIndex].contentItems = updatedChapters[chapterIndex].modules[moduleIndex].contentItems.filter((_, i) => i !== contentIndex);
    setEditingFormation({
      ...editingFormation,
      chapters: updatedChapters
    });
  };

  const updateContentItem = (chapterIndex: number, moduleIndex: number, contentIndex: number, field: string, value: any) => {
    if (!editingFormation) return;

    const updatedChapters = [...editingFormation.chapters];
    updatedChapters[chapterIndex].modules[moduleIndex].contentItems[contentIndex] = { 
      ...updatedChapters[chapterIndex].modules[moduleIndex].contentItems[contentIndex], 
      [field]: value 
    };
    setEditingFormation({
      ...editingFormation,
      chapters: updatedChapters
    });
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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">📚 CMS - Formations</h3>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Ajouter une formation
        </button>
      </div>

      {/* Formations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formations.map((formation) => (
          <div key={formation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{formation.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{formation.description}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${formation.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-blue-600">{formation.price.toLocaleString()}€</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                formation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {formation.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xs text-gray-500">{formation.chapters.length} chapitres</span>
              <span className="text-xs text-gray-500">⏱️ {formation.duration}h</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                formation.level === 'beginner' ? 'bg-green-100 text-green-800' :
                formation.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {formation.level}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => openStructureModal(formation)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                📚 Structure
              </button>
              <button
                onClick={() => openEditModal(formation)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                ✏️
              </button>
              <button
                onClick={() => toggleFormationStatus(formation.id, formation.isActive)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {formation.isActive ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={() => deleteFormation(formation.id)}
                className="px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Formation Modal */}
      {showAddModal && editingFormation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-900">
                {editingFormation.id ? 'Modifier la formation' : 'Ajouter une formation'}
              </h4>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingFormation(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                  <input
                    type="text"
                    value={editingFormation.title}
                    onChange={(e) => setEditingFormation({...editingFormation, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€) *</label>
                  <input
                    type="number"
                    value={editingFormation.price}
                    onChange={(e) => setEditingFormation({...editingFormation, price: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={editingFormation.description}
                  onChange={(e) => setEditingFormation({...editingFormation, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niveau *</label>
                  <select
                    value={editingFormation.level}
                    onChange={(e) => setEditingFormation({...editingFormation, level: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée (heures) *</label>
                  <input
                    type="number"
                    value={editingFormation.duration}
                    onChange={(e) => setEditingFormation({...editingFormation, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={editingFormation.formationType}
                    onChange={(e) => setEditingFormation({...editingFormation, formationType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="videos">Vidéos</option>
                    <option value="pdf">PDF</option>
                    <option value="link">Lien externe</option>
                    <option value="text">Texte/Article</option>
                    <option value="mixed">Mixte</option>
                  </select>
                </div>
              </div>

              {/* Chapters Structure */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Structure des chapitres</label>
                  <button
                    type="button"
                    onClick={addChapter}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    + Ajouter un chapitre
                  </button>
                </div>

                <div className="space-y-6">
                  {editingFormation.chapters.map((chapter, chapterIndex) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900">Chapitre {chapterIndex + 1}</h5>
                        {editingFormation.chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChapter(chapterIndex)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titre du chapitre *</label>
                          <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => updateChapter(chapterIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={chapter.description}
                            onChange={(e) => updateChapter(chapterIndex, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Modules */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Modules</label>
                          <button
                            type="button"
                            onClick={() => addModule(chapterIndex)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                          >
                            + Module
                          </button>
                        </div>

                        <div className="space-y-3">
                          {chapter.modules.map((module, moduleIndex) => (
                            <div key={module.id} className="border border-gray-100 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Module {moduleIndex + 1}</span>
                                {chapter.modules.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeModule(chapterIndex, moduleIndex)}
                                    className="text-red-600 hover:text-red-800 text-xs"
                                  >
                                    Supprimer
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Titre *</label>
                                  <input
                                    type="text"
                                    value={module.title}
                                    onChange={(e) => updateModule(chapterIndex, moduleIndex, 'title', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                  <input
                                    type="text"
                                    value={module.description}
                                    onChange={(e) => updateModule(chapterIndex, moduleIndex, 'description', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                  />
                                </div>
                              </div>

                              {/* Content Items */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-xs font-medium text-gray-600">Contenu</label>
                                  <button
                                    type="button"
                                    onClick={() => addContentItem(chapterIndex, moduleIndex)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs"
                                  >
                                    + Contenu
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {module.contentItems.map((contentItem, contentIndex) => (
                                    <div key={contentItem.id} className="border border-gray-50 rounded p-2">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-600">Contenu {contentIndex + 1}</span>
                                        {module.contentItems.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => removeContentItem(chapterIndex, moduleIndex, contentIndex)}
                                            className="text-red-600 hover:text-red-800 text-xs"
                                          >
                                            Supprimer
                                          </button>
                                        )}
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                                          <select
                                            value={contentItem.type}
                                            onChange={(e) => updateContentItem(chapterIndex, moduleIndex, contentIndex, 'type', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                          >
                                            <option value="video">🎥 Vidéo</option>
                                            <option value="pdf">📄 PDF</option>
                                            <option value="link">🔗 Lien</option>
                                            <option value="text">📝 Texte</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-500 mb-1">Titre *</label>
                                          <input
                                            type="text"
                                            value={contentItem.title}
                                            onChange={(e) => updateContentItem(chapterIndex, moduleIndex, contentIndex, 'title', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-500 mb-1">Contenu *</label>
                                          <input
                                            type="text"
                                            value={contentItem.content}
                                            onChange={(e) => updateContentItem(chapterIndex, moduleIndex, contentIndex, 'content', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                            placeholder={
                                              contentItem.type === 'video' ? 'URL YouTube/Vimeo' :
                                              contentItem.type === 'pdf' ? 'URL Google Drive' :
                                              contentItem.type === 'link' ? 'URL externe' :
                                              'Texte de l\'article'
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingFormation.isActive}
                  onChange={(e) => setEditingFormation({...editingFormation, isActive: e.target.checked})}
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
                    setEditingFormation(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => saveFormation(editingFormation)}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Structure Modal */}
      {showStructureModal && selectedFormation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-900">
                Structure: {selectedFormation.title}
              </h4>
              <button 
                onClick={() => {
                  setShowStructureModal(false);
                  setSelectedFormation(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {selectedFormation.chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">
                    📖 Chapitre {chapterIndex + 1}: {chapter.title}
                  </h5>
                  {chapter.description && (
                    <p className="text-sm text-gray-600 mb-4">{chapter.description}</p>
                  )}
                  
                  <div className="space-y-3 ml-4">
                    {chapter.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border-l-2 border-gray-200 pl-4">
                        <h6 className="font-medium text-gray-800 mb-2">
                          📝 Module {moduleIndex + 1}: {module.title}
                        </h6>
                        {module.description && (
                          <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                        )}
                        
                        <div className="space-y-1 ml-4">
                          {module.contentItems.map((contentItem, contentIndex) => (
                            <div key={contentItem.id} className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>
                                {contentItem.type === 'video' ? '🎥' :
                                 contentItem.type === 'pdf' ? '📄' :
                                 contentItem.type === 'link' ? '🔗' :
                                 '📝'}
                              </span>
                              <span>{contentItem.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowStructureModal(false);
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
