"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FormationModule, ContentType, ContentItem } from "@/lib/formation-types";

export default function FormationContent({ formationId }: { formationId: string }) {
  const [modules, setModules] = useState<FormationModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFormationModules();
  }, [formationId]);

  const loadFormationModules = async () => {
    try {
      const supabase = createClient();
      
      // Récupérer les modules de la formation depuis Supabase
      const { data, error } = await supabase
        .from('formation_modules')
        .select('*')
        .eq('formation_id', formationId)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error loading formation modules:', error);
      } else {
        setModules(data || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading formation modules:', error);
      setLoading(false);
    }
  };

  const renderContentItem = (item: ContentItem) => {
    switch (item.type) {
      case 'video':
        return (
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-white/[0.06] bg-black">
            {item.url ? (
              <iframe
                title={item.title}
                src={item.url}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-white text-center">Vidéo à configurer</p>
              </div>
            )}
          </div>
        );
      
      case 'pdf':
        return (
          <div className="mt-4">
            {item.fileUrl ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-blue-600 text-2xl mr-3">📄</div>
                  <div>
                    <h4 className="font-medium text-blue-900">{item.title}</h4>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Télécharger le PDF
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-500">PDF à configurer</p>
              </div>
            )}
          </div>
        );
      
      case 'link':
        return (
          <div className="mt-4">
            {item.url ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-green-600 text-2xl mr-3">🔗</div>
                  <div>
                    <h4 className="font-medium text-green-900">{item.title}</h4>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 underline text-sm"
                    >
                      Accéder au lien
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-500">Lien à configurer</p>
              </div>
            )}
          </div>
        );
      
      case 'text':
        return (
          <div className="mt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="text-yellow-600 text-2xl mr-3">📝</div>
                <h4 className="font-medium text-yellow-900">{item.title}</h4>
              </div>
              <div className="prose prose-sm text-gray-700">
                {item.content ? (
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                ) : (
                  <p className="text-gray-500">Contenu à configurer</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="mt-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="text-purple-600 text-2xl mr-3">📋</div>
                <h4 className="font-medium text-purple-900">{item.title}</h4>
              </div>
              <div className="prose prose-sm text-gray-700">
                {item.content ? (
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                ) : (
                  <p className="text-gray-500">Quiz à configurer</p>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="mt-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-500">Type de contenu non supporté</p>
            </div>
          </div>
        );
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
    <div className="space-y-8">
      {modules.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-500 text-lg">Aucun module disponible pour cette formation</p>
        </div>
      ) : (
        modules.map((module) => (
          <section key={module.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-white mb-6">{module.title}</h2>
            
            {module.content.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Ce module ne contient pas encore de contenu</p>
              </div>
            ) : (
              <ul className="space-y-8">
                {module.content.map((item) => (
                  <li key={item.id} className="scroll-mt-28">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.06] pb-3">
                      <h3 className="font-medium text-neutral-200">{item.title}</h3>
                      <span className="text-xs tabular-nums text-neutral-500">
                        {item.durationMinutes ? `${item.durationMinutes} min` : ''}
                      </span>
                    </div>
                    
                    {renderContentItem(item)}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))
      )}
    </div>
  );
}
