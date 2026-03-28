"use client";

import { useState, useEffect } from "react";

interface Formation {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  category: string;
  studentsCount: number;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

export default function FormationsModule() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    level: "",
    category: ""
  });

  useEffect(() => {
    // Simuler des données - en production, ça viendrait de Supabase
    const loadFormations = async () => {
      try {
        const mockFormations: Formation[] = [
          {
            id: "1",
            title: "Social Ads Mastery",
            description: "Maîtrise complète des publicités sur réseaux sociaux",
            price: 497,
            duration: "8 semaines",
            level: "Débutant à avancé",
            category: "Marketing Digital",
            studentsCount: 156,
            status: "active",
            createdAt: "2024-01-15"
          },
          {
            id: "2",
            title: "Funnel Premium",
            description: "Création et optimisation de tunnels de vente",
            price: 997,
            duration: "12 semaines",
            level: "Intermédiaire",
            category: "Marketing Digital",
            studentsCount: 89,
            status: "active",
            createdAt: "2024-02-01"
          },
          {
            id: "3",
            title: "Copy Closing",
            description: "Techniques de copywriting pour convertir",
            price: 397,
            duration: "6 semaines",
            level: "Débutant",
            category: "Marketing Digital",
            studentsCount: 234,
            status: "active",
            createdAt: "2024-01-20"
          }
        ];

        setFormations(mockFormations);
        setLoading(false);
      } catch (error) {
        console.error('Error loading formations:', error);
        setLoading(false);
      }
    };

    loadFormations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFormation) {
        // Logique de modification
        console.log('Updating formation:', editingFormation.id, formData);
        // En production: await supabase.from('formations').update(formData).eq('id', editingFormation.id);
        setFormations(formations.map(f => 
          f.id === editingFormation.id 
            ? { ...f, title: formData.title, description: formData.description, price: parseFloat(formData.price), duration: formData.duration, level: formData.level, category: formData.category }
            : f
        ));
        setEditingFormation(null);
      } else {
        // Logique d'ajout
        console.log('Adding formation:', formData);
        // En production: await supabase.from('formations').insert(formData);
        const newFormation: Formation = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: formData.duration,
          level: formData.level,
          category: formData.category,
          studentsCount: 0,
          status: 'draft',
          createdAt: new Date().toISOString()
        };
        setFormations([...formations, newFormation]);
      }
      
      setFormData({ title: "", description: "", price: "", duration: "", level: "", category: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving formation:', error);
    }
  };

  const handleEdit = (formation: Formation) => {
    setEditingFormation(formation);
    setFormData({
      title: formation.title,
      description: formation.description,
      price: formation.price.toString(),
      duration: formation.duration,
      level: formation.level,
      category: formation.category
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        console.log('Deleting formation:', id);
        // En production: await supabase.from('formations').delete().eq('id', id);
        setFormations(formations.filter(f => f.id !== id));
      } catch (error) {
        console.error('Error deleting formation:', error);
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      console.log('Toggling formation status:', id, newStatus);
      // En production: await supabase.from('formations').update({ status: newStatus }).eq('id', id);
      setFormations(formations.map(f => 
        f.id === id ? { ...f, status: newStatus } : f
      ));
    } catch (error) {
      console.error('Error toggling formation status:', error);
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">📚 Gestion des Formations</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Ajouter une formation
        </button>
      </div>

      {/* Formations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formations.map((formation) => (
                <tr key={formation.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{formation.title}</div>
                    <div className="text-sm text-gray-600">{formation.category}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{formation.price}€</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formation.duration}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formation.level}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formation.studentsCount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      formation.status === 'active' ? 'bg-green-100 text-green-800' :
                      formation.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {formation.status === 'active' ? 'Active' : formation.status === 'inactive' ? 'Inactive' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(formation)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleStatusToggle(formation.id, formation.status)}
                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                      >
                        {formation.status === 'active' ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        onClick={() => handleDelete(formation.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingFormation ? 'Modifier la formation' : 'Ajouter une formation'}
              </h4>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingFormation(null);
                  setFormData({ title: "", description: "", price: "", duration: "", level: "", category: "" });
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
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="ex: 8 semaines"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="ex: Marketing Digital"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  {editingFormation ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
