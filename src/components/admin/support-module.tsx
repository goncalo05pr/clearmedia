"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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
    loadMessages();
  }, [filter]);

  const loadMessages = async () => {
    try {
      const supabase = createClient();
      
      // Récupérer les messages de support depuis Supabase
      let query = supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false });

      // Appliquer le filtre si nécessaire
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading support messages:', error);
      } else {
        // Transformer les données brutes en format ContactMessage
        const supportMessages: ContactMessage[] = (data || []).map((msg: any) => ({
          id: msg.id,
          name: msg.name || '',
          email: msg.email || '',
          subject: msg.subject || '',
          message: msg.message || '',
          date: msg.created_at || '',
          status: msg.status || 'new',
          priority: msg.priority || 'medium'
        }));

        setMessages(supportMessages);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading support messages:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (messageId: string, newStatus: ContactMessage['status']) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('support_messages')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
      } else {
        // Mettre à jour l'état local
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, status: newStatus } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('support_messages')
          .delete()
          .eq('id', messageId);

        if (error) {
          console.error('Error deleting message:', error);
        } else {
          setMessages(prev => prev.filter(msg => msg.id !== messageId));
          if (selectedMessage?.id === messageId) {
            setSelectedMessage(null);
          }
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
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

  const filteredMessages = filter === 'all' ? messages : messages.filter(msg => msg.status === filter);

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
      <div className="bg-white rounded-lg p-2 mb-6">
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'Tous', count: messages.length },
            { id: 'new', label: 'Nouveaux', count: messages.filter(m => m.status === 'new').length },
            { id: 'read', label: 'Lus', count: messages.filter(m => m.status === 'read').length },
            { id: 'replied', label: 'Répondus', count: messages.filter(m => m.status === 'replied').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Messages</h4>
          </div>
          
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-gray-500 text-lg">Aucune donnée pour l'instant</p>
              <p className="text-gray-400 text-sm mt-2">
                {filter === 'all' ? 'Aucun message de support' : `Aucun message ${filter}`}
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                          {message.priority === 'high' ? 'Urgent' : 
                           message.priority === 'medium' ? 'Moyen' : 'Faible'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                          {message.status === 'new' ? 'Nouveau' : 
                           message.status === 'read' ? 'Lu' : 
                           message.status === 'replied' ? 'Répondu' : 'Archivé'}
                        </span>
                      </div>
                      <div className="font-medium text-gray-900">{message.subject}</div>
                      <div className="text-sm text-gray-600">{message.name} - {message.email}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(message.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Détails du message</h4>
          </div>
          
          {selectedMessage ? (
            <div className="p-6">
              <div className="mb-4">
                <div className="font-medium text-gray-900 mb-2">De: {selectedMessage.name}</div>
                <div className="text-sm text-gray-600 mb-2">Email: {selectedMessage.email}</div>
                <div className="text-sm text-gray-600 mb-2">Date: {new Date(selectedMessage.date).toLocaleString('fr-FR')}</div>
              </div>
              
              <div className="mb-4">
                <div className="font-medium text-gray-900 mb-2">Sujet: {selectedMessage.subject}</div>
                <div className="text-sm text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                {selectedMessage.status !== 'replied' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm"
                  >
                    Marquer comme répondu
                  </button>
                )}
                
                {selectedMessage.status !== 'archived' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium text-sm"
                  >
                    Archiver
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-gray-500">Sélectionnez un message pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
