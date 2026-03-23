"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'client' | 'inactive';
  value: number;
  created_at: string;
  last_contact?: string;
  notes?: string;
}

interface Task {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  due_date: string;
  created_at: string;
}

export function CRMModule() {
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead' as 'lead' | 'prospect' | 'client' | 'inactive',
    value: 0,
    notes: ''
  });

  const [newTask, setNewTask] = useState({
    client_id: '',
    title: '',
    description: '',
    due_date: '',
    status: 'todo' as 'todo' | 'in_progress' | 'completed'
  });

  useEffect(() => {
    fetchCRMData();
  }, []);

  const fetchCRMData = async () => {
    try {
      const supabase = createClient();
      
      // Fetch clients
      const { data: clientsData } = await supabase.from("crm_clients").select("*");
      // Fetch tasks
      const { data: tasksData } = await supabase.from("crm_tasks").select("*");
      
      if (clientsData) setClients(clientsData);
      if (tasksData) setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching CRM data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("crm_clients").insert([newClient]).select();
      if (data) {
        setClients([...clients, data[0]]);
        setShowAddClient(false);
        setNewClient({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'lead',
          value: 0,
          notes: ''
        });
      }
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const addTask = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("crm_tasks").insert([newTask]).select();
      if (data) {
        setTasks([...tasks, data[0]]);
        setShowAddTask(false);
        setNewTask({
          client_id: '',
          title: '',
          description: '',
          due_date: '',
          status: 'todo'
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateClientStatus = async (clientId: string, status: Client['status']) => {
    try {
      const supabase = createClient();
      await supabase.from("crm_clients").update({ status }).eq("id", clientId);
      setClients(clients.map(c => c.id === clientId ? { ...c, status } : c));
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-500/20 text-blue-300';
      case 'prospect': return 'bg-yellow-500/20 text-yellow-300';
      case 'client': return 'bg-green-500/20 text-green-300';
      case 'inactive': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'lead': return '🎯 Lead';
      case 'prospect': return '🔍 Prospect';
      case 'client': return '✅ Client';
      case 'inactive': return '💤 Inactif';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="card-gradient rounded-2xl p-6">
          <div className="text-3xl mb-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
            👥
          </div>
          <div className="text-2xl font-black text-white">{clients.length}</div>
          <div className="text-sm text-neutral-300">Total Clients</div>
        </div>
        <div className="card-gradient rounded-2xl p-6">
          <div className="text-3xl mb-3 bg-gradient-to-r from-[#EC4899] to-[#FF4D2E] bg-clip-text text-transparent">
            🎯
          </div>
          <div className="text-2xl font-black text-white">{clients.filter(c => c.status === 'lead').length}</div>
          <div className="text-sm text-neutral-300">Leads</div>
        </div>
        <div className="card-gradient rounded-2xl p-6">
          <div className="text-3xl mb-3 bg-gradient-to-r from-[#FF4D2E] to-[#F97316] bg-clip-text text-transparent">
            ✅
          </div>
          <div className="text-2xl font-black text-white">{clients.filter(c => c.status === 'client').length}</div>
          <div className="text-sm text-neutral-300">Clients Actifs</div>
        </div>
        <div className="card-gradient rounded-2xl p-6">
          <div className="text-3xl mb-3 bg-gradient-to-r from-[#F97316] to-[#8B5CF6] bg-clip-text text-transparent">
            📋
          </div>
          <div className="text-2xl font-black text-white">{tasks.filter(t => t.status === 'todo').length}</div>
          <div className="text-sm text-neutral-300">Tâches en attente</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowAddClient(true)}
          className="btn-gradient px-6 py-3 rounded-xl font-bold text-white hover:scale-105"
        >
          ➕ Ajouter un client
        </button>
        <button
          onClick={() => setShowAddTask(true)}
          className="glass-strong px-6 py-3 rounded-xl font-bold text-white hover:bg-white/20 hover:scale-105"
        >
          📋 Ajouter une tâche
        </button>
      </div>

      {/* Clients Table */}
      <div className="glass-strong rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6">🤝 Gestion des Clients</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white font-bold">Nom</th>
                <th className="text-left py-3 px-4 text-white font-bold">Email</th>
                <th className="text-left py-3 px-4 text-white font-bold">Entreprise</th>
                <th className="text-left py-3 px-4 text-white font-bold">Statut</th>
                <th className="text-left py-3 px-4 text-white font-bold">Valeur</th>
                <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-white font-semibold">{client.name}</td>
                  <td className="py-3 px-4 text-neutral-300">{client.email}</td>
                  <td className="py-3 px-4 text-neutral-300">{client.company || '-'}</td>
                  <td className="py-3 px-4">
                    <select
                      value={client.status}
                      onChange={(e) => updateClientStatus(client.id, e.target.value as Client['status'])}
                      className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(client.status)} bg-transparent border-0 cursor-pointer`}
                    >
                      <option value="lead">🎯 Lead</option>
                      <option value="prospect">🔍 Prospect</option>
                      <option value="client">✅ Client</option>
                      <option value="inactive">💤 Inactif</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-lg font-bold text-[#8B5CF6]">{client.value.toLocaleString()}€</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="btn-gradient px-3 py-1 rounded-lg text-sm font-bold"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="glass-strong rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6">📋 Tâches et Suivi</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white font-bold">Tâche</th>
                <th className="text-left py-3 px-4 text-white font-bold">Client</th>
                <th className="text-left py-3 px-4 text-white font-bold">Statut</th>
                <th className="text-left py-3 px-4 text-white font-bold">Échéance</th>
                <th className="text-left py-3 px-4 text-white font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-white">
                    <div>
                      <div className="font-semibold">{task.title}</div>
                      <div className="text-sm text-neutral-400">{task.description}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {clients.find(c => c.id === task.client_id)?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      task.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      task.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {task.status === 'completed' ? '✅ Terminé' :
                       task.status === 'in_progress' ? '🔄 En cours' : '⏳ À faire'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {new Date(task.due_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="glass-strong px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/20">
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">➕ Ajouter un Client</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom du client"
                value={newClient.name}
                onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newClient.email}
                onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="text"
                placeholder="Téléphone"
                value={newClient.phone}
                onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <input
                type="text"
                placeholder="Entreprise"
                value={newClient.company}
                onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <select
                value={newClient.status}
                onChange={(e) => setNewClient({...newClient, status: e.target.value as Client['status']})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              >
                <option value="lead">🎯 Lead</option>
                <option value="prospect">🔍 Prospect</option>
                <option value="client">✅ Client</option>
                <option value="inactive">💤 Inactif</option>
              </select>
              <input
                type="number"
                placeholder="Valeur (€)"
                value={newClient.value}
                onChange={(e) => setNewClient({...newClient, value: parseInt(e.target.value) || 0})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <textarea
                placeholder="Notes"
                value={newClient.notes}
                onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500 h-24"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addClient}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Ajouter
              </button>
              <button
                onClick={() => setShowAddClient(false)}
                className="glass-strong flex-1 py-3 rounded-xl font-bold text-white hover:bg-white/20"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">📋 Ajouter une Tâche</h3>
            <div className="space-y-4">
              <select
                value={newTask.client_id}
                onChange={(e) => setNewTask({...newTask, client_id: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Titre de la tâche"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white placeholder:text-neutral-500 h-24"
              />
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              />
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value as Task['status']})}
                className="w-full rounded-xl glass-strong px-4 py-3 text-white"
              >
                <option value="todo">⏳ À faire</option>
                <option value="in_progress">🔄 En cours</option>
                <option value="completed">✅ Terminé</option>
              </select>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={addTask}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Ajouter
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="glass-strong flex-1 py-3 rounded-xl font-bold text-white hover:bg-white/20"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">👤 Détails du Client</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-400">Nom</label>
                  <div className="text-white font-semibold">{selectedClient.name}</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Email</label>
                  <div className="text-white">{selectedClient.email}</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Téléphone</label>
                  <div className="text-white">{selectedClient.phone || '-'}</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Entreprise</label>
                  <div className="text-white">{selectedClient.company || '-'}</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Statut</label>
                  <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getStatusColor(selectedClient.status)}`}>
                    {getStatusLabel(selectedClient.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Valeur</label>
                  <div className="text-lg font-bold text-[#8B5CF6]">{selectedClient.value.toLocaleString()}€</div>
                </div>
              </div>
              {selectedClient.notes && (
                <div>
                  <label className="text-sm text-neutral-400">Notes</label>
                  <div className="text-white bg-white/5 rounded-lg p-3">{selectedClient.notes}</div>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedClient(null)}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold text-white"
              >
                ✅ Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
