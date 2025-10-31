'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPaperclip, FiSend, FiUser, FiAlertCircle, FiCheckCircle, FiX, FiUpload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function TicketDetailPage({ params }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { id } = params;
  const [ticket, setTicket] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newResponse, setNewResponse] = useState('');
  const [files, setFiles] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await api.tickets.getById(id);
      setTicket(response.data);
      setResponses(response.data.responses || []);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      toast.error('Erreur lors du chargement des détails du ticket');
      router.push('/dashboard/tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file size (max 5MB per file)
    const validFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== selectedFiles.length) {
      toast.error('Certains fichiers dépassent la taille maximale de 5MB');
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    const validTypes = validFiles.filter(file => allowedTypes.includes(file.type));
    
    if (validTypes.length !== validFiles.length) {
      toast.error('Certains fichiers ont un format non supporté');
    }
    
    // Add preview URLs for images
    const filesWithPreview = validTypes.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      // Revoke object URL to avoid memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newResponse.trim() && files.length === 0) {
      toast.error('Veuillez saisir un message ou joindre un fichier');
      return;
    }
    
    try {
      setSending(true);
      
      // First, upload files if any
      let uploadedFiles = [];
      if (files.length > 0) {
        const fileObjects = files.map(f => f.file);
        const uploadResponse = await api.upload.uploadImages(fileObjects);
        uploadedFiles = uploadResponse.data.urls || [];
      }
      
      // Then add response with file URLs
      const responseData = {
        content: newResponse.trim(),
        attachments: uploadedFiles
      };
      
      const response = await api.tickets.addMessage(id, responseData);
      
      // Update responses list
      setResponses(prev => [...prev, response.data]);
      
      // Clear form
      setNewResponse('');
      setFiles([]);
      
      toast.success('Réponse envoyée avec succès');
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de la réponse');
    } finally {
      setSending(false);
    }
  };

  const closeTicket = async () => {
    try {
      await api.tickets.close(id);
      setTicket(prev => ({ ...prev, status: 'closed' }));
      toast.success('Ticket fermé avec succès');
    } catch (error) {
      console.error('Error closing ticket:', error);
      toast.error('Erreur lors de la fermeture du ticket');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'low':
        return 'Basse';
      case 'medium':
        return 'Moyenne';
      case 'high':
        return 'Haute';
      default:
        return 'Inconnue';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-3/4"></div>
        <div className="card">
          <div className="skeleton h-64"></div>
        </div>
        <div className="card">
          <div className="skeleton h-48"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="card text-center py-12">
        <FiAlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Ticket introuvable
        </h3>
        <p className="text-gray-600 mb-6">
          Ce ticket n'existe pas ou vous n'avez pas les droits pour y accéder.
        </p>
        <button
          onClick={() => router.push('/dashboard/tickets')}
          className="btn btn-primary"
        >
          Retour aux tickets
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <button 
              onClick={() => router.push('/dashboard/tickets')}
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Ticket #{ticket.id}</h1>
          </div>
          <p className="text-gray-600">Créé le {formatDate(ticket.created_at)}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`badge ${getStatusColor(ticket.status)}`}>
            {getStatusLabel(ticket.status)}
          </span>
          <span className={`badge ${getPriorityColor(ticket.priority)}`}>
            {getPriorityLabel(ticket.priority)}
          </span>
          {ticket.status !== 'closed' && (
            <button
              onClick={closeTicket}
              className="btn btn-outline flex items-center space-x-2"
            >
              <FiCheckCircle />
              <span>Fermer le ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Ticket Details */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Conversation */}
        <div className="md:col-span-2 space-y-6">
          {/* Original Ticket */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {ticket.user?.avatar ? (
                  <img 
                    src={ticket.user.avatar} 
                    alt={ticket.user.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                    <FiUser className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{ticket.title}</h2>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">{ticket.user?.name || 'Vous'}</span> • {formatDate(ticket.created_at)}
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                  {ticket.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                
                {/* Attachments */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Pièces jointes:</h4>
                    <div className="flex flex-wrap gap-3">
                      {ticket.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <FiPaperclip className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">Pièce jointe {index + 1}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Responses */}
          <div className="space-y-4">
            {responses.map((response, index) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card ${response.is_admin ? 'bg-blue-50 border border-blue-100' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {response.user?.avatar ? (
                      <img 
                        src={response.user.avatar} 
                        alt={response.user.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${response.is_admin ? 'bg-blue-600' : 'bg-primary'} text-white flex items-center justify-center`}>
                        <FiUser className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-3">
                      <span className="font-medium">
                        {response.is_admin ? 'Support' : response.user?.name || 'Vous'}
                      </span> • {formatDate(response.created_at)}
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                      {response.content.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                    
                    {/* Attachments */}
                    {response.attachments && response.attachments.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Pièces jointes:</h4>
                        <div className="flex flex-wrap gap-3">
                          {response.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                              <FiPaperclip className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-700">Pièce jointe {index + 1}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Form */}
          {ticket.status !== 'closed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Répondre</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="Écrivez votre réponse ici..."
                  rows={4}
                  className="input"
                  disabled={sending}
                ></textarea>
                
                {/* File Upload */}
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif,application/pdf,text/plain"
                      disabled={sending}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center">
                        <FiUpload className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-primary font-medium">Joindre des fichiers</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF, PDF, TXT • Max 5MB par fichier
                      </p>
                    </label>
                  </div>

                  {/* File Preview */}
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Fichiers sélectionnés ({files.length})</h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              {file.preview ? (
                                <img src={file.preview} alt={file.name} className="w-8 h-8 object-cover rounded" />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                                  {file.type.includes('pdf') ? 'PDF' : 'TXT'}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-red-500"
                              disabled={sending}
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center space-x-2"
                    disabled={sending || (!newResponse.trim() && files.length === 0)}
                  >
                    <FiSend />
                    <span>{sending ? 'Envoi en cours...' : 'Envoyer'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* Closed Ticket Message */}
          {ticket.status === 'closed' && (
            <div className="card bg-gray-50 border border-gray-200 text-center py-6">
              <FiCheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ce ticket est fermé
              </h3>
              <p className="text-gray-600 mb-4">
                Ce ticket a été résolu et fermé. Si vous avez d'autres questions, veuillez créer un nouveau ticket.
              </p>
              <button
                onClick={() => router.push('/dashboard/tickets/new')}
                className="btn btn-primary"
              >
                Créer un nouveau ticket
              </button>
            </div>
          )}
        </div>

        {/* Ticket Info */}
        <div className="md:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Statut</span>
                <div className="mt-1">
                  <span className={`badge ${getStatusColor(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Priorité</span>
                <div className="mt-1">
                  <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityLabel(ticket.priority)}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Catégorie</span>
                <p className="font-medium text-gray-900">
                  {ticket.category === 'general' ? 'Général' :
                   ticket.category === 'account' ? 'Compte utilisateur' :
                   ticket.category === 'order' ? 'Commande' :
                   ticket.category === 'payment' ? 'Paiement' :
                   ticket.category === 'product' ? 'Produit' :
                   ticket.category === 'technical' ? 'Problème technique' : 'Autre'}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Créé par</span>
                <p className="font-medium text-gray-900">
                  {ticket.user?.name || user?.name || 'Vous'}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Date de création</span>
                <p className="font-medium text-gray-900">
                  {formatDate(ticket.created_at)}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Dernière mise à jour</span>
                <p className="font-medium text-gray-900">
                  {formatDate(ticket.updated_at)}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Réponses</span>
                <p className="font-medium text-gray-900">
                  {responses.length}
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Help Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-blue-50 border border-blue-100"
          >
            <h3 className="text-lg font-bold text-blue-900 mb-3">Besoin d'aide ?</h3>
            
            <p className="text-blue-700 mb-4">
              Notre équipe de support est disponible du lundi au vendredi de 9h à 18h.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-blue-700">
                <FiUser className="w-4 h-4" />
                <span>admin@horizonstudio.com</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-700">
                <FiUser className="w-4 h-4" />
                <span>+33 1 23 45 67 89</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}