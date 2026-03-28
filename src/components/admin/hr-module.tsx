"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
  department: string;
  status: 'active' | 'inactive';
  hiredAt: string;
  lastLogin?: string;
}

export default function HRModule() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer" as 'admin' | 'manager' | 'editor' | 'viewer',
    department: ""
  });

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = async () => {
    try {
      const supabase = createClient();
      
      // Récupérer les collaborateurs depuis Supabase
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .order('hired_at', { ascending: false });

      if (error) {
        console.error('Error loading collaborators:', error);
      } else {
        setCollaborators(data || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading collaborators:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      if (editingCollaborator) {
        // Modifier un collaborateur existant
        const { error } = await supabase
          .from('collaborators')
          .update({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            department: formData.department,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCollaborator.id);
          
        if (error) {
          console.error('Error updating collaborator:', error);
        } else {
          console.log('Collaborator updated successfully');
          await loadCollaborators();
          setShowAddModal(false);
          setEditingCollaborator(null);
        }
      } else {
        // Ajouter un nouveau collaborateur
        const { error } = await supabase
          .from('collaborators')
          .insert({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            department: formData.department,
            status: 'active',
            hired_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error adding collaborator:', error);
        } else {
          console.log('Collaborator added successfully');
          await loadCollaborators();
          setShowAddModal(false);
        }
      }
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "viewer",
        department: ""
      });
    } catch (error) {
      console.error('Error saving collaborator:', error);
    }
  };

  const handleEdit = (collaborator: Collaborator) => {
    setEditingCollaborator(collaborator);
    setFormData({
      name: collaborator.name,
      email: collaborator.email,
      role: collaborator.role,
      department: collaborator.department
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('collaborators')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Error deleting collaborator:', error);
        } else {
          console.log('Collaborator deleted successfully');
          await loadCollaborators();
        }
      } catch (error) {
        console.error('Error deleting collaborator:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const supabase = createClient();
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('collaborators')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error toggling collaborator status:', error);
      } else {
        console.log('Collaborator status updated successfully');
        await loadCollaborators();
      }
    } catch (error) {
      console.error('Error toggling collaborator status:', error);
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
      <h3 className="text-xl font-semibold text-white mb-4">👥 Ressources Humaines</h3>
      
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Ajouter un collaborateur
        </button>
      </div>

      {/* Collaborators Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {collaborators.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-500 text-lg">Aucune donnée pour l'instant</p>
            <p className="text-gray-400 text-sm mt-2">Commencez par ajouter votre premier collaborateur</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {collaborators.map((collaborator) => (
                  <tr key={collaborator.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{collaborator.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{collaborator.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        collaborator.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        collaborator.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        collaborator.role === 'editor' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {collaborator.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{collaborator.department}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        collaborator.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {collaborator.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(collaborator)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleToggleStatus(collaborator.id, collaborator.status)}
                          className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                        >
                          {collaborator.status === 'active' ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => handleDelete(collaborator.id)}
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
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingCollaborator ? 'Modifier le collaborateur' : 'Ajouter un collaborateur'}
              </h4>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCollaborator(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCollaborator(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700"
                >
                  {editingCollaborator ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
