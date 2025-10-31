'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiUpload, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function NewServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    features: [''],
    category: 'web',
    image: null,
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5 MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          submitData.append(key, JSON.stringify(formData[key].filter(f => f.trim())));
        } else if (key === 'image' && formData[key]) {
          submitData.append(key, formData[key]);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      await api.services.create(submitData);
      toast.success('Service créé avec succès');
      router.push('/admin/services');
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouveau service</h1>
          <p className="text-gray-600 mt-1">Créer un nouveau service</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du service *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="Ex: 2 semaines"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fonctionnalités</h2>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Ex: Design responsive" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                  {formData.features.length > 1 && (
                    <button type="button" onClick={() => removeFeature(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addFeature} className="flex items-center text-primary hover:text-primary-dark">
                <FiPlus className="w-4 h-4 mr-1" />
                Ajouter une fonctionnalité
              </button>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image</h3>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <button type="button" onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, image: null })); }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer">
                  Choisir une image
                </label>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut</h3>
            <select name="status" value={formData.status} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-3">
              <button type="submit" disabled={saving}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
                <FiSave className="w-4 h-4 mr-2" />
                {saving ? 'Enregistrement...' : 'Créer le service'}
              </button>
              <Link href="/admin/services" className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Annuler
              </Link>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}