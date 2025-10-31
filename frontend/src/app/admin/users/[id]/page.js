'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiShoppingCart, FiActivity } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'client',
    status: 'active'
  });

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchUserOrders();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${userId}`);
      const userData = response.data.data;
      
      setUser(userData);
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'client',
        status: userData.status || 'active'
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Erreur lors du chargement de l\'utilisateur');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await api.get(`/orders?user_id=${userId}&limit=5`);
      setOrders(response.data.data.orders || []);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await api.put(`/users/${userId}`, formData);
      toast.success('Utilisateur mis à jour avec succès');
      router.push('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/users"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Éditer l'utilisateur</h1>
            <p className="text-gray-600 mt-1">Modifier les informations de l'utilisateur</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres du compte</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rôle *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <Link
                  href="/admin/users"
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Date de création</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dernière connexion</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Jamais'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
              <FiShoppingCart className="w-5 h-5 text-gray-400" />
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune commande</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {order.order_number}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {order.total.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Activité</h3>
              <FiActivity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Compte créé</p>
                  <p className="text-xs text-gray-500">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                  </p>
                </div>
              </div>
              {user?.last_login && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Dernière connexion</p>
                    <p className="text-xs text-gray-500">
                      {new Date(user.last_login).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}