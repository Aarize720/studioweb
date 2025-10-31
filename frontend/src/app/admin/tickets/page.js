'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEye, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      
      const response = await api.get('/tickets', { params });
      setTickets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FiAlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <FiClock className="w-4 h-4" />;
      case 'resolved':
      case 'closed':
        return <FiCheckCircle className="w-4 h-4" />;
      default:
        return <FiAlertCircle className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des tickets</h1>
          <p className="text-gray-600 mt-1">{tickets.length} ticket(s)</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Toutes les priorités</option>
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
          </select>

          <button
            onClick={() => {
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sujet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">{ticket.message}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {ticket.user?.first_name} {ticket.user?.last_name}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority === 'low' ? 'Basse' : 
                     ticket.priority === 'medium' ? 'Moyenne' : 
                     ticket.priority === 'high' ? 'Haute' : 'Urgente'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    <span className="ml-1">
                      {ticket.status === 'open' ? 'Ouvert' : 
                       ticket.status === 'in_progress' ? 'En cours' : 
                       ticket.status === 'resolved' ? 'Résolu' : 'Fermé'}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/tickets/${ticket.id}`}
                    className="text-primary hover:text-primary-dark inline-flex items-center"
                  >
                    <FiEye className="w-4 h-4 mr-1" />
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}