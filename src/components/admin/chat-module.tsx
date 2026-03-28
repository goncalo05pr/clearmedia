"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export default function ChatModule() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatData();
  }, []);

  const loadChatData = async () => {
    try {
      const supabase = createClient();
      
      // Récupérer les utilisateurs depuis Supabase
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .or('user_metadata->role.eq.admin,user_metadata->role.eq.manager,user_metadata->role.eq.editor')
        .order('created_at', { ascending: false });

      // Récupérer les messages depuis Supabase
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (usersError || messagesError) {
        console.error('Error loading chat data:', { usersError, messagesError });
      } else {
        // Transformer les profils en utilisateurs du chat
        const chatUsers: User[] = (usersData || []).map((profile: any) => ({
          id: profile.id,
          name: profile.user_metadata?.name || profile.email,
          email: profile.email,
          avatar: "👤",
          isOnline: Math.random() > 0.5, // Simulation - en production, utiliser un système de présence réel
          lastSeen: profile.last_sign_in_at
        }));

        // Transformer les messages
        const chatMessages: Message[] = (messagesData || []).map((msg: any) => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender_name,
          content: msg.content,
          timestamp: msg.created_at,
          isOwn: msg.sender_id === 'current-user' // Adapter selon l'utilisateur connecté
        }));

        setUsers(chatUsers);
        setMessages(chatMessages);
        
        if (chatUsers.length > 0) {
          setSelectedUser(chatUsers[0]);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading chat data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      try {
        const supabase = createClient();
        
        const message: Message = {
          id: Date.now().toString(),
          senderId: "current-user",
          senderName: "Moi",
          content: newMessage.trim(),
          timestamp: new Date().toISOString(),
          isOwn: true
        };

        // Sauvegarder le message dans Supabase
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            sender_id: 'current-user',
            sender_name: 'Moi',
            receiver_id: selectedUser.id,
            content: newMessage.trim(),
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error sending message:', error);
        } else {
          setMessages(prev => [...prev, message]);
          setNewMessage("");
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
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
      <h3 className="text-xl font-semibold text-white mb-4">💬 Chat Interne Admin</h3>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Liste des utilisateurs */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">Équipe Admin</h4>
              <p className="text-sm text-gray-600">{users.filter(u => u.isOnline).length} en ligne</p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">👥</div>
                  <p className="text-gray-500 text-sm">Aucune donnée pour l'instant</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="relative mr-3">
                      <div className="text-2xl">{user.avatar}</div>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      {!user.isOnline && user.lastSeen && (
                        <div className="text-xs text-gray-500">
                          Dernière connexion: {new Date(user.lastSeen).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{selectedUser.avatar}</div>
                      <div>
                        <div className="font-medium text-gray-900">{selectedUser.name}</div>
                        <div className="text-sm text-gray-600">
                          {selectedUser.isOnline ? 'En ligne' : 'Hors ligne'}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={scrollToTop}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="Remonter en haut"
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={scrollToBottom}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="Descendre en bas"
                      >
                        ⬇️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-2xl mb-2">💬</div>
                      <p className="text-gray-500">Aucun message pour l'instant</p>
                    </div>
                  ) : (
                    messages
                      .filter(msg => msg.senderId === selectedUser.id || msg.senderId === "current-user")
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 ${
                              message.isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        setIsTyping(true);
                        setTimeout(() => setIsTyping(false), 1000);
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium disabled:cursor-not-allowed"
                    >
                      Envoyer
                    </button>
                  </div>
                  {isTyping && (
                    <div className="text-sm text-gray-500 mt-2">
                      {selectedUser.name} est en train d'écrire...
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-gray-600">Sélectionnez un utilisateur pour commencer à discuter</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
