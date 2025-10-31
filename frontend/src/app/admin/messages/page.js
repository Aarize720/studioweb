'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages/conversations');
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversation/${conversationId}`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await api.post('/messages', {
        recipient_id: selectedConversation.user_id,
        message: newMessage
      });
      setNewMessage('');
      fetchMessages(selectedConversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messagerie</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="grid grid-cols-3 h-full">
          {/* Conversations List */}
          <div className="col-span-1 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conv.id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {conv.user?.first_name} {conv.user?.last_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">
                    {selectedConversation.user?.first_name} {selectedConversation.user?.last_name}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.is_admin
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(msg.created_at).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Votre message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FiMessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Sélectionnez une conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}