'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiSend, FiUser, FiSearch, FiMoreVertical, FiPaperclip } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.messages.getConversations();
      setConversations(response.data || []);
      
      // Set first conversation as active if available
      if (response.data && response.data.length > 0) {
        setActiveConversation(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const response = await api.messages.getById(conversationId);
      setMessages(response.data.messages || []);
      
      // Mark conversation as read
      await api.messages.markAsRead(conversationId);
      
      // Update unread count in conversations list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 } 
            : conv
        )
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    try {
      const messageData = {
        conversation_id: activeConversation.id,
        content: newMessage,
      };
      
      // Optimistic update
      const tempMessage = {
        id: 'temp-' + Date.now(),
        content: newMessage,
        sender_id: user.id,
        created_at: new Date().toISOString(),
        is_read: true,
        sending: true
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      // Send to API
      const response = await api.messages.send(messageData);
      
      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? response.data : msg
        )
      );
      
      // Update conversation in list to show latest message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversation.id 
            ? { 
                ...conv, 
                last_message: newMessage,
                updated_at: new Date().toISOString()
              } 
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== 'temp-' + Date.now()));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conversation => 
    conversation.recipient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communiquez avec notre équipe</p>
      </div>

      {/* Messages Interface */}
      <div className="card p-0 overflow-hidden">
        <div className="grid md:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="md:col-span-1 border-r border-gray-200">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            
            {/* Conversations */}
            <div className="overflow-y-auto h-[calc(600px-73px)]">
              {loading ? (
                <div className="space-y-2 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3">
                      <div className="skeleton w-10 h-10 rounded-full"></div>
                      <div className="flex-1">
                        <div className="skeleton h-4 w-3/4 mb-2"></div>
                        <div className="skeleton h-3 w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune conversation trouvée</p>
                </div>
              ) : (
                filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveConversation(conversation)}
                    className={`flex items-start space-x-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors
                      ${activeConversation?.id === conversation.id ? 'bg-blue-50' : ''}
                      ${conversation.unread_count > 0 ? 'font-medium' : ''}
                    `}
                  >
                    <div className="relative">
                      {conversation.recipient?.avatar ? (
                        <img 
                          src={conversation.recipient.avatar} 
                          alt={conversation.recipient.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                          <FiUser className="w-5 h-5" />
                        </div>
                      )}
                      
                      {conversation.recipient?.is_online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.recipient?.name || 'Support'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(conversation.updated_at, true)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.last_message || 'Nouvelle conversation'}
                      </p>
                    </div>
                    
                    {conversation.unread_count > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                        {conversation.unread_count}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="md:col-span-2 flex flex-col">
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {activeConversation.recipient?.avatar ? (
                      <img 
                        src={activeConversation.recipient.avatar} 
                        alt={activeConversation.recipient.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                        <FiUser className="w-5 h-5" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {activeConversation.recipient?.name || 'Support'}
                      </h3>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-1 ${activeConversation.recipient?.is_online ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        {activeConversation.recipient?.is_online ? 'En ligne' : 'Hors ligne'}
                      </div>
                    </div>
                  </div>
                  
                  <button className="text-gray-500 hover:text-gray-700">
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {loadingMessages ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                          <div className={`skeleton w-2/3 h-16 ${i % 2 === 0 ? 'rounded-tr-lg rounded-br-lg rounded-bl-lg' : 'rounded-tl-lg rounded-bl-lg rounded-br-lg'}`}></div>
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Aucun message. Commencez la conversation!</p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const isCurrentUser = message.sender_id === user?.id;
                      
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[75%] ${message.sending ? 'opacity-70' : ''}`}>
                            {!isCurrentUser && (
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                                  {activeConversation.recipient?.name?.charAt(0) || 'S'}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {activeConversation.recipient?.name || 'Support'}
                                </span>
                              </div>
                            )}
                            
                            <div className={`p-3 rounded-lg ${
                              isCurrentUser 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white border border-gray-200 rounded-tl-none'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                            
                            <div className={`text-xs mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                              <span className="text-gray-500">
                                {formatDate(message.created_at, true)}
                              </span>
                              {isCurrentUser && (
                                <span className="ml-2 text-gray-500">
                                  {message.is_read ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button 
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => toast.success('Fonctionnalité à venir')}
                    >
                      <FiPaperclip className="w-5 h-5" />
                    </button>
                    
                    <input
                      type="text"
                      placeholder="Écrivez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="input flex-1"
                    />
                    
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className={`btn btn-primary p-2 ${!newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                <FiMessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune conversation sélectionnée
                </h3>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Sélectionnez une conversation dans la liste ou commencez une nouvelle conversation avec notre équipe.
                </p>
                <button
                  onClick={() => {
                    // Create a new conversation with support
                    const newConversation = {
                      id: 'new-' + Date.now(),
                      recipient: {
                        name: 'Support',
                        is_online: true
                      },
                      last_message: '',
                      updated_at: new Date().toISOString(),
                      unread_count: 0
                    };
                    
                    setConversations(prev => [newConversation, ...prev]);
                    setActiveConversation(newConversation);
                    setMessages([]);
                    
                    toast.success('Nouvelle conversation créée');
                  }}
                  className="btn btn-primary"
                >
                  Nouvelle conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}