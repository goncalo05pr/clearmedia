"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Formation, Chapter, Module, ContentItem, FormationProgress } from "@/lib/skool-types";

export default function SkoolFormationContent({ formationId }: { formationId: string }) {
  const [formation, setFormation] = useState<Formation | null>(null);
  const [progress, setProgress] = useState<FormationProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFormationData();
  }, [formationId]);

  const loadFormationData = async () => {
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load formation with chapters, modules and content
      const { data: formationData, error: formationError } = await supabase
        .from('formations')
        .select('*')
        .eq('id', formationId)
        .single();

      if (formationError) {
        console.error('Error loading formation:', formationError);
        setLoading(false);
        return;
      }

      // Load chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('formation_chapters')
        .select('*')
        .eq('formation_id', formationId)
        .order('order_index', { ascending: true });

      if (chaptersError) {
        console.error('Error loading chapters:', chaptersError);
        setLoading(false);
        return;
      }

      const chaptersWithModules: Chapter[] = [];
      
      for (const chapter of chaptersData || []) {
        // Load modules for this chapter
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
          // Load content items for this module
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

      const fullFormation: Formation = {
        id: formationData.id,
        title: formationData.title,
        description: formationData.description,
        price: formationData.price,
        isActive: formationData.is_active,
        createdAt: formationData.created_at,
        updatedAt: formationData.updated_at,
        coverImage: formationData.cover_image_url,
        level: formationData.level || 'beginner',
        duration: formationData.duration || 0,
        formationType: formationData.formation_type || 'mixed',
        chapters: chaptersWithModules
      };

      setFormation(fullFormation);

      // Load user progress
      const { data: progressData, error: progressError } = await supabase
        .from('formation_progress')
        .select('*')
        .eq('formation_id', formationId)
        .eq('user_id', user.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error loading progress:', progressError);
      } else if (progressData) {
        setProgress(progressData);
        setCompletedItems(new Set(progressData.completed_content_items || []));
      } else {
        // Create initial progress
        const { data: newProgress } = await supabase
          .from('formation_progress')
          .insert({
            formation_id: formationId,
            user_id: user.id,
            completed_chapters: [],
            completed_modules: [],
            completed_content_items: [],
            progress_percentage: 0,
            started_at: new Date().toISOString(),
            last_accessed_at: new Date().toISOString()
          })
          .select()
          .single();

        if (newProgress) {
          setProgress(newProgress);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading formation data:', error);
      setLoading(false);
    }
  };

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const toggleContentItem = async (contentItemId: string) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !formation) return;

      const newCompletedItems = new Set(completedItems);
      let isCompleted = false;

      if (newCompletedItems.has(contentItemId)) {
        newCompletedItems.delete(contentItemId);
        isCompleted = false;
      } else {
        newCompletedItems.add(contentItemId);
        isCompleted = true;
      }

      setCompletedItems(newCompletedItems);

      // Calculate new progress
      const totalContentItems = formation.chapters.reduce((total, chapter) => 
        total + chapter.modules.reduce((moduleTotal, module) => 
          moduleTotal + module.contentItems.length, 0), 0);

      const progressPercentage = Math.round((newCompletedItems.size / totalContentItems) * 100);

      // Update progress in database
      await supabase
        .from('formation_progress')
        .update({
          completed_content_items: Array.from(newCompletedItems),
          progress_percentage: progressPercentage,
          last_accessed_at: new Date().toISOString(),
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null
        })
        .eq('formation_id', formationId)
        .eq('user_id', user.id);

      // Update local progress state
      if (progress) {
        setProgress({
          ...progress,
          completedContentItems: Array.from(newCompletedItems),
          progressPercentage
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const renderContentItem = (contentItem: ContentItem) => {
    const isCompleted = completedItems.has(contentItem.id);

    switch (contentItem.type) {
      case 'video':
        return (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
            <iframe
              src={contentItem.content}
              title={contentItem.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h4 className="font-semibold text-gray-900 mb-2">{contentItem.title}</h4>
            <a
              href={contentItem.content}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📂 Ouvrir le PDF
            </a>
          </div>
        );
      
      case 'link':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🔗</div>
            <h4 className="font-semibold text-gray-900 mb-2">{contentItem.title}</h4>
            <a
              href={contentItem.content}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🌐 Accéder au lien
            </a>
          </div>
        );
      
      case 'text':
        return (
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: contentItem.content }} />
          </div>
        );
      
      default:
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h4 className="font-semibold text-gray-900 mb-2">{contentItem.title}</h4>
            <p className="text-gray-600">Type de contenu non supporté</p>
          </div>
        );
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

  if (!formation) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📚</div>
        <p className="text-gray-500 text-lg">Formation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{formation.title}</h1>
          <div className="text-sm text-gray-500">
            {formation.chapters.length} chapitres
          </div>
        </div>
        
        {/* Progress Bar */}
        {progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression</span>
              <span className="text-sm font-medium text-gray-700">{progress.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <p className="text-gray-600">{formation.description}</p>
      </div>

      {/* Chapters */}
      <div className="space-y-6">
        {formation.chapters.map((chapter, chapterIndex) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const completedModulesInChapter = chapter.modules.reduce((count, module) => 
            count + module.contentItems.filter(item => completedItems.has(item.id)).length, 0);
          const totalItemsInChapter = chapter.modules.reduce((count, module) => 
            count + module.contentItems.length, 0);
          const chapterProgress = totalItemsInChapter > 0 ? Math.round((completedModulesInChapter / totalItemsInChapter) * 100) : 0;

          return (
            <div key={chapter.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Chapter Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                      {chapterIndex + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                      {chapter.description && (
                        <p className="text-sm text-gray-600">{chapter.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Chapter Progress */}
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${chapterProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{chapterProgress}%</span>
                    </div>
                    
                    {/* Expand/Collapse Icon */}
                    <div className="text-gray-400">
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modules and Content */}
              {isExpanded && (
                <div className="border-t border-gray-200">
                  {chapter.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="p-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-800">
                          {moduleIndex + 1}. {module.title}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {module.contentItems.filter(item => completedItems.has(item.id)).length}/{module.contentItems.length} complétés
                        </div>
                      </div>
                      
                      {module.description && (
                        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                      )}

                      {/* Content Items */}
                      <div className="space-y-4">
                        {module.contentItems.map((contentItem, contentIndex) => {
                          const isCompleted = completedItems.has(contentItem.id);
                          
                          return (
                            <div key={contentItem.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              {/* Content Item Header */}
                              <div
                                className={`p-3 cursor-pointer transition-colors ${
                                  isCompleted ? 'bg-green-50' : 'bg-gray-50'
                                } hover:bg-gray-100`}
                                onClick={() => toggleContentItem(contentItem.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                      isCompleted 
                                        ? 'bg-green-500 border-green-500' 
                                        : 'border-gray-300'
                                    }`}>
                                      {isCompleted && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                      {getContentTypeIcon(contentItem.type)} {contentItem.title}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    {contentItem.duration && (
                                      <span className="text-xs text-gray-500">
                                        {contentItem.duration}min
                                      </span>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      isCompleted 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {isCompleted ? 'Complété' : 'À faire'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Content Item Content */}
                              <div className="p-4 bg-white">
                                {renderContentItem(contentItem)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
