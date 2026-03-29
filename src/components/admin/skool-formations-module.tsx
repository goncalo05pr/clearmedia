"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Formation, Chapter, Module, ContentItem, FormationProgress } from "@/lib/skool-types";

interface ChapterFormData {
  title: string;
  description: string;
}

interface ModuleFormData {
  title: string;
  description: string;
  contentItems: ContentItem[];
}

interface ExtendedFormation extends Formation {
  chapters: Chapter[];
}

export default function SkoolFormationsModule() {
  const [formations, setFormations] = useState<ExtendedFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<ExtendedFormation | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  // Formation form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    isActive: true,
    coverImage: "",
    level: "beginner" as Formation['level'],
    duration: 0,
    formationType: "mixed" as Formation['formationType']
  });

  // Structure form data
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: `chapter-${Date.now()}`,
      title: "",
      description: "",
      modules: [],
      order: 0
    }
  ]);

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    try {
      const supabase = createClient();
      
      // Récupérer les formations avec leurs chapitres et modules
      const { data: formationsData, error: formationsError } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false });

      if (formationsError) {
        console.error('Error loading formations:', formationsError);
      } else {
        const extendedFormations: ExtendedFormation[] = [];
        
        for (const formation of formationsData || []) {
          // Récupérer les chapitres
          const { data: chaptersData, error: chaptersError } = await supabase
            .from('formation_chapters')
            .select('*')
            .eq('formation_id', formation.id)
            .order('order_index', { ascending: true });

          if (chaptersError) {
            console.error('Error loading chapters:', chaptersError);
            continue;
          }

          const chaptersWithModules: Chapter[] = [];
          
          for (const chapter of chaptersData || []) {
            // Récupérer les modules du chapitre
            const { data: modulesData, error: modulesError } = await supabase
              .from('formation_modules')
              .select('*')
              .eq('chapter_id', chapter.id)
              .order('order_index', { ascending: true });

            if (modulesError) {
              console.error('Error loading modules:', modulesError);
              continue;
            }

            const modulesWithContent: Module[] = [];
            
            for (const module of modulesData || []) {
              // Récupérer les items de contenu du module
              const { data: contentData, error: contentError } = await supabase
                .from('formation_content_items')
                .select('*')
                .eq('module_id', module.id)
                .order('order_index', { ascending: true });

              if (contentError) {
                console.error('Error loading content items:', contentError);
                continue;
              }

              const contentItems: ContentItem[] = (contentData || []).map((item: any) => ({
                id: item.id,
                type: item.content_type,
                title: item.title,
                content: item.content,
                duration: item.duration,
                order: item.order_index
              }));

              modulesWithContent.push({
                id: module.id,
                title: module.title,
                description: module.description,
                contentItems,
                order: module.order_index
              });
            }

            chaptersWithModules.push({
              id: chapter.id,
              title: chapter.title,
              description: chapter.description,
              modules: modulesWithContent,
              order: chapter.order_index
            });
          }

          extendedFormations.push({
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
            chapters: chaptersWithModules
          });
        }

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

  const addChapter = () => {
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title: "",
      description: "",
      modules: [],
      order: chapters.length
    };
    setChapters([...chapters, newChapter]);
  };

  const removeChapter = (index: number) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    // Reorder remaining chapters
    const reorderedChapters = updatedChapters.map((chapter, i) => ({
      ...chapter,
      order: i
    }));
    setChapters(reorderedChapters);
  };

  const updateChapter = (index: number, field: keyof Chapter, value: any) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = { ...updatedChapters[index], [field]: value };
    setChapters(updatedChapters);
  };

  const addModule = (chapterIndex: number) => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: "",
      description: "",
      contentItems: [
        {
          id: `content-${Date.now()}`,
          type: 'video',
          title: '',
          content: '',
          order: 0
        }
      ],
      order: chapters[chapterIndex].modules.length
    };
    
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].modules.push(newModule);
    setChapters(updatedChapters);
  };

  const removeModule = (chapterIndex: number, moduleIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].modules = updatedChapters[chapterIndex].modules.filter((_, i) => i !== moduleIndex);
    // Reorder remaining modules
    updatedChapters[chapterIndex].modules = updatedChapters[chapterIndex].modules.map((module, i) => ({
      ...module,
      order: i
    }));
    setChapters(updatedChapters);
  };

  const updateModule = (chapterIndex: number, moduleIndex: number, field: keyof Module, value: any) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].modules[moduleIndex] = { 
      ...updatedChapters[chapterIndex].modules[moduleIndex], 
      [field]: value 
    };
    setChapters(updatedChapters);
  };

  const addContentItem = (chapterIndex: number, moduleIndex: number) => {
    const newContentItem: ContentItem = {
      id: `content-${Date.now()}`,
      type: 'video',
      title: '',
      content: '',
      order: chapters[chapterIndex].modules[moduleIndex].contentItems.length
    };
    
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].modules[moduleIndex].contentItems.push(newContentItem);
    setChapters(updatedChapters);
  };

  const removeContentItem = (chapterIndex: number, moduleIndex: number, contentIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].modules[moduleIndex].contentItems = updatedChapters[chapterIndex].modules[moduleIndex].contentItems.filter((_, i) => i !== contentIndex);
    // Reorder remaining content items
    updatedChapters[chapterIndex].modules[moduleIndex].contentItems = updatedChapters[chapterIndex].modules[moduleIndex].contentItems.map((item, i) => ({
      ...item,
      order: i
    }));
    setChapters(updatedChapters);
  };

  const updateContentItem = (chapterIndex: number, moduleIndex: number, contentIndex: number, field: keyof ContentItem, value: any) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].modules[moduleIndex].contentItems[contentIndex] = { 
      ...updatedChapters[chapterIndex].modules[moduleIndex].contentItems[contentIndex], 
      [field]: value 
    };
    setChapters(updatedChapters);
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

      // Créer les chapitres, modules et contenus
      for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
        const chapter = chapters[chapterIndex];
        
        if (!chapter.title) continue; // Skip empty chapters
        
        // Créer le chapitre
        const { data: chapterData, error: chapterError } = await supabase
          .from('formation_chapters')
          .insert({
            formation_id: formationData.id,
            title: chapter.title,
            description: chapter.description,
            order_index: chapterIndex,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (chapterError) {
          console.error('Error creating chapter:', chapterError);
          continue;
        }

        // Créer les modules du chapitre
        for (let moduleIndex = 0; moduleIndex < chapter.modules.length; moduleIndex++) {
          const module = chapter.modules[moduleIndex];
          
          if (!module.title) continue; // Skip empty modules
          
          // Créer le module
          const { data: moduleData, error: moduleError } = await supabase
            .from('formation_modules')
            .insert({
              chapter_id: chapterData.id,
              title: module.title,
              description: module.description,
              order_index: moduleIndex,
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (moduleError) {
            console.error('Error creating module:', moduleError);
            continue;
          }

          // Créer les items de contenu du module
          for (let contentIndex = 0; contentIndex < module.contentItems.length; contentIndex++) {
            const contentItem = module.contentItems[contentIndex];
            
            if (!contentItem.title || !contentItem.content) continue; // Skip empty content items
            
            await supabase
              .from('formation_content_items')
              .insert({
                module_id: moduleData.id,
                content_type: contentItem.type,
                title: contentItem.title,
                content: contentItem.content,
                duration: contentItem.duration,
                order_index: contentIndex,
                created_at: new Date().toISOString()
              });
          }
        }
      }

      console.log('Formation with structure created successfully');
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
    setChapters([{
      id: `chapter-${Date.now()}`,
      title: "",
      description: "",
      modules: [],
      order: 0
    }]);
    setCoverImageFile(null);
    setPreviewUrl("");
  };

  const handleStructureModal = (formation: ExtendedFormation) => {
    setSelectedFormation(formation);
    setChapters(formation.chapters.length > 0 ? formation.chapters : [{
      id: `chapter-${Date.now()}`,
      title: "",
      description: "",
      modules: [],
      order: 0
    }]);
    setShowStructureModal(true);
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

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'link': return '🔗';
      case 'text': return '📝';
      default: return '📚';
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
      <h3 className="text-xl font-semibold text-white mb-4">📚 Formations (Style Skool)</h3>
      
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
                
                {/* Formation structure summary */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    📖 {formation.chapters.length} chapitre{formation.chapters.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-600">
                    📝 {formation.chapters.reduce((total, chapter) => total + chapter.modules.length, 0)} module{formation.chapters.reduce((total, chapter) => total + chapter.modules.length, 0) !== 1 ? 's' : ''}
                  </div>
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
                  <span className="text-xs text-gray-500">
                    ⏱️ {formation.duration}h
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStructureModal(formation);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    📚 Structure
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // handleEdit(formation);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // handleToggleStatus(formation.id, formation.isActive);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {formation.isActive ? '⏸️' : '▶️'}
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
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-900">Ajouter une formation (Style Skool)</h4>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Structure: Chapitres et Modules */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Structure de la formation</label>
                  <button
                    type="button"
                    onClick={addChapter}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    + Ajouter un chapitre
                  </button>
                </div>
                
                <div className="space-y-6">
                  {chapters.map((chapter, chapterIndex) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900">Chapitre {chapterIndex + 1}</h5>
                        {chapters.length > 1 && (
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
                            required
                            value={chapter.title}
                            onChange={(e) => updateChapter(chapterIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Titre du chapitre"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={chapter.description || ''}
                            onChange={(e) => updateChapter(chapterIndex, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description du chapitre"
                          />
                        </div>
                      </div>

                      {/* Modules du chapitre */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Modules du chapitre</label>
                          <button
                            type="button"
                            onClick={() => addModule(chapterIndex)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium"
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
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Titre du module *</label>
                                  <input
                                    type="text"
                                    required
                                    value={module.title}
                                    onChange={(e) => updateModule(chapterIndex, moduleIndex, 'title', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    placeholder="Titre du module"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                  <input
                                    type="text"
                                    value={module.description || ''}
                                    onChange={(e) => updateModule(chapterIndex, moduleIndex, 'description', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    placeholder="Description du module"
                                  />
                                </div>
                              </div>

                              {/* Contenu du module */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-xs font-medium text-gray-600">Contenu du module</label>
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
                                        <span className="text-xs font-medium text-gray-600">
                                          {getContentTypeIcon(contentItem.type)} Contenu {contentIndex + 1}
                                        </span>
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
                                            required
                                            value={contentItem.title}
                                            onChange={(e) => updateContentItem(chapterIndex, moduleIndex, contentIndex, 'title', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                            placeholder="Titre du contenu"
                                          />
                                        </div>
                                        
                                        <div>
                                          <label className="block text-xs font-medium text-gray-500 mb-1">Contenu *</label>
                                          <input
                                            type="text"
                                            required
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
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-semibold text-gray-900">
                      📖 Chapitre {chapterIndex + 1}: {chapter.title}
                    </h5>
                    <span className="text-sm text-gray-500">
                      {chapter.modules.length} module{chapter.modules.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {chapter.description && (
                    <p className="text-sm text-gray-600 mb-4">{chapter.description}</p>
                  )}
                  
                  <div className="space-y-3">
                    {chapter.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border border-gray-100 rounded p-3 ml-4">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="font-medium text-gray-800">
                            📝 Module {moduleIndex + 1}: {module.title}
                          </h6>
                          <span className="text-xs text-gray-500">
                            {module.contentItems.length} contenu{module.contentItems.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {module.description && (
                          <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                        )}
                        
                        <div className="space-y-1">
                          {module.contentItems.map((contentItem, contentIndex) => (
                            <div key={contentItem.id} className="flex items-center space-x-2 text-sm text-gray-600 ml-4">
                              <span>{getContentTypeIcon(contentItem.type)}</span>
                              <span>{contentItem.title}</span>
                              <span className="text-xs text-gray-400">
                                ({contentItem.type === 'video' ? 'Vidéo' : 
                                  contentItem.type === 'pdf' ? 'PDF' : 
                                  contentItem.type === 'link' ? 'Lien' : 'Texte'})
                              </span>
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
