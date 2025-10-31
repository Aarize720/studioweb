'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiX, FiAlertCircle, FiHelpCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function NewTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setLoading(true);
      
      // First, upload files if any
      let uploadedFiles = [];
      if (files.length > 0) {
        const fileObjects = files.map(f => f.file);
        const uploadResponse = await api.upload.uploadImages(fileObjects);
        uploadedFiles = uploadResponse.data.urls || [];
      }
      
      // Then create ticket with file URLs
      const ticketData = {
        ...formData,
        attachments: uploadedFiles
      };
      
      const response = await api.tickets.create(ticketData);
      
      toast.success('Ticket créé avec succès');
      router.push(`/dashboard/tickets/${response.data.id}`);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création du ticket');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => router.push('/dashboard/tickets')}
          className="text-gray-500 hover:text-primary transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Nouveau ticket</h1>
      </div>

      {/* Help Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-blue-50 border border-blue-100"
      >
        <div className="flex items-start space-x-3">
          <FiHelpCircle className="w-6 h-6 text-blue-500 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Comment obtenir une assistance efficace</h3>
            <ul className="text-blue-700 space-y-1 list-disc list-inside">
              <li>Donnez un titre clair et précis à votre demande</li>
              <li>Décrivez en détail le problème rencontré</li>
              <li>Mentionnez les étapes pour reproduire le problème</li>
              <li>Joignez des captures d'écran si nécessaire</li>
              <li>Indiquez la priorité appropriée pour votre demande</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Ticket Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Problème de connexion à mon compte"
              className="input"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              <option value="general">Général</option>
              <option value="account">Compte utilisateur</option>
              <option value="order">Commande</option>
              <option value="payment">Paiement</option>
              <option value="product">Produit</option>
              <option value="technical">Problème technique</option>
              <option value="other">Autre</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className={`
                flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-colors
                ${formData.priority === 'low' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={formData.priority === 'low'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <FiAlertCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">Basse</span>
                <span className="text-xs text-gray-500 text-center mt-1">Question simple</span>
              </label>
              
              <label className={`
                flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-colors
                ${formData.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  name="priority"
                  value="medium"
                  checked={formData.priority === 'medium'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  <FiAlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="font-medium text-gray-900">Moyenne</span>
                <span className="text-xs text-gray-500 text-center mt-1">Problème mineur</span>
              </label>
              
              <label className={`
                flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-colors
                ${formData.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={formData.priority === 'high'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <span className="font-medium text-gray-900">Haute</span>
                <span className="text-xs text-gray-500 text-center mt-1">Problème urgent</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Décrivez votre problème en détail..."
              className="input"
              required
            ></textarea>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pièces jointes (optionnel)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                multiple
                className="hidden"
                accept="image/jpeg,image/png,image/gif,application/pdf,text/plain"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FiUpload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 mb-1">Glissez-déposez vos fichiers ici ou</p>
                <p className="text-primary font-medium">Parcourir les fichiers</p>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, GIF, PDF, TXT • Max 5MB par fichier • 5 fichiers max
                </p>
              </label>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="font-medium text-gray-700">Fichiers sélectionnés ({files.length})</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {file.preview ? (
                          <img src={file.preview} alt={file.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            {file.type.includes('pdf') ? 'PDF' : 'TXT'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard/tickets')}
              className="btn btn-outline"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Créer le ticket'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}