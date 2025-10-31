'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiStar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/portfolio');
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    
    try {
      await api.delete(`/portfolio/${id}`);
      toast.success('Projet supprimé');
      fetchProjects();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await api.patch(`/portfolio/${id}`, { featured: !currentFeatured });
      toast.success(currentFeatured ? 'Retiré des projets mis en avant' : 'Ajouté aux projets mis en avant');
      fetchProjects();
    } catch (error) {
      toast.error('Erreur lors de la modification');
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion du portfolio</h1>
          <p className="text-gray-600 mt-1">{projects.length} projet(s)</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Nouveau projet
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="relative h-48 bg-gray-100">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Pas d'image
                </div>
              )}
              {project.featured && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white p-2 rounded-full">
                  <FiStar className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/portfolio/${project.id}`}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                >
                  <FiEdit className="w-4 h-4 mr-1" />
                  Éditer
                </Link>
                <button
                  onClick={() => handleToggleFeatured(project.id, project.featured)}
                  className={`p-2 border rounded-lg transition-colors ${
                    project.featured 
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-600' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  title={project.featured ? 'Retirer de la mise en avant' : 'Mettre en avant'}
                >
                  <FiStar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}