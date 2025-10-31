'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get('/blog', { params });
      setPosts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    try {
      await api.delete(`/blog/${id}`);
      toast.success('Article supprimé');
      fetchPosts();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion du blog</h1>
          <p className="text-gray-600 mt-1">{posts.length} article(s)</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Nouvel article
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
          <option value="scheduled">Planifié</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auteur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{post.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {post.author?.first_name} {post.author?.last_name}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                    {post.status === 'published' ? 'Publié' : post.status === 'draft' ? 'Brouillon' : 'Planifié'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(post.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="text-gray-600 hover:text-gray-900">
                      <FiEye className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/blog/${post.id}`} className="text-primary hover:text-primary-dark">
                      <FiEdit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-700">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}