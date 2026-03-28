"use client";

import { useState, useEffect, useRef } from "react";

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

  useEffect(() => {
    // Simuler le chargement des données
    const loadChatData = async () => {
      try {
        const mockUsers: User[] = [
          {
            id: "1",
            name: "Alice Martin",
            email: "alice@kliqz.com",
            avatar: "👩‍💼",
            isOnline: true
          },
          {
            id: "2",
            name: "Bernard Dubois",
            email: "bernard@kliqz.com",
            avatar: "👨‍💼",
            isOnline: true
          },
          {
            id: "3",
            name: "Claire Petit",
            email: "claire@kliqz.com",
            avatar: "👩‍💼",
            isOnline: false,
            lastSeen: "2024-03-15T14:30:00Z"
          }
        ];

        const mockMessages: Message[] = [
          {
            id: "1",
            senderId: "2",
            senderName: "Bernard Dubois",
            content: "Salut ! Comment se passe la journée ?",
            timestamp: "2024-03-15T09:30:00Z",
            isOwn: false
          },
          {
            id: "2",
            senderId: "current",
            senderName: "Moi",
            content: "Bonjour Bernard ! Ça va bien, et toi ?",
            timestamp: "2024-03-15T09:32:00Z",
            isOwn: true
          },
          {
            id: "3",
            senderId: "2",
            senderName: "Bernard Dubois",
            content: "Super ! J'ai fini la mise à jour du module CRM. Tu peux jeter un œil ?",
            timestamp: "2024-03-15T09:35:00Z",
            isOwn: false
          }
        ];

        setUsers(mockUsers);
        setMessages(mockMessages);
        setSelectedUser(mockUsers[1]); // Sélectionner Bernard par défaut
        setLoading(false);
      } catch (error) {
        console.error('Error loading chat data:', error);
        setLoading(false);
      }
    };

    loadChatData();

    // Simuler des messages en temps réel
    const interval = setInterval(() => {
      // Simuler un message entrant
      if (Math.random() > 0.95 && selectedUser) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (randomUser.id !== selectedUser.id) {
          const newMsg: Message = {
            id: Date.now().toString(),
            senderId: randomUser.id,
            senderName: randomUser.name,
            content: "Message automatique de test",
            timestamp: new Date().toISOString(),
            isOwn: false
          };
          setMessages(prev => [...prev, newMsg]);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedUser, users]);

  useEffect(() => {
    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: "current",
        senderName: "Moi",
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isOwn: true
      };

      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Simuler une réponse
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: selectedUser.id,
          senderName: selectedUser.name,
          content: "Merci pour ton message ! Je vais regarder ça de suite.",
          timestamp: new Date().toISOString(),
          isOwn: false
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
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
              {users.map((user) => (
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
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{selectedUser.avatar}</div>
                    <div>
                      <div className="font-medium text-gray-900">{selectedUser.name}</div>
                      <div className="text-sm text-gray-600">
                        {selectedUser.isOnline ? 'En ligne' : 'Hors ligne'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages
                    .filter(msg => msg.senderId === selectedUser.id || msg.senderId === "current")
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
                    ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
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
