'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiUpload, FiX, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function EditBlogPostPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    image: null,
    status: 'draft',
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await api.blog.getPostById(params.id);
      const post = response.data.data || response.data;
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
        image: null,
        status: post.status || 'draft',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || ''
      });
      if (post.image) setImagePreview(post.image);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      await api.blog.updatePost(params.id, submitData);
      toast.success('Article mis à jour avec succès');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    try {
      await api.blog.deletePost(params.id);
      toast.success('Article supprimé');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error deleting post:', error);
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
          <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Modifier l'article</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/blog/${params.id}`} target="_blank" className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiEye className="w-4 h-4 mr-2" />
            Aperçu
          </Link>
          <button onClick={handleDelete} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            <FiTrash2 className="w-4 h-4 mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenu *</label>
              <textarea name="content" value={formData.content} onChange={handleChange} required rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Contenu de l'article en Markdown ou HTML..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extrait</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Court résumé de l'article..." />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre SEO</label>
              <input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              <p className="text-xs text-gray-500 mt-1">{formData.meta_title.length}/60 caractères</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description SEO</label>
              <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} maxLength={160} rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160 caractères</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image de couverture</h3>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Développement web" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="react, javascript, web" />
              <p className="text-xs text-gray-500 mt-1">Séparez les tags par des virgules</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="scheduled">Planifié</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
              <FiSave className="w-4 h-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link href="/admin/blog" className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}