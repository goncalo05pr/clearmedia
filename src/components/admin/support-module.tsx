"use client";

import { useState, useEffect } from "react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
}

export default function SupportModule() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');

  useEffect(() => {
    // Simuler des données - en production, ça viendrait de Supabase
    const loadMessages = async () => {
      try {
        const mockMessages: ContactMessage[] = [
          {
            id: "1",
            name: "Sarah Martin",
            email: "sarah.martin@email.com",
            subject: "Problème d'accès à la formation Social Ads",
            message: "Bonjour, je n'arrive pas à accéder à ma formation achetée hier. Pouvez-vous m'aider ?",
            date: "2024-03-15T10:30:00Z",
            status: "new",
            priority: "high"
          },
          {
            id: "2",
            name: "Marc Dubois",
            email: "marc.dubois@email.com",
            subject: "Question sur le contenu du module 3",
            message: "Bonjour, j'ai une question sur les techniques de copyclosing présentées dans le module 3. Pourriez-vous clarifier ?",
            date: "2024-03-14T14:22:00Z",
            status: "read",
            priority: "medium"
          },
          {
            id: "3",
            name: "Julie Petit",
            email: "julie.petit@email.com",
            subject: "Remboursement formation Copy Closing",
            message: "Bonjour, je souhaite me faire rembourser pour la formation Copy Closing que j'ai achetée il y a 2 jours.",
            date: "2024-03-13T16:45:00Z",
            status: "replied",
            priority: "low"
          }
        ];

        setMessages(mockMessages);
        setLoading(false);
      } catch (error) {
        console.error('Error loading messages:', error);
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const handleStatusChange = async (id: string, newStatus: ContactMessage['status']) => {
    try {
      console.log('Updating message status:', id, newStatus);
      // En production: await supabase.from('contact_messages').update({ status: newStatus }).eq('id', id);
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: newStatus } : m
      ));
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleReply = async (message: ContactMessage) => {
    setSelectedMessage(message);
    await handleStatusChange(message.id, 'replied');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <h3 className="text-xl font-semibold text-white mb-4">🎧 Support Client</h3>
      
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 mb-6">
        <div className="flex space-x-2">
          {(['all', 'new', 'read', 'replied'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'Tous' : 
               status === 'new' ? 'Nouveaux' :
               status === 'read' ? 'Lus' : 'Répondus'}
              {status === 'new' && ` (${messages.filter(m => m.status === 'new').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(message.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{message.name}</div>
                    <div className="text-sm text-gray-600">{message.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{message.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                      {message.priority === 'high' ? 'Haute' : message.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                      {message.status === 'new' ? 'Nouveau' : 
                       message.status === 'read' ? 'Lu' :
                       message.status === 'replied' ? 'Répondu' : 'Archivé'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Voir
                      </button>
                      {message.status !== 'replied' && (
                        <button
                          onClick={() => handleReply(message)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Répondre
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(message.id, 'archived')}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Archiver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Détails du message</h4>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">Informations client</h5>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nom:</span> {selectedMessage.name}</div>
                    <div><span className="font-medium">Email:</span> {selectedMessage.email}</div>
                    <div><span className="font-medium">Date:</span> {new Date(selectedMessage.date).toLocaleString('fr-FR')}</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">Classification</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Priorité:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority === 'high' ? 'Haute' : selectedMessage.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Statut:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedMessage.status)}`}>
                        {selectedMessage.status === 'new' ? 'Nouveau' : 
                         selectedMessage.status === 'read' ? 'Lu' :
                         selectedMessage.status === 'replied' ? 'Répondu' : 'Archivé'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Message</h5>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                  <div className="font-medium mb-2">Sujet: {selectedMessage.subject}</div>
                  <div className="whitespace-pre-wrap">{selectedMessage.message}</div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedMessage.status !== 'replied' && (
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    className="px-4 py-2 bg-green-600 border border-transparent rounded-lg font-medium text-white hover:bg-green-700"
                  >
                    Répondre
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
