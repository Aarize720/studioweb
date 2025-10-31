'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiUpload, FiX, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function EditPortfolioPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    category: 'web',
    technologies: '',
    url: '',
    image: null,
    featured: false,
    status: 'active'
  });

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await api.portfolio.getById(params.id);
      const project = response.data.data || response.data;
      setFormData({
        title: project.title || '',
        description: project.description || '',
        client: project.client || '',
        category: project.category || 'web',
        technologies: project.technologies || '',
        url: project.url || '',
        image: null,
        featured: project.featured || false,
        status: project.status || 'active'
      });
      if (project.image) setImagePreview(project.image);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (key !== 'image') {
          submitData.append(key, formData[key]);
        }
      });

      await api.portfolio.update(params.id, submitData);
      toast.success('Projet mis à jour avec succès');
      router.push('/admin/portfolio');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    try {
      await api.portfolio.delete(params.id);
      toast.success('Projet supprimé');
      router.push('/admin/portfolio');
    } catch (error) {
      console.error('Error deleting project:', error);
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
          <Link href="/admin/portfolio" className="p-2 hover:bg-gray-100 rounded-lg">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Modifier le projet</h1>
        </div>
        <button onClick={handleDelete} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          <FiTrash2 className="w-4 h-4 mr-2" />
          Supprimer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <input type="text" name="client" value={formData.client} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
              <select name="category" value={formData.category} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="design">Design</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
            <input type="text" name="technologies" value={formData.technologies} onChange={handleChange}
              placeholder="React, Node.js, MongoDB" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL du projet</label>
            <input type="url" name="url" value={formData.url} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
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

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Mettre en avant</label>
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
                className="rounded border-gray-300 text-primary focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
              <FiSave className="w-4 h-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link href="/admin/portfolio" className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}