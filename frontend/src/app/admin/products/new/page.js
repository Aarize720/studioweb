'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'web',
    image: null,
    status: 'active',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5 MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('stock', formData.stock);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      
      if (formData.meta_title) submitData.append('meta_title', formData.meta_title);
      if (formData.meta_description) submitData.append('meta_description', formData.meta_description);
      if (formData.meta_keywords) submitData.append('meta_keywords', formData.meta_keywords);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await api.post('/products', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Produit créé avec succès');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouveau produit</h1>
            <p className="text-gray-600 mt-1">Créer un nouveau produit</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Site web vitrine"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Description détaillée du produit..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SEO Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO & Métadonnées</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre SEO
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  maxLength={60}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Titre pour les moteurs de recherche"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_title.length}/60 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description SEO
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Description pour les moteurs de recherche"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description.length}/160 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots-clés SEO
                </label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="mot-clé1, mot-clé2, mot-clé3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Séparez les mots-clés par des virgules
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image du produit</h3>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  Cliquez pour télécharger une image
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG jusqu'à 5MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="mt-3 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer transition-colors"
                >
                  Choisir une image
                </label>
              </div>
            )}
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut</h3>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="w-4 h-4 mr-2" />
                {saving ? 'Enregistrement...' : 'Créer le produit'}
              </button>
              <Link
                href="/admin/products"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}