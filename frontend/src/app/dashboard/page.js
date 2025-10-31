'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiShoppingBag,
  FiMessageSquare,
  FiHelpCircle,
  FiDollarSign,
  FiTrendingUp,
  FiClock
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await api.orders.getAll({ limit: 5 });
      setRecentOrders(ordersResponse.data.orders || []);

      // Fetch tickets
      const ticketsResponse = await api.tickets.getAll({ limit: 5 });
      setRecentTickets(ticketsResponse.data.tickets || []);

      // Calculate stats
      const orders = ordersResponse.data.orders || [];
      const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const openTickets = (ticketsResponse.data.tickets || []).filter(t => t.status === 'open').length;

      setStats({
        totalOrders: orders.length,
        totalSpent,
        pendingOrders,
        openTickets
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FiShoppingBag,
      label: 'Commandes totales',
      value: stats?.totalOrders || 0,
      color: 'blue',
      link: '/dashboard/orders'
    },
    {
      icon: FiDollarSign,
      label: 'Total dépensé',
      value: formatCurrency(stats?.totalSpent || 0),
      color: 'green',
      link: '/dashboard/orders'
    },
    {
      icon: FiClock,
      label: 'Commandes en cours',
      value: stats?.pendingOrders || 0,
      color: 'yellow',
      link: '/dashboard/orders'
    },
    {
      icon: FiHelpCircle,
      label: 'Tickets ouverts',
      value: stats?.openTickets || 0,
      color: 'red',
      link: '/dashboard/tickets'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue, {user?.first_name} !
        </h1>
        <p className="text-gray-600">
          Voici un aperçu de votre activité
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-20"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              yellow: 'bg-yellow-100 text-yellow-600',
              red: 'bg-red-100 text-red-600'
            };

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(stat.link)}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <FiTrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Commandes récentes</h2>
          <button
            onClick={() => router.push('/dashboard/orders')}
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            Voir tout
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-20"></div>
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune commande pour le moment
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    N° Commande
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Montant
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Tickets */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tickets de support</h2>
          <button
            onClick={() => router.push('/dashboard/tickets')}
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            Voir tout
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-20"></div>
            ))}
          </div>
        ) : recentTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun ticket de support
          </div>
        ) : (
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {ticket.message}
                  </p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm text-gray-500">
                    {formatDate(ticket.created_at)}
                  </span>
                  <span className={`badge ${getStatusColor(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/shop')}
          className="card text-center hover:shadow-lg transition-shadow"
        >
          <FiShoppingBag className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">Parcourir la boutique</h3>
          <p className="text-sm text-gray-600">
            Découvrez nos produits et services
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/dashboard/tickets/new')}
          className="card text-center hover:shadow-lg transition-shadow"
        >
          <FiHelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">Créer un ticket</h3>
          <p className="text-sm text-gray-600">
            Besoin d'aide ? Contactez notre support
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/dashboard/messages')}
          className="card text-center hover:shadow-lg transition-shadow"
        >
          <FiMessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">Messagerie</h3>
          <p className="text-sm text-gray-600">
            Consultez vos messages
          </p>
        </motion.button>
      </div>
    </div>
  );
}