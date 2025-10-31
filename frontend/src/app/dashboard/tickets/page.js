'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiLifeBuoy, FiEye, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0,
    high_priority: 0
  });

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.tickets.getAll();
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.tickets.getStats();
      setStats(response.data || {
        total: 0,
        open: 0,
        closed: 0,
        high_priority: 0
      });
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open':
        return 'Ouvert';
      case 'in_progress':
        return 'En cours';
      case 'resolved':
        return 'Résolu';
      case 'closed':
        return 'Fermé';
      default:
        return 'Inconnu';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'low':
        return 'Basse';
      case 'medium':
        return 'Moyenne';
      case 'high':
        return 'Haute';
      default:
        return 'Inconnue';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support technique</h1>
          <p className="text-gray-600">Gérez vos demandes d'assistance</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/tickets/new')}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Nouveau ticket</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FiLifeBuoy className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total tickets</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.total}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <FiClock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.open}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Haute priorité</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.high_priority}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Résolus</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.closed}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre ou numéro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pl-10"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input pl-10"
            >
              <option value="all">Toutes les priorités</option>
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-32"></div>
            </div>
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="card text-center py-12">
          <FiLifeBuoy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun ticket trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Essayez de modifier vos filtres'
              : 'Vous n\'avez pas encore créé de ticket de support'}
          </p>
          <button
            onClick={() => router.push('/dashboard/tickets/new')}
            className="btn btn-primary"
          >
            Créer un ticket
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Ticket Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      #{ticket.id} - {ticket.title}
                    </h3>
                    <span className={`badge ${getStatusColor(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </span>
                    <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityLabel(ticket.priority)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {ticket.description}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Créé le:</span>{' '}
                      {formatDate(ticket.created_at)}
                    </div>
                    <div>
                      <span className="font-medium">Dernière mise à jour:</span>{' '}
                      {formatDate(ticket.updated_at)}
                    </div>
                    <div>
                      <span className="font-medium">Catégorie:</span>{' '}
                      {ticket.category || 'Général'}
                    </div>
                    {ticket.response_count > 0 && (
                      <div className="text-primary">
                        <span className="font-medium">{ticket.response_count}</span> réponse(s)
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/tickets/${ticket.id}`);
                    }}
                    className="btn btn-outline flex items-center justify-center space-x-2"
                  >
                    <FiEye />
                    <span>Voir détails</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}