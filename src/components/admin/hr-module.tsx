"use client";

import { useState, useEffect } from "react";

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
    // Simuler des données - en production, ça viendrait de Supabase
    const loadCollaborators = async () => {
      try {
        const mockCollaborators: Collaborator[] = [
          {
            id: "1",
            name: "Alice Martin",
            email: "alice.martin@kliqz.com",
            role: "admin",
            department: "Direction",
            status: "active",
            hiredAt: "2023-01-15",
            lastLogin: "2024-03-15T09:30:00Z"
          },
          {
            id: "2",
            name: "Bernard Dubois",
            email: "bernard.dubois@kliqz.com",
            role: "manager",
            department: "Marketing",
            status: "active",
            hiredAt: "2023-03-20",
            lastLogin: "2024-03-14T14:22:00Z"
          },
          {
            id: "3",
            name: "Claire Petit",
            email: "claire.petit@kliqz.com",
            role: "editor",
            department: "Contenu",
            status: "active",
            hiredAt: "2023-06-10",
            lastLogin: "2024-03-13T16:45:00Z"
          },
          {
            id: "4",
            name: "David Bernard",
            email: "david.bernard@kliqz.com",
            role: "viewer",
            department: "Support",
            status: "inactive",
            hiredAt: "2023-09-05"
          }
        ];

        setCollaborators(mockCollaborators);
        setLoading(false);
      } catch (error) {
        console.error('Error loading collaborators:', error);
        setLoading(false);
      }
    };

    loadCollaborators();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCollaborator) {
        // Logique de modification
        console.log('Updating collaborator:', editingCollaborator.id, formData);
        // En production: await supabase.from('collaborators').update(formData).eq('id', editingCollaborator.id);
        setCollaborators(collaborators.map(c => 
          c.id === editingCollaborator.id 
            ? { ...c, name: formData.name, email: formData.email, role: formData.role, department: formData.department }
            : c
        ));
        setEditingCollaborator(null);
      } else {
        // Logique d'ajout
        console.log('Adding collaborator:', formData);
        // En production: await supabase.from('collaborators').insert(formData);
        const newCollaborator: Collaborator = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          status: 'active',
          hiredAt: new Date().toISOString()
        };
        setCollaborators([...collaborators, newCollaborator]);
      }
      
      setFormData({ name: "", email: "", role: "viewer" as 'admin' | 'manager' | 'editor' | 'viewer', department: "" });
      setShowAddModal(false);
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
        console.log('Deleting collaborator:', id);
        // En production: await supabase.from('collaborators').delete().eq('id', id);
        setCollaborators(collaborators.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting collaborator:', error);
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      console.log('Toggling collaborator status:', id, newStatus);
      // En production: await supabase.from('collaborators').update({ status: newStatus }).eq('id', id);
      setCollaborators(collaborators.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
    } catch (error) {
      console.error('Error toggling collaborator status:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'manager': return 'Manager';
      case 'editor': return 'Éditeur';
      case 'viewer': return 'Lecteur';
      default: return role;
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
        <h3 className="text-xl font-semibold text-white">👥 Ressources Humaines</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Ajouter un collaborateur
        </button>
      </div>

      {/* Collaborators Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {collaborators.map((collaborator) => (
                <tr key={collaborator.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{collaborator.name}</div>
                    <div className="text-sm text-gray-500">Embauché le {new Date(collaborator.hiredAt).toLocaleDateString('fr-FR')}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{collaborator.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{collaborator.department}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(collaborator.role)}`}>
                      {getRoleLabel(collaborator.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      collaborator.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {collaborator.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {collaborator.lastLogin 
                      ? new Date(collaborator.lastLogin).toLocaleDateString('fr-FR')
                      : 'Jamais'
                    }
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
                        onClick={() => handleStatusToggle(collaborator.id, collaborator.status)}
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
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingCollaborator ? 'Modifier le collaborateur' : 'Ajouter un collaborateur'}
              </h4>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCollaborator(null);
                  setFormData({ name: "", email: "", role: "viewer", department: "" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="ex: Marketing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'manager' | 'editor' | 'viewer'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="viewer">Lecteur</option>
                    <option value="editor">Éditeur</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
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
