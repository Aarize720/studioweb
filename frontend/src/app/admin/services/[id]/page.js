'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiUpload, FiX, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function EditServicePage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: [''],
    image: null,
    status: 'active'
  });

  useEffect(() => {
    fetchService();
  }, [params.id]);

  const fetchService = async () => {
    try {
      const response = await api.services.getById(params.id);
      const service = response.data.data || response.data;
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        features: service.features || [''],
        image: null,
        status: service.status || 'active'
      });
      if (service.image) setImagePreview(service.image);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('features', JSON.stringify(formData.features.filter(f => f.trim())));
      submitData.append('status', formData.status);
      if (formData.image) submitData.append('image', formData.image);

      await api.services.update(params.id, submitData);
      toast.success('Service mis à jour avec succès');
      router.push('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    try {
      await api.services.delete(params.id);
      toast.success('Service supprimé');
      router.push('/admin/services');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/services" className="p-2 hover:bg-gray-100 rounded-lg">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Modifier le service</h1>
        </div>
        <button onClick={handleDelete} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          <FiTrash2 className="w-4 h-4 mr-2" />
          Supprimer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Fonctionnalités</h2>
              <button type="button" onClick={addFeature} className="flex items-center px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark">
                <FiPlus className="w-4 h-4 mr-1" />
                Ajouter
              </button>
            </div>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="Ex: Design responsive" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                {formData.features.length > 1 && (
                  <button type="button" onClick={() => removeFeature(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image</h3>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <button type="button" onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, image: null })); }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
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
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select name="status" value={formData.status} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
              <FiSave className="w-4 h-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link href="/admin/services" className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}