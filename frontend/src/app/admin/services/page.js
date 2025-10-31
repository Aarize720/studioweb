'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service supprimé');
      fetchServices();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await api.patch(`/services/${id}`, { status: newStatus });
      toast.success(`Service ${newStatus === 'active' ? 'activé' : 'désactivé'}`);
      fetchServices();
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des services</h1>
          <p className="text-gray-600 mt-1">{services.length} service(s)</p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Nouveau service
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                (service.status || 'active') === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {(service.status || 'active') === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-primary">
                {service.price?.toLocaleString('fr-FR')} €
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/admin/services/${service.id}`}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
              >
                <FiEdit className="w-4 h-4 mr-1" />
                Éditer
              </Link>
              <button
                onClick={() => handleToggleStatus(service.id, service.status || 'active')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {(service.status || 'active') === 'active' ? (
                  <FiEye className="w-4 h-4" />
                ) : (
                  <FiEyeOff className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}